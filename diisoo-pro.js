// diisoo-pro.js : logique commerciale de Diisoo (Taches 1 a 5)
// A inclure dans index.html avec : <script type="module" src="diisoo-pro.js"></script>

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

// ---------------------------------------------------------------
// CONFIGURATION : remplace ces deux valeurs (Supabase > Project Settings > API)
// Utilise la cle "anon public". Ne mets JAMAIS la cle "service_role" ici.
// ---------------------------------------------------------------
const CONFIG = {
  SUPABASE_URL: "https://jkwtyoefqvafnlqkhium.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable__lzrlmMaJdFC_kav6DkfEA_UbH6DiTC",
};

if (CONFIG.SUPABASE_URL.startsWith("COLLE_ICI")) {
  console.error("Diisoo : renseigne SUPABASE_URL et SUPABASE_ANON_KEY dans diisoo-pro.js");
}

const sb = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const QUOTA_GRATUIT = { local: 100, etranger: 15 };
const etat = { user: null, profil: null, segment: "local" };

// ---------------------------------------------------------------
// Utilitaires d'interface (message court en bas de l'ecran)
// ---------------------------------------------------------------
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
// TACHE 2 : segmentation etrangers / locaux
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
// TACHE 2 : reservoir local, synchronisation differee (5 s)
// ---------------------------------------------------------------
let res = { voix: 0, credits: 0, attVoix: 0, attCredits: 0 };
const cleReservoir = () => "diisoo_reservoir_" + (etat.user ? etat.user.id : "anon");

function chargerReservoir() {
  res = { voix: 0, credits: 0, attVoix: 0, attCredits: 0 };
  try {
    const r = JSON.parse(localStorage.getItem(cleReservoir()));
    if (r) {
      res.attVoix = Number(r.attVoix) || 0;
      res.attCredits = Number(r.attCredits) || 0;
    }
  } catch (e) { /* ignore */ }
}

function sauverReservoir() {
  try { localStorage.setItem(cleReservoir(), JSON.stringify(res)); } catch (e) { /* ignore */ }
}

async function rafraichirProfil() {
  if (!etat.user) return null;
  const { data, error } = await sb
    .from("diisoo_profiles")
    .select("est_premium, compteur_voix, credits_voix, points_xp, serie_jours")
    .single();
  if (error) { console.error(error.message); return null; }
  etat.profil = data;
  res.voix = data.compteur_voix + res.attVoix;
  res.credits = Math.max(0, data.credits_voix - res.attCredits);
  sauverReservoir();
  return data;
}

const estPremium = () => !!(etat.profil && etat.profil.est_premium);

function peutEcouter() {
  return estPremium() || res.voix < QUOTA_GRATUIT[etat.segment] || res.credits > 0;
}

function consommerEcoute() {
  if (estPremium()) return;
  if (res.voix < QUOTA_GRATUIT[etat.segment]) { res.voix++; res.attVoix++; }
  else { res.credits--; res.attCredits++; }
  sauverReservoir();
  planifierSync();
}

let minuteurSync = null;
function planifierSync() {
  clearTimeout(minuteurSync);
  minuteurSync = setTimeout(syncServeur, 5000);
}

async function syncServeur() {
  if (!etat.user) return;
  try {
    if (res.attVoix > 0) {
      const n = Math.min(res.attVoix, 50);
      const { error } = await sb.rpc("incrementer_voix", { p_n: n });
      if (error) throw error;
      res.attVoix -= n;
    }
    if (res.attCredits > 0) {
      const n = Math.min(res.attCredits, 500);
      const { error } = await sb.rpc("consommer_credits", { p_n: n });
      if (error) throw error;
      res.attCredits -= n;
    }
    sauverReservoir();
    if (res.attVoix > 0 || res.attCredits > 0) planifierSync();
  } catch (e) {
    console.error(e.message);
    planifierSync();
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") syncServeur();
});

// ---------------------------------------------------------------
// Connexion (boite simple creee en JavaScript, utilisee seulement si besoin)
// ---------------------------------------------------------------
async function chargerSession() {
  const { data } = await sb.auth.getSession();
  etat.user = data.session ? data.session.user : null;
  if (etat.user) {
    chargerReservoir();
    await rafraichirProfil();
  } else {
    etat.profil = null;
  }
  return !!etat.user;
}

function ouvrirConnexion() {
  return new Promise((resolve) => {
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
      i.style.cssText = "width:100%;box-sizing:border-box;padding:11px;margin:0 0 10px;border:1px solid #9aa5b1;border-radius:8px;font-size:16px";
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

    async function action(inscription) {
      info.textContent = "Un instant...";
      const identifiants = { email: email.value.trim(), password: mdp.value };
      const { data, error } = inscription
        ? await sb.auth.signUp(identifiants)
        : await sb.auth.signInWithPassword(identifiants);
      if (error) { info.textContent = error.message; return; }
      if (!data.session) {
        info.style.color = "#0a7d4b";
        info.textContent = "Compte créé. Confirme ton email, puis connecte-toi.";
        return;
      }
      await chargerSession();
      fond.remove();
      resolve(true);
    }

    bConnexion.addEventListener("click", () => action(false));
    bInscription.addEventListener("click", () => action(true));
    bFermer.addEventListener("click", () => { fond.remove(); resolve(false); });

    boite.append(titre, email, mdp, info, bConnexion, bInscription, bFermer);
    fond.appendChild(boite);
    document.body.appendChild(fond);
    email.focus();
  });
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
// TACHE 1 : classement Top 5
// ---------------------------------------------------------------
async function top5(listeEl) {
  const { data, error } = await sb.rpc("top5_xp");
  if (error) { console.error(error.message); return []; }
  if (listeEl) {
    listeEl.textContent = "";
    data.forEach((u, i) => {
      const li = document.createElement("li");
      li.textContent = (i + 1) + ". " + u.pseudo + " : " + u.points_xp + " XP";
      listeEl.appendChild(li);
    });
  }
  return data;
}

// ---------------------------------------------------------------
// TACHE 2 : achat Premium (5 000 FCFA) et recharge (1 000 FCFA)
// ---------------------------------------------------------------
async function acheter(type) {
  if (!(await assurerConnexion())) return;
  const fenetre = window.open("about:blank", "_blank");
  const { data, error } = await sb.functions.invoke("paytech-creer", { body: { type } });
  if (error || !data || !data.url) {
    if (fenetre) fenetre.close();
    message("Paiement indisponible. Réessaie dans un instant.");
    return;
  }
  if (fenetre) { fenetre.opener = null; fenetre.location.href = data.url; }
  else window.open(data.url, "_blank");
}

async function gererRetourPaiement() {
  const params = new URLSearchParams(location.search);
  const retour = params.get("paiement");
  if (!retour) return;
  history.replaceState(null, "", location.pathname);
  if (retour === "annule") { message("Paiement annulé."); return; }
  if (!etat.user) return;
  message("Vérification du paiement...");
  const avant = etat.profil ? { p: etat.profil.est_premium, c: etat.profil.credits_voix } : { p: false, c: 0 };
  for (let i = 0; i < 8; i++) {
    const profil = await rafraichirProfil();
    if (profil && (profil.est_premium !== avant.p || profil.credits_voix !== avant.c)) {
      message("Paiement confirmé. Merci !");
      return;
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  message("Paiement en cours de confirmation. Reviens dans quelques minutes.");
}

// ---------------------------------------------------------------
// TACHE 3 : texte wolof, cache communautaire, moteur Oolel
// ---------------------------------------------------------------
// Dictionnaire a enrichir : forme courante vers forme correcte (voyelles longues, accents)
const DICO_WOLOF = { jerejef: "jërëjëf", waw: "waaw", deedeet: "déedéet", bax: "baax" };

function normaliserWolof(texte) {
  return texte.replace(/[\p{L}]+/gu, (m) => DICO_WOLOF[m.toLowerCase()] ?? m);
}

function chunkWolofText(texte, max = 500) {
  let reste = normaliserWolof(texte).replace(/\s+/g, " ").trim();
  const morceaux = [];
  while (reste.length > max) {
    const fenetre = reste.slice(0, max);
    let i = Math.max(fenetre.lastIndexOf("."), fenetre.lastIndexOf(";"), fenetre.lastIndexOf(","));
    if (i < 1) i = fenetre.lastIndexOf(" ");
    if (i < 1) i = max - 1;
    morceaux.push(reste.slice(0, i + 1).trim());
    reste = reste.slice(i + 1).trim();
  }
  if (reste) morceaux.push(reste);
  return morceaux;
}

async function hashTexte(t) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function lireCache(texte) {
  const h = await hashTexte(texte);
  const { data } = await sb.from("diisoo_lecons").select("audio_base64, mime").eq("hash", h).maybeSingle();
  return data || null;
}

async function ecrireCache(texte, base64, mime) {
  const { error } = await sb.rpc("enregistrer_lecon", { p_texte: texte, p_audio: base64, p_mime: mime });
  if (error) console.error(error.message);
}

const avecDelai = (p, ms) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("delai")), ms))]);

let clientOolel = null;
async function genererOolel(texte) {
  if (!clientOolel) {
    clientOolel = await avecDelai(Client.connect("soynade-research/Oolel-Voices-Demo"), 30000);
  }
  const r = await avecDelai(
    clientOolel.predict("/generate_tts_audio", {
      text_input: texte,
      exaggeration_input: 0.3,
      temperature_input: 0.2,
      seed_num_input: 0,
      cfgw_input: 0.5,
    }),
    90000
  );
  const rep = await fetch(r.data[0].url);
  if (!rep.ok) throw new Error("audio indisponible");
  return await rep.blob();
}

function blobVersBase64(blob) {
  return new Promise((res2, rej) => {
    const r = new FileReader();
    r.onload = () => res2(String(r.result).split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

function base64VersBlob(b64, mime) {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], { type: mime });
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
    audio.play().catch(nettoyer);
  });
}

async function ecouter(texteWolof) {
  if (!(await assurerConnexion())) return "connexion";
  if (!peutEcouter()) {
    message("Limite atteinte. Passe en Premium ou recharge tes écoutes.");
    return "limite";
  }
  try {
    const blobs = [];
    for (const morceau of chunkWolofText(texteWolof)) {
      let blob;
      const cache = await lireCache(morceau);
      if (cache) {
        blob = base64VersBlob(cache.audio_base64, cache.mime);
      } else {
        blob = await genererOolel(morceau);
        const b64 = await blobVersBase64(blob);
        if (b64.length <= 600000) ecrireCache(morceau, b64, blob.type || "audio/wav");
        else console.warn("Audio trop gros pour le cache : " + b64.length);
      }
      blobs.push(blob);
    }
    consommerEcoute();
    for (const b of blobs) await jouerBlob(b);
    return "ok";
  } catch (e) {
    console.error(e.message);
    message("Voix indisponible pour le moment. Réessaie plus tard.");
    return "erreur";
  }
}

// ---------------------------------------------------------------
// TACHE 4 : coach vocal (reconnaissance nettoyee, serie de jours, XP)
// ---------------------------------------------------------------
function nettoyerTexte(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
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
    rec.onresult = (e) => resolve([...e.results[0]].map((a) => a.transcript));
    rec.onerror = (e) => reject(new Error(e.error));
    rec.onend = () => resolve([]);
    rec.start();
  });
}

async function enregistrerValidation() {
  const { data, error } = await sb.rpc("valider_exercice");
  if (error) { console.error(error.message); return null; }
  if (etat.profil) { etat.profil.points_xp = data[0].xp_total; etat.profil.serie_jours = data[0].serie; }
  return { xp: data[0].xp_total, serie: data[0].serie };
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
// TACHE 5 : PWA (service worker)
// ---------------------------------------------------------------
function enregistrerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./service-worker.js").catch((e) => console.error("SW", e.message));
}

// ---------------------------------------------------------------
// Demarrage et API publique : window.Diisoo
// ---------------------------------------------------------------
async function init() {
  etat.segment = detecterSegment();
  await chargerSession();
  sb.auth.onAuthStateChange((evenement) => {
    if (evenement === "SIGNED_OUT") { etat.user = null; etat.profil = null; }
  });
  enregistrerServiceWorker();
  await gererRetourPaiement();
}

window.Diisoo = {
  init,
  connexion: ouvrirConnexion,
  deconnexion: () => sb.auth.signOut(),
  ecouter,                 // Diisoo.ecouter("texte wolof")
  acheter,                 // Diisoo.acheter("premium") ou Diisoo.acheter("recharge")
  top5,                    // Diisoo.top5(elementUl)
  verifierReponse,         // Diisoo.verifierReponse("phrase attendue", "fr-FR")
  validerRepetition,       // Diisoo.validerRepetition()
  rafraichirProfil,
  etat: () => ({
    segment: etat.segment,
    connecte: !!etat.user,
    premium: estPremium(),
    quotaGratuit: QUOTA_GRATUIT[etat.segment],
    ecoutesUtilisees: res.voix,
    creditsRestants: res.credits,
    xp: etat.profil ? etat.profil.points_xp : 0,
    serie: etat.profil ? etat.profil.serie_jours : 0,
  }),
};

init();
