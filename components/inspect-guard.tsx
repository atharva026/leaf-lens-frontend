"use client";

import { useEffect } from "react";
import { installInspectGuards } from "@/lib/disable-inspect";

export default function InspectGuard() {
  useEffect(() => {
    const cleanup = installInspectGuards();

    return cleanup;
  }, []);

  return null;
}