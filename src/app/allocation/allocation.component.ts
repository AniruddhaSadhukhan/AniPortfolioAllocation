import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { round } from "lodash-es";
import { PortfolioService } from "../services/portfolio.service";

@Component({
  selector: "app-allocation",
  templateUrl: "./allocation.component.html",
  styleUrls: ["./allocation.component.scss"],
})
export class AllocationComponent implements OnInit {
  categories = [];
  total: any = {};
  chart: anychart.charts.Sunburst;
  constructor(private service: PortfolioService, private router: Router) {}

  // TODO : export the whole list and import it here and filter
  navItems = [
    { label: "Dashboard", icon: "pi-slack", routerLink: ["/view"] },
    // { label: "Manage", icon: "pi-book", routerLink: ["/edit"] },
    // {
    //   label: "Allocation",
    //   icon: "pi-chart-pie",
    //   routerLink: ["/allocation"],
    // },
    {
      label: "Expectation",
      icon: "pi-sliders-v",
      routerLink: ["/expectations"],
    },
    { label: "Category", icon: "pi-tags", routerLink: ["/category"] },
  ];

  ngOnInit() {
    this.service.getExpectations().subscribe(
      (res) => {
        let exp: any = res;
        this.categories = exp.categories;
        this.total = exp.total;
        this.refresh();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  refresh(): void {
    // create data
    var chartData = [
      {
        name: "Total",
        return: round(this.total.wt_exp_ret, 2),
        children: this.categories.map((elem) => ({
          name: elem.category,
          id: elem.category,
          return: round(elem.wt_exp_ret, 2),
          children: elem.investments,
          percent: round(elem.weightage, 2),
        })),
      },
    ];

    // console.log(chartData);

    anychart.graphics.useAbsoluteReferences(false);
    // create a chart and set the data
    this.chart = anychart.sunburst(chartData, "as-tree");

    this.chart.title("Categories & Expected Weighted Returns");

    // set the calculation mode
    this.chart.calculationMode("parent-independent");

    // enable HTML for labels
    this.chart.labels().useHtml(true);

    // configure labels of categories
    this.chart
      .labels()
      .format(
        "<span><b>{%name}</b></span><br>({%value}K - {%percent}%)<br><i>@{%return}%</i>"
      );

    //Tooltip
    this.chart
      .tooltip()
      .useHtml(true)
      .format("<span><b>{%name}</b></span><br>({%value}K)");

    // configure labels of center
    this.chart
      .level(0)
      .labels()
      .format(
        "<span><b>{%name}</b></span><br>({%value}K)<br><b><i>@{%return}%</i></b>"
      );

    // // configure labels of leaves
    this.chart
      .leaves()
      .labels()
      .format("<span><b>{%name}</b></span><br>({%value}K)");

    // configure the chart stroke
    this.chart.normal().stroke("#fff", 0.8);

    // darken the leaf color
    this.chart.fill(function () {
      return this.isLeaf
        ? anychart.color.darken(this.sourceColor, 0.05) + " 0.7"
        : this.sourceColor;
    });

    this.chart.level(2).thickness("30%");
    this.chart.level(0).thickness("30%");
    // set the position of labels
    this.chart.labels().position("circular");
    this.chart.padding(0);
    this.chart.background().enabled(false);
    // set the container id
    document.getElementById("allocation-container") &&
      (document.getElementById("allocation-container").innerHTML = "");
    this.chart.container("allocation-container");
    // initiate drawing the chart
    this.chart.draw();
  }

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
