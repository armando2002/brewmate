// src/components/GptPrompt.jsx
import { useState } from 'react';
import SaveRecipeButton from './SaveRecipeButton';

export default function GptPrompt() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
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
      return response.ingredients.split(/\r?\n/).map((i) => i.trim()).filter(Boolean);
    }
    return Array.isArray(response.ingredients)
      ? response.ingredients.map((i) => (typeof i === 'string' ? i.trim() : '')).filter(Boolean)
      : [];
  };

  return (
    <section className="mt-20 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-neutral-900 p-6 rounded-xl shadow-xl space-y-4">
        <h2 className="text-2xl font-bold">🔮 Brew with AI</h2>
        <p className="text-sm text-gray-400">Describe your beer idea below and BrewMate will generate a custom recipe.</p>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. 2% ABV crisp lager with citrus notes"
          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-gray-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
      </form>

      {response && (
        <div className="mt-10 bg-neutral-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-1">{response.name}</h3>
          <p className="text-gray-400 text-sm mb-1">SRM {response.srm} • {response.style}</p>
          <p className="font-medium mb-4">ABV: {response.abv} • OG: {response.og} • FG: {response.fg}</p>

          <div className="mb-4">
            <h4 className="font-semibold text-lg mb-2">Ingredients</h4>
            <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
              {getIngredientList().map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-lg mb-2">Instructions</h4>
            <p className="text-sm text-gray-300">{response.instructions}</p>
          </div>

          <SaveRecipeButton recipe={response} />
        </div>
      )}
    </section>
  );
}
