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
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiBase}/api/generate`, {
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
      console.error('Fetch error:', err);
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
      return response.ingredients.map((i) => (typeof i === 'string' ? i.trim() : '')).filter(Boolean);
    }
    return [];
  };

  return (
    <section className="mt-20 mb-24 max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-2">🍺 Brew with AI</h2>
      <p className="text-center text-sm text-gray-400 mb-8">
        Describe your beer idea below and BrewMate will craft a custom recipe for you.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 items-stretch mb-10"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. 2% ABV crisp lager with citrus"
          className="flex-1 px-5 py-3 rounded-xl bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </form>

      {response && (
        <div
          className="bg-neutral-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-neutral-700 animate-fade-in"
        >
          <h3 className="text-2xl font-bold text-amber-400 mb-1">{response.name}</h3>
          <p className="text-xs text-gray-400 mb-1">SRM {response.srm}</p>
          <p className="text-sm text-gray-300 mb-2">{response.style}</p>
          <p className="text-sm text-gray-300 mb-4">
            <strong>ABV:</strong> {response.abv} &nbsp;•&nbsp;
            <strong>OG:</strong> {response.og} &nbsp;•&nbsp;
            <strong>FG:</strong> {response.fg}
          </p>

          <ul className="list-disc list-inside space-y-1 text-sm mb-6">
            {getIngredientList().map((item, idx) => (
              <li key={idx} className="text-gray-200">{item}</li>
            ))}
          </ul>

          <p className="text-sm text-gray-300 whitespace-pre-line mb-6">
            {response.instructions}
          </p>

          <SaveRecipeButton recipe={response} />
        </div>
      )}
    </section>
  );
}
