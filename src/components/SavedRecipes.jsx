// src/components/SavedRecipes.jsx
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import RecipeCard from './RecipeCard';

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) return;
      const db = getFirestore();
      const userRecipesRef = collection(db, 'users', user.uid, 'recipes');
      const snapshot = await getDocs(userRecipesRef);
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (r) =>
            r.name &&
            r.ingredients &&
            r.instructions &&
            r.name !== 'AI-Generated Brew'
        );
      setRecipes(data);
    };

    fetchRecipes();
  }, [user]);

  if (!user) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Saved Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-400">No saved recipes found.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
