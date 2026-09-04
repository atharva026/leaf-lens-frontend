import { Leaf } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return <footer>
    <Link className="logo" href="/">
      <span className="logo-mark">
        <Leaf size={17} />
      </span>LeafLens
    </Link>
    
    <p>Photos and keys are never stored. AI guidance only confirm with a local agronomist.</p>
    
    <div>
      <Link href="#faq">Privacy</Link>
      <Link href="https://github.com/atharva026/leaf-lens-frontend" target="_blank" rel="noreferrer">Source</Link>
      <span>© 2026 LeafLens</span>
    </div>
  </footer>
}
