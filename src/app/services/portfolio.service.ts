import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { flatten, groupBy, reduce } from "lodash-es";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class PortfolioService {
  constructor(
    private firestore: AngularFirestore,
    public auth: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  setPortfolio(data) {
    return this.firestore
      .collection("users")
      .doc(this.auth.uid)
      .collection("portfolio")
      .doc("allocation")
      .set(data);
  }

  getPortfolio() {
    return this.firestore
      .collection("users")
      .doc(this.auth.uid)
      .collection("portfolio")
      .doc("allocation")
      .valueChanges();
  }

  setCategory(data) {
    return this.firestore
      .collection("users")
      .doc(this.auth.uid)
      .collection("portfolio")
      .doc("category")
      .set(data);
  }

  getCategory() {
    return this.firestore
      .collection("users")
      .doc(this.auth.uid)
      .collection("portfolio")
      .doc("category")
      .valueChanges();
  }

  getExpectations() {
    return new Observable<{ categories: any[]; total: any }>((observer) => {
      this.getCategory().subscribe(
        (res) => {
          if (res && res.categories.length) {
            let categories = res.categories;
            this.getPortfolio().subscribe(
              (res) => {
                if (res) {
                  let portfolio = flatten(Object.values(res));
                  if (portfolio.length)
                    observer.next(
                      this.calculateExpectations(categories, portfolio)
                    );
                  else observer.error("No portfolio recieved");
                } else observer.error("No investments recieved");
              },
              (err) => {
                observer.error(err);
              }
            );
          } else observer.error("No categories recieved");
        },
        (err) => {
          observer.error(err);
        }
      );
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
        categories[index]["exp_returns"] / 100 * categories[index]["value"];
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
