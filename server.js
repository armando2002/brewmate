// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are BrewMate, a brewing assistant. Output JSON for name, style, srm, abv, og, fg, ingredients (array), instructions (string).',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const data = await gptRes.json();
    const message = data.choices[0].message.content;

    const recipe = JSON.parse(message);
    res.json({ recipe });
  } catch (err) {
    console.error('❌ GPT Error:', err);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

app.listen(3001, () => {
  console.log('✅ OpenAI API server running at http://localhost:3001');
});
