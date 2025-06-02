import { useEffect, useState } from "react";
import { auth, signIn, logout, onAuthChange } from "../firebase";

export default function BrewMateAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (user) {
    return (
      <div className="text-white p-2 flex items-center gap-2">
        <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full" />
        <span>{user.displayName}</span>
        <button
          className="bg-red-600 px-3 py-1 rounded text-sm"
          onClick={logout}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-green-600 px-4 py-2 text-white rounded"
      onClick={signIn}
    >
      Sign in with Google
    </button>
  );
}
