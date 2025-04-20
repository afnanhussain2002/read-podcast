"use client";
import { signIn } from "next-auth/react";
import { LogIn } from 'lucide-react';

export default function GoogleSignIn() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full">
        <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
        >
          <LogIn className="text-2xl" />
          <span className="font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
