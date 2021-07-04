import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-expectations",
  templateUrl: "./expectations.component.html",
  styleUrls: ["./expectations.component.scss"],
})
export class ExpectationsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
