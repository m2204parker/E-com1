/**
 * INR price formatting used across the UI (matches Powerlook's "₹1,299").
 */
export function formatPrice(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

/** Percentage discount between compare-at and selling price. */
export function discountPercent(current: number, compareAt: number): number {
  if (compareAt <= current) return 0;
  return Math.round(((compareAt - current) / compareAt) * 100);
}
