document.addEventListener('DOMContentLoaded', () => {
  const salaryInput = document.getElementById('salary');
  const currencySelect = document.getElementById('currency');
  const currencyDisplay = document.getElementById('currencyDisplay');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  const API_KEY = 'ea88a3a0b96922f3654545e1';
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

  // Comprehensive currency info mapping (flags, symbols, formatting, country names)
  const currencyInfo = {
    'USD': { flag: '🇺🇸', symbol: '$', country: 'United States', locale: 'en-US', decimal: '.', separator: ',' },
    'EUR': { flag: '🇪🇺', symbol: '€', country: 'Eurozone', locale: 'de-DE', decimal: ',', separator: '.' },
    'BRL': { flag: '🇧🇷', symbol: 'R$', country: 'Brazil', locale: 'pt-BR', decimal: ',', separator: '.' },
    'GBP': { flag: '🇬🇧', symbol: '£', country: 'United Kingdom', locale: 'en-GB', decimal: '.', separator: ',' },
    'JPY': { flag: '🇯🇵', symbol: '¥', country: 'Japan', locale: 'ja-JP', decimal: '.', separator: ',' },
    'AUD': { flag: '🇦🇺', symbol: 'A$', country: 'Australia', locale: 'en-AU', decimal: '.', separator: ',' },
    'CAD': { flag: '🇨🇦', symbol: 'C$', country: 'Canada', locale: 'en-CA', decimal: '.', separator: ',' },
    'CHF': { flag: '🇨🇭', symbol: 'CHF', country: 'Switzerland', locale: 'de-CH', decimal: '.', separator: "'" },
    'CNY': { flag: '🇨🇳', symbol: '¥', country: 'China', locale: 'zh-CN', decimal: '.', separator: ',' },
    'INR': { flag: '🇮🇳', symbol: '₹', country: 'India', locale: 'en-IN', decimal: '.', separator: ',' },
    'MXN': { flag: '🇲🇽', symbol: '$', country: 'Mexico', locale: 'es-MX', decimal: '.', separator: ',' },
    'SGD': { flag: '🇸🇬', symbol: 'S$', country: 'Singapore', locale: 'en-SG', decimal: '.', separator: ',' },
    'HKD': { flag: '🇭🇰', symbol: 'HK$', country: 'Hong Kong', locale: 'en-HK', decimal: '.', separator: ',' },
    'NZD': { flag: '🇳🇿', symbol: 'NZ$', country: 'New Zealand', locale: 'en-NZ', decimal: '.', separator: ',' },
    'SEK': { flag: '🇸🇪', symbol: 'kr', country: 'Sweden', locale: 'sv-SE', decimal: ',', separator: ' ' },
    'NOK': { flag: '🇳🇴', symbol: 'kr', country: 'Norway', locale: 'nb-NO', decimal: ',', separator: ' ' },
    'DKK': { flag: '🇩🇰', symbol: 'kr', country: 'Denmark', locale: 'da-DK', decimal: ',', separator: '.' },
    'PLN': { flag: '🇵🇱', symbol: 'zł', country: 'Poland', locale: 'pl-PL', decimal: ',', separator: ' ' },
    'RUB': { flag: '🇷🇺', symbol: '₽', country: 'Russia', locale: 'ru-RU', decimal: ',', separator: ' ' },
    'ZAR': { flag: '🇿🇦', symbol: 'R', country: 'South Africa', locale: 'en-ZA', decimal: '.', separator: ',' },
    'KRW': { flag: '🇰🇷', symbol: '₩', country: 'South Korea', locale: 'ko-KR', decimal: '.', separator: ',' },
    'TRY': { flag: '🇹🇷', symbol: '₺', country: 'Turkey', locale: 'tr-TR', decimal: ',', separator: '.' },
    'THB': { flag: '🇹🇭', symbol: '฿', country: 'Thailand', locale: 'th-TH', decimal: '.', separator: ',' },
    'IDR': { flag: '🇮🇩', symbol: 'Rp', country: 'Indonesia', locale: 'id-ID', decimal: ',', separator: '.' },
    'MYR': { flag: '🇲🇾', symbol: 'RM', country: 'Malaysia', locale: 'ms-MY', decimal: '.', separator: ',' },
    'PHP': { flag: '🇵🇭', symbol: '₱', country: 'Philippines', locale: 'en-PH', decimal: '.', separator: ',' },
    'VND': { flag: '🇻🇳', symbol: '₫', country: 'Vietnam', locale: 'vi-VN', decimal: ',', separator: '.' },
    'ARS': { flag: '🇦🇷', symbol: '$', country: 'Argentina', locale: 'es-AR', decimal: ',', separator: '.' },
    'CLP': { flag: '🇨🇱', symbol: '$', country: 'Chile', locale: 'es-CL', decimal: ',', separator: '.' },
    'COP': { flag: '🇨🇴', symbol: '$', country: 'Colombia', locale: 'es-CO', decimal: ',', separator: '.' },
    'PEN': { flag: '🇵🇪', symbol: 'S/', country: 'Peru', locale: 'es-PE', decimal: '.', separator: ',' },
    'EGP': { flag: '🇪🇬', symbol: 'E£', country: 'Egypt', locale: 'ar-EG', decimal: '.', separator: ',' },
    'ILS': { flag: '🇮🇱', symbol: '₪', country: 'Israel', locale: 'he-IL', decimal: '.', separator: ',' },
    'AED': { flag: '🇦🇪', symbol: 'د.إ', country: 'United Arab Emirates', locale: 'ar-AE', decimal: '.', separator: ',' },
    'SAR': { flag: '🇸🇦', symbol: '﷼', country: 'Saudi Arabia', locale: 'ar-SA', decimal: '.', separator: ',' },
    'BSD': { flag: '🇧🇸', symbol: '$', country: 'Bahamas', locale: 'en-BS', decimal: '.', separator: ',' },
    'BTN': { flag: '🇧🇹', symbol: 'Nu.', country: 'Bhutan', locale: 'en-BT', decimal: '.', separator: ',' },
    'BWP': { flag: '🇧🇼', symbol: 'P', country: 'Botswana', locale: 'en-BW', decimal: '.', separator: ',' },
    'BYN': { flag: '🇧🇾', symbol: 'Br', country: 'Belarus', locale: 'ru-BY', decimal: ',', separator: ' ' },
    'BGN': { flag: '🇧🇬', symbol: 'лв', country: 'Bulgaria', locale: 'bg-BG', decimal: ',', separator: ' ' },
    'BHD': { flag: '🇧🇭', symbol: 'د.ب', country: 'Bahrain', locale: 'ar-BH', decimal: '.', separator: ',' },
    'BBD': { flag: '🇧🇧', symbol: '$', country: 'Barbados', locale: 'en-BB', decimal: '.', separator: ',' },
    'BZD': { flag: '🇧🇿', symbol: '$', country: 'Belize', locale: 'en-BZ', decimal: '.', separator: ',' },
    'BOB': { flag: '🇧🇴', symbol: 'Bs.', country: 'Bolivia', locale: 'es-BO', decimal: ',', separator: '.' },
    'BAM': { flag: '🇧🇦', symbol: 'КМ', country: 'Bosnia and Herzegovina', locale: 'bs-BA', decimal: ',', separator: '.' },
    'BND': { flag: '🇧🇳', symbol: '$', country: 'Brunei', locale: 'ms-BN', decimal: '.', separator: ',' },
    'XOF': { flag: '🌍', symbol: 'CFA', country: 'West African CFA', locale: 'fr-FR', decimal: ',', separator: ' ' },
    'XAF': { flag: '🌍', symbol: 'CFA', country: 'Central African CFA', locale: 'fr-FR', decimal: ',', separator: ' ' },
    'XPF': { flag: '🌍', symbol: '₣', country: 'CFP Franc', locale: 'fr-FR', decimal: ',', separator: ' ' },
    'KHR': { flag: '🇰🇭', symbol: '៛', country: 'Cambodia', locale: 'km-KH', decimal: '.', separator: ',' },
    'CVE': { flag: '🇨🇻', symbol: '$', country: 'Cape Verde', locale: 'pt-CV', decimal: ',', separator: ' ' },
    'KYD': { flag: '🇰🇾', symbol: '$', country: 'Cayman Islands', locale: 'en-KY', decimal: '.', separator: ',' },
    'CRC': { flag: '🇨🇷', symbol: '₡', country: 'Costa Rica', locale: 'es-CR', decimal: ',', separator: '.' },
    'CUP': { flag: '🇨🇺', symbol: '$', country: 'Cuba', locale: 'es-CU', decimal: '.', separator: ',' },
    'CZK': { flag: '🇨🇿', symbol: 'Kč', country: 'Czech Republic', locale: 'cs-CZ', decimal: ',', separator: ' ' },
    'DJF': { flag: '🇩🇯', symbol: 'Fr', country: 'Djibouti', locale: 'fr-DJ', decimal: '.', separator: ',' },
    'DOP': { flag: '🇩🇴', symbol: '$', country: 'Dominican Republic', locale: 'es-DO', decimal: '.', separator: ',' },
    'XCD': { flag: '🌍', symbol: '$', country: 'East Caribbean', locale: 'en-AG', decimal: '.', separator: ',' },
    'ERN': { flag: '🇪🇷', symbol: 'Nfk', country: 'Eritrea', locale: 'en-ER', decimal: '.', separator: ',' },
    'ETB': { flag: '🇪🇹', symbol: 'Br', country: 'Ethiopia', locale: 'am-ET', decimal: '.', separator: ',' },
    'FJD': { flag: '🇫🇯', symbol: '$', country: 'Fiji', locale: 'en-FJ', decimal: '.', separator: ',' },
    'GMD': { flag: '🇬🇲', symbol: 'D', country: 'Gambia', locale: 'en-GM', decimal: '.', separator: ',' },
    'GEL': { flag: '🇬🇪', symbol: '₾', country: 'Georgia', locale: 'ka-GE', decimal: ',', separator: ' ' },
    'GHS': { flag: '🇬🇭', symbol: '₵', country: 'Ghana', locale: 'en-GH', decimal: '.', separator: ',' },
    'GTQ': { flag: '🇬🇹', symbol: 'Q', country: 'Guatemala', locale: 'es-GT', decimal: ',', separator: '.' },
    'GNF': { flag: '🇬🇳', symbol: 'Fr', country: 'Guinea', locale: 'fr-GN', decimal: ',', separator: ' ' },
    'GYD': { flag: '🇬🇾', symbol: '$', country: 'Guyana', locale: 'en-GY', decimal: '.', separator: ',' },
    'HTG': { flag: '🇭🇹', symbol: 'G', country: 'Haiti', locale: 'fr-HT', decimal: ',', separator: ' ' },
    'HNL': { flag: '🇭🇳', symbol: 'L', country: 'Honduras', locale: 'es-HN', decimal: ',', separator: '.' },
    'ISK': { flag: '🇮🇸', symbol: 'kr', country: 'Iceland', locale: 'is-IS', decimal: ',', separator: '.' },
    'IQD': { flag: '🇮🇶', symbol: 'ع.د', country: 'Iraq', locale: 'ar-IQ', decimal: '.', separator: ',' },
    'JMD': { flag: '🇯🇲', symbol: '$', country: 'Jamaica', locale: 'en-JM', decimal: '.', separator: ',' },
    'JOD': { flag: '🇯🇴', symbol: 'د.ا', country: 'Jordan', locale: 'ar-JO', decimal: '.', separator: ',' },
    'KZT': { flag: '🇰🇿', symbol: '₸', country: 'Kazakhstan', locale: 'kk-KZ', decimal: ',', separator: ' ' },
    'KES': { flag: '🇰🇪', symbol: 'Sh', country: 'Kenya', locale: 'en-KE', decimal: '.', separator: ',' },
    'KWD': { flag: '🇰🇼', symbol: 'د.ك', country: 'Kuwait', locale: 'ar-KW', decimal: '.', separator: ',' },
    'KGS': { flag: '🇰🇬', symbol: 'с', country: 'Kyrgyzstan', locale: 'ky-KG', decimal: ',', separator: ' ' },
    'LAK': { flag: '🇱🇦', symbol: '₭', country: 'Laos', locale: 'lo-LA', decimal: ',', separator: '.' },
    'LBP': { flag: '🇱🇧', symbol: 'ل.ل', country: 'Lebanon', locale: 'ar-LB', decimal: '.', separator: ',' },
    'LSL': { flag: '🇱🇸', symbol: 'L', country: 'Lesotho', locale: 'en-LS', decimal: '.', separator: ',' },
    'LRD': { flag: '🇱🇷', symbol: '$', country: 'Liberia', locale: 'en-LR', decimal: '.', separator: ',' },
    'LYD': { flag: '🇱🇾', symbol: 'ل.د', country: 'Libya', locale: 'ar-LY', decimal: '.', separator: ',' },
    'MOP': { flag: '🇲🇴', symbol: 'P', country: 'Macau', locale: 'zh-MO', decimal: '.', separator: ',' },
    'MKD': { flag: '🇲🇰', symbol: 'ден', country: 'North Macedonia', locale: 'mk-MK', decimal: ',', separator: '.' },
    'MGA': { flag: '🇲🇬', symbol: 'Ar', country: 'Madagascar', locale: 'mg-MG', decimal: ',', separator: ' ' },
    'MWK': { flag: '🇲🇼', symbol: 'MK', country: 'Malawi', locale: 'en-MW', decimal: '.', separator: ',' },
    'MVR': { flag: '🇲🇻', symbol: 'Rf', country: 'Maldives', locale: 'dv-MV', decimal: '.', separator: ',' },
    'MUR': { flag: '🇲🇺', symbol: '₨', country: 'Mauritius', locale: 'en-MU', decimal: '.', separator: ',' },
    'MDL': { flag: '🇲🇩', symbol: 'L', country: 'Moldova', locale: 'ro-MD', decimal: ',', separator: ' ' },
    'MNT': { flag: '🇲🇳', symbol: '₮', country: 'Mongolia', locale: 'mn-MN', decimal: ',', separator: ' ' },
    'MAD': { flag: '🇲🇦', symbol: 'د.م.', country: 'Morocco', locale: 'ar-MA', decimal: ',', separator: '.' },
    'MZN': { flag: '🇲🇿', symbol: 'MT', country: 'Mozambique', locale: 'pt-MZ', decimal: ',', separator: ' ' },
    'MMK': { flag: '🇲🇲', symbol: 'K', country: 'Myanmar', locale: 'my-MM', decimal: '.', separator: ',' },
    'NAD': { flag: '🇳🇦', symbol: '$', country: 'Namibia', locale: 'en-NA', decimal: '.', separator: ',' },
    'NPR': { flag: '🇳🇵', symbol: '₨', country: 'Nepal', locale: 'ne-NP', decimal: '.', separator: ',' },
    'NIO': { flag: '🇳🇮', symbol: 'C$', country: 'Nicaragua', locale: 'es-NI', decimal: ',', separator: '.' },
    'NGN': { flag: '🇳🇬', symbol: '₦', country: 'Nigeria', locale: 'en-NG', decimal: '.', separator: ',' },
    'OMR': { flag: '🇴🇲', symbol: 'ر.ع.', country: 'Oman', locale: 'ar-OM', decimal: ',', separator: '.' },
    'PKR': { flag: '🇵🇰', symbol: '₨', country: 'Pakistan', locale: 'ur-PK', decimal: '.', separator: ',' },
    'PGK': { flag: '🇵🇬', symbol: 'K', country: 'Papua New Guinea', locale: 'en-PG', decimal: '.', separator: ',' },
    'PYG': { flag: '🇵🇾', symbol: '₲', country: 'Paraguay', locale: 'es-PY', decimal: ',', separator: '.' },
    'QAR': { flag: '🇶🇦', symbol: 'ر.ق', country: 'Qatar', locale: 'ar-QA', decimal: '.', separator: ',' },
    'RON': { flag: '🇷🇴', symbol: 'lei', country: 'Romania', locale: 'ro-RO', decimal: ',', separator: '.' },
    'RWF': { flag: '🇷🇼', symbol: 'Fr', country: 'Rwanda', locale: 'rw-RW', decimal: ',', separator: ' ' },
    'WST': { flag: '🇼🇸', symbol: 'T', country: 'Samoa', locale: 'en-WS', decimal: '.', separator: ',' },
    'STN': { flag: '🇸🇹', symbol: 'Db', country: 'São Tomé and Príncipe', locale: 'pt-ST', decimal: ',', separator: ' ' },
    'RSD': { flag: '🇷🇸', symbol: 'дин', country: 'Serbia', locale: 'sr-RS', decimal: ',', separator: '.' },
    'SCR': { flag: '🇸🇨', symbol: '₨', country: 'Seychelles', locale: 'en-SC', decimal: '.', separator: ',' },
    'SLL': { flag: '🇸🇱', symbol: 'Le', country: 'Sierra Leone', locale: 'en-SL', decimal: '.', separator: ',' },
    'SBD': { flag: '🇸🇧', symbol: '$', country: 'Solomon Islands', locale: 'en-SB', decimal: '.', separator: ',' },
    'SOS': { flag: '🇸🇴', symbol: 'Sh', country: 'Somalia', locale: 'so-SO', decimal: '.', separator: ',' },
    'LKR': { flag: '🇱🇰', symbol: '₨', country: 'Sri Lanka', locale: 'si-LK', decimal: '.', separator: ',' },
    'SDG': { flag: '🇸🇩', symbol: 'ج.س.', country: 'Sudan', locale: 'ar-SD', decimal: '.', separator: ',' },
    'SRD': { flag: '🇸🇷', symbol: '$', country: 'Suriname', locale: 'nl-SR', decimal: ',', separator: '.' },
    'SZL': { flag: '🇸🇿', symbol: 'L', country: 'Eswatini', locale: 'en-SZ', decimal: '.', separator: ',' },
    'TJS': { flag: '🇹🇯', symbol: 'ЅМ', country: 'Tajikistan', locale: 'tg-TJ', decimal: ',', separator: ' ' },
    'TZS': { flag: '🇹🇿', symbol: 'Sh', country: 'Tanzania', locale: 'sw-TZ', decimal: '.', separator: ',' },
    'TOP': { flag: '🇹🇴', symbol: 'T$', country: 'Tonga', locale: 'to-TO', decimal: '.', separator: ',' },
    'TTD': { flag: '🇹🇹', symbol: '$', country: 'Trinidad and Tobago', locale: 'en-TT', decimal: '.', separator: ',' },
    'TND': { flag: '🇹🇳', symbol: 'د.ت', country: 'Tunisia', locale: 'ar-TN', decimal: ',', separator: '.' },
    'UGX': { flag: '🇺🇬', symbol: 'Sh', country: 'Uganda', locale: 'en-UG', decimal: '.', separator: ',' },
    'UAH': { flag: '🇺🇦', symbol: '₴', country: 'Ukraine', locale: 'uk-UA', decimal: ',', separator: ' ' },
    'UYU': { flag: '🇺🇾', symbol: '$', country: 'Uruguay', locale: 'es-UY', decimal: ',', separator: '.' },
    'UZS': { flag: '🇺🇿', symbol: 'so\'m', country: 'Uzbekistan', locale: 'uz-UZ', decimal: ',', separator: ' ' },
    'VUV': { flag: '🇻🇺', symbol: 'Vt', country: 'Vanuatu', locale: 'en-VU', decimal: '.', separator: ',' },
    'YER': { flag: '🇾🇪', symbol: '﷼', country: 'Yemen', locale: 'ar-YE', decimal: '.', separator: ',' },
    'ZMW': { flag: '🇿🇲', symbol: 'ZK', country: 'Zambia', locale: 'en-ZM', decimal: '.', separator: ',' },
    'ZWL': { flag: '🇿🇼', symbol: '$', country: 'Zimbabwe', locale: 'en-ZW', decimal: '.', separator: ',' },
  };

  // Currency display mapping - will be populated from API
  let currencyMap = {};

  // Fetch currencies from API and populate dropdown
  async function fetchCurrencies() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (data.result === 'success' && data.conversion_rates) {
        // Clear existing options except the first one
        currencySelect.innerHTML = '<option value="" disabled selected>Choose a currency</option>';
        
        // Get all currency codes from API response
        const currencies = Object.keys(data.conversion_rates).sort();
        
        // Populate dropdown and build currency map (only currencies with country info)
        currencies.forEach(code => {
          // Only include currencies that have country info in our mapping
          if (!currencyInfo[code] || !currencyInfo[code].country) {
            return; // Skip currencies without country information
          }
          
          const info = currencyInfo[code];
          
          const option = document.createElement('option');
          option.value = code;
          option.textContent = `${info.flag} ${info.country} | ${code} | ${info.symbol}`;
          currencySelect.appendChild(option);
          
          // Build currency map for display
          currencyMap[code] = `${info.flag} ${code} (${info.symbol})`;
        });
        
        // Load saved settings after currencies are loaded
        loadSavedSettings();
      } else {
        console.error('Failed to fetch currencies:', data);
        // Fallback to default currencies
        setupDefaultCurrencies();
      }
    } catch (error) {
      console.error('Error fetching currencies:', error);
      // Fallback to default currencies
      setupDefaultCurrencies();
    }
  }

  // Fallback to default currencies if API fails
  function setupDefaultCurrencies() {
    const defaults = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'AUD', 'CAD'];
    currencySelect.innerHTML = '<option value="" disabled selected>Choose a currency</option>';
    
    defaults.forEach(code => {
      // Only include currencies that have country info in our mapping
      if (!currencyInfo[code] || !currencyInfo[code].country) {
        return; // Skip currencies without country information
      }
      
      const info = currencyInfo[code];
      const option = document.createElement('option');
      option.value = code;
      option.textContent = `${info.flag} ${info.country} | ${code} | ${info.symbol}`;
      currencySelect.appendChild(option);
      currencyMap[code] = `${info.flag} ${code} (${info.symbol})`;
    });
    
    loadSavedSettings();
  }

  // Get currency info for a code
  function getCurrencyInfo(code) {
    return currencyInfo[code] || { 
      flag: '🌐', 
      symbol: code, 
      country: code,
      locale: 'en-US', 
      decimal: '.', 
      separator: ',' 
    };
  }

  // Format number with thousands separator based on currency
  function formatNumber(value, currency) {
    if (!value) return '';
    const num = parseFloat(value.toString().replace(/[^\d.,]/g, '').replace(/,/g, '').replace(/\./g, ''));
    if (isNaN(num)) return '';
    
    const info = getCurrencyInfo(currency);
    try {
      return num.toLocaleString(info.locale, { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      });
    } catch (e) {
      // Fallback formatting
      if (info.decimal === ',' && info.separator === '.') {
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
    }
  }

  // Parse formatted number back to numeric value
  function parseFormattedNumber(value, currency) {
    if (!value) return 0;
    let cleanValue = value.toString().replace(/[^\d.,]/g, '');
    
    const info = getCurrencyInfo(currency);
    
    // Handle different decimal/separator patterns
    if (info.decimal === ',' && info.separator === '.') {
      // Remove dots (thousands) and replace comma with dot (decimal)
      cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
    } else if (info.separator === ' ') {
      // Space separator (e.g., SEK, NOK)
      cleanValue = cleanValue.replace(/\s/g, '').replace(',', '.');
    } else {
      // Standard: remove commas (thousands)
      cleanValue = cleanValue.replace(/,/g, '');
    }
    
    return parseFloat(cleanValue) || 0;
  }

  // Update currency display (show only flag inside input)
  function updateCurrencyDisplay() {
    const selectedCurrency = currencySelect.value;
    if (selectedCurrency) {
      const info = getCurrencyInfo(selectedCurrency);
      currencyDisplay.textContent = info.flag;
    } else {
      currencyDisplay.textContent = '-';
    }
  }

  // Update salary input formatting
  function updateSalaryDisplay() {
    const value = salaryInput.value;
    const currency = currencySelect.value;
    if (value && currency) {
      const formatted = formatNumber(value, currency);
      if (formatted !== value) {
        const cursorPos = salaryInput.selectionStart;
        salaryInput.value = formatted;
        // Try to maintain cursor position
        setTimeout(() => {
          salaryInput.setSelectionRange(cursorPos, cursorPos);
        }, 0);
      }
    }
  }

  // Load saved settings
  function loadSavedSettings() {
  chrome.storage.local.get(['userSalary', 'userCurrency'], (data) => {
      if (data.userCurrency && currencyMap[data.userCurrency]) {
      currencySelect.value = data.userCurrency;
      updateCurrencyDisplay();
    }
    if (data.userSalary) {
      salaryInput.value = formatNumber(data.userSalary.toString(), data.userCurrency || 'USD');
    }
  });
  }

  // Update currency display when selection changes
  currencySelect.addEventListener('change', () => {
    updateCurrencyDisplay();
    // Reformat salary input with new currency format
    if (salaryInput.value) {
      const numValue = parseFormattedNumber(salaryInput.value, currencySelect.value || 'USD');
      salaryInput.value = formatNumber(numValue.toString(), currencySelect.value);
    }
  });

  // Format salary input as user types
  salaryInput.addEventListener('input', (e) => {
    const currency = currencySelect.value;
    if (currency) {
      const numValue = parseFormattedNumber(e.target.value, currency);
      if (numValue > 0) {
        e.target.value = formatNumber(numValue.toString(), currency);
      }
    }
  });

  // Save settings
  saveBtn.addEventListener('click', () => {
    const currency = currencySelect.value;
    
    if (!currency) {
      currencySelect.focus();
      currencySelect.style.borderColor = 'hsl(0 84.2% 60.2%)';
      setTimeout(() => {
        currencySelect.style.borderColor = '';
      }, 2000);
      return;
    }

    const salary = parseFormattedNumber(salaryInput.value, currency);

    if (!salary || salary <= 0) {
      // Show error state
      salaryInput.style.borderColor = 'hsl(0 84.2% 60.2%)';
      salaryInput.focus();
      setTimeout(() => {
        salaryInput.style.borderColor = '';
      }, 2000);
      return;
    }

    chrome.storage.local.set({
      userSalary: salary,
      userCurrency: currency
    }, () => {
      // Show success message
      statusDiv.classList.remove('hidden');
      saveBtn.disabled = true;
      saveBtn.style.opacity = '0.6';
      saveBtn.style.cursor = 'not-allowed';
      
      setTimeout(() => {
        statusDiv.classList.add('hidden');
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';
        saveBtn.style.cursor = 'pointer';
      }, 3000);
      
      // Reload the active tab to apply changes immediately
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if(tabs[0]) chrome.tabs.reload(tabs[0].id);
      });
    });
  });

  // Allow Enter key to save
  salaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });

  currencySelect.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });

  // Initialize: Fetch currencies from API
  fetchCurrencies();
});
