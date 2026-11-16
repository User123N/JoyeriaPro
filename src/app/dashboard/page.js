import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Brand from "@/components/Brand";
import SignOutButton from "./sign-out-button";
import Manage from "./manage";
export const metadata = { title: "Panel | JoyeriaPro" };
export default async function DashboardPage() {
  const sb = await createClient(); const { data: { user } } = await sb.auth.getUser(); if (!user) redirect("/login");
  const { data: memberships, error } = await sb.from("business_members").select("role,business:businesses(id,name,slug,status,timezone,description,logo_url,phone,address,city)").eq("user_id", user.id).eq("active", true);
  const membership = (memberships || []).find((m) => m.business);
  return <><header className="shell topbar"><Brand /><div className="top-actions"><span className="muted user-email">{user.email}</span><SignOutButton /></div></header><main className="shell dashboard-shell">{error ? <div className="error-box">No fue posible cargar el espacio: {error.message}</div> : membership ? <Manage business={membership.business} role={membership.role} /> : <div className="empty-state"><div className="eyebrow">Configuración inicial</div><h1>Tu espacio está listo.</h1><p>Vincula tu usuario a una joyería desde la migración de configuración.</p></div>}</main></>;
}
