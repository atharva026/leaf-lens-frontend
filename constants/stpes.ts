interface Step {
  number: string
  title: string
  description: string
}

export const steps: Step[] = [
  {
    number: '01',
    title: 'Choose your AI',
    description: 'Pick a provider and model, then bring your own API key, run the connection test.'
  },
  {
    number: '02',
    title: 'Upload a photo',
    description: 'Drop in a clear image of the crop or leaf you want to understand.'
  },
  {
    number: '03',
    title: 'Grow with confidence',
    description: 'Get a diagnosis, severity level, and a treatment plan you can use, then export TXT or PDF.'
  }
]

