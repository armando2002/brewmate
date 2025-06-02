// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDocs,
  query,
} from "firebase/firestore";

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();
export const signIn = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

// ✅ Save a user recipe under /users/{uid}/recipes/
export async function saveUserRecipe(user, recipe) {
  const userRef = doc(db, "users", user.uid);
  const recipeRef = doc(collection(userRef, "recipes")); // auto-generated doc ID
  await setDoc(recipeRef, {
    ...recipe,
    savedAt: new Date().toISOString(),
  });
}

// ✅ (Optional) Fetch all saved recipes for a user
export async function getUserRecipes(uid) {
  const recipesRef = collection(doc(db, "users", uid), "recipes");
  const q = query(recipesRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}