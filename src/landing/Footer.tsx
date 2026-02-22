import { Link } from 'react-router-dom'
import { Hammer, Github, Twitter, Linkedin, Instagram } from 'lucide-react'

const footerLinks = {
  Produto: [
    { label: 'Funcionalidades', href: '#features' },
    { label: 'Preços', href: '#pricing' },
    { label: 'Integrações', href: '#' },
    { label: 'Atualizações', href: '#' },
  ],
  Empresa: [
    { label: 'Sobre nós', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Carreiras', href: '#' },
    { label: 'Contato', href: '#' },
  ],
  Suporte: [
    { label: 'Central de Ajuda', href: '#' },
    { label: 'Documentação', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'API', href: '#' },
  ],
  Legal: [
    { label: 'Privacidade', href: '#' },
    { label: 'Termos de Uso', href: '#' },
    { label: 'Cookies', href: '#' },
    { label: 'LGPD', href: '#' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
]

export default function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith('#') && href.length > 1) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Hammer className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">MarcenaFlow</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mb-6">
              O sistema operacional completo para marcenarias modernas. Gestão inteligente, do pedido à entrega.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 bg-gray-100 dark:bg-dark-hover rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-surface hover:text-gray-700 dark:hover:text-white transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-100 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2026 MarcenaFlow. Todos os direitos reservados.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            Feito com ❤️ no Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}
