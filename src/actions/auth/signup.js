"use server";

import { cookies } from "next/headers";

export async function signupAction(prevState, formData) {
  const name = formData.get("name");
  const lastName = formData.get("lastName");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const cookiesStore = await cookies();

  // Validación básica de entrada
  if (!name || !lastName || !username || !email || !password) {
    return { success: false, error: "Todos los campos son requeridos." };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3350";

    // Realiza la petición POST a tu API de registro en el backend.
    const response = await fetch(`${baseUrl}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, lastName, username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la respuesta no es exitosa, devuelve el mensaje de error del backend.
      return {
        success: false,
        error: data.message || "Error al crear la cuenta.",
      };
    }

    // Si el registro fue exitoso, el backend debe haber devuelto el 'token' y 'user'.
    if (data.token && data.user) {
      // Almacena el token JWT en una cookie accesible por JavaScript.
      cookiesStore.set("jwt", data.token, {
        httpOnly: false, // Permite que JavaScript del cliente acceda a esta cookie
        secure: process.env.NODE_ENV === "production", // Solo true en producción (HTTPS)
        maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie válida por 7 días
        path: "/", // Accesible en todas las rutas
        sameSite: "Lax", // 'Lax' es un buen equilibrio
      });

      // Devuelve el estado de éxito y los datos del usuario.
      return { success: true, user: data.user, message: data.message };
    } else {
      // Si la respuesta del backend no contiene el token o los datos del usuario esperados.
      return { success: false, error: "Respuesta del servidor incompleta." };
    }
  } catch (err) {
    console.error("Error en la Server Action de registro:", err);
    return { success: false, error: "Error de conexión. Intenta nuevamente." };
  }
}
