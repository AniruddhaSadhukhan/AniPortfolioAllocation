import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-chart-page",
  templateUrl: "./chart-page.component.html",
  styleUrls: ["./chart-page.component.scss"],
})
export class ChartPageComponent implements OnInit {
  @Input() data;
  constructor() {}

  ngOnInit() {
    this.refresh();
  }
  refresh(): void {
    // create data
    var data = [
      {
        name: "Ani",
        children: [
          {
            name: "Debt",
            children: [
              { name: "Axis Bank", value: 200 },
              { name: "IOB", value: 50 },
              { name: "ICICI Ultra Short", value: 30 },
            ],
          },
          {
            name: "Equity",
            children: [
              { name: "Axis Bluechip", value: 12 },
              { name: "Axis ELSS", value: 49 },
            ],
          },
          { name: "Others", children: [] },
        ],
      },
    ];

    // create a chart and set the data
    var chart = anychart.sunburst(data, "as-tree");

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
    // set the container id
    chart.container("container");

    // initiate drawing the chart
    chart.draw();
  }
}
