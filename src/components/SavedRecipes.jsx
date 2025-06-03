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
        const ref = collection
