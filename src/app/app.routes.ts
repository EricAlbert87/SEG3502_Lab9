
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Books } from './books/books';
import { Book } from './books/book/book';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Admin } from './admin/admin';
import { loggedInGuard } from './authentication/logged-in.guard';
import { adminGuard } from './authentication/admin.guard';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'books', component: Books, canActivate: [loggedInGuard], children: [
    { path: ':id', component: Book }
  ] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
