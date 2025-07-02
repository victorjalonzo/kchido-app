"use client"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Bell, Search, Menu, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/shared/lib/utils"
import { useAuth } from "@/features/auth/auth-provider"
import { Asset } from "../lib/asset"
import { sidebarItems } from "../sidebar-items"

// Define sidebar items here to use in mobile menu


export default function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  console.log('user image', user?.image)

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between bg-card">
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="p-6">
              <h1 className="text-2xl font-bold">Raffle CRM</h1>
            </div>

            <div className="flex-1 px-4 space-y-1">
              {sidebarItems.map((item) => {
                if (item.require) {
                  if (!user?.permissions[item.require]) return
                }

                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={logout}
                className="flex w-full items-center px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold md:hidden">Raffle CRM</h1>
      </div>

      <div className="hidden md:flex max-w-sm w-full relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="w-full pl-8" />
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>No hay notificaciones pendientes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage src={user?.image ?? Asset.defaultProfileImage} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
