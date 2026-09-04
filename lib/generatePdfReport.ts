export async function generatePdfReport(data: any, preview: string | null) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // ---------- palette ----------
  const brand = { r: 34, g: 139, b: 76 };
  const dark = { r: 33, g: 37, b: 41 };
  const gray = { r: 108, g: 117, b: 125 };
  const lightBg = { r: 246, g: 248, b: 246 };
  const warnBg = { r: 255, g: 248, b: 230 };
  const warnText = { r: 146, g: 108, b: 20 };

  // ---------- helpers ----------
  const humanize = (s: string) =>
    (s || '').replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const setFill = (c: { r: number; g: number; b: number }) => pdf.setFillColor(c.r, c.g, c.b);
  const setText = (c: { r: number; g: number; b: number }) => pdf.setTextColor(c.r, c.g, c.b);

  const severityColor = (sev: string) => {
    switch (sev) {
      case 'healthy': return { r: 56, g: 142, b: 60 };
      case 'mild': return { r: 124, g: 179, b: 66 };
      case 'moderate': return { r: 217, g: 138, b: 22 };
      case 'severe': return { r: 214, g: 84, b: 40 };
      case 'critical': return { r: 197, g: 48, b: 48 };
      default: return gray;
    }
  };

  const confidenceColor = (c: string) => {
    switch (c) {
      case 'high': return { r: 34, g: 139, b: 76 };
      case 'medium': return { r: 217, g: 138, b: 22 };
      case 'low': return { r: 158, g: 158, b: 158 };
      default: return gray;
    }
  };

  const urgencyColor = (u: string) => {
    switch (u) {
      case 'immediate': return { r: 197, g: 48, b: 48 };
      case 'within_week': return { r: 217, g: 138, b: 22 };
      case 'seasonal': return { r: 56, g: 142, b: 60 };
      default: return gray;
    }
  };

  const treatmentTypeColor = (t: string) => {
    switch (t) {
      case 'organic': return { r: 56, g: 142, b: 60 };
      case 'chemical': return { r: 156, g: 39, b: 176 };
      case 'preventive': return { r: 25, g: 118, b: 210 };
      case 'general_care': return { r: 96, g: 125, b: 139 };
      default: return gray;
    }
  };

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - 20) {
      pdf.addPage();
      y = margin;
    }
  };

  const badge = (label: string, x: number, yPos: number, color: { r: number; g: number; b: number }) => {
    pdf.setFontSize(8);
    const w = pdf.getTextWidth(label) + 8;
    setFill(color);
    pdf.roundedRect(x, yPos - 4, w, 5.5, 1.5, 1.5, 'F');
    setText({ r: 255, g: 255, b: 255 });
    pdf.text(label, x + 4, yPos);
    return w;
  };

  const sectionHeader = (title: string) => {
    checkPageBreak(16);
    setFill(brand);
    pdf.rect(margin, y, 3, 6, 'F');
    setText(dark);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(title, margin + 6, y + 5);
    y += 12;
  };

  // ================= HEADER =================
  pdf.setFillColor(brand.r, brand.g, brand.b);
  pdf.rect(0, 0, pageWidth, 32, 'F');

  setText({ r: 255, g: 255, b: 255 });
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('LeafLens Report', margin, 15);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(
    `Generated ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`,
    margin,
    23
  );

  y = 40;

  // ---------- AI guidance disclaimer ----------
  const disclaimerText =
    'This report is AI-generated guidance. Please confirm findings and treatment plans with a local agronomist before acting.';
  const disclaimerLines = pdf.splitTextToSize(disclaimerText, contentWidth - 16);
  const disclaimerH = disclaimerLines.length * 4.2 + 8;

  setFill(warnBg);
  pdf.roundedRect(margin, y, contentWidth, disclaimerH, 2, 2, 'F');
  setText(warnText);
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8.5);
  pdf.text(disclaimerLines, margin + 8, y + 5.5);

  y += disclaimerH + 10;

  // ================= IMAGE (full width) =================
  if (preview) {
    const imgH = 65;
    pdf.setDrawColor(220, 220, 220);
    pdf.roundedRect(margin, y, contentWidth, imgH, 2, 2, 'S');
    pdf.addImage(preview, 'JPEG', margin + 1, y + 1, contentWidth - 2, imgH - 2);
    y += imgH + 10;
  }

  // ================= SUMMARY CARD (full width) =================
  const textW = contentWidth - 10;

  pdf.setFontSize(12);
  const cropLines = pdf.splitTextToSize(data.crop_detected || 'Unknown crop', textW);
  const healthLabel = 'Overall health:';
  const healthLines = pdf.splitTextToSize(data.overall_health || 'N/A', textW);

  const cardPad = 8;
  const contentH =
    cropLines.length * 6 +
    9 +
    5 +
    healthLines.length * 4.5 +
    cardPad;

  const cardTop = y;
  setFill(lightBg);
  pdf.roundedRect(margin, cardTop, contentWidth, contentH, 2, 2, 'F');

  let infoY = cardTop + 9;
  setText(dark);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(cropLines, margin + 5, infoY);
  infoY += cropLines.length * 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  setText(gray);
  pdf.text('Severity:', margin + 5, infoY);
  badge(humanize(data.severity || 'unknown'), margin + 22, infoY, severityColor(data.severity));
  infoY += 9;

  setText(gray);
  pdf.setFontSize(9);
  pdf.text(healthLabel, margin + 5, infoY);
  infoY += 5;

  setText(dark);
  pdf.text(healthLines, margin + 5, infoY);

  y = cardTop + contentH + 14;

  // ================= DISEASES =================
  if ((data.diseases || []).length) {
    sectionHeader('Diseases Detected');

    data.diseases.forEach((d: any) => {
      const nameLines = pdf.splitTextToSize(d.name || 'Unknown disease', contentWidth - 8);
      const descLines = d.description ? pdf.splitTextToSize(d.description, contentWidth - 8) : [];
      const blockH = nameLines.length * 5 + 7 + descLines.length * 4.5 + 6;

      checkPageBreak(blockH);

      setFill(confidenceColor(d.confidence));
      pdf.circle(margin + 1.5, y + 1.5, 1.3, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      setText(dark);
      pdf.text(nameLines, margin + 6, y + 2.5);
      y += nameLines.length * 5 + 1.5;

      badge(`${humanize(d.confidence)} confidence`, margin + 6, y + 1.5, confidenceColor(d.confidence));
      y += 7;

      if (descLines.length) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        setText({ r: 60, g: 60, b: 60 });
        pdf.text(descLines, margin + 6, y + 1.5);
        y += descLines.length * 4.5;
      }
      y += 6;
    });
  }

  // ================= TREATMENTS =================
  if ((data.treatments || []).length) {
    sectionHeader('Recommended Treatments');

    data.treatments.forEach((t: any) => {
      const nameLines = pdf.splitTextToSize(t.treatment_name || 'Treatment', contentWidth - 8);
      const instrLines = t.instructions ? pdf.splitTextToSize(t.instructions, contentWidth - 8) : [];
      const blockH = nameLines.length * 5 + 7 + instrLines.length * 4.5 + 6;

      checkPageBreak(blockH);

      setFill(treatmentTypeColor(t.treatment_type));
      pdf.circle(margin + 1.5, y + 1.5, 1.3, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      setText(dark);
      pdf.text(nameLines, margin + 6, y + 2.5);
      y += nameLines.length * 5 + 1.5;

      let bx = margin + 6;
      bx += badge(humanize(t.treatment_type), bx, y + 1.5, treatmentTypeColor(t.treatment_type)) + 3;
      badge(humanize(t.urgency), bx, y + 1.5, urgencyColor(t.urgency));
      y += 7;

      if (instrLines.length) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        setText({ r: 60, g: 60, b: 60 });
        pdf.text(instrLines, margin + 6, y + 1.5);
        y += instrLines.length * 4.5;
      }
      y += 6;
    });
  }

  // ================= ADDITIONAL NOTES =================
  if (data.additional_notes) {
    // pdf.addPage();
    // y = margin;

    sectionHeader('Additional Notes');
    const noteLines = pdf.splitTextToSize(data.additional_notes, contentWidth - 8);
    checkPageBreak(noteLines.length * 4.5 + 10);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    setText({ r: 60, g: 60, b: 60 });
    pdf.text(noteLines, margin, y + 2);
    y += noteLines.length * 4.5 + 8;
  }

  // ================= FOOTER (every page) =================
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(230, 230, 230);
    pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    setText(gray);
    pdf.text('LeafLens', margin, pageHeight - 8);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  pdf.save('leaflens-report.pdf');
}