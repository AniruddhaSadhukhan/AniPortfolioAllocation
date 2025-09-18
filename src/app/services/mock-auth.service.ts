import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class MockAuthService {
  user$: Observable<User | null>;
  uid: string | null = "mock-uid-123";
  private mockUser: User = {
    uid: "mock-uid-123",
    email: "mock.user@example.com",
    displayName: "Mock User",
    photoURL: "/assets/logo.png",
  };

  constructor() {
    this.user$ = of(this.mockUser);
  }

  async googleSignin() {
    return Promise.resolve(this.mockUser);
  }

  async signOut() {
    this.uid = null;
    this.user$ = of(null);
  }
}
