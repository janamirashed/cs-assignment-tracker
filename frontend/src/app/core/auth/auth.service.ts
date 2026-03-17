import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser: User | null = null;
    private readonly TOKEN_KEY = 'auth_token';

    constructor(private router: Router) {
        this.restoreSession();
    }

    // Gets called by the callback component after Google login
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.restoreSession();
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private restoreSession(): void {
        const token = this.getToken();
        if (token) {
            try {
                // Decode base64url to base64
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                
                // Decode base64 and properly parse UTF-8 characters
                const jsonPayload = decodeURIComponent(
                    window.atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                
                const payload = JSON.parse(jsonPayload);

                if (payload.exp * 1000 < Date.now()) {
                    this.logout();
                    return;
                }

                this.currentUser = {
                    id: payload.userId,
                    email: payload.sub,
                    name: payload.name ?? '',
                    pictureUrl: payload.picture ?? '',
                    role: payload.role as 'ADMIN' | 'STUDENT'
                };
            } catch (e) {
                console.error('Failed to parse token', e);
                this.logout();
            }
        }
    }

    getUser(): User | null { return this.currentUser; }
    isLoggedIn(): boolean { return this.currentUser !== null; }
    isAdmin(): boolean { return this.currentUser?.role === 'ADMIN'; }
    getUserId(): number { return this.currentUser?.id ?? 0; }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem(this.TOKEN_KEY);
        this.router.navigate(['/login']);
    }
}
