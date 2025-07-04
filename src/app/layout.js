import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Navbar from "@/components/shared/Navbar";
import { ApolloWrapper } from "@/providers/ApolloWrapper";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistema de Autenticación",
  description: "Sistema completo de login y registro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`min-h-screen bg-background text-foreground ${inter.className}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ApolloWrapper>
              <Navbar />
              <main>{children}</main>
            </ApolloWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
