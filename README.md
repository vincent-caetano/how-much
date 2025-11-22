# Time Cost: How many days does this cost?

A Chrome/Edge browser extension that converts product prices into the number of work days based on your monthly salary. This helps you understand the real "time cost" of purchases by showing how many days of work each item costs.

---

## 📖 What It Does

**Time Cost** automatically detects prices on web pages and converts them into work days based on your salary. Instead of seeing "$100", you'll see "$100 (2.5 days)" - helping you make more informed purchasing decisions by understanding the real time investment behind each purchase.

### Core Features

- 🔍 **Automatic Price Detection** - Scans web pages and detects prices in various formats
- 💰 **100+ Currency Support** - Works with currencies from around the world via real-time exchange rates
- ⏱️ **Smart Time Display** - Shows work days for larger amounts, hours/minutes for smaller purchases
- 🌍 **Multi-Language Interface** - Available in 8 languages: English, Spanish, Portuguese, German, Chinese, Japanese, Russian, and Arabic
- 🎨 **Modern UI** - Beautiful, accessible interface built with shadcn/ui design system
- 🌙 **Dark Mode** - Comfortable viewing in any lighting condition
- 📋 **Site Whitelist** - Control which websites the extension modifies
- 🧮 **Wage Calculator** - Convert your salary between hourly, daily, weekly, biweekly, monthly, and annual periods
- 💾 **Local Storage** - All settings saved locally on your device

---

## 🤔 Why Use It?

Understanding the **time cost** of purchases helps you:

- **Make Better Financial Decisions** - See purchases in terms of your actual time investment
- **Avoid Impulse Buys** - Realizing something costs "3 days of work" can help you reconsider
- **Budget More Effectively** - Understand the real value of items relative to your income
- **Set Spending Priorities** - Compare purchases on an equal footing (time worked)

---

## 🚀 How It Works

### Getting Started

1. **Install the Extension**
   - Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder

2. **Configure Your Salary**
   - Click the extension icon in your browser toolbar
   - Enter your monthly net salary
   - Select your salary currency from the searchable dropdown (100+ currencies supported)
   - Choose your preferred language
   - Click "Save & Apply"

3. **Set Up Whitelist (Optional)**
   - Go to the "By Site" tab in the extension popup
   - Add websites where you want the extension to work
   - Only whitelisted sites will have prices converted
   - Default whitelist includes major e-commerce sites (Amazon, eBay, Walmart, etc.)

4. **Browse and See Time Costs**
   - Navigate to any whitelisted website
   - Prices will automatically be converted to work days
   - Example: "$100 (2.5 days)" appears next to prices

### Using the Wage Calculator

The extension includes a built-in wage calculator that helps you:
- Convert between different time periods (hourly, daily, weekly, biweekly, monthly, annual)
- Calculate based on your hours per week
- See your wage in different formats for better financial planning

---

## ⏰ When It Works

The extension works:
- ✅ On any website you add to your whitelist
- ✅ With dynamic content (Amazon, infinite scroll, etc.)
- ✅ With multiple currency formats ($100, €100, R$ 1.000,00, etc.)
- ✅ Automatically when pages load or update
- ✅ Across all tabs in your browser

The extension does **not** work:
- ❌ On sites not in your whitelist (for privacy and performance)
- ❌ On pages that haven't loaded yet
- ❌ With prices in images (only text-based prices)

---

## 🐛 Debugging & Troubleshooting

### Common Issues

**Prices aren't showing up:**
- Check if the website is in your whitelist (By Site tab)
- Refresh the page after adding a site to the whitelist
- Open browser DevTools (F12) and check the Console for errors

**Wrong currency detected:**
- The extension auto-detects currency from the page
- If detection is wrong, the price will still convert but may show incorrect currency symbol
- You can adjust your salary currency in settings to match the page's currency

**Extension popup not opening:**
- Right-click the extension icon → "Inspect popup" to see errors
- Check that `popup.html`, `popup.js`, and `popup.css` exist in the extension folder
- Reload the extension in `chrome://extensions/`

**Settings not saving:**
- Check browser console for storage errors
- Ensure you have sufficient storage permissions
- Try clearing extension storage and re-entering settings

### Debug Tools

**Content Script Debugging:**
- Open DevTools (F12) on any webpage
- Check the Console tab for content script logs
- Look for messages starting with "[Time Cost]"

**Popup Debugging:**
- Right-click extension icon → "Inspect popup"
- Opens DevTools specifically for the popup
- Check Console for React/UI errors

**Network Debugging:**
- Open DevTools → Network tab
- Filter by "exchangerate-api" to see API calls
- Check for failed requests or rate limiting

### Performance Monitoring

The extension uses efficient algorithms:
- `TreeWalker` API for fast DOM traversal
- `MutationObserver` for dynamic content updates
- Node marking to prevent duplicate processing
- Whitelist filtering to only process relevant sites

If you experience slowdowns:
- Reduce the number of sites in your whitelist
- Check if specific websites have performance issues
- Disable the extension temporarily to compare performance

---

## 🔧 Technical Details

### Architecture

**Tech Stack:**
- **Frontend**: React 19 with Vite
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for fast development and optimized builds
- **Extension API**: Chrome Manifest V3

**Project Structure:**
```
how-much/
├── manifest.json          # Extension manifest (Chrome Manifest V3)
├── popup.html             # Extension popup HTML
├── popup.js               # Built React application bundle
├── popup.css              # Compiled Tailwind CSS
├── content.js             # Content script (runs on web pages)
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── src/                   # React source code
│   ├── App.jsx            # Main React component
│   ├── main.jsx           # React entry point
│   ├── components/ui/      # shadcn/ui components
│   ├── data/              # Currency data and translations
│   └── lib/               # Utility functions
├── public/                # Static assets
│   └── icons/             # Public icon assets
├── index.html             # Dev server entry point
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

### Exchange Rates

The extension uses real-time exchange rates from the [Exchange Rate API](https://www.exchangerate-api.com/docs/standard-requests):
- Fetches latest rates on extension load
- Falls back to default currencies if API is unavailable
- Supports 100+ currencies with complete metadata
- Includes country names, symbols, and locale-specific formatting

### Currency Support

**Supported Formats:**
- `$100`, `$100.00` (US format)
- `€100`, `100 €` (European format)
- `R$ 1.000,00` (Brazilian format)
- `100 USD`, `100 EUR`, `100 BRL` (ISO codes)
- And many more regional formats

**Currency Information Includes:**
- Country names in native language
- Currency symbols (€, $, ¥, etc.)
- Proper decimal and separator formatting
- Locale-specific number formatting

### Price Detection Algorithm

The extension uses sophisticated regex patterns to detect prices:
1. Scans page text for currency patterns
2. Matches various formats (symbols, ISO codes, regional formats)
3. Extracts numeric values with proper decimal handling
4. Converts to user's currency using exchange rates
5. Calculates work days: `days = (price in user currency) / (daily wage)`
6. Formats display based on amount (days vs hours/minutes)

### Performance Optimizations

- **Efficient DOM Traversal**: Uses `TreeWalker` API instead of recursive functions
- **MutationObserver**: Watches for dynamic content changes
- **Node Marking**: Prevents processing the same node twice
- **Whitelist Filtering**: Only processes pages on whitelisted domains
- **Debounced Updates**: Prevents excessive recalculations
- **Lazy Loading**: Currency data loaded on demand

### Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ✅ Other Chromium-based browsers
- ❌ Firefox (different extension API)
- ❌ Safari (different extension API)

### Development Workflow

**Local Development:**
```bash
# Install dependencies
npm install

# Start dev server (for React UI development)
npm run dev

# Build extension (generates popup.js, popup.css)
npm run build

# Preview built extension
npm run preview
```

**Extension Development:**
1. Make changes to React source files in `src/`
2. Run `npm run build` to rebuild extension
3. Reload extension in `chrome://extensions/`
4. Test changes on whitelisted websites

**Important Notes:**
- Always rebuild after changing `src/` files
- `popup.html` should reference `/src/main.jsx` in source, `./popup.js` in build
- Check `DEVELOPMENT.md` for detailed development workflow

---

## 💝 Support the Project

This extension is built with care to help people make better financial decisions. If you find it useful, here are ways to support the project:

### 🌟 Star the Repository
If you're on GitHub, starring the repository helps others discover the extension.

### 🐛 Report Issues
Found a bug or have a feature request? Open an issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Browser and extension version
- Screenshots if applicable

### 💡 Suggest Features
Have an idea to make the extension better? We'd love to hear it! Open a feature request issue.

### 🔧 Contribute Code
Contributions are welcome! Areas where help is especially appreciated:
- Additional language translations
- Currency format support
- Performance improvements
- UI/UX enhancements
- Documentation improvements

### 📢 Spread the Word
Tell friends and colleagues about the extension. The more people using it, the better we can make it!

### ☕ Buy Me a Coffee
If this extension has helped you save money or make better decisions, consider supporting development:
- [GitHub Sponsors](https://github.com/sponsors) (if available)
- Other support links (add your preferred method)

---

## 📄 License

[Add your license here - MIT, GPL, etc.]

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Exchange rates from [Exchange Rate API](https://www.exchangerate-api.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ to help people make better financial decisions**
