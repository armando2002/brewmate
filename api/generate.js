// api/generate.js
export default async function handler(req, res) {
  // Always set these first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: 'Missing OpenAI API key' });
      return;
    }

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Missing or invalid prompt' });
      return;
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Generate a detailed beer recipe based on this prompt:\n\n"${prompt}"\n\nRespond in structured JSON like:
{
  "name": "...",
  "style": "...",
  "abv": "...",
  "og": "...",
  "fg": "...",
  "srm": "...",
  "ingredients": ["..."],
  "instructions": "..."
}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const json = await openaiRes.json();
    const rawText = json.choices?.[0]?.message?.content;

    const recipe = JSON.parse(rawText);
    res.status(200).json({ recipe });
  } catch (err) {
    console.error('🧨 API error:', err);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
}
