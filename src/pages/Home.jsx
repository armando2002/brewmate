// src/pages/Home.jsx
import { useEffect, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import recipes from '../data/recipes.json';
import RecipeCard from '../components/RecipeCard';
import SaveRecipeButton from '../components/SaveRecipeButton';
import GptPrompt from '../components/GptPrompt';
import SavedRecipes from '../components/SavedRecipes';
import SuggestFromSaved from '../components/SuggestFromSaved';

export default function Home() {
  const [user, setUser] = useState(undefined);
  const [hasSavedRecipes, setHasSavedRecipes] = useState(false);
  const savedRef = useRef(null);
  const promptRef = useRef(null);
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

  const handleSuggestFromSaved = (prompt) => {
    if (promptRef.current?.submitPrompt) {
      promptRef.current.submitPrompt(prompt);
    }
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
      <header className="bg-neutral-950 shadow-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between items-center gap-4 text-center">
        <img
          src="/brewmate-logo-transparent-cleaned.png"
          alt="BrewMate Logo"
          className="h-28 sm:h-32 max-w-[220px] object-contain"
        />

        {user ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 items-center text-center">
            <p className="text-sm sm:text-base font-medium text-white whitespace-nowrap">
              👋 Welcome, {user.displayName}
            </p>
            <button
              onClick={() => signOut(getAuth()).then(() => navigate('/'))}
              className="mt-1 sm:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-gray-400">
              Sign in to save and manage your custom recipes
            </p>
            <button
              onClick={handleSignIn}
              className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              Sign In with Google
            </button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-4 pb-10 sm:pt-6 sm:pb-12">
        <div className="mb-4">
          <GptPrompt ref={promptRef} onSave={handleRecipeSaved} />
        </div>

        {user && (
          <div className="mb-8">
            <SuggestFromSaved onSuggestFromSaved={handleSuggestFromSaved} />
          </div>
        )}

        {(!user || !hasSavedRecipes) && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-center">
              {user ? 'Popular Recipes' : 'Sample Recipes'}
            </h2>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <div key={recipe.name}>
                  <RecipeCard recipe={recipe} />
                  {user && (
                    <SaveRecipeButton
                      recipe={recipe}
                      onSave={handleRecipeSaved}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {user && (
          <SavedRecipes
            ref={savedRef}
            user={user}
            onRecipeCountChange={(count) => setHasSavedRecipes(count > 0)}
          />
        )}
      </main>
    </div>
  );
}
