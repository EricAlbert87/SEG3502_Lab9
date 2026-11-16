
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication-service';
import { TokenService } from '../authentication/token-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private authService = inject(AuthenticationService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  username = '';
  password = '';
  message = '';
  enCours = false;

  get isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  get loggedUser(): string | null { return this.authService.getUser(); }

  checkLogin(): void {
    if (!this.username.trim() || !this.password) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }
    this.enCours = true;
    this.message = '';
    this.authService.login(this.username.trim(), this.password).subscribe({
      next: data => {
        this.tokenService.saveToken(data.token);
        this.tokenService.saveUserName(data.username);
        this.tokenService.saveUserRole(data.role);
        this.password = '';
        this.enCours = false;
        this.router.navigateByUrl(data.role === 'ROLE_ADMIN' ? '/admin' : '/books');
      },
      error: () => {
        this.enCours = false;
        this.message = 'Identifiant ou mot de passe incorrect.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/home');
  }
}
