import { Injectable } from "@angular/core";
import { Firestore, doc, docData, setDoc } from "@angular/fire/firestore";
import { flatten, groupBy, reduce } from "lodash-es";
import { Observable } from "rxjs";
import { Allocation, CategoryCollection } from "../models/portfolio";
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
    );
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
