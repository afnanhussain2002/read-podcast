"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import AlertBox from "./AlertBox";


export default function GoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    description?: string;
  } | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const res = await signIn("google", { callbackUrl: "/", redirect: false });

      if (res?.error) {
        setAlert({
          type: "error",
          title: "Google Sign-In Failed",
          description: res.error,
        });
      } else {
        setAlert({
          type: "success",
          title: "Signed in with Google!",
          description: "Redirecting you now...",
        });

        // Optional delay before redirect
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (err) {
      setAlert({
        type: "error",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {alert && <AlertBox {...alert} />}

      <div className="bg-white rounded-lg shadow-lg w-full mt-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all disabled:opacity-50"
        >
          <LogIn className="text-2xl" />
          <span className="font-medium">
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </span>
        </button>
      </div>
    </div>
  );
}
