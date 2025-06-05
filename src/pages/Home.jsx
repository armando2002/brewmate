// src/pages/Home.jsx
import { useEffect, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import recipes from '../data/recipes.json';
import RecipeCard from '../components/RecipeCard';
import SaveRecipeButton from '../components/SaveRecipeButton';
import GptPrompt from '../components/GptPrompt';
import SavedRecipes from '../components/SavedRecipes';

export default function Home() {
  const [user, setUser] = useState(undefined);
  const savedRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (u) => {
      setUser(u || null);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const { signIn } = await import('../firebase');
    signIn();
  };

  const handleRecipeSaved = () => {
    savedRef.current?.refetch();
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="pt-6 pb-3 text-center shadow-lg bg-neutral-950">
        <h1 className="text-4xl font-bold">BrewMate Recipes</h1>
        {user ? (
          <>
            <p className="mt-2 text-lg">👋 Welcome, {user.displayName}</p>
            <button
              onClick={() => signOut(getAuth()).then(() => navigate('/'))}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to save and manage your custom recipes
            </p>
            <button
              onClick={handleSignIn}
              className="mt-3 px-4 py-2 bg-amber-500 text-black font-semibold hover:bg-amber-600 rounded-lg"
            >
              Sign In with Google
            </button>
          </>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-4 pb-10 sm:pt-6 sm:pb-12">
        {/* 💬 GPT Prompt */}
        <div className="mb-4">
          <GptPrompt onSave={handleRecipeSaved} />
        </div>

        {/* 🔁 Always show sample recipes */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-center">
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

        {/* 💾 Saved Recipes */}
        {user && <SavedRecipes ref={savedRef} user={user} />}
      </main>
    </div>
  );
}
