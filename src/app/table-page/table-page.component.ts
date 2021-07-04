import { Component, OnInit, TemplateRef } from "@angular/core";
import { PortfolioService } from "../services/portfolio.service";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-table-page",
  templateUrl: "./table-page.component.html",
  styleUrls: ["./table-page.component.scss"],
})
export class TablePageComponent implements OnInit {
  data = null;
  options = ["Debt", "Equity", "Others"];
  selectedOption = "Equity";
  displayedColumns: string[] = ["name", "amount", "action"];
  categories = [""];

  constructor(
    private service: PortfolioService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.getPortfolio().subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.data = res;
          this.populateCategory();
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

  populateCategory() {
    this.service.getCategory().subscribe(
      (res) => {
        console.log(res);
        if (res) {
          //Populate Category
          try {
            this.categories = res.categories.map((elem) => elem.category);
          } catch (e) {
            console.log(e);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updatePortfolio = (data) => {
    this.service
      .setPortfolio(data)
      .then(() => {
        console.log("Portfolio updated successfully");
      })
      .catch((err) => console.log(err));
  };

  openPopup(templateRef: TemplateRef<any>, i: number) {
    console.log("index is ", i);

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
        if (result.index > -1) {
          this.data[result.type][result.index] = {
            name: result.name,
            value: result.value,
            category: result.category || "",
          };
        } else {
          this.data[result.type].push({
            name: result.name,
            value: result.value,
            category: result.category || "",
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
      if (result && result.name && result.value && result.index > -1) {
        this.data[result.type].splice(result.index, 1);

        console.log(this.data);
        this.updatePortfolio(this.data);
      }
    });
  }

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
