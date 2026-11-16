
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './authentication/authentication-service';

@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html', styleUrls: ['./app.css']
})
export class App {
  private auth = inject(AuthenticationService);
  private router = inject(Router);
  title = 'Bibliothèque sécurisée';

  get isLoggedIn(): boolean { return this.auth.isLoggedIn(); }
  get isAdmin(): boolean { return this.auth.isAdmin(); }
  get loggedUser(): string | null { return this.auth.getUser(); }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/home');
  }
}
