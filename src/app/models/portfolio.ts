export interface PortfolioNode {
  name: string;
  children: PortfolioNode[];
  value?: number;
  percent?: number;
}

export interface Item {
  id: string;
  name: string;
  category?: string;
  value: number;
}

export interface Allocation {
  Debt: Item[];
  Equity: Item[];
  Others: Item[];
}

export interface Category {
  id: string;
  category: string;
  exp_returns: number;
}

export interface CategoryCollection {
  categories: Category[];
}

export interface ChangesCollection {
  changes: Change[];
}

export interface Change {
  timestamp: Date;
  total_value : number;
}