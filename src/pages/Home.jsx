// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SavedRecipes from '../components/SavedRecipes';
import GptPrompt from '../components/GptPrompt';

export default function Home() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(getAuth()).then(() => navigate('/'));
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="py-6 text-center shadow-lg bg-neutral-950">
        <h1 className="text-4xl font-bold">BrewMate Recipes</h1>
        {user ? (
          <>
            <p className="mt-2 text-lg">👋 Welcome, {user.displayName}</p>
            <button
              onClick={handleSignOut}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Sign Out
            </button>
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-400">
            Sign in to save and manage your custom recipes
          </p>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* GPT + Saved or fallback recipes */}
        <GptPrompt />
        <SavedRecipes />
      </main>
    </div>
  );
}
