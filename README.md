# LeafLens - AI-Powered Plant Diagnosis

A modern, privacy-first web application for instant plant health diagnosis using AI. Upload a crop image, get actionable care recommendations, and export detailed reports—all without storing your data.

## Features

- **Multi-Provider AI Support** - Connect OpenAI and Gemini models with your own provider keys
- **Instant Diagnosis** - Get clear crop diagnosis and health summaries in moments without forms or queues
- **Actionable Care Recommendations** - Receive practical treatment suggestions to discuss with agronomists
- **Downloadable Reports** - Export assessments as plain text or PDF with the original photo embedded
- **Privacy-First Design** - No images stored, session-only keys, no account required
- **Rate Limiting Support** - Built-in rate limit handling with user-friendly notifications
- **PDF Report Generation** - Professional PDF exports with embedded images and analysis data

## Tech Stack

### Frontend
- **Next.js** (16.3.3) - React framework with Server-Side Rendering
- **React** (19) - UI library
- **TypeScript** (5.7.3) - Type safety
- **Tailwind CSS** (4.3.3) - Utility-first CSS framework
- **Shadcn/ui** - High-quality React component library

### UI & Utilities
- **Lucide React** - Beautiful SVG icons
- **Base UI** - Headless component library
- **Sonner** - Toast notifications
- **jsPDF** - PDF report generation
- **Axios** - HTTP client
- **Vercel Analytics** - Usage tracking

### Development
- **TypeScript** - Strict typing
- **PostCSS** - CSS processing
- **Tailwind CSS** - Utility-first styling

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm (or npm/yarn)
- An OpenAI or Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/atharva026/leaf-lens-frontend
   cd leaf-lens-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or: pnpm install
   # or: yarn install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory, refer `.env.example`:
   ```env
   # Backend API (needed)
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

### Running the Application

**Development Mode**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production Build**
```bash
npm run build
npm run start
```

## How It Works

1. **Upload Image** - Users upload a crop/plant image on the home page
2. **Select AI Provider** - Choose between OpenAI or Google Gemini
3. **Provide API Key** - Users provide their own API key (session-only, never stored)
4. **Get Analysis** - AI analyzes the crop image and provides:
   - Health diagnosis
   - Disease/issue identification
   - Treatment recommendations
   - Care instructions
5. **Export Results** - Download analysis as:
   - Plain text file
   - PDF report with embedded image

## Privacy & Security

LeafLens prioritizes user privacy:

- **No Image Storage** - Crop photos are not saved on our servers
- **Session-Only Keys** - API keys are only stored in browser session, never persisted
- **No Account Required** - Start analyzing immediately without registration
- **Client-Side Processing** - Most processing happens in the browser
- **Developer Tools Protection** - Prevents unauthorized code inspection

Refer to [lib/api.ts](lib/api.ts) for API client implementation and error handling.

## PDF Report Generation

The application can generate professional PDF reports containing:
- Original crop image
- AI diagnosis
- Health assessment
- Treatment recommendations
- Timestamp and metadata

Refer to [lib/generatePdfReport.ts](lib/generatePdfReport.ts) for implementation details.

## Rate Limiting

The application handles API rate limiting gracefully:
- Displays rate limit status to users
- Provides retry guidance
- Tracks remaining API quota

See [components/rate-limit-banner.tsx](components/rate-limit-banner.tsx) for UI implementation.

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page entry point |
| `app/analyze/page.tsx` | Analysis/results page |
| `components/analysis.tsx` | Main analysis component |
| `lib/api.ts` | API client with error handling |
| `lib/generatePdfReport.ts` | PDF generation logic |
| `constants/providers.ts` | AI provider configuration |
| `constants/features.ts` | Feature descriptions |
| `constants/privacy.ts` | Privacy policy content |

## Contributing

Contributions are welcome! 

## License

This project is licensed under the MIT License - see the LICENSE file for details.
