// src/components/AuthControls.jsx
import { useEffect, useState } from 'react';
import { auth, signIn, logout, onAuthChange } from '../firebase';

export default function AuthControls() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthChange(setUser);
  }, []);

  return (
    <div className="text-center mt-8">
      {user ? (
        <>
          <p className="mb-3 text-sm text-gray-300">
            Signed in as <strong>{user.displayName}</strong>
          </p>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={signIn}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
