// api/generate.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const prompt = typeof req.body === 'string' ? req.body : req.body.prompt;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OpenAI API key' });
    }

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid prompt' });
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

    console.log('🧪 Raw OpenAI output:', rawText);

    let recipe;
    try {
      recipe = JSON.parse(rawText);
    } catch (parseError) {
      console.error('❌ Failed to parse recipe JSON:', parseError);
      return res.status(500).json({ error: 'Invalid recipe format from AI' });
    }

    res.status(200).json({ recipe });
  } catch (err) {
    console.error('🧨 API error:', err);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
}
