import { Brain, ScanLine, Leaf, Download, LucideIcon } from 'lucide-react'

interface FeatureItem {
    icon: LucideIcon
    title: string
    text: string
}

export const featureItems: FeatureItem[] = [
  {
    icon: Brain,
    title: 'Multi-provider AI support',
    text: 'Connect OpenAI and Gemini models with your own provider key.'
  }, 
  {
    icon: ScanLine,
    title: 'Instant clarity',
    text: 'Get a clear crop diagnosis and health summary in moments — no forms, queues or cloud processing delays.'
  },
  {
    icon: Leaf,
    title: 'Actionable care',
    text: 'Receive practical treatment recommendations made for your plant to discuss with an agronomist.'
  },
  {
    icon: Download,
    title: 'Downloadable reports',
    text: 'Export your assessment as plain text or a PDF with the original photo embedded, ready to share or archive offline.'
  }
]
