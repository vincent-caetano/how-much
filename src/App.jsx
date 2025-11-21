import { useState, useEffect, useCallback } from 'react'
import { Check, ChevronsUpDown, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { currencyInfo, getCurrencyInfo } from '@/data/currencies'
import { cn } from '@/lib/utils'
import './index.css'

const API_KEY = 'ea88a3a0b96922f3654545e1'
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

function App() {
  const [salary, setSalary] = useState('')
  const [currency, setCurrency] = useState('')
  const [currencies, setCurrencies] = useState([])
  const [currencyDisplay, setCurrencyDisplay] = useState('-')
  const [status, setStatus] = useState({ show: false, message: '' })
  const [error, setError] = useState({ field: null, message: '' })
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState('en')

  const formatNumber = useCallback((value, currencyCode) => {
    if (!value) return ''
    const cleanValue = value.toString().replace(/[^\d.,]/g, '')
    const num = parseFloat(cleanValue.replace(/,/g, '').replace(/\./g, ''))
    if (isNaN(num)) return ''
    
    const info = getCurrencyInfo(currencyCode)
    try {
      return num.toLocaleString(info.locale, { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      })
    } catch (e) {
      if (info.decimal === ',' && info.separator === '.') {
        return num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      } else {
        return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      }
    }
  }, [])

  const parseFormattedNumber = useCallback((value, currencyCode) => {
    if (!value) return 0
    let cleanValue = value.toString().replace(/[^\d.,]/g, '')
    
    const info = getCurrencyInfo(currencyCode)
    
    if (info.decimal === ',' && info.separator === '.') {
      cleanValue = cleanValue.replace(/\./g, '').replace(',', '.')
    } else if (info.separator === ' ') {
      cleanValue = cleanValue.replace(/\s/g, '').replace(',', '.')
    } else {
      cleanValue = cleanValue.replace(/,/g, '')
    }
    
    return parseFloat(cleanValue) || 0
  }, [])

  const fetchCurrencies = useCallback(async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      
      if (data.result === 'success' && data.conversion_rates) {
        const currencyList = Object.keys(data.conversion_rates)
          .filter(code => currencyInfo[code] && currencyInfo[code].country)
          .map(code => {
            const info = currencyInfo[code]
            const upperCode = code.toUpperCase()
            return {
              code: upperCode,
              country: info.country,
              symbol: info.symbol,
              flag: info.flag,
              displayText: `${info.flag} ${info.country} | ${upperCode} | ${info.symbol}`
            }
          })
          .sort((a, b) => a.code.localeCompare(b.code))
        
        setCurrencies(currencyList)
      } else {
        setupDefaultCurrencies()
      }
    } catch (error) {
      console.error('Error fetching currencies:', error)
      setupDefaultCurrencies()
    }
  }, [])

  const setupDefaultCurrencies = useCallback(() => {
    const defaults = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'AUD', 'CAD']
    const currencyList = defaults
      .filter(code => currencyInfo[code] && currencyInfo[code].country)
      .map(code => {
        const info = currencyInfo[code]
        const upperCode = code.toUpperCase()
        return {
          code: upperCode,
          country: info.country,
          symbol: info.symbol,
          flag: info.flag,
          displayText: `${info.flag} ${info.country} | ${upperCode} | ${info.symbol}`
        }
      })
    setCurrencies(currencyList)
  }, [])

  const updateCurrencyDisplay = useCallback((code) => {
    if (code && currencyInfo[code]) {
      setCurrencyDisplay(currencyInfo[code].flag)
    } else {
      setCurrencyDisplay('-')
    }
  }, [])

  const loadSavedSettings = useCallback(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['userSalary', 'userCurrency', 'userLanguage'], (data) => {
        if (data.userCurrency && currencyInfo[data.userCurrency]) {
          setCurrency(data.userCurrency)
          updateCurrencyDisplay(data.userCurrency)
        }
        if (data.userSalary) {
          setSalary(formatNumber(data.userSalary.toString(), data.userCurrency || 'USD'))
        }
        if (data.userLanguage) {
          setLanguage(data.userLanguage)
        }
      })
    }
  }, [formatNumber, updateCurrencyDisplay])

  useEffect(() => {
    fetchCurrencies()
  }, [fetchCurrencies])

  useEffect(() => {
    if (currencies.length > 0) {
      loadSavedSettings()
    }
  }, [currencies, loadSavedSettings])

  useEffect(() => {
    updateCurrencyDisplay(currency)
  }, [currency, updateCurrencyDisplay])

  const handleCurrencySelect = (selectedCode) => {
    const value = selectedCode.trim().toUpperCase()
    setCurrency(value === currency ? '' : value)
    setOpen(false)
    setError({ field: null, message: '' })
    
    if (salary && value && currencyInfo[value]) {
      const numValue = parseFormattedNumber(salary, value)
      setSalary(formatNumber(numValue.toString(), value))
    }
  }

  const handleSalaryChange = (e) => {
    const value = e.target.value
    const numValue = parseFormattedNumber(value, currency || 'USD')
    
    if (currency && currencyInfo[currency] && numValue > 0) {
      setSalary(formatNumber(numValue.toString(), currency))
    } else {
      setSalary(value)
    }
    setError({ field: null, message: '' })
  }

  const handleSave = () => {
    const selectedCurrency = currency.trim().toUpperCase()
    const currencyExists = currencies.find(c => c.code === selectedCurrency)
    
    if (!selectedCurrency || !currencyExists) {
      setError({ field: 'currency', message: 'Please select a valid currency' })
      return
    }

    const salaryValue = parseFormattedNumber(salary, selectedCurrency)

    if (!salaryValue || salaryValue <= 0) {
      setError({ field: 'salary', message: 'Please enter a valid salary' })
      return
    }

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({
        userSalary: salaryValue,
        userCurrency: selectedCurrency
      }, () => {
        setStatus({ show: true, message: 'Settings saved! Refresh page to see changes.' })
        setError({ field: null, message: '' })
        
        setTimeout(() => {
          setStatus({ show: false, message: '' })
        }, 3000)
        
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if(tabs[0]) chrome.tabs.reload(tabs[0].id)
        })
      })
    }
  }

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode)
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ userLanguage: langCode })
    }
  }

  const selectedCurrency = currencies.find(curr => curr.code === currency)
  const selectedLanguage = languages.find(lang => lang.code === language) || languages[0]

  return (
    <div className="w-[320px] min-h-[400px] bg-background p-6 relative">
      <div className="absolute top-6 right-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Globe className="h-4 w-4" />
              <span className="sr-only">Select language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="cursor-pointer"
              >
                <span className="mr-2">{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <img src="/icons/icon128.png" alt="How Much Logo" className="w-12 h-12 flex-shrink-0" style={{ imageRendering: 'pixelated' }} />
        <h1 className="text-lg font-bold">
          <span className="text-foreground">HOW</span>
          <span className="text-green-600">MUCH?</span>
        </h1>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency" className="sr-only">Choose a currency</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between border-0 shadow-none",
                    error.field === 'currency' && 'border-destructive'
                  )}
                >
                  {selectedCurrency ? (
                    <span>{selectedCurrency.displayText}</span>
                  ) : (
                    <span className="text-muted-foreground">Search or select currency...</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="fixed inset-0 !w-screen !h-screen !rounded-none !p-0 z-[9999] !m-0 !border-0" 
                align="start"
                sideOffset={0}
                style={{ 
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100vw',
                  height: '100vh',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                }}
              >
                <Command className="h-full flex flex-col">
                  <div className="sticky top-0 bg-background z-10 border-b">
                    <CommandInput placeholder="Search currency..." className="h-12 text-base border-0" />
                  </div>
                  <CommandList className="flex-1 overflow-y-auto">
                    <CommandEmpty className="py-8">No currency found.</CommandEmpty>
                    <CommandGroup>
                      {currencies.map((curr) => (
                        <CommandItem
                          key={curr.code}
                          value={`${curr.code} ${curr.country} ${curr.symbol}`}
                          onSelect={() => handleCurrencySelect(curr.code)}
                          className="py-3 text-base"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-5 w-5",
                              currency === curr.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {curr.displayText}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {error.field === 'currency' && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="salary" className="sr-only">Monthly Net Salary</Label>
            {currencyDisplay !== '-' && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none z-10">
                {currencyDisplay}
              </div>
            )}
            <Input
              id="salary"
              type="text"
              placeholder="0"
              value={salary}
              onChange={handleSalaryChange}
              className={cn(
                currencyDisplay !== '-' ? 'pl-12' : '',
                'border-0 shadow-none',
                error.field === 'salary' && 'border-destructive'
              )}
              inputMode="numeric"
            />
            {error.field === 'salary' && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}
          </div>

          <Button onClick={handleSave} className="w-full lowercase border-0 shadow-none" size="default">
            save & apply
          </Button>

          {status.show && (
            <Alert variant="success" className="animate-in slide-in-from-top-5 duration-300">
              <AlertDescription className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {status.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
