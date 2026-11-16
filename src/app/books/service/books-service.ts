
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BookEntity, AuthorEntity } from '../model/bookEntity';

const BOOKS_URL = 'http://localhost:8080/books-api/';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private http = inject(HttpClient);

  getBook(id: string): Observable<BookEntity> {
    return this.http.get<BookEntity>(BOOKS_URL + 'books/' + encodeURIComponent(id));
  }

  addBook(book: BookEntity): Observable<BookEntity> {
    return this.http.post<BookEntity>(BOOKS_URL + 'books', book);
  }

  addBookAuthor(bookId: number, author: AuthorEntity): Observable<AuthorEntity> {
    return this.http.post<AuthorEntity>(BOOKS_URL + 'books/' + bookId + '/authors', author);
  }

  getAuthorsNamed(firstName: string, lastName: string): Observable<AuthorEntity[]> {
    const params = new HttpParams().set('firstName', firstName).set('lastName', lastName);
    return this.http.get<{ _embedded?: { authors?: AuthorEntity[] } }>(
      BOOKS_URL + 'authors', { params }
    ).pipe(map(response => response._embedded?.authors ?? []));
  }

  updateBookAuthors(bookId: number, authorId: number): Observable<unknown> {
    return this.http.patch(BOOKS_URL + 'books/' + bookId + '/authors/' + authorId, {});
  }
}
