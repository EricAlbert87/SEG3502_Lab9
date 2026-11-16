
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token-service';

const AUTH_URL = 'http://localhost:8080/auth/';

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  role: string;
}

export interface MessageResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_URL + 'signin', {
      username, password
    });
  }

  register(username: string, password: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(AUTH_URL + 'signup', {
      username, password, role: null
    });
  }

  logout(): void {
    this.tokenService.signOut();
  }

  getUser(): string | null {
    return this.tokenService.getUser();
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken() && !!this.getUser();
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && this.tokenService.getRole() === 'ROLE_ADMIN';
  }
}
