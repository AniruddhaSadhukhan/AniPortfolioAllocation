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
    this.service.getExpectations().subscribe(
      (res) => {
        let exp: any = res;
        this.categories = exp.categories;
        this.total = exp.total;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
