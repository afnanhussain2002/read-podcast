"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function UserAvatar() {
  const { data: session } = useSession();
  const user = session?.user;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
          <AvatarFallback>
            {user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <Button variant="default" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button>Login</Button>
    </Link>
  );
}
