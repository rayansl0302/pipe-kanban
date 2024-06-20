import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.less']
})
export class CreateUserComponent {
  createUserForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      accessLevel: ['', Validators.required],
      workspace: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.createUserForm.valid) {
      const { email, password, accessLevel, workspace } = this.createUserForm.value;
      this.authService.registerUser(email, password, accessLevel, workspace).catch(error => {
        this.errorMessage = error.message;
      });
    }
  }
}
