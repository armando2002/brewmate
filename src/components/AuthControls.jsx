// src/components/AuthControls.jsx
import { useEffect, useState } from 'react';
import { auth, signIn, logout, onAuthChange } from '../firebase';

export default function AuthControls() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthChange(setUser);
  }, []);

  return (
    <div className="text-center mt-6">
      {user ? (
        <>
          <p className="mb-2 text-sm">Signed in as <strong>{user.displayName}</strong></p>
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
