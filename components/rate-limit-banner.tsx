"use client"

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type RateLimitDetail = {
  retryAfter: number | null;
  resetAt: Date | null;
  limit: number | null;
  remaining: number | null;
};

function computeSeconds(d: RateLimitDetail): number {
  if (d.retryAfter != null) return Math.max(0, d.retryAfter);
  if (d.resetAt) return Math.max(0, Math.ceil((d.resetAt.getTime() - Date.now()) / 1000));
  return 0;
}

const RATE_LIMIT_TOAST_ID = "rate-limit";

function RateLimitToastContent({
  detail,
  toastId,
}: Readonly<{
  detail: RateLimitDetail;
  toastId: string | number;
}>) {
  const [seconds, setSeconds] = useState(() => computeSeconds(detail));

  useEffect(() => {
    setSeconds(computeSeconds(detail));
    const timer = window.setInterval(() => {
      setSeconds((s) => {
        if (detail.resetAt) {
          return Math.max(0, Math.ceil((detail.resetAt.getTime() - Date.now()) / 1000));
        }
        return Math.max(0, s - 1);
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [detail]);

  const ready = seconds <= 0;

  // once we flip to "ready", auto-close the toast after 10s
  useEffect(() => {
    if (!ready) return;
    const closeTimer = window.setTimeout(() => {
      toast.dismiss(toastId);
    }, 10_000);
    return () => window.clearTimeout(closeTimer);
  }, [ready, toastId]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        maxWidth: 360,
        padding: "12px 14px",
        borderRadius: 14,
        background: "var(--surface, rgba(255,255,255,0.95))",
        border: "1px solid var(--accent-solid, rgba(15,23,42,0.12))",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "var(--text-primary, #0f172a)",
      }}
    >
      <div style={{ flex: 1, fontSize: 14, lineHeight: 1.4 }}>
        {ready ? (
          <span>You can try again now</span>
        ) : (
          <span>
            Too many requests — please wait{" "}
            <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {seconds}s
            </span>
          </span>
        )}
      </div>

      <button
        onClick={() => toast.dismiss(toastId)}
        aria-label="Dismiss"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-secondary, #64748b)",
          cursor: "pointer",
          padding: 4,
          display: "flex",
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
/**
 * Mount this once (e.g. in your root layout, alongside <Toaster />).
 * It has no visual output itself — it just listens for the event
 * and pushes/updates a sonner toast.
 */
export function RateLimitBanner() {
  useEffect(() => {
    const onLimit = (e: Event) => {
      const d = (e as CustomEvent<RateLimitDetail>).detail;

      toast.custom((id) => <RateLimitToastContent detail={d} toastId={id} />, {
        id: RATE_LIMIT_TOAST_ID, // reusing the id replaces any existing rate-limit toast instead of stacking
        duration: Infinity,      // we dismiss it manually (X button) rather than let it time out
      });
    };

    window.addEventListener("api:rate-limited", onLimit as EventListener);
    return () => window.removeEventListener("api:rate-limited", onLimit as EventListener);
  }, []);

  return null;
}