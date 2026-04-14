export const merchant = {
  name: 'Nykaa',
  logoChar: 'N',
  brandHex: '#FC2779',
  vpa: 'nykaa@hdfcbank',
  orderId: 'ORD-2026-04-13-12345'
}

export const order = {
  currency: '₹',
  subtotal: 2299,
  gst: 200,
  delivery: 0,
  get total() { return this.subtotal + this.gst + this.delivery },
  items: [
    { name: 'Kay Beauty Matte Lipstick', qty: 1, price: 699 },
    { name: 'Sugar Cosmetics Eyeliner',  qty: 2, price: 800 }
  ]
}

export const upiApps = [
  { id: 'gpay',    name: 'Google Pay', color: '#1A73E8', mark: 'G', scheme: 'tez://upi/pay' },
  { id: 'phonepe', name: 'PhonePe',    color: '#5F259F', mark: 'P', scheme: 'phonepe://pay' },
  { id: 'paytm',   name: 'Paytm',      color: '#00BAF2', mark: 'P', scheme: 'paytmmp://pay' },
  { id: 'bhim',    name: 'BHIM',       color: '#00747D', mark: 'B', scheme: 'upi://pay' },
  { id: 'cred',    name: 'CRED',       color: '#0A0A0A', mark: 'C', scheme: 'credpay://pay' },
  { id: 'amazon',  name: 'Amazon Pay', color: '#FF9900', mark: 'a', scheme: 'amazonpay://pay' }
]

export const banks = [
  { id: 'hdfc',  name: 'HDFC Bank',     short: 'HDFC',   color: '#004C8F' },
  { id: 'sbi',   name: 'State Bank',    short: 'SBI',    color: '#22409A' },
  { id: 'icici', name: 'ICICI Bank',    short: 'ICICI',  color: '#F37920' },
  { id: 'axis',  name: 'Axis Bank',     short: 'AXIS',   color: '#97144D' },
  { id: 'kotak', name: 'Kotak Mahindra',short: 'KOTAK',  color: '#ED1C24' },
  { id: 'pnb',   name: 'PNB',           short: 'PNB',    color: '#A2192E' },
  { id: 'idfc',  name: 'IDFC First',    short: 'IDFC',   color: '#9D1F23' },
  { id: 'yes',   name: 'YES Bank',      short: 'YES',    color: '#0033A0' },
  { id: 'indus', name: 'IndusInd Bank', short: 'INDUS',  color: '#90278E' },
  { id: 'bob',   name: 'Bank of Baroda',short: 'BOB',    color: '#F58220' },
  { id: 'canara',name: 'Canara Bank',   short: 'CNRA',   color: '#00529C' },
  { id: 'union', name: 'Union Bank',    short: 'UBI',    color: '#E03A3F' }
]

export const savedCards = [
  { id: 'sc1', last4: '4242', network: 'visa',       bank: 'HDFC Bank',   nickname: 'Salary card', expiry: '08/29' },
  { id: 'sc2', last4: '5510', network: 'mastercard', bank: 'ICICI Bank',  nickname: 'Travel',      expiry: '12/27' },
  { id: 'sc3', last4: '6071', network: 'rupay',      bank: 'State Bank',  nickname: 'Personal',    expiry: '03/28' }
]

export const wallets = [
  { id: 'paytm',    name: 'Paytm Wallet', color: '#00BAF2', mark: 'P', balance: 1240 },
  { id: 'phonepe',  name: 'PhonePe',      color: '#5F259F', mark: 'P' },
  { id: 'amazon',   name: 'Amazon Pay',   color: '#FF9900', mark: 'a' },
  { id: 'mobikwik', name: 'MobiKwik',     color: '#1B3A8B', mark: 'M' },
  { id: 'freecharge', name: 'Freecharge', color: '#EE2A37', mark: 'F' },
  { id: 'airtel',   name: 'Airtel Money', color: '#E40000', mark: 'A' }
]

export const emiBanks = [
  { id: 'hdfc',  name: 'HDFC Bank',  rate: 13, months: [3, 6, 9, 12, 18, 24] },
  { id: 'icici', name: 'ICICI Bank', rate: 14, months: [3, 6, 9, 12] },
  { id: 'axis',  name: 'Axis Bank',  rate: 14, months: [3, 6, 12] },
  { id: 'sbi',   name: 'State Bank', rate: 15, months: [3, 6, 9, 12, 18, 24] },
  { id: 'kotak', name: 'Kotak',      rate: 14, months: [3, 6, 12] }
]

export const bnplProviders = [
  { id: 'simpl',    name: 'Simpl',     tagline: '1-tap pay later · 0% interest', color: '#1B47E5', mark: 'S' },
  { id: 'lazypay',  name: 'LazyPay',   tagline: 'Pay in 15 days · No fee',       color: '#7A29A1', mark: 'L' },
  { id: 'zest',     name: 'ZestMoney', tagline: 'Split into 3 · No card needed', color: '#EF4135', mark: 'Z' },
  { id: 'snapmint', name: 'Snapmint',  tagline: 'Pay in parts · No-cost EMI',    color: '#0EA5E9', mark: 'S' }
]

export const methods = [
  { id: 'upi',   icon: 'bolt',     title: 'UPI',             tagline: 'Instant • No extra charge', recommended: true },
  { id: 'card',  icon: 'card',     title: 'Cards',           tagline: 'Credit & Debit • Visa, MC, RuPay, Amex' },
  { id: 'nb',    icon: 'bank',     title: 'Netbanking',      tagline: 'All major banks supported' },
  { id: 'wal',   icon: 'wallet',   title: 'Wallets',         tagline: 'Paytm, PhonePe, Amazon Pay & more' },
  { id: 'emi',   icon: 'calendar', title: 'EMI / Pay Later', tagline: 'No-cost EMI from ₹500/mo' }
]

// ── Trust pane: live merchant data ──────────────────────────────
export const merchantTrust = {
  legalName: 'FSN E-Commerce Ventures Ltd',
  dba: 'Nykaa',
  incorporated: 2012,
  yearsActive: 14,
  gstin: '29AAECF9028M1ZC',
  gstVerified: true,
  cin: 'U52600MH2012PLC230136',
  processed30d: '₹2,418 Cr',
  orders30d: '1.23M',
  disputeRate: 0.03,
  refundRate: 0.42,
  rating: 4.7,
  ratingCount: '1.18M',
  verifiedBadge: 'Verified Merchant',
  categoryRank: '#2 in Beauty',
  riskScore: 'Low',
  pciScope: 'Out of scope (tokenized)'
}

// ── Session / device security state ─────────────────────────────
export const sessionTrust = {
  device: {
    name: 'Chrome on Windows',
    fingerprint: 'A3:F9:...:2C',
    trustedSince: 'Jan 15, 2025',
    trusted: true
  },
  network: {
    label: 'Home Wi-Fi',
    ip: '103.44.xx.xx',
    city: 'Mumbai, IN',
    vpn: false,
    matchesUsual: true
  },
  card: {
    tokenized: true,
    provider: 'RBI Network Tokenization',
    vaultProvider: 'Visa'
  },
  biometric: {
    available: true,
    method: 'Windows Hello'
  },
  transit: {
    tls: 'TLS 1.3',
    cert: 'DigiCert EV'
  }
}

// ── User's history + spend awareness ────────────────────────────
export const userHistory = {
  // past payments to this merchant
  merchantStats: {
    nykaa: {
      payments: 3,
      lastAmount: 1750,
      avgAmount: 1850,
      lastPayment: 'Mar 10, 2026',
      firstTimeHere: false
    }
  },
  // monthly category spending
  monthlyCategory: {
    beauty: { spent: 12400, budget: 15000, transactions: 5, label: 'Beauty & Personal Care' }
  },
  preferredMethods: ['upi', 'sc1']
}

// ── User-set guardrails (rules that gate payments) ──────────────
export const guardrails = {
  biometricAbove: 5000,
  dailyCapCards: 25000,
  dailyCapUpi: 100000,
  usedToday: { cards: 0, upi: 4200 },
  blockNewMerchantsAfter: '22:00',
  merchantsWhitelisted: ['nykaa', 'amazon', 'flipkart', 'bigbasket'],
  // derived helpers live in Guardrails.jsx
}

// ── Failure reason taxonomy — used for Smart Retry ──────────────
export const failureReasons = {
  card_daily_limit: {
    code: 'DD01',
    title: 'Daily limit reached',
    plain: 'Your bank has already processed the maximum cards spend for today.',
    blame: 'bank'
  },
  insufficient_funds: {
    code: 'IF02',
    title: 'Insufficient balance',
    plain: 'The account linked to this method doesn\'t have enough balance.',
    blame: 'bank'
  },
  upi_timeout: {
    code: 'UT03',
    title: 'UPI approval timed out',
    plain: 'You didn\'t approve the request in your UPI app in time.',
    blame: 'user'
  },
  network: {
    code: 'NX04',
    title: 'Network hiccup',
    plain: 'We couldn\'t reach your bank. No money left your account.',
    blame: 'network'
  }
}

export function buildUpiUrl(app) {
  const params = new URLSearchParams({
    pa: merchant.vpa,
    pn: merchant.name,
    am: String(order.total),
    cu: 'INR',
    tn: `Order ${merchant.orderId}`,
    tr: merchant.orderId
  }).toString()
  const base = app?.scheme || 'upi://pay'
  return `${base}?${params}`
}
