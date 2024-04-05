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


  // TODO : export the whole list and import it here and filter
  navItems = [
    { label: "Dashboard", icon: "pi-slack", routerLink: ["/view"] },
    // { label: "Manage", icon: "pi-book", routerLink: ["/edit"] },
    {
      label: "Allocation",
      icon: "pi-chart-pie",
      routerLink: ["/allocation"],
    },
    // {
    //   label: "Expectation",
    //   icon: "pi-sliders-v",
    //   routerLink: ["/expectations"],
    // },
    { label: "Category", icon: "pi-tags", routerLink: ["/category"] },
  ];

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
