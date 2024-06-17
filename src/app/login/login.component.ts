import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  login(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: any) => user.username === this.username && user.password === this.password);

    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/clientes']);
    } else {
      this.errorMessage = 'Nome de usuário ou senha incorretos.';
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
