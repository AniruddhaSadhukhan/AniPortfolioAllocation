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
    // .then((doc) => {
    //   if (doc.exists) {
    //     console.log("Document data:", doc.data());
    //   } else {
    //     // doc.data() will be undefined in this case
    //     console.log("No such document!");
    //   }
    // })
    // .catch((error) => {
    //   console.log("Error getting document:", error);
    // });
    // return this.firestore
    //   .collection("users")
    //   .doc(this.auth.uid)
    //   .se.valueChanges({ idField: "id" });
  }
  // updateBank(id, data) {
  //   return this.firestore
  //     .collection("users")
  //     .doc(this.auth.uid)
  //     .collection("banks")
  //     .doc(id)
  //     .set(data);
  // }
  // deleteBank(id) {
  //   return this.firestore
  //     .collection("users")
  //     .doc(this.auth.uid)
  //     .collection("banks")
  //     .doc(id)
  //     .delete();
  // }
}
