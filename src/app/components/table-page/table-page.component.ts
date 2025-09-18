import { Component, OnInit, inject } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NavItem } from "src/app/models/nav-item";
import { Allocation } from "src/app/models/portfolio";
import { getNavItems } from "src/app/utils/nav-items";
import { PortfolioService } from "../../services/portfolio.service";

@Component({
    selector: "app-table-page",
    templateUrl: "./table-page.component.html",
    styleUrls: ["./table-page.component.scss"],
    standalone: false
})
export class TablePageComponent implements OnInit {
  private service = inject(PortfolioService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  data: Allocation = null;
  options = ["Debt", "Equity", "Others"];
  selectedOption = "Equity";

  categories = [""];

  currentItem: any = {};
  itemDialog = false;
  submitted = false;

  navItems: NavItem[] = getNavItems("Dashboard", "Allocation");

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
      message: "Are you sure you want to delete " + selectedItem.name + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.data[this.selectedOption] = this.data[this.selectedOption].filter(
          (item) => item.id !== selectedItem.id
        );
        this.updatePortfolio(this.data);
      },
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    if (this.currentItem.name?.trim()) {
      // Set undefined category to empty string
      if (!this.currentItem.category) this.currentItem.category = "";

      if (this.currentItem.id) {
        // Edit existing item
        this.data[this.selectedOption] = this.data[this.selectedOption].map(
          (item) => (item.id === this.currentItem.id ? this.currentItem : item)
        );
      } else {
        // Add new item
        this.currentItem.id = crypto.randomUUID();
        this.data[this.selectedOption].push(this.currentItem);
      }

      this.updatePortfolio(this.data);

      this.itemDialog = false;
      this.currentItem = {};
    }
  }

  ngOnInit() {
    this.service.getPortfolio().subscribe({
      next: (res) => {
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
      error: (err) => {
        console.log(err);
      },
    });
  }

  populateCategory() {
    this.service.getCategory().subscribe({
      next: (res) => {
        // console.log(res);
        if (res) {
          //Populate Category
          try {
            this.categories = res.categories.map((elem) => elem.category);
          } catch (e) {
            console.log(e);
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updatePortfolio = (data: Allocation) => {
    this.service
      .setPortfolio(data)
      .then(() => {
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Portfolio updated",
          life: 3000,
        });
      })
      .catch((err) => console.log(err));
  };
}
