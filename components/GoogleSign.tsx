"use client";
import { signIn } from "next-auth/react";
import { LogIn } from 'lucide-react';

export default function GoogleSignIn() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-center">Sign in</h2>
        <p className="text-gray-600 text-center mb-3">Continue with Google</p>
        
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
        >
          <LogIn className="text-2xl" />
          <span className="font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
