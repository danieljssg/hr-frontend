"use server";

export async function signinAction(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) {
    return {
      error: "Usuario y contraseña son requeridos",
    };
  }

  try {
    const baseUrl = process.env.BASE_URL;
    const response = await fetch(`${baseUrl}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Error al iniciar sesión",
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    return {
      error: "Error de conexión. Intenta nuevamente.",
    };
  }
}

export async function signupAction(prevState, formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");
  const lastName = formData.get("lastName");

  if (!username || !email || !password || !name || !lastName) {
    return {
      error: "Todos los campos son requeridos",
    };
  }

  try {
    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, name, lastName }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Error al registrarse",
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    return {
      error: "Error de conexión. Intenta nuevamente.",
    };
  }
}
