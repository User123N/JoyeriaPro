import "./globals.css";
import "./public.css";
import "./editor.css";
import "./dashboard.css";
import "./experience.css";
import "./atelier.css";
import "./atelier-immersive.css";
import "./maison-aurelia.css";
import "./aurora.css";
import ScrollFx from "@/components/ScrollFx";

export const metadata = {
  title: "JoyeriaPro | Gestión comercial para joyerías",
  description: "Inventario, clientes y ventas para joyerías modernas.",
  applicationName: "JoyeriaPro"
};

export default function RootLayout({ children }) {
  return <html lang="es"><body>{children}<ScrollFx /></body></html>;
}
