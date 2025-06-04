// src/components/SavedRecipes.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import RecipeCard from './RecipeCard';
import defaultRecipes from '../data/recipes.json';

export default function SavedRecipes() {
  const [user, setUser] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Watch for user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user’s saved recipes if logged in
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!user) {
        console.log('🧪 No user logged in — using default recipes');
        setSavedRecipes(defaultRecipes);
        setLoading(false);
        return;
      }

      try {
        const ref = collection(db, 'users', user.uid, 'recipes');
        const snapshot = await getDocs(ref);

        if (snapshot.empty) {
          console.log('🧪 Firestore empty — using default recipes');
          setSavedRecipes(defaultRecipes);
        } else {
          const userRecipes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSavedRecipes(userRecipes);
        }
      } catch (err) {
        console.error('🔥 Error loading recipes:', err);
        setSavedRecipes(defaultRecipes);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [user]);

  const handleDelete = async (recipeId) => {
    if (!user || !recipeId) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'recipes', recipeId));
      console.log(`🗑️ Deleted recipe: ${recipeId}`);

      // Refetch recipes after deletion
      const ref = collection(db, 'users', user.uid, 'recipes');
      const snapshot = await getDocs(ref);
      if (snapshot.empty) {
        console.log('🧪 No more saved recipes — showing defaults');
        setSavedRecipes(defaultRecipes);
      } else {
        const updated = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavedRecipes(updated);
      }
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
        <div
          key={recipe.id || index}
          className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-xl p-6 sm:p-8 mb-10 animate-fade-in"
        >
          <h3 className="text-2xl font-bold text-amber-400 mb-1">{recipe.name}</h3>
          <p className="text-xs text-gray-400 mb-1">SRM {recipe.srm}</p>
          <p className="text-sm text-gray-300 mb-2">{recipe.style}</p>
          <p className="text-sm text-gray-300 mb-4">
            <strong>ABV:</strong> {recipe.abv} &nbsp;•&nbsp;
            <strong>OG:</strong> {recipe.og} &nbsp;•&nbsp;
            <strong>FG:</strong> {recipe.fg}
          </p>

          <ul className="list-disc list-inside space-y-1 text-sm mb-6">
            {(typeof recipe.ingredients === 'string'
              ? recipe.ingredients.split(/\r?\n/).filter(Boolean)
              : recipe.ingredients || []
            ).map((item, i) => (
              <li key={i} className="text-gray-200">{item}</li>
            ))}
          </ul>

          <p className="text-sm text-gray-300 whitespace-pre-line mb-6">
            {recipe.instructions}
          </p>

          {user && recipe.id && (
            <button
              onClick={() => handleDelete(recipe.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              Delete Recipe
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
