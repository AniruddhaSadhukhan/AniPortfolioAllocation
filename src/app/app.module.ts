/// <reference path="../../node_modules/anychart/dist/index.d.ts"/>

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ChartPageComponent } from "./chart-page/chart-page.component";
import { TablePageComponent } from "./table-page/table-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {
  MatButtonToggleModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
} from "@angular/material";
import { MatSelectModule } from "@angular/material/select";
import { CategoryComponent } from "./category/category.component";
import { ExpectationsComponent } from "./expectations/expectations.component";
import { AllocationComponent } from "./allocation/allocation.component";

const config = {
  apiKey: "AIzaSyAGW6SyDNAjGg16LSoqVqyYhvxWawCjtss",
  authDomain: "aniportfolioallocation.firebaseapp.com",
  projectId: "aniportfolioallocation",
  storageBucket: "aniportfolioallocation.appspot.com",
  messagingSenderId: "1061219064104",
  appId: "1:1061219064104:web:036de84a7693c3a5fa581d",
  measurementId: "G-ZZMLL59W4M",
};

const AngularMaterial = [
  MatToolbarModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatTooltipModule,
  MatIconModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatMenuModule,
  MatSelectModule,
];

@NgModule({
  declarations: [
    AppComponent,
    ChartPageComponent,
    TablePageComponent,
    CategoryComponent,
    ExpectationsComponent,
    AllocationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ...AngularMaterial,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
