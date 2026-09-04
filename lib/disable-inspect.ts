// Best-effort client-side deterrent for opening DevTools / viewing source.
// Note: this cannot truly prevent inspection — it only discourages casual users.

export function installInspectGuards() {
  if (typeof window === "undefined") return;

  // Disable right-click context menu
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Block common devtools / view-source shortcuts
  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    // F12
    if (key === "f12") {
      e.preventDefault();
      return;
    }

    // Ctrl+U / Cmd+U → view source
    if ((e.ctrlKey || e.metaKey) && key === "u") {
      e.preventDefault();
      return;
    }

    // Ctrl+S / Cmd+S → save page
    if ((e.ctrlKey || e.metaKey) && key === "s") {
      e.preventDefault();
      return;
    }

    // Ctrl+Shift+I / J / C  (and Cmd+Opt+I/J/C on macOS)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(key)) {
      e.preventDefault();
      return;
    }
    if (e.metaKey && e.altKey && ["i", "j", "c"].includes(key)) {
      e.preventDefault();
      return;
    }
  });
}
