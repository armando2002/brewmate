// src/App.jsx
import './App.css';
import AuthControls from './components/AuthControls';
import { useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Trigger redeploy test

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/home');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="py-6 text-center shadow-lg bg-neutral-950">
        <h1 className="text-4xl font-bold">BrewMate Recipes</h1>
      </header>

      <AuthControls />

      <p className="text-center mt-12 text-gray-400">
        Sign in to continue to BrewMate
      </p>
    </div>
  );
}

export default App;
