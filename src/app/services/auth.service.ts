import { Injectable, inject } from "@angular/core";
import {
  Auth,
  GoogleAuthProvider,
  authState,
  signInWithPopup,
  signOut,
} from "@angular/fire/auth";
import { Router } from "@angular/router";

import {
  DocumentReference,
  Firestore,
  doc,
  docData,
  setDoc,
} from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private fireAuth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  user$: Observable<any>;
  uid = null;
  constructor() {
    this.user$ = authState(this.fireAuth).pipe(
      switchMap((user) => {
        if (user) {
          this.uid = user.uid;
          return docData(
            doc(this.firestore, `users/${user.uid}`)
          ) as Observable<User>;
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignin() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.fireAuth, provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await signOut(this.fireAuth);
    return this.router.navigate(["/"]);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: DocumentReference = doc(this.firestore, `users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    return setDoc(userRef, data, { merge: true });
  }
}
