import asyncio
import json
import os

import edge_tts

VOIX = "en-US-AndrewNeural"
DOSSIER = "voix-manquantes"

os.makedirs(DOSSIER, exist_ok=True)

with open("phrases-manquantes.json", encoding="utf-8") as f:
    phrases = json.load(f)["phrases"]


async def main():
    index = {}
    for i, texte in enumerate(phrases, start=1):
        nom = "v%03d.mp3" % i
        chemin = os.path.join(DOSSIER, nom)
        if not os.path.exists(chemin):
            for essai in range(3):
                try:
                    await edge_tts.Communicate(texte, VOIX).save(chemin)
                    break
                except Exception as e:
                    print("Erreur", nom, e)
                    await asyncio.sleep(2)
        index[texte] = nom
        print(i, "/", len(phrases), nom)
    with open(os.path.join(DOSSIER, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=1)
    print("Termine. Dossier :", DOSSIER)


asyncio.run(main())
