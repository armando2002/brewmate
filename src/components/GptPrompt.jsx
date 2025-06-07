// src/components/GptPrompt.jsx
import { useState, forwardRef, useImperativeHandle } from 'react';
import SaveRecipeButton from './SaveRecipeButton';
import FollowUpPrompt from './FollowUpPrompt';

const GptPrompt = forwardRef(({ onSave }, ref) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const buildPrompt = (basePrompt) => {
    return `${basePrompt.trim()}

Return the recipe in structured format with the following fields:
- name
- srm
- style
- abv
- og
- fg
- ibu (estimated IBU as a number or short text)
- ingredients (bulleted list or array of { name, quantity })
- instructions (numbered list with steps)`;
  };

  const submitPrompt = async (customPrompt) => {
    if (typeof customPrompt !== 'string' || !customPrompt.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiBase}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPrompt(customPrompt) }),
      });

      if (!res.ok) throw new Error(`API Error ${res.status}`);
      const data = await res.json();
      if (data.recipe) {
        setResponse(data.recipe);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Suggest fetch error:', err);
      setResponse({
        name: 'Error',
        srm: '',
        style: '',
        abv: '',
        og: '',
        fg: '',
        ingredients: [],
        instructions:
          '⚠️ Failed to generate a recipe. Please check your internet connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitPrompt(prompt);
  };

  useImperativeHandle(ref, () => ({
    submitPrompt,
  }));

  const getIngredientList = () => {
    const ing = response?.ingredients;

    if (Array.isArray(ing) && ing.every(i => typeof i === 'object' && i.name)) {
      return ing.map(i =>
        `${i.quantity ? `${i.quantity} ` : ''}${i.name}`.trim()
      );
    }

    if (Array.isArray(ing)) {
      return ing.map(i =>
        typeof i === 'string' ? i.trim() : ''
      ).filter(Boolean);
    }

    if (typeof ing === 'string') {
      return ing
        .split(/\r?\n/)
        .map(i => i.trim())
        .filter(Boolean);
    }

    if (typeof response?.instructions === 'string') {
      const matchBlock = response.instructions.match(
        /ingredients\s*[:\-]?\s*((?:.*\n?)+?)\n\s*(instructions|mash|boil|ferment|cool|add|transfer)/i
      );
      if (matchBlock) {
        return matchBlock[1]
          .split(/\r?\n|•|-|\*/i)
          .map((line) => line.trim())
          .filter((line) => line.length > 4);
      }
    }

    return [];
  };

  const extractMashTemp = (text) => {
    if (typeof text !== 'string') return null;
    const match = text.match(/mash (?:at|to) (\d{2,3})[°º]?[FfCc]/i);
    return match ? `${match[1]}°F` : null;
  };

  const getInstructionSteps = (text) => {
    if (!text) return [];
    if (Array.isArray(text)) return text;

    const rawSteps = text.includes('\n')
      ? text.split(/\r?\n/)
      : text.split(/(?<=\.)\s+(?=\S)/);

    return rawSteps
      .map((line) =>
        line
          .replace(/^(\d+[\.\)]\s*)+/, '') // 🔧 removes leading 1. or 2) or 3.3.
          .trim()
      )
      .filter(Boolean);
  };

  return (
    <section className="mt-8 mb-6 max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center">
        Brew with <span className="text-yellow-500">BrewMate AI</span>
      </h2>
      <p className="text-center text-gray-400 mt-2 max-w-2xl mx-auto">
        Describe your beer idea below and BrewMate will craft a custom recipe for you. This may take up to 15 seconds as our AI brewmaster thinks through your ingredients.
      </p>
      <p className="text-center text-gray-400 mt-2 max-w-2xl mx-auto">
        Once you've saved a recipe or two, a new option will appear: <strong className="text-white">“Suggest Based on My Recipes.”</strong> Sign in to start saving and let BrewMate recommend your next brew!
      </p>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 items-stretch mb-6"
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
          className={`p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in ${
            response.name === 'Error'
              ? 'bg-red-900 border border-red-500'
              : 'bg-neutral-900 border border-neutral-700'
          }`}
        >
          <h3 className={`text-2xl font-bold mb-1 ${
            response.name === 'Error' ? 'text-red-300' : 'text-amber-400'
          }`}>{response.name}</h3>
          <p className="text-xs text-gray-400 mb-1">SRM {response.srm}</p>
          <p className="text-sm text-gray-300 mb-2">{response.style}</p>
          <p className="text-sm text-gray-300 mb-2">
            <strong>ABV:</strong> {response.abv} &nbsp;•&nbsp;
            <strong>OG:</strong> {response.og} &nbsp;•&nbsp;
            <strong>FG:</strong> {response.fg}
          </p>
          {response.ibu && (
            <p className="text-sm text-gray-300 mb-4">
              <strong>IBU:</strong> {response.ibu}
            </p>
          )}

          {getIngredientList().length > 0 && (
            <>
              <h4 className="text-md font-semibold text-white mb-1">Ingredients</h4>
              <ul className="list-disc list-inside space-y-1 text-sm mb-6 text-gray-200">
                {getIngredientList().map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {response.instructions && extractMashTemp(response.instructions) && (
            <p className="text-sm text-gray-400 mb-4">
              <strong>Mash Temperature:</strong> {extractMashTemp(response.instructions)}
            </p>
          )}

          {response.instructions ? (
            <>
              <h4 className="text-md font-semibold text-white mb-1">Instructions</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm mb-6 text-gray-300">
                {getInstructionSteps(response.instructions).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </>
          ) : (
            <p className="text-sm text-gray-300 whitespace-pre-line mb-6">
              {response.instructions}
            </p>
          )}

          {response.name !== 'Error' && (
            <>
              <SaveRecipeButton recipe={response} onSave={onSave} />
              <FollowUpPrompt contextRecipe={response} />
            </>
          )}
        </div>
      )}
    </section>
  );
});

export default GptPrompt;
