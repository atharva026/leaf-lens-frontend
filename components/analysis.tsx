'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { api, friendlyError, RateLimitError } from '@/lib/api'
import { FileText, LockKeyhole, ImagePlus, X, Check, PlugZap, Eye, EyeOff, TriangleAlert, ScanSquare, ExternalLink, CircleAlert } from 'lucide-react'
import { Results } from '@/components/result'
import { fallbackProviders, Provider } from '@/constants/providers'
import { toast } from "sonner";
import { formatResult } from '@/utils/formatResult'
import { getCached, setCached } from '@/utils/cache'
import Link from 'next/link'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function Analysis() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [provider, setProvider] = useState('')
  const [model, setModel] = useState('')
  const [loadingProvider, setLoadingProvider] = useState(false)
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [imageError, setImageError] = useState('')
  const [connection, setConnection] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retrySeconds, setRetrySeconds] = useState(0)
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('Validating image…')
  const [providerMenuOpen, setProviderMenuOpen] = useState(false)
  const [modelMenuOpen, setModelMenuOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const providerMenuRef = useRef<HTMLDivElement>(null)
  const modelMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadProviders = async () => {
      setLoadingProvider(true)
      const CACHE_KEY = "ai-providers";
      const CACHE_TTL = 60 * 60 * 1000; // 1 hour

      const cached = getCached<Provider[]>(CACHE_KEY);

      if (cached) {
        setProviders(cached);
        setLoadingProvider(false)
        return;
      }

      try {
        const providers = await api<Provider[]>("/ai/providers/");

        setProviders(providers);
        setCached(CACHE_KEY, providers, CACHE_TTL);
      } catch {
        setProviders(fallbackProviders);
      } finally {
        setLoadingProvider(false)
      }
    };

    loadProviders();
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node

      if (providerMenuRef.current && !providerMenuRef.current.contains(target)) {
        setProviderMenuOpen(false)
      }

      if (modelMenuRef.current && !modelMenuRef.current.contains(target)) {
        setModelMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    return () => window.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const models = useMemo(
    () => providers.find(p => p.id === provider)?.models || [],
    [providers, provider]
  )

  const selectedProvider = providers.find(item => item.id === provider)
  const selectedModel = models.find(item => item.id === model)
  const keyLooksRight = !selectedProvider || key.trim().startsWith(selectedProvider.key_prefix)
  const canTest = !!provider && !!model && key.trim().length >= 8 && keyLooksRight && connection !== 'loading'
  const canAnalyze = connection == "success" && !!file //&& !analysis.isPending;

  const resetSelection = (nextProvider: string, nextModel = '') => {
    setProvider(nextProvider)
    setModel(nextModel)
    setKey('')
    setConnection('idle')
    setResult(null)
    setFile(null)
    setPreview('')
    setError('')
  }

  const selectFile = (next: File | undefined) => {
    if (!next) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(next.type)) {
      setImageError('Invalid file type. Please upload an image.')
      return
    }

    if (next.size > MAX_FILE_SIZE) {
      setImageError('Image size must be 5 MB or less.')
      toast.error('Image size must be 5 MB or less.')
      return
    }

    setFile(next)
    setPreview(URL.createObjectURL(next))
    setImageError('')
    setResult(null)
  }

  const test = async () => {
    setConnection('loading')
    setError('')
    try {
      await api<{
        connection_successful: boolean;
        provider: string;
        model: string;
      }>(
        '/ai/providers/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model,
          api_key: key
        })
      })

      setConnection('success')
    } catch (e) {
      setConnection('error')
      if (e instanceof RateLimitError) {
        setError(e.message ?? "Too Many requests. Please try again later.");
        setRetrySeconds(e?.retryAfter ?? 30)
        return;
      }
      const errMsg = friendlyError(e)
      setError(errMsg)
      toast.error(errMsg);
    }
  }

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)

    const statuses = [
      'Validating image…',
      'Analyzing crop…',
      'Preparing your care plan…'
    ]

    let i = 0
    const ticker = window.setInterval(() => {
      i = (i + 1) % statuses.length
      setStatus(statuses[i])
    }, 1200)

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('provider', provider)
      form.append('model', model)
      form.append('api_key', key)

      const res = await api(
        '/analyze', {
        method: 'POST',
        body: form
      })

      setResult(res)
    } catch (e) {
      if (e instanceof RateLimitError) {
        console.log('eeeeee :>> ', e.message);
        setError(e.message ?? "Too Many requests. Please try again later.");
        setRetrySeconds(e?.retryAfter ?? 30)
        return;
      }
      const errMsg = friendlyError(e)
      setError(errMsg)
      toast.error(errMsg);
    } finally {
      window.clearInterval(ticker)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!retrySeconds) return
    const t = window.setInterval(() => setRetrySeconds(s => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(t)
  }, [retrySeconds])

  const resultText = result ? formatResult(result.result) : ''

  return (
    <main className="analyze-page">
      <div className="analyze-intro">
        <span className="eyebrow">Crop analysis / private by design</span>
        <h1>Let&apos;s look<br /><em>closer.</em></h1>
        <p>Bring your own AI provider key. We&apos;ll turn one crop photo into a clear, useful care plan.</p>
      </div>

      <div className="analysis-layout">
        <section className="control-panel">
          <div className="panel-top">
            <span className="panel-kicker">01 / Set up your lens</span>
            <div className="group relative inline-flex">
              <span className="session-note cursor-help">
                <LockKeyhole size={13} />
                Session only
              </span>

              <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-72
                  -translate-x-1/2 translate-y-1 rounded-lg
                  bg-black/90 px-3 py-2 text-xs leading-5 text-white opacity-0
                  shadow-xl transition-all duration-150
                  group-hover:pointer-events-auto group-hover:translate-y-0
                  group-hover:opacity-100">
                Your key lives in this browser tab only — it is used to relay a single
                request to your provider, never written to a database, log or cookie,
                and it disappears when you close the tab.
              </div>
            </div>
          </div>
          <div className="select-field">
            <label>AI provider</label>
            <div className="select-shell" ref={providerMenuRef}>
              <button
                type="button"
                className={`select-button ${provider ? 'is-selected' : ''}`}
                onClick={() => setProviderMenuOpen(open => !open)}
                disabled={loadingProvider}
              >
                {loadingProvider ? (
                  <span className="block h-4 w-28 animate-pulse rounded bg-gray-200" />
                ) : (
                  <span className="select-value">{selectedProvider ? selectedProvider.label : 'Choose a provider'}</span>
                )}
                <span className="select-chevron" aria-hidden="true" />
              </button>

              {providerMenuOpen && (
                <div className="select-menu" role="listbox" aria-label="AI provider options">
                  {providers.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className={`select-option ${provider === item.id ? 'active' : ''}`}
                      onClick={() => {
                        resetSelection(item.id, '')
                        setProviderMenuOpen(false)
                      }}
                    >
                      <span>{item.label}</span>
                      <small>{item.models.length} models</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="select-field">
            <label>Model</label>
            <div className="select-shell" ref={modelMenuRef}>
              <button
                type="button"
                className={`select-button ${model ? 'is-selected' : ''}`}
                onClick={() => provider && setModelMenuOpen(open => !open)}
                disabled={!provider || loadingProvider}
              >
                {loadingProvider ? (
                  <span className="block h-4 w-28 animate-pulse rounded bg-gray-200" />
                ) : (
                  <span className="select-value">{selectedModel ? selectedModel.label : 'Choose a model'}</span>
                )}
                <span className="select-chevron" aria-hidden="true" />
              </button>

              {modelMenuOpen && provider && (
                <div className="select-menu" role="listbox" aria-label="Model options">
                  {models.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className={`select-option ${model === item.id ? 'active' : ''}`}
                      onClick={() => {
                        setModel(item.id)
                        setConnection('idle')
                        setError('')
                        setResult(null)
                        setModelMenuOpen(false)
                      }}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label className="block space-y-1.5">
            <span>Your provider API key</span>
            <div className="flex items-stretch gap-1.5">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={e => {
                  setKey(e.target.value)
                  setConnection('idle')
                }}
                placeholder={selectedProvider ? `${selectedProvider.key_prefix}…` : 'Paste your key'}
                className="w-full rounded-sm border border-border bg-background mt-2! p-2 font-mono text-sm outline-none focus-visible:border-ring"
              />
              <button
                type="button"
                onClick={() => setShowKey(value => !value)}
                className="rounded-sm border border-border hover:border-[#0084FF] hover:text-[#0084FF] bg-black/3 hover:bg-[#0084FF]/7 p-2! mt-2! text-muted-foreground transition-colors hover:bg-secondary"
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
              </button>
            </div>
            <small className="text-xs text-muted-foreground">
              <span>{selectedProvider?.key_hint}</span>
              {selectedProvider && (
                <span className="group relative inline-flex ml-1">
                  <Link
                    href={selectedProvider.docs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={12} className="text-blue-500 hover:text-blue-600" />
                  </Link>
                </span>
              )}
            </small>
            {key && !keyLooksRight && (
              <small className="w-fit unlock-message flex! items-center gap-2 mb-2 border p-2 rounded-xl">
                <TriangleAlert className="size-3 text-amber-400" />That doesn&apos;t look like a {selectedProvider?.label} key — expected it to start with {selectedProvider?.key_prefix}
              </small>
            )}
          </label>

          <button
            className="button button-outline bg-blue-400/10!"
            disabled={!provider || !model || !key || connection === 'loading'}
            onClick={test}
          >
            {connection === 'loading' ? 'Testing…' : 'Test connection'} <PlugZap className='w-4 h-4' />
          </button>
          {connection === 'success' && (
            <p className="inline-success">
              <Check size={15} /> Connection successful
            </p>
          )}
          {connection === 'error' && <p className="inline-error bg-red-400/8! border p-2 rounded-xl"><CircleAlert size={15} className='mr-1' />{error}</p>}

          <div className="panel-divider" />

          <div className="panel-top">
            <span className="panel-kicker">02 / Add a crop photo</span>
            <span className="file-types">JPG, PNG or WebP · max 5 MB</span>
          </div>

          {(!connection || connection !== 'success') && (
            <small className="w-fit unlock-message flex! items-center gap-1 mb-2 border p-2 rounded-xl"><TriangleAlert className="size-3 text-amber-400" />Test the connection above to unlock analysis.</small>
          )}

          {/* <div
            className="dropzone"
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); selectFile(e.dataTransfer.files[0]) }}
            onClick={() => inputRef.current?.click()}
          > */}
          <div
            className={`dropzone ${connection !== 'success' ? 'opacity-70 pointer-events-none' : ''
              }`}
            onDragOver={e => {
              if (connection === 'success') e.preventDefault()
            }}
            onDrop={e => {
              if (connection !== 'success') return
              e.preventDefault()
              selectFile(e.dataTransfer.files[0])
            }}
            onClick={() => {
              if (connection === 'success') inputRef.current?.click()
            }}
            role='button'
          >
            {preview ? (
              <img src={preview} alt="Selected crop preview" />
            ) : (
              <>
                <span className="upload-icon"><ImagePlus size={22} /></span>
                <strong>Drop your image here</strong>
                <span>or click to browse</span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={e => selectFile(e.target.files?.[0])}
            />
          </div>
          {imageError && <p className="inline-error w-fit p-2 bg-red-400/8! border rounded-xl"><CircleAlert size={15} className='mr-1' />{imageError}</p>}

          {file && <div className="file-row"><FileText size={17} />
            <span>{file.name}<small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></span>

            <button aria-label="Remove image" onClick={() => { setFile(null); setPreview('') }}>
              <X size={16} />
            </button>
          </div>
          }

          <button
            className="btn-primary p-4 w-full mt-2"
            disabled={!file || !provider || !model || !key || connection !== 'success' || loading || retrySeconds > 0}
            onClick={analyze}
          >
            {loading ? status : retrySeconds ? `Try again in ${retrySeconds}s` : 'Analyze my crop'}
            {!loading && <ScanSquare className="size-5" />}
          </button>

        </section>

        <Results
          result={result}
          preview={preview}
          text={resultText}
          copied={copied}
          setCopied={setCopied}
        />
      </div >
    </main >
  )
}
