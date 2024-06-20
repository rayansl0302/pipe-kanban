// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).catch(error => {
        this.handleError(error);
      });
    }
  }

  private handleError(error: any): void {
    switch (error.code) {
      case 'auth/invalid-email':
        this.errorMessage = 'Email inválido.';
        break;
      case 'auth/user-disabled':
        this.errorMessage = 'Usuário desativado.';
        break;
      case 'auth/user-not-found':
        this.errorMessage = 'Usuário não encontrado.';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Senha incorreta.';
        break;
      default:
        this.errorMessage = 'Ocorreu um erro. Tente novamente.';
        break;
    }
  }
}
