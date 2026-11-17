import Image from "next/image";
import Link from "next/link";
import Brand from "@/components/Brand";

const pillars = [
  { number: "01", title: "Catálogo Exclusivo", text: "Gestiona referencias, quilates, materiales, categorías y fotografías de alta resolución en una vista impecable." },
  { number: "02", title: "Personalización de Tienda", text: "Adapta la identidad visual, logotipos, colores y textos de tu tienda con un editor en tiempo real." },
  { number: "03", title: "Presentación Comercial", text: "Ofrece a tus clientes una experiencia de catálogo digital elegante, fluida y optimizada para conversión." }
];

const shots = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1100&q=85",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1100&q=85"
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#c5a059]/30 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <Brand />
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-[#c5a059] transition">Plataforma</a>
          <a href="#experiencia" className="hover:text-[#c5a059] transition">Experiencia</a>
          <a href="#catalogo" className="hover:text-[#c5a059] transition">Catálogo</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-[#c5a059] transition">Acceso</Link>
          <Link href="/login" className="btn-gold text-xs tracking-wider uppercase">Empezar</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c5a059]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-xs tracking-widest text-[#c5a059] uppercase border border-[#c5a059]/20">
          <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse"></span>
          Plataforma SaaS para Joyerías de Lujo
        </div>

        <h1 className="text-5xl md:text-7xl font-light tracking-tight max-w-4xl mb-6 leading-tight">
          El arte de exhibir <br />
          <span className="font-serif italic text-[#c5a059]">lo extraordinario.</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mb-10 font-light">
          JoyeriaPro transforma la gestión comercial y la presentación digital de tu joyería con una estética sofisticada y rendimiento impecable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/login" className="btn-gold text-sm tracking-wider uppercase px-8 py-4 shadow-lg shadow-[#c5a059]/20">
            Explorar Plataforma ↗
          </Link>
          <a href="#features" className="glass px-8 py-4 rounded-full text-sm font-medium hover:bg-white/10 transition border border-white/10">
            Conocer Características ↓
          </a>
        </div>

        {/* Hero Visual Showcase */}
        <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden glass p-3 border border-white/10 shadow-2xl">
          <div className="relative h-[450px] w-full rounded-2xl overflow-hidden">
            <Image src={shots[0]} alt="Joyería de lujo" fill priority className="object-cover transform hover:scale-105 transition duration-700" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-left">
              <span className="text-xs uppercase tracking-widest text-[#c5a059]">Colección Élite</span>
              <h3 className="text-2xl font-light font-serif">Precisión y Estilo en Cada Detalle</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars / Features */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#c5a059] mb-3 block">Diseñado para Alta Joyería</span>
          <h2 className="text-4xl font-light">Una arquitectura pensada <br /><span className="font-serif italic text-[#c5a059]">para la exclusividad.</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p) => (
            <div key={p.number} className="card-premium group hover:border-[#c5a059]/40 transition duration-300">
              <span className="text-4xl font-serif text-[#c5a059]/40 block mb-4 group-hover:text-[#c5a059] transition">{p.number}</span>
              <h3 className="text-xl font-medium mb-3">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Section */}
      <section id="experiencia" className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[500px] rounded-3xl overflow-hidden glass border border-white/10">
          <Image src={shots[1]} alt="Editorial joyería" fill className="object-cover" unoptimized />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] mb-3 block">Experiencia sin fricción</span>
          <h2 className="text-4xl font-light mb-6">Menos complejidad.<br /><span className="font-serif italic text-[#c5a059]">Más distinción.</span></h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Administra tus colecciones, categorías y personaliza la estética de tu tienda online desde un panel administrativo intuitivo, rápido y con persistencia segura.
          </p>
          <Link href="/login" className="text-[#c5a059] font-medium inline-flex items-center gap-2 hover:underline">
            Acceder al panel de control <span>↗</span>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c5a059]/5 to-transparent pointer-events-none"></div>
        <div className="max-w-3xl mx-auto glass p-12 rounded-3xl border border-[#c5a059]/20 relative">
          <span className="text-2xl text-[#c5a059] mb-4 block">✧</span>
          <h2 className="text-4xl font-light mb-4">Eleva el estándar digital de tu joyería</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm">
            Únete a las marcas exclusivas que confían en JoyeriaPro para su gestión y catálogo digital.
          </p>
          <Link href="/login" className="btn-gold inline-block px-8 py-4 text-sm tracking-wider uppercase">
            Comenzar Ahora ↗
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Brand />
          <p>© {new Date().getFullYear()} JoyeriaPro. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-white transition">Privacidad</a>
            <a href="#features" className="hover:text-white transition">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
