// src/app/auth/signup/page.js
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { signupAction } from "@/actions/auth/signup"; // Importa la Server Action de registro

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  // Inicializa useActionState con la Server Action de registro
  const [state, formAction, pending] = useActionState(signupAction, {
    success: false,
    error: null,
    user: null,
    message: null,
  });

  // Efecto para redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Efecto para manejar el resultado de la Server Action
  useEffect(() => {
    if (state.success) {
      // Si la Server Action fue exitosa, actualiza el AuthContext con los datos del usuario.
      // La Server Action ya se encargó de guardar el token en la cookie.
      login(state.user);
      router.push("/dashboard"); // Redirige al dashboard
    }
  }, [state, login, router]);

  const handleGoogleSignup = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
    const frontendCallbackUrl = `${window.location.origin}/auth/callback`;

    // Redirige al flujo de autenticación de Google en tu backend.
    window.location.href = `${baseUrl}/api/auth/google?frontendRedirectUrl=${encodeURIComponent(
      frontendCallbackUrl
    )}`;
  };

  // No renderiza el formulario si el usuario ya está logeado
  if (user) {
    return null;
  }

  return (
    <div className="h-screen flex items-center justify-center mx-auto container">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Completa los datos para crear tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && ( // Muestra el error si existe en el estado de la acción
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {/* El formulario usa la Server Action directamente a través de `action={formAction}` */}
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Juan"
                  required
                  disabled={pending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Pérez"
                  required
                  disabled={pending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                name="username"
                placeholder="juanperez"
                required
                disabled={pending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="juan@email.com"
                required
                disabled={pending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={pending}
              />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>

          <Separator />

          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleGoogleSignup}
            disabled={pending}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Usa tu cuenta de Google
          </Button>

          <div className="text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
