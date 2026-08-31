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
  Retirement: Item[];
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
  total_value: number;
}

export type TargetSegment = "Debt" | "Equity" | "Others";

export interface TargetAllocation {
  segments: Partial<Record<TargetSegment, number>>;
  categories?: Partial<Record<TargetSegment, Record<string, number>>>;
}
