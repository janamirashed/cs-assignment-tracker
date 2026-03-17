import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../../../environments/environment';

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
    window.location.href = `${environment.authUrl}/oauth2/authorization/google`;
  }

  loginWithEmail(): void {
    console.log('email login clicked');
  }
}
