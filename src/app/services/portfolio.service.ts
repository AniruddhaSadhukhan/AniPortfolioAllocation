import { Injectable } from "@angular/core";
import { Firestore, doc, docData, setDoc } from "@angular/fire/firestore";
import { flatten, groupBy, reduce } from "lodash-es";
import { Observable, firstValueFrom } from "rxjs";
import {
  Allocation,
  CategoryCollection,
  Change,
  ChangesCollection,
} from "../models/portfolio";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class PortfolioService {
  constructor(private firestore: Firestore, public auth: AuthService) {}

  setPortfolio(data: Allocation) {
    return setDoc(
      doc(this.firestore, `users/${this.auth.uid}/portfolio/allocation`),
      data
    ).then(() => this.updatePortfolioChange(data));
  }

  getPortfolio(): Observable<Allocation> {
    return docData(
      doc(this.firestore, `users/${this.auth.uid}/portfolio/allocation`)
    ) as Observable<Allocation>;
  }

  setCategory(data: CategoryCollection) {
    return setDoc(
      doc(this.firestore, `users/${this.auth.uid}/portfolio/category`),
      data
    );
  }

  getChanges(): Observable<ChangesCollection> {
    return docData(
      doc(this.firestore, `users/${this.auth.uid}/portfolio/changes`)
    ) as Observable<ChangesCollection>;
  }

  private setChanges(data: ChangesCollection) {
    return setDoc(
      doc(this.firestore, `users/${this.auth.uid}/portfolio/changes`),
      data
    );
  }

  private async updatePortfolioChange(data: Allocation) {
    let changesCollection = await firstValueFrom(this.getChanges());
    if (!changesCollection) {
      changesCollection = { changes: [] };
    }
    let timestamp = new Date();
    let total_value = reduce(
      flatten(Object.values(data)),
      (sum, n) => sum + n.value,
      0
    );
    changesCollection.changes = this.addChange(
      { timestamp, total_value },
      changesCollection.changes
    );
    return this.setChanges(changesCollection);
  }

  async getLastEditedTimestamp() {
    let changesCollection = await firstValueFrom(this.getChanges());
    if (changesCollection && changesCollection.changes.length) {
      let firestoreTimestamp: any = changesCollection.changes[0].timestamp;
      return firestoreTimestamp.toDate();
    }
    return null;
  }

  private addChange(newChange: Change, existingChanges: Change[]) {
    // if the first chnge is of same date, then replace, else add at the beginning
    if (
      existingChanges.length &&
      Object(existingChanges[0].timestamp).toDate().toDateString() ===
        newChange.timestamp.toDateString()
    ) {
      existingChanges[0] = newChange;
    } else {
      existingChanges.unshift(newChange);
    }
    return existingChanges;
  }

  getCategory(): Observable<CategoryCollection> {
    return docData(
      doc(this.firestore, `users/${this.auth.uid}/portfolio/category`)
    ) as Observable<CategoryCollection>;
  }

  getExpectations() {
    return new Observable<{ categories: any[]; total: any }>((observer) => {
      this.getCategory().subscribe({
        next: (res) => {
          if (res && res.categories.length) {
            let categories = res.categories;
            this.getPortfolio().subscribe({
              next: (res) => {
                if (res) {
                  let portfolio = flatten(Object.values(res));
                  if (portfolio.length)
                    observer.next(
                      this.calculateExpectations(categories, portfolio)
                    );
                  else observer.error("No portfolio recieved");
                } else observer.error("No investments recieved");
              },
              error: (err) => {
                observer.error(err);
              },
            });
          } else observer.error("No categories recieved");
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }

  calculateExpectations = (categories, portfolio) => {
    let portfolioGroupedByCategory = groupBy(portfolio, "category");
    let total: any = {};
    categories.forEach((elem, index) => {
      categories[index]["investments"] =
        portfolioGroupedByCategory[elem.category] || [];
      categories[index]["value"] = reduce(
        portfolioGroupedByCategory[elem.category] || [],
        (sum, n) => sum + n.value,
        0
      );
    });

    total.value = reduce(categories, (sum, n) => sum + n.value, 0);
    total.weightage = 100;

    categories.forEach((elem, index) => {
      categories[index]["weightage"] = (elem.value / total.value) * 100;

      categories[index]["wt_exp_ret"] =
        (categories[index]["weightage"] * categories[index]["exp_returns"]) /
        100;

      categories[index]["exp_returns_abs"] =
        (categories[index]["exp_returns"] / 100) * categories[index]["value"];
    });
    total.exp_returns_abs = reduce(
      categories,
      (sum, n) => sum + n.exp_returns_abs,
      0
    );
    total.wt_exp_ret = reduce(categories, (sum, n) => sum + n.wt_exp_ret, 0);
    return { categories, total };
  };
}
