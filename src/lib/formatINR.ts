/**
 * Formats a number to Indian Rupee currency format (₹) with zero decimals.
 * Uses standard Intl.NumberFormat with 'en-IN' locale.
 *
 * Examples:
 * formatINR(1500)   => "₹1,500"
 * formatINR(125000) => "₹1,25,000"
 * formatINR(0)      => "₹0"
 *
 * @param amount - The numerical amount in INR
 * @returns Formatted currency string
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Compact Indian currency formatting for high-level metric cards.
 * Examples:
 * formatCompactINR(150000)   => "₹1.5 Lakh"
 * formatCompactINR(12000000) => "₹1.2 Cr"
 */
export function formatCompactINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const num = Math.round(amount);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return formatINR(num);
}
