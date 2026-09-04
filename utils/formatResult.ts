export function formatResult(data: any) {
  if (!data) return '';
  const lines = [
    `CROP: ${data.crop_detected || 'Unknown'}`,
    `SEVERITY: ${data.severity || 'Unknown'}`,
    `HEALTH: ${data.overall_health || ''}`,
    '',

    'DISEASES',
    ...(data.diseases || []).map((d: any) => `• ${d.name} (${d.confidence || 'unknown'}): ${d.description || ''}`),
    '',

    'TREATMENTS',
    ...(data.treatments || []).map((t: any) => `• ${t.treatment_name} — ${t.treatment_type || ''}, ${t.urgency || ''}: ${t.instructions || ''}`),
    '',
    data.additional_notes || ''
  ];

  return lines.join('\n')
}