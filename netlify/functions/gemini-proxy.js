// Netlify Function — Gemini proxy
// Reads GEMINI_API_KEY from the environment; never exposed to the browser.

const ALLOWED_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-exp"
];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

const json = (statusCode, obj) => ({
  statusCode,
  headers: { ...CORS, "Content-Type": "application/json" },
  body: JSON.stringify(obj)
});

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[gemini-proxy] GEMINI_API_KEY is not set");
    return json(500, { error: "Gemini API key not configured on server" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const model = ALLOWED_MODELS.includes(payload.model)
    ? payload.model
    : "gemini-2.5-flash";

  if (!payload.body || typeof payload.body !== "object") {
    return json(400, { error: "Missing body (expected { model, body })" });
  }

  try {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model + ":generateContent?key=" + apiKey;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.body)
    });

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: { ...CORS, "Content-Type": "application/json" },
      body: text
    };
  } catch (err) {
    console.error("[gemini-proxy] upstream error:", err);
    return json(502, { error: "Upstream request failed", detail: String(err) });
  }
};
