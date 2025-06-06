// src/components/SuggestFromSaved.jsx
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function SuggestFromSaved({ onSuggest }) {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchSaved();
  }, []);

  const handleSuggest = () => {
    if (saved.length && onSuggest) {
      onSuggest(saved);
    }
  };

  if (loading || saved.length === 0) return null;

  return (
    <div className="text-center mb-6">
      <button
        onClick={handleSuggest}
        className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        🔁 Suggest Based on My Recipes
      </button>
    </div>
  );
}
