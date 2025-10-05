/**
 * Currency flags configuration
 * Centralized repository for currency flag emojis and display names
 * Used as fallback when BFF doesn't provide flag information
 */

export const currencyFlags = {
  'USD': { flag: '🇺🇸', name: 'Dolar amerykański' },
  'EUR': { flag: '🇪🇺', name: 'Euro' },
  'GBP': { flag: '🇬🇧', name: 'Funt brytyjski' },
  'CHF': { flag: '🇨🇭', name: 'Frank szwajcarski' },
  'JPY': { flag: '🇯🇵', name: 'Jen japoński' },
  'CAD': { flag: '🇨🇦', name: 'Dolar kanadyjski' },
  'AUD': { flag: '🇦🇺', name: 'Dolar australijski' },
  'CNY': { flag: '🇨🇳', name: 'Juan chiński' },
  'SEK': { flag: '🇸🇪', name: 'Korona szwedzka' },
  'NOK': { flag: '🇳🇴', name: 'Korona norweska' }
}

/**
 * Get flag for currency code
 * @param {string} code - Currency code (e.g., 'USD', 'EUR')
 * @returns {string} Flag emoji or default currency symbol
 */
export const getCurrencyFlag = (code) => {
  return currencyFlags[code]?.flag || '💱'
}

/**
 * Get display name for currency code
 * @param {string} code - Currency code (e.g., 'USD', 'EUR')
 * @returns {string} Currency display name or code itself
 */
export const getCurrencyName = (code) => {
  return currencyFlags[code]?.name || code
}