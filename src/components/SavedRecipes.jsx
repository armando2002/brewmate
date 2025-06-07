// src/components/SavedRecipes.jsx
import { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import fallbackRecipes from '../data/recipes.json';
import RecipeCard from './RecipeCard';

const SavedRecipes = forwardRef(function SavedRecipes({ user, onRecipeCountChange }, ref) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        setRecipes(fallbackRecipes);
        if (onRecipeCountChange) onRecipeCountChange(false);
      } else {
        const db = getFirestore();
        const snapshot = await getDocs(collection(db, 'users', user.uid, 'recipes'));
        const saved = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const valid = saved.filter(r => r && r.name);
        setRecipes(valid);
        if (onRecipeCountChange) onRecipeCountChange(valid.length > 0);
      }
    } catch (err) {
      console.error('🔥 Failed to load recipes:', err);
      setRecipes([]);
      if (onRecipeCountChange) onRecipeCountChange(false);
    } finally {
      setLoading(false);
    }
  }, [user, onRecipeCountChange]);

  useEffect(() => {
    loadRecipes();
  }, [user, loadRecipes]);

  useImperativeHandle(ref, () => ({
    refetch: loadRecipes
  }));

  const handleDelete = async (idToDelete) => {
    if (!user) return;

    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'users', user.uid, 'recipes', idToDelete));

      const updated = recipes.filter(r => r.id !== idToDelete);
      setRecipes(updated);
      if (onRecipeCountChange) onRecipeCountChange(updated.length > 0);

      toast.success('🗑️ Recipe deleted!');
    } catch (err) {
      console.error('❌ Failed to delete recipe:', err);
      toast.error('Failed to delete recipe');
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
});

export default SavedRecipes;
