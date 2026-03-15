import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre Nosotros — Herencia Perfumería',
  description: 'Fundada en 2025, Herencia Perfumería nace para acercarte al lujo a través del aroma. Conoce nuestra historia y filosofía.',
}

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Bloque hero editorial */}
      <div className="bg-dark text-background py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[9px] tracking-[0.45em] uppercase text-accent mb-4">
            Nuestra historia
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light leading-tight mb-6">
            Herencia Perfumería
          </h1>
          <div className="w-14 h-[2px] bg-accent mb-8" />
          <p className="text-lg font-light leading-relaxed text-background/80 max-w-xl">
            Fundada en 2025 para acercarte al lujo a través del aroma. Porque tu perfume
            es tu legado personal.
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">

        {/* Quiénes somos */}
        <section>
          <p className="text-[9px] tracking-[0.45em] uppercase text-accent mb-3">Quiénes somos</p>
          <h2 className="font-serif text-2xl font-light text-dark mb-4">
            Una boutique de fragancias con alma propia
          </h2>
          <div className="w-14 h-[2px] bg-accent mb-6" />
          <div className="space-y-4 text-dark/70 leading-relaxed">
            <p>
              Herencia Perfumería nació en 2025 en Guarne, Antioquia, con una convicción simple:
              el lujo olfativo no debería ser un privilegio de pocos. Desde las montañas del
              oriente antioqueño, trabajamos cada día para llevar fragancias de alta calidad
              a quienes saben que un aroma puede contar una historia, marcar un momento
              y dejar una huella.
            </p>
            <p>
              Somos una tienda boutique especializada en perfumería premium — tanto en
              originales auténticos de las grandes casas como en réplicas cuidadosamente
              seleccionadas que capturan la esencia de las mejores creaciones olfativas del mundo.
              Cada producto que ofrecemos pasa por un proceso de selección riguroso antes de
              llegar a tus manos.
            </p>
          </div>
        </section>

        {/* Filosofía */}
        <section>
          <p className="text-[9px] tracking-[0.45em] uppercase text-accent mb-3">Nuestra filosofía</p>
          <h2 className="font-serif text-2xl font-light text-dark mb-4">
            La calidad como compromiso, el aroma como arte
          </h2>
          <div className="w-14 h-[2px] bg-accent mb-6" />
          <div className="space-y-4 text-dark/70 leading-relaxed">
            <p>
              En Herencia creemos que la perfumería es una forma de arte que merece ser
              tratada con respeto y conocimiento. No vendemos simplemente fragancias —
              cubrimos el proceso desde la selección hasta la entrega, asegurándonos de
              que cada pieza que viaja desde nuestra tienda hasta tu hogar sea digna
              de llevar el nombre que promete.
            </p>
            <p>
              Nuestro catálogo es intencional. Trabajamos con casas orientales como Afnan,
              Lattafa y Rasasi; con íconos de la perfumería occidental como Carolina Herrera,
              Dior, Armani y Creed; y con propuestas nicho para quienes buscan algo
              verdaderamente único. La diversidad de aromas refleja la diversidad de
              historias que queremos acompañar.
            </p>
          </div>
        </section>

        {/* Legado */}
        <section className="bg-dark text-background rounded-sm px-10 py-12">
          <p className="text-[9px] tracking-[0.45em] uppercase text-accent mb-4">
            Tu perfume, tu legado
          </p>
          <blockquote className="font-serif text-2xl font-light leading-snug text-background/90">
            "Un perfume no se lleva — se porta. Es la primera impresión que das sin decir
            una sola palabra, y la última huella que dejas al partir."
          </blockquote>
          <div className="w-14 h-[2px] bg-accent mt-8" />
          <p className="text-xs text-background/40 mt-4 tracking-widest uppercase">
            Herencia Perfumería
          </p>
        </section>

        {/* Contacto */}
        <section>
          <p className="text-[9px] tracking-[0.45em] uppercase text-accent mb-3">Contáctanos</p>
          <h2 className="font-serif text-2xl font-light text-dark mb-4">
            Estamos para atenderte
          </h2>
          <div className="w-14 h-[2px] bg-accent mb-6" />
          <p className="text-dark/70 leading-relaxed mb-6">
            Si tienes preguntas sobre alguna fragancia, quieres asesoría personalizada o
            deseas hacer un pedido especial, no dudes en escribirnos. Con gusto te
            acompañamos en la búsqueda de tu aroma perfecto.
          </p>
          <ul className="space-y-2 text-sm text-dark/60">
            <li>
              <span className="text-[9px] tracking-widest uppercase text-accent block mb-0.5">Email</span>
              <a href="mailto:hereciaperfumeria@gmail.com" className="hover:text-dark transition-colors">
                hereciaperfumeria@gmail.com
              </a>
            </li>
            <li className="mt-4">
              <span className="text-[9px] tracking-widest uppercase text-accent block mb-0.5">WhatsApp</span>
              <a
                href="https://wa.me/573117997246"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dark transition-colors"
              >
                +57 311 799 7246
              </a>
            </li>
            <li className="mt-4">
              <span className="text-[9px] tracking-widest uppercase text-accent block mb-0.5">Ubicación</span>
              <span>Vereda Hojas Anchas, Guarne, Antioquia, Colombia</span>
            </li>
          </ul>
        </section>

        {/* Volver */}
        <div className="pt-4 border-t border-dark/8">
          <Link
            href="/"
            className="text-[9px] tracking-[0.35em] uppercase text-dark/35 hover:text-dark transition-colors duration-200 border-b border-dark/20"
          >
            ← Volver al catálogo
          </Link>
        </div>

      </div>
    </div>
  )
}
