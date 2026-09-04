import { Copy, Download, FileText, RotateCcw, ScanLine } from 'lucide-react'
import { generatePdfReport } from '@/lib/generatePdfReport'

function ResultGroup({ title, children }: any) {
  return <div className="result-group">
    <h3>{title}</h3>
    {children}
  </div>
}

export function Results({
  result,
  preview,
  text,
  copied,
  setCopied
}: any) {
  const data = result?.result
  const notAnalyzed = data && (
    data.is_plant_image === false || data.is_safe === false
  )

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const download = async (kind: 'txt' | 'pdf') => {
    if (kind === 'txt') {
      const blob = new Blob(
        [text],
        { type: 'text/plain' }
      )

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'leaflens-report.txt'
      a.click()
      URL.revokeObjectURL(url)
    } else {
      await generatePdfReport(result.result, preview)
    }
  }

  return <section className="results-panel">
    <div className="panel-top">
      <span className="panel-kicker">03 / Your field notes</span>
      {result && <span className="result-provider">{result.provider} · {result.model}</span>}
    </div>

    {!result ? (
      <div className="empty-result">
        <div className="empty-mark">
          <ScanLine size={27} />
        </div>

        <h2>Your diagnosis<br /><em>will appear here.</em></h2>
        {/* <p>Complete the setup and upload a photo to see what your crop needs next.</p> */}
        <p>Connect a model, add one clear leaf photo and run the analysis. You'll get the crop, the likely disease, confidence, severity, symptoms, a treatment plan and prevention notes — with copy, TXT and PDF export.</p>
      </div>
    ) : notAnalyzed ? (
      <div className="not-analyzed"><span className="icon-box">
        <RotateCcw size={21} /></span><h2>Not analyzed</h2>
        <p>{data.rejection_reason || 'This image does not appear to be a safe plant image.'}</p>

        <button
          className="text-link"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >Upload a different image <span>↗</span></button>
      </div>
    ) : (
      <div className="result-content">
        {preview && <img className="result-image" src={preview} alt="Analyzed crop" />}

        <div className="result-heading">
          <div>
            <span className="eyebrow">Crop detected</span>
            <h2>{data.crop_detected || 'Unknown crop'}</h2>
          </div>
          <span className={`severity severity-${String(data.severity || 'unknown').toLowerCase()}`}>{data.severity || 'Unknown'}</span>
        </div>

        <p className="health-summary">{data.overall_health}</p>

        {data.diseases?.length > 0 && (
          <ResultGroup title="Diseases">
            <div className="result-cards">
              {data.diseases.map((d: any) => (
                <article className="result-card" key={d.name}>
                  <div>
                    <h3>{d.name}</h3>
                    <span className={`confidence confidence-${d.confidence}`}>{d.confidence || 'unknown'} confidence</span>
                  </div><p>{d.description}</p>
                </article>
              ))}
            </div>
          </ResultGroup>
        )}

        {data.treatments?.length > 0 && (
          <ResultGroup title="Treatment plan">
            <div className="result-cards">
              {data.treatments.map((t: any) => (
                <article className="result-card" key={t.treatment_name}>
                  <div>
                    <h3>{t.treatment_name}</h3>
                    <span className="treatment-meta">{t.type || 'general care'} · {t.urgency || 'as needed'}</span>
                  </div>
                  <p>{t.instructions}</p>
                </article>
              ))}
            </div>
          </ResultGroup>
        )}

        {data.additional_notes && <p className="additional-notes">{data.additional_notes}</p>}

        <div className="result-actions">
          <button onClick={copy}><Copy size={15} /> {copied ? 'Copied!' : 'Copy text'}</button>
          <button onClick={() => download('txt')}><Download size={15} /> .txt</button>
          <button onClick={() => download('pdf')}><FileText size={15} /> .pdf</button>
        </div>
      </div>
    )}
  </section>
}
