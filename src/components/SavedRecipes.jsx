import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import RecipeCard from './RecipeCard';
import defaultRecipes from '../data/recipes.json';

export default function SavedRecipes({ user }) {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDefaults, setUseDefaults] = useState(false);

  useEffect(() => {
    // Only run once user is resolved (null or an object)
    if (user === undefined) return;

    const fetchRecipes = async () => {
      if (!user) {
        console.log('🧪 No user logged in -- using default recipes');
        setUseDefaults(true);
        setSavedRecipes(defaultRecipes);
        setLoading(false);
        return;
      }

      try {
        const ref = collection(db, 'users', user.uid, 'recipes');
        const snapshot = await getDocs(ref);

        if (snapshot.empty) {
          console.log('🧪 Firestore empty -- using default recipes');
          setUseDefaults(true);
          setSavedRecipes(defaultRecipes);
        } else {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUseDefaults(false);
          setSavedRecipes(docs);
        }
      } catch (err) {
        console.error('🔥 Error loading recipes:', err);
        setUseDefaults(true);
        setSavedRecipes(defaultRecipes);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  const handleDelete = async (recipeId) => {
    if (!user || !recipeId) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'recipes', recipeId));
      console.log(`🗑️ Deleted recipe: ${recipeId}`);

      const ref = collection(db, 'users', user.uid, 'recipes');
      const snapshot = await getDocs(ref);

      if (snapshot.empty) {
        console.log('🧪 No more saved recipes -- using default recipes');
        setUseDefaults(true);
        setSavedRecipes(defaultRecipes);
      } else {
        const updated = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUseDefaults(false);
        setSavedRecipes(updated);
      }
    } catch (err) {
      console.error('🔥 Delete failed:', err);
    }
  };

  if (user === undefined || loading) {
    return (
      <section className="max-w-3xl mx-auto px-4 text-center text-gray-400 mt-12">
        Loading saved recipes…
      </section>
    );
  }

  return (
    <section className="mt-16 max-w-3xl mx-auto px-4">
      <h2 className="text-xl font-bold mb-6 text-center">Saved Recipes</h2>

      {savedRecipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id || `default-${index}`}
          recipe={recipe}
          showDelete={user && !useDefaults}
          onDelete={() => handleDelete(recipe.id)}
        />
      ))}
    </section>
  );
}
