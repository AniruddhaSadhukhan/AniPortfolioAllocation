import { Component, OnInit, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { PortfolioService } from "../services/portfolio.service";
import { isNumber } from "lodash";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
  data = null;
  displayedColumns: string[] = ["category", "exp_returns", "action"];
  categories = [];

  constructor(
    private service: PortfolioService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.getCategory().subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.data = res;
          this.populateCategoryList(res);
        } else {
          this.updateCategory({ categories: [] });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  populateCategoryList = (data) => {
    this.categories = data.categories.map((elem) => elem.category);
    console.log(this.categories);
  };

  isAvailable = (category, index) => {
    let otherCategories = [...this.categories];
    if (isNumber(index) && index > -1) otherCategories.splice(index, 1);
    return !otherCategories.includes(category);
  };

  updateCategory = (data) => {
    this.service
      .setCategory(data)
      .then(() => {
        console.log("Category updated successfully");
        this.populateCategoryList(data);
      })
      .catch((err) => console.log(err));
  };

  openPopup(templateRef: TemplateRef<any>, i: number) {
    console.log("index is ", i);

    let dialogData = {};
    if (i > -1) {
      dialogData = {
        ...this.data["categories"][i],
        index: i,
      };
    }
    dialogData["type"] = "categories";
    const dialogRef = this.dialog.open(templateRef, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      if (result && result.category && result.exp_returns) {
        if (result.index > -1) {
          this.data[result.type][result.index] = {
            category: result.category,
            exp_returns: result.exp_returns,
          };
        } else {
          this.data[result.type].push({
            category: result.category,
            exp_returns: result.exp_returns,
          });
        }

        console.log(this.data);
        this.updateCategory(this.data);
      }
    });
  }

  deletePopup(templateRef: TemplateRef<any>, i: number) {
    let dialogData = {
      ...this.data["categories"][i],
      index: i,
    };

    dialogData["type"] = "categories";
    const dialogRef = this.dialog.open(templateRef, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      if (
        result &&
        result.category &&
        result.exp_returns &&
        result.index > -1
      ) {
        this.data[result.type].splice(result.index, 1);

        console.log(this.data);
        this.updateCategory(this.data);
      }
    });
  }

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
