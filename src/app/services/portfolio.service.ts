import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./auth.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class PortfolioService {
  constructor(
    private firestore: AngularFirestore,
    public auth: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  setPortfolio(data) {
    return this.firestore
      .collection("users")
      .doc(this.auth.uid)
      .collection("portfolio")
      .doc("allocation")
      .set(data);
  }

  getPortfolio() {
    return this.firestore
      .collection("users")
      .doc(this.auth.uid)
      .collection("portfolio")
      .doc("allocation")
      .valueChanges();
  }

  setCategory(data) {
    return this.firestore
      .collection("users")
      .doc(this.auth.uid)
      .collection("portfolio")
      .doc("category")
      .set(data);
  }

  getCategory() {
    return this.firestore
      .collection("users")
      .doc(this.auth.uid)
      .collection("portfolio")
      .doc("category")
      .valueChanges();
  }
}
