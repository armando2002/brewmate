// src/components/SaveRecipeButton.jsx
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function SaveRecipeButton({ recipe, onSave }) {
  const handleSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      toast.error('⚠️ You must be signed in to save recipes.');
      return;
    }

    try {
      const db = getFirestore();
      const userRecipesRef = collection(db, 'users', user.uid, 'recipes');
      await addDoc(userRecipesRef, {
        ...recipe,
        createdAt: serverTimestamp(),
      });

      toast.success('✅ Recipe saved!');
      
      if (onSave) {
        onSave(); // Trigger SavedRecipes refetch
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
      toast.error('❌ Failed to save recipe.');
    }
  };

  return (
    <button
      onClick={handleSave}
      className="mt-6 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
    >
      Save Recipe
    </button>
  );
}
