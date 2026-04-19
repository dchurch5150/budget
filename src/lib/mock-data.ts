export type TransactionType = "Income" | "Expenses" | "Savings";

export type IncomeCategory =
  | "Employment (Net)"
  | "Side Hustle"
  | "Dividends"
  | "Interest"
  | "Options Premium";

export type ExpensesCategory =
  | "Housing"
  | "Utilities"
  | "Groceries"
  | "Transportation"
  | "Insurance"
  | "Clothing"
  | "Medical"
  | "Media"
  | "Fun & Vacation"
  | "Home Office"
  | "Charity"
  | "Gifts"
  | "Margin"
  | "Taxes";

export type SavingsCategory =
  | "Emergency Fund"
  | "Retirement Account"
  | "Brokerage Account"
  | "Crypto"
  | "Sinking Fund"
  | "Physical Emergency";

export type Category = IncomeCategory | ExpensesCategory | SavingsCategory;

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: Category;
  amount: number;
  tags: string[];
  details: string;
  source: string;
}

export const mockTransactions: Transaction[] = [
  { id: "t-0001", date: "2025-01-01", type: "Expenses", category: "Groceries", amount: 85, tags: ["Safeway", "Weekly"], details: "", source: "Chase Credit" },
  { id: "t-0002", date: "2025-01-01", type: "Expenses", category: "Groceries", amount: 32, tags: ["Chewy", "Pet"], details: "Dog Food", source: "Chase Credit" },
  { id: "t-0003", date: "2025-01-01", type: "Expenses", category: "Utilities", amount: 0, tags: ["Subscription", "Monthly"], details: "Google Cloud", source: "Amex" },
  { id: "t-0004", date: "2025-01-02", type: "Income", category: "Employment (Net)", amount: 4376, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0005", date: "2025-01-02", type: "Savings", category: "Brokerage Account", amount: 2000, tags: ["Stock Portfolio", "Auto-Invest"], details: "", source: "Fidelity Brokerage" },
  { id: "t-0006", date: "2025-01-02", type: "Expenses", category: "Housing", amount: 1000, tags: ["Property Tax", "Escrow"], details: "Saved aside for property tax", source: "Wells Fargo Checking" },
  { id: "t-0007", date: "2025-01-02", type: "Savings", category: "Emergency Fund", amount: 300, tags: ["Monthly", "Auto"], details: "", source: "Ally Savings" },
  { id: "t-0008", date: "2025-01-02", type: "Savings", category: "Sinking Fund", amount: 300, tags: ["Gold Fund", "Hedge"], details: "Gold Fund", source: "Ally Savings" },
  { id: "t-0009", date: "2025-01-02", type: "Savings", category: "Crypto", amount: 300, tags: ["DCA", "Bitcoin"], details: "", source: "Coinbase" },
  { id: "t-0010", date: "2025-01-02", type: "Savings", category: "Retirement Account", amount: 250, tags: ["IRA", "Monthly"], details: "", source: "Fidelity IRA" },
  { id: "t-0011", date: "2025-01-03", type: "Income", category: "Dividends", amount: 126, tags: ["WFC", "Bank"], details: "Wells Fargo Rewards", source: "Fidelity Brokerage" },
  { id: "t-0012", date: "2025-01-04", type: "Expenses", category: "Groceries", amount: 310, tags: ["Costco", "Bulk"], details: "", source: "Costco Visa" },
  { id: "t-0013", date: "2025-01-06", type: "Expenses", category: "Fun & Vacation", amount: 86, tags: ["Hobby", "Cards"], details: "Ebay TCG", source: "Amex" },
  { id: "t-0014", date: "2025-01-06", type: "Expenses", category: "Media", amount: 80, tags: ["Amazon", "Books"], details: "Kindle Books", source: "Amex" },
  { id: "t-0015", date: "2025-01-06", type: "Expenses", category: "Fun & Vacation", amount: 11, tags: ["Gaming", "Subscription"], details: "Pokemon Home", source: "Amex" },
  { id: "t-0016", date: "2025-01-07", type: "Expenses", category: "Media", amount: 14, tags: ["Subscription", "Monthly"], details: "Youtube Premium", source: "Amex" },
  { id: "t-0017", date: "2025-01-07", type: "Expenses", category: "Media", amount: 8, tags: ["Amazon", "Books"], details: "Kindle Books", source: "Amex" },
  { id: "t-0018", date: "2025-01-09", type: "Income", category: "Dividends", amount: 389, tags: ["VICI", "REIT"], details: "VICI", source: "Fidelity Brokerage" },
  { id: "t-0019", date: "2025-01-09", type: "Savings", category: "Brokerage Account", amount: 389, tags: ["DRIP", "VICI"], details: "Reinvest Dividend", source: "Fidelity Brokerage" },
  { id: "t-0020", date: "2025-01-09", type: "Income", category: "Dividends", amount: 2, tags: ["CRM", "Stock"], details: "CRM", source: "Fidelity Brokerage" },
  { id: "t-0021", date: "2025-01-09", type: "Savings", category: "Brokerage Account", amount: 2, tags: ["DRIP", "CRM"], details: "Reinvest Dividend", source: "Fidelity Brokerage" },
  { id: "t-0022", date: "2025-01-10", type: "Expenses", category: "Home Office", amount: 85, tags: ["Supplies"], details: "Office", source: "Amex" },
  { id: "t-0023", date: "2025-01-11", type: "Expenses", category: "Groceries", amount: 328, tags: ["Trader Joes", "Weekly"], details: "", source: "Chase Credit" },
  { id: "t-0024", date: "2025-01-12", type: "Expenses", category: "Fun & Vacation", amount: 1010, tags: ["Hobby", "Cards"], details: "Ebay TCG", source: "Amex" },
  { id: "t-0025", date: "2025-01-12", type: "Expenses", category: "Groceries", amount: 85, tags: ["Takeout", "Pizza"], details: "Dominos", source: "Chase Credit" },
  { id: "t-0026", date: "2025-01-14", type: "Expenses", category: "Media", amount: 12, tags: ["Subscription", "Finance"], details: "TickerData", source: "Amex" },
  { id: "t-0027", date: "2025-01-15", type: "Income", category: "Employment (Net)", amount: 4387, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0028", date: "2025-01-15", type: "Savings", category: "Brokerage Account", amount: 2000, tags: ["Stock Portfolio", "Auto-Invest"], details: "", source: "Fidelity Brokerage" },
  { id: "t-0029", date: "2025-01-15", type: "Savings", category: "Emergency Fund", amount: 300, tags: ["Monthly", "Auto"], details: "", source: "Ally Savings" },
  { id: "t-0030", date: "2025-01-15", type: "Savings", category: "Crypto", amount: 300, tags: ["DCA", "Bitcoin"], details: "", source: "Coinbase" },
  { id: "t-0031", date: "2025-01-15", type: "Savings", category: "Retirement Account", amount: 250, tags: ["IRA", "Monthly"], details: "", source: "Fidelity IRA" },
  { id: "t-0032", date: "2025-01-15", type: "Income", category: "Dividends", amount: 232, tags: ["O", "REIT"], details: "O", source: "Fidelity Brokerage" },
  { id: "t-0033", date: "2025-01-15", type: "Savings", category: "Brokerage Account", amount: 232, tags: ["DRIP", "O"], details: "Reinvest Dividend", source: "Fidelity Brokerage" },
  { id: "t-0034", date: "2025-01-15", type: "Expenses", category: "Home Office", amount: 38, tags: ["Supplies"], details: "Office", source: "Amex" },
  { id: "t-0035", date: "2025-01-18", type: "Expenses", category: "Groceries", amount: 142, tags: ["Safeway", "Weekly"], details: "", source: "Chase Credit" },
  { id: "t-0036", date: "2025-01-20", type: "Expenses", category: "Transportation", amount: 58, tags: ["Gas", "Shell"], details: "Fill-up", source: "Chase Credit" },
  { id: "t-0037", date: "2025-01-22", type: "Expenses", category: "Utilities", amount: 142, tags: ["PG&E", "Electric"], details: "Electric bill", source: "Wells Fargo Checking" },
  { id: "t-0038", date: "2025-01-25", type: "Expenses", category: "Groceries", amount: 95, tags: ["Safeway", "Weekly"], details: "", source: "Chase Credit" },
  { id: "t-0039", date: "2025-01-28", type: "Expenses", category: "Insurance", amount: 210, tags: ["Pet", "Monthly"], details: "Pet insurance", source: "Wells Fargo Checking" },
  { id: "t-0040", date: "2025-01-29", type: "Income", category: "Employment (Net)", amount: 4380, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },

  { id: "t-0041", date: "2025-02-01", type: "Expenses", category: "Housing", amount: 2450, tags: ["Mortgage", "Monthly"], details: "February mortgage", source: "Wells Fargo Checking" },
  { id: "t-0042", date: "2025-02-02", type: "Savings", category: "Emergency Fund", amount: 300, tags: ["Monthly", "Auto"], details: "", source: "Ally Savings" },
  { id: "t-0043", date: "2025-02-02", type: "Savings", category: "Sinking Fund", amount: 300, tags: ["Gold Fund", "Hedge"], details: "Gold Fund", source: "Ally Savings" },
  { id: "t-0044", date: "2025-02-02", type: "Savings", category: "Crypto", amount: 300, tags: ["DCA", "Bitcoin"], details: "", source: "Coinbase" },
  { id: "t-0045", date: "2025-02-02", type: "Savings", category: "Retirement Account", amount: 250, tags: ["IRA", "Monthly"], details: "", source: "Fidelity IRA" },
  { id: "t-0046", date: "2025-02-05", type: "Expenses", category: "Groceries", amount: 178, tags: ["Costco", "Bulk"], details: "", source: "Costco Visa" },
  { id: "t-0047", date: "2025-02-07", type: "Expenses", category: "Media", amount: 14, tags: ["Subscription", "Monthly"], details: "Youtube Premium", source: "Amex" },
  { id: "t-0048", date: "2025-02-10", type: "Income", category: "Dividends", amount: 412, tags: ["VICI", "REIT"], details: "VICI", source: "Fidelity Brokerage" },
  { id: "t-0049", date: "2025-02-10", type: "Savings", category: "Brokerage Account", amount: 412, tags: ["DRIP", "VICI"], details: "Reinvest Dividend", source: "Fidelity Brokerage" },
  { id: "t-0050", date: "2025-02-12", type: "Income", category: "Employment (Net)", amount: 4390, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0051", date: "2025-02-14", type: "Expenses", category: "Fun & Vacation", amount: 165, tags: ["Dinner", "Valentines"], details: "Anniversary dinner", source: "Amex" },
  { id: "t-0052", date: "2025-02-15", type: "Expenses", category: "Gifts", amount: 75, tags: ["Valentines", "Flowers"], details: "Flowers", source: "Amex" },
  { id: "t-0053", date: "2025-02-18", type: "Expenses", category: "Utilities", amount: 68, tags: ["Internet", "Comcast"], details: "Internet bill", source: "Wells Fargo Checking" },
  { id: "t-0054", date: "2025-02-20", type: "Expenses", category: "Transportation", amount: 62, tags: ["Gas", "Shell"], details: "Fill-up", source: "Chase Credit" },
  { id: "t-0055", date: "2025-02-22", type: "Income", category: "Interest", amount: 18, tags: ["Ally", "HYSA"], details: "Savings interest", source: "Ally Savings" },
  { id: "t-0056", date: "2025-02-26", type: "Income", category: "Employment (Net)", amount: 4390, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0057", date: "2025-02-28", type: "Expenses", category: "Medical", amount: 45, tags: ["Copay", "Doctor"], details: "Annual physical copay", source: "Chase Credit" },

  { id: "t-0058", date: "2025-03-01", type: "Expenses", category: "Housing", amount: 2450, tags: ["Mortgage", "Monthly"], details: "March mortgage", source: "Wells Fargo Checking" },
  { id: "t-0059", date: "2025-03-02", type: "Savings", category: "Emergency Fund", amount: 300, tags: ["Monthly", "Auto"], details: "", source: "Ally Savings" },
  { id: "t-0060", date: "2025-03-02", type: "Savings", category: "Retirement Account", amount: 250, tags: ["IRA", "Monthly"], details: "", source: "Fidelity IRA" },
  { id: "t-0061", date: "2025-03-02", type: "Savings", category: "Crypto", amount: 300, tags: ["DCA", "Ethereum"], details: "", source: "Coinbase" },
  { id: "t-0062", date: "2025-03-05", type: "Expenses", category: "Groceries", amount: 218, tags: ["Trader Joes", "Weekly"], details: "", source: "Chase Credit" },
  { id: "t-0063", date: "2025-03-07", type: "Income", category: "Side Hustle", amount: 450, tags: ["Freelance", "Consulting"], details: "Consulting hours", source: "Wells Fargo Checking" },
  { id: "t-0064", date: "2025-03-10", type: "Income", category: "Options Premium", amount: 220, tags: ["Covered Call", "SPY"], details: "SPY CC premium", source: "Fidelity Brokerage" },
  { id: "t-0065", date: "2025-03-12", type: "Income", category: "Employment (Net)", amount: 4395, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0066", date: "2025-03-14", type: "Expenses", category: "Fun & Vacation", amount: 340, tags: ["Concert", "Entertainment"], details: "Concert tickets", source: "Amex" },
  { id: "t-0067", date: "2025-03-18", type: "Expenses", category: "Clothing", amount: 185, tags: ["Shoes", "Nike"], details: "Running shoes", source: "Amex" },
  { id: "t-0068", date: "2025-03-20", type: "Expenses", category: "Charity", amount: 100, tags: ["Monthly", "Red Cross"], details: "Monthly donation", source: "Wells Fargo Checking" },
  { id: "t-0069", date: "2025-03-22", type: "Expenses", category: "Transportation", amount: 55, tags: ["Gas", "Shell"], details: "Fill-up", source: "Chase Credit" },
  { id: "t-0070", date: "2025-03-26", type: "Income", category: "Employment (Net)", amount: 4395, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0071", date: "2025-03-29", type: "Expenses", category: "Groceries", amount: 112, tags: ["Safeway", "Weekly"], details: "", source: "Chase Credit" },

  { id: "t-0072", date: "2025-04-01", type: "Expenses", category: "Housing", amount: 2450, tags: ["Mortgage", "Monthly"], details: "April mortgage", source: "Wells Fargo Checking" },
  { id: "t-0073", date: "2025-04-02", type: "Savings", category: "Emergency Fund", amount: 300, tags: ["Monthly", "Auto"], details: "", source: "Ally Savings" },
  { id: "t-0074", date: "2025-04-02", type: "Savings", category: "Retirement Account", amount: 250, tags: ["IRA", "Monthly"], details: "", source: "Fidelity IRA" },
  { id: "t-0075", date: "2025-04-09", type: "Income", category: "Employment (Net)", amount: 4400, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0076", date: "2025-04-14", type: "Expenses", category: "Taxes", amount: 1250, tags: ["Federal", "Annual"], details: "Federal tax owed", source: "Wells Fargo Checking" },
  { id: "t-0077", date: "2025-04-18", type: "Expenses", category: "Groceries", amount: 88, tags: ["Safeway", "Weekly"], details: "", source: "Chase Credit" },
  { id: "t-0078", date: "2025-04-23", type: "Income", category: "Employment (Net)", amount: 4400, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0079", date: "2025-04-28", type: "Expenses", category: "Medical", amount: 120, tags: ["Dental", "Cleaning"], details: "Dental cleaning", source: "Chase Credit" },

  { id: "t-0080", date: "2025-07-15", type: "Income", category: "Side Hustle", amount: 680, tags: ["Freelance", "Consulting"], details: "Summer project", source: "Wells Fargo Checking" },
  { id: "t-0081", date: "2025-08-20", type: "Expenses", category: "Fun & Vacation", amount: 1820, tags: ["Trip", "Hawaii"], details: "Hawaii flights", source: "Amex" },
  { id: "t-0082", date: "2025-10-05", type: "Expenses", category: "Margin", amount: 62, tags: ["Interest", "IBKR"], details: "Margin interest", source: "Fidelity Brokerage" },
  { id: "t-0083", date: "2025-11-28", type: "Expenses", category: "Gifts", amount: 420, tags: ["Christmas", "Family"], details: "Holiday gifts", source: "Amex" },
  { id: "t-0084", date: "2025-12-15", type: "Income", category: "Dividends", amount: 518, tags: ["VICI", "REIT"], details: "Year-end dividend", source: "Fidelity Brokerage" },
  { id: "t-0085", date: "2025-12-31", type: "Savings", category: "Physical Emergency", amount: 200, tags: ["Cash", "Annual"], details: "Year-end cash top-up", source: "Home Safe" },

  { id: "t-0086", date: "2026-01-02", type: "Income", category: "Employment (Net)", amount: 4500, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0087", date: "2026-01-05", type: "Expenses", category: "Housing", amount: 2500, tags: ["Mortgage", "Monthly"], details: "January mortgage", source: "Wells Fargo Checking" },
  { id: "t-0088", date: "2026-02-10", type: "Income", category: "Dividends", amount: 445, tags: ["O", "REIT"], details: "O", source: "Fidelity Brokerage" },
  { id: "t-0089", date: "2026-03-15", type: "Income", category: "Employment (Net)", amount: 4500, tags: ["Paycheck", "Biweekly"], details: "UCSF Paycheck", source: "Wells Fargo Checking" },
  { id: "t-0090", date: "2026-04-02", type: "Expenses", category: "Groceries", amount: 96, tags: ["Safeway", "Weekly"], details: "", source: "Chase Credit" },
];

export function computeRunningBalance(transactions: Transaction[]): Array<Transaction & { balance: number }> {
  let balance = 0;
  return transactions.map((t) => {
    if (t.type === "Income") balance += t.amount;
    else balance -= t.amount;
    return { ...t, balance };
  });
}
