// src/components/SavedRecipes.jsx
import { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase';
import defaultRecipes from '../data/recipes.json';

export default function SavedRecipes({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDefaults, setUseDefaults] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) {
        console.log('👤 Guest mode: loading default recipes');
        setRecipes(defaultRecipes);
        setUseDefaults(true);
        setLoading(false);
        return;
      }

      try {
        const recipesRef = collection(doc(db, 'users', user.uid), 'recipes');
        const snapshot = await getDocs(recipesRef);

        if (snapshot.empty) {
          console.log('📭 No saved recipes — using defaults');
          setRecipes(defaultRecipes);
          setUseDefaults(true);
        } else {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecipes(data);
          setUseDefaults(false);
        }
      } catch (err) {
        console.error('❌ Error loading Firestore recipes:', err);
        setRecipes(defaultRecipes);
        setUseDefaults(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
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
        {user && !useDefaults ? 'Your Saved Recipes' : 'Sample Recipes'}
      </h2>

      {recipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id || `default-${index}`}
          recipe={recipe}
          showDelete={!useDefaults && user}
        />
      ))}
    </section>
  );
}
