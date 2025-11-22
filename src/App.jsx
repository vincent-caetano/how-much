import { useState, useEffect, useCallback } from 'react'
import { Check, ChevronsUpDown, Globe, X, Plus, ChevronDown, ChevronRight, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
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
    wageCalculator: 'Wage Calculator',
    wageCalculatorDescription: 'Calculate your wage in different periods',
    hourlyWage: 'Hourly wage',
    hoursPerWeek: 'Hours per week',
    annualSalary: 'Annual salary',
    yourWageAs: 'Your wage as:',
    daily: 'Daily',
    monthly: 'Monthly',
    weekly: 'Weekly',
    biweekly: 'Biweekly',
    salarySettings: 'Salary settings',
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
    wageCalculator: 'Calculadora de Salario',
    wageCalculatorDescription: 'Calcula tu salario en diferentes períodos',
    hourlyWage: 'Salario por hora',
    hoursPerWeek: 'Horas por semana',
    annualSalary: 'Salario anual',
    yourWageAs: 'Tu salario como:',
    daily: 'Diario',
    monthly: 'Mensual',
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    salarySettings: 'Configuración de salario',
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
    wageCalculator: 'Calculadora de Salário',
    wageCalculatorDescription: 'Calcule seu salário em diferentes períodos',
    hourlyWage: 'Salário por hora',
    hoursPerWeek: 'Horas por semana',
    annualSalary: 'Salário anual',
    yourWageAs: 'Seu salário como:',
    daily: 'Diário',
    monthly: 'Mensal',
    weekly: 'Semanal',
    biweekly: 'Quinzenal',
    salarySettings: 'Configurações de salário',
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
    wageCalculator: 'Gehaltsrechner',
    wageCalculatorDescription: 'Berechnen Sie Ihr Gehalt in verschiedenen Zeiträumen',
    hourlyWage: 'Stundenlohn',
    hoursPerWeek: 'Stunden pro Woche',
    annualSalary: 'Jahresgehalt',
    yourWageAs: 'Ihr Gehalt als:',
    daily: 'Täglich',
    monthly: 'Monatlich',
    weekly: 'Wöchentlich',
    biweekly: 'Zweiwöchentlich',
    salarySettings: 'Gehaltseinstellungen',
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
    wageCalculator: '工资计算器',
    wageCalculatorDescription: '计算不同时期的工资',
    hourlyWage: '时薪',
    hoursPerWeek: '每周工作小时',
    annualSalary: '年薪',
    yourWageAs: '您的工资为:',
    daily: '日薪',
    monthly: '月薪',
    weekly: '周薪',
    biweekly: '双周薪',
    salarySettings: '工资设置',
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
    wageCalculator: '給与計算機',
    wageCalculatorDescription: '異なる期間の給与を計算する',
    hourlyWage: '時給',
    hoursPerWeek: '週間労働時間',
    annualSalary: '年収',
    yourWageAs: '給与として:',
    daily: '日給',
    monthly: '月給',
    weekly: '週給',
    biweekly: '隔週給',
    salarySettings: '給与設定',
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
    wageCalculator: 'Калькулятор зарплаты',
    wageCalculatorDescription: 'Рассчитайте вашу зарплату за разные периоды',
    hourlyWage: 'Почасовая оплата',
    hoursPerWeek: 'Часов в неделю',
    annualSalary: 'Годовая зарплата',
    yourWageAs: 'Ваша зарплата как:',
    daily: 'Дневная',
    monthly: 'Месячная',
    weekly: 'Недельная',
    biweekly: 'Раз в две недели',
    salarySettings: 'Настройки зарплаты',
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
    wageCalculator: 'حاسبة الراتب',
    wageCalculatorDescription: 'احسب راتبك لفترات مختلفة',
    hourlyWage: 'الأجر بالساعة',
    hoursPerWeek: 'ساعات في الأسبوع',
    annualSalary: 'الراتب السنوي',
    yourWageAs: 'راتبك كـ:',
    daily: 'يومي',
    monthly: 'شهري',
    weekly: 'أسبوعي',
    biweekly: 'كل أسبوعين',
    salarySettings: 'إعدادات الراتب',
  },
}

// Translation helper function
const t = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations.en[key] || key
}

// Country names translations
const countryTranslations = {
  en: {
    'United States': 'United States',
    'Eurozone': 'Eurozone',
    'Brazil': 'Brazil',
    'United Kingdom': 'United Kingdom',
    'Japan': 'Japan',
    'Australia': 'Australia',
    'Canada': 'Canada',
    'Switzerland': 'Switzerland',
    'China': 'China',
    'India': 'India',
    'Mexico': 'Mexico',
    'Singapore': 'Singapore',
    'Hong Kong': 'Hong Kong',
    'New Zealand': 'New Zealand',
    'Sweden': 'Sweden',
    'Norway': 'Norway',
    'Denmark': 'Denmark',
    'Poland': 'Poland',
    'Russia': 'Russia',
    'South Africa': 'South Africa',
    'South Korea': 'South Korea',
    'Turkey': 'Turkey',
    'Thailand': 'Thailand',
    'Indonesia': 'Indonesia',
    'Malaysia': 'Malaysia',
    'Philippines': 'Philippines',
    'Vietnam': 'Vietnam',
    'Argentina': 'Argentina',
    'Chile': 'Chile',
    'Colombia': 'Colombia',
    'Peru': 'Peru',
    'Egypt': 'Egypt',
    'Israel': 'Israel',
    'United Arab Emirates': 'United Arab Emirates',
    'Saudi Arabia': 'Saudi Arabia',
    'Bahamas': 'Bahamas',
    'Bhutan': 'Bhutan',
    'Botswana': 'Botswana',
    'Belarus': 'Belarus',
    'Bulgaria': 'Bulgaria',
    'Bahrain': 'Bahrain',
    'Barbados': 'Barbados',
    'Belize': 'Belize',
    'Bolivia': 'Bolivia',
    'Bosnia and Herzegovina': 'Bosnia and Herzegovina',
    'Brunei': 'Brunei',
    'West African CFA': 'West African CFA',
    'Central African CFA': 'Central African CFA',
    'CFP Franc': 'CFP Franc',
    'Cambodia': 'Cambodia',
    'Cape Verde': 'Cape Verde',
    'Cayman Islands': 'Cayman Islands',
    'Costa Rica': 'Costa Rica',
    'Cuba': 'Cuba',
    'Czech Republic': 'Czech Republic',
    'Djibouti': 'Djibouti',
    'Dominican Republic': 'Dominican Republic',
    'East Caribbean': 'East Caribbean',
    'Eritrea': 'Eritrea',
    'Ethiopia': 'Ethiopia',
    'Fiji': 'Fiji',
    'Gambia': 'Gambia',
    'Georgia': 'Georgia',
    'Ghana': 'Ghana',
    'Guatemala': 'Guatemala',
    'Guinea': 'Guinea',
    'Guyana': 'Guyana',
    'Haiti': 'Haiti',
    'Honduras': 'Honduras',
    'Iceland': 'Iceland',
    'Iraq': 'Iraq',
    'Jamaica': 'Jamaica',
    'Jordan': 'Jordan',
    'Kazakhstan': 'Kazakhstan',
    'Kenya': 'Kenya',
    'Kuwait': 'Kuwait',
    'Kyrgyzstan': 'Kyrgyzstan',
    'Laos': 'Laos',
    'Lebanon': 'Lebanon',
    'Lesotho': 'Lesotho',
    'Liberia': 'Liberia',
    'Libya': 'Libya',
    'Macau': 'Macau',
    'North Macedonia': 'North Macedonia',
    'Madagascar': 'Madagascar',
    'Malawi': 'Malawi',
    'Maldives': 'Maldives',
    'Mauritius': 'Mauritius',
    'Moldova': 'Moldova',
    'Mongolia': 'Mongolia',
    'Morocco': 'Morocco',
    'Mozambique': 'Mozambique',
    'Myanmar': 'Myanmar',
    'Namibia': 'Namibia',
    'Nepal': 'Nepal',
    'Nicaragua': 'Nicaragua',
    'Nigeria': 'Nigeria',
    'Oman': 'Oman',
    'Pakistan': 'Pakistan',
    'Papua New Guinea': 'Papua New Guinea',
    'Paraguay': 'Paraguay',
    'Qatar': 'Qatar',
    'Romania': 'Romania',
    'Rwanda': 'Rwanda',
    'Samoa': 'Samoa',
    'São Tomé and Príncipe': 'São Tomé and Príncipe',
    'Serbia': 'Serbia',
    'Seychelles': 'Seychelles',
    'Sierra Leone': 'Sierra Leone',
    'Solomon Islands': 'Solomon Islands',
    'Somalia': 'Somalia',
    'Sri Lanka': 'Sri Lanka',
    'Sudan': 'Sudan',
    'Suriname': 'Suriname',
    'Eswatini': 'Eswatini',
    'Tajikistan': 'Tajikistan',
    'Tanzania': 'Tanzania',
    'Tonga': 'Tonga',
    'Trinidad and Tobago': 'Trinidad and Tobago',
    'Tunisia': 'Tunisia',
    'Uganda': 'Uganda',
    'Ukraine': 'Ukraine',
    'Uruguay': 'Uruguay',
    'Uzbekistan': 'Uzbekistan',
    'Vanuatu': 'Vanuatu',
    'Yemen': 'Yemen',
    'Zambia': 'Zambia',
    'Zimbabwe': 'Zimbabwe',
  },
  es: {
    'United States': 'Estados Unidos',
    'Eurozone': 'Eurozona',
    'Brazil': 'Brasil',
    'United Kingdom': 'Reino Unido',
    'Japan': 'Japón',
    'Australia': 'Australia',
    'Canada': 'Canadá',
    'Switzerland': 'Suiza',
    'China': 'China',
    'India': 'India',
    'Mexico': 'México',
    'Singapore': 'Singapur',
    'Hong Kong': 'Hong Kong',
    'New Zealand': 'Nueva Zelanda',
    'Sweden': 'Suecia',
    'Norway': 'Noruega',
    'Denmark': 'Dinamarca',
    'Poland': 'Polonia',
    'Russia': 'Rusia',
    'South Africa': 'Sudáfrica',
    'South Korea': 'Corea del Sur',
    'Turkey': 'Turquía',
    'Thailand': 'Tailandia',
    'Indonesia': 'Indonesia',
    'Malaysia': 'Malasia',
    'Philippines': 'Filipinas',
    'Vietnam': 'Vietnam',
    'Argentina': 'Argentina',
    'Chile': 'Chile',
    'Colombia': 'Colombia',
    'Peru': 'Perú',
    'Egypt': 'Egipto',
    'Israel': 'Israel',
    'United Arab Emirates': 'Emiratos Árabes Unidos',
    'Saudi Arabia': 'Arabia Saudita',
    'Bahamas': 'Bahamas',
    'Bhutan': 'Bután',
    'Botswana': 'Botsuana',
    'Belarus': 'Bielorrusia',
    'Bulgaria': 'Bulgaria',
    'Bahrain': 'Baréin',
    'Barbados': 'Barbados',
    'Belize': 'Belice',
    'Bolivia': 'Bolivia',
    'Bosnia and Herzegovina': 'Bosnia y Herzegovina',
    'Brunei': 'Brunéi',
    'West African CFA': 'Franco CFA de África Occidental',
    'Central African CFA': 'Franco CFA de África Central',
    'CFP Franc': 'Franco CFP',
    'Cambodia': 'Camboya',
    'Cape Verde': 'Cabo Verde',
    'Cayman Islands': 'Islas Caimán',
    'Costa Rica': 'Costa Rica',
    'Cuba': 'Cuba',
    'Czech Republic': 'República Checa',
    'Djibouti': 'Yibuti',
    'Dominican Republic': 'República Dominicana',
    'East Caribbean': 'Caribe Oriental',
    'Eritrea': 'Eritrea',
    'Ethiopia': 'Etiopía',
    'Fiji': 'Fiyi',
    'Gambia': 'Gambia',
    'Georgia': 'Georgia',
    'Ghana': 'Ghana',
    'Guatemala': 'Guatemala',
    'Guinea': 'Guinea',
    'Guyana': 'Guyana',
    'Haiti': 'Haití',
    'Honduras': 'Honduras',
    'Iceland': 'Islandia',
    'Iraq': 'Irak',
    'Jamaica': 'Jamaica',
    'Jordan': 'Jordania',
    'Kazakhstan': 'Kazajistán',
    'Kenya': 'Kenia',
    'Kuwait': 'Kuwait',
    'Kyrgyzstan': 'Kirguistán',
    'Laos': 'Laos',
    'Lebanon': 'Líbano',
    'Lesotho': 'Lesoto',
    'Liberia': 'Liberia',
    'Libya': 'Libia',
    'Macau': 'Macao',
    'North Macedonia': 'Macedonia del Norte',
    'Madagascar': 'Madagascar',
    'Malawi': 'Malaui',
    'Maldives': 'Maldivas',
    'Mauritius': 'Mauricio',
    'Moldova': 'Moldavia',
    'Mongolia': 'Mongolia',
    'Morocco': 'Marruecos',
    'Mozambique': 'Mozambique',
    'Myanmar': 'Myanmar',
    'Namibia': 'Namibia',
    'Nepal': 'Nepal',
    'Nicaragua': 'Nicaragua',
    'Nigeria': 'Nigeria',
    'Oman': 'Omán',
    'Pakistan': 'Pakistán',
    'Papua New Guinea': 'Papúa Nueva Guinea',
    'Paraguay': 'Paraguay',
    'Qatar': 'Catar',
    'Romania': 'Rumania',
    'Rwanda': 'Ruanda',
    'Samoa': 'Samoa',
    'São Tomé and Príncipe': 'Santo Tomé y Príncipe',
    'Serbia': 'Serbia',
    'Seychelles': 'Seychelles',
    'Sierra Leone': 'Sierra Leona',
    'Solomon Islands': 'Islas Salomón',
    'Somalia': 'Somalia',
    'Sri Lanka': 'Sri Lanka',
    'Sudan': 'Sudán',
    'Suriname': 'Surinam',
    'Eswatini': 'Esuatini',
    'Tajikistan': 'Tayikistán',
    'Tanzania': 'Tanzania',
    'Tonga': 'Tonga',
    'Trinidad and Tobago': 'Trinidad y Tobago',
    'Tunisia': 'Túnez',
    'Uganda': 'Uganda',
    'Ukraine': 'Ucrania',
    'Uruguay': 'Uruguay',
    'Uzbekistan': 'Uzbekistán',
    'Vanuatu': 'Vanuatu',
    'Yemen': 'Yemen',
    'Zambia': 'Zambia',
    'Zimbabwe': 'Zimbabue',
  },
  pt: {
    'United States': 'Estados Unidos',
    'Eurozone': 'Zona do Euro',
    'Brazil': 'Brasil',
    'United Kingdom': 'Reino Unido',
    'Japan': 'Japão',
    'Australia': 'Austrália',
    'Canada': 'Canadá',
    'Switzerland': 'Suíça',
    'China': 'China',
    'India': 'Índia',
    'Mexico': 'México',
    'Singapore': 'Singapura',
    'Hong Kong': 'Hong Kong',
    'New Zealand': 'Nova Zelândia',
    'Sweden': 'Suécia',
    'Norway': 'Noruega',
    'Denmark': 'Dinamarca',
    'Poland': 'Polônia',
    'Russia': 'Rússia',
    'South Africa': 'África do Sul',
    'South Korea': 'Coreia do Sul',
    'Turkey': 'Turquia',
    'Thailand': 'Tailândia',
    'Indonesia': 'Indonésia',
    'Malaysia': 'Malásia',
    'Philippines': 'Filipinas',
    'Vietnam': 'Vietnã',
    'Argentina': 'Argentina',
    'Chile': 'Chile',
    'Colombia': 'Colômbia',
    'Peru': 'Peru',
    'Egypt': 'Egito',
    'Israel': 'Israel',
    'United Arab Emirates': 'Emirados Árabes Unidos',
    'Saudi Arabia': 'Arábia Saudita',
    'Bahamas': 'Bahamas',
    'Bhutan': 'Butão',
    'Botswana': 'Botsuana',
    'Belarus': 'Bielorrússia',
    'Bulgaria': 'Bulgária',
    'Bahrain': 'Bahrein',
    'Barbados': 'Barbados',
    'Belize': 'Belize',
    'Bolivia': 'Bolívia',
    'Bosnia and Herzegovina': 'Bósnia e Herzegovina',
    'Brunei': 'Brunei',
    'West African CFA': 'Franco CFA da África Ocidental',
    'Central African CFA': 'Franco CFA da África Central',
    'CFP Franc': 'Franco CFP',
    'Cambodia': 'Camboja',
    'Cape Verde': 'Cabo Verde',
    'Cayman Islands': 'Ilhas Cayman',
    'Costa Rica': 'Costa Rica',
    'Cuba': 'Cuba',
    'Czech Republic': 'República Tcheca',
    'Djibouti': 'Djibuti',
    'Dominican Republic': 'República Dominicana',
    'East Caribbean': 'Caribe Oriental',
    'Eritrea': 'Eritreia',
    'Ethiopia': 'Etiópia',
    'Fiji': 'Fiji',
    'Gambia': 'Gâmbia',
    'Georgia': 'Geórgia',
    'Ghana': 'Gana',
    'Guatemala': 'Guatemala',
    'Guinea': 'Guiné',
    'Guyana': 'Guiana',
    'Haiti': 'Haiti',
    'Honduras': 'Honduras',
    'Iceland': 'Islândia',
    'Iraq': 'Iraque',
    'Jamaica': 'Jamaica',
    'Jordan': 'Jordânia',
    'Kazakhstan': 'Cazaquistão',
    'Kenya': 'Quênia',
    'Kuwait': 'Kuwait',
    'Kyrgyzstan': 'Quirguistão',
    'Laos': 'Laos',
    'Lebanon': 'Líbano',
    'Lesotho': 'Lesoto',
    'Liberia': 'Libéria',
    'Libya': 'Líbia',
    'Macau': 'Macau',
    'North Macedonia': 'Macedônia do Norte',
    'Madagascar': 'Madagascar',
    'Malawi': 'Malawi',
    'Maldives': 'Maldivas',
    'Mauritius': 'Maurício',
    'Moldova': 'Moldávia',
    'Mongolia': 'Mongólia',
    'Morocco': 'Marrocos',
    'Mozambique': 'Moçambique',
    'Myanmar': 'Mianmar',
    'Namibia': 'Namíbia',
    'Nepal': 'Nepal',
    'Nicaragua': 'Nicarágua',
    'Nigeria': 'Nigéria',
    'Oman': 'Omã',
    'Pakistan': 'Paquistão',
    'Papua New Guinea': 'Papua-Nova Guiné',
    'Paraguay': 'Paraguai',
    'Qatar': 'Catar',
    'Romania': 'Romênia',
    'Rwanda': 'Ruanda',
    'Samoa': 'Samoa',
    'São Tomé and Príncipe': 'São Tomé e Príncipe',
    'Serbia': 'Sérvia',
    'Seychelles': 'Seicheles',
    'Sierra Leone': 'Serra Leoa',
    'Solomon Islands': 'Ilhas Salomão',
    'Somalia': 'Somália',
    'Sri Lanka': 'Sri Lanka',
    'Sudan': 'Sudão',
    'Suriname': 'Suriname',
    'Eswatini': 'Essuatíni',
    'Tajikistan': 'Tajiquistão',
    'Tanzania': 'Tanzânia',
    'Tonga': 'Tonga',
    'Trinidad and Tobago': 'Trindade e Tobago',
    'Tunisia': 'Tunísia',
    'Uganda': 'Uganda',
    'Ukraine': 'Ucrânia',
    'Uruguay': 'Uruguai',
    'Uzbekistan': 'Uzbequistão',
    'Vanuatu': 'Vanuatu',
    'Yemen': 'Iêmen',
    'Zambia': 'Zâmbia',
    'Zimbabwe': 'Zimbábue',
  },
  de: {
    'United States': 'Vereinigte Staaten',
    'Eurozone': 'Eurozone',
    'Brazil': 'Brasilien',
    'United Kingdom': 'Vereinigtes Königreich',
    'Japan': 'Japan',
    'Australia': 'Australien',
    'Canada': 'Kanada',
    'Switzerland': 'Schweiz',
    'China': 'China',
    'India': 'Indien',
    'Mexico': 'Mexiko',
    'Singapore': 'Singapur',
    'Hong Kong': 'Hongkong',
    'New Zealand': 'Neuseeland',
    'Sweden': 'Schweden',
    'Norway': 'Norwegen',
    'Denmark': 'Dänemark',
    'Poland': 'Polen',
    'Russia': 'Russland',
    'South Africa': 'Südafrika',
    'South Korea': 'Südkorea',
    'Turkey': 'Türkei',
    'Thailand': 'Thailand',
    'Indonesia': 'Indonesien',
    'Malaysia': 'Malaysia',
    'Philippines': 'Philippinen',
    'Vietnam': 'Vietnam',
    'Argentina': 'Argentinien',
    'Chile': 'Chile',
    'Colombia': 'Kolumbien',
    'Peru': 'Peru',
    'Egypt': 'Ägypten',
    'Israel': 'Israel',
    'United Arab Emirates': 'Vereinigte Arabische Emirate',
    'Saudi Arabia': 'Saudi-Arabien',
    'Bahamas': 'Bahamas',
    'Bhutan': 'Bhutan',
    'Botswana': 'Botswana',
    'Belarus': 'Weißrussland',
    'Bulgaria': 'Bulgarien',
    'Bahrain': 'Bahrain',
    'Barbados': 'Barbados',
    'Belize': 'Belize',
    'Bolivia': 'Bolivien',
    'Bosnia and Herzegovina': 'Bosnien und Herzegovina',
    'Brunei': 'Brunei',
    'West African CFA': 'Westafrikanischer CFA-Franc',
    'Central African CFA': 'Zentralafrikanischer CFA-Franc',
    'CFP Franc': 'CFP-Franc',
    'Cambodia': 'Kambodscha',
    'Cape Verde': 'Kap Verde',
    'Cayman Islands': 'Kaimaninseln',
    'Costa Rica': 'Costa Rica',
    'Cuba': 'Kuba',
    'Czech Republic': 'Tschechische Republik',
    'Djibouti': 'Dschibuti',
    'Dominican Republic': 'Dominikanische Republik',
    'East Caribbean': 'Ostkaribik',
    'Eritrea': 'Eritrea',
    'Ethiopia': 'Äthiopien',
    'Fiji': 'Fidschi',
    'Gambia': 'Gambia',
    'Georgia': 'Georgien',
    'Ghana': 'Ghana',
    'Guatemala': 'Guatemala',
    'Guinea': 'Guinea',
    'Guyana': 'Guyana',
    'Haiti': 'Haiti',
    'Honduras': 'Honduras',
    'Iceland': 'Island',
    'Iraq': 'Irak',
    'Jamaica': 'Jamaika',
    'Jordan': 'Jordanien',
    'Kazakhstan': 'Kasachstan',
    'Kenya': 'Kenia',
    'Kuwait': 'Kuwait',
    'Kyrgyzstan': 'Kirgisistan',
    'Laos': 'Laos',
    'Lebanon': 'Libanon',
    'Lesotho': 'Lesotho',
    'Liberia': 'Liberia',
    'Libya': 'Libyen',
    'Macau': 'Macau',
    'North Macedonia': 'Nordmazedonien',
    'Madagascar': 'Madagaskar',
    'Malawi': 'Malawi',
    'Maldives': 'Malediven',
    'Mauritius': 'Mauritius',
    'Moldova': 'Moldau',
    'Mongolia': 'Mongolei',
    'Morocco': 'Marokko',
    'Mozambique': 'Mosambik',
    'Myanmar': 'Myanmar',
    'Namibia': 'Namibia',
    'Nepal': 'Nepal',
    'Nicaragua': 'Nicaragua',
    'Nigeria': 'Nigeria',
    'Oman': 'Oman',
    'Pakistan': 'Pakistan',
    'Papua New Guinea': 'Papua-Neuguinea',
    'Paraguay': 'Paraguay',
    'Qatar': 'Katar',
    'Romania': 'Rumänien',
    'Rwanda': 'Ruanda',
    'Samoa': 'Samoa',
    'São Tomé and Príncipe': 'São Tomé und Príncipe',
    'Serbia': 'Serbien',
    'Seychelles': 'Seychellen',
    'Sierra Leone': 'Sierra Leone',
    'Solomon Islands': 'Salomonen',
    'Somalia': 'Somalia',
    'Sri Lanka': 'Sri Lanka',
    'Sudan': 'Sudan',
    'Suriname': 'Suriname',
    'Eswatini': 'Eswatini',
    'Tajikistan': 'Tadschikistan',
    'Tanzania': 'Tansania',
    'Tonga': 'Tonga',
    'Trinidad and Tobago': 'Trinidad und Tobago',
    'Tunisia': 'Tunesien',
    'Uganda': 'Uganda',
    'Ukraine': 'Ukraine',
    'Uruguay': 'Uruguay',
    'Uzbekistan': 'Usbekistan',
    'Vanuatu': 'Vanuatu',
    'Yemen': 'Jemen',
    'Zambia': 'Sambia',
    'Zimbabwe': 'Simbabwe',
  },
  zh: {
    'United States': '美国',
    'Eurozone': '欧元区',
    'Brazil': '巴西',
    'United Kingdom': '英国',
    'Japan': '日本',
    'Australia': '澳大利亚',
    'Canada': '加拿大',
    'Switzerland': '瑞士',
    'China': '中国',
    'India': '印度',
    'Mexico': '墨西哥',
    'Singapore': '新加坡',
    'Hong Kong': '香港',
    'New Zealand': '新西兰',
    'Sweden': '瑞典',
    'Norway': '挪威',
    'Denmark': '丹麦',
    'Poland': '波兰',
    'Russia': '俄罗斯',
    'South Africa': '南非',
    'South Korea': '韩国',
    'Turkey': '土耳其',
    'Thailand': '泰国',
    'Indonesia': '印度尼西亚',
    'Malaysia': '马来西亚',
    'Philippines': '菲律宾',
    'Vietnam': '越南',
    'Argentina': '阿根廷',
    'Chile': '智利',
    'Colombia': '哥伦比亚',
    'Peru': '秘鲁',
    'Egypt': '埃及',
    'Israel': '以色列',
    'United Arab Emirates': '阿拉伯联合酋长国',
    'Saudi Arabia': '沙特阿拉伯',
    'Bahamas': '巴哈马',
    'Bhutan': '不丹',
    'Botswana': '博茨瓦纳',
    'Belarus': '白俄罗斯',
    'Bulgaria': '保加利亚',
    'Bahrain': '巴林',
    'Barbados': '巴巴多斯',
    'Belize': '伯利兹',
    'Bolivia': '玻利维亚',
    'Bosnia and Herzegovina': '波斯尼亚和黑塞哥维那',
    'Brunei': '文莱',
    'West African CFA': '西非非洲法郎',
    'Central African CFA': '中非非洲法郎',
    'CFP Franc': '太平洋法郎',
    'Cambodia': '柬埔寨',
    'Cape Verde': '佛得角',
    'Cayman Islands': '开曼群岛',
    'Costa Rica': '哥斯达黎加',
    'Cuba': '古巴',
    'Czech Republic': '捷克',
    'Djibouti': '吉布提',
    'Dominican Republic': '多米尼加共和国',
    'East Caribbean': '东加勒比',
    'Eritrea': '厄立特里亚',
    'Ethiopia': '埃塞俄比亚',
    'Fiji': '斐济',
    'Gambia': '冈比亚',
    'Georgia': '格鲁吉亚',
    'Ghana': '加纳',
    'Guatemala': '危地马拉',
    'Guinea': '几内亚',
    'Guyana': '圭亚那',
    'Haiti': '海地',
    'Honduras': '洪都拉斯',
    'Iceland': '冰岛',
    'Iraq': '伊拉克',
    'Jamaica': '牙买加',
    'Jordan': '约旦',
    'Kazakhstan': '哈萨克斯坦',
    'Kenya': '肯尼亚',
    'Kuwait': '科威特',
    'Kyrgyzstan': '吉尔吉斯斯坦',
    'Laos': '老挝',
    'Lebanon': '黎巴嫩',
    'Lesotho': '莱索托',
    'Liberia': '利比里亚',
    'Libya': '利比亚',
    'Macau': '澳门',
    'North Macedonia': '北马其顿',
    'Madagascar': '马达加斯加',
    'Malawi': '马拉维',
    'Maldives': '马尔代夫',
    'Mauritius': '毛里求斯',
    'Moldova': '摩尔多瓦',
    'Mongolia': '蒙古',
    'Morocco': '摩洛哥',
    'Mozambique': '莫桑比克',
    'Myanmar': '缅甸',
    'Namibia': '纳米比亚',
    'Nepal': '尼泊尔',
    'Nicaragua': '尼加拉瓜',
    'Nigeria': '尼日利亚',
    'Oman': '阿曼',
    'Pakistan': '巴基斯坦',
    'Papua New Guinea': '巴布亚新几内亚',
    'Paraguay': '巴拉圭',
    'Qatar': '卡塔尔',
    'Romania': '罗马尼亚',
    'Rwanda': '卢旺达',
    'Samoa': '萨摩亚',
    'São Tomé and Príncipe': '圣多美和普林西比',
    'Serbia': '塞尔维亚',
    'Seychelles': '塞舌尔',
    'Sierra Leone': '塞拉利昂',
    'Solomon Islands': '所罗门群岛',
    'Somalia': '索马里',
    'Sri Lanka': '斯里兰卡',
    'Sudan': '苏丹',
    'Suriname': '苏里南',
    'Eswatini': '斯威士兰',
    'Tajikistan': '塔吉克斯坦',
    'Tanzania': '坦桑尼亚',
    'Tonga': '汤加',
    'Trinidad and Tobago': '特立尼达和多巴哥',
    'Tunisia': '突尼斯',
    'Uganda': '乌干达',
    'Ukraine': '乌克兰',
    'Uruguay': '乌拉圭',
    'Uzbekistan': '乌兹别克斯坦',
    'Vanuatu': '瓦努阿图',
    'Yemen': '也门',
    'Zambia': '赞比亚',
    'Zimbabwe': '津巴布韦',
  },
  ja: {
    'United States': 'アメリカ合衆国',
    'Eurozone': 'ユーロ圏',
    'Brazil': 'ブラジル',
    'United Kingdom': 'イギリス',
    'Japan': '日本',
    'Australia': 'オーストラリア',
    'Canada': 'カナダ',
    'Switzerland': 'スイス',
    'China': '中国',
    'India': 'インド',
    'Mexico': 'メキシコ',
    'Singapore': 'シンガポール',
    'Hong Kong': '香港',
    'New Zealand': 'ニュージーランド',
    'Sweden': 'スウェーデン',
    'Norway': 'ノルウェー',
    'Denmark': 'デンマーク',
    'Poland': 'ポーランド',
    'Russia': 'ロシア',
    'South Africa': '南アフリカ',
    'South Korea': '韓国',
    'Turkey': 'トルコ',
    'Thailand': 'タイ',
    'Indonesia': 'インドネシア',
    'Malaysia': 'マレーシア',
    'Philippines': 'フィリピン',
    'Vietnam': 'ベトナム',
    'Argentina': 'アルゼンチン',
    'Chile': 'チリ',
    'Colombia': 'コロンビア',
    'Peru': 'ペルー',
    'Egypt': 'エジプト',
    'Israel': 'イスラエル',
    'United Arab Emirates': 'アラブ首長国連邦',
    'Saudi Arabia': 'サウジアラビア',
    'Bahamas': 'バハマ',
    'Bhutan': 'ブータン',
    'Botswana': 'ボツワナ',
    'Belarus': 'ベラルーシ',
    'Bulgaria': 'ブルガリア',
    'Bahrain': 'バーレーン',
    'Barbados': 'バルバドス',
    'Belize': 'ベリーズ',
    'Bolivia': 'ボリビア',
    'Bosnia and Herzegovina': 'ボスニア・ヘルツェゴビナ',
    'Brunei': 'ブルネイ',
    'West African CFA': '西アフリカCFAフラン',
    'Central African CFA': '中央アフリカCFAフラン',
    'CFP Franc': 'CFPフラン',
    'Cambodia': 'カンボジア',
    'Cape Verde': 'カーボベルデ',
    'Cayman Islands': 'ケイマン諸島',
    'Costa Rica': 'コスタリカ',
    'Cuba': 'キューバ',
    'Czech Republic': 'チェコ',
    'Djibouti': 'ジブチ',
    'Dominican Republic': 'ドミニカ共和国',
    'East Caribbean': '東カリブ',
    'Eritrea': 'エリトリア',
    'Ethiopia': 'エチオピア',
    'Fiji': 'フィジー',
    'Gambia': 'ガンビア',
    'Georgia': 'ジョージア',
    'Ghana': 'ガーナ',
    'Guatemala': 'グアテマラ',
    'Guinea': 'ギニア',
    'Guyana': 'ガイアナ',
    'Haiti': 'ハイチ',
    'Honduras': 'ホンジュラス',
    'Iceland': 'アイスランド',
    'Iraq': 'イラク',
    'Jamaica': 'ジャマイカ',
    'Jordan': 'ヨルダン',
    'Kazakhstan': 'カザフスタン',
    'Kenya': 'ケニア',
    'Kuwait': 'クウェート',
    'Kyrgyzstan': 'キルギス',
    'Laos': 'ラオス',
    'Lebanon': 'レバノン',
    'Lesotho': 'レソト',
    'Liberia': 'リベリア',
    'Libya': 'リビア',
    'Macau': 'マカオ',
    'North Macedonia': '北マケドニア',
    'Madagascar': 'マダガスカル',
    'Malawi': 'マラウイ',
    'Maldives': 'モルディブ',
    'Mauritius': 'モーリシャス',
    'Moldova': 'モルドバ',
    'Mongolia': 'モンゴル',
    'Morocco': 'モロッコ',
    'Mozambique': 'モザンビーク',
    'Myanmar': 'ミャンマー',
    'Namibia': 'ナミビア',
    'Nepal': 'ネパール',
    'Nicaragua': 'ニカラグア',
    'Nigeria': 'ナイジェリア',
    'Oman': 'オマーン',
    'Pakistan': 'パキスタン',
    'Papua New Guinea': 'パプアニューギニア',
    'Paraguay': 'パラグアイ',
    'Qatar': 'カタール',
    'Romania': 'ルーマニア',
    'Rwanda': 'ルワンダ',
    'Samoa': 'サモア',
    'São Tomé and Príncipe': 'サントメ・プリンシペ',
    'Serbia': 'セルビア',
    'Seychelles': 'セーシェル',
    'Sierra Leone': 'シエラレオネ',
    'Solomon Islands': 'ソロモン諸島',
    'Somalia': 'ソマリア',
    'Sri Lanka': 'スリランカ',
    'Sudan': 'スーダン',
    'Suriname': 'スリナム',
    'Eswatini': 'エスワティニ',
    'Tajikistan': 'タジキスタン',
    'Tanzania': 'タンザニア',
    'Tonga': 'トンガ',
    'Trinidad and Tobago': 'トリニダード・トバゴ',
    'Tunisia': 'チュニジア',
    'Uganda': 'ウガンダ',
    'Ukraine': 'ウクライナ',
    'Uruguay': 'ウルグアイ',
    'Uzbekistan': 'ウズベキスタン',
    'Vanuatu': 'バヌアツ',
    'Yemen': 'イエメン',
    'Zambia': 'ザンビア',
    'Zimbabwe': 'ジンバブエ',
  },
  ru: {
    'United States': 'Соединенные Штаты',
    'Eurozone': 'Еврозона',
    'Brazil': 'Бразилия',
    'United Kingdom': 'Великобритания',
    'Japan': 'Япония',
    'Australia': 'Австралия',
    'Canada': 'Канада',
    'Switzerland': 'Швейцария',
    'China': 'Китай',
    'India': 'Индия',
    'Mexico': 'Мексика',
    'Singapore': 'Сингапур',
    'Hong Kong': 'Гонконг',
    'New Zealand': 'Новая Зеландия',
    'Sweden': 'Швеция',
    'Norway': 'Норвегия',
    'Denmark': 'Дания',
    'Poland': 'Польша',
    'Russia': 'Россия',
    'South Africa': 'Южная Африка',
    'South Korea': 'Южная Корея',
    'Turkey': 'Турция',
    'Thailand': 'Таиланд',
    'Indonesia': 'Индонезия',
    'Malaysia': 'Малайзия',
    'Philippines': 'Филиппины',
    'Vietnam': 'Вьетнам',
    'Argentina': 'Аргентина',
    'Chile': 'Чили',
    'Colombia': 'Колумбия',
    'Peru': 'Перу',
    'Egypt': 'Египет',
    'Israel': 'Израиль',
    'United Arab Emirates': 'Объединенные Арабские Эмираты',
    'Saudi Arabia': 'Саудовская Аравия',
    'Bahamas': 'Багамы',
    'Bhutan': 'Бутан',
    'Botswana': 'Ботсвана',
    'Belarus': 'Беларусь',
    'Bulgaria': 'Болгария',
    'Bahrain': 'Бахрейн',
    'Barbados': 'Барбадос',
    'Belize': 'Белиз',
    'Bolivia': 'Боливия',
    'Bosnia and Herzegovina': 'Босния и Герцеговина',
    'Brunei': 'Бруней',
    'West African CFA': 'Западноафриканский франк КФА',
    'Central African CFA': 'Центральноафриканский франк КФА',
    'CFP Franc': 'Французский тихоокеанский франк',
    'Cambodia': 'Камбоджа',
    'Cape Verde': 'Кабо-Верде',
    'Cayman Islands': 'Каймановы острова',
    'Costa Rica': 'Коста-Рика',
    'Cuba': 'Куба',
    'Czech Republic': 'Чехия',
    'Djibouti': 'Джибути',
    'Dominican Republic': 'Доминиканская Республика',
    'East Caribbean': 'Восточно-карибский',
    'Eritrea': 'Эритрея',
    'Ethiopia': 'Эфиопия',
    'Fiji': 'Фиджи',
    'Gambia': 'Гамбия',
    'Georgia': 'Грузия',
    'Ghana': 'Гана',
    'Guatemala': 'Гватемала',
    'Guinea': 'Гвинея',
    'Guyana': 'Гайана',
    'Haiti': 'Гаити',
    'Honduras': 'Гондурас',
    'Iceland': 'Исландия',
    'Iraq': 'Ирак',
    'Jamaica': 'Ямайка',
    'Jordan': 'Иордания',
    'Kazakhstan': 'Казахстан',
    'Kenya': 'Кения',
    'Kuwait': 'Кувейт',
    'Kyrgyzstan': 'Киргизия',
    'Laos': 'Лаос',
    'Lebanon': 'Ливан',
    'Lesotho': 'Лесото',
    'Liberia': 'Либерия',
    'Libya': 'Ливия',
    'Macau': 'Макао',
    'North Macedonia': 'Северная Македония',
    'Madagascar': 'Мадагаскар',
    'Malawi': 'Малави',
    'Maldives': 'Мальдивы',
    'Mauritius': 'Маврикий',
    'Moldova': 'Молдова',
    'Mongolia': 'Монголия',
    'Morocco': 'Марокко',
    'Mozambique': 'Мозамбик',
    'Myanmar': 'Мьянма',
    'Namibia': 'Намибия',
    'Nepal': 'Непал',
    'Nicaragua': 'Никарагуа',
    'Nigeria': 'Нигерия',
    'Oman': 'Оман',
    'Pakistan': 'Пакистан',
    'Papua New Guinea': 'Папуа-Новая Гвинея',
    'Paraguay': 'Парагвай',
    'Qatar': 'Катар',
    'Romania': 'Румыния',
    'Rwanda': 'Руанда',
    'Samoa': 'Самоа',
    'São Tomé and Príncipe': 'Сан-Томе и Принсипи',
    'Serbia': 'Сербия',
    'Seychelles': 'Сейшелы',
    'Sierra Leone': 'Сьерра-Леоне',
    'Solomon Islands': 'Соломоновы острова',
    'Somalia': 'Сомали',
    'Sri Lanka': 'Шри-Ланка',
    'Sudan': 'Судан',
    'Suriname': 'Суринам',
    'Eswatini': 'Эсватини',
    'Tajikistan': 'Таджикистан',
    'Tanzania': 'Танзания',
    'Tonga': 'Тонга',
    'Trinidad and Tobago': 'Тринидад и Тобаго',
    'Tunisia': 'Тунис',
    'Uganda': 'Уганда',
    'Ukraine': 'Украина',
    'Uruguay': 'Уругвай',
    'Uzbekistan': 'Узбекистан',
    'Vanuatu': 'Вануату',
    'Yemen': 'Йемен',
    'Zambia': 'Замбия',
    'Zimbabwe': 'Зимбабве',
  },
  ar: {
    'United States': 'الولايات المتحدة',
    'Eurozone': 'منطقة اليورو',
    'Brazil': 'البرازيل',
    'United Kingdom': 'المملكة المتحدة',
    'Japan': 'اليابان',
    'Australia': 'أستراليا',
    'Canada': 'كندا',
    'Switzerland': 'سويسرا',
    'China': 'الصين',
    'India': 'الهند',
    'Mexico': 'المكسيك',
    'Singapore': 'سنغافورة',
    'Hong Kong': 'هونغ كونغ',
    'New Zealand': 'نيوزيلندا',
    'Sweden': 'السويد',
    'Norway': 'النرويج',
    'Denmark': 'الدنمارك',
    'Poland': 'بولندا',
    'Russia': 'روسيا',
    'South Africa': 'جنوب أفريقيا',
    'South Korea': 'كوريا الجنوبية',
    'Turkey': 'تركيا',
    'Thailand': 'تايلاند',
    'Indonesia': 'إندونيسيا',
    'Malaysia': 'ماليزيا',
    'Philippines': 'الفلبين',
    'Vietnam': 'فيتنام',
    'Argentina': 'الأرجنتين',
    'Chile': 'تشيلي',
    'Colombia': 'كولومبيا',
    'Peru': 'بيرو',
    'Egypt': 'مصر',
    'Israel': 'إسرائيل',
    'United Arab Emirates': 'الإمارات العربية المتحدة',
    'Saudi Arabia': 'السعودية',
    'Bahamas': 'البهاما',
    'Bhutan': 'بوتان',
    'Botswana': 'بوتسوانا',
    'Belarus': 'بيلاروسيا',
    'Bulgaria': 'بلغاريا',
    'Bahrain': 'البحرين',
    'Barbados': 'بربادوس',
    'Belize': 'بليز',
    'Bolivia': 'بوليفيا',
    'Bosnia and Herzegovina': 'البوسنة والهرسك',
    'Brunei': 'بروناي',
    'West African CFA': 'فرنك غرب أفريقيا',
    'Central African CFA': 'فرنك وسط أفريقيا',
    'CFP Franc': 'فرنك س ف ب',
    'Cambodia': 'كمبوديا',
    'Cape Verde': 'الرأس الأخضر',
    'Cayman Islands': 'جزر كايمان',
    'Costa Rica': 'كوستاريكا',
    'Cuba': 'كوبا',
    'Czech Republic': 'جمهورية التشيك',
    'Djibouti': 'جيبوتي',
    'Dominican Republic': 'جمهورية الدومينيكان',
    'East Caribbean': 'شرق الكاريبي',
    'Eritrea': 'إريتريا',
    'Ethiopia': 'إثيوبيا',
    'Fiji': 'فيجي',
    'Gambia': 'غامبيا',
    'Georgia': 'جورجيا',
    'Ghana': 'غانا',
    'Guatemala': 'غواتيمالا',
    'Guinea': 'غينيا',
    'Guyana': 'غيانا',
    'Haiti': 'هايتي',
    'Honduras': 'هندوراس',
    'Iceland': 'آيسلندا',
    'Iraq': 'العراق',
    'Jamaica': 'جامايكا',
    'Jordan': 'الأردن',
    'Kazakhstan': 'كازاخستان',
    'Kenya': 'كينيا',
    'Kuwait': 'الكويت',
    'Kyrgyzstan': 'قرغيزستان',
    'Laos': 'لاوس',
    'Lebanon': 'لبنان',
    'Lesotho': 'ليسوتو',
    'Liberia': 'ليبيريا',
    'Libya': 'ليبيا',
    'Macau': 'ماكاو',
    'North Macedonia': 'مقدونيا الشمالية',
    'Madagascar': 'مدغشقر',
    'Malawi': 'مالاوي',
    'Maldives': 'جزر المالديف',
    'Mauritius': 'موريشيوس',
    'Moldova': 'مولدوفا',
    'Mongolia': 'منغوليا',
    'Morocco': 'المغرب',
    'Mozambique': 'موزمبيق',
    'Myanmar': 'ميانمار',
    'Namibia': 'ناميبيا',
    'Nepal': 'نيبال',
    'Nicaragua': 'نيكاراغوا',
    'Nigeria': 'نيجيريا',
    'Oman': 'عمان',
    'Pakistan': 'باكستان',
    'Papua New Guinea': 'بابوا غينيا الجديدة',
    'Paraguay': 'باراغواي',
    'Qatar': 'قطر',
    'Romania': 'رومانيا',
    'Rwanda': 'رواندا',
    'Samoa': 'ساموا',
    'São Tomé and Príncipe': 'ساو تومي وبرينسيبي',
    'Serbia': 'صربيا',
    'Seychelles': 'سيشل',
    'Sierra Leone': 'سيراليون',
    'Solomon Islands': 'جزر سليمان',
    'Somalia': 'الصومال',
    'Sri Lanka': 'سريلانكا',
    'Sudan': 'السودان',
    'Suriname': 'سورينام',
    'Eswatini': 'إسواتيني',
    'Tajikistan': 'طاجيكستان',
    'Tanzania': 'تنزانيا',
    'Tonga': 'تونغا',
    'Trinidad and Tobago': 'ترينيداد وتوباغو',
    'Tunisia': 'تونس',
    'Uganda': 'أوغندا',
    'Ukraine': 'أوكرانيا',
    'Uruguay': 'الأوروغواي',
    'Uzbekistan': 'أوزبكستان',
    'Vanuatu': 'فانواتو',
    'Yemen': 'اليمن',
    'Zambia': 'زامبيا',
    'Zimbabwe': 'زيمبابوي',
  },
}

// Helper function to get translated country name
const getTranslatedCountryName = (countryName, lang = 'en') => {
  return countryTranslations[lang]?.[countryName] || countryTranslations.en[countryName] || countryName
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
  const [isAddingSite, setIsAddingSite] = useState(false)
  const [wagePopoverOpen, setWagePopoverOpen] = useState(false)
  const [hourlyWage, setHourlyWage] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('40')
  const [spacingMode, setSpacingMode] = useState('default')

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

  const buildCurrencyList = useCallback((codes, lang = 'en') => {
    return codes
      .filter(code => currencyInfo[code] && currencyInfo[code].country)
      .map(code => {
        const info = currencyInfo[code]
        const upperCode = code.toUpperCase()
        const translatedCountry = getTranslatedCountryName(info.country, lang)
        return {
          code: upperCode,
          country: info.country, // Keep original for reference
          translatedCountry: translatedCountry, // Translated country name
          symbol: info.symbol,
          flag: info.flag,
          displayText: `${info.flag} ${translatedCountry} | ${upperCode} | ${info.symbol}`
        }
      })
      .sort((a, b) => a.code.localeCompare(b.code))
  }, [])

  const fetchCurrencies = useCallback(async (lang = 'en') => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      
      if (data.result === 'success' && data.conversion_rates) {
        const codes = Object.keys(data.conversion_rates)
        const currencyList = buildCurrencyList(codes, lang)
        setCurrencies(currencyList)
      } else {
        setupDefaultCurrencies(lang)
      }
    } catch (error) {
      console.error('Error fetching currencies:', error)
      setupDefaultCurrencies(lang)
    }
  }, [buildCurrencyList])

  const setupDefaultCurrencies = useCallback((lang = 'en') => {
    const defaults = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'AUD', 'CAD']
    const currencyList = buildCurrencyList(defaults, lang)
    setCurrencies(currencyList)
  }, [buildCurrencyList])

  const updateCurrencyDisplay = useCallback((code) => {
    if (code && currencyInfo[code]) {
      setCurrencyDisplay(currencyInfo[code].symbol)
    } else {
      setCurrencyDisplay('-')
    }
  }, [])

  const loadSavedSettings = useCallback(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['userSalary', 'userCurrency', 'userLanguage', 'whitelist', 'spacingMode'], (data) => {
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
        
        // Load spacing mode preference
        if (data.spacingMode) {
          setSpacingMode(data.spacingMode)
        }
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
    fetchCurrencies(language)
  }, [fetchCurrencies, language])

  useEffect(() => {
    if (currencies.length > 0) {
      loadSavedSettings()
    }
  }, [currencies, loadSavedSettings])

  // Update currency display text when language changes
  useEffect(() => {
    if (currencies.length > 0) {
      const updatedCurrencies = currencies.map(curr => {
        const translatedCountry = getTranslatedCountryName(curr.country, language)
        return {
          ...curr,
          translatedCountry: translatedCountry,
          displayText: `${curr.flag} ${translatedCountry} | ${curr.code} | ${curr.symbol}`
        }
      })
      setCurrencies(updatedCurrencies)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  useEffect(() => {
    updateCurrencyDisplay(currency)
  }, [currency, updateCurrencyDisplay])

  // Update main salary field when monthly wage is calculated from hourly wage
  useEffect(() => {
    const hourly = parseFormattedNumber(hourlyWage, currency)
    const hours = parseFloat(hoursPerWeek) || 0
    if (hourly > 0 && hours > 0) {
      // Monthly = hourly * hours per week * (52/12) weeks
      const monthly = hourly * hours * (52 / 12)
      const centsValue = Math.round(monthly * 100).toString()
      setSalary(formatNumber(centsValue, currency))
    }
  }, [hourlyWage, hoursPerWeek, currency, formatNumber])

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
        userCurrency: selectedCurrency,
        spacingMode: spacingMode
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
  
  // Save spacing mode immediately when it changes
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ spacingMode: spacingMode }, () => {
        // Reload active tab to apply changes
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if(tabs[0]) chrome.tabs.reload(tabs[0].id)
        })
      })
    }
  }, [spacingMode])

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
    
    setIsAddingSite(true)
    
    const newWhitelist = [...whitelist, normalizedSite]
    setWhitelist(newWhitelist)
    setSiteInput('')
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ whitelist: newWhitelist }, () => {
        setIsAddingSite(false)
        setStatus({ 
          show: true, 
          message: `${t('siteAddedToWhitelist', language)}: ${normalizedSite}` 
        })
        setTimeout(() => setStatus({ show: false, message: '' }), 3000)
      })
    } else {
      // Fallback for non-chrome environments (development)
      setTimeout(() => {
        setIsAddingSite(false)
        setStatus({ 
          show: true, 
          message: `${t('siteAddedToWhitelist', language)}: ${normalizedSite}` 
        })
        setTimeout(() => setStatus({ show: false, message: '' }), 3000)
      }, 300)
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
          <RadioGroup value={spacingMode} onValueChange={setSpacingMode} className="flex gap-6">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency" className="sr-only">{t('chooseCurrency', language)}</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                aria-label={selectedCurrency ? `${t('chooseCurrency', language)}: ${selectedCurrency.displayText}` : t('chooseCurrency', language)}
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
            <PopoverContent className="w-[320px] p-0" align="start" aria-label={t('chooseCurrency', language)}>
              <Command>
                <CommandInput placeholder={t('searchCurrency', language)} className="h-9" aria-label={t('searchCurrency', language)} />
                <CommandList aria-label={t('chooseCurrency', language)}>
                  <CommandEmpty>{t('noCurrencyFound', language)}</CommandEmpty>
                  <CommandGroup aria-label={t('chooseCurrency', language)}>
                    {currencies.map((curr) => (
                      <CommandItem
                        key={curr.code}
                        value={`${curr.code} ${curr.translatedCountry || curr.country} ${curr.symbol}`}
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
            <div className="absolute left-3 top-1 bottom-1 flex items-center text-base md:text-sm pointer-events-none z-10 text-muted-foreground m-0">
              {currencyDisplay}
            </div>
            <Input
              id="salary"
              type="text"
              placeholder="0"
              value={salary}
              onChange={handleSalaryChange}
              className={`pl-12 pr-10 ${error.field === 'salary' ? 'border-destructive' : ''}`}
              inputMode="numeric"
            />
            <Popover open={wagePopoverOpen} onOpenChange={setWagePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 bottom-1 h-auto w-8 text-muted-foreground hover:text-foreground"
                  aria-label={t('salarySettings', language)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{t('wageCalculator', language)}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t('wageCalculatorDescription', language)}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="hourly-wage" className="text-xs">{t('hourlyWage', language)}</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1 bottom-1 flex items-center text-sm pointer-events-none z-10 text-muted-foreground">
                          {currencyDisplay}
                        </div>
                        <Input
                          id="hourly-wage"
                          type="text"
                          placeholder="0"
                          value={hourlyWage}
                          onChange={(e) => {
                            const value = e.target.value
                            const digitsOnly = value.replace(/\D/g, '')
                            if (digitsOnly) {
                              setHourlyWage(formatNumber(digitsOnly, currency))
                            } else {
                              setHourlyWage('')
                            }
                          }}
                          className="pl-10 h-8 text-sm"
                          inputMode="numeric"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="hours-per-week" className="text-xs">{t('hoursPerWeek', language)}</Label>
                      <Input
                        id="hours-per-week"
                        type="number"
                        placeholder="40"
                        value={hoursPerWeek}
                        onChange={(e) => setHoursPerWeek(e.target.value)}
                        className="h-8 text-sm"
                        min="1"
                        max="168"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="annual-salary" className="text-xs">{t('annualSalary', language)}</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1 bottom-1 flex items-center text-sm pointer-events-none z-10 text-muted-foreground">
                          {currencyDisplay}
                        </div>
                        <Input
                          id="annual-salary"
                          type="text"
                          placeholder="0"
                          value={(() => {
                            const hourly = parseFormattedNumber(hourlyWage, currency)
                            const hours = parseFloat(hoursPerWeek) || 0
                            if (hourly > 0 && hours > 0) {
                              // Annual = hourly * hours per week * 52 weeks
                              const annual = hourly * hours * 52
                              const centsValue = Math.round(annual * 100).toString()
                              return formatNumber(centsValue, currency)
                            }
                            return ''
                          })()}
                          readOnly
                          className="pl-10 h-8 text-sm bg-muted"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <h5 className="font-medium text-xs">{t('yourWageAs', language)}</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{t('daily', language)}</Label>
                        <div className="text-sm font-medium">
                          {(() => {
                            const hourly = parseFormattedNumber(hourlyWage, currency)
                            const hours = parseFloat(hoursPerWeek) || 0
                            if (hourly > 0 && hours > 0) {
                              // Daily = hourly * (hours per week / 5 days)
                              const daily = hourly * (hours / 5)
                              const centsValue = Math.round(daily * 100).toString()
                              return `${currencyDisplay} ${formatNumber(centsValue, currency)}`
                            }
                            return '-'
                          })()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{t('monthly', language)}</Label>
                        <div className="text-sm font-medium">
                          {(() => {
                            const hourly = parseFormattedNumber(hourlyWage, currency)
                            const hours = parseFloat(hoursPerWeek) || 0
                            if (hourly > 0 && hours > 0) {
                              // Monthly = hourly * hours per week * (52/12 weeks)
                              const monthly = hourly * hours * (52 / 12)
                              const centsValue = Math.round(monthly * 100).toString()
                              return `${currencyDisplay} ${formatNumber(centsValue, currency)}`
                            }
                            return '-'
                          })()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{t('weekly', language)}</Label>
                        <div className="text-sm font-medium">
                          {(() => {
                            const hourly = parseFormattedNumber(hourlyWage, currency)
                            const hours = parseFloat(hoursPerWeek) || 0
                            if (hourly > 0 && hours > 0) {
                              // Weekly = hourly * hours per week
                              const weekly = hourly * hours
                              const centsValue = Math.round(weekly * 100).toString()
                              return `${currencyDisplay} ${formatNumber(centsValue, currency)}`
                            }
                            return '-'
                          })()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{t('biweekly', language)}</Label>
                        <div className="text-sm font-medium">
                          {(() => {
                            const hourly = parseFormattedNumber(hourlyWage, currency)
                            const hours = parseFloat(hoursPerWeek) || 0
                            if (hourly > 0 && hours > 0) {
                              // Biweekly = hourly * hours per week * 2
                              const biweekly = hourly * hours * 2
                              const centsValue = Math.round(biweekly * 100).toString()
                              return `${currencyDisplay} ${formatNumber(centsValue, currency)}`
                            }
                            return '-'
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
              <Button 
                onClick={handleAddSite} 
                size="icon" 
                variant="outline"
                disabled={isAddingSite || !siteInput.trim()}
              >
                {isAddingSite ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
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
