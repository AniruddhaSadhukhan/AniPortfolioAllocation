import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { PortfolioService } from "../services/portfolio.service";

@Component({
  selector: "app-table-page",
  templateUrl: "./table-page.component.html",
  styleUrls: ["./table-page.component.scss"],
})
export class TablePageComponent implements OnInit {
  data = null;
  options = ["Debt", "Equity", "Others"];
  selectedOption = "Equity";

  categories = [""];

  currentItem: any = {};
  itemDialog: boolean = false;
  submitted: boolean = false;

  // TODO : export the whole list and import it here and filter
  navItems = [
    { label: "Dashboard", icon: "pi-slack", routerLink: ["/view"] },
    // { label: "Manage", icon: "pi-book", routerLink: ["/edit"] },
    {
      label: "Allocation",
      icon: "pi-chart-pie",
      routerLink: ["/allocation"],
    },
    // {
    //   label: "Expectation",
    //   icon: "pi-sliders-v",
    //   routerLink: ["/expectations"],
    // },
    // { label: "Category", icon: "pi-tags", routerLink: ["/category"] },
  ];

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

  constructor(
    private service: PortfolioService,
    private dialog: MatDialog,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.service.getPortfolio().subscribe(
      (res) => {
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
      (err) => {
        console.log(err);
      }
    );
  }

  updatePortfolio = (data) => {
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
