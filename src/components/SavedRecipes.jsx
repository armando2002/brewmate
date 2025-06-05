// src/components/SavedRecipes.jsx
import { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
import fallbackRecipes from '../data/recipes.json';

export default function SavedRecipes({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        if (!user) {
          setRecipes(fallbackRecipes);
        } else {
          const saved = JSON.parse(localStorage.getItem('savedRecipes')) || [];
          const valid = saved.filter((r) => r && r.name); // filter out blanks
          setRecipes(valid);
        }
      } catch (err) {
        console.error('🔥 Failed to load recipes:', err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, [user]);

  const handleDelete = (idToDelete) => {
    const updated = recipes.filter((r) => r.id !== idToDelete);
    setRecipes(updated);
    if (user) {
      localStorage.setItem('savedRecipes', JSON.stringify(updated));
    }
  };

  if (loading) return null;

  const isEmpty = recipes.length === 0;

  return (
    <section className="mt-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center text-white tracking-tight">
        {user ? 'Your Recipes' : 'Popular Recipes'}
      </h2>

      {user && isEmpty ? (
        <p className="text-center text-gray-400">
          You don’t have any saved recipes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id || `default-${index}`}
              recipe={recipe}
              showDelete={!!user && !!recipe.id}
              onDelete={recipe.id ? () => handleDelete(recipe.id) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
