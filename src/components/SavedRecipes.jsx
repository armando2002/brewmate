import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import RecipeCard from './RecipeCard';

export default function SavedRecipes({ user }) {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDefaults, setUseDefaults] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) {
        console.log('🧪 No user logged in — fetching fallback recipes...');
        try {
          const res = await fetch('/recipes.json');
          const data = await res.json();
          setSavedRecipes(data);
        } catch (err) {
          console.error('🔥 Failed to load fallback recipes:', err);
          setSavedRecipes([]);
        } finally {
          setUseDefaults(true);
          setLoading(false);
        }
        return;
      }

      try {
        const ref = collection(db, 'users', user.uid, 'recipes');
        const snapshot = await getDocs(ref);
        if (snapshot.empty) {
          console.log('🧪 Firestore empty — fallback to public recipes');
          const res = await fetch('/recipes.json');
          const data = await res.json();
          setSavedRecipes(data);
          setUseDefaults(true);
        } else {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSavedRecipes(docs);
          setUseDefaults(false);
        }
      } catch (err) {
        console.error('🔥 Error loading Firestore:', err);
        const res = await fetch('/recipes.json');
        const data = await res.json();
        setSavedRecipes(data);
        setUseDefaults(true);
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
      const ref = collection(db, 'users', user.uid, 'recipes');
      const snapshot = await getDocs(ref);
      const updated = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSavedRecipes(updated);
    } catch (err) {
      console.error('🔥 Delete failed:', err);
    }
  };

  if (loading) {
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
