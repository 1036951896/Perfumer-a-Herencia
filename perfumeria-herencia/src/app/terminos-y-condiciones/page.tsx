import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Herencia Perfumería',
  description: 'Términos y condiciones de uso y compra en Herencia Perfumería, conforme a la legislación colombiana.',
}

export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">

        {/* Volver */}
        <Link
          href="/"
          className="text-[9px] tracking-[0.35em] uppercase text-dark/35 hover:text-dark transition-colors duration-200 mb-12 inline-block border-b border-dark/20"
        >
          ← Inicio
        </Link>

        {/* Encabezado */}
        <p className="text-[9px] tracking-[0.45em] uppercase text-accent mb-3">Legal</p>
        <h1 className="font-serif text-3xl font-light text-dark mb-3">
          Términos y Condiciones
        </h1>
        <div className="w-14 h-[2px] bg-accent mb-6" />
        <p className="text-xs text-dark/40 mb-12">
          Última actualización: marzo de 2026
        </p>

        <div className="prose prose-sm max-w-none text-dark/70 leading-relaxed space-y-8">

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">1. Generalidades</h2>
            <p>
              Los presentes Términos y Condiciones regulan el acceso, uso y las transacciones
              realizadas a través del sitio web y los canales de venta de{' '}
              <strong className="font-medium text-dark">Herencia Perfumería</strong> (en adelante,
              "Herencia" o "el Vendedor"), con domicilio en Vereda Hojas Anchas, Guarne, Antioquia,
              Colombia.
            </p>
            <p className="mt-2">
              Al navegar en este sitio o realizar una compra, el Usuario acepta íntegramente estos
              términos. Si no está de acuerdo, le recomendamos abstenerse de utilizar el sitio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">2. Marco legal aplicable</h2>
            <p>Estas condiciones se rigen por:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="font-medium text-dark">Ley 1480 de 2011</strong> — Estatuto del Consumidor colombiano</li>
              <li><strong className="font-medium text-dark">Ley 527 de 1999</strong> — Comercio electrónico y firmas digitales</li>
              <li><strong className="font-medium text-dark">Ley 1581 de 2012</strong> — Protección de datos personales</li>
              <li><strong className="font-medium text-dark">Código de Comercio</strong> y disposiciones civiles aplicables</li>
              <li>Normas de la <strong className="font-medium text-dark">SIC</strong> sobre publicidad, ofertas y garantías</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">3. Productos y descripción</h2>
            <p>
              Herencia Perfumería comercializa dos categorías de productos:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong className="font-medium text-dark">Originales:</strong> Fragancias 100% auténticas de las marcas indicadas,
                adquiridas a través de canales de distribución legítimos.
              </li>
              <li>
                <strong className="font-medium text-dark">Réplicas Premium:</strong> Fragancias de inspiración olfativa, claramente
                diferenciadas y etiquetadas como réplicas. Herencia no afirma ni sugiere que estas
                fragancias sean productos de las marcas originales. El Usuario es consciente de
                esta distinción al momento de la compra.
              </li>
            </ul>
            <p className="mt-2">
              Las imágenes y descripciones de los productos son orientativas. El color, textura
              y presentación pueden variar ligeramente respecto al producto recibido.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">4. Precios</h2>
            <p>
              Todos los precios publicados están expresados en <strong className="font-medium text-dark">pesos colombianos (COP)</strong> e
              incluyen los impuestos aplicables, salvo indicación contraria. Herencia se reserva el
              derecho de modificar los precios en cualquier momento; sin embargo, el precio vigente
              al momento de confirmar el pedido será el aplicable a dicha transacción.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">5. Proceso de compra</h2>
            <p>El proceso de compra se realiza a través de los canales habilitados (sitio web, WhatsApp u otros). Los pasos son:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>El Usuario selecciona el producto y solicita la compra</li>
              <li>Herencia confirma la disponibilidad y envía los detalles del pedido</li>
              <li>El Usuario realiza el pago mediante el método acordado</li>
              <li>Herencia confirma el pago y despacha el pedido</li>
              <li>El Usuario recibe el producto en la dirección indicada</li>
            </ol>
            <p className="mt-2">
              La confirmación del pedido no implica contrato definitivo hasta tanto el pago sea
              verificado por Herencia.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">6. Formas de pago</h2>
            <p>
              Herencia Perfumería acepta los métodos de pago informados al momento de la compra
              (transferencia bancaria, Nequi, Daviplata u otros previamente acordados). El Usuario
              es responsable de la exactitud de los datos de pago suministrados.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">7. Envíos y entrega</h2>
            <p>
              Los envíos se realizan a todo el territorio nacional colombiano. Los tiempos estimados
              de entrega serán informados al momento de confirmar el pedido y dependerán de la
              empresa transportadora y la ubicación del destinatario.
            </p>
            <p className="mt-2">
              Herencia no se hace responsable por demoras imputables a la empresa transportadora,
              fenómenos naturales, paros, huelgas u otras causas de fuerza mayor o caso fortuito.
            </p>
            <p className="mt-2">
              El costo del envío será informado antes de confirmar la compra y puede variar según
              el destino y el peso del paquete.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">8. Derecho de retracto</h2>
            <p>
              Conforme al artículo 47 de la Ley 1480 de 2011, el consumidor que haya adquirido
              el producto mediante métodos no tradicionales o a distancia tendrá derecho a retractarse
              dentro de los <strong className="font-medium text-dark">cinco (5) días hábiles</strong> siguientes a la entrega del bien.
            </p>
            <p className="mt-2">
              Para ejercer el retracto, el producto debe estar en perfectas condiciones, sin haber
              sido usado, con su empaque original. Los costos de devolución correrán por cuenta del
              consumidor, salvo que el producto presente defectos imputables al vendedor.
            </p>
            <p className="mt-2">
              El derecho de retracto no aplica en los casos expresamente exceptuados por la ley.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">9. Garantías</h2>
            <p>
              Los productos comercializados por Herencia cuentan con la garantía legal mínima
              establecida en la Ley 1480 de 2011. En caso de que el producto presente defectos de
              calidad o no corresponda a lo descrito, el consumidor podrá exigir, a su elección:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>La reparación o sustitución del bien</li>
              <li>La devolución del dinero pagado</li>
            </ul>
            <p className="mt-2">
              Para hacer válida la garantía, el consumidor debe reportar el inconveniente dentro de
              los 30 días calendario siguientes a la recepción del producto, comunicándose a
              través de <a href="mailto:hereciaperfumeria@gmail.com" className="text-accent underline">hereciaperfumeria@gmail.com</a> o al{' '}
              <a href="tel:+573117997246" className="text-accent underline">+57 311 799 7246</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">10. Propiedad intelectual</h2>
            <p>
              Todo el contenido del sitio web de Herencia Perfumería (textos, imágenes, diseños,
              logotipos, código fuente) es propiedad de Herencia o de sus respectivos propietarios,
              y está protegido por las leyes colombianas e internacionales de propiedad intelectual.
              Queda prohibida su reproducción, distribución o uso sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">11. Responsabilidad</h2>
            <p>
              Herencia Perfumería no será responsable por daños indirectos, lucro cesante, pérdida
              de datos o cualquier perjuicio derivado del uso indebido del sitio web, interrupciones
              del servicio por causas ajenas a su voluntad, o por información incorrecta suministrada
              por el Usuario.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">12. Protección de datos personales</h2>
            <p>
              El tratamiento de los datos personales del Usuario se rige por la{' '}
              <Link href="/politica-de-privacidad" className="text-accent underline hover:text-dark transition-colors">
                Política de Privacidad
              </Link>{' '}
              de Herencia Perfumería, disponible en este sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">13. Modificaciones</h2>
            <p>
              Herencia Perfumería podrá modificar los presentes Términos y Condiciones en cualquier
              momento. Las modificaciones serán publicadas en este sitio con la fecha de actualización.
              El uso continuado del sitio o la realización de nuevas compras implica la aceptación
              de los términos vigentes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">14. Resolución de conflictos</h2>
            <p>
              Ante cualquier inconveniente o reclamación, el Usuario puede comunicarse directamente
              con Herencia Perfumería a través de los canales de atención disponibles. En caso de
              no obtener una solución satisfactoria, el consumidor podrá acudir a la{' '}
              <strong className="font-medium text-dark">Superintendencia de Industria y Comercio (SIC)</strong> o
              a los jueces competentes según la legislación colombiana.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">15. Ley aplicable y jurisdicción</h2>
            <p>
              El presente acuerdo se rige por las leyes de la República de Colombia. Para la
              resolución de cualquier controversia derivada de estos términos, las partes se
              someten a los jueces y tribunales competentes del territorio colombiano.
            </p>
          </section>

        </div>

        {/* Pie */}
        <div className="mt-16 pt-8 border-t border-dark/8">
          <div className="w-14 h-[2px] bg-accent mb-4" />
          <p className="text-[9px] tracking-[0.3em] uppercase text-dark/30">
            Herencia Perfumería · Guarne, Antioquia, Colombia
          </p>
        </div>

      </div>
    </div>
  )
}
