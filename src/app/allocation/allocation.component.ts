import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-allocation",
  templateUrl: "./allocation.component.html",
  styleUrls: ["./allocation.component.scss"],
})
export class AllocationComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
