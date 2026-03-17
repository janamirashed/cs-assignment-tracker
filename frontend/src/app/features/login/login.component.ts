import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService) { }

  loginWithGoogle(): void {
    // temporary: creates a fake admin user
    this.authService.setUser({
      id: 1,
      email: 'admin@university.edu',
      name: 'Admin User',
      role: 'ADMIN'
    });
    this.router.navigate(['/dashboard']);
  }

  loginWithEmail(): void {
    console.log('email login clicked');
  }
}
