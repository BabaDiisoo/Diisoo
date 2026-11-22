#!/usr/bin/env python3
"""make_audio_en.py : fabrique les voix anglaises de Diisoo hors ligne (Kokoro, gratuit), puis les range en paquets.
Étape 1 :  python3 make_audio_en.py generer [debut fin]   (reprend là où elle s'est arrêtée)
Étape 2 :  python3 make_audio_en.py paquets               (crée audio-en/index.json et audio-en/pNNN.mp3)
Les phrases manquantes repérées en ligne se mettent dans audio-en-extra.txt (une par ligne) et on relance."""
import re, os, sys, json, glob, subprocess, hashlib
TMP = os.environ.get("EN_TMP", "/tmp/tf/en"); OUT = "audio-en"; VOIX = "am_michael"; VITESSE = 0.93
def norm(t): return re.sub(r"\s+", " ", str(t)).strip().lower()
def cle(t):  # cyrb53, identique au JavaScript de diisoo-voix-en.js
    m = 0xffffffff; h1, h2 = 0xdeadbeef, 0x41c6ce57; b = norm(t).encode("utf-16-le")
    for c in [b[i] | (b[i + 1] << 8) for i in range(0, len(b), 2)]:
        h1 = ((h1 ^ c) * 2654435761) & m; h2 = ((h2 ^ c) * 1597334677) & m
    n1 = (((h1 ^ (h1 >> 16)) * 2246822507) & m) ^ (((h2 ^ (h2 >> 13)) * 3266489909) & m)
    n2 = (((h2 ^ (h2 >> 16)) * 2246822507) & m) ^ (((n1 ^ (n1 >> 13)) * 3266489909) & m)
    return "%08x%08x" % (n2, n1)
def phrases():
    S = []; vu = set()
    def add(t):
        t = re.sub(r"\s+", " ", str(t)).strip()
        if len(t) < 2 or len(t) > 900 or not re.search(r"[A-Za-z]{2}", t) or norm(t) in vu: return
        vu.add(norm(t)); S.append(t)
    pat = [re.compile(r'\b(?:en|anglais|english|q|modele|eng)\s*:\s*"((?:[^"\\]|\\.)+)"'), re.compile(r'"(?:en|anglais|english)"\s*:\s*"((?:[^"\\]|\\.)+)"')]
    PRIO = ["diisoo-arrivee.js", "diisoo-question-jour.js", "diisoo-quete.js", "diisoo-guide.js", "diisoo-mission-visa.js"]
    def visa_d_abord():
        try:
            ef = json.load(open("exam-formats.json", encoding="utf-8"))["examens"]["visa"]
            for lst in ef.get("pool", {}).values():
                for x in lst: add(x["q"])
        except Exception: pass
    for f in PRIO:
        if os.path.exists(f):
            for p_ in pat:
                for m in p_.finditer(open(f, encoding="utf-8", errors="ignore").read()):
                    if len(m.group(1)) <= 220: add(m.group(1))
    visa_d_abord()
    fich = ["index.html"] + sorted(f for f in glob.glob("*.js") if not re.search(r"-b\d\.js|bundle|supabase|^sw\.js|^test-|^diisoo-secteurs-loader", f))
    for f in fich:
        s = open(f, encoding="utf-8", errors="ignore").read()
        for p in pat:
            for m in p.finditer(s):
                t = m.group(1)
                if len(t) <= 220: add(bytes(t, "utf-8").decode("unicode_escape", "ignore") if "\\" in t else t)
    def walk(x, k=""):
        if isinstance(x, dict):
            for a, b in x.items(): walk(b, a)
        elif isinstance(x, list):
            for b in x: walk(b, k)
        elif isinstance(x, str) and k in ("t", "audio", "q", "dict", "wfd", "modele", "s") and not k == "s": add(x)
    for f in sorted(glob.glob("*-data.json")): walk(json.load(open(f, encoding="utf-8")))
    ef = json.load(open("exam-formats.json", encoding="utf-8"))
    walk(ef)
    if os.path.exists("audio-en-extra.txt"):
        for l in open("audio-en-extra.txt", encoding="utf-8"): add(l)
    return S
def generer(a=0, b=None):
    from kokoro_onnx import Kokoro; import numpy as np, soundfile as sf
    k = Kokoro("/tmp/vid/kokoro-v1.0.int8.onnx", "/tmp/vid/voices-v1.0.bin"); L = phrases()[a:b]; n = 0
    for t in L:
        f = "%s/%s.mp3" % (TMP, cle(t))
        if os.path.exists(f): continue
        s, sr = k.create(t, voice=VOIX, speed=VITESSE, lang="en-us")
        w = f + ".wav"; sf.write(w, s, sr)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", w, "-ac", "1", "-ar", "24000", "-codec:a", "libmp3lame", "-b:a", "32k", f], check=True); os.remove(w); n += 1
    print("générées :", n, "sur", len(L))
def paquets():
    os.makedirs(OUT, exist_ok=True)
    for f in glob.glob(OUT + "/p*.mp3"): os.remove(f)
    index = {}; num = 1; cur = b""; noms = []
    def clore():
        nonlocal cur, num
        if cur: open("%s/p%03d.mp3" % (OUT, num), "wb").write(cur); num += 1; cur = b""
    manque = 0
    for t in phrases():
        f = "%s/%s.mp3" % (TMP, cle(t))
        if not os.path.exists(f): manque += 1; continue
        d = open(f, "rb").read()
        if cur and len(cur) + len(d) > 280000: clore()
        index[cle(t)] = [num, len(cur), len(d)]; cur += d
    clore()
    json.dump({"v": 1, "voix": VOIX, "n": len(index), "i": index}, open(OUT + "/index.json", "w"), separators=(",", ":"))
    print("phrases :", len(index), "· paquets :", num - 1, "· sans audio :", manque)
if __name__ == "__main__":
    c = sys.argv[1] if len(sys.argv) > 1 else ""
    if c == "generer": generer(int(sys.argv[2]) if len(sys.argv) > 2 else 0, int(sys.argv[3]) if len(sys.argv) > 3 else None)
    elif c == "paquets": paquets()
    elif c == "compter": L = phrases(); print(len(L), "phrases,", sum(len(x) for x in L), "caractères")
    else: print(__doc__)
