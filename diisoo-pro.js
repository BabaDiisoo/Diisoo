const _jouerVoixOrig = jouerVoix;
const _arreterVoixOrig = arreterVoix;
arreterVoix = function () {
  try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  return _arreterVoixOrig();
};
jouerVoix = async function (texte, langue, options) {
  if (langue !== "en") return _jouerVoixOrig(texte, langue, options);
  const o = options || {};
  const synth = window.speechSynthesis;
  if (!synth) throw new Error("synthese vocale indisponible");
  arreterVoix();
  const phrase = String(texte || "").replace(/\s+/g, " ").trim();
  if (!phrase) return true;
  return await new Promise((resolve, reject) => {
    const u = new SpeechSynthesisUtterance(phrase);
    u.lang = "en-US";
    u.rate = 0.9;
    const voices = synth.getVoices();
    const v = voices.find((x) => /^en[-_]US/i.test(x.lang)) || voices.find((x) => /^en/i.test(x.lang));
    if (v) u.voice = v;
    u.onstart = () => { if (o.onDebut) o.onDebut(); };
    u.onend = () => resolve(true);
    u.onerror = (e) => (e.error === "canceled" || e.error === "interrupted") ? resolve(false) : reject(new Error("voix " + e.error));
    synth.speak(u);
  });
};
genererOolel = async function (texte) {
  const rep = await avecDelai(sb.functions.invoke("smart-handler", { body: { texte, lang: "wo" } }), 12e4, "voix wolof");
  if (rep.error) throw rep.error;
  if (!rep.data || !rep.data.audio_base64) throw new Error("reponse vocale vide");
  return depaqueter(rep.data.audio_base64, rep.data.mime);
};
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const CONFIG = {
  SUPABASE_URL: "https://jkwtyoefqvafnlqkhium.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable__lzrlmMaJdFC_kav6DkfEA_UbH6DiTC"
};
const SW_URL = "./sw.js";
const sb = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
const QUOTA_GRATUIT = { local: 100, etranger: 15 };
const MAX_B64 = 6e5;
const etat = { user: null, profil: null, segment: "local" };
const DELAI_RESEAU = 15e3;
function avecDelai(p, ms, nom) {
  let t;
  const limite = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error("delai depasse : " + (nom || "operation"))), ms);
  });
  return Promise.race([Promise.resolve(p), limite]).finally(() => clearTimeout(t));
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms || 0));
function sansErreur(reponse) {
  if (reponse && reponse.error) throw reponse.error;
  return reponse ? reponse.data : null;
}
function message(texte) {
  let el = document.getElementById("diisoo-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "diisoo-toast";
    el.setAttribute("role", "status");
    el.style.cssText = "position:fixed;left:12px;right:12px;bottom:16px;z-index:99999;background:#1f2933;color:#fff;padding:12px 14px;border-radius:10px;font:15px/1.4 system-ui,sans-serif;text-align:center;display:none";
    document.body.appendChild(el);
  }
  el.textContent = texte;
  el.style.display = "block";
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.style.display = "none";
  }, 4500);
}
function detecterSegment() {
  const lang = (navigator.language || "fr").toLowerCase();
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (e) {
  }
  const diaspora = /^(Europe|America|Asia|Australia)\//.test(tz);
  const francophone = lang.startsWith("fr") || lang.startsWith("wo");
  return francophone && !diaspora ? "local" : "etranger";
}
const CAP_ATTENTE = 1e5;
const res = { attVoix: 0, attCredits: 0, localVoix: 0 };
function entier(v) {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? Math.min(n, CAP_ATTENTE) : 0;
}
const cleReservoir = () => "diisoo_reservoir_v3_" + (etat.user ? etat.user.id : "anon");
function relireReservoir() {
  try {
    const brut = localStorage.getItem(cleReservoir());
    if (!brut) return;
    const r = JSON.parse(brut);
    if (r && r.v === 3) {
      res.attVoix = entier(r.attVoix);
      res.attCredits = entier(r.attCredits);
      res.localVoix = entier(r.localVoix);
    }
  } catch (e) {
  }
}
function persisterReservoir() {
  try {
    localStorage.setItem(cleReservoir(), JSON.stringify({
      v: 3,
      attVoix: res.attVoix,
      attCredits: res.attCredits,
      localVoix: res.localVoix
    }));
  } catch (e) {
  }
}
window.addEventListener("storage", (e) => {
  if (e.key === cleReservoir()) relireReservoir();
});
const estPremium = () => !!(etat.profil && etat.profil.est_premium);
const voixUtilisees = () => etat.user && etat.profil ? etat.profil.compteur_voix + res.attVoix : res.localVoix;
const creditsRestants = () => etat.user && etat.profil ? Math.max(0, etat.profil.credits_voix - res.attCredits) : 0;
function peutEcouter() {
  return estPremium() || voixUtilisees() < QUOTA_GRATUIT[etat.segment] || creditsRestants() > 0;
}
function consommerEcoute() {
  if (estPremium()) return;
  relireReservoir();
  if (voixUtilisees() < QUOTA_GRATUIT[etat.segment]) {
    if (etat.user && etat.profil) res.attVoix++;
    else res.localVoix++;
  } else if (creditsRestants() > 0) {
    res.attCredits++;
  }
  persisterReservoir();
  if (etat.user && etat.profil) planifierSync();
}
let minuteurSync = null;
let syncEnCours = false;
let echecsSync = 0;
function planifierSync(delai) {
  clearTimeout(minuteurSync);
  const d = delai !== void 0 ? delai : Math.min(5e3 * Math.pow(2, echecsSync), 6e4);
  minuteurSync = setTimeout(syncServeur, d);
}
async function syncServeur() {
  if (!etat.user || !etat.profil || syncEnCours) return;
  syncEnCours = true;
  try {
    relireReservoir();
    if (res.attVoix > 0) {
      const n = Math.min(res.attVoix, 50);
      sansErreur(await avecDelai(sb.rpc("incrementer_voix", { p_n: n }), DELAI_RESEAU, "voix"));
      res.attVoix -= n;
      etat.profil.compteur_voix += n;
      persisterReservoir();
    }
    if (res.attCredits > 0) {
      const n = Math.min(res.attCredits, 500);
      sansErreur(await avecDelai(sb.rpc("consommer_credits", { p_n: n }), DELAI_RESEAU, "credits"));
      res.attCredits -= n;
      etat.profil.credits_voix = Math.max(0, etat.profil.credits_voix - n);
      persisterReservoir();
    }
    echecsSync = 0;
    if (res.attVoix > 0 || res.attCredits > 0) planifierSync(1e3);
  } catch (e) {
    echecsSync = Math.min(echecsSync + 1, 4);
    console.error(e.message);
    planifierSync();
  } finally {
    syncEnCours = false;
  }
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") syncServeur();
  else relireReservoir();
});
window.addEventListener("pagehide", () => {
  persisterReservoir();
  syncServeur();
});
async function rafraichirProfil() {
  if (!etat.user) return null;
  try {
    const data = sansErreur(
      await avecDelai(
        sb.from("diisoo_profiles").select("est_premium, compteur_voix, credits_voix, points_xp, serie_jours").single(),
        DELAI_RESEAU,
        "profil"
      )
    );
    etat.profil = data;
    return data;
  } catch (e) {
    console.error(e.message);
    return null;
  }
}
async function chargerSession() {
  try {
    const rep = await avecDelai(sb.auth.getSession(), DELAI_RESEAU, "session");
    const user = rep && rep.data && rep.data.session ? rep.data.session.user : null;
    if (!user || !etat.user || etat.user.id !== user.id) {
      res.attVoix = 0;
      res.attCredits = 0;
      res.localVoix = 0;
      etat.profil = null;
    }
    etat.user = user;
    relireReservoir();
    if (user) await rafraichirProfil();
  } catch (e) {
    console.error(e.message);
  }
  return !!etat.user;
}
let dialogueEnCours = null;
async function demanderCode(profil) {
  const p = profil || {};
  const email = String(p.email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Adresse e-mail invalide.");
  const data = {};
  if (p.prenom) data.prenom = String(p.prenom).trim();
  if (p.nom) data.nom = String(p.nom).trim();
  if (p.alertes && p.whatsapp) {
    data.whatsapp = String(p.whatsapp).trim();
    data.alertes_whatsapp = true;
  }
  const rep = await avecDelai(sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true, data } }), DELAI_RESEAU, "envoi du code");
  if (rep.error) throw rep.error;
  return true;
}
async function enregistrerIdentite(p) {
  try {
    sansErreur(await avecDelai(sb.rpc("maj_profil_identite", {
      p_prenom: p.prenom || null,
      p_nom: p.nom || null,
      p_whatsapp: p.alertes && p.whatsapp ? p.whatsapp : null,
      p_alertes: !!(p.alertes && p.whatsapp)
    }), DELAI_RESEAU, "identite"));
  } catch (error) {
    console.error("Erreur Audio Diisoo :", error);
  }
}
async function verifierCode(email, code, profil) {
  const rep = await avecDelai(
    sb.auth.verifyOtp({ email: String(email || "").trim().toLowerCase(), token: String(code || "").trim(), type: "email" }),
    DELAI_RESEAU,
    "verification du code"
  );
  if (rep.error) throw rep.error;
  await chargerSession();
  if (profil && etat.user) await enregistrerIdentite(profil);
  return !!etat.user;
}
function ouvrirConnexion(prefill) {
  if (dialogueEnCours) return dialogueEnCours;
  dialogueEnCours = new Promise((resolve) => {
    const fond = document.createElement("div");
    fond.style.cssText = "position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:16px";
    const boite = document.createElement("div");
    boite.setAttribute("role", "dialog");
    boite.setAttribute("aria-label", "Connexion");
    boite.style.cssText = "background:#121212;color:#f4f1ec;border:1px solid #2e2e32;width:100%;max-width:360px;border-radius:16px;padding:18px;font:16px/1.4 system-ui,sans-serif";
    const titre = document.createElement("h3");
    titre.textContent = "Connexion \xE0 Diisoo";
    titre.style.cssText = "margin:0 0 12px;font-size:18px;color:#F3A94E";
    const champ = (type, placeholder, auto) => {
      const i = document.createElement("input");
      i.type = type;
      i.placeholder = placeholder;
      i.autocomplete = auto;
      i.style.cssText = "width:100%;box-sizing:border-box;padding:11px;margin:0 0 10px;border:1px solid #2e2e32;border-radius:10px;font-size:16px;background:#1c1c1e;color:#f4f1ec";
      return i;
    };
    const bouton = (texte, principal) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = texte;
      b.style.cssText = "width:100%;padding:12px;margin:0 0 8px;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;border:1px solid #2e2e32;" + (principal ? "background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;border-color:transparent" : "background:transparent;color:#a8a39a");
      return b;
    };
    const prenom = champ("text", "Pr\xE9nom", "given-name");
    const nom = champ("text", "Nom", "family-name");
    const email = champ("email", "Adresse e-mail", "email");
    const caseWa = document.createElement("label");
    caseWa.style.cssText = "display:flex;gap:8px;align-items:flex-start;font-size:13px;color:#a8a39a;margin:0 0 10px";
    const coche = document.createElement("input");
    coche.type = "checkbox";
    const txtWa = document.createElement("span");
    txtWa.textContent = "Je souhaite recevoir mes alertes de r\xE9vision quotidiennes sur WhatsApp";
    caseWa.append(coche, txtWa);
    const wa = champ("tel", "Num\xE9ro WhatsApp (ex : 70 123 45 67)", "tel");
    wa.style.display = "none";
    coche.addEventListener("change", () => {
      wa.style.display = coche.checked ? "block" : "none";
    });
    const code = champ("text", "Code re\xE7u par e-mail", "one-time-code");
    code.inputMode = "numeric";
    code.style.display = "none";
    const bEnvoyer = bouton("Recevoir mon code", true);
    const bValider = bouton("Valider le code", true);
    bValider.style.display = "none";
    const bBascule = bouton("J'ai d\xE9j\xE0 un compte (e-mail seulement)", false);
    const bFermer = bouton("Annuler", false);
    const info = document.createElement("div");
    info.style.cssText = "min-height:20px;margin:4px 0 8px;font-size:14px;color:#ff6b6b";
    info.setAttribute("role", "alert");
    let retour = false;
    let occupe = false;
    function basculer() {
      retour = !retour;
      prenom.style.display = retour ? "none" : "block";
      nom.style.display = retour ? "none" : "block";
      caseWa.style.display = retour ? "none" : "flex";
      if (retour) wa.style.display = "none";
      else wa.style.display = coche.checked ? "block" : "none";
      bBascule.textContent = retour ? "Cr\xE9er mon profil" : "J'ai d\xE9j\xE0 un compte (e-mail seulement)";
    }
    function profil() {
      return { prenom: prenom.value, nom: nom.value, email: email.value, alertes: coche.checked, whatsapp: wa.value };
    }
    async function envoyer() {
      if (occupe) return;
      const p = profil();
      if (!retour && (!p.prenom.trim() || !p.nom.trim())) {
        info.style.color = "#ff6b6b";
        info.textContent = "Pr\xE9nom et nom requis.";
        return;
      }
      if (!retour && p.alertes && !p.whatsapp.trim()) {
        info.style.color = "#ff6b6b";
        info.textContent = "Num\xE9ro WhatsApp requis pour les alertes.";
        return;
      }
      occupe = true;
      info.style.color = "#a8a39a";
      info.textContent = "Envoi du code\u2026";
      try {
        await demanderCode(retour ? { email: p.email } : p);
        info.style.color = "#4cc38a";
        info.textContent = "Code envoy\xE9. Regarde ta bo\xEEte mail (et les spams).";
        [prenom, nom, caseWa, wa, bEnvoyer, bBascule, email].forEach((x) => {
          x.style.display = "none";
        });
        code.style.display = "block";
        bValider.style.display = "block";
        code.focus();
      } catch (error) {
        console.error("Erreur Audio Diisoo :", error);
        info.style.color = "#ff6b6b";
        info.textContent = error.message || "Envoi impossible.";
      } finally {
        occupe = false;
      }
    }
    async function valider() {
      if (occupe) return;
      occupe = true;
      info.style.color = "#a8a39a";
      info.textContent = "V\xE9rification\u2026";
      try {
        const ok = await verifierCode(email.value, code.value, retour ? null : profil());
        if (!ok) throw new Error("Code incorrect.");
        fond.remove();
        resolve(true);
      } catch (error) {
        console.error("Erreur Audio Diisoo :", error);
        info.style.color = "#ff6b6b";
        info.textContent = error.message || "Code incorrect.";
      } finally {
        occupe = false;
      }
    }
    bEnvoyer.addEventListener("click", envoyer);
    bValider.addEventListener("click", valider);
    bBascule.addEventListener("click", basculer);
    bFermer.addEventListener("click", () => {
      fond.remove();
      resolve(false);
    });
    code.addEventListener("keydown", (e) => {
      if (e.key === "Enter") valider();
    });
    if (prefill) {
      prenom.value = prefill.prenom || "";
      nom.value = prefill.nom || "";
      email.value = prefill.email || "";
    }
    boite.append(titre, prenom, nom, email, caseWa, wa, code, info, bEnvoyer, bValider, bBascule, bFermer);
    fond.appendChild(boite);
    document.body.appendChild(fond);
    (email.value ? prenom : email).focus();
  }).finally(() => {
    dialogueEnCours = null;
  });
  return dialogueEnCours;
}
async function assurerConnexion() {
  if (etat.user && etat.profil) return true;
  if (!etat.user) {
    const ok = await ouvrirConnexion();
    if (!ok) return false;
  }
  if (!etat.profil) await rafraichirProfil();
  return !!etat.profil;
}
async function top5(listeEl) {
  try {
    const data = sansErreur(await avecDelai(sb.rpc("top5_xp"), DELAI_RESEAU, "classement")) || [];
    if (listeEl) {
      listeEl.textContent = "";
      data.forEach((u, i) => {
        const li = document.createElement("li");
        li.textContent = i + 1 + ". " + u.pseudo + " : " + u.points_xp + " XP";
        listeEl.appendChild(li);
      });
    }
    return data;
  } catch (e) {
    console.error(e.message);
    return [];
  }
}
let achatEnCours = false;
async function acheter(type) {
  if (achatEnCours) return;
  if (type !== "premium" && type !== "recharge") return;
  achatEnCours = true;
  let fenetre = null;
  try {
    if (!await assurerConnexion()) return;
    fenetre = window.open("about:blank", "_blank");
    const rep = await avecDelai(sb.functions.invoke("paytech-creer", { body: { type } }), 25e3, "paiement");
    if (rep.error || !rep.data || !rep.data.url) throw rep.error || new Error("adresse de paiement absente");
    if (fenetre) {
      fenetre.opener = null;
      fenetre.location.href = rep.data.url;
    } else window.open(rep.data.url, "_blank");
  } catch (e) {
    console.error(e.message);
    if (fenetre) {
      try {
        fenetre.close();
      } catch (e2) {
      }
    }
    message("Paiement indisponible. R\xE9essaie dans un instant.");
  } finally {
    achatEnCours = false;
  }
}
async function gererRetourPaiement() {
  const retour = new URLSearchParams(location.search).get("paiement");
  if (!retour) return;
  history.replaceState(null, "", location.pathname);
  if (retour === "annule") {
    message("Paiement annul\xE9.");
    return;
  }
  if (!etat.user) return;
  message("V\xE9rification du paiement...");
  const avant = etat.profil ? { p: etat.profil.est_premium, c: etat.profil.credits_voix } : { p: false, c: 0 };
  for (let i = 0; i < 8; i++) {
    const profil = await rafraichirProfil();
    if (profil && (profil.est_premium !== avant.p || profil.credits_voix !== avant.c)) {
      message("Paiement confirm\xE9. Merci !");
      return;
    }
    await pause(3e3);
  }
  message("Paiement en cours de confirmation. Reviens dans quelques minutes.");
}
const DICO_BASE = {
  salamalekum: "asalaa maalekum",
  salamaleykum: "asalaa maalekum",
  malekum: "maalekum",
  mangi: "maa ngi",
  yaangi: "yaa ngi",
  jamm: "j\xE0mm",
  yalla: "y\xE0lla",
  jerejeef: "j\xEBr\xEBj\xEBf",
  dedet: "d\xE9ed\xE9et",
  deedet: "d\xE9ed\xE9et",
  ndeysan: "ndeysaan",
  teranga: "teraanga",
  benen: "beneen",
  gor: "goor",
  jigeen: "jig\xE9en",
  toubab: "tubaab",
  bes: "b\xE9s",
  demb: "d\xE9mb",
  elleg: "\xEBll\xEBg",
  legi: "l\xE9egi",
  jaykat: "jaaykat",
  jend: "j\xEBnd",
  xalis: "xaalis",
  njeg: "nj\xEBg",
  gaw: "gaaw",
  tuti: "tuuti",
  wanni: "w\xE0\xF1\xF1i",
  wani: "w\xE0\xF1\xF1i",
  waxtan: "waxtaan",
  laj: "laaj",
  liggey: "ligg\xE9ey",
  ligey: "ligg\xE9ey",
  genne: "g\xE9nne",
  yon: "yoon",
  jang: "j\xE0ng",
  naar: "\xF1aar",
  nett: "\xF1ett",
  nent: "\xF1ent",
  "\xF1ata": "\xF1aata",
  nyata: "\xF1aata",
  juroom: "jur\xF3om",
  temeer: "t\xE9em\xE9er",
  teemeer: "t\xE9em\xE9er",
  juni: "junni"
};
const DICO_WOLOF = {
  jerejef: "j\xEBr\xEBj\xEBf",
  waw: "waaw",
  deedeet: "d\xE9ed\xE9et",
  bax: "baax",
  "asalamu alaykum": "asalaamu alaykum",
  "malekum salam": "maalekum salaam",
  "nanga def": "naka nga def",
  "mangi fi rekk": "maangi fi rekk",
  "alhamdoulilah": "alhamdulillaah",
  "niata la": "\xF1aata la",
  "wanni ko": "w\xE0\xF1\xF1i ko",
  "seer na": "seer na",
  "jaay ma": "jaay ma",
  "amul weco": "amul weccu",
  "jox ma weco": "jox ma weccu",
  "borom bitik": "borom bitik",
  "waxal d\xEBgg": "waxal d\xEBgg",
  goro: "goro",
  ndaje: "ndaje",
  simis: "simis",
  fukkni: "fukkni",
  junni: "junni",
  konteener: "konteener",
  doan: "duwaan",
  masiin: "masiin",
  gari: "gari",
  watur: "woto",
  koran: "kura\u014B",
  garansi: "garansi",
  seekal: "seekal",
  natt: "natt",
  firi: "firi",
  bagas: "bagas",
  egsi: "egsi",
  sinuwaa: "sinuwaa",
  metar: "metar",
  kib: "kib",
  gaal: "gaal",
  depoo: "depoo",
  kwibar: "kwibar",
  disonkter: "diso\u014Bteer",
  kabalu: "kabalu",
  pies: "piis",
  imite: "imite",
  pomp: "pomp",
  ndox: "ndox",
  r\u00EBkk: "rekk",
  kuman: "kuman",
  tey: "tey",
  bank: "ba\u014Bk",
  baram: "baram"
};
const DICO = new Map(
  Object.entries(Object.assign({}, DICO_BASE, DICO_WOLOF)).map(([k, v]) => [k.toLowerCase(), v])
);
const RE_DICO = (function() {
  const cles = Array.from(DICO.keys()).sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp("(^|[^\\p{L}\\p{N}])(" + cles.join("|") + ")(?![\\p{L}\\p{N}])", "giu");
})();
function normaliserWolof(texte) {
  return texte.replace(RE_DICO, function(m, avant, mot) {
    const v = DICO.get(mot.toLowerCase());
    return avant + (v !== void 0 ? v : mot);
  });
}
function chunkWolofText(texte, max) {
  const limite = max || 500;
  let reste = normaliserWolof(texte).replace(/\s+/g, " ").trim();
  const morceaux = [];
  while (reste.length > limite) {
    const fenetre = reste.slice(0, limite);
    let i = Math.max(fenetre.lastIndexOf("."), fenetre.lastIndexOf(";"), fenetre.lastIndexOf(","));
    if (i < 1) i = fenetre.lastIndexOf(" ");
    if (i < 1) i = limite - 1;
    morceaux.push(reste.slice(0, i + 1).trim());
    reste = reste.slice(i + 1).trim();
  }
  if (reste) morceaux.push(reste);
  return morceaux;
}
const DOSSIER_AUDIO = { wo: "audio/wolof/", en: "audio/en/" };
const DELAI_SECOURS = 3e3;
const CLIENT_URL = "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";
const SPACE_OOLEL = "soynade-research/Oolel-Voices-Demo";
const ENDPOINT_OOLEL = "/generate_tts_audio";
async function hashTexte(t) {
  if (!window.crypto || !crypto.subtle) return null;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
let promesseIDB = null;
function ouvrirIDB() {
  if (!("indexedDB" in window)) return Promise.resolve(null);
  if (!promesseIDB) {
    promesseIDB = new Promise((resolve) => {
      try {
        const rq = indexedDB.open("DiisooStore", 1);
        rq.onupgradeneeded = () => {
          if (!rq.result.objectStoreNames.contains("audio_cache")) rq.result.createObjectStore("audio_cache", { keyPath: "hash" });
        };
        rq.onsuccess = () => resolve(rq.result);
        rq.onerror = () => resolve(null);
        rq.onblocked = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }
  return promesseIDB;
}
async function idbGet(hash) {
  const base = await ouvrirIDB();
  if (!base) return null;
  return new Promise((resolve) => {
    try {
      const rq = base.transaction("audio_cache", "readonly").objectStore("audio_cache").get(hash);
      rq.onsuccess = () => resolve(rq.result || null);
      rq.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}
async function idbPut(hash, donnees2) {
  const base = await ouvrirIDB();
  if (!base) return;
  await new Promise((resolve) => {
    try {
      const tx = base.transaction("audio_cache", "readwrite");
      tx.objectStore("audio_cache").put({ hash, data: donnees2.data, mime: donnees2.mime, taille: donnees2.data.byteLength, date: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch (e) {
      resolve();
    }
  });
}
async function donneesDeIDB(rec) {
  if (rec.data) return { data: rec.data, mime: rec.mime || "audio/wav" };
  if (rec.blob) return { data: await rec.blob.arrayBuffer(), mime: rec.mime || rec.blob.type || "audio/wav" };
  return null;
}
async function fluxGzip(octets, Ctor) {
  const f = new Ctor("gzip");
  const w = f.writable.getWriter();
  w.write(octets);
  w.close();
  return new Uint8Array(await new Response(f.readable).arrayBuffer());
}
function versBase64(octets) {
  let s = "";
  const pas = 32768;
  for (let i = 0; i < octets.length; i += pas) s += String.fromCharCode.apply(null, octets.subarray(i, i + pas));
  return btoa(s);
}
function depuisBase64(b64) {
  const s = atob(b64);
  const u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return u;
}
async function empaqueter(donnees2) {
  const brut = new Uint8Array(donnees2.data);
  let octets = brut;
  let mime = donnees2.mime;
  if (typeof CompressionStream === "function") {
    try {
      const gz = await fluxGzip(brut, CompressionStream);
      if (gz.length < brut.length * 0.95) {
        octets = gz;
        mime = donnees2.mime + "+gzip";
      }
    } catch (e) {
      console.error("Erreur Audio Diisoo :", e);
    }
  }
  return { base64: versBase64(octets), mime };
}
async function depaqueter(b64, mime) {
  let octets = depuisBase64(b64);
  let type = String(mime || "audio/wav");
  if (/\+gzip$/.test(type)) {
    octets = await fluxGzip(octets, DecompressionStream);
    type = type.replace(/\+gzip$/, "");
  }
  return { data: octets.buffer.slice(octets.byteOffset, octets.byteOffset + octets.byteLength), mime: type };
}
async function lireCache(hash) {
  try {
    const data = sansErreur(
      await avecDelai(sb.from("diisoo_lecons").select("audio_base64, mime").eq("hash", hash).maybeSingle(), 8e3, "cache serveur")
    );
    if (!data || !data.audio_base64) return null;
    return await depaqueter(data.audio_base64, data.mime);
  } catch (error) {
    console.error("Erreur Audio Diisoo :", error);
    return null;
  }
}
function ecrireCache(cle, donnees2) {
  empaqueter(donnees2).then((p) => {
    if (p.base64.length > MAX_B64) {
      console.warn("Audio garde en local seulement (trop gros pour le cache serveur)");
      return null;
    }
    return avecDelai(sb.rpc("enregistrer_lecon", { p_texte: cle, p_audio: p.base64, p_mime: p.mime }), DELAI_RESEAU, "ecriture cache");
  }).then((rep) => {
    if (rep && rep.error) console.error("Erreur Audio Diisoo :", rep.error);
  }).catch((error) => console.error("Erreur Audio Diisoo :", error));
}
let promesseClient = null;
function clientOolel() {
  if (!promesseClient) {
    promesseClient = (async () => {
      const mod = await avecDelai(import(CLIENT_URL), 3e4, "import gradio");
      if (!mod.Client) throw new Error("Client Gradio absent");
      return avecDelai(mod.Client.connect(SPACE_OOLEL, { events: ["data", "status"] }), 12e4, "connexion voix");
    })().catch((e) => {
      promesseClient = null;
      throw e;
    });
  }
  return promesseClient;
}
async function genererOolel(texte) {
  const client = await clientOolel();
  const flux = client.submit(ENDPOINT_OOLEL, {
    text_input: texte,
    exaggeration_input: 0.3,
    temperature_input: 0.2,
    seed_num_input: 0,
    cfgw_input: 0.5
  });
  let sortie = null;
  for await (const ev of flux) {
    if (ev.type === "status") {
      if (ev.stage === "error" || ev.status === "error") throw new Error(ev.message || "erreur du Space (quota ou Space endormi)");
    } else if (ev.type === "data") sortie = ev.data;
  }
  const p = Array.isArray(sortie) ? sortie[0] : sortie;
  const url = p && (typeof p === "string" ? p : p.url || p.path);
  if (!url || !/^https:\/\//i.test(url)) throw new Error("reponse du Space sans audio");
  const rep = await avecDelai(fetch(url), 6e4, "telechargement audio");
  if (!rep.ok) throw new Error("audio HTTP " + rep.status);
  const blob = await rep.blob();
  if (!blob.size) throw new Error("audio vide");
  return { data: await blob.arrayBuffer(), mime: blob.type || "audio/wav" };
}
async function genererAnglais(texte, voixNom) {
  const rep = await avecDelai(sb.functions.invoke("tts-anglais", { body: { texte, voix: voixNom } }), 6e4, "voix anglaise");
  if (rep.error) throw rep.error;
  if (!rep.data || !rep.data.audio_base64) throw new Error("reponse vocale vide");
  return depaqueter(rep.data.audio_base64, rep.data.mime);
}
function slugAudio(t) {
  return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
function cheminSecours(t, langue) {
  const s = slugAudio(t);
  return s ? DOSSIER_AUDIO[langue] + s + ".mp3" : null;
}
let ctxAudio = null;
function contexteAudio() {
  if (!ctxAudio) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error("AudioContext indisponible");
    ctxAudio = new AC();
  }
  if (ctxAudio.state === "suspended") ctxAudio.resume().catch(() => {
  });
  return ctxAudio;
}
function debloquerAudio() {
  try {
    const c = contexteAudio();
    const s = c.createBufferSource();
    s.buffer = c.createBuffer(1, 1, 22050);
    s.connect(c.destination);
    s.start(0);
  } catch (error) {
    console.error("Erreur Audio Diisoo :", error);
  }
}
function decoder(ab) {
  const c = contexteAudio();
  return new Promise((res2, rej) => {
    const p = c.decodeAudioData(ab, res2, rej);
    if (p && p.then) p.then(res2, rej);
  });
}
const tamponsRAM = /* @__PURE__ */ new Map();
const enPreparation = /* @__PURE__ */ new Map();
function texteCle(texte, langue, voixNom) {
  return langue === "en" ? "[en:" + voixNom + "] " + texte : texte;
}
function morceauxPour(texte, langue) {
  if (langue === "wo") return chunkWolofText(String(texte || ""));
  const t = String(texte || "").replace(/\s+/g, " ").trim().slice(0, 300);
  return t ? [t] : [];
}
async function obtenirDonnees(cle, hash, langue, texte, voixNom) {
  const rec = hash ? await idbGet(hash) : null;
  if (rec) {
    const d = await donneesDeIDB(rec);
    if (d) return d;
  }
  const serveur = hash ? await lireCache(hash) : null;
  if (serveur) {
    if (hash) idbPut(hash, serveur);
    return serveur;
  }
  const gen = langue === "wo" ? await genererOolel(texte) : await genererAnglais(texte, voixNom);
  if (hash) idbPut(hash, gen);
  if (langue === "wo") ecrireCache(cle, gen);
  return gen;
}
async function bufferDeSecours(chemin) {
  const rep = await fetch(chemin);
  if (!rep.ok) throw new Error("audio local introuvable (HTTP " + rep.status + ")");
  const ab = await rep.arrayBuffer();
  if (!ab.byteLength) throw new Error("audio local vide");
  return decoder(ab);
}
async function avecSecours(principal, chemin) {
  let lent = false;
  const r = await Promise.race([
    principal,
    new Promise((res2) => setTimeout(() => {
      lent = true;
      res2(null);
    }, DELAI_SECOURS))
  ]).catch((error) => {
    console.error("Erreur Audio Diisoo :", error);
    lent = true;
    return null;
  });
  if (r) return r;
  if (lent) {
    console.error("Erreur Audio Diisoo :", new Error("voix en ligne trop lente ou en echec, lecture locale"));
    try {
      const b = await bufferDeSecours(chemin);
      principal.catch(() => {
      });
      return b;
    } catch (error) {
      console.error("Erreur Audio Diisoo :", error);
    }
  }
  return principal;
}
function preparerUn(cle, langue, texte, voixNom, texteChemin) {
  if (tamponsRAM.has(cle)) return Promise.resolve(tamponsRAM.get(cle));
  if (enPreparation.has(cle)) return enPreparation.get(cle);
  const principal = (async () => {
    const hash = await hashTexte(cle);
    const d = await obtenirDonnees(cle, hash, langue, texte, voixNom);
    const buf = await decoder(d.data.slice(0));
    tamponsRAM.set(cle, buf);
    return buf;
  })();
  const chemin = cheminSecours(texteChemin, langue);
  const travail = (chemin ? avecSecours(principal, chemin) : principal).finally(() => enPreparation.delete(cle));
  enPreparation.set(cle, travail);
  return travail;
}
function preparerListe(texte, langue, voixNom) {
  const morceaux = morceauxPour(texte, langue);
  return Promise.all(morceaux.map((m) => preparerUn(texteCle(m, langue, voixNom), langue, m, voixNom, morceaux.length === 1 ? texte : m)));
}
function tamponsPrets(texte, langue, voixNom) {
  const morceaux = morceauxPour(texte, langue);
  if (!morceaux.length) return null;
  const liste = morceaux.map((m) => tamponsRAM.get(texteCle(m, langue, voixNom)));
  return liste.every(Boolean) ? liste : null;
}
let jetonVoix = 0;
let lecture = null;
function arreterVoix() {
  jetonVoix++;
  const l = lecture;
  lecture = null;
  if (l) {
    l.s.onended = null;
    try {
      l.s.stop();
    } catch (e) {
    }
    l.fin(false);
  }
}
function jouerBuffer(buf, jeton) {
  return new Promise((res2) => {
    if (jeton !== jetonVoix) {
      res2(false);
      return;
    }
    const c = contexteAudio();
    const s = c.createBufferSource();
    s.buffer = buf;
    s.connect(c.destination);
    lecture = { s, fin: res2 };
    s.onended = () => {
      if (lecture && lecture.s === s) lecture = null;
      res2(jeton === jetonVoix);
    };
    s.start(0);
  });
}
async function jouerVoix(texte, langue, options) {
  const o = options || {};
  const voixNom = o.voix || (langue === "en" ? "adam" : "");
  arreterVoix();
  const jeton = jetonVoix;
  try {
    let buffers = tamponsPrets(texte, langue, voixNom);
    if (!buffers) {
      if (o.onAttente) o.onAttente();
      buffers = await preparerListe(texte, langue, voixNom);
    }
    if (jeton !== jetonVoix) return false;
    if (o.onDebut) o.onDebut();
    for (const b of buffers) {
      if (!await jouerBuffer(b, jeton)) return false;
    }
    return true;
  } catch (error) {
    console.error("Erreur Audio Diisoo :", error);
    throw error;
  }
}
async function prechargerVoix(textes, langue, voixNom) {
  const nom = voixNom || (langue === "en" ? "adam" : "");
  const vus = /* @__PURE__ */ new Set();
  const items = [];
  for (const t of textes || []) {
    for (const m of morceauxPour(t, langue)) {
      const cle = texteCle(m, langue, nom);
      if (vus.has(cle) || tamponsRAM.has(cle)) continue;
      vus.add(cle);
      items.push({ cle, h: await hashTexte(cle) });
    }
  }
  const restants = [];
  for (const it of items) {
    const rec = it.h ? await idbGet(it.h) : null;
    const d = rec ? await donneesDeIDB(rec) : null;
    if (d) {
      try {
        tamponsRAM.set(it.cle, await decoder(d.data.slice(0)));
        continue;
      } catch (error) {
        console.error("Erreur Audio Diisoo :", error);
      }
    }
    restants.push(it);
  }
  for (let i = 0; i < restants.length; i += 40) {
    const lot = restants.slice(i, i + 40).filter((x) => x.h);
    if (!lot.length) continue;
    try {
      const rows = sansErreur(
        await avecDelai(sb.from("diisoo_lecons").select("hash, audio_base64, mime").in("hash", lot.map((x) => x.h)), 2e4, "prechargement")
      ) || [];
      for (const row of rows) {
        const it = lot.find((x) => x.h === row.hash);
        if (!it || !row.audio_base64) continue;
        const d = await depaqueter(row.audio_base64, row.mime);
        idbPut(it.h, d);
        tamponsRAM.set(it.cle, await decoder(d.data.slice(0)));
      }
    } catch (error) {
      console.error("Erreur Audio Diisoo :", error);
    }
  }
  return items.length;
}
const voix = {
  debloquer: debloquerAudio,
  arreter: arreterVoix,
  jouer: jouerVoix,
  preparer: preparerListe,
  precharger: prechargerVoix,
  pret: (texte, langue, voixNom) => !!tamponsPrets(texte, langue, voixNom || (langue === "en" ? "adam" : "")),
  chemin: cheminSecours
};
let lectureEnCours = false;
async function ecouter(texteWolof) {
  if (lectureEnCours) return "occupe";
  if (!texteWolof || !String(texteWolof).trim()) return "vide";
  lectureEnCours = true;
  try {
    if (!peutEcouter()) {
      message("Limite atteinte. Passe en Premium ou recharge tes \xE9coutes.");
      return "limite";
    }
    await jouerVoix(String(texteWolof), "wo", { onDebut: consommerEcoute });
    return "ok";
  } catch (error) {
    console.error("Erreur Audio Diisoo :", error);
    message("Voix indisponible pour le moment. R\xE9essaie plus tard.");
    return "erreur";
  } finally {
    lectureEnCours = false;
  }
}
const BASE_NIVEAUX = { "debutant": { "titre": "D\xE9butant", "rang": 1, "phrases": [{ "id": "maa-ngi-tudd", "en": "My name is...", "fr": "Je m'appelle...", "wo": "Maa ngi tudd ...", "theme": "general:intro" }, { "id": "senegaal-laa-joge", "en": "I am from Senegal", "fr": "Je viens du S\xE9n\xE9gal", "wo": "Senegaal laa j\xF3ge", "theme": "general:intro" }, { "id": "neex-na-ma-xam-la", "en": "Nice to meet you", "fr": "Enchant\xE9(e)", "wo": "Neex na ma xam la", "theme": "general:intro" }, { "id": "ndongo-laa", "en": "I am a student", "fr": "Je suis \xE9tudiant(e)", "wo": "Ndongo laa", "theme": "general:intro" }, { "id": "naata-at-nga-am", "en": "How old are you?", "fr": "Quel \xE2ge as-tu ?", "wo": "\xD1aata at nga am ?", "theme": "general:intro" }, { "id": "am-naa-fanweer-at", "en": "I am thirty years old", "fr": "J'ai trente ans", "wo": "Am naa fanweer at", "theme": "general:intro" }, { "id": "foo-dekk", "en": "Where do you live?", "fr": "O\xF9 habites-tu ?", "wo": "Foo d\xEBkk ?", "theme": "general:intro" }, { "id": "dama-dekk-thies", "en": "I live in Thi\xE8s", "fr": "J'habite \xE0 Thi\xE8s", "wo": "Dama d\xEBkk Thi\xE8s", "theme": "general:intro" }, { "id": "ban-liggeey-nga-def", "en": "What do you do for a living?", "fr": "Que fais-tu dans la vie ?", "wo": "Ban ligg\xE9ey nga def ?", "theme": "general:intro" }, { "id": "damay-wax-angale-ak-faranse", "en": "I speak English and French", "fr": "Je parle anglais et fran\xE7ais", "wo": "Damay wax angale ak fara\xF1se", "theme": "general:intro" }, { "id": "men-nga-wax-sa-tur-araf-ci-araf", "en": "Can you spell your name?", "fr": "Peux-tu \xE9peler ton nom ?", "wo": "M\xEBn nga wax sa tur araf ci araf ?", "theme": "general:intro" }, { "id": "f-a-t-o-u-araf-ci-araf", "en": "F-A-T-O-U", "fr": "F-A-T-O-U (\xE9pellation)", "wo": "F-A-T-O-U (araf ci araf)", "theme": "general:intro" }, { "id": "baana-baana-laa", "en": "I am a street vendor", "fr": "Je suis vendeur ambulant", "wo": "Baana-baana laa", "theme": "general:intro" }, { "id": "mbay-laa-def", "en": "I work in agriculture", "fr": "Je travaille dans l'agriculture", "wo": "Mbay laa def", "theme": "general:intro" }, { "id": "damay-yor-sama-njaay-bu-ndaw", "en": "I run my own small business", "fr": "Je dirige ma propre petite entreprise", "wo": "Damay yor sama njaay bu ndaw", "theme": "general:intro" }, { "id": "njabootu", "en": "Family", "fr": "Famille", "wo": "Njabootu", "theme": "general:family" }, { "id": "baay", "en": "Father", "fr": "P\xE8re", "wo": "Baay", "theme": "general:family" }, { "id": "yaay", "en": "Mother", "fr": "M\xE8re", "wo": "Yaay", "theme": "general:family" }, { "id": "mak-bu-goor-grand-frere-rak-bu-goor-petit-frere", "en": "Brother", "fr": "Fr\xE8re", "wo": "Mak bu g\xF3or (grand fr\xE8re) / Rak bu g\xF3or (petit fr\xE8re)", "theme": "general:family" }, { "id": "mak-bu-jigeen-grande-s-ur-rak-bu-jigeen-petite-s-ur", "en": "Sister", "fr": "S\u0153ur", "wo": "Mak bu jig\xE9en (grande s\u0153ur) / Rak bu jig\xE9en (petite s\u0153ur)", "theme": "general:family" }, { "id": "am-naa-nett-doom", "en": "I have three children", "fr": "J'ai trois enfants", "wo": "Am naa \xF1ett doom", "theme": "general:family" }, { "id": "sama-yaay-dafay-dekk-ak-nun", "en": "My mother lives with us", "fr": "Ma m\xE8re habite avec nous", "wo": "Sama yaay dafay d\xEBkk ak nun", "theme": "general:family" }, { "id": "danuy-lekk-and-ci-ngoon-bes-bu-nekk", "en": "We eat together every evening", "fr": "Nous mangeons ensemble chaque soir", "wo": "Danuy lekk \xE0nd ci ngoon, b\xE9s bu nekk", "theme": "general:family" }, { "id": "sama-baay-chauffeur-la", "en": "My father is a driver", "fr": "Mon p\xE8re est chauffeur", "wo": "Sama baay chauffeur la", "theme": "general:family" }, { "id": "dama-begg-sama-njabootu-lool", "en": "I love my family very much", "fr": "J'aime beaucoup ma famille", "wo": "Dama b\xEBgg sama njabootu lool", "theme": "general:family" }, { "id": "kan-moo-gena-mag-ci-sa-njabootu", "en": "Who is the oldest in your family?", "fr": "Qui est le/la plus \xE2g\xE9(e) de ta famille ?", "wo": "Kan moo g\xEBna mag ci sa njabootu ?", "theme": "general:family" }, { "id": "sama-maam-bu-jigeen-moo-gena-mag", "en": "My grandmother is the oldest", "fr": "Ma grand-m\xE8re est la plus \xE2g\xE9e", "wo": "Sama maam bu jig\xE9en moo g\xEBna mag", "theme": "general:family" }, { "id": "sama-njabootu-dafay-liggeey-ci-toll-yi", "en": "My family works in the fields", "fr": "Ma famille travaille aux champs", "wo": "Sama njabootu dafay ligg\xE9ey ci toll yi", "theme": "general:family" }, { "id": "sama-rak-bu-goor-dafay-jaay-menneef-ci-marse-bi", "en": "My brother sells fruit at the market", "fr": "Mon fr\xE8re vend des fruits au march\xE9", "wo": "Sama rak bu g\xF3or dafay jaay me\xF1\xF1eef ci marse bi", "theme": "general:family" }, { "id": "liggeey", "en": "Work", "fr": "Travail", "wo": "Ligg\xE9ey", "theme": "general:work" }, { "id": "liggeey-bi", "en": "Job", "fr": "Emploi", "wo": "Ligg\xE9ey bi", "theme": "general:work" }, { "id": "bes-bu-nekk", "en": "Every day", "fr": "Chaque jour", "wo": "B\xE9s bu nekk", "theme": "general:work" }, { "id": "dama-am-liggeey-bu-bari", "en": "Busy", "fr": "Occup\xE9(e)", "wo": "Dama am ligg\xE9ey bu bari", "theme": "general:work" }, { "id": "xarit-ci-liggeey", "en": "Colleague", "fr": "Coll\xE8gue", "wo": "Xarit ci ligg\xE9ey", "theme": "general:work" }, { "id": "damay-tambali-liggeey-ci-juroom-nett", "en": "I start work at eight o'clock", "fr": "Je commence le travail \xE0 huit heures", "wo": "Damay t\xE0mbali ligg\xE9ey ci jur\xF3om \xF1ett", "theme": "general:work" }, { "id": "damay-noppi-liggeey-ci-juroom", "en": "I finish work at five o'clock", "fr": "Je termine le travail \xE0 dix-sept heures", "wo": "Damay noppi ligg\xE9ey ci jur\xF3om", "theme": "general:work" }, { "id": "damay-liggeey-ci-bureau-bi", "en": "I work in an office", "fr": "Je travaille dans un bureau", "wo": "Damay ligg\xE9ey ci bureau bi", "theme": "general:work" }, { "id": "sama-liggeey-dafa-sonn-waaye-dafay-neex-ma", "en": "My job is difficult but interesting", "fr": "Mon travail est difficile mais int\xE9ressant", "wo": "Sama ligg\xE9ey dafa sonn waaye dafay neex ma", "theme": "general:work" }, { "id": "maa-ngi-seet-liggeey-bu-bees", "en": "I am looking for a new job", "fr": "Je cherche un nouvel emploi", "wo": "Maa ngi seet ligg\xE9ey bu bees", "theme": "general:work" }, { "id": "dama-begg-dimbali-kiliyaan-yi", "en": "I like helping customers", "fr": "J'aime aider les clients", "wo": "Dama b\xEBgg dimbali kiliyaan yi", "theme": "general:work" }, { "id": "damay-noppalu-tuuti-ci-digg-becceg", "en": "I take a short break at noon", "fr": "Je fais une courte pause \xE0 midi", "wo": "Damay noppalu tuuti ci digg-b\xEBcc\xEBg", "theme": "general:work" }, { "id": "damay-tambali-liggeey-ci-juroom-benn-ci-suba", "en": "I start work at six in the morning", "fr": "Je commence \xE0 travailler \xE0 six heures du matin", "wo": "Damay t\xE0mbali ligg\xE9ey ci jur\xF3om benn ci suba", "theme": "general:work" }, { "id": "damay-sotti-ndox-ci-gancax-yi-bes-bu-nekk", "en": "I water the plants every day", "fr": "J'arrose les plantes chaque jour", "wo": "Damay sotti ndox ci g\xE0ncax yi b\xE9s bu nekk", "theme": "general:work" }, { "id": "damay-jaay-sama-yef-ci-mbedd-mi", "en": "I sell my goods in the street", "fr": "Je vends mes marchandises dans la rue", "wo": "Damay jaay sama y\xEBf ci mbedd mi", "theme": "general:work" }, { "id": "marse-bi", "en": "Market", "fr": "March\xE9", "wo": "Marse bi", "theme": "general:market" }, { "id": "njeg", "en": "Price", "fr": "Prix", "wo": "Nj\xEBg", "theme": "general:market" }, { "id": "xaalis", "en": "Money", "fr": "Argent", "wo": "Xaalis", "theme": "general:market" }, { "id": "jend", "en": "Buy", "fr": "Acheter", "wo": "J\xEBnd", "theme": "general:market" }, { "id": "dafa-yomb", "en": "Cheap", "fr": "Bon march\xE9", "wo": "Dafa yomb", "theme": "general:market" }, { "id": "naata-la", "en": "How much does it cost?", "fr": "Combien \xE7a co\xFBte ?", "wo": "\xD1aata la ?", "theme": "general:market" }, { "id": "dafa-seer-lool", "en": "That is too expensive", "fr": "C'est trop cher", "wo": "Dafa seer lool", "theme": "general:market" }, { "id": "men-nga-wanni-njeg-li", "en": "Can you make it cheaper?", "fr": "Peux-tu baisser le prix ?", "wo": "M\xEBn nga w\xE0\xF1\xF1i nj\xEBg li ?", "theme": "general:market" }, { "id": "dama-begg-jend-ceeb", "en": "I would like to buy some rice", "fr": "Je voudrais acheter du riz", "wo": "Dama b\xEBgg j\xEBnd ceeb", "theme": "general:market" }, { "id": "ndax-nangu-ngeen-wave-ak-orange-money", "en": "Do you accept mobile money?", "fr": "Acceptez-vous le paiement mobile ?", "wo": "Ndax nangu ngeen Wave ak Orange Money ?", "theme": "general:market" }, { "id": "naata-la-tamaate-yi", "en": "How much are the tomatoes?", "fr": "Combien co\xFBtent les tomates ?", "wo": "\xD1aata la tamaate yi ?", "theme": "general:market" }, { "id": "men-nga-ma-wannil-ci-njeg-li", "en": "Could you give me a discount?", "fr": "Pourriez-vous me faire une r\xE9duction ?", "wo": "M\xEBn nga ma w\xE0\xF1\xF1il ci nj\xEBg li ?", "theme": "general:market" }, { "id": "naata-la", "en": "How much is this?", "fr": "Combien co\xFBte ceci ?", "wo": "\xD1aata la ?", "theme": "general:market" }, { "id": "dafa-seer", "en": "It is too expensive", "fr": "C'est trop cher", "wo": "Dafa seer", "theme": "general:market" }, { "id": "wannil-ma-tuuti", "en": "Can you lower the price a little?", "fr": "Pouvez-vous baisser un peu le prix ?", "wo": "W\xE0\xF1\xF1il ma tuuti", "theme": "general:market" }, { "id": "dama-begg-jend-fukki-kilo-sooble", "en": "I want to buy ten kilos of onions", "fr": "Je veux acheter dix kilos d'oignons", "wo": "Dama b\xEBgg j\xEBnd fukki kilo sooble", "theme": "general:market" }, { "id": "salaam-aleekum", "en": "Hello", "fr": "Bonjour", "wo": "Salaam aleekum", "theme": "wolof:salutations" }, { "id": "nanga-def", "en": "How are you?", "fr": "Comment vas-tu ?", "wo": "Nanga def ?", "theme": "wolof:salutations" }, { "id": "maa-ngi-fi", "en": "I'm fine", "fr": "Je vais bien", "wo": "Maa ngi fi", "theme": "wolof:salutations" }, { "id": "jerejef", "en": "Thank you", "fr": "Merci", "wo": "J\xEBr\xEBj\xEBf", "theme": "wolof:salutations" }, { "id": "waaw", "en": "Yes", "fr": "Oui", "wo": "Waaw", "theme": "wolof:salutations" }, { "id": "deedeet", "en": "No", "fr": "Non", "wo": "D\xE9ed\xE9et", "theme": "wolof:salutations" }, { "id": "ba-suba", "en": "See you tomorrow", "fr": "\xC0 demain", "wo": "Ba suba", "theme": "wolof:salutations" }, { "id": "naka-la-tudd", "en": "What is your name?", "fr": "Comment t'appelles-tu ?", "wo": "Naka la tudd ?", "theme": "wolof:salutations" }, { "id": "fatou-laa-tudd", "en": "My name is Fatou", "fr": "Je m'appelle Fatou", "wo": "Fatou laa tudd", "theme": "wolof:salutations" }, { "id": "fanaanal-jamm", "en": "Good night", "fr": "Bonne nuit", "wo": "Fanaanal jamm", "theme": "wolof:salutations" }, { "id": "naka-nga-def", "en": "How are you?", "fr": "Comment vas-tu ?", "wo": "Naka nga def ?", "theme": "wolof:salutations" }, { "id": "maa-ngi-fi-rekk", "en": "I'm fine", "fr": "Je vais bien", "wo": "Maa ngi fi rekk", "theme": "wolof:salutations" }, { "id": "noo-tudd", "en": "What's your name?", "fr": "Comment tu t'appelles ?", "wo": "Noo tudd ?", "theme": "wolof:salutations" }, { "id": "njaboot", "en": "Family", "fr": "Famille", "wo": "Njaboot", "theme": "wolof:famille" }, { "id": "mag", "en": "Older sibling", "fr": "Fr\xE8re/s\u0153ur a\xEEn\xE9(e)", "wo": "Mag", "theme": "wolof:famille" }, { "id": "rakk", "en": "Younger sibling", "fr": "Fr\xE8re/s\u0153ur cadet(te)", "wo": "Rakk", "theme": "wolof:famille" }, { "id": "doom", "en": "Child", "fr": "Enfant", "wo": "Doom", "theme": "wolof:famille" }, { "id": "am-naa-njaboot-bu-rey", "en": "I have a big family", "fr": "J'ai une grande famille", "wo": "Am naa njaboot bu r\xE9y", "theme": "wolof:famille" }, { "id": "sama-yaay-nekk-na-ker", "en": "My mother is at home", "fr": "Ma m\xE8re est \xE0 la maison", "wo": "Sama yaay nekk na k\xEBr", "theme": "wolof:famille" }, { "id": "begg-naa-sama-doom-yi", "en": "I love my children", "fr": "J'aime mes enfants", "wo": "B\xEBgg naa sama doom yi", "theme": "wolof:famille" }, { "id": "naata-doom-nga-am", "en": "How many children do you have?", "fr": "Combien d'enfants as-tu ?", "wo": "\xD1aata doom nga am ?", "theme": "wolof:famille" }, { "id": "ndax-am-nga-rakk", "en": "Do you have a sibling?", "fr": "As-tu un fr\xE8re/une s\u0153ur ?", "wo": "Ndax am nga rakk ?", "theme": "wolof:famille" }, { "id": "sama-yaay", "en": "My mother", "fr": "Ma m\xE8re", "wo": "Sama yaay", "theme": "wolof:famille" }, { "id": "sama-baay", "en": "My father", "fr": "Mon p\xE8re", "wo": "Sama baay", "theme": "wolof:famille" }, { "id": "baykat", "en": "Farmer", "fr": "Agriculteur", "wo": "Baykat", "theme": "wolof:famille" }, { "id": "ker", "en": "House", "fr": "Maison", "wo": "K\xEBr", "theme": "wolof:maison" }, { "id": "ndox", "en": "Water", "fr": "Eau", "wo": "Ndox", "theme": "wolof:maison" }, { "id": "xarit", "en": "Friend", "fr": "Ami", "wo": "Xarit", "theme": "wolof:maison" }, { "id": "leegi", "en": "Now", "fr": "Maintenant", "wo": "L\xE9egi", "theme": "wolof:maison" }, { "id": "nam", "en": "Food", "fr": "Nourriture", "wo": "\xD1am", "theme": "wolof:maison" }, { "id": "maa-ngi-dem-ker", "en": "I am going home", "fr": "Je rentre \xE0 la maison", "wo": "Maa ngi dem k\xEBr", "theme": "wolof:maison" }, { "id": "soxla-naa-ndox", "en": "I need water", "fr": "J'ai besoin d'eau", "wo": "Soxla naa ndox", "theme": "wolof:maison" }, { "id": "sonn-naa-tay", "en": "I am tired today", "fr": "Je suis fatigu\xE9(e) aujourd'hui", "wo": "Sonn naa tay", "theme": "wolof:maison" }, { "id": "foo-dekk", "en": "Where is your house?", "fr": "O\xF9 habites-tu ?", "wo": "Foo d\xEBkk ?", "theme": "wolof:maison" }, { "id": "fan-nga-liggeey", "en": "Where do you work?", "fr": "O\xF9 travailles-tu ?", "wo": "Fan nga ligg\xE9ey ?", "theme": "wolof:maison" }, { "id": "maa-ngi-liggeey-ci-butig", "en": "I work in a shop", "fr": "Je travaille dans une boutique", "wo": "Maa ngi ligg\xE9ey ci butig", "theme": "wolof:maison" }, { "id": "toolu", "en": "Field", "fr": "Champ", "wo": "Toolu", "theme": "wolof:maison" }, { "id": "mbay", "en": "Farming", "fr": "Agriculture", "wo": "Mbay", "theme": "wolof:maison" }, { "id": "nag", "en": "Cow", "fr": "Vache", "wo": "Nag", "theme": "wolof:maison" }, { "id": "xar", "en": "Sheep", "fr": "Mouton", "wo": "Xar", "theme": "wolof:maison" }, { "id": "bey", "en": "Goat", "fr": "Ch\xE8vre", "wo": "B\xEBy", "theme": "wolof:maison" }, { "id": "amortisor", "en": "Shock absorber", "fr": "Amortisseur", "wo": "Amortis\xF6r", "theme": "business" }, { "id": "pieces-detachees-yu-tracteur", "en": "Tractor spare parts", "fr": "Pi\xE8ces d\xE9tach\xE9es de tracteur", "wo": "Pi\xE8ces d\xE9tach\xE9es yu tracteur", "theme": "business" }, { "id": "xaalis", "en": "Mobile money payment", "fr": "Paiement par mobile money", "wo": "Xaalis", "theme": "business" }, { "id": "jumtukaay-yu-irrigation", "en": "Irrigation equipment", "fr": "Mat\xE9riel d'irrigation", "wo": "Jumtukaay yu irrigation", "theme": "business" }, { "id": "conteneur-bu-yonnee", "en": "Shipping container", "fr": "Conteneur d'exp\xE9dition", "wo": "Conteneur bu y\xF3nnee", "theme": "business" }, { "id": "dedouanement-fay-douane-bi", "en": "Customs clearance", "fr": "D\xE9douanement", "wo": "D\xE9douanement (fay douane bi)", "theme": "business" }], "dialogues": [{ "id": "general-intro", "theme": "general:intro", "lignes": [{ "role": "A", "en": "Hello, what is your name?", "fr": "Bonjour, comment vous appelez-vous ?", "wo": "Salaamaalekum, noo tudd ?" }, { "role": "B", "en": "My name is Fatou. Nice to meet you.", "fr": "Je m'appelle Fatou. Enchant\xE9e.", "wo": "Maa ngi tudd Fatou. Neex na ma xam la." }, { "role": "A", "en": "Nice to meet you too. Where are you from?", "fr": "Enchant\xE9 aussi. D'o\xF9 venez-vous ?", "wo": "Neex na ma it. Fu nga j\xF3ge ?" }, { "role": "B", "en": "I am from Thi\xE8s, in Senegal.", "fr": "Je viens de Thi\xE8s, au S\xE9n\xE9gal.", "wo": "Thi\xE8s laa j\xF3ge, ci Senegaal." }, { "role": "A", "en": "Can you spell your name, please?", "fr": "Pouvez-vous \xE9peler votre nom, s'il vous pla\xEEt ?", "wo": "M\xEBn nga wax sa tur araf ci araf ?" }, { "role": "B", "en": "Yes: F-A-T-O-U.", "fr": "Oui : F-A-T-O-U.", "wo": "Waaw : F-A-T-O-U." }, { "role": "A", "en": "What do you do for a living?", "fr": "Que faites-vous dans la vie ?", "wo": "Ban ligg\xE9ey nga def ?" }, { "role": "B", "en": "I am a farmer, and I also sell my vegetables at the market.", "fr": "Je suis agricultrice, et je vends aussi mes l\xE9gumes au march\xE9.", "wo": "Beykat laa, te maa ngi jaay sama l\xE9gumes ci marse bi." }, { "role": "A", "en": "Do you sell them yourself?", "fr": "Vous les vendez vous-m\xEAme ?", "wo": "Yaa ko jaay ci sa bopp ?" }, { "role": "B", "en": "Yes, I am my own boss.", "fr": "Oui, je suis ma propre patronne.", "wo": "Waaw, man laa boroom sama ligg\xE9ey." }] }, { "id": "general-family", "theme": "general:family", "lignes": [{ "role": "A", "en": "Do you have a big family?", "fr": "Avez-vous une grande famille ?", "wo": "Ndax am nga njabootu bu mag ?" }, { "role": "B", "en": "Yes, I have two brothers and one sister.", "fr": "Oui, j'ai deux fr\xE8res et une s\u0153ur.", "wo": "Waaw, am naa \xF1aar rak bu g\xF3or ak benn rak bu jig\xE9en." }, { "role": "A", "en": "Do you all live together?", "fr": "Vivez-vous tous ensemble ?", "wo": "Ndax dangeen d\xEBkk \xE0nd ?" }, { "role": "B", "en": "Yes, we live in the same house with our parents.", "fr": "Oui, nous vivons dans la m\xEAme maison avec nos parents.", "wo": "Waaw, danuy d\xEBkk ci benn k\xEBr ak sunu waajur." }, { "role": "A", "en": "Who is the oldest in your family?", "fr": "Qui est le plus \xE2g\xE9 de votre famille ?", "wo": "Kan moo g\xEBna mag ci sa njabootu ?" }, { "role": "B", "en": "My grandmother; she is 78 years old.", "fr": "Ma grand-m\xE8re ; elle a 78 ans.", "wo": "Sama maam bu jig\xE9en ; am na jur\xF3om \xF1aar fukk ak jur\xF3om \xF1ett at." }, { "role": "A", "en": "Does your family have a farm?", "fr": "Votre famille a-t-elle une ferme ?", "wo": "Ndax sa njabootu am na tool ?" }, { "role": "B", "en": "Yes, my parents grow millet and groundnuts.", "fr": "Oui, mes parents cultivent du mil et des arachides.", "wo": "Waaw, sama waajur yi da\xF1uy ji dugub ak gerte." }, { "role": "A", "en": "And your brother?", "fr": "Et votre fr\xE8re ?", "wo": "Sa rak bu g\xF3or nag ?" }, { "role": "B", "en": "He is a street trader in Thi\xE8s.", "fr": "Il est commer\xE7ant ambulant \xE0 Thi\xE8s.", "wo": "Baana-baana la ci Thi\xE8s." }] }, { "id": "general-work", "theme": "general:work", "lignes": [{ "role": "A", "en": "What do you do?", "fr": "Que faites-vous comme travail ?", "wo": "Ban ligg\xE9ey nga def ?" }, { "role": "B", "en": "I work in a shop every day.", "fr": "Je travaille dans une boutique tous les jours.", "wo": "Damay ligg\xE9ey ci boutik bi b\xE9s bu nekk." }, { "role": "A", "en": "What time do you start work?", "fr": "\xC0 quelle heure commencez-vous le travail ?", "wo": "Ci ban waxtu nga t\xE0mbali ligg\xE9ey ?" }, { "role": "B", "en": "I start at eight and finish at six.", "fr": "Je commence \xE0 huit heures et je finis \xE0 six heures.", "wo": "Damay t\xE0mbali ci jur\xF3om \xF1ett te noppi ci jur\xF3om benn." }, { "role": "A", "en": "What do you like about your job?", "fr": "Qu'aimez-vous dans votre travail ?", "wo": "Lan nga b\xEBgg ci sa ligg\xE9ey ?" }, { "role": "B", "en": "I like helping customers every day.", "fr": "J'aime aider les clients chaque jour.", "wo": "Dama b\xEBgg dimbali kiliyaan yi b\xE9s bu nekk." }, { "role": "A", "en": "What time do you start work?", "fr": "\xC0 quelle heure commencez-vous le travail ?", "wo": "Ci ban waxtu nga t\xE0mbali ligg\xE9ey ?" }, { "role": "B", "en": "At six. I water my vegetables first, then I go to the market.", "fr": "\xC0 six heures. J'arrose d'abord mes l\xE9gumes, puis je vais au march\xE9.", "wo": "Ci jur\xF3om benn. Damay sotti ndox ci sama l\xE9gumes yi nj\xEBkk, ba noppi dem ci marse bi." }, { "role": "A", "en": "How many hours do you work?", "fr": "Combien d'heures travaillez-vous ?", "wo": "\xD1aata waxtu nga ligg\xE9ey ?" }, { "role": "B", "en": "About ten hours a day.", "fr": "Environ dix heures par jour.", "wo": "Ni fukki waxtu ci b\xE9s bu nekk." }] }, { "id": "general-market", "theme": "general:market", "lignes": [{ "role": "A", "en": "How much is this bag?", "fr": "Combien co\xFBte ce sac ?", "wo": "\xD1aata la sac bi ?" }, { "role": "B", "en": "It's five thousand francs.", "fr": "Il co\xFBte cinq mille francs.", "wo": "Jur\xF3om junni franc la." }, { "role": "A", "en": "That is too expensive. Can you make it cheaper?", "fr": "C'est trop cher. Pouvez-vous baisser le prix ?", "wo": "Dafa seer lool. M\xEBn nga w\xE0\xF1\xF1i nj\xEBg li ?" }, { "role": "B", "en": "Okay, four thousand francs for you.", "fr": "D'accord, quatre mille francs pour vous.", "wo": "Waaw, \xF1eent junni franc ngir yaw." }, { "role": "A", "en": "Thank you, I'll take two.", "fr": "Merci, j'en prends deux.", "wo": "J\xEBr\xEBj\xEBf, dinaa j\xEBl \xF1aar." }, { "role": "A", "en": "Good morning. How much are the tomatoes?", "fr": "Bonjour. Combien co\xFBtent les tomates ?", "wo": "Salaamaalekum. \xD1aata la tamaate yi ?" }, { "role": "B", "en": "Five hundred francs a kilo.", "fr": "Cinq cents francs le kilo.", "wo": "Jur\xF3om t\xE9em\xE9er franc la ci kilo bi." }, { "role": "A", "en": "It is too expensive. Can you lower the price?", "fr": "C'est trop cher. Pouvez-vous baisser le prix ?", "wo": "Dafa seer. M\xEBn nga w\xE0\xF1\xF1i nj\xEBg li ?" }, { "role": "B", "en": "For you, four hundred. They come from the farm this morning.", "fr": "Pour vous, quatre cents. Elles viennent de la ferme ce matin.", "wo": "Ngir yaw, \xF1eent t\xE9em\xE9er. \xD1u ngi j\xF3ge ci tool bi tey ci suba." }, { "role": "A", "en": "Okay, I want three kilos.", "fr": "D'accord, je veux trois kilos.", "wo": "Baax na, b\xEBgg naa \xF1ett kilo." }] }], "ielts": [{ "id": "ielts-neighbours-1a-0", "test": "neighbours", "sujet": "Neighbours", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-neighbours-1a-1", "test": "neighbours", "sujet": "Neighbours", "phase": "1a", "question": "Where are you from?" }, { "id": "ielts-neighbours-1a-2", "test": "neighbours", "sujet": "Neighbours", "phase": "1a", "question": "What do you do?" }, { "id": "ielts-neighbours-1b-0", "test": "neighbours", "sujet": "Neighbours", "phase": "1b", "question": "Do you have neighbours?" }, { "id": "ielts-neighbours-1b-1", "test": "neighbours", "sujet": "Neighbours", "phase": "1b", "question": "What is your neighbour's name?" }, { "id": "ielts-neighbours-1b-2", "test": "neighbours", "sujet": "Neighbours", "phase": "1b", "question": "Do you talk to your neighbours?" }, { "id": "ielts-neighbours-1b-3", "test": "neighbours", "sujet": "Neighbours", "phase": "1b", "question": "Where do your neighbours live?" }, { "id": "ielts-neighbours-1b-4", "test": "neighbours", "sujet": "Neighbours", "phase": "1b", "question": "Do you like your neighbours?" }, { "id": "ielts-neighbours-2a-0", "test": "neighbours", "sujet": "Neighbours", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-neighbours-2a-1", "test": "neighbours", "sujet": "Neighbours", "phase": "2a", "question": "What are the people doing?" }, { "id": "ielts-neighbours-2b-0", "test": "neighbours", "sujet": "Neighbours", "phase": "2b", "question": "Do you think it is important to know your neighbours? Why?" }, { "id": "ielts-neighbours-2b-1", "test": "neighbours", "sujet": "Neighbours", "phase": "2b", "question": "What would you do if your neighbour asked for help?" }, { "id": "ielts-family-1a-0", "test": "family", "sujet": "My Family", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-family-1a-1", "test": "family", "sujet": "My Family", "phase": "1a", "question": "How old are you?" }, { "id": "ielts-family-1a-2", "test": "family", "sujet": "My Family", "phase": "1a", "question": "Where do you live?" }, { "id": "ielts-family-1b-0", "test": "family", "sujet": "My Family", "phase": "1b", "question": "Do you have a big family?" }, { "id": "ielts-family-1b-1", "test": "family", "sujet": "My Family", "phase": "1b", "question": "Who do you live with?" }, { "id": "ielts-family-1b-2", "test": "family", "sujet": "My Family", "phase": "1b", "question": "What does your family like doing together?" }, { "id": "ielts-family-1b-3", "test": "family", "sujet": "My Family", "phase": "1b", "question": "Do you see your family every day?" }, { "id": "ielts-family-1b-4", "test": "family", "sujet": "My Family", "phase": "1b", "question": "Who is the oldest person in your family?" }, { "id": "ielts-family-2a-0", "test": "family", "sujet": "My Family", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-family-2a-1", "test": "family", "sujet": "My Family", "phase": "2a", "question": "How do you think the people feel?" }, { "id": "ielts-family-2b-0", "test": "family", "sujet": "My Family", "phase": "2b", "question": "Why is family important to you?" }, { "id": "ielts-family-2b-1", "test": "family", "sujet": "My Family", "phase": "2b", "question": "What do you usually do with your family at weekends?" }, { "id": "ielts-free-time-1a-0", "test": "free-time", "sujet": "Free Time", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-free-time-1a-1", "test": "free-time", "sujet": "Free Time", "phase": "1a", "question": "What is your job?" }, { "id": "ielts-free-time-1a-2", "test": "free-time", "sujet": "Free Time", "phase": "1a", "question": "Where are you from?" }, { "id": "ielts-free-time-1b-0", "test": "free-time", "sujet": "Free Time", "phase": "1b", "question": "What do you do in your free time?" }, { "id": "ielts-free-time-1b-1", "test": "free-time", "sujet": "Free Time", "phase": "1b", "question": "Do you like sport?" }, { "id": "ielts-free-time-1b-2", "test": "free-time", "sujet": "Free Time", "phase": "1b", "question": "Do you watch television?" }, { "id": "ielts-free-time-1b-3", "test": "free-time", "sujet": "Free Time", "phase": "1b", "question": "Who do you spend your free time with?" }, { "id": "ielts-free-time-1b-4", "test": "free-time", "sujet": "Free Time", "phase": "1b", "question": "Do you have a hobby?" }, { "id": "ielts-free-time-2a-0", "test": "free-time", "sujet": "Free Time", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-free-time-2a-1", "test": "free-time", "sujet": "Free Time", "phase": "2a", "question": "Do you think this looks fun? Why?" }, { "id": "ielts-free-time-2b-0", "test": "free-time", "sujet": "Free Time", "phase": "2b", "question": "Why do you think free time is important?" }, { "id": "ielts-free-time-2b-1", "test": "free-time", "sujet": "Free Time", "phase": "2b", "question": "What would you like to try in your free time?" }, { "id": "ielts-work-1a-0", "test": "work", "sujet": "Work", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-work-1a-1", "test": "work", "sujet": "Work", "phase": "1a", "question": "What do you do?" }, { "id": "ielts-work-1a-2", "test": "work", "sujet": "Work", "phase": "1a", "question": "Where do you work?" }, { "id": "ielts-work-1b-0", "test": "work", "sujet": "Work", "phase": "1b", "question": "Do you like your job?" }, { "id": "ielts-work-1b-1", "test": "work", "sujet": "Work", "phase": "1b", "question": "What time do you start work?" }, { "id": "ielts-work-1b-2", "test": "work", "sujet": "Work", "phase": "1b", "question": "Do you work with other people?" }, { "id": "ielts-work-1b-3", "test": "work", "sujet": "Work", "phase": "1b", "question": "Is your job difficult?" }, { "id": "ielts-work-1b-4", "test": "work", "sujet": "Work", "phase": "1b", "question": "How do you go to work?" }, { "id": "ielts-work-2a-0", "test": "work", "sujet": "Work", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-work-2a-1", "test": "work", "sujet": "Work", "phase": "2a", "question": "What are the people doing?" }, { "id": "ielts-work-2b-0", "test": "work", "sujet": "Work", "phase": "2b", "question": "Why is work important to you?" }, { "id": "ielts-work-2b-1", "test": "work", "sujet": "Work", "phase": "2b", "question": "What would you like to change about your job?" }], "ecoute": [{ "id": "ecoute-0", "audio": "Attention please. The bus to Thi\xE8s will leave from platform two in ten minutes.", "question": "Where does the bus leave from?", "options": ["Platform one", "Platform two", "Platform three"], "reponse": 1 }, { "id": "ecoute-1", "audio": "Good morning. The doctor is ready to see you now. Please come to room five.", "question": "Where should you go?", "options": ["Room two", "Room five", "Room seven"], "reponse": 1 }], "quiz": [{ "id": "quiz-intro-0", "theme": "general:intro", "q": "My name ___ Fatou.", "options": ["is", "am", "are"], "reponse": 0, "explication": "My name is + nom : toujours \xAB is \xBB." }, { "id": "quiz-intro-1", "theme": "general:intro", "q": "I ___ from Senegal.", "options": ["is", "am", "are"], "reponse": 1, "explication": "Avec I, on utilise toujours \xAB am \xBB." }, { "id": "quiz-intro-2", "theme": "general:intro", "q": "\xAB Enchant\xE9 \xBB se dit :", "options": ["Nice to meet you", "Good night", "See you"], "reponse": 0, "explication": "Expression de politesse \xE0 la rencontre." }, { "id": "quiz-intro-3", "theme": "general:intro", "q": "I ___ a farmer and a trader.", "options": ["is", "am", "are"], "reponse": 1, "explication": "Avec I, toujours \xAB am \xBB : I am a farmer." }, { "id": "quiz-family-0", "theme": "general:family", "q": "She ___ a teacher.", "options": ["am", "is", "are"], "reponse": 1, "explication": "Avec he, she, it, on utilise \xAB is \xBB." }, { "id": "quiz-family-1", "theme": "general:family", "q": "I have two ___.", "options": ["brother", "brothers", "brotheres"], "reponse": 1, "explication": "Le pluriel se forme avec -s : brothers." }, { "id": "quiz-family-2", "theme": "general:family", "q": "\xAB Ma voisine \xBB se dit en anglais :", "options": ["my neighbour", "my brother", "my teacher"], "reponse": 0, "explication": "Neighbour = voisin ou voisine." }, { "id": "quiz-family-3", "theme": "general:family", "q": "My brother ___ vegetables at the market.", "options": ["sell", "sells", "selling"], "reponse": 1, "explication": "3e personne du singulier : verbe + s (he sells)." }, { "id": "quiz-work-0", "theme": "general:work", "q": "He ___ to work every day.", "options": ["go", "goes", "going"], "reponse": 1, "explication": "Avec he, le verbe prend -es : goes." }, { "id": "quiz-work-1", "theme": "general:work", "q": "I ___ a taxi driver.", "options": ["am", "is", "are"], "reponse": 0, "explication": "Avec I, on utilise toujours \xAB am \xBB." }, { "id": "quiz-work-2", "theme": "general:work", "q": "She works ___ a hospital.", "options": ["in", "at", "on"], "reponse": 1, "explication": "\xAB Work at + lieu \xBB pour un lieu de travail pr\xE9cis." }, { "id": "quiz-work-3", "theme": "general:work", "q": "I ___ my vegetables every morning.", "options": ["water", "waters", "watering"], "reponse": 0, "explication": "Avec I, le verbe reste \xE0 la forme de base." }, { "id": "quiz-market-0", "theme": "general:market", "q": "How much ___ this bag?", "options": ["are", "is", "do"], "reponse": 1, "explication": "Un seul sac : \xAB How much is this bag? \xBB." }, { "id": "quiz-market-1", "theme": "general:market", "q": "There ___ a market near my house.", "options": ["is", "are", "be"], "reponse": 0, "explication": "Un seul march\xE9 : \xAB There is \xBB." }, { "id": "quiz-market-2", "theme": "general:market", "q": "This shop is very ___.", "options": ["cheap", "cheep", "cheaply"], "reponse": 0, "explication": "Adjectif : cheap (pas d'adverbe ici)." }, { "id": "quiz-market-3", "theme": "general:market", "q": "How ___ are the onions?", "options": ["much", "many", "long"], "reponse": 0, "explication": "Pour demander un prix : \xAB How much \xBB." }] }, "intermediaire": { "titre": "Interm\xE9diaire", "rang": 2, "phrases": [{ "id": "ayropoor-bi", "en": "Airport", "fr": "A\xE9roport", "wo": "Ayropoor bi", "theme": "general:travel" }, { "id": "bilee-bi", "en": "Ticket", "fr": "Billet", "wo": "Bilee bi", "theme": "general:travel" }, { "id": "paspoor-bi", "en": "Passport", "fr": "Passeport", "wo": "Paspoor bi", "theme": "general:travel" }, { "id": "tukki-bu-avion", "en": "Flight", "fr": "Vol", "wo": "Tukki bu avion", "theme": "general:travel" }, { "id": "bus-bi", "en": "Bus", "fr": "Bus", "wo": "Bus bi", "theme": "general:travel" }, { "id": "dama-begg-reserve-benn-bilee", "en": "I would like to book a ticket", "fr": "Je voudrais r\xE9server un billet", "wo": "Dama b\xEBgg reserve benn bilee", "theme": "general:travel" }, { "id": "ci-ban-waxtu-la-bus-bi-di-dem", "en": "What time does the bus leave?", "fr": "\xC0 quelle heure part le bus ?", "wo": "Ci ban waxtu la bus bi di dem ?", "theme": "general:travel" }, { "id": "ana-arre-bu-gena-jege", "en": "Where is the nearest bus stop?", "fr": "O\xF9 est l'arr\xEAt de bus le plus proche ?", "wo": "Ana arre bu g\xEBna jege ?", "theme": "general:travel" }, { "id": "maa-ngi-tukki-ngir-gis-sama-njabootu", "en": "I am traveling to visit my family", "fr": "Je voyage pour rendre visite \xE0 ma famille", "wo": "Maa ngi tukki ngir gis sama njabootu", "theme": "general:travel" }, { "id": "ndax-war-naa-am-visa-ngir-reew-mii", "en": "Do I need a visa for this country?", "fr": "Ai-je besoin d'un visa pour ce pays ?", "wo": "Ndax war naa am visa ngir r\xE9ew mii ?", "theme": "general:travel" }, { "id": "naka-nga-di-dem-liggeey", "en": "How do you get to work?", "fr": "Comment vas-tu au travail ?", "wo": "Naka nga di dem ligg\xE9ey ?", "theme": "general:travel" }, { "id": "damay-jel-bus-bi-suba-su-nekk", "en": "I take the bus every morning", "fr": "Je prends le bus chaque matin", "wo": "Damay j\xEBl bus bi suba su nekk", "theme": "general:travel" }, { "id": "damay-yobbu-marsandiis-ci-ndakaaru", "en": "I transport goods to Dakar", "fr": "Je transporte des marchandises \xE0 Dakar", "wo": "Damay y\xF3bbu marsandiis ci Ndakaaru", "theme": "general:travel" }, { "id": "kamiyon-bi-dafay-dem-ci-juroom-naar", "en": "The truck leaves at seven", "fr": "Le camion part \xE0 sept heures", "wo": "Kamiyon bi dafay dem ci jur\xF3om \xF1aar", "theme": "general:travel" }, { "id": "naata-la-bilee-bi-ngir-dem-marse-bi", "en": "How much is the ticket to the market?", "fr": "Combien co\xFBte le billet pour le march\xE9 ?", "wo": "\xD1aata la bilee bi ngir dem marse bi ?", "theme": "general:travel" }, { "id": "doktoor-bi", "en": "Doctor", "fr": "M\xE9decin", "wo": "Doktoor bi", "theme": "general:health" }, { "id": "opitaal-bi", "en": "Hospital", "fr": "H\xF4pital", "wo": "Opitaal bi", "theme": "general:health" }, { "id": "feebar", "en": "Sick", "fr": "Malade", "wo": "Feebar", "theme": "general:health" }, { "id": "garab-gi", "en": "Medicine", "fr": "M\xE9dicament", "wo": "Garab gi", "theme": "general:health" }, { "id": "dimbali", "en": "Help", "fr": "Aide", "wo": "Dimbali", "theme": "general:health" }, { "id": "sama-bopp-dafay-metti", "en": "I have a headache", "fr": "J'ai mal \xE0 la t\xEAte", "wo": "Sama bopp dafay metti", "theme": "general:health" }, { "id": "dama-war-a-gis-doktoor", "en": "I need to see a doctor", "fr": "J'ai besoin de voir un m\xE9decin", "wo": "Dama war a gis doktoor", "theme": "general:health" }, { "id": "ana-opitaal-bu-gena-jege", "en": "Where is the nearest hospital?", "fr": "O\xF9 est l'h\xF4pital le plus proche ?", "wo": "Ana opitaal bu g\xEBna jege ?", "theme": "general:health" }, { "id": "dama-gen-a-baax-tey", "en": "I feel better today", "fr": "Je me sens mieux aujourd'hui", "wo": "Dama g\xEBn a baax tey", "theme": "general:health" }, { "id": "wool-ambilaas-bi-su-la-neexee", "en": "Please call an ambulance", "fr": "Appelez une ambulance s'il vous pla\xEEt", "wo": "Wool ambilaas bi, su la neexee", "theme": "general:health" }, { "id": "naanal-benn-comprime-naari-yoon-ci-bes-bi", "en": "Take one tablet twice a day", "fr": "Prenez un comprim\xE9 deux fois par jour", "wo": "Naanal benn comprim\xE9 \xF1aari yoon ci b\xE9s bi", "theme": "general:health" }, { "id": "kan-nga-tambali-feebar", "en": "Since when do you feel sick?", "fr": "Depuis quand te sens-tu malade ?", "wo": "Ka\xF1 nga t\xE0mbali feebar ?", "theme": "general:health" }, { "id": "dama-war-a-noppalu-liggeey-naa-ci-jant-bi-bes-bi-bepp", "en": "I need to rest, I worked in the sun all day", "fr": "J'ai besoin de me reposer, j'ai travaill\xE9 au soleil toute la journ\xE9e", "wo": "Dama war a noppalu, ligg\xE9ey naa ci jant bi b\xE9s bi b\xE9pp", "theme": "general:health" }, { "id": "naanal-ndox-bu-bari-bu-tangee", "en": "Drink a lot of water when it is hot", "fr": "Buvez beaucoup d'eau quand il fait chaud", "wo": "Naanal ndox bu bari bu t\xE0ngee", "theme": "general:health" }, { "id": "restoraan-bi", "en": "Restaurant", "fr": "Restaurant", "wo": "Restoraan bi", "theme": "general:food" }, { "id": "menu-bi", "en": "Menu", "fr": "Menu", "wo": "Menu bi", "theme": "general:food" }, { "id": "ndox-mi", "en": "Water", "fr": "Eau", "wo": "Ndox mi", "theme": "general:food" }, { "id": "dafa-neex-lool", "en": "Delicious", "fr": "D\xE9licieux", "wo": "Dafa neex lool", "theme": "general:food" }, { "id": "addition-bi", "en": "Bill", "fr": "Addition", "wo": "Addition bi", "theme": "general:food" }, { "id": "xiif-na-ma", "en": "I am hungry", "fr": "J'ai faim", "wo": "Xiif na ma", "theme": "general:food" }, { "id": "lan-nga-ma-digal", "en": "What do you recommend?", "fr": "Que recommandez-vous ?", "wo": "Lan nga ma digal ?", "theme": "general:food" }, { "id": "dama-begg-ceeb-ak-jen", "en": "I would like some rice and fish", "fr": "Je voudrais du riz et du poisson", "wo": "Dama b\xEBgg ceeb ak j\xEBn", "theme": "general:food" }, { "id": "lekk-bii-dafa-neex-lool", "en": "This meal is very tasty", "fr": "Ce repas est tr\xE8s savoureux", "wo": "Lekk bii dafa neex lool", "theme": "general:food" }, { "id": "men-naa-am-addition-bi-su-la-neexee", "en": "Can I have the bill, please?", "fr": "Puis-je avoir l'addition, s'il vous pla\xEEt ?", "wo": "M\xEBn naa am addition bi, su la neexee ?", "theme": "general:food" }, { "id": "ban-lekk-nga-gena-begg", "en": "What is your favourite dish?", "fr": "Quel est ton plat pr\xE9f\xE9r\xE9 ?", "wo": "Ban lekk nga g\xEBna b\xEBgg ?", "theme": "general:food" }, { "id": "dama-begg-ceebu-jen", "en": "I like thieboudienne", "fr": "J'aime le thi\xE9boudienne", "wo": "Dama b\xEBgg ceebu j\xEBn", "theme": "general:food" }, { "id": "legumes-yu-bees-ak-menneef", "en": "Fresh vegetables and fruit", "fr": "L\xE9gumes et fruits frais", "wo": "L\xE9gumes yu bees ak me\xF1\xF1eef", "theme": "general:food" }, { "id": "dama-begg-ceeb-ak-ginaar-su-la-neexee", "en": "I would like rice with chicken, please", "fr": "Je voudrais du riz au poulet, s'il vous pla\xEEt", "wo": "Dama b\xEBgg ceeb ak ginaar, su la neexee", "theme": "general:food" }, { "id": "benn-nen", "en": "An egg", "fr": "Un \u0153uf", "wo": "Benn nen", "theme": "general:food" }, { "id": "tey", "en": "Today", "fr": "Aujourd'hui", "wo": "Tey", "theme": "general:time" }, { "id": "elleg", "en": "Tomorrow", "fr": "Demain", "wo": "\xCBll\xEBg", "theme": "general:time" }, { "id": "demb", "en": "Yesterday", "fr": "Hier", "wo": "D\xE9mb", "theme": "general:time" }, { "id": "lim", "en": "Number", "fr": "Nombre", "wo": "Lim", "theme": "general:time" }, { "id": "waxtu", "en": "Time", "fr": "Heure / temps", "wo": "Waxtu", "theme": "general:time" }, { "id": "ban-waxtu-la-leegi", "en": "What time is it now?", "fr": "Quelle heure est-il maintenant ?", "wo": "Ban waxtu la l\xE9egi ?", "theme": "general:time" }, { "id": "dinaa-la-gis-elleg-ci-suba", "en": "I will see you tomorrow morning", "fr": "Je te verrai demain matin", "wo": "Dinaa la gis \xEBll\xEBg ci suba", "theme": "general:time" }, { "id": "ndaje-mi-dafay-tambali-ci-fukk", "en": "The meeting starts at ten o'clock", "fr": "La r\xE9union commence \xE0 dix heures", "wo": "Ndaje mi dafay t\xE0mbali ci fukk", "theme": "general:time" }, { "id": "damaa-am-liggeey-bu-bari-demb", "en": "I was busy yesterday", "fr": "J'\xE9tais occup\xE9(e) hier", "wo": "Damaa am ligg\xE9ey bu bari d\xE9mb", "theme": "general:time" }, { "id": "naata-nit-nu-ngi-new", "en": "How many people are coming?", "fr": "Combien de personnes viennent ?", "wo": "\xD1aata nit \xF1u ngi \xF1\xEBw ?", "theme": "general:time" }, { "id": "ci-ban-waxtu-nga-di-jog", "en": "What time do you wake up?", "fr": "\xC0 quelle heure te r\xE9veilles-tu ?", "wo": "Ci ban waxtu nga di j\xF3g ?", "theme": "general:time" }, { "id": "damay-jog-ci-juroom-benn-suba-su-nekk", "en": "I wake up at six every morning", "fr": "Je me r\xE9veille \xE0 six heures chaque matin", "wo": "Damay j\xF3g ci jur\xF3om benn suba su nekk", "theme": "general:time" }, { "id": "nawet-dafay-tambali-ci-sulet", "en": "The rainy season starts in July", "fr": "La saison des pluies commence en juillet", "wo": "Nawet dafay t\xE0mbali ci sulet", "theme": "general:time" }, { "id": "marse-bi-dafay-ubbeeku-ci-juroom-benn", "en": "The market opens at six", "fr": "Le march\xE9 ouvre \xE0 six heures", "wo": "Marse bi dafay ubbeeku ci jur\xF3om benn", "theme": "general:time" }, { "id": "juroom-teemeer-franc", "en": "Five hundred francs", "fr": "Cinq cents francs", "wo": "Jur\xF3om t\xE9em\xE9er franc", "theme": "general:time" }, { "id": "xaalis", "en": "Money", "fr": "Argent", "wo": "Xaalis", "theme": "wolof:marche" }, { "id": "njeg", "en": "Price", "fr": "Prix", "wo": "Nj\xEBg", "theme": "wolof:marche" }, { "id": "naata-la", "en": "How much is it?", "fr": "C'est combien ?", "wo": "\xD1aata la ?", "theme": "wolof:marche" }, { "id": "jend", "en": "Buy", "fr": "Acheter", "wo": "J\xEBnd", "theme": "wolof:marche" }, { "id": "jaay", "en": "Sell", "fr": "Vendre", "wo": "Jaay", "theme": "wolof:marche" }, { "id": "butik", "en": "Shop", "fr": "Boutique", "wo": "Butik", "theme": "wolof:marche" }, { "id": "dafa-jafe", "en": "That is expensive", "fr": "C'est cher", "wo": "Dafa jafe", "theme": "wolof:marche" }, { "id": "wanni-njeg-bi-su-la-neexee", "en": "Lower the price, please", "fr": "Baisse le prix, s'il te pla\xEEt", "wo": "W\xE0\xF1\xF1i nj\xEBg bi, su la neexee", "theme": "wolof:marche" }, { "id": "begg-naa-jend-ceeb", "en": "I want to buy rice", "fr": "Je veux acheter du riz", "wo": "B\xEBgg naa j\xEBnd ceeb", "theme": "wolof:marche" }, { "id": "amuma-xaalis-leegi", "en": "I don't have money now", "fr": "Je n'ai pas d'argent maintenant", "wo": "Amuma xaalis l\xE9egi", "theme": "wolof:marche" }, { "id": "wanni-ko-tuuti", "en": "Lower it a bit", "fr": "Baisse un peu le prix", "wo": "W\xE0\xF1\xF1i ko tuuti", "theme": "wolof:marche" }, { "id": "jerejef", "en": "Thank you", "fr": "Merci", "wo": "J\xEBr\xEBj\xEBf", "theme": "wolof:marche" }, { "id": "baana-baana", "en": "Street trader", "fr": "Vendeur ambulant", "wo": "Baana-baana", "theme": "wolof:marche" }, { "id": "jaaykat", "en": "Seller", "fr": "Vendeur", "wo": "Jaaykat", "theme": "wolof:marche" }, { "id": "jendkat", "en": "Buyer", "fr": "Acheteur", "wo": "J\xEBndkat", "theme": "wolof:marche" }, { "id": "dafa-seer", "en": "It is expensive", "fr": "C'est cher", "wo": "Dafa seer", "theme": "wolof:marche" }, { "id": "dafa-yomb", "en": "It is cheap", "fr": "C'est bon march\xE9", "wo": "Dafa yomb", "theme": "wolof:marche" }, { "id": "dem", "en": "Go", "fr": "Aller", "wo": "Dem", "theme": "wolof:voyage" }, { "id": "new", "en": "Come", "fr": "Venir", "wo": "\xD1\xEBw", "theme": "wolof:voyage" }, { "id": "yoon", "en": "Road / way", "fr": "Route / chemin", "wo": "Yoon", "theme": "wolof:voyage" }, { "id": "oto", "en": "Car", "fr": "Voiture", "wo": "Oto", "theme": "wolof:voyage" }, { "id": "jege", "en": "Near", "fr": "Pr\xE8s", "wo": "Jege", "theme": "wolof:voyage" }, { "id": "sore", "en": "Far", "fr": "Loin", "wo": "Sore", "theme": "wolof:voyage" }, { "id": "maa-ngi-dem-dakar", "en": "I am going to Dakar", "fr": "Je vais \xE0 Dakar", "wo": "Maa ngi dem Dakar", "theme": "wolof:voyage" }, { "id": "foo-jem", "en": "Where are you going?", "fr": "O\xF9 vas-tu ?", "wo": "Foo j\xEBm ?", "theme": "wolof:voyage" }, { "id": "marse-bi-jege-na-fi", "en": "The market is near here", "fr": "Le march\xE9 est pr\xE8s d'ici", "wo": "Marse bi jege na fi", "theme": "wolof:voyage" }, { "id": "kaay-fi-su-la-neexee", "en": "Come here, please", "fr": "Viens ici, s'il te pla\xEEt", "wo": "Kaay fi, su la neexee", "theme": "wolof:voyage" }, { "id": "kaar-bi", "en": "The bus", "fr": "Le bus", "wo": "Kaar bi", "theme": "wolof:voyage" }, { "id": "fan-la-kaar-bi-joge", "en": "Where does the bus leave from?", "fr": "D'o\xF9 part le bus ?", "wo": "Fan la kaar bi j\xF3ge ?", "theme": "wolof:voyage" }, { "id": "kamiyon", "en": "Truck", "fr": "Camion", "wo": "Kamiyon", "theme": "wolof:voyage" }, { "id": "yaram", "en": "Body", "fr": "Corps", "wo": "Yaram", "theme": "wolof:corps" }, { "id": "bopp", "en": "Head", "fr": "T\xEAte", "wo": "Bopp", "theme": "wolof:corps" }, { "id": "loxo", "en": "Hand", "fr": "Main", "wo": "Loxo", "theme": "wolof:corps" }, { "id": "tank", "en": "Foot", "fr": "Pied", "wo": "Tank", "theme": "wolof:corps" }, { "id": "feebar", "en": "Illness", "fr": "Maladie", "wo": "Feebar", "theme": "wolof:corps" }, { "id": "faju", "en": "To heal", "fr": "Se soigner", "wo": "Faju", "theme": "wolof:corps" }, { "id": "feebar-naa", "en": "I am sick", "fr": "Je suis malade", "wo": "Feebar naa", "theme": "wolof:corps" }, { "id": "sama-bopp-a-metti", "en": "My head hurts", "fr": "J'ai mal \xE0 la t\xEAte", "wo": "Sama bopp a metti", "theme": "wolof:corps" }, { "id": "soxla-naa-gis-doktoor", "en": "I need to see a doctor", "fr": "J'ai besoin de voir un m\xE9decin", "wo": "Soxla naa gis doktoor", "theme": "wolof:corps" }, { "id": "baax-na-leegi", "en": "I feel better now", "fr": "Je me sens mieux maintenant", "wo": "Baax na l\xE9egi", "theme": "wolof:corps" }, { "id": "lu-la-metti", "en": "What hurts?", "fr": "Qu'est-ce qui te fait mal ?", "wo": "Lu la metti ?", "theme": "wolof:corps" }, { "id": "fan-la-doktoor-bi", "en": "Where is the doctor?", "fr": "O\xF9 est le m\xE9decin ?", "wo": "Fan la doktoor bi ?", "theme": "wolof:corps" }, { "id": "sonn", "en": "Tired", "fr": "Fatigu\xE9", "wo": "Sonn", "theme": "wolof:corps" }, { "id": "tang", "en": "Hot", "fr": "Chaud", "wo": "Tang", "theme": "wolof:corps" }, { "id": "fren", "en": "Brakes / brake pads", "fr": "Frein / plaquettes", "wo": "Fren", "theme": "business" }, { "id": "naata-la-piece-bii", "en": "How much does this part cost?", "fr": "Combien co\xFBte cette pi\xE8ce ?", "wo": "\xD1aata la pi\xE8ce bii ?", "theme": "business" }, { "id": "ndax-am-nga-garanti", "en": "Do you have a warranty?", "fr": "Avez-vous la garantie ?", "wo": "Ndax am nga garanti ?", "theme": "business" }, { "id": "naata-ngir-commande-gros", "en": "How much for a bulk order?", "fr": "Combien pour une commande de gros ?", "wo": "\xD1aata ngir commande gros ?", "theme": "business" }, { "id": "naata-acompte-laa-war-a-fey", "en": "How much deposit do I pay?", "fr": "Je verse un acompte de combien ?", "wo": "\xD1aata acompte laa war a fey ?", "theme": "business" }, { "id": "ndax-prix-bi-dafa-bokk-montage-bi", "en": "Does the price include installation?", "fr": "Le prix inclut-il le montage ?", "wo": "Ndax prix bi dafa bokk montage bi ?", "theme": "business" }, { "id": "ndax-men-nga-ma-jox-factuur", "en": "Can you give me an invoice?", "fr": "Pouvez-vous me faire une facture ?", "wo": "Ndax m\xEBn nga ma jox factuur ?", "theme": "business" }, { "id": "toolu", "en": "Water pump for the field", "fr": "Pompe \xE0 eau pour le champ", "wo": "Toolu", "theme": "business" }, { "id": "ban-taille-nga-am", "en": "What size do you have?", "fr": "Quelle taille avez-vous ?", "wo": "Ban taille nga am ?", "theme": "business" }, { "id": "prix-gros-prix-detail", "en": "Wholesale price / retail price", "fr": "Prix de gros / prix de d\xE9tail", "wo": "Prix gros / prix d\xE9tail", "theme": "business" }, { "id": "ndax-tissu-bii-baax-na", "en": "Is this fabric good quality?", "fr": "Ce tissu est-il de bonne qualit\xE9 ?", "wo": "Ndax tissu bii baax na ?", "theme": "business" }, { "id": "am-nga-yeneen-couleur", "en": "Do you have other colours?", "fr": "Avez-vous d'autres couleurs ?", "wo": "Am nga yeneen couleur ?", "theme": "business" }, { "id": "naata-ngir-fukk-pieces", "en": "How much for ten pieces?", "fr": "Combien pour dix pi\xE8ces ?", "wo": "\xD1aata ngir fukk pi\xE8ces ?", "theme": "business" }, { "id": "ndax-tissu-bii-dafay-soppi-couleur-bu-nu-ko-raxasee", "en": "Does this fabric bleed when washed?", "fr": "Est-ce que ce tissu d\xE9teint au lavage ?", "wo": "Ndax tissu bii dafay soppi couleur bu \xF1u ko raxasee ?", "theme": "business" }, { "id": "naata-la-minimum-commande-bi", "en": "What is the minimum order quantity?", "fr": "Quel est le minimum de commande ?", "wo": "\xD1aata la minimum commande bi ?", "theme": "business" }, { "id": "ndax-men-nga-ma-yonnee-un-echantillon", "en": "Can you send me a sample?", "fr": "Pouvez-vous m'envoyer un \xE9chantillon ?", "wo": "Ndax m\xEBn nga ma y\xF3nnee un \xE9chantillon ?", "theme": "business" }, { "id": "ndax-tissu-bii-coton-pur-la", "en": "Is the fabric pure cotton?", "fr": "Le tissu est-il en coton pur ?", "wo": "Ndax tissu bii coton pur la ?", "theme": "business" }, { "id": "am-nga-ticket-bi", "en": "Do you have a receipt?", "fr": "Avez-vous un ticket de caisse ?", "wo": "Am nga ticket bi ?", "theme": "business" }, { "id": "naata-fan-ngir-am-beneen-stock", "en": "What is the restocking time?", "fr": "Quel est le d\xE9lai de r\xE9approvisionnement ?", "wo": "\xD1aata fan ngir am beneen stock ?", "theme": "business" }, { "id": "ndax-jayye-nga-itam-ci-internet", "en": "Do you also sell online?", "fr": "Vendez-vous en ligne aussi ?", "wo": "Ndax jayye nga itam ci internet ?", "theme": "business" }, { "id": "baana-baana", "en": "Wholesale price for street traders", "fr": "Prix de gros pour vendeurs ambulants", "wo": "Baana-baana", "theme": "business" }, { "id": "damay-jaay-ci-credit", "en": "I sell on credit", "fr": "Je vends \xE0 cr\xE9dit", "wo": "Damay jaay ci cr\xE9dit", "theme": "business" }, { "id": "ndax-jumtukaay-bii-dafay-dox-ci-220v", "en": "Does this device work on 220V?", "fr": "Cet appareil fonctionne en 220V ?", "wo": "Ndax jumtukaay bii dafay dox ci 220V ?", "theme": "business" }, { "id": "ndax-am-na-garanti-bu-fabrikaan-bi", "en": "Is there a manufacturer's warranty?", "fr": "Y a-t-il une garantie constructeur ?", "wo": "Ndax am na garanti bu fabrikaan bi ?", "theme": "business" }, { "id": "ndax-dafa-yem-ak-voltage-bu-senegaal", "en": "Is it compatible with Senegalese voltage?", "fr": "Est-ce compatible avec le voltage s\xE9n\xE9galais ?", "wo": "Ndax dafa yem ak voltage bu Senegaal ?", "theme": "business" }, { "id": "ndax-am-nga-facture-bu-njekk-bi", "en": "Do you have the original invoice?", "fr": "Avez-vous la facture d'origine ?", "wo": "Ndax am nga facture bu nj\xEBkk bi ?", "theme": "business" }, { "id": "ndax-chargeur-bi-dafa-bokk", "en": "Is the charger included?", "fr": "Le chargeur est-il inclus ?", "wo": "Ndax chargeur bi dafa bokk ?", "theme": "business" }, { "id": "naata-la-capacite-batterie-bi", "en": "What is the battery capacity?", "fr": "Quelle est la capacit\xE9 de la batterie ?", "wo": "\xD1aata la capacit\xE9 batterie bi ?", "theme": "business" }, { "id": "ndax-men-naa-fey-ci-mobile-money", "en": "Can I pay by mobile money?", "fr": "Puis-je payer par mobile money ?", "wo": "Ndax m\xEBn naa fey ci mobile money ?", "theme": "business" }, { "id": "am-nga-service-apres-vente", "en": "Do you have an after-sales service?", "fr": "Avez-vous un service apr\xE8s-vente ?", "wo": "Am nga service apr\xE8s-vente ?", "theme": "business" }, { "id": "panneau-solaire-ngir-ferme-bi", "en": "Solar panel for the farm", "fr": "Panneau solaire pour la ferme", "wo": "Panneau solaire ngir ferme bi", "theme": "business" }, { "id": "ndax-meuble-bii-men-nan-ko-wacce", "en": "Is this furniture disassemblable?", "fr": "Ce meuble est-il d\xE9montable ?", "wo": "Ndax meuble bii m\xEBn na\xF1 ko w\xE0cce ?", "theme": "business" }, { "id": "lan-matiere-lanu-jefandikoo", "en": "What material is used?", "fr": "Quelle mati\xE8re est utilis\xE9e ?", "wo": "Lan mati\xE8re la\xF1u j\xEBfandikoo ?", "theme": "business" }, { "id": "ndax-dinan-ko-yonnee-ci-ker-gi", "en": "Do you deliver to home?", "fr": "Livrez-vous \xE0 domicile ?", "wo": "Ndax dina\xF1 ko y\xF3nnee ci k\xEBr gi ?", "theme": "business" }, { "id": "ndax-men-naa-fey-ci-plusieurs-fois", "en": "Can I pay in instalments?", "fr": "Puis-je payer en plusieurs fois ?", "wo": "Ndax m\xEBn naa fey ci plusieurs fois ?", "theme": "business" }, { "id": "ndax-meuble-bii-dafa-traite-ci-termites", "en": "Is the furniture treated against termites?", "fr": "Le meuble est-il trait\xE9 contre les termites ?", "wo": "Ndax meuble bii dafa trait\xE9 ci termites ?", "theme": "business" }, { "id": "am-nga-service-montage", "en": "Do you offer an assembly service?", "fr": "Proposez-vous un service de montage ?", "wo": "Am nga service montage ?", "theme": "business" }, { "id": "caisse-ngir-denc-legumes-yi", "en": "Storage crates for vegetables", "fr": "Caisses de stockage pour l\xE9gumes", "wo": "Caisse ngir denc l\xE9gumes yi", "theme": "business" }, { "id": "tomaat-ak-sooble", "en": "Fresh tomatoes and onions", "fr": "Tomates et oignons frais", "wo": "Tomaat ak sooble", "theme": "business" }, { "id": "naata-fan-ngir-livraison-bi", "en": "What is the delivery time?", "fr": "Quel est le d\xE9lai de livraison ?", "wo": "\xD1aata fan ngir livraison bi ?", "theme": "business" }, { "id": "ndax-soxla-nga-visa-d-affaires", "en": "Do you need a business visa?", "fr": "Avez-vous besoin d'un visa d'affaires ?", "wo": "Ndax soxla nga visa d'affaires ?", "theme": "business" }, { "id": "fan-la-bureau-douane-bi", "en": "Where is the customs office?", "fr": "O\xF9 est le bureau de douane ?", "wo": "Fan la bureau douane bi ?", "theme": "business" }, { "id": "maa-ngi-wut-fournisseur-bu-woor", "en": "I'm looking for a reliable supplier", "fr": "Je cherche un fournisseur fiable", "wo": "Maa ngi wut fournisseur bu w\xF3or", "theme": "business" }, { "id": "naata-la-prix-fob-bi", "en": "What is the FOB price?", "fr": "Quel est le prix FOB ?", "wo": "\xD1aata la prix FOB bi ?", "theme": "business" }, { "id": "begg-naa-envoi-bu-bokk-ak-yeneen", "en": "I prefer a groupage shipment", "fr": "Je pr\xE9f\xE8re un envoi group\xE9", "wo": "B\xEBgg naa envoi bu bokk ak yeneen", "theme": "business" }, { "id": "naata-cbm-la-sama-marsandiz-am", "en": "How many CBM is my cargo?", "fr": "Combien de CBM fait ma marchandise ?", "wo": "\xD1aata CBM la sama marsandiz am ?", "theme": "business" }, { "id": "soxla-naa-bill-of-lading-bi", "en": "I need the Bill of Lading", "fr": "J'ai besoin du connaissement (Bill of Lading)", "wo": "Soxla naa Bill of Lading bi", "theme": "business" }, { "id": "fan-la-packing-list-bi", "en": "Where is the packing list?", "fr": "O\xF9 est la liste de colisage (packing list) ?", "wo": "Fan la packing list bi ?", "theme": "business" }, { "id": "ban-incoterm-nga-jefandikoo", "en": "Which Incoterm do you use?", "fr": "Quel Incoterm utilisez-vous ?", "wo": "Ban Incoterm nga j\xEBfandikoo ?", "theme": "business" }, { "id": "am-nga-assurance-transport", "en": "Do you have transport insurance?", "fr": "Avez-vous une assurance transport ?", "wo": "Am nga assurance transport ?", "theme": "business" }], "dialogues": [{ "id": "general-travel", "theme": "general:travel", "lignes": [{ "role": "A", "en": "Where is the airport?", "fr": "O\xF9 est l'a\xE9roport ?", "wo": "Fan la ayropoor bi nekk ?" }, { "role": "B", "en": "It's ten minutes from here by taxi.", "fr": "C'est \xE0 dix minutes d'ici en taxi.", "wo": "Fukki minut la ci taksi bu j\xF3ge fii." }, { "role": "A", "en": "What time does my flight leave?", "fr": "\xC0 quelle heure part mon vol ?", "wo": "Ci ban waxtu la sama tukki avion di dem ?" }, { "role": "B", "en": "Your flight leaves at eight in the morning.", "fr": "Votre vol part \xE0 huit heures du matin.", "wo": "Sa tukki avion bi dafay dem ci jur\xF3om \xF1ett ci suba." }, { "role": "A", "en": "How do you usually travel to work?", "fr": "Comment allez-vous d'habitude au travail ?", "wo": "Naka nga di dem ligg\xE9ey ?" }, { "role": "B", "en": "I take the bus every morning.", "fr": "Je prends le bus tous les matins.", "wo": "Damay j\xEBl bus bi suba su nekk." }, { "role": "A", "en": "Does this truck go to the Thi\xE8s market?", "fr": "Est-ce que ce camion va au march\xE9 de Thi\xE8s ?", "wo": "Ndax kamiyon bii dafay dem marse bu Thi\xE8s ?" }, { "role": "B", "en": "Yes, it leaves at seven with fresh vegetables.", "fr": "Oui, il part \xE0 sept heures avec des l\xE9gumes frais.", "wo": "Waaw, dafay dem ci jur\xF3om \xF1aar ak l\xE9gumes yu bees." }, { "role": "A", "en": "How much for my bags?", "fr": "Combien pour mes bagages ?", "wo": "\xD1aata la sama bagaas yi ?" }, { "role": "B", "en": "Two thousand francs.", "fr": "Deux mille francs.", "wo": "\xD1aar junni franc la." }] }, { "id": "general-health", "theme": "general:health", "lignes": [{ "role": "A", "en": "Are you okay?", "fr": "\xC7a va ?", "wo": "Yaa ngi ci j\xE0mm ?" }, { "role": "B", "en": "No, I feel sick. I need a doctor.", "fr": "Non, je me sens malade. J'ai besoin d'un m\xE9decin.", "wo": "D\xE9ed\xE9et, dama feebar. Dama war a gis doktoor." }, { "role": "A", "en": "What is wrong?", "fr": "Qu'est-ce qui ne va pas ?", "wo": "Lan la ?" }, { "role": "B", "en": "I have a headache and a fever.", "fr": "J'ai mal \xE0 la t\xEAte et de la fi\xE8vre.", "wo": "Sama bopp dafay metti te dama am t\xE0ngoor." }, { "role": "A", "en": "Since when do you feel like this?", "fr": "Depuis quand vous sentez-vous comme \xE7a ?", "wo": "Ka\xF1 nga t\xE0mbali feebar ?" }, { "role": "B", "en": "Since yesterday evening.", "fr": "Depuis hier soir.", "wo": "D\xE9mb ci ngoon." }, { "role": "A", "en": "You look tired.", "fr": "Vous avez l'air fatigu\xE9.", "wo": "Dafa mel ni yaa ngi sonn." }, { "role": "B", "en": "I worked in the field all day, and I did not drink water.", "fr": "J'ai travaill\xE9 dans le champ toute la journ\xE9e, et je n'ai pas bu d'eau.", "wo": "Ligg\xE9ey naa ci tool bi b\xE9s bi b\xE9pp te naanul ndox." }, { "role": "A", "en": "You must drink water and rest.", "fr": "Vous devez boire de l'eau et vous reposer.", "wo": "War nga naan ndox te noppalu." }, { "role": "B", "en": "You are right, thank you.", "fr": "Vous avez raison, merci.", "wo": "D\xEBgg nga, j\xEBr\xEBj\xEBf." }] }, { "id": "general-food", "theme": "general:food", "lignes": [{ "role": "A", "en": "Can I have the menu, please?", "fr": "Puis-je avoir le menu, s'il vous pla\xEEt ?", "wo": "M\xEBn naa am menu bi, su la neexee ?" }, { "role": "B", "en": "Of course, here you are.", "fr": "Bien s\xFBr, voici.", "wo": "Waaw, j\xEBl ko." }, { "role": "A", "en": "What do you recommend today?", "fr": "Que recommandez-vous aujourd'hui ?", "wo": "Lan nga ma digal tey ?" }, { "role": "B", "en": "The fish with rice is delicious today.", "fr": "Le poisson avec du riz est d\xE9licieux aujourd'hui.", "wo": "J\xEBn wu \xF1u def ak ceeb neex na lool tey." }, { "role": "A", "en": "What would you like to drink?", "fr": "Que voulez-vous boire ?", "wo": "Lan nga b\xEBgg a naan ?" }, { "role": "B", "en": "Just water, please.", "fr": "Juste de l'eau, s'il vous pla\xEEt.", "wo": "Ndox rekk, su la neexee." }, { "role": "A", "en": "What would you like?", "fr": "Que d\xE9sirez-vous ?", "wo": "Lan nga b\xEBgg ?" }, { "role": "B", "en": "Rice with chicken, please.", "fr": "Du riz au poulet, s'il vous pla\xEEt.", "wo": "Ceeb ak ginaar, su la neexee." }, { "role": "A", "en": "Do you want vegetables?", "fr": "Voulez-vous des l\xE9gumes ?", "wo": "Ndax b\xEBgg nga l\xE9gumes ?" }, { "role": "B", "en": "Yes, and some water.", "fr": "Oui, et de l'eau.", "wo": "Waaw, ak ndox." }] }, { "id": "general-time", "theme": "general:time", "lignes": [{ "role": "A", "en": "What time is it?", "fr": "Quelle heure est-il ?", "wo": "Ban waxtu la ?" }, { "role": "B", "en": "It's three o'clock.", "fr": "Il est trois heures.", "wo": "\xD1ett waxtu la." }, { "role": "A", "en": "What time does the meeting start?", "fr": "\xC0 quelle heure commence la r\xE9union ?", "wo": "Ci ban waxtu la ndaje mi di t\xE0mbali ?" }, { "role": "B", "en": "It starts tomorrow at ten o'clock.", "fr": "Elle commence demain \xE0 dix heures.", "wo": "Dafay t\xE0mbali \xEBll\xEBg ci fukk." }, { "role": "A", "en": "What time do you usually wake up?", "fr": "\xC0 quelle heure vous r\xE9veillez-vous d'habitude ?", "wo": "Ci ban waxtu nga di j\xF3g ?" }, { "role": "B", "en": "I wake up at six every morning.", "fr": "Je me r\xE9veille \xE0 six heures tous les matins.", "wo": "Damay j\xF3g ci jur\xF3om benn suba su nekk." }, { "role": "A", "en": "When does the rainy season start?", "fr": "Quand commence la saison des pluies ?", "wo": "Ka\xF1 la nawet di t\xE0mbali ?" }, { "role": "B", "en": "In July. We plant groundnuts after the first rain.", "fr": "En juillet. Nous plantons les arachides apr\xE8s la premi\xE8re pluie.", "wo": "Ci sulet. Danuy ji gerte gannaaw taw bi nj\xEBkk." }, { "role": "A", "en": "What time does the market open?", "fr": "\xC0 quelle heure ouvre le march\xE9 ?", "wo": "Ci ban waxtu la marse bi di ubbeeku ?" }, { "role": "B", "en": "At six o'clock.", "fr": "\xC0 six heures.", "wo": "Ci jur\xF3om benn." }] }, { "id": "business-bazar", "theme": "business", "lignes": [{ "role": "client", "scene": "", "en": "Can this piece of furniture be taken apart?", "fr": "Ce meuble est-il d\xE9montable ?", "wo": "Ndax meuble bii m\xEBn na\xF1 ko w\xE0cce ?" }, { "role": "marchand", "scene": "", "en": "Yes, we can dismantle it to make delivery easier.", "fr": "Oui, on peut le d\xE9monter pour faciliter la livraison.", "wo": "Waaw, m\xEBn na\xF1 ko w\xE0cce ngir livraison bi yomb." }, { "role": "client", "scene": "", "en": "Do you deliver to homes?", "fr": "Est-ce que vous livrez \xE0 domicile ?", "wo": "Ndax dina\xF1 ko y\xF3nnee ci k\xEBr gi ?" }, { "role": "marchand", "scene": "", "en": "Yes, delivery costs extra, it is twenty thousand.", "fr": "Oui, la livraison est en plus, \xE7a fait vingt mille.", "wo": "Waaw, livraison bi dafa ci kanam, \xF1aata-fukk junni la." }, { "role": "client", "scene": "", "en": "Can I pay in installments?", "fr": "Puis-je payer en plusieurs fois ?", "wo": "Ndax m\xEBn naa fey ci plusieurs fois ?" }, { "role": "marchand", "scene": "", "en": "Yes, you can pay in three installments over three months.", "fr": "Oui, tu peux payer en trois fois, sur trois mois.", "wo": "Waaw, m\xEBn nga fey \xF1etti yoon, ci \xF1etti weer." }, { "role": "client", "scene": "\u{1F345} Sc\xE8ne 2 : baana-baana et producteur de l\xE9gumes", "en": "How much is a kilo of tomatoes?", "fr": "Combien co\xFBte le kilo de tomates ?", "wo": "\xD1aata la tomaat bi ci kilo ?" }, { "role": "marchand", "scene": "", "en": "Five hundred francs a kilo.", "fr": "Cinq cents francs le kilo.", "wo": "Jur\xF3om t\xE9em\xE9er la ci kilo bi." }, { "role": "client", "scene": "", "en": "It is too expensive. Lower the price a little.", "fr": "C'est cher. Baisse un peu pour moi.", "wo": "Dafa seer. W\xE0\xF1\xF1il ma tuuti." }, { "role": "marchand", "scene": "", "en": "Okay, four hundred francs.", "fr": "D'accord, quatre cents francs.", "wo": "Baax na, \xF1eent t\xE9em\xE9er la." }, { "role": "client", "scene": "", "en": "Thank you. I will buy three kilos.", "fr": "Merci. J'ach\xE8te trois kilos.", "wo": "J\xEBr\xEBj\xEBf. J\xEBnd naa \xF1ett kilo." }] }], "ielts": [{ "id": "ielts-shopping-1a-0", "test": "shopping", "sujet": "Shopping", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-shopping-1a-1", "test": "shopping", "sujet": "Shopping", "phase": "1a", "question": "Where are you from?" }, { "id": "ielts-shopping-1a-2", "test": "shopping", "sujet": "Shopping", "phase": "1a", "question": "What do you do?" }, { "id": "ielts-shopping-1b-0", "test": "shopping", "sujet": "Shopping", "phase": "1b", "question": "Do you like shopping?" }, { "id": "ielts-shopping-1b-1", "test": "shopping", "sujet": "Shopping", "phase": "1b", "question": "Where do you usually shop?" }, { "id": "ielts-shopping-1b-2", "test": "shopping", "sujet": "Shopping", "phase": "1b", "question": "What do you usually buy?" }, { "id": "ielts-shopping-1b-3", "test": "shopping", "sujet": "Shopping", "phase": "1b", "question": "Do you shop with friends or alone?" }, { "id": "ielts-shopping-1b-4", "test": "shopping", "sujet": "Shopping", "phase": "1b", "question": "Do you like markets?" }, { "id": "ielts-shopping-2a-0", "test": "shopping", "sujet": "Shopping", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-shopping-2a-1", "test": "shopping", "sujet": "Shopping", "phase": "2a", "question": "What is the woman doing?" }, { "id": "ielts-shopping-2b-0", "test": "shopping", "sujet": "Shopping", "phase": "2b", "question": "Why do people like markets?" }, { "id": "ielts-shopping-2b-1", "test": "shopping", "sujet": "Shopping", "phase": "2b", "question": "What do you think about the prices at the market?" }, { "id": "ielts-travel-1a-0", "test": "travel", "sujet": "Travel", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-travel-1a-1", "test": "travel", "sujet": "Travel", "phase": "1a", "question": "Where do you live?" }, { "id": "ielts-travel-1a-2", "test": "travel", "sujet": "Travel", "phase": "1a", "question": "What is your job?" }, { "id": "ielts-travel-1b-0", "test": "travel", "sujet": "Travel", "phase": "1b", "question": "Do you like to travel?" }, { "id": "ielts-travel-1b-1", "test": "travel", "sujet": "Travel", "phase": "1b", "question": "Have you traveled by bus or by plane?" }, { "id": "ielts-travel-1b-2", "test": "travel", "sujet": "Travel", "phase": "1b", "question": "Where would you like to go?" }, { "id": "ielts-travel-1b-3", "test": "travel", "sujet": "Travel", "phase": "1b", "question": "Do you travel with family?" }, { "id": "ielts-travel-1b-4", "test": "travel", "sujet": "Travel", "phase": "1b", "question": "What do you take with you when you travel?" }, { "id": "ielts-travel-2a-0", "test": "travel", "sujet": "Travel", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-travel-2a-1", "test": "travel", "sujet": "Travel", "phase": "2a", "question": "What are the people doing?" }, { "id": "ielts-travel-2b-0", "test": "travel", "sujet": "Travel", "phase": "2b", "question": "Why do people travel?" }, { "id": "ielts-travel-2b-1", "test": "travel", "sujet": "Travel", "phase": "2b", "question": "What is important when you travel?" }, { "id": "ielts-health-1a-0", "test": "health", "sujet": "Health", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-health-1a-1", "test": "health", "sujet": "Health", "phase": "1a", "question": "How old are you?" }, { "id": "ielts-health-1a-2", "test": "health", "sujet": "Health", "phase": "1a", "question": "Where do you live?" }, { "id": "ielts-health-1b-0", "test": "health", "sujet": "Health", "phase": "1b", "question": "Do you feel well today?" }, { "id": "ielts-health-1b-1", "test": "health", "sujet": "Health", "phase": "1b", "question": "Do you go to the doctor?" }, { "id": "ielts-health-1b-2", "test": "health", "sujet": "Health", "phase": "1b", "question": "What do you do to stay healthy?" }, { "id": "ielts-health-1b-3", "test": "health", "sujet": "Health", "phase": "1b", "question": "Do you eat healthy food?" }, { "id": "ielts-health-1b-4", "test": "health", "sujet": "Health", "phase": "1b", "question": "Do you exercise?" }, { "id": "ielts-health-2a-0", "test": "health", "sujet": "Health", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-health-2a-1", "test": "health", "sujet": "Health", "phase": "2a", "question": "How does the patient feel?" }, { "id": "ielts-health-2b-0", "test": "health", "sujet": "Health", "phase": "2b", "question": "Why is it important to stay healthy?" }, { "id": "ielts-health-2b-1", "test": "health", "sujet": "Health", "phase": "2b", "question": "What do you do when you are sick?" }, { "id": "ielts-food-1a-0", "test": "food", "sujet": "Food", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-food-1a-1", "test": "food", "sujet": "Food", "phase": "1a", "question": "Where are you from?" }, { "id": "ielts-food-1a-2", "test": "food", "sujet": "Food", "phase": "1a", "question": "What do you do?" }, { "id": "ielts-food-1b-0", "test": "food", "sujet": "Food", "phase": "1b", "question": "What is your favourite food?" }, { "id": "ielts-food-1b-1", "test": "food", "sujet": "Food", "phase": "1b", "question": "Do you cook at home?" }, { "id": "ielts-food-1b-2", "test": "food", "sujet": "Food", "phase": "1b", "question": "What do you eat for breakfast?" }, { "id": "ielts-food-1b-3", "test": "food", "sujet": "Food", "phase": "1b", "question": "Do you like Senegalese food?" }, { "id": "ielts-food-1b-4", "test": "food", "sujet": "Food", "phase": "1b", "question": "Do you eat with your family?" }, { "id": "ielts-food-2a-0", "test": "food", "sujet": "Food", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-food-2a-1", "test": "food", "sujet": "Food", "phase": "2a", "question": "What are they cooking?" }, { "id": "ielts-food-2b-0", "test": "food", "sujet": "Food", "phase": "2b", "question": "Why is food important in your culture?" }, { "id": "ielts-food-2b-1", "test": "food", "sujet": "Food", "phase": "2b", "question": "What is your favourite meal?" }], "ecoute": [{ "id": "ecoute-2", "audio": "The market closes at six o'clock today because of the holiday.", "question": "What time does the market close today?", "options": ["Five o'clock", "Six o'clock", "Seven o'clock"], "reponse": 1 }, { "id": "ecoute-3", "audio": "Excuse me, your flight to Paris is delayed. It will now leave at three thirty.", "question": "What happened to the flight?", "options": ["It is cancelled", "It is delayed", "It left early"], "reponse": 1 }], "quiz": [{ "id": "quiz-travel-0", "theme": "general:travel", "q": "I need a ___ to travel.", "options": ["passport", "password", "passeport"], "reponse": 0, "explication": "Orthographe correcte en anglais : passport." }, { "id": "quiz-travel-1", "theme": "general:travel", "q": "The flight ___ at 8am.", "options": ["leaves", "leave", "leaving"], "reponse": 0, "explication": "Avec it, le verbe prend -s : leaves." }, { "id": "quiz-travel-2", "theme": "general:travel", "q": "Is this bus ___ to the airport?", "options": ["going", "go", "goes"], "reponse": 0, "explication": "Pr\xE9sent continu : is + going." }, { "id": "quiz-travel-3", "theme": "general:travel", "q": "The truck ___ at seven o'clock.", "options": ["leave", "leaves", "leaving"], "reponse": 1, "explication": "The truck = it : verbe + s (leaves)." }, { "id": "quiz-health-0", "theme": "general:health", "q": "I ___ sick today.", "options": ["feel", "feels", "feeling"], "reponse": 0, "explication": "Avec I, le verbe reste \xE0 la base : feel." }, { "id": "quiz-health-1", "theme": "general:health", "q": "Call a doctor, please! It's an ___.", "options": ["emergency", "emergent", "emergently"], "reponse": 0, "explication": "Nom : emergency (une urgence)." }, { "id": "quiz-health-2", "theme": "general:health", "q": "Where is the ___?", "options": ["hospital", "hospitel", "hopital"], "reponse": 0, "explication": "Orthographe correcte : hospital." }, { "id": "quiz-health-3", "theme": "general:health", "q": "You ___ drink water when it is hot.", "options": ["must", "are", "does"], "reponse": 0, "explication": "\xAB must \xBB exprime une obligation ou un conseil fort." }, { "id": "quiz-food-0", "theme": "general:food", "q": "I would like ___ water, please.", "options": ["some", "a", "an"], "reponse": 0, "explication": "Ind\xE9nombrable : some water." }, { "id": "quiz-food-1", "theme": "general:food", "q": "This food is very ___.", "options": ["delicious", "deliciously", "delicous"], "reponse": 0, "explication": "Adjectif : delicious." }, { "id": "quiz-food-2", "theme": "general:food", "q": "Can I have the bill, ___?", "options": ["please", "plz", "pls"], "reponse": 0, "explication": "Anglais \xE9crit correct : please." }, { "id": "quiz-food-3", "theme": "general:food", "q": "I ___ like rice, please.", "options": ["would", "am", "is"], "reponse": 0, "explication": "\xAB I would like \xBB est la fa\xE7on polie de commander." }, { "id": "quiz-time-0", "theme": "general:time", "q": "What ___ is it?", "options": ["time", "times", "timing"], "reponse": 0, "explication": "Demander l'heure : What time is it?" }, { "id": "quiz-time-1", "theme": "general:time", "q": "See you ___!", "options": ["tomorrow", "tomorow", "tomorrows"], "reponse": 0, "explication": "Orthographe correcte : tomorrow." }, { "id": "quiz-time-2", "theme": "general:time", "q": "There ___ five people in my class.", "options": ["are", "is", "be"], "reponse": 0, "explication": "Pluriel : there are." }, { "id": "quiz-time-3", "theme": "general:time", "q": "The market opens ___ six o'clock.", "options": ["in", "at", "on"], "reponse": 1, "explication": "Pour une heure pr\xE9cise : \xAB at \xBB." }] }, "avance": { "titre": "Avanc\xE9", "rang": 3, "phrases": [{ "id": "naan-visa", "en": "Visa application", "fr": "Demande de visa", "wo": "\xD1aan visa", "theme": "general:visa" }, { "id": "paspoor-bi", "en": "Passport", "fr": "Passeport", "wo": "Paspoor bi", "theme": "general:visa" }, { "id": "sabab-bu-tukki-bi", "en": "Purpose of visit", "fr": "Motif du s\xE9jour", "wo": "Sabab bu tukki bi", "theme": "general:visa" }, { "id": "maa-ngi-dem-gis-sama-njabootu", "en": "I am visiting my family", "fr": "Je rends visite \xE0 ma famille", "wo": "Maa ngi dem gis sama njabootu", "theme": "general:visa" }, { "id": "bilee-bu-delsi", "en": "Return ticket", "fr": "Billet retour", "wo": "Bilee bu d\xE9lsi", "theme": "general:visa" }, { "id": "naata-bes-ngay-toog", "en": "How long will you stay?", "fr": "Combien de temps allez-vous rester ?", "wo": "\xD1aata b\xE9s ngay toog ?", "theme": "general:visa" }, { "id": "dinaa-toog-naari-ayubes", "en": "I will stay for two weeks", "fr": "Je vais rester deux semaines", "wo": "Dinaa toog \xF1aari ayub\xE9s", "theme": "general:visa" }, { "id": "kan-moo-di-fay-sa-tukki", "en": "Who is paying for your trip?", "fr": "Qui finance votre voyage ?", "wo": "Kan moo di fay sa tukki ?", "theme": "general:visa" }, { "id": "man-laa-koy-fay-sama-bopp", "en": "I am paying for myself", "fr": "Je finance moi-m\xEAme mon voyage", "wo": "Man laa koy fay sama bopp", "theme": "general:visa" }, { "id": "ndax-am-nga-berab-bu-nga-di-nelaw-bu-nga-reserve", "en": "Do you have accommodation booked?", "fr": "Avez-vous un h\xE9bergement r\xE9serv\xE9 ?", "wo": "Ndax am nga b\xE9rab bu nga di nelaw bu nga reserve ?", "theme": "general:visa" }, { "id": "am-naa-sama-njaay-bu-ndaw-ci-senegaal", "en": "I own a small business in Senegal", "fr": "Je poss\xE8de une petite entreprise au S\xE9n\xE9gal", "wo": "Am naa sama njaay bu ndaw ci Senegaal", "theme": "general:visa" }, { "id": "dinaa-delsi-sama-ker-gannaaw-tukki-bi", "en": "I will return home after my trip", "fr": "Je rentrerai chez moi apr\xE8s mon voyage", "wo": "Dinaa d\xE9lsi sama k\xEBr gannaaw tukki bi", "theme": "general:visa" }, { "id": "damay-jend-marsandiis-ngir-jaay-ko-ci-sama-boutik", "en": "I buy goods to sell in my shop", "fr": "J'ach\xE8te des marchandises \xE0 vendre dans ma boutique", "wo": "Damay j\xEBnd marsandiis ngir jaay ko ci sama boutik", "theme": "general:visa" }, { "id": "maa-ngi-seet-apartema", "en": "I am looking for an apartment", "fr": "Je cherche un appartement", "wo": "Maa ngi seet apartema", "theme": "general:housing" }, { "id": "naata-la-loyer-bi", "en": "How much is the rent?", "fr": "Quel est le montant du loyer ?", "wo": "\xD1aata la loyer bi ?", "theme": "general:housing" }, { "id": "ndax-caution-bi-mu-ngi-ci", "en": "Is the deposit included?", "fr": "La caution est-elle incluse ?", "wo": "Ndax caution bi mu ngi ci ?", "theme": "general:housing" }, { "id": "boroom-ker-gi", "en": "Landlord", "fr": "Propri\xE9taire", "wo": "Boroom k\xEBr gi", "theme": "general:housing" }, { "id": "kiraayekat", "en": "Tenant", "fr": "Locataire", "wo": "Kiraayekat", "theme": "general:housing" }, { "id": "kura-bi-du-liggeey", "en": "The electricity is not working", "fr": "L'\xE9lectricit\xE9 ne fonctionne pas", "wo": "Kura\u014B bi du ligg\xE9ey", "theme": "general:housing" }, { "id": "men-naa-gis-ker-gi", "en": "Can I visit the house?", "fr": "Puis-je visiter la maison ?", "wo": "M\xEBn naa gis k\xEBr gi ?", "theme": "general:housing" }, { "id": "naata-piece-la-am", "en": "How many rooms are there?", "fr": "Combien de pi\xE8ces y a-t-il ?", "wo": "\xD1aata pi\xE8ce la am ?", "theme": "general:housing" }, { "id": "dama-war-a-sinye-kontra-ker-gi", "en": "I need to sign the lease", "fr": "Je dois signer le bail", "wo": "Dama war a sinye kontra k\xEBr gi", "theme": "general:housing" }, { "id": "quartier-bi-dafa-dal", "en": "The neighbourhood is quiet", "fr": "Le quartier est calme", "wo": "Quartier bi dafa dal", "theme": "general:housing" }, { "id": "am-naa-tool-bu-ndaw-ci-gannaaw-ker-gi", "en": "I have a small garden behind the house", "fr": "J'ai un petit jardin derri\xE8re la maison", "wo": "Am naa tool bu ndaw ci gannaaw k\xEBr gi", "theme": "general:housing" }, { "id": "loyer-bi-fanweer-junni-franc-la-ci-weer-wi", "en": "The rent is thirty thousand francs a month", "fr": "Le loyer est de trente mille francs par mois", "wo": "Loyer bi fanweer junni franc la ci weer wi", "theme": "general:housing" }, { "id": "semences-yi", "en": "Seeds", "fr": "Semences", "wo": "Semences yi", "theme": "general:agri" }, { "id": "engrais-bi", "en": "Fertilizer", "fr": "Engrais", "wo": "Engrais bi", "theme": "general:agri" }, { "id": "tool-bi", "en": "Field", "fr": "Champ", "wo": "Tool bi", "theme": "general:agri" }, { "id": "ngoob-mi", "en": "Harvest", "fr": "R\xE9colte", "wo": "Ng\xF3ob mi", "theme": "general:agri" }, { "id": "beykat-bi", "en": "Farmer", "fr": "Agriculteur", "wo": "Beykat bi", "theme": "general:agri" }, { "id": "damaa-soxla-semences-ngir-sama-tool", "en": "I need seeds for my field", "fr": "J'ai besoin de semences pour mon champ", "wo": "Damaa soxla semences ngir sama tool", "theme": "general:agri" }, { "id": "naata-la-benn-saaku-engrais", "en": "How much is a bag of fertilizer?", "fr": "Combien co\xFBte un sac d'engrais ?", "wo": "\xD1aata la benn saaku engrais ?", "theme": "general:agri" }, { "id": "ndax-semences-yii-danuy-sax-bu-baax-ci-nawet", "en": "Do these seeds grow well in the rainy season?", "fr": "Ces semences poussent-elles bien pendant la saison des pluies ?", "wo": "Ndax semences yii da\xF1uy sax bu baax ci nawet ?", "theme": "general:agri" }, { "id": "damay-sotti-ndox-ci-sama-gancax-yi-suba-su-nekk", "en": "I water my crops every morning", "fr": "J'arrose mes cultures chaque matin", "wo": "Damay sotti ndox ci sama g\xE0ncax yi suba su nekk", "theme": "general:agri" }, { "id": "ngoob-mi-baax-na-at-mii", "en": "The harvest was good this year", "fr": "La r\xE9colte a \xE9t\xE9 bonne cette ann\xE9e", "wo": "Ng\xF3ob mi baax na at mii", "theme": "general:agri" }, { "id": "damay-jaay-sama-legumes-ci-marse-bu-thies", "en": "I sell my vegetables at the Thi\xE8s market", "fr": "Je vends mes l\xE9gumes au march\xE9 de Thi\xE8s", "wo": "Damay jaay sama l\xE9gumes ci marse bu Thi\xE8s", "theme": "general:agri" }, { "id": "men-nga-ko-yobbu-ci-sama-tool", "en": "Can you deliver to my farm?", "fr": "Pouvez-vous livrer \xE0 ma ferme ?", "wo": "M\xEBn nga ko y\xF3bbu ci sama tool ?", "theme": "general:agri" }, { "id": "ceeb", "en": "Rice", "fr": "Riz", "wo": "Ceeb", "theme": "wolof:nourriture" }, { "id": "jen", "en": "Fish", "fr": "Poisson", "wo": "J\xEBn", "theme": "wolof:nourriture" }, { "id": "yapp", "en": "Meat", "fr": "Viande", "wo": "Y\xE0pp", "theme": "wolof:nourriture" }, { "id": "mburu", "en": "Bread", "fr": "Pain", "wo": "Mburu", "theme": "wolof:nourriture" }, { "id": "meew", "en": "Milk", "fr": "Lait", "wo": "Meew", "theme": "wolof:nourriture" }, { "id": "neex", "en": "Tasty", "fr": "D\xE9licieux", "wo": "Neex", "theme": "wolof:nourriture" }, { "id": "xiif-naa", "en": "I am hungry", "fr": "J'ai faim", "wo": "Xiif naa", "theme": "wolof:nourriture" }, { "id": "nam-bi-neex-na", "en": "This food is delicious", "fr": "Ce repas est d\xE9licieux", "wo": "\xD1am bi neex na", "theme": "wolof:nourriture" }, { "id": "begg-naa-lekk-ceeb-ak-jen", "en": "I want to eat rice and fish", "fr": "Je veux manger du riz et du poisson", "wo": "B\xEBgg naa lekk ceeb ak j\xEBn", "theme": "wolof:nourriture" }, { "id": "nu-lekk-noom", "en": "Let's eat together", "fr": "Mangeons ensemble", "wo": "Nu lekk \xF1oom", "theme": "wolof:nourriture" }, { "id": "dama-xiif", "en": "I'm hungry", "fr": "J'ai faim", "wo": "Dama xiif", "theme": "wolof:nourriture" }, { "id": "ndox-mi", "en": "The water", "fr": "L'eau", "wo": "Ndox mi", "theme": "wolof:nourriture" }, { "id": "nen", "en": "Egg", "fr": "\u0152uf", "wo": "Nen", "theme": "wolof:nourriture" }, { "id": "sooble", "en": "Onion", "fr": "Oignon", "wo": "Sooble", "theme": "wolof:nourriture" }, { "id": "gerte", "en": "Groundnut", "fr": "Arachide", "wo": "Gerte", "theme": "wolof:nourriture" }, { "id": "ganaar", "en": "Chicken", "fr": "Poulet", "wo": "Ganaar", "theme": "wolof:nourriture" }, { "id": "benn", "en": "One", "fr": "Un", "wo": "Benn", "theme": "wolof:temps" }, { "id": "naar", "en": "Two", "fr": "Deux", "wo": "\xD1aar", "theme": "wolof:temps" }, { "id": "nett", "en": "Three", "fr": "Trois", "wo": "\xD1ett", "theme": "wolof:temps" }, { "id": "suba", "en": "Tomorrow", "fr": "Demain", "wo": "Suba", "theme": "wolof:temps" }, { "id": "demb", "en": "Yesterday", "fr": "Hier", "wo": "D\xE9mb", "theme": "wolof:temps" }, { "id": "fan", "en": "Where?", "fr": "O\xF9 ?", "wo": "Fan ?", "theme": "wolof:temps" }, { "id": "ban-waxtu-la", "en": "What time is it?", "fr": "Quelle heure est-il ?", "wo": "Ban waxtu la ?", "theme": "wolof:temps" }, { "id": "dinaa-new-suba", "en": "I will come tomorrow", "fr": "Je viendrai demain", "wo": "Dinaa \xF1\xEBw suba", "theme": "wolof:temps" }, { "id": "demb-sonn-naa-ci-liggeey", "en": "I was busy yesterday", "fr": "Hier, j'\xE9tais occup\xE9(e)", "wo": "D\xE9mb, sonn naa ci ligg\xE9ey", "theme": "wolof:temps" }, { "id": "naata-nit-noo-fi-nekk", "en": "How many people are there?", "fr": "Combien de personnes y a-t-il ?", "wo": "\xD1aata nit \xF1oo fi nekk ?", "theme": "wolof:temps" }, { "id": "njel", "en": "Morning", "fr": "Matin", "wo": "Nj\xEBl", "theme": "wolof:temps" }, { "id": "guddi", "en": "Night", "fr": "Nuit", "wo": "Guddi", "theme": "wolof:temps" }, { "id": "nawet", "en": "Rainy season", "fr": "Saison des pluies", "wo": "Nawet", "theme": "wolof:temps" }, { "id": "ker", "en": "House", "fr": "Maison", "wo": "K\xEBr", "theme": "wolof:logement" }, { "id": "maa-ngi-wut-ker", "en": "I am looking for a house", "fr": "Je cherche une maison", "wo": "Maa ngi wut k\xEBr", "theme": "wolof:logement" }, { "id": "boroom-ker", "en": "Landlord", "fr": "Propri\xE9taire", "wo": "Boroom k\xEBr", "theme": "wolof:logement" }, { "id": "neeg", "en": "Room", "fr": "Chambre", "wo": "N\xE9eg", "theme": "wolof:logement" }, { "id": "kitchen", "en": "Kitchen", "fr": "Cuisine", "wo": "Kitchen", "theme": "wolof:logement" }, { "id": "ndax-men-naa-xool-ker-gi", "en": "Can I visit the house?", "fr": "Puis-je visiter la maison ?", "wo": "Ndax m\xEBn naa xool k\xEBr gi ?", "theme": "wolof:logement" }, { "id": "kuran-gi-dafa-taxaw", "en": "The electricity is not working", "fr": "L'\xE9lectricit\xE9 ne fonctionne pas", "wo": "Kuran gi dafa taxaw", "theme": "wolof:logement" }, { "id": "kow-gi-dafa-noflaay", "en": "The neighbourhood is quiet", "fr": "Le quartier est calme", "wo": "Kow gi dafa noflaay", "theme": "wolof:logement" }, { "id": "war-naa-signe-bail-bi", "en": "I need to sign the lease", "fr": "Je dois signer le bail", "wo": "War naa sign\xE9 bail bi", "theme": "wolof:logement" }, { "id": "ban-yoon-bii", "en": "What is the reference of this part?", "fr": "Quelle est la r\xE9f\xE9rence de cette pi\xE8ce ?", "wo": "Ban yoon bii ?", "theme": "business" }, { "id": "ndax-piece-bii-daf-ko-bokk-ci-fabrik-bi", "en": "Is this an original part or a copy?", "fr": "Est-ce une pi\xE8ce d'origine ou une copie ?", "wo": "Ndax pi\xE8ce bii daf ko bokk ci fabrik bi ?", "theme": "business" }, { "id": "ndax-piece-bii-oem-la-walla-aftermarket", "en": "Is this an OEM or an aftermarket part?", "fr": "C'est une pi\xE8ce OEM ou aftermarket ?", "wo": "Ndax pi\xE8ce bii OEM la walla aftermarket ?", "theme": "business" }, { "id": "maa-ngi-wut-fournisseur-bu-joge-fabrik-bi", "en": "I'm looking for a direct factory supplier", "fr": "Je cherche un fournisseur direct usine", "wo": "Maa ngi wut fournisseur bu j\xF3ge fabrik bi", "theme": "business" }, { "id": "ndax-fey-nga-ci-yuan-walla-dollar", "en": "Do you pay in Yuan or dollars ?", "fr": "Payez-vous en Yuan ou en dollars ?", "wo": "Ndax fey nga ci Yuan walla dollar ?", "theme": "business" }, { "id": "naata-weer-garanti-piece-bii-am", "en": "How many months of warranty does this part have?", "fr": "Cette pi\xE8ce a combien de mois de garantie ?", "wo": "\xD1aata weer garanti pi\xE8ce bii am ?", "theme": "business" }, { "id": "dinaa-dellusi-bu-prix-bi-neexul-ma", "en": "I will come back if the price doesn't suit me", "fr": "Je reviendrai si le prix ne me convient pas", "wo": "Dinaa dellusi bu prix bi neexul ma", "theme": "business" }, { "id": "piece-bii-ban-marque-wattu-la-yem-ak", "en": "Which vehicle brand is this part compatible with?", "fr": "Cette pi\xE8ce est compatible avec quelle marque de v\xE9hicule ?", "wo": "Pi\xE8ce bii, ban marque w\xE0ttu la yem ak ?", "theme": "business" }, { "id": "begg-naa-jend-ci-gros", "en": "I would like to buy in bulk", "fr": "Je voudrais acheter en gros", "wo": "B\xEBgg naa j\xEBnd ci gros", "theme": "business" }, { "id": "ndax-men-naa-ko-soppi-su-neexul-ma", "en": "Can I exchange it if it doesn't fit?", "fr": "Puis-je \xE9changer si \xE7a ne convient pas ?", "wo": "Ndax m\xEBn naa ko soppi su neexul ma ?", "theme": "business" }, { "id": "ndax-men-nga-ma-ko-testeel-ci-sama-kanam", "en": "Can you test the device in front of me?", "fr": "Pouvez-vous tester l'appareil devant moi ?", "wo": "Ndax m\xEBn nga ma ko testeel ci sama kanam ?", "theme": "business" }, { "id": "naata-la-ngir-un-carton-bu-mat", "en": "What is the price for a full carton?", "fr": "Quel est le prix pour un carton entier ?", "wo": "\xD1aata la ngir un carton bu mat ?", "theme": "business" }, { "id": "naata-la-ngir-ensemble-bi-bepp", "en": "How much for the whole living room set?", "fr": "Combien pour l'ensemble du salon ?", "wo": "\xD1aata la ngir ensemble bi b\xE9pp ?", "theme": "business" }, { "id": "naata-fan-ngir-fabriquer-commande-bi", "en": "What is the manufacturing time for custom orders?", "fr": "Quel est le d\xE9lai de fabrication sur commande ?", "wo": "\xD1aata fan ngir fabriquer commande bi ?", "theme": "business" }, { "id": "ndax-men-naa-xool-catalogue-modeles-yi", "en": "Can I see a catalogue of models?", "fr": "Puis-je voir un catalogue de mod\xE8les ?", "wo": "Ndax m\xEBn naa xool catalogue mod\xE8les yi ?", "theme": "business" }, { "id": "naata-la-transport-bu-conteneur", "en": "How much does transport by container cost?", "fr": "Combien co\xFBte le transport par conteneur ?", "wo": "\xD1aata la transport bu conteneur ?", "theme": "business" }, { "id": "naata-fan-ngir-dedouaner-ci-port-dakar", "en": "How many days to clear customs at the Port of Dakar?", "fr": "Combien de jours pour d\xE9douaner au Port de Dakar ?", "wo": "\xD1aata fan ngir d\xE9douaner ci Port Dakar ?", "theme": "business" }, { "id": "ndax-nangu-nga-fey-ci-acompte-topp-solde-bi", "en": "Do you accept a deposit then balance payment?", "fr": "Acceptez-vous un paiement par acompte puis solde ?", "wo": "Ndax nangu nga fey ci acompte, topp solde bi ?", "theme": "business" }, { "id": "naata-fan-la-devis-bi-dekk", "en": "What is the validity period of the quote?", "fr": "Quelle est la dur\xE9e de validit\xE9 du devis ?", "wo": "\xD1aata fan la devis bi d\xEBkk ?", "theme": "business" }], "dialogues": [{ "id": "general-visa", "theme": "general:visa", "lignes": [{ "role": "A", "en": "What is the purpose of your visit?", "fr": "Quel est le motif de votre visite ?", "wo": "Lan moo tax nga di tukki ?" }, { "role": "B", "en": "I am visiting my family for two weeks.", "fr": "Je rends visite \xE0 ma famille pendant deux semaines.", "wo": "Maa ngi dem gis sama njabootu \xF1aari ayub\xE9s." }, { "role": "A", "en": "Do you have a return ticket?", "fr": "Avez-vous un billet retour ?", "wo": "Ndax am nga bilee bu d\xE9lsi ?" }, { "role": "B", "en": "Yes, I have my return ticket and my hotel booking.", "fr": "Oui, j'ai mon billet retour et ma r\xE9servation d'h\xF4tel.", "wo": "Waaw, am naa sama bilee bu d\xE9lsi ak sama reservation bu otel." }, { "role": "A", "en": "Why do you want to travel?", "fr": "Pourquoi voulez-vous voyager ?", "wo": "Lu tax nga b\xEBgg a tukki ?" }, { "role": "B", "en": "I want to buy goods for my business.", "fr": "Je veux acheter des marchandises pour mon commerce.", "wo": "Dama b\xEBgg j\xEBnd marsandiis ngir sama njaay." }, { "role": "A", "en": "Will you come back to Senegal?", "fr": "Reviendrez-vous au S\xE9n\xE9gal ?", "wo": "Ndax dinga d\xE9lsi Senegaal ?" }, { "role": "B", "en": "Yes, my family and my shop are there.", "fr": "Oui, ma famille et ma boutique y sont.", "wo": "Waaw, sama njabootu ak sama boutik \xF1u ngi fa." }] }, { "id": "general-housing", "theme": "general:housing", "lignes": [{ "role": "A", "en": "How much is the rent for this apartment?", "fr": "Combien co\xFBte le loyer de cet appartement ?", "wo": "\xD1aata la loyer apartema bii ?" }, { "role": "B", "en": "It is fifty thousand francs, deposit included.", "fr": "C'est cinquante mille francs, caution comprise.", "wo": "Jur\xF3om fukk junni franc la, ak caution bi." }, { "role": "A", "en": "Can I visit before I decide?", "fr": "Puis-je visiter avant de d\xE9cider ?", "wo": "M\xEBn naa gis balaa may t\xE0nn ?" }, { "role": "B", "en": "Yes, of course, come tomorrow morning.", "fr": "Oui, bien s\xFBr, venez demain matin.", "wo": "Waaw, d\xEBgg la, \xF1\xEBwal \xEBll\xEBg ci suba." }, { "role": "A", "en": "Do you have a garden?", "fr": "Avez-vous un jardin ?", "wo": "Ndax am nga tool ?" }, { "role": "B", "en": "Yes, I grow tomatoes and onions behind the house.", "fr": "Oui, je cultive des tomates et des oignons derri\xE8re la maison.", "wo": "Waaw, damay ji tamaate ak sooble ci gannaaw k\xEBr gi." }, { "role": "A", "en": "Is the rent expensive?", "fr": "Le loyer est-il cher ?", "wo": "Ndax loyer bi dafa seer ?" }, { "role": "B", "en": "No, it is cheap.", "fr": "Non, il est bon march\xE9.", "wo": "D\xE9ed\xE9et, dafa yomb." }] }, { "id": "general-agri", "theme": "general:agri", "lignes": [{ "role": "A", "en": "Good morning. I need seeds for my field.", "fr": "Bonjour. J'ai besoin de semences pour mon champ.", "wo": "Salaamaalekum. Damaa soxla semences ngir sama tool." }, { "role": "B", "en": "What do you want to grow?", "fr": "Que voulez-vous cultiver ?", "wo": "Lan nga b\xEBgg a ji ?" }, { "role": "A", "en": "Tomatoes and onions.", "fr": "Des tomates et des oignons.", "wo": "Tamaate ak sooble." }, { "role": "B", "en": "These seeds are good for the rainy season.", "fr": "Ces semences sont bonnes pour la saison des pluies.", "wo": "Semences yii baax na\xF1u ci nawet." }, { "role": "A", "en": "How much is a small bag?", "fr": "Combien co\xFBte un petit sac ?", "wo": "\xD1aata la saaku bu ndaw ?" }, { "role": "B", "en": "Two thousand five hundred francs.", "fr": "Deux mille cinq cents francs.", "wo": "\xD1aari junni ak jur\xF3om t\xE9em\xE9er franc." }, { "role": "A", "en": "Do you also have fertilizer?", "fr": "Avez-vous aussi de l'engrais ?", "wo": "Ndax am ngeen engrais itam ?" }, { "role": "B", "en": "Yes, ten thousand francs for a big bag.", "fr": "Oui, dix mille francs pour un grand sac.", "wo": "Waaw, fukki junni franc ngir saaku bu mag." }, { "role": "A", "en": "Can you deliver to my farm in Thi\xE8s?", "fr": "Pouvez-vous livrer \xE0 ma ferme \xE0 Thi\xE8s ?", "wo": "M\xEBn nga ko y\xF3bbu ci sama tool ci Thi\xE8s ?" }, { "role": "B", "en": "Yes, tomorrow morning.", "fr": "Oui, demain matin.", "wo": "Waaw, \xEBll\xEBg ci suba." }] }, { "id": "business-colobane", "theme": "business", "lignes": [{ "role": "client", "scene": "", "en": "Excuse me, how much is this part?", "fr": "Dis, combien co\xFBte cette pi\xE8ce ?", "wo": "Boy, \xF1aata la pi\xE8ce bii ?" }, { "role": "marchand", "scene": "", "en": "Nineteen thousand francs, my brother.", "fr": "Dix-neuf mille francs, mon fr\xE8re.", "wo": "Junni ak jur\xF3om-\xF1eent fukk y\xE9pp, waar." }, { "role": "client", "scene": "", "en": "Okay, but can you lower the price a little?", "fr": "D'accord, mais tu peux baisser un peu ?", "wo": "Waaw waaw, ndax m\xEBn nga w\xE0\xF1\xF1i tuuti ?" }, { "role": "marchand", "scene": "", "en": "For you, I'll make it seventeen thousand.", "fr": "Pour toi, je te la fais \xE0 dix-sept mille.", "wo": "Ci sa ndig\xEBl, dinaa la ko jox ci junni ak jur\xF3om-\xF1aar fukk." }, { "role": "client", "scene": "", "en": "Is this part original, or is it a copy?", "fr": "Cette pi\xE8ce est d'origine ou c'est une copie ?", "wo": "Ndax pi\xE8ce bii bokk na ci fabrik bi, walla dafa \xEBpp copie ?" }, { "role": "marchand", "scene": "", "en": "It is original, there is no doubt.", "fr": "Elle est d'origine, il n'y a aucun doute.", "wo": "Dafa bokk ci fabrik bi, amul benn w\xE9r\xE9lu." }] }, { "id": "business-sandaga", "theme": "business", "lignes": [{ "role": "client", "scene": "", "en": "What sizes do you have for this fabric?", "fr": "Quelle taille avez-vous pour ce tissu ?", "wo": "Ban taille nga am ci tissu bii ?" }, { "role": "marchand", "scene": "", "en": "I have L and XL, or I can make it to measure.", "fr": "J'ai du L et du XL, ou je peux le faire sur mesure.", "wo": "Am naa L ak XL, walla m\xEBn naa la ko def ci sa mesure." }, { "role": "client", "scene": "", "en": "How much for ten pieces if I buy in bulk?", "fr": "Combien pour dix pi\xE8ces, si j'ach\xE8te en gros ?", "wo": "\xD1aata la ngir fukk pi\xE8ces, bu ma j\xEBndee ci gros ?" }, { "role": "marchand", "scene": "", "en": "For wholesale, I'll give you a discount, only forty thousand.", "fr": "En gros, je te fais une remise, seulement quarante mille.", "wo": "Ci gros, dinaa la ko w\xE0\xF1\xF1i, \xF1aata-fukk junni rekk." }, { "role": "client", "scene": "", "en": "Can you send me a sample first?", "fr": "Peux-tu d'abord m'envoyer un \xE9chantillon ?", "wo": "Ndax m\xEBn nga ma y\xF3nnee \xE9chantillon bu nj\xEBkk ?" }, { "role": "marchand", "scene": "", "en": "Yes, I'll send it to you right away.", "fr": "Oui, je te l'envoie tout de suite.", "wo": "Waaw, dinaa la ko y\xF3nnee l\xE9egi l\xE9egi." }] }, { "id": "business-electronique", "theme": "business", "lignes": [{ "role": "client", "scene": "", "en": "Does this device work on 220V?", "fr": "Cet appareil fonctionne-t-il en 220V ?", "wo": "Ndax jumtukaay bii dafay dox ci 220V ?" }, { "role": "marchand", "scene": "", "en": "Yes, it is compatible with the Senegalese voltage.", "fr": "Oui, il est compatible avec le voltage s\xE9n\xE9galais.", "wo": "Waaw, dafa yem ak voltage bu Senegaal." }, { "role": "client", "scene": "", "en": "Can you test it in front of me?", "fr": "Peux-tu le tester devant moi ?", "wo": "Ndax m\xEBn nga ma ko testeel ci sama kanam ?" }, { "role": "marchand", "scene": "", "en": "Yes, right away, I'll plug it into the socket.", "fr": "Oui, tout de suite, je vais le brancher sur la prise.", "wo": "Waaw, l\xE9egi l\xE9egi, dinaa ko branch\xE9 ci kontak bi." }, { "role": "client", "scene": "", "en": "Is there a manufacturer's warranty?", "fr": "Y a-t-il une garantie du fabricant ?", "wo": "Ndax am na garanti bu fabrikaan bi ?" }, { "role": "marchand", "scene": "", "en": "Yes, a one-year warranty, with the original invoice.", "fr": "Oui, une garantie d'un an, avec la facture d'origine.", "wo": "Waaw, benn at garanti, ak facture bu nj\xEBkk." }] }, { "id": "business-chine", "theme": "business", "lignes": [{ "role": "client", "scene": "", "en": "How much does shipping by container cost?", "fr": "Combien co\xFBte le transport par conteneur ?", "wo": "\xD1aata la transport bu conteneur bi ?" }, { "role": "marchand", "scene": "", "en": "It depends on the CBM of your goods.", "fr": "\xC7a d\xE9pend du nombre de CBM de ta marchandise.", "wo": "Dafa ci wattu \xF1aata CBM sa marsandiz am." }, { "role": "client", "scene": "", "en": "How many days for delivery to the Port of Dakar?", "fr": "Combien de jours pour la livraison au Port de Dakar ?", "wo": "\xD1aata fan ngir livraison bi ci Port Dakar ?" }, { "role": "marchand", "scene": "", "en": "About thirty days, if customs clearance goes well.", "fr": "Environ trente jours, si le d\xE9douanement se passe bien.", "wo": "Ci diggante \xF1att-fukk fan, bu d\xE9douanement bi yomb." }, { "role": "client", "scene": "", "en": "I need the bill of lading and the packing list.", "fr": "J'ai besoin du connaissement et de la liste de colisage.", "wo": "Soxla naa Bill of Lading bi ak packing list bi." }, { "role": "marchand", "scene": "", "en": "Yes, I'll send them as soon as the goods are picked up.", "fr": "Oui, je te les envoie d\xE8s que la marchandise est prise en charge.", "wo": "Waaw, dinaa la ko y\xF3nnee bu \xF1u j\xEBlee marsandiz bi." }] }], "ielts": [{ "id": "ielts-shopping_food-1a-0", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "1a", "question": "Can you spell your last name, please?" }, { "id": "ielts-shopping_food-1a-1", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "1a", "question": "Where are you from?" }, { "id": "ielts-shopping_food-1a-2", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "1a", "question": "What do you do?" }, { "id": "ielts-shopping_food-1b-0", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "1b", "question": "Where do you usually do your shopping?" }, { "id": "ielts-shopping_food-1b-1", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "1b", "question": "What food do you like to buy?" }, { "id": "ielts-shopping_food-1b-2", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "1b", "question": "Do you prefer shopping at a market or a supermarket?" }, { "id": "ielts-shopping_food-1b-3", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "1b", "question": "Who does the shopping in your family?" }, { "id": "ielts-shopping_food-1b-4", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "1b", "question": "Do you cook the food you buy?" }, { "id": "ielts-shopping_food-2a-0", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-shopping_food-2a-1", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "2a", "question": "What is the woman doing?" }, { "id": "ielts-shopping_food-2b-0", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "2b", "question": "Do you think prices at the market have increased recently?" }, { "id": "ielts-shopping_food-2b-1", "test": "shopping_food", "sujet": "Shopping & Food", "phase": "2b", "question": "Why do some people prefer supermarkets to markets?" }, { "id": "ielts-transport_travel-1a-0", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "1a", "question": "Where are you from originally?" }, { "id": "ielts-transport_travel-1a-1", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "1a", "question": "Can you spell the name of your city?" }, { "id": "ielts-transport_travel-1a-2", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "1a", "question": "What do you do?" }, { "id": "ielts-transport_travel-1b-0", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "1b", "question": "How do you usually travel to work?" }, { "id": "ielts-transport_travel-1b-1", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "1b", "question": "Have you ever travelled outside Senegal?" }, { "id": "ielts-transport_travel-1b-2", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "1b", "question": "Do you prefer the bus, a taxi, or walking?" }, { "id": "ielts-transport_travel-1b-3", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "1b", "question": "How long is your journey to work?" }, { "id": "ielts-transport_travel-1b-4", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "1b", "question": "Do you travel often to visit family?" }, { "id": "ielts-transport_travel-2a-0", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-transport_travel-2a-1", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "2a", "question": "What are the people doing?" }, { "id": "ielts-transport_travel-2b-0", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "2b", "question": "Do you think public transport is good in your city?" }, { "id": "ielts-transport_travel-2b-1", "test": "transport_travel", "sujet": "Transport & Travelling", "phase": "2b", "question": "What would you improve about transport in your area?" }, { "id": "ielts-health_emergencies-1a-0", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-health_emergencies-1a-1", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "1a", "question": "Can you spell your first name, please?" }, { "id": "ielts-health_emergencies-1a-2", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "1a", "question": "Where do you live?" }, { "id": "ielts-health_emergencies-1b-0", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "1b", "question": "What do you do to stay healthy?" }, { "id": "ielts-health_emergencies-1b-1", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "1b", "question": "Do you exercise regularly?" }, { "id": "ielts-health_emergencies-1b-2", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "1b", "question": "Have you ever been to hospital?" }, { "id": "ielts-health_emergencies-1b-3", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "1b", "question": "Who do you call when someone is sick at home?" }, { "id": "ielts-health_emergencies-1b-4", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "1b", "question": "Do you know the emergency number in Senegal?" }, { "id": "ielts-health_emergencies-2a-0", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-health_emergencies-2a-1", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "2a", "question": "How do you think the patient feels?" }, { "id": "ielts-health_emergencies-2b-0", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "2b", "question": "Why is it important to know basic first aid?" }, { "id": "ielts-health_emergencies-2b-1", "test": "health_emergencies", "sujet": "Health & Emergencies", "phase": "2b", "question": "What would you do if a family member had a high fever at night?" }, { "id": "ielts-family_reunion-1a-0", "test": "family_reunion", "sujet": "Family Reunification", "phase": "1a", "question": "What is your name?" }, { "id": "ielts-family_reunion-1a-1", "test": "family_reunion", "sujet": "Family Reunification", "phase": "1a", "question": "Where are you from?" }, { "id": "ielts-family_reunion-1a-2", "test": "family_reunion", "sujet": "Family Reunification", "phase": "1a", "question": "Where do you live now?" }, { "id": "ielts-family_reunion-1b-0", "test": "family_reunion", "sujet": "Family Reunification", "phase": "1b", "question": "Do you have family in another country?" }, { "id": "ielts-family_reunion-1b-1", "test": "family_reunion", "sujet": "Family Reunification", "phase": "1b", "question": "Who do you want to live with?" }, { "id": "ielts-family_reunion-1b-2", "test": "family_reunion", "sujet": "Family Reunification", "phase": "1b", "question": "Where do they live?" }, { "id": "ielts-family_reunion-1b-3", "test": "family_reunion", "sujet": "Family Reunification", "phase": "1b", "question": "How often do you talk to them?" }, { "id": "ielts-family_reunion-1b-4", "test": "family_reunion", "sujet": "Family Reunification", "phase": "1b", "question": "What will you do when you join your family?" }, { "id": "ielts-family_reunion-2a-0", "test": "family_reunion", "sujet": "Family Reunification", "phase": "2a", "question": "What can you see in this picture?" }, { "id": "ielts-family_reunion-2a-1", "test": "family_reunion", "sujet": "Family Reunification", "phase": "2a", "question": "What are the people doing?" }, { "id": "ielts-family_reunion-2b-0", "test": "family_reunion", "sujet": "Family Reunification", "phase": "2b", "question": "Why do you want to live near your family?" }, { "id": "ielts-family_reunion-2b-1", "test": "family_reunion", "sujet": "Family Reunification", "phase": "2b", "question": "What do you need to buy for a new home?" }], "ecoute": [{ "id": "ecoute-4", "audio": "Welcome to the class. Please sit down and open your books to page ten.", "question": "What page should you open?", "options": ["Page ten", "Page eleven", "Page twenty"], "reponse": 0 }, { "id": "ecoute-5", "audio": "We are sorry, the restaurant is full right now. Please wait fifteen minutes for a table.", "question": "How long must you wait?", "options": ["Five minutes", "Fifteen minutes", "Fifty minutes"], "reponse": 1 }], "quiz": [{ "id": "quiz-visa-0", "theme": "general:visa", "q": "What is the ___ of your visit?", "options": ["purpose", "propose", "purposal"], "reponse": 0, "explication": "\xAB Purpose of visit \xBB = motif du s\xE9jour." }, { "id": "quiz-visa-1", "theme": "general:visa", "q": "I ___ stay for two weeks.", "options": ["will", "am", "do"], "reponse": 0, "explication": "Futur simple avec \xAB will \xBB." }, { "id": "quiz-visa-2", "theme": "general:visa", "q": "\xAB Billet retour \xBB se dit :", "options": ["return ticket", "back ticket", "tour ticket"], "reponse": 0, "explication": "L'expression correcte est return ticket." }, { "id": "quiz-visa-3", "theme": "general:visa", "q": "I ___ come back after two weeks.", "options": ["will", "am", "does"], "reponse": 0, "explication": "Intention future : \xAB will + verbe de base \xBB." }, { "id": "quiz-housing-0", "theme": "general:housing", "q": "\xAB Loyer \xBB se dit :", "options": ["rent", "rain", "rank"], "reponse": 0, "explication": "Rent = loyer." }, { "id": "quiz-housing-1", "theme": "general:housing", "q": "The ___ owns the house and rents it out.", "options": ["landlord", "tenant", "neighbour"], "reponse": 0, "explication": "Landlord = propri\xE9taire." }, { "id": "quiz-housing-2", "theme": "general:housing", "q": "\xAB Puis-je visiter la maison ? \xBB se dit :", "options": ["Can I visit the house?", "Can I visited the house?", "Can I visit at house?"], "reponse": 0, "explication": "Forme correcte avec l'auxiliaire can + verbe \xE0 l'infinitif." }, { "id": "quiz-housing-3", "theme": "general:housing", "q": "I ___ tomatoes behind the house.", "options": ["grow", "grows", "growing"], "reponse": 0, "explication": "I + verbe de base (I grow)." }, { "id": "quiz-agri-0", "theme": "general:agri", "q": "\xAB Semences \xBB se dit :", "options": ["seeds", "seats", "seeks"], "reponse": 0, "explication": "Seeds = semences." }, { "id": "quiz-agri-1", "theme": "general:agri", "q": "I ___ my crops every morning.", "options": ["water", "wet", "drink"], "reponse": 0, "explication": "Water peut \xEAtre un verbe : arroser." }, { "id": "quiz-agri-2", "theme": "general:agri", "q": "\xAB Combien co\xFBte un sac d'engrais ? \xBB se dit :", "options": ["How much is a bag of fertilizer?", "How many is a bag of fertilizer?", "How much are a bag of fertilizer?"], "reponse": 0, "explication": "How much pour un prix, avec is au singulier." }] } };
const donnees = {
  niveaux: BASE_NIVEAUX,
  ordre: ["debutant", "intermediaire", "avance"],
  phrases: (k) => BASE_NIVEAUX[k] ? BASE_NIVEAUX[k].phrases : [],
  dialogues: (k) => BASE_NIVEAUX[k] ? BASE_NIVEAUX[k].dialogues : [],
  ielts: (k) => BASE_NIVEAUX[k] ? BASE_NIVEAUX[k].ielts : [],
  ecoute: (k) => BASE_NIVEAUX[k] ? BASE_NIVEAUX[k].ecoute : [],
  quiz: (k) => BASE_NIVEAUX[k] ? BASE_NIVEAUX[k].quiz : [],
  textesWolof: (k) => BASE_NIVEAUX[k] ? BASE_NIVEAUX[k].phrases.map((p) => p.wo).filter(Boolean) : [],
  textesAnglais: (k) => BASE_NIVEAUX[k] ? BASE_NIVEAUX[k].phrases.map((p) => p.en).filter(Boolean) : []
};
const NIVEAUX_ORDRE = ["debutant", "intermediaire", "avance"];
const SEUILS_XP = { debutant: 0, intermediaire: 100, avance: 300 };
function rangDebloque(xp, niveauValide) {
  let rang = 1;
  NIVEAUX_ORDRE.forEach((k, i) => {
    if (Number(xp) >= SEUILS_XP[k]) rang = i + 1;
  });
  if (typeof niveauValide === "number") rang = Math.min(rang, niveauValide + 1);
  return Math.max(1, Math.min(NIVEAUX_ORDRE.length, rang));
}
function injecterStyleVerrou() {
  if (document.getElementById("diisoo-style-verrou")) return;
  const st = document.createElement("style");
  st.id = "diisoo-style-verrou";
  st.textContent = ".locked{pointer-events:none!important;opacity:.45;filter:grayscale(.6);cursor:not-allowed;user-select:none}.locked-tag{margin-right:4px}";
  document.head.appendChild(st);
}
function appliquerVerrous(conteneur, rang) {
  injecterStyleVerrou();
  const racine = conteneur || document;
  racine.querySelectorAll("[data-niveau]").forEach((el) => {
    const r = NIVEAUX_ORDRE.indexOf(el.dataset.niveau) + 1;
    const verrouille = r > rang;
    el.classList.toggle("locked", verrouille);
    el.style.pointerEvents = verrouille ? "none" : "";
    if (verrouille) el.setAttribute("aria-disabled", "true");
    else el.removeAttribute("aria-disabled");
  });
}
async function rangActuel() {
  let niveauValide;
  if (etat.user) {
    try {
      const r = sansErreur(await avecDelai(sb.rpc("etat_niveaux"), DELAI_RESEAU, "niveaux"));
      if (r && typeof r.niveau_valide === "number") niveauValide = r.niveau_valide;
    } catch (error) {
      console.error("Erreur Audio Diisoo :", error);
    }
  }
  let xp = etat.profil ? Number(etat.profil.points_xp) || 0 : 0;
  try {
    const local = JSON.parse(localStorage.getItem("diisoo_xp"));
    if (local && Number(local.total) > xp) xp = Number(local.total);
  } catch (e) {
  }
  return rangDebloque(xp, niveauValide);
}
const verrous = {
  seuils: SEUILS_XP,
  ordre: NIVEAUX_ORDRE,
  rang: rangActuel,
  calculer: rangDebloque,
  appliquer: appliquerVerrous,
  actualiser: async (conteneur) => {
    const r = await rangActuel();
    appliquerVerrous(conteneur, r);
    return r;
  }
};
const CONTRAINTES_MICRO = { audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } };
function ouvrirMicro() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error("micro indisponible"));
  return navigator.mediaDevices.getUserMedia(CONTRAINTES_MICRO);
}
function creerVAD(flux, options) {
  const o = Object.assign({ silenceMs: 5e3, seuilDb: -50, parleMinMs: 400, onVoix() {
  }, onSilence() {
  }, onSecours() {
  } }, options || {});
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || !flux) {
    setTimeout(() => o.onSecours(), 0);
    return { arreter() {
    } };
  }
  let ctx, source, analyser, buf;
  try {
    ctx = new AC();
    if (ctx.state === "suspended") ctx.resume().catch(() => {
    });
    source = ctx.createMediaStreamSource(flux);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.2;
    source.connect(analyser);
    buf = new Float32Array(analyser.fftSize);
  } catch (error) {
    console.error("Erreur Audio Diisoo :", error);
    setTimeout(() => o.onSecours(), 0);
    return { arreter() {
    } };
  }
  const debut = Date.now();
  let dernier = debut;
  let calibrage = [];
  let seuil = o.seuilDb;
  let calibre = false;
  let voixMs = 0;
  let aParle = false;
  let minuteur = null;
  let maxVu = -200;
  let fini = false;
  function niveauDb() {
    analyser.getFloatTimeDomainData(buf);
    let s = 0;
    for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
    const rms = Math.sqrt(s / buf.length);
    return rms > 0 ? 20 * Math.log10(rms) : -200;
  }
  function arreter() {
    if (fini) return;
    fini = true;
    clearInterval(tic);
    clearTimeout(minuteur);
    try {
      source.disconnect();
    } catch (e) {
    }
    try {
      ctx.close();
    } catch (e) {
    }
  }
  const tic = setInterval(() => {
    const now = Date.now();
    const dt = now - dernier;
    dernier = now;
    const db = niveauDb();
    if (db > maxVu) maxVu = db;
    if (now - debut < 700) {
      calibrage.push(db);
      return;
    }
    if (!calibre) {
      calibre = true;
      calibrage.sort((a, b) => a - b);
      const bruit = calibrage.length ? calibrage[Math.floor(calibrage.length / 2)] : -200;
      seuil = Math.max(o.seuilDb, Math.min(-25, bruit + 10));
    }
    if (now - debut > 2500 && maxVu <= -150) {
      arreter();
      o.onSecours();
      return;
    }
    if (db > seuil) {
      voixMs += dt;
      if (!aParle && voixMs >= o.parleMinMs) {
        aParle = true;
        o.onVoix();
      }
      if (minuteur) {
        clearTimeout(minuteur);
        minuteur = null;
      }
    } else if (aParle && !minuteur) {
      minuteur = setTimeout(() => {
        minuteur = null;
        if (!fini) o.onSilence();
      }, o.silenceMs);
    }
  }, 100);
  return { arreter, etat: () => ({ aParle, seuil, maxVu }) };
}
const LIEUX_MULTI = /\b(saint[ -]louis|ivory coast|united kingdom|united states|new york|cape verde|burkina faso|sierra leone|south africa|hong kong)\b/gi;
const LIEUX = /* @__PURE__ */ new Set(["dakar", "thies", "thi\xE8s", "senegal", "s\xE9n\xE9gal", "mbour", "touba", "kaolack", "ziguinchor", "louga", "tambacounda", "kolda", "diourbel", "fatick", "kaffrine", "matam", "sedhiou", "kedougou", "rufisque", "pikine", "guediawaye", "medina", "plateau", "colobane", "sandaga", "almadies", "ngor", "yoff", "france", "paris", "lyon", "marseille", "china", "beijing", "guangzhou", "canton", "shanghai", "shenzhen", "yiwu", "turkey", "istanbul", "dubai", "morocco", "casablanca", "mali", "bamako", "mauritania", "nouakchott", "gambia", "banjul", "guinea", "conakry", "abidjan", "nigeria", "lagos", "ghana", "accra", "africa", "europe", "asia", "america", "usa", "canada", "spain", "madrid", "italy", "rome", "germany", "berlin", "london", "england", "uk", "brazil", "india", "japan"]);
const MARQUEURS_NOM = [["my", "name", "is"], ["i", "am", "called"], ["i'm", "called"], ["call", "me"], ["name", "is"]];
const EXCEPTIONS_MAJ = /* @__PURE__ */ new Set(["I", "I'm", "I'll", "I've", "I'd", "Mr", "Mrs"]);
function filtrerEntites(texte) {
  let t = String(texte || "").replace(LIEUX_MULTI, " ").replace(/\b\d{1,4}[A-Za-z]?\s+(rue|street|avenue|road|boulevard|lane|route|rd|st)\b[^.,;!?]*/gi, " ");
  const mots = t.split(/\s+/).filter(Boolean);
  const sortie = [];
  for (let i = 0; i < mots.length; i++) {
    const brut = mots[i];
    const net = brut.replace(/[^\p{L}\p{N}'-]/gu, "");
    const bas = net.toLowerCase();
    if (!net) continue;
    let marqueur = 0;
    for (const m of MARQUEURS_NOM) {
      let ok = i + m.length <= mots.length;
      for (let j = 0; ok && j < m.length; j++) if (mots[i + j].replace(/[^\p{L}\p{N}'-]/gu, "").toLowerCase() !== m[j]) ok = false;
      if (ok) {
        marqueur = m.length;
        break;
      }
    }
    if (marqueur) {
      for (let j = 0; j < marqueur; j++) sortie.push(mots[i + j]);
      let k = i + marqueur;
      if (k + 1 < mots.length && /^\p{Lu}/u.test(mots[k + 1].replace(/[^\p{L}'-]/gu, ""))) k++;
      i = k;
      continue;
    }
    if (LIEUX.has(bas)) continue;
    const precedent = sortie.length ? mots[i - 1] : "";
    const debutPhrase = !precedent || /[.!?]$/.test(precedent);
    if (!debutPhrase && /^\p{Lu}\p{Ll}/u.test(net) && !EXCEPTIONS_MAJ.has(net)) continue;
    sortie.push(brut);
  }
  return sortie.join(" ");
}
function nettoyerTexte(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 300);
}
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}
const SEUIL_SIMILARITE = 0.8;
function similarite(a, b) {
  const m = Math.max(a.length, b.length);
  return m ? 1 - distance(a, b) / m : 1;
}
function ecouterReponse(langue) {
  return new Promise((resolve, reject) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return reject(new Error("non supporte"));
    const rec = new SR();
    rec.lang = langue;
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    let fini = false;
    let garde = null;
    const terminer = (valeur, erreur) => {
      if (fini) return;
      fini = true;
      clearTimeout(garde);
      if (erreur) reject(erreur);
      else resolve(valeur);
    };
    garde = setTimeout(() => {
      try {
        rec.stop();
      } catch (e) {
      }
      terminer([]);
    }, 12e3);
    rec.onresult = (e) => terminer(Array.from(e.results[0]).map((a) => a.transcript));
    rec.onerror = (e) => terminer(null, new Error(e.error));
    rec.onend = () => terminer([]);
    try {
      rec.start();
    } catch (e) {
      terminer(null, e);
    }
  });
}
async function enregistrerValidation() {
  try {
    const data = sansErreur(await avecDelai(sb.rpc("valider_exercice"), DELAI_RESEAU, "validation"));
    if (!data || !data[0]) return null;
    if (etat.profil) {
      etat.profil.points_xp = data[0].xp_total;
      etat.profil.serie_jours = data[0].serie;
    }
    return { xp: data[0].xp_total, serie: data[0].serie };
  } catch (e) {
    console.error(e.message);
    return null;
  }
}
async function verifierReponse(attendu, langue) {
  if (!await assurerConnexion()) return { ok: false, erreur: "connexion" };
  let propositions;
  try {
    propositions = await ecouterReponse(langue);
  } catch (e) {
    return { ok: false, erreur: e.message };
  }
  const cible = nettoyerTexte(filtrerEntites(attendu));
  const juste = propositions.some((p) => similarite(nettoyerTexte(filtrerEntites(p)), cible) >= SEUIL_SIMILARITE);
  if (!juste) return { ok: false };
  const bilan = await enregistrerValidation();
  return Object.assign({ ok: true }, bilan || {});
}
async function validerRepetition() {
  if (!await assurerConnexion()) return null;
  return await enregistrerValidation();
}
const SEUIL_CERTIFICATION = 1e3;
const RE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RE_SHA256 = /^[0-9a-f]{64}$/i;
const RE_ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|\+00:00)$/;
const certification = {
  async verifier() {
    if (!await assurerConnexion()) {
      return { connecte: false, eligible: false, xp: 0, seuil: SEUIL_CERTIFICATION, restant: SEUIL_CERTIFICATION };
    }
    await rafraichirProfil();
    const xp = etat.profil ? etat.profil.points_xp : 0;
    return {
      connecte: true,
      eligible: xp >= SEUIL_CERTIFICATION,
      xp,
      seuil: SEUIL_CERTIFICATION,
      restant: Math.max(0, SEUIL_CERTIFICATION - xp)
    };
  },
  async generer() {
    const v = await certification.verifier();
    if (!v.eligible) return Object.assign({ ok: false, raison: v.connecte ? "xp_insuffisant" : "connexion" }, v);
    try {
      const data = sansErreur(await avecDelai(sb.rpc("creer_certification_diisoo"), DELAI_RESEAU, "attestation"));
      const c = Array.isArray(data) ? data[0] : data;
      if (!c || !RE_UUID.test(c.id) || !RE_SHA256.test(c.hash) || !RE_ISO_UTC.test(c.date_utc)) {
        throw new Error("reponse serveur invalide");
      }
      return { ok: true, id: c.id, hash: c.hash, date_utc: c.date_utc };
    } catch (e) {
      console.error(e.message);
      return { ok: false, raison: "serveur", message: e.message };
    }
  },
  async controler(id) {
    if (!RE_UUID.test(String(id))) return { ok: false, valide: false };
    try {
      const data = sansErreur(
        await avecDelai(sb.rpc("verifier_certification_diisoo", { p_id: id }), DELAI_RESEAU, "controle")
      );
      const c = Array.isArray(data) ? data[0] : data;
      return c ? { ok: true, valide: !!c.valide, date_utc: c.date_utc || null } : { ok: true, valide: false };
    } catch (e) {
      console.error(e.message);
      return { ok: false, valide: false };
    }
  }
};
const THEMES = [
  { id: "axe-chine", titre: "Axe Chine" },
  { id: "port-douane", titre: "Port et Douane" },
  { id: "sandaga", titre: "Sandaga" },
  { id: "colobane", titre: "Colobane" },
  { id: "fintech", titre: "FinTech" },
  { id: "ielts", titre: "IELTS" },
  { id: "voyage", titre: "Voyage" },
  { id: "hotel", titre: "H\xF4tel" }
];
const cachePhrases = /* @__PURE__ */ new Map();
async function chargerTheme(id) {
  if (!THEMES.some((t) => t.id === id)) return [];
  if (cachePhrases.has(id)) return cachePhrases.get(id);
  try {
    const data = sansErreur(
      await avecDelai(
        sb.from("diisoo_phrases").select("id, ordre, wolof, francais, anglais").eq("theme", id).order("ordre", { ascending: true }).limit(500),
        DELAI_RESEAU,
        "theme"
      )
    ) || [];
    cachePhrases.set(id, data);
    try {
      localStorage.setItem("diisoo_theme_" + id, JSON.stringify(data));
    } catch (e) {
    }
    return data;
  } catch (e) {
    console.error(e.message);
    try {
      const sauve = JSON.parse(localStorage.getItem("diisoo_theme_" + id));
      if (Array.isArray(sauve)) return sauve;
    } catch (e2) {
    }
    return [];
  }
}
async function afficherTheme(listeEl, id) {
  if (!listeEl) return [];
  listeEl.textContent = "Chargement...";
  const phrases = await chargerTheme(id);
  listeEl.textContent = "";
  if (!phrases.length) {
    listeEl.textContent = "Aucune phrase disponible pour le moment.";
    return phrases;
  }
  phrases.forEach((p) => {
    const ligne = document.createElement("div");
    ligne.style.cssText = "display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #e4e7eb";
    const textes = document.createElement("div");
    textes.style.cssText = "flex:1;min-width:0";
    const w = document.createElement("div");
    w.textContent = p.wolof;
    w.style.cssText = "font-weight:600";
    textes.appendChild(w);
    [p.francais, p.anglais].forEach((t) => {
      if (!t) return;
      const d = document.createElement("div");
      d.textContent = t;
      d.style.cssText = "font-size:13px;opacity:.75";
      textes.appendChild(d);
    });
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "\u{1F50A}";
    b.setAttribute("aria-label", "\xC9couter");
    b.style.cssText = "flex:none;font-size:20px;padding:8px 12px;border-radius:8px;border:1px solid #9aa5b1;background:#fff;cursor:pointer";
    b.addEventListener("click", () => ecouter(p.wolof));
    ligne.append(textes, b);
    listeEl.appendChild(ligne);
  });
  return phrases;
}
function monterThemes(selecteurEl, listeEl) {
  if (!selecteurEl) return;
  selecteurEl.textContent = "";
  THEMES.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = t.titre;
    b.style.cssText = "margin:4px;padding:10px 14px;border-radius:999px;border:1px solid #0a7d4b;background:#fff;color:#0a7d4b;font-size:15px;cursor:pointer";
    b.addEventListener("click", () => {
      Array.from(selecteurEl.children).forEach((x) => {
        x.style.background = "#fff";
        x.style.color = "#0a7d4b";
      });
      b.style.background = "#0a7d4b";
      b.style.color = "#fff";
      afficherTheme(listeEl, t.id);
    });
    selecteurEl.appendChild(b);
  });
}
function enregistrerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  const avaitControleur = !!navigator.serviceWorker.controller;
  let rechargement = false;
  const occupe = () => ["screen-test-simulation", "screen-pairs"].some((id) => {
    const el = document.getElementById(id);
    return el && !el.classList.contains("hidden");
  });
  const recharger = () => {
    if (occupe()) {
      setTimeout(recharger, 1e4);
      return;
    }
    persisterReservoir();
    window.location.reload();
  };
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!avaitControleur || rechargement) return;
    rechargement = true;
    recharger();
  });
  const brancher = (reg) => {
    const activer = (sw) => {
      if (sw) sw.postMessage({ type: "SKIP_WAITING" });
    };
    if (reg.waiting && navigator.serviceWorker.controller) activer(reg.waiting);
    reg.addEventListener("updatefound", () => {
      const nouveau = reg.installing;
      if (!nouveau) return;
      nouveau.addEventListener("statechange", () => {
        if (nouveau.state === "installed" && navigator.serviceWorker.controller) activer(nouveau);
      });
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") reg.update().catch(() => {
      });
    });
    setInterval(() => {
      reg.update().catch(() => {
      });
    }, 30 * 60 * 1e3);
  };
  navigator.serviceWorker.getRegistration().then((reg) => reg || navigator.serviceWorker.register(SW_URL)).then(brancher).catch((e) => console.error("SW", e.message));
}
let initFait = false;
async function init() {
  if (initFait) return;
  initFait = true;
  try {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {
      });
    }
  } catch (e) {
  }
  try {
    etat.segment = detecterSegment();
    enregistrerServiceWorker();
    await chargerSession();
    sb.auth.onAuthStateChange((evenement, session) => {
      setTimeout(() => {
        if (evenement === "SIGNED_OUT") {
          etat.user = null;
          etat.profil = null;
          res.attVoix = 0;
          res.attCredits = 0;
          res.localVoix = 0;
          relireReservoir();
        } else if (evenement === "SIGNED_IN" && session && (!etat.user || etat.user.id !== session.user.id)) {
          chargerSession();
        }
      }, 0);
    });
    await gererRetourPaiement();
  } catch (e) {
    console.error(e.message);
  }
}
window.Diisoo = {
  init,
  connexion: ouvrirConnexion,
  deconnexion: () => sb.auth.signOut(),
  ecouter,
  voix,
  verrous,
  donnees,
  micro: { ouvrir: ouvrirMicro, contraintes: CONTRAINTES_MICRO, creerVAD },
  texte: { filtrerEntites },
  auth: { demanderCode, verifierCode, enregistrerIdentite },
  acheter,
  top5,
  verifierReponse,
  validerRepetition,
  rafraichirProfil,
  certification,
  themes: { liste: THEMES, charger: chargerTheme, afficher: afficherTheme, monter: monterThemes },
  exercice: enregistrerValidation,
  synchro: {
    charger: async () => sansErreur(await avecDelai(sb.rpc("charger_donnees"), DELAI_RESEAU, "restauration")),
    sauvegarder: async (donnees2) => sansErreur(await avecDelai(sb.rpc("sauvegarder_donnees", { p_donnees: donnees2 }), DELAI_RESEAU, "sauvegarde"))
  },
  niveaux: {
    etat: async () => sansErreur(await avecDelai(sb.rpc("etat_niveaux"), DELAI_RESEAU, "niveaux")),
    valider: async (niveau, score) => {
      const r = sansErreur(await avecDelai(sb.rpc("valider_palier", { p_niveau: niveau, p_score: score }), DELAI_RESEAU, "palier"));
      await rafraichirProfil();
      return r;
    }
  },
  etat: () => ({
    segment: etat.segment,
    connecte: !!etat.user,
    premium: estPremium(),
    quotaGratuit: QUOTA_GRATUIT[etat.segment],
    ecoutesUtilisees: voixUtilisees(),
    creditsRestants: creditsRestants(),
    xp: etat.profil ? etat.profil.points_xp : 0,
    serie: etat.profil ? etat.profil.serie_jours : 0
  })
};
init();
// Connexion par code e-mail desactivee pour l'instant
(function sansCode() {
  const passer = () => {
    try {
      const ob = document.getElementById("screen-onboarding");
      if (ob && ob.offsetParent !== null && typeof window.continuerSansCompte === "function") {
        window.continuerSansCompte();
      }
      const ms = document.getElementById("menu-session");
      if (ms) ms.style.display = "none";
      const cf = document.getElementById("code-field");
      if (cf) cf.style.display = "none";
    } catch (e) {}
  };
  window.menuConnexion = function () {};
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(passer, 300));
  } else {
    setTimeout(passer, 300);
  }
  setTimeout(passer, 1500);
})();
// Inscription simple : prenom, nom, WhatsApp, sans code
(function inscriptionSimple() {
  const $ = (id) => document.getElementById(id);
  const origSans = window.continuerSansCompte;
  let humain = false;
  document.addEventListener("pointerdown", () => { humain = true; }, true);
  window.continuerSansCompte = function () {
    if (!humain) return;
    return origSans.apply(this, arguments);
  };
  window.handleOnboarding = function (e) {
    e.preventDefault();
    const first = $("user-firstname").value.trim();
    const last = $("user-lastname").value.trim();
    const email = $("user-email").value.trim().toLowerCase() || null;
    const opt = $("whatsapp-optin").checked;
    let phone = null;
    if (opt) {
      const d = $("user-phone").value.replace(/\D/g, "").replace(/^221/, "");
      if (!/^7[05-8]\d{7}$/.test(d)) {
        const er = $("phone-error");
        er.textContent = "Numéro invalide. Exemple : 70 123 45 67 (9 chiffres).";
        er.classList.remove("hidden");
        return;
      }
      phone = "+221" + d;
    }
    window.terminerInscription({ first_name: first, last_name: last, email: email, phone: phone, whatsapp_optin: opt });
  };
  const adapter = () => {
    try {
      const em = $("user-email");
      if (em) em.required = false;
                        // Effacement unique du faux profil "Ami"
(function () {
  try {
    const p = JSON.parse(localStorage.getItem("diisoo_profile") || "null");
    if (p && p.first_name === "Ami" && !p.last_name && !p.email) {
      localStorage.removeItem("diisoo_profile");
      location.reload();
    }
  } catch (e) {}
})();
      const l = document.querySelector('label[for="user-email"]');
      if (l) l.textContent = "E-mail (facultatif)";
      const b = $("btn-submit-onboarding");
      if (b) b.textContent = "Commencer";
      const cf = $("code-field");
      if (cf) cf.style.display = "none";
    } catch (e) {}
  };
  setTimeout(adapter, 200);
  setTimeout(adapter, 1500);
})();
// Reinitialisation unique du profil
(function () {
  try {
    if (!localStorage.getItem("diisoo_reset1")) {
      localStorage.setItem("diisoo_reset1", "1");
      localStorage.removeItem("diisoo_profile");
      location.reload();
    }
  } catch (e) {}
})();
