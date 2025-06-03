// src/components/FirebaseAuth.jsx
import { useEffect, useState } from 'react';
import { signIn, logout, onAuthChange, auth } from '../firebase';

export default function FirebaseAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthChange(setUser);
  }, []);

  return (
    <div className="text-center my-4">
      {user ? (
        <>
          <p className="mb-2 text-sm text-green-400">👋 Welcome, {user.displayName}</p>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={signIn}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
