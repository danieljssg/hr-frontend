// src/api/restClient.js

/**
 * Función para obtener el token JWT de la cookie accesible por JavaScript.
 * @returns {string | null} El token JWT o null si no se encuentra.
 */
const getAuthToken = () => {
  if (typeof window === "undefined") {
    // En el servidor, no hay document.cookie.
    // Si necesitas tokens en el servidor, tendrías que leerlos de los headers de la request.
    return null;
  }
  // Busca la cookie 'jwt' en document.cookie
  const name = "jwt=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

/**
 * Función wrapper para hacer peticiones fetch a tu API.
 * Adjunta el token de autorización si está disponible.
 * @param {string} url - La URL de la petición.
 * @param {object} options - Opciones para la petición fetch.
 * @returns {Promise<any>} La respuesta JSON de la API.
 */
export const apiFetch = async (url, options = {}) => {
  const token = getAuthToken(); // Obtiene el token de la cookie
  const headers = {
    "Content-Type": "application/json",
    ...options.headers, // Permite sobrescribir o añadir headers personalizados
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Adjunta el token en el encabezado Authorization
  }

  const response = await fetch(url, {
    ...options,
    headers,
    // No se necesita 'credentials: include' aquí, ya que el token va en el encabezado Authorization,
    // y no esperamos cookies httpOnly del backend para la autenticación principal.
  });

  if (!response.ok) {
    // Manejo de errores de respuesta HTTP
    if (response.status === 401 || response.status === 403) {
      console.error(
        "Autenticación fallida o no autorizada. Redirigiendo a login."
      );
      // Aquí podrías desencadenar un logout global o una redirección a la página de login
      // Para evitar un bucle de importación, puedes usar window.location.href
      // o un evento global si tu AuthContext lo escucha.
      if (typeof window !== "undefined") {
        // Borrar la cookie del token si la petición falla por autenticación
        document.cookie =
          "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("user"); // Borrar datos de usuario también
        window.location.href = "/auth/login"; // Redirigir
      }
    }
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API error: ${response.statusText}`);
  }

  return response.json();
};
