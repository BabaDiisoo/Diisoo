#!/usr/bin/env python3
"""verifier.py : contrôle avant dépôt sur GitHub. Lancer : python3 verifier.py
Vérifie : syntaxe de tous les scripts, fichiers chargés présents et mis en cache (sw.js),
bundles à jour avec leurs scripts, JSON valides, contenu des examens cohérent, aucune clé secrète.
Code de sortie 1 s'il y a un problème bloquant."""
import re, os, sys, json, glob, subprocess
bloquants, avis = [], []
def lire(p): return open(p, encoding="utf-8").read()
# 1. syntaxe JS
for f in sorted(glob.glob("*.js")):
    if f.startswith("supabase-js"): continue
    r = subprocess.run(["node", "--check", f], capture_output=True, text=True)
    if r.returncode: bloquants.append("Syntaxe JS invalide : %s" % f)
# 2. chargeur / cache
L = lire("diisoo-secteurs-loader.js"); sw = lire("sw.js")
charges = set(re.findall(r'"(diisoo-[a-z0-9\-]+\.js)"', L)) | set(re.findall(r'src = "([^"]+\.js)"', L))
for f in sorted(charges):
    if not os.path.exists(f): bloquants.append("Chargé mais introuvable : %s" % f)
    elif f not in sw: bloquants.append("Chargé mais absent du cache hors ligne (sw.js) : %s" % f)
for f in glob.glob("*-data.json") + ["exam-formats.json"]:
    if os.path.exists(f) and f not in sw and f.startswith(("toefl", "toeic", "cambridge", "duolingo", "pte")):
        bloquants.append("Contenu absent du cache hors ligne : %s" % f)
v = re.search(r'VERSION = "(diisoo-cache-v\d+)"', sw).group(1)
try:
    ancien = subprocess.check_output(["git", "show", "HEAD:sw.js"], stderr=subprocess.DEVNULL).decode()
    vh = re.search(r'VERSION = "(diisoo-cache-v\d+)"', ancien).group(1)
    modifies = subprocess.check_output(["git", "status", "--short"]).decode().split("\n")
    code = [l for l in modifies if re.search(r"\.(js|json|html)$", l) and "sw.js" not in l]
    if code and v == vh: avis.append("Des fichiers ont changé mais la version du cache est restée %s (à augmenter dans sw.js)" % v)
except Exception: pass
# 3. bundles synchronisés
for b in ["diisoo-b%d.js" % i for i in range(1, 7)] + ["diisoo-bundle.js"]:
    s = lire(b)
    for m in re.finditer(r"/\* ---- (\S+\.js) ---- \*/\n", s):
        f = m.group(1); d = m.end(); fin = s.find('}catch(e){console.error("Diisoo : erreur dans %s"' % f, d)
        if not os.path.exists(f): continue
        if s[d:fin] != lire(f) + "\n": bloquants.append("Bundle périmé : %s contient une ancienne version de %s (python3 regen_bundles.py %s)" % (b, f, f))
# 4. JSON valides
for f in glob.glob("*.json"):
    try: json.load(open(f, encoding="utf-8"))
    except Exception as e: bloquants.append("JSON invalide : %s (%s)" % (f, str(e)[:60]))
# 5. contenu des examens
def qs_ok(qs, ctx):
    for q in qs:
        if not isinstance(q.get("b"), int) or not (0 <= q["b"] < len(q.get("o", []))): bloquants.append("Réponse hors limites : %s : %s" % (ctx, q.get("p", "")[:40]))
        if len(set(q.get("o", []))) != len(q.get("o", [])): bloquants.append("Options en double : %s : %s" % (ctx, q.get("p", "")[:40]))
def walk(x, ctx):
    if isinstance(x, dict):
        if "o" in x and "b" in x and "p" in x and isinstance(x["b"], int): qs_ok([x], ctx)
        if "texte" in x and "[[" in str(x["texte"]) and not re.search(r"\[\[[^\]]+\]\]", x["texte"]): bloquants.append("Blancs mal formés : " + ctx)
        for k, v in x.items(): walk(v, ctx)
    elif isinstance(x, list):
        for v in x: walk(v, ctx)
for f in glob.glob("*-data.json"): walk(json.load(open(f, encoding="utf-8")), f)
try:
    ef = json.load(open("exam-formats.json", encoding="utf-8"))["examens"]
    for k, e in ef.items():
        for t in e.get("tests", []):
            if "id" not in t or "titre" not in t: bloquants.append("Test sans id ou titre dans %s" % k)
        ids = [t.get("id") for t in e.get("tests", [])]
        if len(ids) != len(set(ids)): bloquants.append("Identifiants de test en double dans %s" % k)
    for b, lst in ef["visa"].get("pool", {}).items():
        qq = [x["q"] for x in lst]
        if len(qq) != len(set(qq)): bloquants.append("Question en double dans la réserve visa (%s)" % b)
        for x in lst:
            if not x.get("cles") or not x.get("modele"): bloquants.append("Question visa incomplète : %s" % x.get("q", "")[:40])
except Exception as e: bloquants.append("exam-formats.json : " + str(e)[:80])
# 5b. voix anglaise pré-enregistrées : index cohérent avec les paquets
try:
    ix = json.load(open("audio-en/index.json", encoding="utf-8"))
    taille = {}
    for k, (n, off, ln) in ix["i"].items():
        f = "audio-en/p%03d.mp3" % n
        if f not in taille: taille[f] = os.path.getsize(f) if os.path.exists(f) else -1
        if taille[f] < 0: bloquants.append("Paquet audio manquant : %s" % f); break
        if off + ln > taille[f]: bloquants.append("Index audio hors limites : %s" % k); break
except FileNotFoundError: avis.append("Pas de dossier audio-en (voix anglaise pré-enregistrée absente)")
# 6. secrets
for f in glob.glob("*.js") + glob.glob("*.html") + glob.glob("*.json"):
    s = lire(f)
    for m in re.finditer(r"eyJhbGciOi[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.", s):
        import base64
        p = m.group(1); p += "=" * (-len(p) % 4)
        try:
            if json.loads(base64.urlsafe_b64decode(p)).get("role") == "service_role": bloquants.append("CLÉ SECRÈTE service_role dans %s" % f)
        except Exception: pass
    if re.search(r"sk-[A-Za-z0-9]{32,}|sk_live_[A-Za-z0-9]{20,}", s): bloquants.append("Clé secrète probable dans %s" % f)
print("Version du cache : %s · %d scripts chargés" % (v, len(charges)))
for a in avis: print("  ⚠ " + a)
for b in bloquants: print("  ✘ " + b)
print("\n" + ("%d problème(s) à corriger avant dépôt" % len(bloquants) if bloquants else "Tout est prêt pour le dépôt"))
sys.exit(1 if bloquants else 0)
