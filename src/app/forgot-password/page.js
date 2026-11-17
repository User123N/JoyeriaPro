import Brand from "@/components/Brand";
import ForgotForm from "./forgot-form";
import WebGLJewelScene from "@/components/WebGLJewelScene";

export const metadata = { title: "Recuperar contraseña | JoyeriaPro" };

export default function ForgotPage() {
  return (
    <>
      <header className="shell topbar"><Brand /></header>
      <main className="shell auth-wrap">
        <div className="auth-art auth-art-compact"><WebGLJewelScene className="jp-webgl-jewel--auth" /><p>Recupera el acceso a tu espacio JoyeriaPro.</p></div>
        <section className="auth-card">
          <div className="eyebrow">Recuperar acceso</div>
          <h1 style={{ fontSize: 30, margin: "12px 0" }}>¿Olvidaste tu contraseña?</h1>
          <p className="muted" style={{ lineHeight: 1.6 }}>Te enviaremos un enlace para crear una nueva.</p>
          <ForgotForm />
        </section>
      </main>
    </>
  );
}
