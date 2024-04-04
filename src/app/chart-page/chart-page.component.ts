import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { PortfolioService } from "../services/portfolio.service";
@Component({
  selector: "app-chart-page",
  templateUrl: "./chart-page.component.html",
  styleUrls: ["./chart-page.component.scss"],
})
export class ChartPageComponent implements OnInit {
  data;
  userName;
  omitOthers = true;

  // TODO : export the whole list and import it here and filter
  navItems = [
    // { label: "Dashboard", icon: "pi-slack", routerLink: ["/view"] },
    { label: "Manage", icon: "pi-book", routerLink: ["/edit"] },
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
    // { label: "Category", icon: "pi-tags", routerLink: ["/category"] },
  ];

  chart: anychart.charts.Sunburst;
  changed() {
    this.refresh();
  }

  constructor(private service: PortfolioService, public auth: AuthService) {}

  ngOnInit() {
    this.service.getPortfolio().subscribe(
      (res) => {
        // console.log(res);
        if (res) {
          this.data = res;
          this.auth.user$.subscribe((res) => {
            this.userName = res.displayName;
            this.refresh();
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  calculatePercentage = (data, categories) => {
    let total = { Debt: 0, Equity: 0, Others: 0, all: 0 };

    data["percent"] = {
      Debt: 0,
      Equity: 0,
      Others: 0,
    };

    categories.forEach((category) => {
      data[category].forEach((a) => (total[category] += a.value));
      total["all"] += total[category];
    });
    // console.log(total);
    categories.forEach((category) => {
      data[category].forEach((a) => {
        a["percent"] = Math.round((a.value / total[category]) * 100);
      });
      data["percent"][category] = Math.round(
        (total[category] / total["all"]) * 100
      );
    });
  };

  refresh(): void {
    let categories = ["Debt", "Equity"];
    if (!this.omitOthers) categories.push("Others");

    this.calculatePercentage(this.data, categories);
    // console.log(this.data);
    // create data
    var chartData = [
      {
        name: this.userName.split(" ")[0] || "Total",
        children: categories.map((a) => ({
          name: a,
          children: this.data[a],
          percent: this.data.percent[a],
        })),
      },
    ];

    anychart.graphics.useAbsoluteReferences(false);
    // create a chart and set the data
    this.chart = anychart.sunburst(chartData, "as-tree");

    this.chart.title("Portfolio");

    // set the calculation mode
    this.chart.calculationMode("parent-independent");

    // enable HTML for labels
    this.chart.labels().useHtml(true);
    // configure labels
    this.chart
      .labels()
      .format(
        "<span><b>{%name}</b></span><br>{%value}k<br><i>({%percent}%)</i>"
      );

    //Tooltip
    this.chart
      .tooltip()
      .useHtml(true)
      .format("<span><b>{%name}</b></span><br>({%value}K)");

    this.chart
      .level(0)
      .labels()
      .format("<span><b>{%name}</b></span><br>{%value}k");

    // configure labels of leaves
    this.chart
      .leaves()
      .labels()
      .format(
        "<span><b>{%name}</b></span><br>{%value}k<br><i>({%percent}%)</i>"
      );

    // configure the chart stroke
    this.chart.normal().stroke("#fff", 0.8);

    // darken the leaf color
    this.chart.fill(function () {
      return this.isLeaf
        ? anychart.color.darken(this.sourceColor, 0.05) + " 0.7"
        : this.sourceColor;
    });

    // set the position of labels
    this.chart.labels().position("circular");
    this.chart.padding(0);
    this.chart.background().enabled(false);
    // set the container id
    document.getElementById("container") &&
      (document.getElementById("container").innerHTML = "");
    this.chart.container("container");

    // initiate drawing the chart
    this.chart = this.chart.draw();
  }
}
