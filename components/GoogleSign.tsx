"use client";
import { signIn } from "next-auth/react";
import { LogIn } from 'lucide-react';

export default function GoogleSignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Sign in</h2>
        <p className="text-gray-600 text-center mb-6">Continue with Google</p>
        
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
