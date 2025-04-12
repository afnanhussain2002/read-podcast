"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user

  console.log(user, "user");

  return (
    <header className=" top-0 z-50 border-b absolute w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left - NavigationMenu */}
        <NavigationMenu>
          <NavigationMenuList>
          <NavigationMenuItem>
              <Link href="#pricing" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/transcriber" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Transcribe Video
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right - Avatar or Login */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Avatar>
                <AvatarImage src={user.profileImage || ""} alt={user.name || "User"} />
                <AvatarFallback>
                  {user.email?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "hover:bg-accent block select-none space-y-1 rounded-md border-2 border-transparent p-3 leading-none no-underline outline-none transition-colors hover:border-border",
            className
          )}
          {...props}
        >
          <div className="text-base font-bold leading-none">{title}</div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
ListItem.displayName = "ListItem"
