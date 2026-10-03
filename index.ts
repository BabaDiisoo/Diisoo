import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const VOIX: Record<string, string> = {
  adam: "pNInz6obpgDQGcFmaJgB",
  rachel: "21m00Tcm4TlvDq8ikWAM",
};

function versBase64(buf: ArrayBuffer): string {
  const o = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < o.length; i += 0x8000) s += String.fromCharCode(...o.subarray(i, i + 0x8000));
  return btoa(s);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const { texte, voix } = await req.json();
    const t = String(texte || "").trim().slice(0, 500);
    const nom = VOIX[String(voix || "adam")] ? String(voix || "adam") : "adam";
    if (!t) return new Response(JSON.stringify({ erreur: "texte vide" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) return new Response(JSON.stringify({ erreur: "connexion requise" }), { status: 401, headers: { ...CORS, "Content-Type": "application/json" } });

    const rep = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOIX[nom]}?output_format=mp3_44100_64`, {
      method: "POST",
      headers: { "xi-api-key": Deno.env.get("ELEVENLABS_API_KEY")!, "Content-Type": "application/json" },
      body: JSON.stringify({ text: t, model_id: "eleven_turbo_v2_5" }),
    });
    if (!rep.ok) return new Response(JSON.stringify({ erreur: "tts " + rep.status }), { status: 502, headers: { ...CORS, "Content-Type": "application/json" } });

    const audio = versBase64(await rep.arrayBuffer());
    return new Response(JSON.stringify({ audio_base64: audio, mime: "audio/mpeg" }), { headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ erreur: String(e) }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});
