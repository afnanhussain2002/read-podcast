"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const components = [
  {
    title: "Alert Dialog",
    href: "https://ui.shadcn.com/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "https://ui.shadcn.com/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "https://ui.shadcn.com/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task.",
  },
  {
    title: "Scroll-area",
    href: "https://ui.shadcn.com/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "https://ui.shadcn.com/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "https://ui.shadcn.com/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element on hover.",
  },
]

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
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[500px] gap-3 p-2 lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none"
                        href="https://ui.shadcn.com"
                      >
                        <div className="mb-2 mt-4 text-lg font-bold">
                          shadcn/ui
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Beautifully designed components to copy & paste. Accessible. Customizable.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="https://ui.shadcn.com/docs" title="Introduction">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href="https://ui.shadcn.com/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem href="https://ui.shadcn.com/docs/primitives/typography" title="Typography">
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem key={component.title} title={component.title} href={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
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
