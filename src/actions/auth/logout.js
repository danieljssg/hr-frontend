"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  try {
    const cookiesStore = await cookies();

    cookiesStore.delete("jwt", {
      path: "/",
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3350";
    await fetch(`${baseUrl}/api/auth/signout`, { method: "GET" });
  } catch (error) {
    console.error("Error en la Server Action de logout:", error);
  }

  redirect("/auth/login");
}
