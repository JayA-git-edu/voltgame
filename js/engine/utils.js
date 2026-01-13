export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const lerp = (start, end, t) => start + (end - start) * t;

export const formatPercent = (value) => `${Math.round(value * 100)}%`;

export const now = () => performance.now();
