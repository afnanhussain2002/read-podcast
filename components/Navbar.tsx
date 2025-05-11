"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X } from "lucide-react" // for hamburger and close icons

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import AvailableMinutes from "./AvailableMinutes"
import Logo from "./Logo"
import { useNotification } from "./Notification"

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user
  const { showNotification } = useNotification()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const handleSignOut = () => {
    signOut()
    showNotification("Logged out successfully", "success")
  }

  return (
    <header className="top-0 z-50 border-b absolute w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Logo />

        {/* Hamburger Icon for Mobile */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-muted-foreground focus:outline-none"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Menu */}
        <NavigationMenu className="hidden md:flex shadow-light dark:shadow-dark">
          <NavigationMenuList>
            {user && (
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
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

        {/* Right - Avatar or Login (Desktop Only) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Avatar>
                <AvatarImage src={user.profileImage || ""} alt={user.name || "User"} />
                <AvatarFallback>
                  {user.email?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" onClick={handleSignOut}>
                Logout
              </Button>
              <AvailableMinutes />
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-dark shadow-md">
          <ul className="flex flex-col space-y-2 p-4">
            {user && (
              <li>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link href="/pricing" onClick={() => setMenuOpen(false)}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/transcriber" onClick={() => setMenuOpen(false)}>
                Transcribe Video
              </Link>
            </li>
            <li>
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>

            {/* Mobile - Avatar or Login */}
            <li className="pt-4 border-t">
              {user ? (
                <div className="flex items-center justify-between">
                  <Avatar>
                    <AvatarImage src={user.profileImage || ""} alt={user.name || "User"} />
                    <AvatarFallback>
                      {user.email?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" onClick={handleSignOut}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full">Login</Button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
