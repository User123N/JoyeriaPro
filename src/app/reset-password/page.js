import Brand from "@/components/Brand";
import ResetForm from "./reset-form";
import JewelScene from "@/components/JewelScene";

export const metadata = { title: "Nueva contraseña | JoyeriaPro" };

export default function ResetPage() {
  return (
    <>
      <header className="shell topbar"><Brand /></header>
      <main className="shell auth-wrap">
        <div className="auth-art auth-art-compact"><JewelScene className="jp-jewel-scene--auth" /><p>Seguridad y control para tu joyería.</p></div>
        <section className="auth-card">
          <div className="eyebrow">Nueva contraseña</div>
          <h1 style={{ fontSize: 30, margin: "12px 0" }}>Crea tu nueva contraseña.</h1>
          <ResetForm />
        </section>
      </main>
    </>
  );
}
