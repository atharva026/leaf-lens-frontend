interface FaqItem {
  question: string
  answer: string
}

export const faqs: FaqItem[] = [
  {
    question: 'Which AI providers are supported?',
    answer: 'LeafLens supports OpenAI and Google Gemini. You can switch between app supported models from each provider — such as gpt-5.5, gemini-3.5 — using the provider you already trust and pay for.'
  },
  {
    question: 'Is my API key stored on servers?',
    answer: 'No. Your key is sent for the current request only and is never stored by LeafLens.'
  },
  {
    question: 'What image formats are accepted?',
    answer: 'JPEG, PNG, and WebP images are accepted upto 5 MB. For best results, use a clear, well-lit close-up of the affected leaf, fruit or stem with the background out of focus.'
  },
  {
    question: 'What happens with a non-plant image?',
    answer: 'LeafLens will safely return a Not analyzed result and ask you to upload a crop image instead.'
  },
  {
    question: 'Does LeafLens cost anything?',
    answer: 'LeafLens itself does not charge for this interface. You only pay your chosen AI provider for the single API request used to analyse each photo, typically a small fraction of a cent per image..'
  },
  {
    question: 'How long are my data retained?',
    answer: 'Nothing is retained. Your photo is relayed to the provider for one request and then dropped. There is no cloud storage, no history and no training dataset built from your uploads.'
  }
]