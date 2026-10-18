/* Diisoo etape 5 (additif) : redirection WhatsApp sous-categorisee + point d'entree paiement carte.
   Numero officiel unique : +221768426961. Expose : window.DiisooWA */
(function () {
  "use strict";
  var CFG = {
    numero: "221768426961",
    cartesActives: false,   /* passer a true quand pay-init est deploye */
    endpoint: "",           /* ex : https://<projet>.supabase.co/functions/v1/pay-init */
    usdParEur: 1.1          /* indicatif d'affichage seulement */
  };
  var TAGS = ["PAIEMENT-LOCAL", "PAIEMENT-INTERNATIONAL", "EXAMENS-VISAS", "SUPPORT-TECH"];
  var XOF_PAR_EUR = 655.957; /* parite fixe du franc CFA */

  function ref() {
    try {
      var r = localStorage.getItem("diisoo_ref_wa");
      if (!r) { r = "DII-" + Math.random().toString(36).slice(2, 8).toUpperCase(); localStorage.setItem("diisoo_ref_wa", r); }
      return r;
    } catch (e) { return "DII-WEB"; }
  }
  function profil() { try { return (typeof getProfile === "function" && getProfile()) || {}; } catch (e) { return {}; } }
  function nom() { var p = profil(); return [p.first_name, p.last_name].filter(Boolean).join(" ").trim(); }

  /* La balise est toujours seule sur la 1re ligne : filtrage automatique cote WhatsApp Business */
  function lien(cat, lignes) {
    if (TAGS.indexOf(cat) < 0) throw new Error("Categorie WhatsApp inconnue : " + cat);
    var corps = ["[" + cat + "]"].concat(lignes.filter(Boolean)).join("\n");
    return "https://wa.me/" + CFG.numero + "?text=" + encodeURIComponent(corps);
  }
  function ouvrir(cat, lignes) { window.open(lien(cat, lignes), "_blank", "noopener"); }

  var lignesCommunes = function () { return [nom() ? "Nom : " + nom() : "", "Réf : " + ref()]; };

  var WA = {
    config: CFG,
    tags: TAGS,
    lien: lien,
    ouvrir: ouvrir,
    paiementLocal: function (o) {   /* o : {offre, prix, mode:"Wave"|"Orange Money"|"Free Money"} */
      o = o || {};
      ouvrir("PAIEMENT-LOCAL", ["Bonjour ABC-GLOBAL,", "Je souhaite activer : " + (o.offre || "offre Diisoo") + (o.prix ? " (" + o.prix + ")" : ""),
        o.mode ? "Paiement : " + o.mode : ""].concat(lignesCommunes(), ["Merci de m'envoyer les instructions de paiement."]));
    },
    paiementInternational: function (o) {
      o = o || {};
      ouvrir("PAIEMENT-INTERNATIONAL", ["Bonjour ABC-GLOBAL,", "J'ai besoin d'aide pour un paiement par carte bancaire.",
        o.offre ? "Offre : " + o.offre : "", o.probleme ? "Problème : " + o.probleme : ""].concat(lignesCommunes()));
    },
    examensVisas: function (o) {
      o = o || {};
      ouvrir("EXAMENS-VISAS", ["Bonjour ABC-GLOBAL,", "Ma question porte sur : " + (o.sujet || "examen / visa") + ".", o.details || ""].concat(lignesCommunes()));
    },
    supportTech: function (o) {
      o = o || {};
      ouvrir("SUPPORT-TECH", ["Bonjour ABC-GLOBAL,", "Problème technique : " + (o.probleme || "à préciser"),
        "Appareil : " + (navigator.userAgent || "").slice(0, 120), "Réseau : " + (navigator.onLine ? "en ligne" : "hors ligne"),
        "Mode : " + ((window.matchMedia && matchMedia("(display-mode: standalone)").matches) ? "application installée" : "navigateur")].concat(lignesCommunes()));
    },

    /* Multi-devises : encaissement toujours en FCFA, affichage indicatif EUR/USD hors Afrique */
    devise: function () {
      var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
      if (/^Europe\//.test(tz)) return "EUR";
      if (/^America\//.test(tz)) return "USD";
      return "XOF";
    },
    prix: function (xof, devise) {
      devise = devise || WA.devise();
      if (devise === "EUR") return "≈ " + (Math.ceil(xof / XOF_PAR_EUR * 100) / 100).toFixed(2).replace(".", ",") + " €";
      if (devise === "USD") return "≈ " + (Math.ceil(xof / XOF_PAR_EUR * CFG.usdParEur * 100) / 100).toFixed(2) + " $";
      return String(xof).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
    },

    /* Carte bancaire internationale : appelle la fonction serveur, sinon repli WhatsApp [PAIEMENT-INTERNATIONAL] */
    payerParCarte: async function (offreId, offreTitre) {
      if (!CFG.cartesActives || !CFG.endpoint) return WA.paiementInternational({ offre: offreTitre || offreId });
      try {
        var p = profil();
        var r = await fetch(CFG.endpoint, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offre: offreId, email: p.email || "", nom: nom(), ref: ref() }) });
        var d = await r.json();
        if (!r.ok || !d.url) throw new Error(d.erreur || "paiement indisponible");
        window.location.href = d.url;
      } catch (e) {
        console.error("[diisoo-wa]", e);
        WA.paiementInternational({ offre: offreTitre || offreId, probleme: "paiement en ligne indisponible" });
      }
    }
  };
  window.DiisooWA = WA;

  /* Boutons declaratifs : <button data-wa="EXAMENS-VISAS" data-wa-text="IELTS">...</button> */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-wa]");
    if (!b) return;
    e.preventDefault();
    var cat = b.getAttribute("data-wa"), t = b.getAttribute("data-wa-text") || "";
    if (cat === "PAIEMENT-LOCAL") WA.paiementLocal({ offre: t, mode: b.getAttribute("data-wa-mode") || "" });
    else if (cat === "PAIEMENT-INTERNATIONAL") WA.paiementInternational({ offre: t });
    else if (cat === "EXAMENS-VISAS") WA.examensVisas({ sujet: t });
    else if (cat === "SUPPORT-TECH") WA.supportTech({ probleme: t });
  });

  /* Branche les offres Premium deja presentes : numero unique + balise [PAIEMENT-LOCAL] */
  function brancherPremium() {
    try { if (typeof PREMIUM_CONFIG === "object" && PREMIUM_CONFIG) PREMIUM_CONFIG.whatsapp = CFG.numero; } catch (e) {}
    var orig = window.premiumMessage;
    if (typeof orig === "function" && !orig.__dii) {
      var f = function (o) { return "[PAIEMENT-LOCAL]\n" + orig(o) + "\nRéf : " + ref(); };
      f.__dii = true;
      window.premiumMessage = f;
    }
  }
  brancherPremium();
})();
