# Currency Punctuation Handling

### Critical: Format Detection vs Currency Assumptions

**IMPORTANT**: Do NOT assume number format based on currency symbol alone. Many websites (especially Google, shopping aggregators, etc.) display prices in formats that don't match the currency's traditional format.

### Number Format Patterns

**USD Format (American/International)**:
- Thousands separator: comma (`,`)
- Decimal separator: dot (`.`)
- Examples: `$1,234.56`, `R$2,789.07` (BRL price in USD format), `€1,234.56` (EUR price in USD format)

**Brazilian/European Format**:
- Thousands separator: dot (`.`)
- Decimal separator: comma (`,`)
- Examples: `R$ 1.234,56`, `€1.234,56`

### Format Detection Logic

When parsing prices in `content.js`, **always detect the format by pattern matching**, not by currency:

1. **Detect format patterns first**:
   - `,789.` → USD format (comma + 3 digits + dot)
   - `.789,` → Brazilian/European format (dot + 3 digits + comma)

2. **Fallback heuristics**:
   - If both separators exist: last separator position indicates decimal (usually comes last)
   - If only dot exists: check if last part is 1-2 digits (decimal) vs 3 digits (thousands)
   - If only comma exists: check if last part is 3 digits (thousands) vs 1-2 digits (decimal)

3. **Parse based on detected format**, not currency symbol

### Common Pitfalls to Avoid

❌ **DON'T**: Assume BRL always uses Brazilian format
- Google often shows `R$2,789.07` (USD format) instead of `R$ 2.789,07`

❌ **DON'T**: Parse based solely on currency symbol
- The same currency can appear in different formats on different websites

✅ **DO**: Detect format pattern first, then parse accordingly
✅ **DO**: Test with real-world examples from Google, Amazon, and local retailers
✅ **DO**: Handle edge cases where format is ambiguous

### Example Implementation Pattern

```javascript
// Detect format by pattern, not currency
const usdPattern = /,\d{3}\./; // e.g., ",789."
const brlPattern = /\.\d{3},/; // e.g., ".789,"

let isUSDFormat = false;
if (usdPattern.test(cleanString)) {
  isUSDFormat = true;
} else if (brlPattern.test(cleanString)) {
  isUSDFormat = false;
}
// ... then parse based on detected format
```

### Testing Checklist

When modifying price parsing logic, always test:
- [ ] `R$2,789.07` (BRL in USD format - e.g., Google results)
- [ ] `R$ 2.789,07` (BRL in Brazilian format - e.g., Brazilian retailers)
- [ ] `$1,234.56` (USD format)
- [ ] `€1.234,56` (EUR in European format)
- [ ] `€1,234.56` (EUR in USD format - common on international sites)

