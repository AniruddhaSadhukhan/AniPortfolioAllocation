import { Component, OnInit, inject } from "@angular/core";
import { ConfirmationService, MessageService, PrimeTemplate } from "primeng/api";
import { NavItem } from "src/app/models/nav-item";
import { CategoryCollection } from "src/app/models/portfolio";
import { getNavItems } from "src/app/utils/nav-items";
import { PortfolioService } from "../../services/portfolio.service";
import { SelectButton } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import { Button, ButtonDirective } from "primeng/button";
import { TableModule } from "primeng/table";
import { ButtonGroup } from "primeng/buttongroup";
import { Dialog } from "primeng/dialog";
import { Fluid } from "primeng/fluid";
import { FloatLabel } from "primeng/floatlabel";
import { InputText } from "primeng/inputtext";
import { InputNumber } from "primeng/inputnumber";
import { ConfirmDialog } from "primeng/confirmdialog";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-category",
    templateUrl: "./category.component.html",
    styleUrls: ["./category.component.scss"],
    imports: [SelectButton, FormsModule, Button, TableModule, PrimeTemplate, ButtonGroup, Dialog, Fluid, FloatLabel, InputText, InputNumber, ButtonDirective, ConfirmDialog, RouterLink]
})
export class CategoryComponent implements OnInit {
  private service = inject(PortfolioService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  data: CategoryCollection = null;

  currentItem: any = {};
  itemDialog = false;
  submitted = false;

  navItems: NavItem[] = getNavItems("Dashboard", "Allocation", "Expectation");

  openNew() {
    this.currentItem = {};
    this.submitted = false;
    this.itemDialog = true;
  }

  editItem(item) {
    this.currentItem = { ...item };
    this.itemDialog = true;
  }

  deleteItem(selectedItem) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete " + selectedItem.category + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.data["categories"] = this.data["categories"].filter(
          (item) => item.id !== selectedItem.id
        );
        this.updateCategory(this.data);
      },
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    if (
      this.currentItem.category?.trim() &&
      this.isAvailable(this.currentItem)
    ) {
      if (this.currentItem.id) {
        // Edit existing item
        this.data["categories"] = this.data["categories"].map((item) =>
          item.id === this.currentItem.id ? this.currentItem : item
        );
      } else {
        // Add new item
        this.currentItem.id = crypto.randomUUID();
        this.data["categories"].push(this.currentItem);
      }

      this.updateCategory(this.data);

      this.itemDialog = false;
      this.currentItem = {};
    }
  }

  ngOnInit() {
    this.service.getCategory().subscribe({
      next: (res) => {
        if (res) {
          this.data = res;
        } else {
          this.updateCategory({ categories: [] });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isAvailable = (category) => {
    const id = category.id || "";
    // Check if any element in this.data.categories have same name as category.name ignoring same id
    return !this.data.categories.some(
      (elem) => elem.category === category.category && elem.id !== id
    );
  };

  updateCategory = (data: CategoryCollection) => {
    this.service
      .setCategory(data)
      .then(() => {
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Category updated",
          life: 3000,
        });
      })
      .catch((err) => console.log(err));
  };
}
