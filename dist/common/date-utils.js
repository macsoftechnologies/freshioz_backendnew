"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toISTFullString = exports.toISTTimeString = exports.toISTDateString = exports.IST_TIMEZONE = void 0;
exports.formatDateIST = formatDateIST;
exports.formatTimeIST = formatTimeIST;
exports.formatDateTimeIST = formatDateTimeIST;
exports.IST_TIMEZONE = 'Asia/Kolkata';
function formatDateIST(dateInput = new Date()) {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime()))
        return '';
    return new Intl.DateTimeFormat('en-IN', {
        timeZone: exports.IST_TIMEZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(d);
}
function formatTimeIST(dateInput = new Date()) {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime()))
        return '';
    const timeStr = new Intl.DateTimeFormat('en-IN', {
        timeZone: exports.IST_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(d);
    return `${timeStr} IST`;
}
function formatDateTimeIST(dateInput = new Date()) {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime()))
        return '';
    return `${formatDateIST(d)}, ${formatTimeIST(d)}`;
}
exports.toISTDateString = formatDateIST;
exports.toISTTimeString = formatTimeIST;
exports.toISTFullString = formatDateTimeIST;
//# sourceMappingURL=date-utils.js.map