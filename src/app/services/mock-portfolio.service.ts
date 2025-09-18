import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import {
  Allocation,
  CategoryCollection,
  ChangesCollection,
} from "../models/portfolio";
import { MockAuthService } from "./mock-auth.service";

@Injectable({ providedIn: "root" })
export class MockPortfolioService {
  constructor(private auth: MockAuthService) {}

  private allocation: Allocation = {
    Debt: [
      { id: "d1", name: "Debt Fund A", category: "Debt", value: 50 },
      { id: "d2", name: "Debt Fund B", category: "Debt", value: 30 },
    ],
    Equity: [
      { id: "e1", name: "Equity Fund A", category: "Equity", value: 120 },
      { id: "e2", name: "Equity Fund B", category: "Equity", value: 80 },
    ],
    Others: [{ id: "o1", name: "Gold ETF", category: "Others", value: 20 }],
  };

  private categories: CategoryCollection = {
    categories: [
      { id: "c1", category: "Debt", exp_returns: 7 },
      { id: "c2", category: "Equity", exp_returns: 12 },
      { id: "c3", category: "Others", exp_returns: 5 },
    ],
  };

  private changes: ChangesCollection = {
    changes: (() => {
      const base = this.totalValue();
      const weeks = 26; // ~6 months of weekly data (>=20 points)
      const weekMs = 7 * 24 * 60 * 60 * 1000;
      const arr: { timestamp: Date; total_value: number }[] = [];
      for (let i = 0; i < weeks; i++) {
        const weeksAgo = weeks - 1 - i; // build oldest first
        // Upward trend from 85% to ~105% of base over period
        const trend = 0.85 + (i / (weeks - 1)) * 0.2; // linear 0.85 -> 1.05
        const oscillation = 0.01 * Math.sin(i / 2); // gentle weekly wiggle
        const value = base * (trend + oscillation);
        arr.push({
          timestamp: new Date(Date.now() - weeksAgo * weekMs),
          total_value: Math.round(value),
        });
      }
      return arr.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    })(),
  };

  setPortfolio(data: Allocation) {
    this.allocation = data;
    this.pushChange();
    return Promise.resolve();
  }

  getPortfolio(): Observable<Allocation> {
    return of(this.allocation);
  }

  setCategory(data: CategoryCollection) {
    this.categories = data;
    return Promise.resolve();
  }

  getCategory(): Observable<CategoryCollection> {
    return of(this.categories);
  }

  getChanges(): Observable<ChangesCollection> {
    return of(this.changes);
  }

  async getLastEditedTimestamp() {
    if (this.changes.changes.length) {
      return this.changes.changes[0].timestamp;
    }
    return null;
  }

  private pushChange() {
    this.changes.changes.unshift({
      timestamp: new Date(),
      total_value: this.totalValue(),
    });
  }

  private totalValue() {
    const merged: any[] = ([] as any[]).concat.apply(
      [],
      Object.values(this.allocation)
    );
    return merged.reduce((sum: number, n: any) => sum + n.value, 0);
  }

  // replicate expectation logic (simplified copy)
  getExpectations() {
    return new Observable<{ categories: any[]; total: any }>((observer) => {
      this.getCategory().subscribe({
        next: (res) => {
          if (res && res.categories.length) {
            const categories = JSON.parse(JSON.stringify(res.categories));
            this.getPortfolio().subscribe({
              next: (allocation) => {
                const portfolio: any[] = ([] as any[]).concat.apply(
                  [],
                  Object.values(allocation)
                );
                if (portfolio.length) {
                  const groupBy = (arr: any[], key: string) =>
                    arr.reduce((acc, cur) => {
                      (acc[cur[key]] = acc[cur[key]] || []).push(cur);
                      return acc;
                    }, {} as any);
                  const grouped = groupBy(portfolio, "category");
                  let total: any = {};
                  categories.forEach((elem: any, index: number) => {
                    categories[index].investments =
                      grouped[elem.category] || [];
                    categories[index].value = (
                      grouped[elem.category] || []
                    ).reduce((s: number, n: any) => s + n.value, 0);
                  });
                  total.value = categories.reduce(
                    (s: number, n: any) => s + n.value,
                    0
                  );
                  total.weightage = 100;
                  categories.forEach((c: any, idx: number) => {
                    categories[idx].weightage = (c.value / total.value) * 100;
                    categories[idx].wt_exp_ret =
                      (categories[idx].weightage *
                        categories[idx].exp_returns) /
                      100;
                    categories[idx].exp_returns_abs =
                      (categories[idx].exp_returns / 100) *
                      categories[idx].value;
                  });
                  total.exp_returns_abs = categories.reduce(
                    (s: number, n: any) => s + n.exp_returns_abs,
                    0
                  );
                  total.wt_exp_ret = categories.reduce(
                    (s: number, n: any) => s + n.wt_exp_ret,
                    0
                  );
                  observer.next({ categories, total });
                } else observer.error("No portfolio received");
              },
              error: (err) => observer.error(err),
            });
          } else observer.error("No categories received");
        },
        error: (err) => observer.error(err),
      });
    });
  }
}
