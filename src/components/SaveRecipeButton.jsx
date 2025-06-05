// src/components/SaveRecipeButton.jsx
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SaveRecipeButton({ recipe }) {
  const handleSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert('You must be signed in to save recipes.');

    try {
      const db = getFirestore();
      const userRecipesRef = collection(db, 'users', user.uid, 'recipes');
      await addDoc(userRecipesRef, {
        ...recipe,
        createdAt: serverTimestamp(),
      });

      alert('✅ Recipe saved!');
      window.location.reload(); // Temporary full refresh – replace later with UI update
    } catch (err) {
      console.error('Error saving recipe:', err);
      alert('❌ Failed to save recipe.');
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
