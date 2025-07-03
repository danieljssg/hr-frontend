"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Home } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  const getAvatarUrl = (profilePicture, name, lastName) => {
    if (profilePicture) return profilePicture;
    const seed = `${name}-${lastName}`.toLowerCase().replace(/\s+/g, "-");
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <nav className="border-b bg-background shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              frontend-title
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/" className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            getAvatarUrl(
                              user.profilePicture,
                              user.name,
                              user.lastName
                            ) || "/placeholder.svg"
                          }
                          alt={`${user.name} ${user.lastName}`}
                        />
                        <AvatarFallback>
                          {user.name?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
