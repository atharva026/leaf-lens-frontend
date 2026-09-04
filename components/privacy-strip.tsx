import { privacyStripItems } from "@/constants/privacy"

export function PrivacyStrip() {
  return (
    <section className="privacy-strip">
      {privacyStripItems.map(({ icon: Icon, title, text }) => (
        <div key={title}>
          <Icon size={20} />
          <span>
            <strong>{title}</strong>
            <small>{text}</small>
          </span>
        </div>
      ))}
    </section>
  )
}
