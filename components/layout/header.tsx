"use client"

import { Leaf, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { navLinks } from "@/constants/nav-links"

export function Header() {
  const [menu, setMenu] = useState(false)
  return <header className="site-header">
    <Link className="logo" href="/"><span className="logo-mark">
      <Leaf size={19} /></span><span>LeafLens</span>
    </Link>

    <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMenu(!menu)}>
      <Menu size={21} />
    </button>
    <nav className={menu ? 'nav open' : 'nav'}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={link.className}
          onClick={() => setMenu(false)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  </header>
}
