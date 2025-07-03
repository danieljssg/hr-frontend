// app/auth/callback/page.js
"use client";

import { useEffect, useRef } from "react"; // Importa useRef
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

const AuthCallbackPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const hasProcessed = useRef(false); // Nuevo ref para controlar la ejecución

  useEffect(() => {
    // Solo ejecuta la lógica si aún no ha sido procesada
    if (hasProcessed.current) {
      return;
    }

    let token = null;
    let userData = null;

    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      token = hashParams.get("access_token");
      const userDataString = hashParams.get("user_data");

      if (userDataString) {
        try {
          userData = JSON.parse(decodeURIComponent(userDataString));
        } catch (e) {
          console.error(
            "Error al parsear los datos del usuario desde el hash:",
            e
          );
        }
      }
    }

    if (token && userData) {
      login(token, userData);
      console.log("Token y User Data procesados. Redirigiendo...");
      hasProcessed.current = true; // Marca como procesado
      router.push("/");
    } else {
      console.error(
        "Faltan el token o los datos del usuario después de la autenticación."
      );
      hasProcessed.current = true; // Marca como procesado
      router.push("/login?error=authentication_failed");
    }
  }, [router, login]); // NO añades hasProcessed.current a las dependencias, porque un ref no es una dependencia de estado

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        fontSize: "1.2rem",
      }}
    >
      <p>Procesando autenticación. Por favor espera...</p>
    </div>
  );
};

export default AuthCallbackPage;
