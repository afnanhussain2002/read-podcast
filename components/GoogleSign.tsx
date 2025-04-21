"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { LogIn, Loader2 } from "lucide-react";


export default function GoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/" });
    // No need to set isLoading back to false because it redirects
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span className="font-medium">Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="text-2xl" />
              <span className="font-medium">Sign in with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
