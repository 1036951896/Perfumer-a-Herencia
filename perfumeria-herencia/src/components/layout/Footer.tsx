export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-deep text-white mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-2">Herencia</h3>
            <p className="text-sm opacity-75">Perfumería</p>
            <p className="text-xs opacity-50 mt-2">
              E-commerce de perfumes auténticos y réplicas de calidad
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/original" className="hover:text-primary transition-colors">
                  Catálogo Original
                </a>
              </li>
              <li>
                <a href="/replicas" className="hover:text-primary transition-colors">
                  Réplicas
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold mb-4">Información</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <div className="space-y-2 text-sm opacity-75">
              <p>📞 +57 (1) 123-4567</p>
              <p>📧 info@herenciaperfumeria.com</p>
              <p>📍 Bogotá, Colombia</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs opacity-50">
            <p>&copy; {currentYear} Herencia Perfumería. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="hover:text-primary transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
