// app/auth/callback/page.js
"use client"; // Indica que este es un Client Component

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DotLoader } from "@/components/shared/DotLoader"; // Asumo que tienes este componente de carga

const AuthCallbackPage = () => {
  const router = useRouter();
  const { login } = useAuth(); // La función login de tu AuthContext
  const hasProcessed = useRef(false); // Para asegurar que el useEffect se ejecute solo una vez

  useEffect(() => {
    // Si la lógica ya ha sido procesada, sal del efecto para evitar re-ejecuciones.
    if (hasProcessed.current) {
      return;
    }

    let token = null;
    let userData = null;

    // Verifica si estamos en el navegador y si hay un hash en la URL
    if (typeof window !== "undefined" && window.location.hash) {
      // Crea un objeto URLSearchParams a partir del hash (eliminando el '#')
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      // Intenta obtener el token y los datos del usuario del hash
      token = hashParams.get("access_token"); // El token JWT enviado por tu backend en el hash
      const userDataString = hashParams.get("user_data"); // Los datos del usuario en formato string

      if (userDataString) {
        try {
          // Parsea los datos del usuario de JSON a un objeto JavaScript
          userData = JSON.parse(decodeURIComponent(userDataString));
        } catch (e) {
          console.error(
            "Error al parsear los datos del usuario desde el hash:",
            e
          );
        }
      }
    }

    // Si se encontraron tanto el token como los datos del usuario
    if (token && userData) {
      // Almacena el token JWT en una cookie accesible por JavaScript.
      // Esta cookie será leída por tus clientes REST, GraphQL y Socket.io
      // para adjuntar el token en el encabezado Authorization.
      document.cookie = `jwt=${token}; Max-Age=${
        1000 * 60 * 60 * 24 * 7
      }; Path=/; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      }`;

      // Llama a la función login de tu AuthContext para actualizar el estado global del usuario
      // y almacenar los datos visibles del usuario en localStorage.
      login(userData);

      console.log(
        "Token y User Data de Google procesados. Redirigiendo a /dashboard..."
      );
      hasProcessed.current = true; // Marca la lógica como procesada
      router.push("/dashboard"); // Redirige al usuario a la página principal o dashboard
    } else {
      // Si falta el token o los datos del usuario, algo salió mal en la autenticación.
      console.error(
        "Faltan el token o los datos del usuario después de la autenticación de Google."
      );
      hasProcessed.current = true; // Marca la lógica como procesada
      router.push("/auth/login?error=authentication_failed"); // Redirige al login con un mensaje de error
    }
  }, [router, login]); // Dependencias del useEffect: router y login (funciones estables)

  return <DotLoader />;
};

export default AuthCallbackPage;
