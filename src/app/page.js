"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (user) {
      fetchApiMessage();
    }
  }, [user]);

  const fetchApiMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;

      const response = await fetch(`${baseUrl}/api/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setApiMessage(data.message);
      } else {
        setApiError("Error al obtener datos de la API");
      }
    } catch (error) {
      setApiError("Error de conexión con la API");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
            <CardDescription>
              Por favor inicia sesión para acceder a la aplicación
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido, {user.name} {user.lastName}
          </h1>
          <p className="text-lg text-gray-600">
            Has iniciado sesión exitosamente
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información del Usuario</CardTitle>
              <CardDescription>Datos de tu perfil actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Nombre:</span> {user.name}{" "}
                {user.lastName}
              </div>
              <div>
                <span className="font-medium">Usuario:</span> {user.username}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de la API</CardTitle>
              <CardDescription>Conexión con el backend</CardDescription>
            </CardHeader>
            <CardContent>
              {apiMessage && (
                <Alert>
                  <AlertDescription className="text-green-700">
                    ✅ {apiMessage}
                  </AlertDescription>
                </Alert>
              )}
              {apiError && (
                <Alert variant="destructive">
                  <AlertDescription>❌ {apiError}</AlertDescription>
                </Alert>
              )}
              {!apiMessage && !apiError && (
                <div className="text-gray-500">
                  Cargando estado de la API...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
