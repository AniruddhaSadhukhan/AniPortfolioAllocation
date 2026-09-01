import { InjectionToken } from "@angular/core";
import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { DocumentReference, Firestore } from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { Observable } from "rxjs";

export const FIREBASE_AUTH = new InjectionToken<Auth>("FIREBASE_AUTH");
export const FIREBASE_FIRESTORE = new InjectionToken<Firestore>("FIREBASE_FIRESTORE");

let firebaseApp: FirebaseApp | undefined;

// Ensures initializeApp() is only ever called once for the default app.
function getFirebaseApp(config: FirebaseOptions): FirebaseApp {
  return (firebaseApp ??= initializeApp(config));
}

export function firebaseAuthFactory(config: FirebaseOptions): Auth {
  return getAuth(getFirebaseApp(config));
}

export function firebaseFirestoreFactory(config: FirebaseOptions): Firestore {
  return getFirestore(getFirebaseApp(config));
}

// Replacement for AngularFire's authState().
export function authState$(auth: Auth): Observable<User | null> {
  return new Observable<User | null>((subscriber) => onAuthStateChanged(auth, subscriber));
}

// Replacement for AngularFire's docData().
export function docData$<T>(ref: DocumentReference<T>): Observable<T | undefined> {
  return new Observable<T | undefined>((subscriber) =>
    onSnapshot(
      ref,
      (snapshot) => subscriber.next(snapshot.data()),
      (error) => subscriber.error(error)
    )
  );
}
