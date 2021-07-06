import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Chart } from "highcharts";
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
  chart: anychart.charts.Sunburst;
  sunBurstChart: Chart;
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
    // this.createChart();
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

    let colors = {
      Debt: "rgb(25, 118, 210)",
      Equity: "rgb(239, 108, 0)",
      Others: "rgb(0, 131, 143)",
    };

    // create data
    var chartData = [
      {
        name: this.userName.split(" ")[0] || "Total",
        children: categories.map((a) => ({
          name: a,
          color: colors[a],
          children: this.data[a],
          percent: this.data.percent[a],
        })),
      },
    ];

    console.log(chartData);
    chartData = this.service.prepareSunBurstData(chartData);
    this.sunBurstChart = new Chart({
      chart: {
        renderTo: "container",
        backgroundColor: "transparent",
      },
      title: {
        text: "",
      },
      credits: {
        enabled: false,
      },

      plotOptions: {
        series: {
          dataLabels: {
            color: "white",
            // borderWidth: 0,
            // useHTML: true,
            // overflow: false,
            allowOverlap: false,
            padding: 0,
            // verticalAlign: "top",
            // style: {
            //   "text-anchor": "middle",
            //   // fontSize: "auto",
            // },
            crop: true,
            format:
              "<b>{point.name}</b><br>{point.value} K<br><i>({point.percent}%)</i>",
          },
        },
      },

      series: [
        {
          type: "sunburst",
          data: chartData,
          allowTraversingTree: true,
          cursor: "pointer",

          levels: [
            {
              level: 1,
              color: "rgb(100, 181, 246)",
              dataLabels: {
                rotationMode: "auto",
                format: "{point.name}<br>{point.value} K",
                style: {
                  // fontSize: "1em",
                },
              },
            },
            {
              level: 2,
              dataLabels: {
                rotationMode: "auto",
              },
            },
            {
              level: 3,
              colorVariation: {
                key: "brightness",
                to: -0.5,
              },
            },
          ],
        },
      ],
    });
    // // create a chart and set the data
    // this.chart = anychart.sunburst(chartData, "as-tree");

    // // set the calculation mode
    // this.chart.calculationMode("parent-independent");

    // // enable HTML for labels
    // this.chart.labels().useHtml(true);
    // // configure labels
    // this.chart
    //   .labels()
    //   .format(
    //     "<span><b>{%name}</b></span><br>{%value}k<br><i>({%percent}%)</i>"
    //   );

    // this.chart
    //   .level(0)
    //   .labels()
    //   .format("<span><b>{%name}</b></span><br>{%value}k");

    // // configure labels of leaves
    // this.chart
    //   .leaves()
    //   .labels()
    //   .format(
    //     "<span><b>{%name}</b></span><br>{%value}k<br><i>({%percent}%)</i>"
    //   );
    // // set the position of labels
    // this.chart.labels().position("circular");
    // this.chart.padding(0);
    // this.chart.background().enabled(false);
    // // set the container id
    // document.getElementById("container") &&
    //   (document.getElementById("container").innerHTML = "");
    // this.chart.container("container");

    // // initiate drawing the chart
    // this.chart = this.chart.draw();
  }

  createChart() {
    var data = [
      {
        id: "0.0",
        parent: "",
        name: "Service Cloud",
      },
      {
        id: "Product",
        parent: "0.0",
        name: "Product",
      },
      {
        id: "Device",
        parent: "0.0",
        name: "Device",
      },
      {
        id: "Customer/User",
        parent: "0.0",
        name: "Customer/User",
      },

      /* Africa */
      {
        id: "2.1",
        parent: "Device",
        name: "Embedded Software",
        value: 2,
      },

      {
        id: "2.2",
        parent: "Device",
        name: "Device Security",
        value: 3,
      },
      {
        id: "2.3",
        parent: "Device",
        name: "Device Shadow",
        value: 2,
      },
      {
        id: "3.1",
        parent: "Product",
        name: "Product Model",
        value: 1,
      },
      {
        id: "3.2",
        parent: "Product",
        name: "Product Individual",
        value: 1,
      },
      {
        id: "3.3",
        parent: "Product",
        name: "Service Contract",
        value: 1,
      },
      {
        id: "3.4",
        parent: "Product",
        name: "Service Prescription",
        value: 1,
      },
      {
        id: "3.5",
        parent: "Product",
        name: "Service Plan",
        value: 1,
      },
      {
        id: "3.6",
        parent: "Product",
        name: "Part List",
        value: 1,
      },
      {
        id: "3.7",
        parent: "Product",
        name: "Product Model",
        value: 1,
      },

      {
        id: "4.1",
        parent: "Customer/User",
        name: "User Identity",
        value: 3,
      },
      {
        id: "4.2",
        parent: "Customer/User",
        name: "Customer",
        value: 2,
      },
      {
        id: "4.3",
        parent: "Customer/User",
        name: "User Product Relationship",
        value: 2,
      },
    ];
    this.sunBurstChart = new Chart({
      chart: {
        renderTo: "container",

        // backgroundColor:
      },
      title: {
        text: "Linechart",
      },
      credits: {
        enabled: false,
      },

      series: [
        {
          type: "sunburst",
          data: data,
          allowTraversingTree: true,
          cursor: "pointer",
          dataLabels: {
            /**
             * A custom formatter that returns the name only if the inner arc
             * is longer than a certain pixel size, so the shape has place for
             * the label.
             */
            // formatter: function () {
            //   var shape = this.point.node.shapeArgs;
            //   var innerArcFraction = (shape.end - shape.start) / (2 * Math.PI);
            //   var perimeter = 2 * Math.PI * shape.innerR;
            //   var innerArcPixels = innerArcFraction * perimeter;
            //   if (innerArcPixels > 16) {
            //     return this.point.name;
            //   }
            // },
          },
          levels: [
            {
              level: 1,
              // size: 500,
              dataLabels: {
                rotationMode: "auto",
              },
            },
            {
              level: 2,
              // size: 100,
              // colorByPoint: true,
              dataLabels: {
                rotationMode: "auto",
              },
            },
            {
              level: 3,
              colorVariation: {
                key: "brightness",
                to: -0.5,
              },
            },
            {
              level: 4,
              colorVariation: {
                key: "brightness",
                to: 0.5,
              },
            },
          ],
        },
      ],
    });
  }

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
