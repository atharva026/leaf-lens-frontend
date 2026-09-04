export type ProviderModel = {
  id: string;
  label: string;
  note?: string;
};

export type Provider = {
  id: string;
  label: string;
  baseUrl: string;
  key_prefix: string;
  key_hint: string;
  docs_url: string;
  models: ProviderModel[];
};

export const fallbackProviders: Provider[] = [
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://platform.openai.com",
    key_prefix: "sk-",
    key_hint: "Starts with sk- — created at platform.openai.com",
    docs_url: "https://platform.openai.com/api-keys",
    models: [
      { id: "gpt-5.5", label: "GPT-5.5" },
      { id: "gpt-5.4", label: "GPT-5.4" },
      { id: "gpt-5.4-mini", label: "GPT-5.4 mini" },
    ],
  },
  {
    id: "google_genai",
    label: "Google Gemini",
    baseUrl: "https://aistudio.google.com",
    key_prefix: "AQ",
    key_hint: "Starts with AQ. — created at aistudio.google.com",
    docs_url: "https://aistudio.google.com/api-keys",
    models: [
      { id: "gemini-3.7-flash", label: "Gemini 3.7 Flash" },
      { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash" },
      { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash" },
      { id: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash Lite" },
      { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
      { id: "gemini-3-flash", label: "Gemini 3 Flash" },
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    ],
  },
];