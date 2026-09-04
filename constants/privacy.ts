import { Leaf, LockKeyhole, ShieldCheck, LucideIcon } from "lucide-react";

interface PrivacyStripItem {
  icon: LucideIcon
  title: string
  text: string
}

export const privacyStripItems: PrivacyStripItem[] = [
  {
    icon: ShieldCheck,
    title: 'No images stored',
    text: 'Your crop stays yours'
  },
  {
    icon: LockKeyhole,
    title: 'Session-only keys',
    text: 'Never saved or shared'
  },
  {
    icon: Leaf,
    title: 'No account required',
    text: 'Start in seconds'
  },
]