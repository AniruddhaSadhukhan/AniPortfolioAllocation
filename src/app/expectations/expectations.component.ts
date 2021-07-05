import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { flatten, groupBy, reduce, round } from "lodash";
import { PortfolioService } from "../services/portfolio.service";

@Component({
  selector: "app-expectations",
  templateUrl: "./expectations.component.html",
  styleUrls: ["./expectations.component.scss"],
})
export class ExpectationsComponent implements OnInit {
  displayedColumns: string[] = [
    "category",
    "exp_returns",
    "value",
    "weightage",
    "wt_exp_ret",
  ];
  categories = [];
  total: any = {};
  round = round;

  constructor(private service: PortfolioService, private router: Router) {}

  ngOnInit() {
    this.service.getCategory().subscribe(
      (res) => {
        if (res && res.categories.length) {
          let categories = res.categories;
          this.service.getPortfolio().subscribe(
            (res) => {
              if (res) {
                let portfolio = flatten(Object.values(res));
                if (portfolio.length)
                  [this.categories, this.total] = this.calculateExpectations(
                    categories,
                    portfolio
                  );
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  calculateExpectations = (categories, portfolio) => {
    let portfolioGroupedByCategory = groupBy(portfolio, "category");
    let total: any = {};
    categories.forEach((elem, index) => {
      // categories[index]["investments"] =
      //   portfolioGroupedByCategory[elem.category] || [];
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
    });
    total.wt_exp_ret = reduce(categories, (sum, n) => sum + n.wt_exp_ret, 0);
    return [categories, total];
  };

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
