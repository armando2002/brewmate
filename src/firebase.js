// src/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDocs,
  query
} from 'firebase/firestore';

// ✅ Dual prefix support: LOCAL = PUBLIC_, VERCEL = VITE_
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

// ✅ Prevent duplicate initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signIn = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

// ✅ Firestore helpers
export async function saveUserRecipe(user, recipe) {
  const userRef = doc(db, 'users', user.uid);
  const recipeRef = doc(collection(userRef, 'recipes'));
  await setDoc(recipeRef, {
    ...recipe,
    savedAt: new Date().toISOString(),
  });
}

export async function getUserRecipes(uid) {
  const recipesRef = collection(doc(db, 'users', uid), 'recipes');
  const q = query(recipesRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
