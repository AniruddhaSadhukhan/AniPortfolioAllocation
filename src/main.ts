import { enableProdMode, importProvidersFrom } from "@angular/core";

import { environment } from "./environments/environment";

import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import "anychart/dist/js/anychart-base.min.js";
import "anychart/dist/js/anychart-sunburst.min.js";
import "anychart/dist/js/anychart-ui.min.js";
import { ConfirmationService, MessageService, SharedModule } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { ButtonGroupModule } from "primeng/buttongroup";
import { providePrimeNG } from "primeng/config";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DrawerModule } from "primeng/drawer";
import { FloatLabelModule } from "primeng/floatlabel";
import { FluidModule } from "primeng/fluid";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { AppRoutingModule } from "./app/app-routing.module";
import { AppComponent } from "./app/app.component";
import { AuthService } from "./app/services/auth.service";
import { MockAuthService } from "./app/services/mock-auth.service";
import { MockPortfolioService } from "./app/services/mock-portfolio.service";
import { PortfolioService } from "./app/services/portfolio.service";
import LaraDarkBlue from "./app/theme/preset-lara-dark-blue";

const config = {
  apiKey: "AIzaSyAGW6SyDNAjGg16LSoqVqyYhvxWawCjtss",
  authDomain: "aniportfolioallocation.firebaseapp.com",
  projectId: "aniportfolioallocation",
  storageBucket: "aniportfolioallocation.appspot.com",
  messagingSenderId: "1061219064104",
  appId: "1:1061219064104:web:036de84a7693c3a5fa581d",
  measurementId: "G-ZZMLL59W4M",
};
const PrimeModules = [
  SharedModule,
  ToolbarModule,
  AvatarModule,
  DrawerModule,
  TooltipModule,
  ButtonModule,
  MenuModule,
  ProgressSpinnerModule,
  ToggleSwitchModule,
  SelectButtonModule,
  TableModule,
  MultiSelectModule,
  TagModule,
  ButtonGroupModule,
  DialogModule,
  SelectModule,
  ConfirmDialogModule,
  InputTextModule,
  InputNumberModule,
  FloatLabelModule,
  FluidModule,
  MessageModule,
  ToastModule,
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      ...PrimeModules
    ),
    ConfirmationService,
    MessageService,
    providePrimeNG({
      theme: {
        preset: LaraDarkBlue,
        options: {
          darkModeSelector: ".app-dark",
          cssLayer: {
            name: "primeng",
            order: "primeng, app-styles",
          },
        },
      },
    }),
    ...(environment.useMocks
      ? [
          { provide: AuthService, useExisting: MockAuthService },
          { provide: PortfolioService, useExisting: MockPortfolioService },
        ]
      : [
          provideFirebaseApp(() => initializeApp(config)),
          provideFirestore(() => getFirestore()),
          provideAuth(() => getAuth()),
        ]),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
