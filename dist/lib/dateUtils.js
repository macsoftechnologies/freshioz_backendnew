"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IST_TIMEZONE = void 0;
exports.formatDateIST = formatDateIST;
exports.formatTimeIST = formatTimeIST;
exports.formatDateTimeIST = formatDateTimeIST;
exports.parseDDMMYYYY = parseDDMMYYYY;
exports.getTodayIST = getTodayIST;
exports.getTomorrowIST = getTomorrowIST;
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
function parseDDMMYYYY(dateStr) {
    if (!dateStr)
        return null;
    const parts = dateStr.trim().split(/[\/\-]/);
    if (parts.length !== 3)
        return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const d = new Date(year, month, day, 6, 0, 0);
    return isNaN(d.getTime()) ? null : d;
}
function getTodayIST() {
    return formatDateIST(new Date());
}
function getTomorrowIST() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatDateIST(d);
}
//# sourceMappingURL=dateUtils.js.map