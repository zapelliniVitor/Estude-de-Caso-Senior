import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  usernameError: boolean = false;
  passwordError: boolean = false;
  confirmPasswordError: boolean = false;
  generalError: string = '';

  constructor(private router: Router) {}

  register(): void {
    this.resetErrors();
    if (!this.username) {
      this.usernameError = true;
    }
    if (!this.password) {
      this.passwordError = true;
    }
    if (!this.confirmPassword) {
      this.confirmPasswordError = true;
    }
    if (this.usernameError || this.passwordError || this.confirmPasswordError) {
      this.generalError = 'Por favor, preencha todos os campos.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.generalError = 'As senhas não coincidem.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((user: any) => user.username === this.username)) {
      this.generalError = 'Nome de usuário já existe.';
      return;
    }

    users.push({ username: this.username, password: this.password });
    localStorage.setItem('users', JSON.stringify(users));
    this.router.navigate(['/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private resetErrors(): void {
    this.usernameError = false;
    this.passwordError = false;
    this.confirmPasswordError = false;
    this.generalError = '';
  }
}
