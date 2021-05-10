import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
  color = "primary";

  changed() {
    this.refresh();
  }

  constructor(
    private service: PortfolioService,
    private router: Router,
    public auth: AuthService
  ) {}

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
    console.log(total);
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
    console.log(this.data);
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

    // create a chart and set the data
    var chart = anychart.sunburst(chartData, "as-tree");

    // set the calculation mode
    chart.calculationMode("parent-independent");

    // enable HTML for labels
    chart.labels().useHtml(true);
    // configure labels
    chart
      .labels()
      .format(
        "<span><b>{%name}</b></span><br>{%value}k<br><i>({%percent}%)</i>"
      );

    chart.level(0).labels().format("<span><b>{%name}</b></span><br>{%value}k");

    // configure labels of leaves
    chart
      .leaves()
      .labels()
      .format(
        "<span><b>{%name}</b></span><br>{%value}k<br><i>({%percent}%)</i>"
      );
    // set the position of labels
    chart.labels().position("circular");
    chart.padding(0);
    chart.background().enabled(false);
    // set the container id
    document.getElementById("container") &&
      (document.getElementById("container").innerHTML = "");
    chart.container("container");

    // initiate drawing the chart
    chart.draw();
  }

  manage = () => {
    this.router.navigate(["/edit"]);
  };
}
