"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DotLoader } from "@/components/shared/DotLoader";

const AuthCallbackPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    let userData = null;

    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
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

    if (userData) {
      login(userData);
      console.log("User Data procesados. Redirigiendo...");
      hasProcessed.current = true;
      router.push("/dashboard");
    } else {
      console.error(
        "Faltan los datos del usuario después de la autenticación."
      );
      hasProcessed.current = true;
      router.push("/auth/login?error=authentication_failed");
    }
  }, [router, login]);

  return <DotLoader />;
};

export default AuthCallbackPage;
