// diisoo-pro.js v3 : logique commerciale de Diisoo
// A inclure dans index.html avec : <script type="module" src="diisoo-pro.js"></script>

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

// ---------------------------------------------------------------
// TACHE 1 : configuration de production (cle publique uniquement)
// ---------------------------------------------------------------
const CONFIG = {
  SUPABASE_URL: "https://jkwtyoefqvafnlqkhium.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable__lzrlmMaJdFC_kav6DkfEA_UbH6DiTC",
};
const SW_URL = "./sw.js"; // meme fichier que celui enregistre par index.html

const sb = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const QUOTA_GRATUIT = { local: 100, etranger: 15 };
const MAX_B64 = 600000; // taille maximale de la chaine Base64 (limite du serveur)
const etat = { user: null, profil: null, segment: "local" };

// ---------------------------------------------------------------
// Utilitaires asynchrones : aucun appel reseau sans delai maximum
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
// Reservoir local : ecoutes en attente persistees par utilisateur.
// Sans compte, le quota gratuit est compte uniquement sur l'appareil.
// ---------------------------------------------------------------
const CAP_ATTENTE = 100000;
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
  } catch (e) { /* donnees corrompues ou stockage indisponible : on garde la memoire */ }
}

function persisterReservoir() {
  try {
    localStorage.setItem(cleReservoir(), JSON.stringify({
      v: 3, attVoix: res.attVoix, attCredits: res.attCredits, localVoix: res.localVoix,
    }));
  } catch (e) { /* mode prive ou quota plein : on reste en memoire */ }
}

window.addEventListener("storage", (e) => {
  if (e.key === cleReservoir()) relireReservoir();
});

const estPremium = () => !!(etat.profil && etat.profil.est_premium);
const voixUtilisees = () => (etat.user && etat.profil ? etat.profil.compteur_voix + res.attVoix : res.localVoix);
const creditsRestants = () =>
  etat.user && etat.profil ? Math.max(0, etat.profil.credits_voix - res.attCredits) : 0;

function peutEcouter() {
  return estPremium() || voixUtilisees() < QUOTA_GRATUIT[etat.segment] || creditsRestants() > 0;
}

function consommerEcoute() {
  if (estPremium()) return;
  relireReservoir();
  if (voixUtilisees() < QUOTA_GRATUIT[etat.segment]) {
    if (etat.user && etat.profil) res.attVoix++; else res.localVoix++;
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
      res.attVoix = 0; res.attCredits = 0; res.localVoix = 0;
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

// ---------------------------------------------------------------
// Boite de connexion (une seule a la fois), utilisee pour acheter
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
// TACHE 5 : dictionnaire wolof (voyelles longues, accents, expressions)
// DICO_BASE : corrections de base conservees. DICO_WOLOF : base commerciale
// fournie, prioritaire en cas de doublon. Les expressions de plusieurs mots
// sont reconnues. A faire valider par un locuteur wolof avant mise en ligne.
// ---------------------------------------------------------------
// BEGIN_DICO
const DICO_BASE = {
  salamalekum: "asalaa maalekum", salamaleykum: "asalaa maalekum", malekum: "maalekum",
  mangi: "maa ngi", yaangi: "yaa ngi", jamm: "jàmm", yalla: "yàlla",
  jerejeef: "jërëjëf", dedet: "déedéet", deedet: "déedéet",
  ndeysan: "ndeysaan", teranga: "teraanga", benen: "beneen",
  gor: "goor", jigeen: "jigéen", toubab: "tubaab",
  bes: "bés", demb: "démb", elleg: "ëllëg", legi: "léegi",
  jaykat: "jaaykat", jend: "jënd", xalis: "xaalis", njeg: "njëg",
  gaw: "gaaw", tuti: "tuuti", wanni: "wàññi", wani: "wàññi",
  waxtan: "waxtaan", laj: "laaj", liggey: "liggéey", ligey: "liggéey",
  genne: "génne", yon: "yoon", jang: "jàng",
  naar: "ñaar", nett: "ñett", nent: "ñent", "ñata": "ñaata", nyata: "ñaata",
  juroom: "juróom", temeer: "téeméer", teemeer: "téeméer", juni: "junni"
};

const DICO_WOLOF = {
  jerejef: "jërëjëf", waw: "waaw", deedeet: "déedéet", bax: "baax",
  "asalamu alaykum": "asalaamu alaykum", "malekum salam": "maalekum salaam",
  "nanga def": "naka nga def", "mangi fi rekk": "maangi fi rekk", "alhamdoulilah": "alhamdulillaah",
  "niata la": "ñaata la", "wanni ko": "wàññi ko", "seer na": "seer na", "jaay ma": "jaay ma",
  "amul weco": "amul weccu", "jox ma weco": "jox ma weccu", "borom bitik": "borom bitik", "waxal dëgg": "waxal dëgg",
  goro: "goro", ndaje: "ndaje", simis: "simis", fukkni: "fukkni", junni: "junni",
  konteener: "konteener", doan: "duwaan", masiin: "masiin", gari: "gari", watur: "woto",
  koran: "kuraŋ", garansi: "garansi", seekal: "seekal", natt: "natt", firi: "firi", bagas: "bagas",
  egsi: "egsi", sinuwaa: "sinuwaa", metar: "metar", kib: "kib", gaal: "gaal", depoo: "depoo",
  kwibar: "kwibar", disonkter: "disoŋteer", kabalu: "kabalu", pies: "piis", imite: "imite", pomp: "pomp",
  ndox: "ndox", rëkk: "rekk", kuman: "kuman", tey: "tey", bank: "baŋk", baram: "baram"
};

const DICO = new Map(
  Object.entries(Object.assign({}, DICO_BASE, DICO_WOLOF)).map(([k, v]) => [k.toLowerCase(), v])
);

const RE_DICO = (function () {
  const cles = Array.from(DICO.keys())
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp("(^|[^\\p{L}\\p{N}])(" + cles.join("|") + ")(?![\\p{L}\\p{N}])", "giu");
})();

function normaliserWolof(texte) {
  return texte.replace(RE_DICO, function (m, avant, mot) {
    const v = DICO.get(mot.toLowerCase());
    return avant + (v !== undefined ? v : mot);
  });
}
// END_DICO

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
// TACHE 3 : triple cache vocal. A) IndexedDB local, B) table texte Supabase,
// C) IA Oolel. Aucun audio binaire sur le serveur : uniquement du Base64 texte.
// ---------------------------------------------------------------
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
          const base = rq.result;
          if (!base.objectStoreNames.contains("audio_cache")) {
            base.createObjectStore("audio_cache", { keyPath: "hash" });
          }
        };
        rq.onsuccess = () => resolve(rq.result);
        rq.onerror = () => resolve(null);
        rq.onblocked = () => resolve(null);
      } catch (e) { resolve(null); }
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
    } catch (e) { resolve(null); }
  });
}

async function idbPut(hash, blob) {
  const base = await ouvrirIDB();
  if (!base) return;
  await new Promise((resolve) => {
    try {
      const tx = base.transaction("audio_cache", "readwrite");
      tx.objectStore("audio_cache").put({ hash: hash, blob: blob, mime: blob.type, taille: blob.size, date: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch (e) { resolve(); }
  });
}

async function lireCache(texte, hashDeja) {
  try {
    const h = hashDeja || (await hashTexte(texte));
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

let promesseClient = null;

function clientOolel() {
  if (!promesseClient) {
    promesseClient = avecDelai(Client.connect("soynade-research/Oolel-Voices-Demo"), 30000, "connexion voix")
      .catch((e) => { promesseClient = null; throw e; });
  }
  return promesseClient;
}

function urlAudioValide(r) {
  const url = r && Array.isArray(r.data) && r.data[0] && typeof r.data[0].url === "string" ? r.data[0].url : "";
  return /^https:\/\//i.test(url) ? url : "";
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
    const url = urlAudioValide(r);
    if (!url) throw new Error("reponse Oolel invalide");
    const rep = await avecDelai(fetch(url), 30000, "telechargement audio");
    if (!rep.ok) throw new Error("audio indisponible");
    const blob = await rep.blob();
    if (!blob || blob.size === 0) throw new Error("audio vide");
    return blob;
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
  const h = await hashTexte(morceau);

  // A. IndexedDB local : aucun appel reseau, fonctionne hors ligne
  if (h) {
    const local = await idbGet(h);
    if (local && local.blob && local.blob.size > 0) return local.blob;
  }

  // B. Table texte Supabase
  const cache = await lireCache(morceau, h);
  if (cache && cache.audio_base64) {
    const blob = await base64VersBlob(cache.audio_base64, cache.mime);
    if (blob && blob.size > 0) {
      if (h) idbPut(h, blob);
      return blob;
    }
  }

  // C. IA vocale Oolel
  const blob = await genererOolel(morceau);
  if (h) idbPut(h, blob);
  blobVersBase64(blob)
    .then((b64) => {
      if (b64 && b64.length <= MAX_B64) ecrireCache(morceau, b64, blob.type || "audio/wav");
      else console.warn("Audio garde en local seulement (trop gros pour le cache serveur)");
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
    if (!peutEcouter()) {
      message("Limite atteinte. Passe en Premium ou recharge tes écoutes.");
      return "limite";
    }
    const morceaux = chunkWolofText(String(texteWolof));
    if (!morceaux.length) return "vide";

    // Le morceau suivant est prepare pendant la lecture du precedent
    const lancer = (m) => { const p = preparerMorceau(m); p.catch(() => {}); return p; };
    let suivante = lancer(morceaux[0]);
    let joues = 0;
    for (let i = 0; i < morceaux.length; i++) {
      let blob = null;
      try {
        blob = await suivante;
      } catch (e) {
        console.error(e.message);
      }
      if (i + 1 < morceaux.length) suivante = lancer(morceaux[i + 1]);
      if (!blob) continue; // un micro-echec saute le fragment sans bloquer la suite
      if (joues === 0) consommerEcoute();
      joues++;
      await jouerBlob(blob);
    }
    if (joues === 0) {
      message("Voix indisponible pour le moment. Réessaie plus tard.");
      return "erreur";
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
    rec.onresult = (e) => terminer(Array.from(e.results[0]).map((a) => a.transcript));
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
// TACHE 4 : attestation de progression Diisoo (seuil strict de 1000 XP)
// L'attestation est creee et enregistree cote serveur (RPC), jamais en local.
// Ce n'est pas une certification officielle et elle ne remplace aucun examen.
// ---------------------------------------------------------------
const SEUIL_CERTIFICATION = 1000;
const RE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RE_SHA256 = /^[0-9a-f]{64}$/i;
const RE_ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|\+00:00)$/;

const certification = {
  async verifier() {
    if (!(await assurerConnexion())) {
      return { connecte: false, eligible: false, xp: 0, seuil: SEUIL_CERTIFICATION, restant: SEUIL_CERTIFICATION };
    }
    await rafraichirProfil();
    const xp = etat.profil ? etat.profil.points_xp : 0;
    return {
      connecte: true,
      eligible: xp >= SEUIL_CERTIFICATION,
      xp: xp,
      seuil: SEUIL_CERTIFICATION,
      restant: Math.max(0, SEUIL_CERTIFICATION - xp),
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

  // Controle public d'une attestation par son identifiant (tiers : banque, transitaire)
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
  },
};

// ---------------------------------------------------------------
// TACHE 6 : 8 themes de commerce charges depuis Supabase (table diisoo_phrases)
// ---------------------------------------------------------------
const THEMES = [
  { id: "axe-chine", titre: "Axe Chine" },
  { id: "port-douane", titre: "Port et Douane" },
  { id: "sandaga", titre: "Sandaga" },
  { id: "colobane", titre: "Colobane" },
  { id: "fintech", titre: "FinTech" },
  { id: "ielts", titre: "IELTS" },
  { id: "voyage", titre: "Voyage" },
  { id: "hotel", titre: "Hôtel" },
];
const cachePhrases = new Map();

async function chargerTheme(id) {
  if (!THEMES.some((t) => t.id === id)) return [];
  if (cachePhrases.has(id)) return cachePhrases.get(id);
  try {
    const data = sansErreur(
      await avecDelai(
        sb.from("diisoo_phrases")
          .select("id, ordre, wolof, francais, anglais")
          .eq("theme", id)
          .order("ordre", { ascending: true })
          .limit(500),
        DELAI_RESEAU,
        "theme"
      )
    ) || [];
    cachePhrases.set(id, data);
    try { localStorage.setItem("diisoo_theme_" + id, JSON.stringify(data)); } catch (e) { /* ignore */ }
    return data;
  } catch (e) {
    console.error(e.message);
    try {
      const sauve = JSON.parse(localStorage.getItem("diisoo_theme_" + id));
      if (Array.isArray(sauve)) return sauve;
    } catch (e2) { /* ignore */ }
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
    b.textContent = "🔊";
    b.setAttribute("aria-label", "Écouter");
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
      Array.from(selecteurEl.children).forEach((x) => { x.style.background = "#fff"; x.style.color = "#0a7d4b"; });
      b.style.background = "#0a7d4b";
      b.style.color = "#fff";
      afficherTheme(listeEl, t.id);
    });
    selecteurEl.appendChild(b);
  });
}

// ---------------------------------------------------------------
// TACHE 2 : PWA, mise a jour automatique sans deconnexion
// ---------------------------------------------------------------
function enregistrerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  const avaitControleur = !!navigator.serviceWorker.controller;
  let rechargement = false;

  const occupe = () =>
    ["screen-test-simulation", "screen-pairs"].some((id) => {
      const el = document.getElementById(id);
      return el && !el.classList.contains("hidden");
    });

  const recharger = () => {
    if (occupe()) { setTimeout(recharger, 10000); return; }
    persisterReservoir();
    window.location.reload();
  };

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!avaitControleur || rechargement) return;
    rechargement = true;
    recharger();
  });

  const brancher = (reg) => {
    const activer = (sw) => { if (sw) sw.postMessage({ type: "SKIP_WAITING" }); };
    if (reg.waiting && navigator.serviceWorker.controller) activer(reg.waiting);
    reg.addEventListener("updatefound", () => {
      const nouveau = reg.installing;
      if (!nouveau) return;
      nouveau.addEventListener("statechange", () => {
        if (nouveau.state === "installed" && navigator.serviceWorker.controller) activer(nouveau);
      });
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") reg.update().catch(() => {});
    });
    setInterval(() => { reg.update().catch(() => {}); }, 30 * 60 * 1000);
  };

  navigator.serviceWorker.getRegistration()
    .then((reg) => reg || navigator.serviceWorker.register(SW_URL))
    .then(brancher)
    .catch((e) => console.error("SW", e.message));
}

// ---------------------------------------------------------------
// Demarrage et API publique : window.Diisoo
// ---------------------------------------------------------------
let initFait = false;

async function init() {
  if (initFait) return;
  initFait = true;
  // Stockage persistant : protege l'appareil contre les purges automatiques
  try {
    if (navigator.storage && navigator.storage.persist) { navigator.storage.persist().catch(() => {}); }
  } catch (e) { /* ignore */ }
  try {
    etat.segment = detecterSegment();
    enregistrerServiceWorker();
    await chargerSession();
    sb.auth.onAuthStateChange((evenement, session) => {
      setTimeout(() => {
        if (evenement === "SIGNED_OUT") {
          etat.user = null;
          etat.profil = null;
          res.attVoix = 0; res.attCredits = 0; res.localVoix = 0;
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
  acheter,
  top5,
  verifierReponse,
  validerRepetition,
  rafraichirProfil,
  certification,
  themes: { liste: THEMES, charger: chargerTheme, afficher: afficherTheme, monter: monterThemes },
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
