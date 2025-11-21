# Time Cost Browser Extension

A Chrome/Edge browser extension that converts product prices into the number of work days based on your monthly salary. This helps you understand the real "time cost" of purchases by showing how many days of work each item costs.

## Features

- 🔍 Automatically detects prices on web pages
- 💰 Supports 100+ currencies via Exchange Rate API
- 💵 Converts prices to your salary currency
- ⏱️ Shows work days (or hours for small amounts)
- 🔄 Works on dynamic pages (Amazon, infinite scroll, etc.)
- 💾 Saves your salary settings locally

## Project Structure

```
how-much/
├── manifest.json          # Extension manifest (needs to be renamed from ai_studio_code.txt)
├── popup.html            # Settings popup (needs to be renamed from ai_studio_code.html)
├── popup.js              # Popup logic (needs to be renamed from ai_studio_code.js)
├── content.js            # Content script (needs to be renamed from ai_studio_code-2.js)
├── icons/                # Extension icons (MISSING - needs to be created)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Setup Instructions

### 1. Rename Files

The current files need to be renamed to match the manifest:

```bash
mv ai_studio_code.txt manifest.json
mv ai_studio_code.html popup.html
mv ai_studio_code.js popup.js
mv ai_studio_code-2.js content.js
```

### 2. Create Icons

Create an `icons/` folder and add three icon files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can use any image editor or online tool to create these icons. The icons should represent the extension's purpose (e.g., a clock, calendar, or money symbol).

### 3. Fix Manifest Permissions

Update `manifest.json` to include the "tabs" permission (needed for reloading tabs):

```json
"permissions": ["storage", "tabs"]
```

### 4. Load Extension in Browser

1. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `how-much` folder
5. The extension should now be installed

## Usage

1. **Set Your Salary:**
   - Click the extension icon in your browser toolbar
   - Enter your monthly net salary
   - Select your salary currency from the dropdown (100+ currencies supported)
   - Click "Save & Apply"

2. **View Time Costs:**
   - Navigate to any website with prices
   - Prices will automatically be converted to work days
   - Example: "$100 (2.5 days)" appears next to prices

3. **How It Works:**
   - The extension scans page text for prices
   - Detects currency automatically (USD, EUR, BRL)
   - Converts prices to USD using fixed exchange rates
   - Calculates: `days = (price in USD) / (daily wage in USD)`
   - Daily wage = monthly salary / 30 days

## Technical Details

### Exchange Rates

The extension uses real-time exchange rates from the [Exchange Rate API](https://www.exchangerate-api.com/docs/standard-requests) to fetch current conversion rates for all supported currencies.

### Supported Currencies

The extension supports 100+ currencies with complete information including:
- Country names
- Currency symbols
- Proper number formatting based on locale

**Excluded Currencies:** Some currencies from the Exchange Rate API are excluded from the dropdown if they don't have complete country information in our mapping. These currencies may be added in the future if the user base grows and there's a demonstrated need for them.

### Price Detection

The extension uses regex patterns to detect prices in various formats:
- `$100`, `$100.00`
- `€100`, `100 €`
- `R$ 1.000,00`
- `100 USD`, `100 EUR`, `100 BRL`

### Performance

- Uses `TreeWalker` API for efficient DOM traversal
- Uses `MutationObserver` to handle dynamic content
- Marks processed nodes to avoid duplicate processing

## Known Issues / Missing Items

- ⚠️ **Icons folder and icon files are missing** - needs to be created
- ⚠️ **File names don't match manifest** - files need to be renamed
- ⚠️ **Some currencies excluded** - currencies without complete country information are not shown in the dropdown. These may be added if user base grows and there's a demonstrated need.

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ✅ Other Chromium-based browsers

## Development

### Testing

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test on a website with prices

### Debugging

- Open DevTools (F12) on any webpage to see content script logs
- Right-click extension icon → "Inspect popup" to debug popup

## License

[Add your license here]

## Contributing

[Add contribution guidelines if applicable]

---

**Note:** This extension is currently in development. Some features may need refinement before production use.

