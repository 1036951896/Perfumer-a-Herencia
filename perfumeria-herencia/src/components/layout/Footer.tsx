import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="mt-24"
      style={{ backgroundColor: '#111110', color: 'rgba(255,255,255,0.75)' }}
    >
      {/* Franja dorada superior */}
      <div style={{ height: '1px', background: 'rgba(194,162,122,0.35)' }} />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* ── Marca ───────────────────────────── */}
          <div className="sm:col-span-2 md:col-span-1">
            <p
              className="font-serif text-2xl font-light mb-1 tracking-wide"
              style={{ color: '#fff' }}
            >
              Herencia
            </p>
            <p
              className="text-[9px] tracking-[0.45em] uppercase mb-5"
              style={{ color: '#C2A27A' }}
            >
              Perfumería
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Una esencia que trasciende el tiempo. Perfumes inspirados en la elegancia,
              la memoria y la autenticidad. Cada aroma cuenta una historia: la tuya.
            </p>
          </div>

          {/* ── Explorar ────────────────────────── */}
          <div>
            <p
              className="text-[9px] tracking-[0.38em] uppercase mb-5 font-light"
              style={{ color: '#C2A27A' }}
            >
              Explorar
            </p>
            <ul className="space-y-3 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <li>
                <Link href="/original" className="hover:text-white transition-colors duration-200">
                  Catálogo Original
                </Link>
              </li>
              <li>
                <Link href="/replicas" className="hover:text-white transition-colors duration-200">
                  Réplicas Premium
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="hover:text-white transition-colors duration-200">
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Legal ───────────────────────────── */}
          <div>
            <p
              className="text-[9px] tracking-[0.38em] uppercase mb-5 font-light"
              style={{ color: '#C2A27A' }}
            >
              Legal
            </p>
            <ul className="space-y-3 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <li>
                <Link href="/politica-de-privacidad" className="hover:text-white transition-colors duration-200">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos-y-condiciones" className="hover:text-white transition-colors duration-200">
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Contacto ────────────────────────── */}
          <div>
            <p
              className="text-[9px] tracking-[0.38em] uppercase mb-5 font-light"
              style={{ color: '#C2A27A' }}
            >
              Contacto
            </p>
            <ul className="space-y-3 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <li>
                <a
                  href="tel:+573117997246"
                  className="hover:text-white transition-colors duration-200"
                >
                  +57 311 799 7246
                </a>
              </li>
              <li>
                <a
                  href="mailto:hereciaperfumeria@gmail.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  hereciaperfumeria@gmail.com
                </a>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.38)' }}>
                Vereda Hojas Anchas<br />
                Guarne, Antioquia
              </li>
            </ul>
          </div>
        </div>

        {/* ── Divisor ─────────────────────────── */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '28px' }} />

        {/* ── Pie ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p
            className="text-[10px] tracking-widest"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            © {currentYear} Herencia Perfumería · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.28em] uppercase transition-colors duration-200 text-white/35 hover:text-accent"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/573117997246"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.28em] uppercase transition-colors duration-200 text-white/35 hover:text-accent"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
