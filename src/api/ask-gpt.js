export async function POST({ request }) {
  try {
    const { prompt } = await request.json();

    if (!prompt || prompt.trim() === "") {
      return new Response(JSON.stringify({ error: "Prompt is required." }), { status: 400 });
    }

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300
      })
    });

    const data = await gptResponse.json();

    if (!data.choices || !data.choices.length) {
      return new Response(JSON.stringify({ error: "No response from GPT." }), { status: 502 });
    }

    return new Response(JSON.stringify({ answer: data.choices[0].message.content }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", details: err.message }), { status: 500 });
  }
}
