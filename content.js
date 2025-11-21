// 1. MOCK LOCAL DATA: Fixed exchange rates relative to USD (Base 1.0)
const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,  // 1 USD = 0.92 EUR (approx)
  BRL: 5.00   // 1 USD = 5.00 BRL (approx)
};

// Currency Symbols and Formatting Rules
const CURRENCY_CONFIG = {
  USD: { symbol: '$', decimal: '.', separator: ',' },
  EUR: { symbol: '€', decimal: ',', separator: '.' }, // European format
  BRL: { symbol: 'R$', decimal: ',', separator: '.' } // Brazilian format
};

// Regex patterns to find prices in text
// Matches: $100, $100.00, 100 USD, €100, 100 €, R$ 1.000,00
const PRICE_REGEX = /((R\$|€|\$)\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s?(USD|EUR|BRL))/gi;

// US Federal minimum wage: $7.25/hour * 40 hours/week * 4.33 weeks/month = $1,256.67/month
const US_MONTHLY_MINIMUM_WAGE = 1256.67;

let userSalary = US_MONTHLY_MINIMUM_WAGE;
let userCurrency = 'USD';
let whitelist = [];

// Default whitelist sites for the extension
const DEFAULT_WHITELIST = [
  'google.com',
  'amazon.com',
  'amazon.co.uk',
  'amazon.de',
  'amazon.fr',
  'amazon.it',
  'amazon.es',
  'amazon.ca',
  'amazon.com.au',
  'amazon.co.jp',
  'ebay.com',
  'ebay.co.uk',
  'ebay.de',
  'walmart.com',
  'target.com',
  'bestbuy.com',
  'costco.com',
  'alibaba.com',
  'shopify.com',
  'etsy.com',
  'aliexpress.com'
];

// Helper function to normalize domain (remove www. prefix and convert to lowercase)
function normalizeDomain(domain) {
  return domain.replace(/^www\./, '').toLowerCase();
}

// Helper function to get normalized domain from URL
function getDomainFromUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return normalizeDomain(hostname);
  } catch (e) {
    // If URL parsing fails, try simple string manipulation
    const hostname = url.replace(/^https?:\/\//, '').split('/')[0];
    return normalizeDomain(hostname);
  }
}

// Helper function to check if current domain is in whitelist
function isWhitelisted(domain) {
  // Normalize domain for comparison
  const normalizedDomain = normalizeDomain(domain);
  
  // Check if domain matches exactly
  if (whitelist.includes(normalizedDomain)) {
    return true;
  }
  
  // Check if domain is a subdomain of a whitelisted domain
  // e.g., "www.amazon.com" matches "amazon.com" (after normalization, both become "amazon.com")
  // e.g., "shop.amazon.com" matches "amazon.com"
  for (const whitelistedDomain of whitelist) {
    const normalizedWhitelisted = normalizeDomain(whitelistedDomain);
    
    // Exact match
    if (normalizedDomain === normalizedWhitelisted) {
      return true;
    }
    
    // Check if current domain is a subdomain of whitelisted domain
    // e.g., "shop.amazon.com" ends with ".amazon.com"
    if (normalizedDomain.endsWith('.' + normalizedWhitelisted)) {
      return true;
    }
    
    // Check if whitelisted domain is a subdomain of current domain
    // e.g., "amazon.com" should match if whitelist has "shop.amazon.com" (though this is less common)
    if (normalizedWhitelisted.endsWith('.' + normalizedDomain)) {
      return true;
    }
  }
  
  return false;
}

// Main entry point
chrome.storage.local.get(['userSalary', 'userCurrency', 'whitelist'], (data) => {
  if (data.userSalary && data.userCurrency) {
    userSalary = parseFloat(data.userSalary);
    userCurrency = data.userCurrency;
  } else {
    // Set defaults if no saved settings
    userSalary = US_MONTHLY_MINIMUM_WAGE;
    userCurrency = 'USD';
  }
  
  // Load whitelist (normalize all domains by removing www. and converting to lowercase)
  if (data.whitelist && Array.isArray(data.whitelist) && data.whitelist.length > 0) {
    whitelist = data.whitelist.map(domain => normalizeDomain(domain));
  } else {
    // Use default whitelist if none is saved
    whitelist = DEFAULT_WHITELIST.map(domain => normalizeDomain(domain));
    // Save defaults to storage
    chrome.storage.local.set({ whitelist: DEFAULT_WHITELIST });
  }
  
  // Check if current domain is whitelisted before initializing
  const currentDomain = getDomainFromUrl(window.location.href);
  
  if (isWhitelisted(currentDomain)) {
    init();
  } else {
    // Domain is not whitelisted, do nothing
    console.log('TimeCost: Domain not whitelisted, skipping processing:', currentDomain);
  }
});

function init() {
  // Run immediately
  scanAndConvert(document.body);

  // Run whenever the page content changes (for dynamic sites like Amazon/infinite scroll)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          scanAndConvert(node);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function scanAndConvert(rootNode) {
  // TreeWalker is efficient for finding text nodes
  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    // Skip if already processed or inside script/style tags
    if (node.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)) continue;
    if (node.parentElement.getAttribute('data-timecost-processed')) continue;

    const text = node.nodeValue;
    
    // Check if text contains a price
    if (text && PRICE_REGEX.test(text)) {
      processNode(node);
    }
  }
}

function processNode(textNode) {
  const originalText = textNode.nodeValue;
  
  // We replace the text content by parsing matches
  const newText = originalText.replace(PRICE_REGEX, (match) => {
    try {
      // 1. Identify currency of the Price Found on Page
      let detectedCurrency = 'USD'; // Default
      if (match.includes('R$') || match.includes('BRL')) detectedCurrency = 'BRL';
      else if (match.includes('€') || match.includes('EUR')) detectedCurrency = 'EUR';
      
      // 2. Clean the string to get a raw number
      let cleanString = match.replace(/[^\d.,]/g, '').trim();
      
      // 3. Detect number format by pattern, not just currency
      // This is important because Google may show BRL prices in USD format
      // USD format: comma for thousands, dot for decimals (e.g., 2,789.07)
      // Brazilian/European format: dot for thousands, comma for decimals (e.g., 2.789,07)
      let isUSDFormat = false;
      
      // Check for USD format pattern: comma followed by 3 digits, then dot with 1-2 digits
      // Also check: dot with 1-2 digits at the end (decimal)
      const usdPattern = /,\d{3}\./; // e.g., ",789."
      const brlPattern = /\.\d{3},/; // e.g., ".789,"
      
      if (usdPattern.test(cleanString)) {
        // Definitely USD format (e.g., 2,789.07)
        isUSDFormat = true;
      } else if (brlPattern.test(cleanString)) {
        // Definitely Brazilian/European format (e.g., 2.789,07)
        isUSDFormat = false;
      } else if (cleanString.includes('.') && cleanString.includes(',')) {
        // Has both - determine by position
        const dotIndex = cleanString.lastIndexOf('.');
        const commaIndex = cleanString.lastIndexOf(',');
        // Last separator wins (usually the decimal separator comes last)
        isUSDFormat = dotIndex > commaIndex;
      } else if (cleanString.includes('.')) {
        // Only dot - check if it looks like decimal or thousands
        const parts = cleanString.split('.');
        const lastPart = parts[parts.length - 1];
        // If last part is 1-2 digits, it's likely a decimal (USD format)
        // If last part is 3 digits and there are multiple parts, it's likely thousands (BR/EU format)
        if (parts.length === 2 && lastPart.length <= 2) {
          isUSDFormat = true;
        } else if (parts.length > 2 || lastPart.length === 3) {
          isUSDFormat = false; // Likely thousands separators
        } else {
          // Default: assume USD format for single dot with short decimal
          isUSDFormat = (lastPart.length <= 2);
        }
      } else if (cleanString.includes(',')) {
        // Only comma - if it's followed by 3 digits, it's likely thousands (USD format)
        // If followed by 1-2 digits, it's likely decimal (BR/EU format)
        const parts = cleanString.split(',');
        const lastPart = parts[parts.length - 1];
        isUSDFormat = (lastPart.length === 3 && parts.length > 1);
      } else {
        // No separators - use currency default
        isUSDFormat = (detectedCurrency === 'USD');
      }
      
      // 4. Parse based on detected format
      let priceValue = 0;
      if (isUSDFormat) {
        // USD format: comma for thousands, dot for decimals
        // Examples: 1,000.50 | 1,000,000.99 | 1000.50 | 1,000
        if (cleanString.includes('.')) {
          // Has dot = decimal separator exists
          // Remove all commas (thousands separators)
          cleanString = cleanString.replace(/,/g, '');
        } else if (cleanString.includes(',')) {
          // Only commas, no dot = thousands separators
          // Remove all commas: 1,000 -> 1000
          cleanString = cleanString.replace(/,/g, '');
        }
      } else {
        // Brazilian/European format: dot for thousands, comma for decimals
        // Examples: 1.000,50 | 1.000.000,99 | 1000,50 | 1.000
        if (cleanString.includes(',')) {
          // Has comma = decimal separator exists
          // Remove all dots (thousands separators) and replace comma with dot
          cleanString = cleanString.replace(/\./g, '').replace(',', '.');
        } else if (cleanString.includes('.')) {
          // Only dots, no comma - determine if thousands or decimal
          const parts = cleanString.split('.');
          const lastPart = parts[parts.length - 1];
          
          if (parts.length > 2) {
            // Multiple dots = thousands separators: 1.000.000 -> 1000000
            cleanString = cleanString.replace(/\./g, '');
          } else if (lastPart.length === 3) {
            // 3 digits after dot = thousands: 1.000 -> 1000
            cleanString = cleanString.replace(/\./g, '');
          } else if (lastPart.length <= 2) {
            // 1-2 digits after dot = likely decimal (edge case, but treat as decimal)
            // Keep as is: 1.50 -> 1.50
          } else {
            // Default: remove dots (treat as thousands)
            cleanString = cleanString.replace(/\./g, '');
          }
        }
      }
      
      priceValue = parseFloat(cleanString);
      
      if (isNaN(priceValue) || priceValue === 0) return match;

      // 5. Normalize Price to USD (Base)
      const priceInUSD = priceValue / EXCHANGE_RATES[detectedCurrency];

      // 6. Normalize User Salary to USD (Base)
      // Assuming 22 working days per month, 8 hours per day
      const salaryInUSD = userSalary / EXCHANGE_RATES[userCurrency];
      const dailyWageInUSD = salaryInUSD / 22;

      // 7. Calculate Days
      const daysCost = priceInUSD / dailyWageInUSD;

      // Formatting the result
      let daysString = "";
      if (daysCost < 1) {
        // If less than 1 day, show hours and minutes (assuming 8h work day)
        const totalHours = daysCost * 8;
        const wholeHours = Math.floor(totalHours);
        const minutes = Math.round((totalHours % 1) * 60);
        
        if (wholeHours === 0) {
          // If less than 1 hour, show only minutes
          daysString = ` (${minutes}m)`;
        } else {
          // Show hours and minutes in 0h0m format
          const hoursStr = wholeHours.toString();
          const minutesStr = minutes.toString();
          daysString = ` (${hoursStr}h${minutesStr}m)`;
        }
      } else {
        // If 1 day or more, show days and hours in 0d0h format
        const wholeDays = Math.floor(daysCost);
        const remainingDays = daysCost % 1;
        const hours = Math.round(remainingDays * 8);
        const daysStr = wholeDays.toString();
        const hoursStr = hours.toString();
        daysString = ` (${daysStr}d${hoursStr}h)`;
      }

      return `${match} ${daysString}`;

    } catch (e) {
      console.error("TimeCost Error parsing:", match, e);
      return match; // Return original if error
    }
  });

  if (newText !== originalText) {
    textNode.nodeValue = newText;
    textNode.parentElement.setAttribute('data-timecost-processed', 'true');
  }
}

