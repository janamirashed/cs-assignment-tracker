import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  loginWithGoogle() {
    // TODO: wire to Spring Boot OAuth2 endpoint
    // window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    this.router.navigate(['/dashboard']);
  }

  loginWithEmail() {
    // Placeholder — email flow goes here
    console.log('Email login clicked');
  }

  loginWithSSO() {
    // Placeholder — SSO flow goes here
    console.log('SSO login clicked');
  }
}
