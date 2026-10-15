// Date & Time Utility - Strict DD/MM/YYYY and Indian Standard Time (IST)
export const IST_TIMEZONE = 'Asia/Kolkata';

export function formatDateIST(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatTimeIST(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  const timeStr = new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);

  return `${timeStr} IST`;
}

export function formatDateTimeIST(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  return `${formatDateIST(d)}, ${formatTimeIST(d)}`;
}

// Convenient Aliases
export const toISTDateString = formatDateIST;
export const toISTTimeString = formatTimeIST;
export const toISTFullString = formatDateTimeIST;
