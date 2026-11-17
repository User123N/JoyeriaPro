import "./globals.css";
import "./public.css";
import "./editor.css";
import "./home.css";

export const metadata = {
  title: "JoyeriaPro | Gestión comercial para joyerías",
  description: "Gestiona y presenta el catálogo de tu joyería con una experiencia digital elegante.",
  applicationName: "JoyeriaPro"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
