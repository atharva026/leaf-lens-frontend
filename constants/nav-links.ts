interface NavLink {
  href: string
  label: string
  className?: string
}

export const navLinks: NavLink[] = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/analyze', label: 'Try it now', className: 'btn-primary p-3 hover:text-white!' },
]