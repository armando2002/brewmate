// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import recipes from '../data/recipes.json';
import RecipeCard from '../components/RecipeCard';
import SaveRecipeButton from '../components/SaveRecipeButton';
import GptPrompt from '../components/GptPrompt';
import SavedRecipes from '../components/SavedRecipes';

export default function Home() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (u) => {
      setUser(u || null);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
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
              onClick={() => signOut(getAuth()).then(() => navigate('/'))}
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
        {/* 🔁 Always show sample recipes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {user ? 'Popular Recipes' : 'Sample Recipes'}
          </h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <div key={recipe.name}>
                <RecipeCard recipe={recipe} />
                {user && <SaveRecipeButton recipe={recipe} />}
              </div>
            ))}
          </div>
        </section>

        {/* 💬 GPT Prompt */}
        <GptPrompt />

        {/* 💾 Only show saved recipes section if user is logged in */}
        {user && <SavedRecipes user={user} />}
      </main>
    </div>
  );
}
