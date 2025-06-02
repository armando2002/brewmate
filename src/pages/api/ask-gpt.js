export const prerender = false;

export async function POST({ request }) {
  try {
    const raw = await request.text();
    console.log("📥 RAW REQUEST BODY:", raw);
    const body = raw ? JSON.parse(raw) : {};
    console.log("🧠 Parsed body:", body);

    const prompt = body.prompt?.trim();
    console.log("🔎 Final prompt:", prompt);

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt cannot be empty." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const exampleAnswer = `Here’s a dark beer recipe:\n\n- 7 lbs Pale Malt\n- 1 lb Chocolate Malt\n- 0.5 lb Carafa III\n- 0.5 oz Fuggle at 60 min\n- Yeast: Safale US-05\n- Estimated ABV: 4.2%`;

    return new Response(
      JSON.stringify({ answer: exampleAnswer }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ JSON parse error:", err);
    return new Response(
      JSON.stringify({ error: "Invalid JSON format." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
