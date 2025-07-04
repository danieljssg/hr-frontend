// src/actions/auth/login.js
"use server"; // Indica que este archivo contiene código de servidor

import { cookies } from "next/headers"; // Para interactuar con las cookies del navegador

export async function loginAction(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const cookiesStore = await cookies();

  // Validación básica de entrada
  if (!username || !password) {
    return { success: false, error: "Usuario y contraseña son requeridos." };
  }

  try {
    // URL base de tu backend (asegúrate de que NEXT_PUBLIC_BASE_URL esté configurada para el cliente)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3350";

    // Realiza la petición POST a tu API de inicio de sesión en el backend.
    // No se usa 'credentials: include' aquí porque no esperamos cookies httpOnly del backend.
    const response = await fetch(`${baseUrl}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json(); // Parsea la respuesta JSON del backend

    if (!response.ok) {
      // Si la respuesta no es exitosa (ej. 401, 400), devuelve el mensaje de error del backend.
      return {
        success: false,
        error: data.message || "Error al iniciar sesión.",
      };
    }

    // Si el login fue exitoso, el backend debe haber devuelto el 'token' y 'user' en el cuerpo de la respuesta.
    if (data.token && data.user) {
      // Almacena el token JWT en una cookie accesible por JavaScript.
      // 'httpOnly: false' es crucial para que el frontend pueda leer esta cookie.
      cookiesStore.set("jwt", data.token, {
        httpOnly: false, // Permite que JavaScript del cliente acceda a esta cookie
        secure: process.env.NODE_ENV === "production", // Solo true en producción (HTTPS)
        maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie válida por 7 días (en milisegundos)
        path: "/", // La cookie será accesible en todas las rutas del dominio
        sameSite: "Lax", // 'Lax' es un buen equilibrio para cookies accesibles por JS
      });

      // Devuelve el estado de éxito y los datos del usuario para que el componente cliente los procese.
      return { success: true, user: data.user, message: data.message };
    } else {
      // Si la respuesta del backend no contiene el token o los datos del usuario esperados.
      return { success: false, error: "Respuesta del servidor incompleta." };
    }
  } catch (err) {
    // Captura y maneja errores de red o del servidor.
    console.error("Error en la Server Action de login:", err);
    return { success: false, error: "Error de conexión. Intenta nuevamente." };
  }
}
