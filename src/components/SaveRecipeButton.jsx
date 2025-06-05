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
      window.location.reload(); // ✅ Force full page refresh
    } catch (err) {
      console.error('Error saving recipe:', err);
      alert('❌ Failed to save recipe.');
    }
  };

  return (
    <button
      onClick={handleSave}
      className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
    >
      Save Recipe
    </button>
  );
}
