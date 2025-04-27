"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";


export default function GoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/"});

      //  toast.success("Signed in successfully!");
 
    } catch (err) {
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">

      <div className=" rounded-lg w-full mt-4">
        <Button
        variant={"default"}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full dark:bg-darkBg"
        >
          <FaGoogle className="text-2xl" />
          <span className="font-medium">
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </span>
        </Button>
      </div>
    </div>
  );
}
