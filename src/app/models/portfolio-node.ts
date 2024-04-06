export interface PortfolioNode {
  name: string;
  children: PortfolioNode[];
  value?: number;
  percent?: number;
}
