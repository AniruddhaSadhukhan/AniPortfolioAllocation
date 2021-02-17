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
  constructor(
    private service: PortfolioService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.service.getPortfolio().subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.data = res;
          this.auth.user$.subscribe((res) => {
            this.refresh(res.displayName);
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  refresh(user: string): void {
    // create data
    var chartData = [
      {
        name: user.split(" ")[0] || "Total",
        children: ["Debt", "Equity", "Others"].map((a) => ({
          name: a,
          children: this.data[a],
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
    chart.labels().format("<span>{%name}</span><br>{%value}k");

    // configure labels of leaves
    chart.leaves().labels().format("<span>{%name}</span><br>{%value}k");
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
