// diisoo-pro.js v2 : logique commerciale de Diisoo
// A inclure dans index.html avec : <script type="module" src="diisoo-pro.js"></script>

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

// ---------------------------------------------------------------
// CONFIGURATION (cle publique uniquement, jamais la cle secrete)
// ---------------------------------------------------------------
const CONFIG = {
  SUPABASE_URL: "https://jkwtyoefqvafnlqkhium.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable__lzrlmMaJdFC_kav6DkfEA_UbH6DiTC",
};

const sb = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const QUOTA_GRATUIT = { local: 100, etranger: 15 };
const etat = { user: null, profil: null, segment: "local" };

// ---------------------------------------------------------------
// Utilitaires asynchrones : aucun appel reseau ne reste sans delai maximum
// ---------------------------------------------------------------
const DELAI_RESEAU = 15000;

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
    el.style.cssText =
      "position:fixed;left:12px;right:12px;bottom:16px;z-index:99999;background:#1f2933;color:#fff;" +
      "padding:12px 14px;border-radius:10px;font:15px/1.4 system-ui,sans-serif;text-align:center;display:none";
    document.body.appendChild(el);
  }
  el.textContent = texte;
  el.style.display = "block";
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = "none"; }, 4500);
}

// ---------------------------------------------------------------
// Segmentation etrangers / locaux
// ---------------------------------------------------------------
function detecterSegment() {
  const lang = (navigator.language || "fr").toLowerCase();
  let tz = "";
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { /* ignore */ }
  const diaspora = /^(Europe|America|Asia|Australia)\//.test(tz);
  const francophone = lang.startsWith("fr") || lang.startsWith("wo");
  return francophone && !diaspora ? "local" : "etranger";
}

// ---------------------------------------------------------------
// Reservoir local securise : seules les ecoutes en attente sont persistees,
// les totaux sont toujours recalcules a partir du profil serveur
// ---------------------------------------------------------------
const CAP_ATTENTE = 100000;
const res = { attVoix: 0, attCredits: 0 };

function entier(v) {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? Math.min(n, CAP_ATTENTE) : 0;
}

const cleReservoir = () => "diisoo_reservoir_v2_" + (etat.user ? etat.user.id : "anon");

function relireReservoir() {
  try {
    const brut = localStorage.getItem(cleReservoir());
    if (!brut) return;
    const r = JSON.parse(brut);
    if (r && r.v === 2) {
      res.attVoix = entier(r.attVoix);
      res.attCredits = entier(r.attCredits);
    }
  } catch (e) { /* donnees corrompues ou stockage indisponible : on garde la memoire */ }
}

function persisterReservoir() {
  try {
    localStorage.setItem(cleReservoir(), JSON.stringify({ v: 2, attVoix: res.attVoix, attCredits: res.attCredits }));
  } catch (e) { /* mode prive ou quota plein : on reste en memoire */ }
}

window.addEventListener("storage", (e) => {
  if (e.key === cleReservoir()) relireReservoir();
});

const estPremium = () => !!(etat.profil && etat.profil.est_premium);
const voixUtilisees = () => (etat.profil ? etat.profil.compteur_voix : 0) + res.attVoix;
const creditsRestants = () => Math.max(0, (etat.profil ? etat.profil.credits_voix : 0) - res.attCredits);

function peutEcouter() {
  return estPremium() || voixUtilisees() < QUOTA_GRATUIT[etat.segment] || creditsRestants() > 0;
}

function consommerEcoute() {
  if (estPremium()) return;
  relireReservoir();
  if (voixUtilisees() < QUOTA_GRATUIT[etat.segment]) res.attVoix++;
  else if (creditsRestants() > 0) res.attCredits++;
  persisterReservoir();
  planifierSync();
}

let minuteurSync = null;
let syncEnCours = false;
let echecsSync = 0;

function planifierSync(delai) {
  clearTimeout(minuteurSync);
  const d = delai !== undefined ? delai : Math.min(5000 * Math.pow(2, echecsSync), 60000);
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
    if (res.attVoix > 0 || res.attCredits > 0) planifierSync(1000);
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
window.addEventListener("pagehide", () => { persisterReservoir(); syncServeur(); });

// ---------------------------------------------------------------
// Session et profil
// ---------------------------------------------------------------
async function rafraichirProfil() {
  if (!etat.user) return null;
  try {
    const data = sansErreur(
      await avecDelai(
        sb.from("diisoo_profiles")
          .select("est_premium, compteur_voix, credits_voix, points_xp, serie_jours")
          .single(),
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
      etat.profil = null;
    }
    etat.user = user;
    if (user) {
      relireReservoir();
      await rafraichirProfil();
    }
  } catch (e) {
    console.error(e.message);
  }
  return !!etat.user;
}

// ---------------------------------------------------------------
// Boite de connexion (une seule a la fois)
// ---------------------------------------------------------------
let dialogueEnCours = null;

function ouvrirConnexion() {
  if (dialogueEnCours) return dialogueEnCours;
  dialogueEnCours = new Promise((resolve) => {
    const fond = document.createElement("div");
    fond.style.cssText =
      "position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px";
    const boite = document.createElement("div");
    boite.setAttribute("role", "dialog");
    boite.setAttribute("aria-label", "Connexion");
    boite.style.cssText =
      "background:#fff;color:#1f2933;width:100%;max-width:360px;border-radius:12px;padding:18px;font:16px/1.4 system-ui,sans-serif";

    const titre = document.createElement("h3");
    titre.textContent = "Connexion à Diisoo";
    titre.style.cssText = "margin:0 0 12px;font-size:18px";

    const champ = (type, placeholder, auto) => {
      const i = document.createElement("input");
      i.type = type;
      i.placeholder = placeholder;
      i.autocomplete = auto;
      i.style.cssText =
        "width:100%;box-sizing:border-box;padding:11px;margin:0 0 10px;border:1px solid #9aa5b1;border-radius:8px;font-size:16px";
      return i;
    };
    const email = champ("email", "Email", "email");
    const mdp = champ("password", "Mot de passe (6 caractères minimum)", "current-password");

    const bouton = (texte, principal) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = texte;
      b.style.cssText =
        "width:100%;padding:12px;margin:0 0 8px;border-radius:8px;font-size:16px;cursor:pointer;border:1px solid #0a7d4b;" +
        (principal ? "background:#0a7d4b;color:#fff" : "background:#fff;color:#0a7d4b");
      return b;
    };
    const bConnexion = bouton("Se connecter", true);
    const bInscription = bouton("Créer un compte", false);
    const bFermer = bouton("Annuler", false);
    bFermer.style.border = "1px solid #9aa5b1";
    bFermer.style.color = "#52606d";

    const info = document.createElement("div");
    info.style.cssText = "min-height:20px;margin:4px 0 8px;font-size:14px;color:#b42318";
    info.setAttribute("role", "alert");

    let occupe = false;
    async function action(inscription) {
      if (occupe) return;
      occupe = true;
      info.style.color = "#52606d";
      info.textContent = "Un instant...";
      try {
        const identifiants = { email: email.value.trim(), password: mdp.value };
        const rep = await avecDelai(
          inscription ? sb.auth.signUp(identifiants) : sb.auth.signInWithPassword(identifiants),
          DELAI_RESEAU,
          "connexion"
        );
        if (rep.error) throw rep.error;
        if (!rep.data.session) {
          info.style.color = "#0a7d4b";
          info.textContent = "Compte créé. Confirme ton email, puis connecte-toi.";
          return;
        }
        await chargerSession();
        fond.remove();
        resolve(true);
      } catch (e) {
        info.style.color = "#b42318";
        info.textContent = e.message;
      } finally {
        occupe = false;
      }
    }

    bConnexion.addEventListener("click", () => action(false));
    bInscription.addEventListener("click", () => action(true));
    bFermer.addEventListener("click", () => { fond.remove(); resolve(false); });
    mdp.addEventListener("keydown", (e) => { if (e.key === "Enter") action(false); });

    boite.append(titre, email, mdp, info, bConnexion, bInscription, bFermer);
    fond.appendChild(boite);
    document.body.appendChild(fond);
    email.focus();
  }).finally(() => { dialogueEnCours = null; });
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

// ---------------------------------------------------------------
// Classement Top 5
// ---------------------------------------------------------------
async function top5(listeEl) {
  try {
    const data = sansErreur(await avecDelai(sb.rpc("top5_xp"), DELAI_RESEAU, "classement")) || [];
    if (listeEl) {
      listeEl.textContent = "";
      data.forEach((u, i) => {
        const li = document.createElement("li");
        li.textContent = (i + 1) + ". " + u.pseudo + " : " + u.points_xp + " XP";
        listeEl.appendChild(li);
      });
    }
    return data;
  } catch (e) {
    console.error(e.message);
    return [];
  }
}

// ---------------------------------------------------------------
// Paiement : Premium (5 000 FCFA) et recharge (1 000 FCFA)
// ---------------------------------------------------------------
let achatEnCours = false;

async function acheter(type) {
  if (achatEnCours) return;
  if (type !== "premium" && type !== "recharge") return;
  achatEnCours = true;
  let fenetre = null;
  try {
    if (!(await assurerConnexion())) return;
    fenetre = window.open("about:blank", "_blank");
    const rep = await avecDelai(sb.functions.invoke("paytech-creer", { body: { type } }), 25000, "paiement");
    if (rep.error || !rep.data || !rep.data.url) throw rep.error || new Error("adresse de paiement absente");
    if (fenetre) { fenetre.opener = null; fenetre.location.href = rep.data.url; }
    else window.open(rep.data.url, "_blank");
  } catch (e) {
    console.error(e.message);
    if (fenetre) { try { fenetre.close(); } catch (e2) { /* ignore */ } }
    message("Paiement indisponible. Réessaie dans un instant.");
  } finally {
    achatEnCours = false;
  }
}

async function gererRetourPaiement() {
  const retour = new URLSearchParams(location.search).get("paiement");
  if (!retour) return;
  history.replaceState(null, "", location.pathname);
  if (retour === "annule") { message("Paiement annulé."); return; }
  if (!etat.user) return;
  message("Vérification du paiement...");
  const avant = etat.profil
    ? { p: etat.profil.est_premium, c: etat.profil.credits_voix }
    : { p: false, c: 0 };
  for (let i = 0; i < 8; i++) {
    const profil = await rafraichirProfil();
    if (profil && (profil.est_premium !== avant.p || profil.credits_voix !== avant.c)) {
      message("Paiement confirmé. Merci !");
      return;
    }
    await pause(3000);
  }
  message("Paiement en cours de confirmation. Reviens dans quelques minutes.");
}

// ---------------------------------------------------------------
// Wolof : dictionnaire de normalisation (voyelles longues, accents)
// Forme courante sans accents -> forme standard.
// Les mots d'origine francaise (marche, douane, conteneur, pieces, etc.) restent
// en orthographe francaise, comme dans les textes de reference d'Oolel.
// Evite les cles ambigues (ex. "naan" = boire, "degg"/"dëgg", "net", "new").
// ---------------------------------------------------------------
const DICO_WOLOF = new Map(Object.entries({
  // Salutations et politesse
  salamalekum: "asalaa maalekum", salamaleykum: "asalaa maalekum", malekum: "maalekum",
  mangi: "maa ngi", yaangi: "yaa ngi",
  jamm: "jàmm", yalla: "yàlla",
  jerejef: "jërëjëf", jerejeef: "jërëjëf",
  waw: "waaw", dedet: "déedéet", deedeet: "déedéet", deedet: "déedéet",
  ndeysan: "ndeysaan", teranga: "teraanga", benen: "beneen",

  // Personnes
  gor: "goor", jigeen: "jigéen", toubab: "tubaab",

  // Temps
  bes: "bés", demb: "démb", elleg: "ëllëg", legi: "léegi",

  // Commerce, marche, negociation
  jaykat: "jaaykat", jend: "jënd", xalis: "xaalis", njeg: "njëg",
  gaw: "gaaw", tuti: "tuuti", wanni: "wàññi", wani: "wàññi",
  waxtan: "waxtaan", laj: "laaj", liggey: "liggéey", ligey: "liggéey",

  // Import, export, circulation
  genne: "génne", yon: "yoon", jang: "jàng",

  // Nombres et prix
  naar: "ñaar", nett: "ñett", nent: "ñent", ñata: "ñaata", nyata: "ñaata",
  juroom: "juróom", temeer: "téeméer", teemeer: "téeméer", juni: "junni",
}));

function normaliserWolof(texte) {
  return texte.replace(/[\p{L}]+/gu, (m) => {
    const v = DICO_WOLOF.get(m.toLowerCase());
    return v !== undefined ? v : m;
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

// ---------------------------------------------------------------
// Cache communautaire (table diisoo_lecons)
// ---------------------------------------------------------------
async function hashTexte(t) {
  if (!window.crypto || !crypto.subtle) return null;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function lireCache(texte) {
  try {
    const h = await hashTexte(texte);
    if (!h) return null;
    const data = sansErreur(
      await avecDelai(
        sb.from("diisoo_lecons").select("audio_base64, mime").eq("hash", h).maybeSingle(),
        8000,
        "cache"
      )
    );
    return data || null;
  } catch (e) {
    console.error(e.message);
    return null;
  }
}

function ecrireCache(texte, base64, mime) {
  avecDelai(sb.rpc("enregistrer_lecon", { p_texte: texte, p_audio: base64, p_mime: mime }), DELAI_RESEAU, "ecriture cache")
    .then((rep) => { if (rep && rep.error) console.error(rep.error.message); })
    .catch((e) => console.error(e.message));
}

// ---------------------------------------------------------------
// Moteur Oolel (Gradio) : connexion unique, delais maximum, reprise apres echec
// ---------------------------------------------------------------
let promesseClient = null;

function clientOolel() {
  if (!promesseClient) {
    promesseClient = avecDelai(Client.connect("soynade-research/Oolel-Voices-Demo"), 30000, "connexion voix")
      .catch((e) => { promesseClient = null; throw e; });
  }
  return promesseClient;
}

async function genererOolel(texte) {
  try {
    const client = await clientOolel();
    const r = await avecDelai(
      client.predict("/generate_tts_audio", {
        text_input: texte,
        exaggeration_input: 0.3,
        temperature_input: 0.2,
        seed_num_input: 0,
        cfgw_input: 0.5,
      }),
      90000,
      "synthese"
    );
    const url = r && r.data && r.data[0] && r.data[0].url;
    if (!url) throw new Error("reponse vide");
    const rep = await avecDelai(fetch(url), 30000, "telechargement audio");
    if (!rep.ok) throw new Error("audio indisponible");
    return await rep.blob();
  } catch (e) {
    promesseClient = null;
    throw e;
  }
}

function blobVersBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

// Decodage asynchrone via fetch(data:) pour ne pas figer l'interface
async function base64VersBlob(b64, mime) {
  try {
    const rep = await fetch("data:" + mime + ";base64," + b64);
    return await rep.blob();
  } catch (e) {
    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new Blob([u8], { type: mime });
  }
}

// Nettoyage memoire : 30 s maximum si jamais lu, 15 s apres la fin de lecture
function jouerBlob(blob) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    let fini = false;
    const nettoyer = () => {
      if (fini) return;
      fini = true;
      clearTimeout(tMax);
      audio.pause();
      audio.removeAttribute("src");
      URL.revokeObjectURL(url);
      resolve();
    };
    const tMax = setTimeout(nettoyer, 30000);
    audio.addEventListener("playing", () => clearTimeout(tMax), { once: true });
    audio.addEventListener("ended", () => { setTimeout(nettoyer, 15000); resolve(); });
    audio.addEventListener("error", nettoyer);
    audio.play().catch(() => { message("Lecture impossible. Touche à nouveau pour écouter."); nettoyer(); });
  });
}

async function preparerMorceau(morceau) {
  const cache = await lireCache(morceau);
  if (cache) return base64VersBlob(cache.audio_base64, cache.mime);
  const blob = await genererOolel(morceau);
  blobVersBase64(blob)
    .then((b64) => {
      if (b64.length <= 600000) ecrireCache(morceau, b64, blob.type || "audio/wav");
      else console.warn("Audio trop gros pour le cache : " + b64.length);
    })
    .catch((e) => console.error(e && e.message));
  return blob;
}

let lectureEnCours = false;

async function ecouter(texteWolof) {
  if (lectureEnCours) return "occupe";
  if (!texteWolof || !String(texteWolof).trim()) return "vide";
  lectureEnCours = true;
  try {
    if (!(await assurerConnexion())) return "connexion";
    if (!peutEcouter()) {
      message("Limite atteinte. Passe en Premium ou recharge tes écoutes.");
      return "limite";
    }
    const morceaux = chunkWolofText(String(texteWolof));
    if (!morceaux.length) return "vide";
    // Le morceau suivant est prepare pendant la lecture du precedent
    const lancer = (m) => { const p = preparerMorceau(m); p.catch(() => {}); return p; };
    let suivante = lancer(morceaux[0]);
    for (let i = 0; i < morceaux.length; i++) {
      const blob = await suivante;
      if (i === 0) consommerEcoute();
      if (i + 1 < morceaux.length) suivante = lancer(morceaux[i + 1]);
      await jouerBlob(blob);
    }
    return "ok";
  } catch (e) {
    console.error(e.message);
    message("Voix indisponible pour le moment. Réessaie plus tard.");
    return "erreur";
  } finally {
    lectureEnCours = false;
  }
}

// ---------------------------------------------------------------
// Coach vocal : reconnaissance nettoyee, serie de jours, XP
// ---------------------------------------------------------------
function nettoyerTexte(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 300);
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
      if (erreur) reject(erreur); else resolve(valeur);
    };
    garde = setTimeout(() => { try { rec.stop(); } catch (e) { /* ignore */ } terminer([]); }, 12000);
    rec.onresult = (e) => terminer([...e.results[0]].map((a) => a.transcript));
    rec.onerror = (e) => terminer(null, new Error(e.error));
    rec.onend = () => terminer([]);
    try { rec.start(); } catch (e) { terminer(null, e); }
  });
}

async function enregistrerValidation() {
  try {
    const data = sansErreur(await avecDelai(sb.rpc("valider_exercice"), DELAI_RESEAU, "validation"));
    if (!data || !data[0]) return null;
    if (etat.profil) { etat.profil.points_xp = data[0].xp_total; etat.profil.serie_jours = data[0].serie; }
    return { xp: data[0].xp_total, serie: data[0].serie };
  } catch (e) {
    console.error(e.message);
    return null;
  }
}

// langue : "fr-FR" ou "en-US" (le wolof n'est pas reconnu par le navigateur)
async function verifierReponse(attendu, langue) {
  if (!(await assurerConnexion())) return { ok: false, erreur: "connexion" };
  let propositions;
  try { propositions = await ecouterReponse(langue); }
  catch (e) { return { ok: false, erreur: e.message }; }
  const cible = nettoyerTexte(attendu);
  const juste = propositions.some((p) => similarite(nettoyerTexte(p), cible) >= SEUIL_SIMILARITE);
  if (!juste) return { ok: false };
  const bilan = await enregistrerValidation();
  return Object.assign({ ok: true }, bilan || {});
}

// Pour les phrases wolof (pas de reconnaissance) : bouton "J'ai repete"
async function validerRepetition() {
  if (!(await assurerConnexion())) return null;
  return await enregistrerValidation();
}

// ---------------------------------------------------------------
// PWA : service worker avec mise a jour automatique
// ---------------------------------------------------------------
function enregistrerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  const avaitControleur = !!navigator.serviceWorker.controller;
  let rechargement = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!avaitControleur || rechargement) return;
    rechargement = true;
    persisterReservoir();
    window.location.reload();
  });

  navigator.serviceWorker.register("./service-worker.js")
    .then((reg) => {
      const activer = (sw) => { if (sw) sw.postMessage({ type: "SKIP_WAITING" }); };
      if (reg.waiting && navigator.serviceWorker.controller) activer(reg.waiting);
      reg.addEventListener("updatefound", () => {
        const nouveau = reg.installing;
        if (!nouveau) return;
        nouveau.addEventListener("statechange", () => {
          if (nouveau.state === "installed" && navigator.serviceWorker.controller) activer(nouveau);
        });
      });
      const verifier = () => { reg.update().catch(() => {}); };
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") verifier();
      });
      setInterval(verifier, 30 * 60 * 1000);
    })
    .catch((e) => console.error("SW", e.message));
}

// ---------------------------------------------------------------
// Demarrage et API publique : window.Diisoo
// ---------------------------------------------------------------
let initFait = false;

async function init() {
  if (initFait) return;
  initFait = true;
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
  acheter,
  top5,
  verifierReponse,
  validerRepetition,
  rafraichirProfil,
  etat: () => ({
    segment: etat.segment,
    connecte: !!etat.user,
    premium: estPremium(),
    quotaGratuit: QUOTA_GRATUIT[etat.segment],
    ecoutesUtilisees: voixUtilisees(),
    creditsRestants: creditsRestants(),
    xp: etat.profil ? etat.profil.points_xp : 0,
    serie: etat.profil ? etat.profil.serie_jours : 0,
  }),
};

init();
