import { Component, OnInit } from "@angular/core";
import { NavItem } from "src/app/models/nav-item";
import { getCurrencyUnit } from "src/app/utils/currency-unit.pipe";
import { getNavItems } from "src/app/utils/nav-items";
import { AuthService } from "../../services/auth.service";
import { PortfolioService } from "../../services/portfolio.service";
@Component({
  selector: "app-chart-page",
  templateUrl: "./chart-page.component.html",
  styleUrls: ["./chart-page.component.scss"],
})
export class ChartPageComponent implements OnInit {
  data;
  userName;
  omitOthers = true;

  navItems: NavItem[] = getNavItems("Manage", "Allocation");

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
  calculatePercentage = (data, groups) => {
    let total = { Debt: 0, Equity: 0, Others: 0, all: 0 };

    data["percent"] = {
      Debt: 0,
      Equity: 0,
      Others: 0,
    };

    groups.forEach((group) => {
      data[group].forEach((a) => (total[group] += a.value));
      total["all"] += total[group];
    });
    // console.log(total);
    groups.forEach((group) => {
      data[group].forEach((a) => {
        a["percent"] = Math.round((a.value / total[group]) * 100);
      });
      data["percent"][group] = Math.round(
        (total[group] / total["all"]) * 100
      );
    });
  };

  refresh(): void {
    let groups = ["Debt", "Equity"];
    if (!this.omitOthers) groups.push("Others");

    this.calculatePercentage(this.data, groups);
    // console.log(this.data);
    // create data
    var chartData = [
      {
        name: this.userName.split(" ")[0] || "Total",
        children: groups.map((a) => ({
          name: a,
          children: this.data[a],
          percent: this.data.percent[a],
        })),
      },
    ];
    console.log(chartData);

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
      .format(function () {
        return `<span><b>${this.name}</b></span><br>${getCurrencyUnit(this.value)}<br><i>(${this.getData("percent")}%)</i>`;
      });

    //Tooltip
    this.chart
      .tooltip()
      .useHtml(true)
      .format(function () {
        return `<span><b>${this.name}</b></span><br>${getCurrencyUnit(this.value)}`;
      });

    this.chart
      .level(0)
      .labels()
      .format(function () {
        return `<span><b>${this.name}</b></span><br>${getCurrencyUnit(this.value)}`;
      });


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
