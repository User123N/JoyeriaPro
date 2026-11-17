import "./globals.css";
import "./public.css";
import "./editor.css";
import "./dashboard.css";

export const metadata = {
  title: "JoyeriaPro | Gestión comercial para joyerías",
  description: "Inventario, clientes y ventas para joyerías modernas.",
  applicationName: "JoyeriaPro"
};

export default function RootLayout({ children }) {
  return <html lang="es"><body>{children}</body></html>;
}
