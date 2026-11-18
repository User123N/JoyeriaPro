"use client";
import { useEffect, useState } from "react";

export default function WhatsAppButton({ phone = "", name = "la joyería" }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 900); return () => clearTimeout(t); }, []);
  const d = String(phone).replace(/\D/g, "");
  const n = d.length === 10 ? "57" + d : d;
  if (!n) return null;
  const href = `https://wa.me/${n}?text=${encodeURIComponent("Hola, quisiera información sobre las piezas de " + name + ".")}`;
  return (
    <a className={"wa-fab" + (show ? " is-on" : "")} href={href} target="_blank" rel="noreferrer" aria-label={"Escribir por WhatsApp a " + name}>
      <span className="wa-fab__ring" aria-hidden="true" />
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.8 2 6.8L3 29l6.600-1.900c1.900 1 4 1.600 6.200 1.600 7.200 0 13-5.700 13-12.800S23.200 3 16 3Zm0 23.300c-2 0-3.900-.6-5.500-1.500l-.4-.2-3.900 1.100 1.100-3.800-.3-.4A10.200 10.200 0 0 1 5.700 15.800C5.700 10.200 10.300 5.700 16 5.700s10.300 4.500 10.300 10.100S21.700 26.300 16 26.300Zm5.600-7.600c-.3-.2-1.800-.9-2.100-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.300 8.300 0 0 1-4.100-3.600c-.3-.5.300-.5.900-1.600.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400s-1 1-1 2.400 1 2.800 1.200 3 2 3.100 4.900 4.300c1.800.8 2.500.8 3.400.7.500-.1 1.800-.7 2-1.400s.3-1.300.2-1.400-.3-.2-.6-.3Z" /></svg>
      <span className="wa-fab__label">WhatsApp</span>
    </a>
  );
}
