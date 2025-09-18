import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { round } from "lodash-es";
import { NavItem } from "src/app/models/nav-item";
import { getNavItems } from "src/app/utils/nav-items";
import { PortfolioService } from "../../services/portfolio.service";

@Component({
    selector: "app-expectations",
    templateUrl: "./expectations.component.html",
    styleUrls: ["./expectations.component.scss"],
    standalone: false
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

  navItems: NavItem[] = getNavItems("Dashboard", "Allocation");

  constructor(private service: PortfolioService, private router: Router) {}

  ngOnInit() {
    this.service.getExpectations().subscribe({
      next: (res) => {
        let exp: any = res;
        this.categories = exp.categories;
        this.total = exp.total;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
