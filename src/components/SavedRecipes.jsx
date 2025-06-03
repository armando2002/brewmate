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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    const fetchSavedRecipes = async () => {
      try {
        const ref = collection(db, 'users', user.uid, 'recipes');
        const snap = await getDocs(ref);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSavedRecipes(data);
      } catch (err) {
        console.error('Error loading saved recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [user]);

  const handleDelete = async (id) => {
    if (!user || !id) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'recipes', id));
      setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const shouldShowDefaults = !user || (user && savedRecipes.length === 0);
  const recipesToRender = shouldShowDefaults ? defaultRecipes.slice(0, 3) : savedRecipes;

  return (
    <section className="max-w-3xl mx-auto px-4 mb-24">
      <h2 className="text-2xl font-bold text-amber-400 mb-6">Saved Recipes</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-8">
          {recipesToRender.map((recipe) => (
            <RecipeCard
              key={recipe.id || recipe.name}
              recipe={recipe}
              onDelete={shouldShowDefaults ? null : () => handleDelete(recipe.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
