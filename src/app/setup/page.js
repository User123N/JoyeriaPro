import Link from "next/link";
import Brand from "@/components/Brand";
export const metadata = { title: "Configuración inicial | JoyeriaPro" };
export default function SetupPage() { return <><header className="shell topbar"><Brand /></header><main className="shell auth-wrap"><section className="auth-card"><div className="eyebrow">Configuración inicial</div><h1>Vincula tu joyería</h1><p className="muted">Crea el negocio en Supabase y asigna tu usuario como propietario ejecutando <code>supabase/setup_first_owner.sql</code> con los UUID correspondientes.</p><Link className="btn primary" href="/login">Volver a iniciar sesión</Link></section></main></>; }
