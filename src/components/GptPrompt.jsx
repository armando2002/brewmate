// src/components/GptPrompt.jsx
import { useState } from 'react';
import SaveRecipeButton from './SaveRecipeButton';

export default function GptPrompt() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('▶️ Form submitted:', prompt);

    if (!prompt.trim()) {
      console.warn('🚫 Prompt is empty, not sending request.');
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log('✅ API response:', data);

      if (data.recipe) {
        setResponse(data.recipe);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setResponse({
        name: 'Error',
        srm: '',
        style: '',
        abv: '',
        og: '',
        fg: '',
        ingredients: [],
        instructions: 'Failed to generate a recipe.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getIngredientList = () => {
    if (!response?.ingredients) return [];

    if (typeof response.ingredients === 'string') {
      return response.ingredients
        .split(/\r?\n/)
        .map((i) => i.trim())
        .filter(Boolean);
    }

    if (Array.isArray(response.ingredients)) {
      return response.ingredients
        .map((i) => (typeof i === 'string' ? i.trim() : ''))
        .filter(Boolean);
    }

    return [];
  };

  return (
    <section className="mt-12 mb-16 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A 2% ABV session saison"
          className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-600"
        />
        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
      </form>

      {response && (
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">{response.name}</h3>
          <p className="text-sm text-gray-400 mb-1">SRM {response.srm}</p>
          <p className="mb-2">{response.style}</p>
          <p className="mb-4 font-semibold">
            ABV: {response.abv} • OG: {response.og} • FG: {response.fg}
          </p>

          <ul className="list-disc list-inside mb-4">
            {getIngredientList().map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <p className="text-sm text-gray-300 mb-4">{response.instructions}</p>

          <SaveRecipeButton recipe={response} />
        </div>
      )}
    </section>
  );
}
