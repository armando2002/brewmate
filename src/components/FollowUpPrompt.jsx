// src/components/FollowUpPrompt.jsx
import { useState } from 'react';

export default function FollowUpPrompt({ contextRecipe }) {
  const [question, setQuestion] = useState('');
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const contextualPrompt = `Based on this recipe:\n"${contextRecipe.name}" (${contextRecipe.style}, ABV ${contextRecipe.abv})\nUser asks: "${question}"\nProvide a helpful brewing response.`;

    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiBase}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: contextualPrompt }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const answer = data.recipe?.instructions || 'Sorry, no response.';

      setQaList((prev) => [...prev, { question, answer }]);
      setQuestion('');
    } catch (err) {
      console.error('Follow-up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h4 className="text-md font-semibold mb-2 text-amber-400">Ask BrewMate a follow-up:</h4>
      <form onSubmit={handleAsk} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none"
          placeholder="e.g. How do I make this stronger?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-600 disabled:opacity-50"
        >
          Ask
        </button>
      </form>

      <div className="space-y-4">
        {qaList.map((qa, idx) => (
          <div key={idx} className="bg-neutral-900 border border-neutral-700 p-4 rounded-xl">
            <p className="text-sm text-gray-300 mb-1"><strong>Q:</strong> {qa.question}</p>
            <p className="text-sm text-gray-400"><strong>A:</strong> {qa.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
