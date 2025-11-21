import { useState, useEffect, useCallback } from 'react'
import { Check, ChevronsUpDown, Globe, X, Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
]

// Translations
const translations = {
  en: {
    selectLanguage: 'Select Language',
    home: 'Home',
    bySite: 'By Site',
    chooseCurrency: 'Choose a currency',
    searchOrSelectCurrency: 'Search or select currency...',
    searchCurrency: 'Search currency...',
    noCurrencyFound: 'No currency found.',
    monthlyNetSalary: 'Monthly Net Salary',
    saveAndApply: 'save & apply',
    settingsSaved: 'Settings saved! Refresh page to see changes.',
    pleaseSelectCurrency: 'Please select a valid currency',
    pleaseEnterSalary: 'Please enter a valid salary',
    addSiteToWhitelist: 'Add Site to Whitelist',
    addSiteDescription: 'Add sites where the extension should modify pages. Only whitelisted sites will be modified.',
    sitePlaceholder: 'example.com or www.example.com',
    whitelistedSites: 'Whitelisted Sites',
    noSitesInWhitelist: 'No sites in whitelist. Add a site above to get started.',
    siteAlreadyInWhitelist: 'Site already in whitelist',
    siteAddedToWhitelist: 'Site added to whitelist',
    siteRemovedFromWhitelist: 'Site removed from whitelist',
    removeGroup: 'Remove group',
    removeSite: 'Remove site',
    addSite: 'Add site',
  },
  es: {
    selectLanguage: 'Seleccionar idioma',
    home: 'Inicio',
    bySite: 'Por sitio',
    chooseCurrency: 'Elige una moneda',
    searchOrSelectCurrency: 'Buscar o seleccionar moneda...',
    searchCurrency: 'Buscar moneda...',
    noCurrencyFound: 'No se encontró moneda.',
    monthlyNetSalary: 'Salario neto mensual',
    saveAndApply: 'guardar y aplicar',
    settingsSaved: '¡Configuración guardada! Actualiza la página para ver los cambios.',
    pleaseSelectCurrency: 'Por favor selecciona una moneda válida',
    pleaseEnterSalary: 'Por favor ingresa un salario válido',
    addSiteToWhitelist: 'Agregar sitio a la lista blanca',
    addSiteDescription: 'Agrega sitios donde la extensión debe modificar páginas. Solo los sitios en la lista blanca serán modificados.',
    sitePlaceholder: 'ejemplo.com o www.ejemplo.com',
    whitelistedSites: 'Sitios en lista blanca',
    noSitesInWhitelist: 'No hay sitios en la lista blanca. Agrega un sitio arriba para comenzar.',
    siteAlreadyInWhitelist: 'El sitio ya está en la lista blanca',
    siteAddedToWhitelist: 'Sitio agregado a la lista blanca',
    siteRemovedFromWhitelist: 'Sitio eliminado de la lista blanca',
    removeGroup: 'Eliminar grupo',
    removeSite: 'Eliminar sitio',
    addSite: 'Agregar sitio',
  },
  pt: {
    selectLanguage: 'Selecionar idioma',
    home: 'Início',
    bySite: 'Por site',
    chooseCurrency: 'Escolha uma moeda',
    searchOrSelectCurrency: 'Pesquisar ou selecionar moeda...',
    searchCurrency: 'Pesquisar moeda...',
    noCurrencyFound: 'Nenhuma moeda encontrada.',
    monthlyNetSalary: 'Salário líquido mensal',
    saveAndApply: 'salvar e aplicar',
    settingsSaved: 'Configurações salvas! Atualize a página para ver as alterações.',
    pleaseSelectCurrency: 'Por favor selecione uma moeda válida',
    pleaseEnterSalary: 'Por favor insira um salário válido',
    addSiteToWhitelist: 'Adicionar site à lista branca',
    addSiteDescription: 'Adicione sites onde a extensão deve modificar páginas. Apenas sites na lista branca serão modificados.',
    sitePlaceholder: 'exemplo.com ou www.exemplo.com',
    whitelistedSites: 'Sites na lista branca',
    noSitesInWhitelist: 'Nenhum site na lista branca. Adicione um site acima para começar.',
    siteAlreadyInWhitelist: 'Site já está na lista branca',
    siteAddedToWhitelist: 'Site adicionado à lista branca',
    siteRemovedFromWhitelist: 'Site removido da lista branca',
    removeGroup: 'Remover grupo',
    removeSite: 'Remover site',
    addSite: 'Adicionar site',
  },
  de: {
    selectLanguage: 'Sprache auswählen',
    home: 'Startseite',
    bySite: 'Nach Website',
    chooseCurrency: 'Währung wählen',
    searchOrSelectCurrency: 'Währung suchen oder auswählen...',
    searchCurrency: 'Währung suchen...',
    noCurrencyFound: 'Keine Währung gefunden.',
    monthlyNetSalary: 'Monatliches Nettoeinkommen',
    saveAndApply: 'speichern & anwenden',
    settingsSaved: 'Einstellungen gespeichert! Seite aktualisieren, um Änderungen zu sehen.',
    pleaseSelectCurrency: 'Bitte wählen Sie eine gültige Währung',
    pleaseEnterSalary: 'Bitte geben Sie ein gültiges Gehalt ein',
    addSiteToWhitelist: 'Website zur Whitelist hinzufügen',
    addSiteDescription: 'Fügen Sie Websites hinzu, auf denen die Erweiterung Seiten ändern soll. Nur Websites auf der Whitelist werden geändert.',
    sitePlaceholder: 'beispiel.com oder www.beispiel.com',
    whitelistedSites: 'Whitelist-Websites',
    noSitesInWhitelist: 'Keine Websites auf der Whitelist. Fügen Sie oben eine Website hinzu, um zu beginnen.',
    siteAlreadyInWhitelist: 'Website ist bereits auf der Whitelist',
    siteAddedToWhitelist: 'Website zur Whitelist hinzugefügt',
    siteRemovedFromWhitelist: 'Website von der Whitelist entfernt',
    removeGroup: 'Gruppe entfernen',
    removeSite: 'Website entfernen',
    addSite: 'Website hinzufügen',
  },
  zh: {
    selectLanguage: '选择语言',
    home: '首页',
    bySite: '按网站',
    chooseCurrency: '选择货币',
    searchOrSelectCurrency: '搜索或选择货币...',
    searchCurrency: '搜索货币...',
    noCurrencyFound: '未找到货币。',
    monthlyNetSalary: '月净工资',
    saveAndApply: '保存并应用',
    settingsSaved: '设置已保存！刷新页面以查看更改。',
    pleaseSelectCurrency: '请选择有效的货币',
    pleaseEnterSalary: '请输入有效的工资',
    addSiteToWhitelist: '将网站添加到白名单',
    addSiteDescription: '添加扩展应修改页面的网站。只有白名单中的网站才会被修改。',
    sitePlaceholder: 'example.com 或 www.example.com',
    whitelistedSites: '白名单网站',
    noSitesInWhitelist: '白名单中没有网站。在上方添加网站以开始。',
    siteAlreadyInWhitelist: '网站已在白名单中',
    siteAddedToWhitelist: '网站已添加到白名单',
    siteRemovedFromWhitelist: '网站已从白名单中移除',
    removeGroup: '移除组',
    removeSite: '移除网站',
    addSite: '添加网站',
  },
  ja: {
    selectLanguage: '言語を選択',
    home: 'ホーム',
    bySite: 'サイト別',
    chooseCurrency: '通貨を選択',
    searchOrSelectCurrency: '通貨を検索または選択...',
    searchCurrency: '通貨を検索...',
    noCurrencyFound: '通貨が見つかりません。',
    monthlyNetSalary: '月額純給与',
    saveAndApply: '保存して適用',
    settingsSaved: '設定が保存されました！ページを更新して変更を確認してください。',
    pleaseSelectCurrency: '有効な通貨を選択してください',
    pleaseEnterSalary: '有効な給与を入力してください',
    addSiteToWhitelist: 'サイトをホワイトリストに追加',
    addSiteDescription: '拡張機能がページを変更するサイトを追加します。ホワイトリストに登録されたサイトのみが変更されます。',
    sitePlaceholder: 'example.com または www.example.com',
    whitelistedSites: 'ホワイトリストサイト',
    noSitesInWhitelist: 'ホワイトリストにサイトがありません。上記にサイトを追加して開始してください。',
    siteAlreadyInWhitelist: 'サイトは既にホワイトリストにあります',
    siteAddedToWhitelist: 'サイトがホワイトリストに追加されました',
    siteRemovedFromWhitelist: 'サイトがホワイトリストから削除されました',
    removeGroup: 'グループを削除',
    removeSite: 'サイトを削除',
    addSite: 'サイトを追加',
  },
  ru: {
    selectLanguage: 'Выбрать язык',
    home: 'Главная',
    bySite: 'По сайту',
    chooseCurrency: 'Выберите валюту',
    searchOrSelectCurrency: 'Поиск или выбор валюты...',
    searchCurrency: 'Поиск валюты...',
    noCurrencyFound: 'Валюта не найдена.',
    monthlyNetSalary: 'Месячная чистая зарплата',
    saveAndApply: 'сохранить и применить',
    settingsSaved: 'Настройки сохранены! Обновите страницу, чтобы увидеть изменения.',
    pleaseSelectCurrency: 'Пожалуйста, выберите действительную валюту',
    pleaseEnterSalary: 'Пожалуйста, введите действительную зарплату',
    addSiteToWhitelist: 'Добавить сайт в белый список',
    addSiteDescription: 'Добавьте сайты, на которых расширение должно изменять страницы. Только сайты из белого списка будут изменены.',
    sitePlaceholder: 'example.com или www.example.com',
    whitelistedSites: 'Сайты в белом списке',
    noSitesInWhitelist: 'В белом списке нет сайтов. Добавьте сайт выше, чтобы начать.',
    siteAlreadyInWhitelist: 'Сайт уже в белом списке',
    siteAddedToWhitelist: 'Сайт добавлен в белый список',
    siteRemovedFromWhitelist: 'Сайт удален из белого списка',
    removeGroup: 'Удалить группу',
    removeSite: 'Удалить сайт',
    addSite: 'Добавить сайт',
  },
  ar: {
    selectLanguage: 'اختر اللغة',
    home: 'الرئيسية',
    bySite: 'حسب الموقع',
    chooseCurrency: 'اختر العملة',
    searchOrSelectCurrency: 'ابحث أو اختر العملة...',
    searchCurrency: 'ابحث عن العملة...',
    noCurrencyFound: 'لم يتم العثور على عملة.',
    monthlyNetSalary: 'الراتب الصافي الشهري',
    saveAndApply: 'حفظ وتطبيق',
    settingsSaved: 'تم حفظ الإعدادات! قم بتحديث الصفحة لرؤية التغييرات.',
    pleaseSelectCurrency: 'يرجى اختيار عملة صالحة',
    pleaseEnterSalary: 'يرجى إدخال راتب صالح',
    addSiteToWhitelist: 'إضافة موقع إلى القائمة البيضاء',
    addSiteDescription: 'أضف المواقع التي يجب أن يعدل فيها الامتداد الصفحات. سيتم تعديل المواقع المدرجة في القائمة البيضاء فقط.',
    sitePlaceholder: 'example.com أو www.example.com',
    whitelistedSites: 'المواقع في القائمة البيضاء',
    noSitesInWhitelist: 'لا توجد مواقع في القائمة البيضاء. أضف موقعًا أعلاه للبدء.',
    siteAlreadyInWhitelist: 'الموقع موجود بالفعل في القائمة البيضاء',
    siteAddedToWhitelist: 'تم إضافة الموقع إلى القائمة البيضاء',
    siteRemovedFromWhitelist: 'تم إزالة الموقع من القائمة البيضاء',
    removeGroup: 'إزالة المجموعة',
    removeSite: 'إزالة الموقع',
    addSite: 'إضافة موقع',
  },
}

// Translation helper function
const t = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations.en[key] || key
}

// US Federal minimum wage: $7.25/hour * 40 hours/week * 4.33 weeks/month = $1,256.67/month
const US_MONTHLY_MINIMUM_WAGE = 1256.67

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
]

// Helper functions for grouping domains
const getBaseDomain = (domain) => {
  // Extract base domain name (e.g., "amazon" from "amazon.com", "amazon.co.uk")
  const parts = domain.split('.')
  if (parts.length <= 2) {
    return parts[0]
  }
  // For multi-part TLDs (e.g., co.uk, com.au), take first two parts
  // Check if second part is a common TLD component
  const tldComponents = ['co', 'com', 'org', 'net', 'edu', 'gov']
  if (tldComponents.includes(parts[parts.length - 2])) {
    return parts[parts.length - 3] || parts[0]
  }
  return parts[parts.length - 2] || parts[0]
}

const groupDomainsByBase = (domains) => {
  const groups = {}
  domains.forEach(domain => {
    const base = getBaseDomain(domain)
    if (!groups[base]) {
      groups[base] = []
    }
    groups[base].push(domain)
  })
  return groups
}

const getFaviconUrl = (domain) => {
  // Use Google's favicon service
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
}

function App() {
  const [salary, setSalary] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [currencies, setCurrencies] = useState([])
  const [currencyDisplay, setCurrencyDisplay] = useState('-')
  const [status, setStatus] = useState({ show: false, message: '' })
  const [error, setError] = useState({ field: null, message: '' })
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const [whitelist, setWhitelist] = useState([])
  const [siteInput, setSiteInput] = useState('')
  const [expandedGroups, setExpandedGroups] = useState(new Set())

  const formatNumber = useCallback((value, currencyCode) => {
    if (!value) return ''
    
    const info = getCurrencyInfo(currencyCode)
    // Remove all non-digit characters to get pure digits
    let cleanValue = value.toString().replace(/\D/g, '')
    
    if (!cleanValue) return ''
    
    // Base masking: treat input as cents (smallest unit), divide by 100
    // e.g., "123456" -> 1234.56
    const num = parseFloat(cleanValue) / 100
    
    if (isNaN(num)) return ''
    
    // Always format with 2 decimal places (since input is in cents)
    try {
      return num.toLocaleString(info.locale, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    } catch (e) {
      if (info.decimal === ',' && info.separator === '.') {
        return num.toLocaleString('pt-BR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })
      } else {
        return num.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })
      }
    }
  }, [])

  const parseFormattedNumber = useCallback((value, currencyCode) => {
    if (!value) return 0
    // Remove all non-digit characters to get pure digits (cents)
    let cleanValue = value.toString().replace(/\D/g, '')
    
    if (!cleanValue) return 0
    
    // Base masking: input is in cents, divide by 100 to get the actual value
    // e.g., "123456" -> 1234.56
    return parseFloat(cleanValue) / 100 || 0
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
      setCurrencyDisplay(currencyInfo[code].symbol)
    } else {
      setCurrencyDisplay('-')
    }
  }, [])

  const loadSavedSettings = useCallback(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['userSalary', 'userCurrency', 'userLanguage', 'whitelist'], (data) => {
        // Set default currency to USD if not saved
        if (data.userCurrency && currencyInfo[data.userCurrency]) {
          setCurrency(data.userCurrency)
          updateCurrencyDisplay(data.userCurrency)
        } else {
          // Default to USD
          setCurrency('USD')
          updateCurrencyDisplay('USD')
        }
        
        // Set default salary to US monthly minimum wage if not saved
        if (data.userSalary) {
          // Convert saved value (dollars) to cents for formatting
          // formatNumber expects digits (cents) and divides by 100
          const centsValue = Math.round(data.userSalary * 100).toString()
          setSalary(formatNumber(centsValue, data.userCurrency || 'USD'))
        } else {
          // Default to US monthly minimum wage
          // Convert to cents for formatting
          const centsValue = Math.round(US_MONTHLY_MINIMUM_WAGE * 100).toString()
          setSalary(formatNumber(centsValue, data.userCurrency || 'USD'))
        }
        
        if (data.userLanguage) {
          setLanguage(data.userLanguage)
        }
        
        let whitelistToSet = []
        if (data.whitelist && Array.isArray(data.whitelist) && data.whitelist.length > 0) {
          whitelistToSet = data.whitelist
        } else {
          // Use default whitelist if none is saved
          whitelistToSet = DEFAULT_WHITELIST
          // Save defaults to storage
          chrome.storage.local.set({ whitelist: DEFAULT_WHITELIST })
        }
        setWhitelist(whitelistToSet)
        // Expand all groups by default
        const groups = groupDomainsByBase(whitelistToSet)
        setExpandedGroups(new Set(Object.keys(groups).filter(key => groups[key].length > 1)))
      })
    } else {
      // Fallback when chrome.storage is not available (e.g., in development)
      setCurrency('USD')
      updateCurrencyDisplay('USD')
      // Convert to cents for formatting
      const centsValue = Math.round(US_MONTHLY_MINIMUM_WAGE * 100).toString()
      setSalary(formatNumber(centsValue, 'USD'))
      // Set default whitelist for development
      setWhitelist(DEFAULT_WHITELIST)
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
      // Get the current value in dollars, convert to cents for formatting
      const numValue = parseFormattedNumber(salary, value)
      const centsValue = Math.round(numValue * 100).toString()
      setSalary(formatNumber(centsValue, value))
    }
  }

  const handleSalaryChange = (e) => {
    const value = e.target.value
    const currentCurrency = currency || 'USD'
    
    // Base masking: treat all input as digits (cents), format by dividing by 100
    // User types digits only, we format with decimal places
    if (currentCurrency && currencyInfo[currentCurrency] && value) {
      // Remove all non-digits and format
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly) {
        setSalary(formatNumber(digitsOnly, currentCurrency))
      } else {
        setSalary('')
      }
    } else {
      setSalary(value)
    }
    setError({ field: null, message: '' })
  }

  const handleSave = () => {
    const selectedCurrency = currency.trim().toUpperCase()
    const currencyExists = currencies.find(c => c.code === selectedCurrency)
    
    if (!selectedCurrency || !currencyExists) {
      setError({ field: 'currency', message: t('pleaseSelectCurrency', language) })
      return
    }

    const salaryValue = parseFormattedNumber(salary, selectedCurrency)

    if (!salaryValue || salaryValue <= 0) {
      setError({ field: 'salary', message: t('pleaseEnterSalary', language) })
      return
    }

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({
        userSalary: salaryValue,
        userCurrency: selectedCurrency
      }, () => {
        setStatus({ show: true, message: t('settingsSaved', language) })
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

  const normalizeSiteUrl = (url) => {
    try {
      // Remove protocol and www
      const normalized = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
      return normalized.toLowerCase().trim()
    } catch (e) {
      // If URL parsing fails, return cleaned input
      return url.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    }
  }
  
  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupName)) {
        newSet.delete(groupName)
      } else {
        newSet.add(groupName)
      }
      return newSet
    })
  }
  
  const handleRemoveGroup = (groupName, domains) => {
    const newWhitelist = whitelist.filter(site => !domains.includes(site))
    setWhitelist(newWhitelist)
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ whitelist: newWhitelist }, () => {
        setStatus({ show: true, message: t('siteRemovedFromWhitelist', language) })
        setTimeout(() => setStatus({ show: false, message: '' }), 2000)
      })
    }
  }
  
  const handleAddSite = () => {
    const normalizedSite = normalizeSiteUrl(siteInput)
    if (!normalizedSite) return
    
    if (whitelist.includes(normalizedSite)) {
      setStatus({ show: true, message: t('siteAlreadyInWhitelist', language) })
      setTimeout(() => setStatus({ show: false, message: '' }), 2000)
      return
    }
    
    const newWhitelist = [...whitelist, normalizedSite]
    setWhitelist(newWhitelist)
    setSiteInput('')
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ whitelist: newWhitelist }, () => {
        setStatus({ show: true, message: t('siteAddedToWhitelist', language) })
        setTimeout(() => setStatus({ show: false, message: '' }), 2000)
      })
    }
  }
  
  const handleRemoveSite = (site) => {
    const newWhitelist = whitelist.filter(s => s !== site)
    setWhitelist(newWhitelist)
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ whitelist: newWhitelist }, () => {
        setStatus({ show: true, message: t('siteRemovedFromWhitelist', language) })
        setTimeout(() => setStatus({ show: false, message: '' }), 2000)
      })
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
              <span className="text-lg">{selectedLanguage.flag}</span>
              <span className="sr-only">{t('selectLanguage', language)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{t('selectLanguage', language)}</DropdownMenuLabel>
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

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="home">{t('home', language)}</TabsTrigger>
          <TabsTrigger value="by-site">{t('bySite', language)}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="home" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency" className="sr-only">{t('chooseCurrency', language)}</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between",
                  error.field === 'currency' && 'border-destructive'
                )}
              >
                {selectedCurrency ? (
                  <span className="flex-1 truncate">{selectedCurrency.displayText}</span>
                ) : (
                  <span className="text-muted-foreground flex-1 w-full">{t('searchOrSelectCurrency', language)}</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
              <Command>
                <CommandInput placeholder={t('searchCurrency', language)} className="h-9" />
                <CommandList>
                  <CommandEmpty>{t('noCurrencyFound', language)}</CommandEmpty>
                  <CommandGroup>
                    {currencies.map((curr) => (
                      <CommandItem
                        key={curr.code}
                        value={`${curr.code} ${curr.country} ${curr.symbol}`}
                        onSelect={() => handleCurrencySelect(curr.code)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
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

        <div className="space-y-2">
          <div className="relative">
            <Label htmlFor="salary" className="sr-only">{t('monthlyNetSalary', language)}</Label>
            <div className="absolute left-3 top-1 bottom-1 flex items-center text-base md:text-sm pointer-events-none z-10 text-black opacity-50 m-0">
              {currencyDisplay}
            </div>
            <Input
              id="salary"
              type="text"
              placeholder="0"
              value={salary}
              onChange={handleSalaryChange}
              className={`pl-12 ${error.field === 'salary' ? 'border-destructive' : ''}`}
              inputMode="numeric"
            />
          </div>
          {error.field === 'salary' && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}
        </div>

        <Button onClick={handleSave} className="w-full lowercase" size="default">
          {t('saveAndApply', language)}
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
        </TabsContent>
        
        <TabsContent value="by-site" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-input">{t('addSiteToWhitelist', language)}</Label>
            <p className="text-sm text-muted-foreground">
              {t('addSiteDescription', language)}
            </p>
            <div className="flex gap-2">
              <Input
                id="site-input"
                type="text"
                placeholder={t('sitePlaceholder', language)}
                value={siteInput}
                onChange={(e) => setSiteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSite()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleAddSite} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
                <span className="sr-only">{t('addSite', language)}</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>{t('whitelistedSites', language)}</Label>
            {whitelist.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t('noSitesInWhitelist', language)}
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(groupDomainsByBase(whitelist))
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([groupName, domains]) => {
                    const isExpanded = expandedGroups.has(groupName)
                    const isGroup = domains.length > 1
                    
                    return (
                      <div key={groupName} className="border rounded-md overflow-hidden">
                        {isGroup ? (
                          <>
                            <div
                              className="flex items-center justify-between p-2 hover:bg-accent transition-colors cursor-pointer"
                              onClick={() => toggleGroup(groupName)}
                            >
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                <img
                                  src={getFaviconUrl(domains[0])}
                                  alt={`${groupName} favicon`}
                                  className="h-4 w-4 rounded-sm"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                  }}
                                />
                                <span className="text-sm font-medium capitalize">{groupName}</span>
                                <span className="text-xs text-muted-foreground">({domains.length})</span>
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveGroup(groupName, domains)
                                }}
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">{t('removeGroup', language)}</span>
                              </Button>
                            </div>
                            {isExpanded && (
                              <div className="border-t bg-muted/30">
                                {domains.sort().map((site) => (
                                  <div
                                    key={site}
                                    className="flex items-center justify-between px-4 py-2 hover:bg-accent/50 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={getFaviconUrl(site)}
                                        alt={`${site} favicon`}
                                        className="h-4 w-4 rounded-sm"
                                        onError={(e) => {
                                          e.target.style.display = 'none'
                                        }}
                                      />
                                      <span className="text-sm text-muted-foreground">{site}</span>
                                    </div>
                                    <Button
                                      onClick={() => handleRemoveSite(site)}
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                    >
                                      <X className="h-4 w-4" />
                                      <span className="sr-only">{t('removeSite', language)}</span>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-between p-2 hover:bg-accent transition-colors">
                            <div className="flex items-center gap-2">
                              <img
                                src={getFaviconUrl(domains[0])}
                                alt={`${domains[0]} favicon`}
                                className="h-4 w-4 rounded-sm"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
                              />
                              <span className="text-sm font-medium">{domains[0]}</span>
                            </div>
                            <Button
                              onClick={() => handleRemoveSite(domains[0])}
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">{t('removeSite', language)}</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
          
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
