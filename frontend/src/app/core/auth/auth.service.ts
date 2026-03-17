import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser: User | null = null;

    constructor(private router: Router) { }

    setUser(user: User): void {
        this.currentUser
            = user;
    }
    getUser(): User | null {
        return this.currentUser;
    }

    isLoggedIn(): boolean {
        return this.currentUser !== null;
    }

    isAdmin(): boolean {
        return this.currentUser?.role === 'ADMIN';
    }
    getUserId(): number {
        return this.currentUser?.id ?? 0;
    }

    logout(): void {
        this.currentUser = null;
        this.router.navigate(['/login']);
    }
}
