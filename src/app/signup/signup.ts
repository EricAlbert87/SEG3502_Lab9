
import { Component, inject } from '@angular/core';
import {
  AbstractControl, ReactiveFormsModule, UntypedFormBuilder,
  ValidationErrors, Validators
} from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication-service';

function passwordMatcher(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirmPassword')?.value
    ? null : { mismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  private builder = inject(UntypedFormBuilder);
  private authService = inject(AuthenticationService);
  message = '';
  succes = false;
  enCours = false;

  signupForm = this.builder.group({
    username: ['', Validators.required],
    pwGroup: this.builder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: [passwordMatcher] })
  });

  get username(): AbstractControl { return this.signupForm.get('username')!; }
  get password(): AbstractControl { return this.signupForm.get('pwGroup.password')!; }
  get confirmPassword(): AbstractControl { return this.signupForm.get('pwGroup.confirmPassword')!; }
  get pwGroup(): AbstractControl { return this.signupForm.get('pwGroup')!; }

  register(): void {
    if (this.signupForm.invalid) return;
    this.enCours = true;
    this.message = '';
    this.authService.register(this.username.value, this.password.value).subscribe({
      next: () => {
        this.enCours = false;
        this.succes = true;
        this.message = 'Compte créé avec succès. Vous pouvez maintenant vous connecter.';
        this.signupForm.reset();
      },
      error: error => {
        this.enCours = false;
        this.succes = false;
        this.message = error.status === 400
          ? "Ce nom d'utilisateur est peut-être déjà utilisé."
          : "Impossible de créer le compte. Vérifiez que le serveur est démarré.";
      }
    });
  }
}
