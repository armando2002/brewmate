// src/components/SuggestFromSaved.jsx
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const SuggestFromSaved = forwardRef(function SuggestFromSaved({ onSuggestFromSaved }, ref) {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);

  const fetchSaved = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'recipes'));
      const recipes = snapshot.docs.map(doc => doc.data());
      setSaved(recipes);
    } catch (err) {
      console.error('🔥 Failed to fetch saved recipes:', err);
      setSaved([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  useImperativeHandle(ref, () => ({
    refetch: fetchSaved,
  }));

  const handleSuggest = async () => {
    if (!saved.length || !onSuggestFromSaved || suggesting) return;
    setSuggesting(true);

    try {
      const prompt = `Based on these saved recipes:\n${saved
        .map((r) => `• ${r.name} (${r.style}, ABV ${r.abv})`)
        .join('\n')}\nSuggest a new homebrew recipe that matches the user’s tastes.`;

      await onSuggestFromSaved(prompt);
    } catch (err) {
      console.error('🚨 Suggestion failed:', err);
    } finally {
      setSuggesting(false);
    }
  };

  if (loading || saved.length === 0) return null;

  return (
    <div className="text-center mb-6">
      <button
        onClick={handleSuggest}
        disabled={suggesting}
        className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
      >
        {suggesting ? 'Suggesting…' : '🔁 Suggest Based on My Recipes'}
      </button>
    </div>
  );
});

export default SuggestFromSaved;
