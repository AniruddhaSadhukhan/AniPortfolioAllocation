import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { PortfolioService } from "../services/portfolio.service";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
  data = null;

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
    {
      label: "Expectation",
      icon: "pi-sliders-v",
      routerLink: ["/expectations"],
    },
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

  constructor(
    private service: PortfolioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.service.getCategory().subscribe(
      (res) => {
        if (res) {
          this.data = res;
        } else {
          this.updateCategory({ categories: [] });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  isAvailable = (category) => {
    let id = category.id || "";
    // Check if any element in this.data.categories have same name as category.name ignoring same id
    return !this.data.categories.some(
      (elem) => elem.category === category.category && elem.id !== id
    );
  };

  updateCategory = (data) => {
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
