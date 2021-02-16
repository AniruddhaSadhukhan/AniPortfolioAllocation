import { Component, OnInit, TemplateRef } from "@angular/core";
import { PortfolioService } from "../services/portfolio.service";
import { MatDialog } from "@angular/material";

@Component({
  selector: "app-table-page",
  templateUrl: "./table-page.component.html",
  styleUrls: ["./table-page.component.scss"],
})
export class TablePageComponent implements OnInit {
  data = null;
  options = ["Equity", "Debt", "Others"];
  selectedOption = "Equity";
  displayedColumns: string[] = ["name", "amount", "action"];

  constructor(private service: PortfolioService, private dialog: MatDialog) {}

  ngOnInit() {
    // this.refresh();
    this.service.getPortfolio().subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.data = res;
        } else {
          this.updatePortfolio({
            Debt: [],
            Equity: [],
            Others: [],
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  // refresh(): void {
  //   let json = {
  //     Debt: [
  //       { name: "Axis Bank", value: 200 },
  //       { name: "IOB", value: 50 },
  //       { name: "ICICI Ultra Short", value: 30 },
  //     ],
  //     Equity: [
  //       { name: "Axis Bluechip", value: 12 },
  //       { name: "Axis ELSS", value: 49 },
  //     ],
  //     Others: [],
  //   };
  //   this.service
  //     .setPortfolio(json)
  //     .then(() => {
  //       console.log("Portfolio updated successfully");
  //       this.data = json;
  //     })
  //     .catch((err) => console.log(err));
  // }

  updatePortfolio = (data) => {
    this.service
      .setPortfolio(data)
      .then(() => {
        console.log("Portfolio updated successfully");
      })
      .catch((err) => console.log(err));
  };

  openPopup(templateRef: TemplateRef<any>, i: number) {
    let dialogData = {};
    if (i > -1) {
      dialogData = {
        ...this.data[this.selectedOption][i],
        index: i,
      };
    }
    dialogData["type"] = this.selectedOption;
    const dialogRef = this.dialog.open(templateRef, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      if (result && result.name && result.value) {
        if (result.index) {
          this.data[result.type][result.index] = {
            name: result.name,
            value: result.value,
          };
        } else {
          this.data[result.type].push({
            name: result.name,
            value: result.value,
          });
        }

        console.log(this.data);
        this.updatePortfolio(this.data);
      }
    });
  }

  deletePopup(templateRef: TemplateRef<any>, i: number) {
    let dialogData = {
      ...this.data[this.selectedOption][i],
      index: i,
    };

    dialogData["type"] = this.selectedOption;
    const dialogRef = this.dialog.open(templateRef, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      if (result && result.name && result.value && result.index) {
        this.data[result.type].splice(result.index, 1);

        console.log(this.data);
        this.updatePortfolio(this.data);
      }
    });
  }
}
