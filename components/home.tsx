"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { PrivacyStrip } from "@/components/privacy-strip"
import { featureItems } from "@/constants/features"
import { steps } from "@/constants/stpes"
import { faqs } from "@/constants/faqs"
import { ArrowDown, ScanSearch } from "lucide-react"
import heroPlantImage from "@/public/images/crop_scan.webp"

export function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> Privacy-first plant intelligence</span>
          <h1>See what your crop<br /><em>is telling you.</em></h1>
          <p>LeafLens reads a single leaf photo with the AI model you choose and returns a disease assessment, severity and treatment plan. No account, no image storage, no hidden middleman.</p>

          <div className="hero-actions">
            <Link className="btn-primary p-3" href="/analyze"><ScanSearch className="w-4 h-4" />Analyze a photo</Link>
            <Link className="btn-secondary p-3" href="#how-it-works">See how it works <ArrowDown className="w-4 h-4" /></Link>
          </div>

          <div className="mt-4 w-fit rounded-full border border-black/30 bg-black/15 px-4 py-2 text-[12px] text-black">
            Bring your own key · JPG, PNG or WebP up to 5 MB
          </div>
        </div>
        <div className="">
          <Image
              className="hidden lg:flex"
              src={heroPlantImage.src}
              width={320}
              height={320}
              alt="Plant hero image"
              priority
            />
        </div>
      </section>

      <PrivacyStrip />

      {/* Features */}
      <section className="section scroll-mt-12" id="features">
        <div className="section-heading">
          <span className="eyebrow">01 / The clear way forward</span>
          <h2>Plant care, without<br /><em>the guesswork.</em></h2>
          <p>One image gives you the context you need to make a better next move.</p>
        </div>

        <div className="feature-grid">
          {featureItems.map(({ icon: Icon, title, text }) => (
            <article className="feature-card" key={title}>
              <span className="icon-box">
                <Icon size={20} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="steps-section scroll-mt-12" id="how-it-works">
        <div className="section-heading">
          <span className="eyebrow">02 / How it works</span>
          <h2>From leaf to<br /><em>next step.</em></h2>
        </div>

        <div className="steps flex-col md:flex-row">
          {steps.map((step) => (
            <div className="step my-2 lg:my-0" key={step.number}><span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>

          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section section scroll-mt-5" id="faq">
        <div className="section-heading">
          <span className="eyebrow">03 / Frequently asked questions</span>
          <h2>Good to<br /><em>know.</em></h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div className="faq-item" key={faq.question}>
              <button
                aria-expanded={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              ><span>{faq.question}</span><span>{openFaq === i ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                <div className="faq-answer-inner">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
    </main>
  )
}