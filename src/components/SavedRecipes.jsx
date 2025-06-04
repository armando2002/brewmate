// src/components/SavedRecipes.jsx
import { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';

export default function SavedRecipes({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);

      try {
        if (!user) {
          console.log('🧪 No user — loading fallback from /recipes.json');
          const res = await fetch('/recipes.json');
          const data = await res.json();
          setRecipes(data);
        } else {
          console.log('🔐 User logged in — skipping fallback');
          setRecipes([]); // or fetch Firestore recipes here if needed
        }
      } catch (err) {
        console.error('🔥 Failed to load fallback recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [user]);

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-4 text-center text-gray-400 mt-12">
        Loading recipes…
      </section>
    );
  }

  if (!recipes.length) {
    return null;
  }

  return (
    <section className="mt-16 max-w-3xl mx-auto px-4">
      <h2 className="text-xl font-bold mb-6 text-center">
        {user ? 'Your Recipes' : 'Sample Recipes'}
      </h2>

      {recipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id || `default-${index}`}
          recipe={recipe}
          showDelete={false}
        />
      ))}
    </section>
  );
}
