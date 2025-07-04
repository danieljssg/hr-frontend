// src/api/socketClient.js
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3350";

let socket = null;

const getAuthTokenFromCookie = () => {
  if (typeof window === "undefined") {
    return null; // No hay document.cookie en el servidor
  }
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

export const getSocket = () => {
  if (!socket) {
    const token = getAuthTokenFromCookie(); // Obtiene el token antes de conectar

    socket = io(SOCKET_URL, {
      // Opciones de Socket.io client
      // Si tu backend Socket.io espera el token en los `extraHeaders` o `query`
      // (ya que las cookies httpOnly no se envían automáticamente con WebSockets si no hay CORS preflight)
      extraHeaders: {
        Authorization: token ? `Bearer ${token}` : "", // Envía el token en un encabezado extra
      },
      // O si tu backend lo espera en la query:
      // query: { token: token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket.io connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.io disconnected:", reason);
      // Lógica para reconexión o manejo de desconexión
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error.message);
      // Manejar errores de conexión
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
