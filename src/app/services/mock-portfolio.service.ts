import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import {
  Allocation,
  CategoryCollection,
  ChangesCollection,
  TargetAllocation,
} from "../models/portfolio";
import { MockAuthService } from "./mock-auth.service";

@Injectable({ providedIn: "root" })
export class MockPortfolioService {
  private auth = inject(MockAuthService);

  private allocation: Allocation = {
    Debt: [
      { id: "d1", name: "FD A", category: "FD", value: 30 },
      { id: "d2", name: "Bank B", category: "Bank", value: 20 },
      { id: "d3", name: "Debt MF C", category: "Debt MF", value: 30 },
    ],
    Equity: [
      { id: "e1", name: "Large MF A", category: "Large MF", value: 100 },
      { id: "e2", name: "Small MF B", category: "Small MF", value: 50 },
      { id: "e3", name: "Midcap MF C", category: "Midcap MF", value: 50 },
    ],
    Others: [{ id: "o1", name: "Gold MF A", category: "Gold MF", value: 20 }],
    Retirement: [{ id: "r1", name: "EPF A", category: "EPF", value: 100 }],
  };

  // undefined simulates a pre-existing user with no target doc yet
  private target: TargetAllocation | undefined = undefined;

  private categories: CategoryCollection = {
    categories: [
      { id: "c1", category: "FD", exp_returns: 6.5 },
      { id: "c2", category: "Bank", exp_returns: 4 },
      { id: "c3", category: "Debt MF", exp_returns: 7.5 },
      { id: "c4", category: "Large MF", exp_returns: 11 },
      { id: "c5", category: "Small MF", exp_returns: 15 },
      { id: "c6", category: "Midcap MF", exp_returns: 13 },
      { id: "c7", category: "Gold MF", exp_returns: 8 },
      { id: "c8", category: "EPF", exp_returns: 8.1 },
    ],
  };

  private changes: ChangesCollection = {
    changes: (() => {
      const base = this.totalValue();
      const weeks = 52; // ~1 year of weekly data
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

  setTarget(data: TargetAllocation) {
    this.target = data;
    return Promise.resolve();
  }

  getTarget(): Observable<TargetAllocation> {
    return of(this.target) as Observable<TargetAllocation>;
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
      Object.values(this.allocation),
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
                  Object.values(allocation),
                );
                if (portfolio.length) {
                  const groupBy = (arr: any[], key: string) =>
                    arr.reduce((acc, cur) => {
                      (acc[cur[key]] = acc[cur[key]] || []).push(cur);
                      return acc;
                    }, {} as any);
                  const grouped = groupBy(portfolio, "category");
                  const total: any = {};
                  categories.forEach((elem: any, index: number) => {
                    categories[index].investments =
                      grouped[elem.category] || [];
                    categories[index].value = (
                      grouped[elem.category] || []
                    ).reduce((s: number, n: any) => s + n.value, 0);
                  });
                  total.value = categories.reduce(
                    (s: number, n: any) => s + n.value,
                    0,
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
                    0,
                  );
                  total.wt_exp_ret = categories.reduce(
                    (s: number, n: any) => s + n.wt_exp_ret,
                    0,
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
