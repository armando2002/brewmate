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
          const res = await fetch('/recipes.json');
          const data = await res.json();
          setRecipes(data);
        } else {
          setRecipes([]); // 🔁 Replace with Firestore recipe loading logic soon
        }
      } catch (err) {
        console.error('🔥 Failed to load fallback recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, [user]);

  if (loading || !recipes.length) return null;

  return (
    <section className="mt-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center text-white tracking-tight">
        {user ? 'Your Recipes' : 'Popular Recipes'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id || `default-${index}`}
            recipe={recipe}
            showDelete={false} // you can toggle this for logged-in users later
          />
        ))}
      </div>
    </section>
  );
}
