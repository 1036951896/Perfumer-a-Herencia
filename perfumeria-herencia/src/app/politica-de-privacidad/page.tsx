import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad — Herencia Perfumería',
  description: 'Política de tratamiento de datos personales de Herencia Perfumería, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.',
}

export default function PoliticaPrivacidadPage() {
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
          Política de Privacidad
        </h1>
        <div className="w-14 h-[2px] bg-accent mb-6" />
        <p className="text-xs text-dark/40 mb-12">
          Última actualización: marzo de 2026
        </p>

        <div className="prose prose-sm max-w-none text-dark/70 leading-relaxed space-y-8">

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">1. Responsable del tratamiento</h2>
            <p>
              <strong className="font-medium text-dark">Herencia Perfumería</strong>, identificada con correo electrónico
              hereciaperfumeria@gmail.com, con domicilio en Vereda Hojas Anchas, Guarne, Antioquia,
              Colombia, es la responsable del tratamiento de los datos personales recopilados a
              través de este sitio web y sus canales de atención.
            </p>
            <p className="mt-2">
              Contacto del responsable: <a href="mailto:hereciaperfumeria@gmail.com" className="text-accent underline">hereciaperfumeria@gmail.com</a> ·
              Teléfono: <a href="tel:+573117997246" className="text-accent underline">+57 311 799 7246</a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">2. Marco legal</h2>
            <p>
              La presente política se rige por la <strong className="font-medium text-dark">Ley Estatutaria 1581 de 2012</strong> (Ley
              de Protección de Datos Personales), el <strong className="font-medium text-dark">Decreto Reglamentario 1377 de 2013</strong>,
              el <strong className="font-medium text-dark">Decreto 1074 de 2015</strong> y las demás normas que los complementen, modifiquen
              o sustituyan.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">3. Datos que recopilamos</h2>
            <p>Al interactuar con nuestro sitio web o comunicarte con nosotros, podemos recopilar:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nombre completo</li>
              <li>Número de teléfono o celular</li>
              <li>Dirección de correo electrónico</li>
              <li>Dirección de envío o domicilio</li>
              <li>Datos de navegación (cookies, dirección IP, páginas visitadas)</li>
              <li>Información sobre pedidos y preferencias de compra</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">4. Finalidad del tratamiento</h2>
            <p>Los datos personales serán utilizados para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Gestionar y procesar pedidos y solicitudes de compra</li>
              <li>Enviar confirmaciones, notificaciones y novedades sobre su pedido</li>
              <li>Brindar atención al cliente y resolver consultas o reclamaciones</li>
              <li>Enviar comunicaciones comerciales y promocionales (previo consentimiento)</li>
              <li>Cumplir obligaciones legales, contables o fiscales</li>
              <li>Mejorar la experiencia de usuario en el sitio web</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">5. Autorización del titular</h2>
            <p>
              Conforme al artículo 9 de la Ley 1581 de 2012, el tratamiento de datos personales
              requiere la autorización previa, expresa e informada del titular. Al completar
              formularios de contacto, realizar pedidos o suministrar sus datos de manera voluntaria,
              usted otorga su consentimiento para el tratamiento descrito en esta política.
            </p>
            <p className="mt-2">
              El titular podrá revocar su autorización en cualquier momento, mediante comunicación
              escrita dirigida a <a href="mailto:hereciaperfumeria@gmail.com" className="text-accent underline">hereciaperfumeria@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">6. Derechos del titular</h2>
            <p>De conformidad con el artículo 8 de la Ley 1581 de 2012, el titular tiene derecho a:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="font-medium text-dark">Conocer</strong> los datos personales que Herencia Perfumería tiene sobre usted</li>
              <li><strong className="font-medium text-dark">Actualizar</strong> y <strong className="font-medium text-dark">rectificar</strong> sus datos cuando sean inexactos o incompletos</li>
              <li><strong className="font-medium text-dark">Solicitar prueba</strong> de la autorización otorgada</li>
              <li><strong className="font-medium text-dark">Ser informado</strong> sobre el uso que se ha dado a sus datos personales</li>
              <li><strong className="font-medium text-dark">Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley</li>
              <li><strong className="font-medium text-dark">Revocar</strong> la autorización y/o solicitar la supresión de sus datos, siempre que no exista deber legal o contractual de conservarlos</li>
              <li><strong className="font-medium text-dark">Abstenerse</strong> de responder preguntas sobre datos sensibles</li>
            </ul>
            <p className="mt-2">
              Para ejercer estos derechos, puede comunicarse a través de{' '}
              <a href="mailto:hereciaperfumeria@gmail.com" className="text-accent underline">hereciaperfumeria@gmail.com</a>.
              Responderemos dentro de los plazos establecidos por la ley (10 días hábiles para consultas,
              15 días hábiles para reclamos).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">7. Transferencia y transmisión de datos</h2>
            <p>
              Herencia Perfumería no vende, alquila ni cede los datos personales de sus clientes
              a terceros con fines comerciales. Solo podrá compartir datos con:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Operadores logísticos y de envíos, exclusivamente para la entrega de pedidos</li>
              <li>Proveedores de servicios tecnológicos que actúan como encargados del tratamiento</li>
              <li>Autoridades competentes cuando exista obligación legal</li>
            </ul>
            <p className="mt-2">
              En todos los casos se exigirá que el receptor cumpla estándares de protección equivalentes
              a los establecidos en la Ley 1581 de 2012.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">8. Seguridad de la información</h2>
            <p>
              Herencia Perfumería adoptará las medidas técnicas, humanas y administrativas necesarias
              para garantizar la seguridad de los datos personales y evitar su adulteración, pérdida,
              consulta, uso o acceso no autorizado o fraudulento.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">9. Tiempo de conservación</h2>
            <p>
              Los datos personales serán conservados durante el tiempo necesario para cumplir con las
              finalidades para las cuales fueron recopilados, o durante el término exigido por la ley
              (en materia comercial y tributaria, mínimo 10 años conforme al Código de Comercio y el
              Estatuto Tributario colombiano). Una vez cumplidas dichas finalidades, los datos serán
              suprimidos de manera segura.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">10. Cookies y tecnologías de seguimiento</h2>
            <p>
              Este sitio web puede utilizar cookies para mejorar la experiencia de navegación, analizar
              el tráfico y personalizar el contenido. Al continuar navegando en el sitio, usted acepta
              el uso de cookies conforme a esta política. Puede configurar su navegador para rechazar
              las cookies, aunque esto podría afectar algunas funcionalidades del sitio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">11. Modificaciones a esta política</h2>
            <p>
              Herencia Perfumería se reserva el derecho de actualizar esta política en cualquier momento.
              Cualquier modificación será publicada en este sitio web con indicación de la fecha de
              actualización. Le recomendamos revisar esta página periódicamente.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-light text-dark mb-3">12. Autoridad de control</h2>
            <p>
              Si considera que Herencia Perfumería ha vulnerado sus derechos en materia de protección
              de datos personales, puede presentar una queja ante la{' '}
              <strong className="font-medium text-dark">Superintendencia de Industria y Comercio (SIC)</strong>,
              entidad encargada de velar por el cumplimiento de la Ley 1581 de 2012 en Colombia.
              Sitio web: <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="text-accent underline">www.sic.gov.co</a>
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
