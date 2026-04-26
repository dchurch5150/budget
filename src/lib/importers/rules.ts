import type { TransactionType } from '@/lib/types';

export interface ImportRule {
  pattern: RegExp;
  type: TransactionType;
  category: string;
}

const RULES: Record<string, ImportRule[]> = {
  'wells-fargo': [
    // Income
    { pattern: /DIRECT\s*DEP|PAYROLL|ACH\s*CREDIT\s*(EMPLOYER|PAYROLL)/i, type: 'Income', category: 'Employment (Net)' },
    { pattern: /DIVIDEND/i, type: 'Income', category: 'Dividends' },
    { pattern: /INTEREST\s*(PAYMENT|CREDIT|EARNED)/i, type: 'Income', category: 'Interest' },

    // Savings transfers (match before generic transfer patterns)
    { pattern: /FIDELITY|VANGUARD|SCHWAB|ETRADE|ROBINHOOD|WEBULL/i, type: 'Savings', category: 'Brokerage Account' },
    { pattern: /COINBASE|CRYPTO|BITCOIN/i, type: 'Savings', category: 'Crypto' },
    { pattern: /TRANSFER\s*TO\s*SAVINGS|ONLINE\s*TRANSFER\s*TO\s*(SAVINGS|ACCOUNT)/i, type: 'Savings', category: 'Emergency Fund' },

    // Housing
    { pattern: /MORTGAGE|HOME\s*LOAN|PROPERTY\s*TAX|HOA\s*(DUES|FEE)/i, type: 'Expenses', category: 'Housing' },
    { pattern: /RENT\s*(PAYMENT|PMT)/i, type: 'Expenses', category: 'Housing' },

    // Utilities
    { pattern: /ELECTRIC|XCEL\s*ENERGY|PG&?E|DUKE\s*ENERGY|CONSUMERS\s*ENERGY/i, type: 'Expenses', category: 'Utilities' },
    { pattern: /COMCAST|XFINITY|AT&?T|VERIZON|T-?MOBILE|SPECTRUM|COX\s*COMM/i, type: 'Expenses', category: 'Utilities' },
    { pattern: /WATER\s*(UTIL|BILL|DEPT)|GAS\s*(UTIL|BILL|COMPANY)/i, type: 'Expenses', category: 'Utilities' },

    // Groceries
    { pattern: /KROGER|SAFEWAY|WHOLE\s*FOODS|TRADER\s*JOE|ALDI|PUBLIX|HEB\s|WEGMANS|MEIJER|FOOD\s*(LION|4\s*LESS)/i, type: 'Expenses', category: 'Groceries' },
    { pattern: /WALMART\s*(GROCERY|SUPERCENTER|STORE)|TARGET\s*(STORE|COM)/i, type: 'Expenses', category: 'Groceries' },
    { pattern: /COSTCO\s*WHSE/i, type: 'Expenses', category: 'Groceries' },

    // Transportation
    { pattern: /SHELL|CHEVRON|EXXON|MOBIL|BP\s|SUNOCO|MARATHON\s*OIL|SPEEDWAY|QUIKTRIP/i, type: 'Expenses', category: 'Transportation' },
    { pattern: /CAR\s*(PAYMENT|LOAN)|AUTO\s*(LOAN|FINANCE)|FORD\s*MOTOR|GM\s*FINANCIAL|TOYOTA\s*FIN/i, type: 'Expenses', category: 'Transportation' },
    { pattern: /UBER\s*(?!EATS)|LYFT|METRO|TRANSIT|PARKING\s*(GARAGE|LOT|METER)/i, type: 'Expenses', category: 'Transportation' },

    // Insurance
    { pattern: /STATE\s*FARM|GEICO|ALLSTATE|PROGRESSIVE\s*INS|NATIONWIDE\s*INS|LIBERTY\s*MUTUAL/i, type: 'Expenses', category: 'Insurance' },
    { pattern: /INSURANCE\s*(PAYMENT|PMT|PREMIUM)/i, type: 'Expenses', category: 'Insurance' },

    // Medical
    { pattern: /CVS\s*(PHARM|STORE|\d)|WALGREENS|RITE\s*AID|PHARMACY/i, type: 'Expenses', category: 'Medical' },
    { pattern: /HOSPITAL|MEDICAL\s*(CTR|CENTER|GROUP)|CLINIC|URGENT\s*CARE|DR\s+[A-Z]/i, type: 'Expenses', category: 'Medical' },
    { pattern: /DENTAL|ORTHODON|EYE\s*(CARE|DOCTOR)|VISION\s*(CENTER|WORKS)/i, type: 'Expenses', category: 'Medical' },
    { pattern: /BLUE\s*CROSS|CIGNA|AETNA|HUMANA|UNITED\s*HEALTH/i, type: 'Expenses', category: 'Medical' },

    // Media / subscriptions
    { pattern: /NETFLIX|SPOTIFY|HULU|DISNEY\+?|HBO\s*(MAX)?|APPLE\s*(TV|MUSIC|ONE)|YOUTUBE\s*PREMIUM/i, type: 'Expenses', category: 'Media' },
    { pattern: /AMAZON\s*(PRIME|DIGITAL|VIDEO)/i, type: 'Expenses', category: 'Media' },

    // Fun & Vacation
    { pattern: /MCDONALD|STARBUCKS|CHIPOTLE|DOORDASH|UBER\s*EATS|GRUBHUB|INSTACART/i, type: 'Expenses', category: 'Fun & Vacation' },
    { pattern: /RESTAURANT|DINING|BAR\s*&|BREWERY|WINERY/i, type: 'Expenses', category: 'Fun & Vacation' },
    { pattern: /HOTEL|AIRBNB|MARRIOTT|HILTON|HYATT|EXPEDIA|BOOKING\.COM/i, type: 'Expenses', category: 'Fun & Vacation' },
    { pattern: /STEAM\s*(GAMES|PURCHASE)|NINTENDO|PLAYSTATION|XBOX|GAMESTOP/i, type: 'Expenses', category: 'Fun & Vacation' },

    // Clothing
    { pattern: /AMAZON\b(?!\s*(PRIME|DIGITAL|VIDEO|WEB\s*SERVICES))/i, type: 'Expenses', category: 'Clothing' },

    // Taxes
    { pattern: /IRS\s*(USATAXPYMT|TAX\s*PAYMENT|TREAS)|STATE\s*TAX\s*(PAYMENT|PMT)/i, type: 'Expenses', category: 'Taxes' },

    // Charity
    { pattern: /DONATION|CHARITY|GOODWILL|RED\s*CROSS|SALVATION\s*ARMY/i, type: 'Expenses', category: 'Charity' },
  ],

  'fidelity': [
    // Income
    { pattern: /DIVIDEND\s*RECEIVED|REINVESTMENT.*DIVIDEND/i, type: 'Income', category: 'Dividends' },
    { pattern: /INTEREST\s*(EARNED|INCOME|CREDITED)/i, type: 'Income', category: 'Interest' },
    { pattern: /DIRECT\s*DEP|ACH\s*CONTRIBUTION|PAYROLL/i, type: 'Income', category: 'Employment (Net)' },

    // Savings (transfers into investment accounts)
    { pattern: /TRANSFERRED\s*FROM|ELECTRONIC\s*FUNDS\s*TRANSFER\s*RECEIVED|CONTRIBUTION/i, type: 'Savings', category: 'Brokerage Account' },
    { pattern: /401K|IRA\s*CONTRIBUTION|RETIREMENT/i, type: 'Savings', category: 'Retirement Account' },

    // Expenses (withdrawals/fees)
    { pattern: /FEE|ADVISORY\s*FEE|MANAGEMENT\s*FEE/i, type: 'Expenses', category: 'Margin' },
    { pattern: /MARGIN\s*INTEREST/i, type: 'Expenses', category: 'Margin' },
  ],
};

export function matchRules(
  description: string,
  sourceId: string,
): { type: TransactionType; category: string } | null {
  const rules = RULES[sourceId] ?? [];
  for (const rule of rules) {
    if (rule.pattern.test(description)) {
      return { type: rule.type, category: rule.category };
    }
  }
  return null;
}
