import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { round } from "lodash";
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

    console.log(chartData);
    // create a chart and set the data
    this.chart = anychart.sunburst(chartData, "as-tree");

    // set the calculation mode
    this.chart.calculationMode("parent-independent");

    // chart.level(2).thickness(0);

    // enable HTML for labels
    this.chart.labels().useHtml(true);
    // configure labels
    this.chart.labels().format("<span><b>{%name}</b></span>");
    // <br>{%value}k<br><i>({%percent}%)</i>
    this.chart
      .level(0)
      .labels()
      .format("<span><b>{%name}</b></span><br>{%value}k<br>{%return}%");

    // // configure labels of leaves
    this.chart
      .leaves()
      .labels()
      .format("<span><b>{%name}</b></span><br>{%value}k");
    // chart.leaves().labels().enabled(true);
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
