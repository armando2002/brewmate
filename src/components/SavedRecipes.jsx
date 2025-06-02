import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import RecipeCard from "./RecipeCard.astro";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      const user = auth.currentUser;
      if (!user) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      try {
        const colRef = collection(db, "users", user.uid, "recipes");
        const snapshot = await getDocs(colRef);
        const userRecipes = snapshot.docs.map(doc => doc.data());
        setRecipes(userRecipes);
      } catch (err) {
        console.error("Failed to load saved recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 my-8">Loading saved recipes...</div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center text-gray-400 my-8">
        No saved recipes yet. Ask BrewMate AI and click “Save This Recipe.”
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-center mb-6">Your Saved Recipes</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} {...recipe} />
        ))}
      </div>
    </section>
  );
}
