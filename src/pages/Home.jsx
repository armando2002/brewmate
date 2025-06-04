// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import recipes from '../data/recipes.json';
import RecipeCard from '../components/RecipeCard';
import SaveRecipeButton from '../components/SaveRecipeButton';
import SavedRecipes from '../components/SavedRecipes';
import GptPrompt from '../components/GptPrompt';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || null); // always set state, even if null
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(getAuth()).then(() => navigate('/'));
  };

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
        <h2 className="text-2xl font-semibold mb-6">Sample Recipes</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <div key={recipe.name}>
              <RecipeCard recipe={recipe} />
              {user && <SaveRecipeButton recipe={recipe} />}
            </div>
          ))}
        </div>

        <GptPrompt />
        <SavedRecipes />
      </main>
    </div>
  );
}
