
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, catchError, of } from 'rxjs';
import { BookEntity } from '../model/bookEntity';
import { BooksService } from '../service/books-service';
import { AuthornamesPipe } from '../../pipes/authornames.pipe';

@Component({
  selector: 'app-book', standalone: true, imports: [AuthornamesPipe],
  templateUrl: './book.html', styleUrls: ['./book.css']
})
export class Book implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private subscription?: Subscription;
  selectedBook: BookEntity | null = null;
  loading = true;
  message = '';

  ngOnInit(): void {
    this.subscription = this.route.paramMap.pipe(
      switchMap(params => {
        this.loading = true;
        this.message = '';
        this.selectedBook = null;
        return this.booksService.getBook(params.get('id') ?? '').pipe(
          catchError(() => {
            this.message = "Impossible de trouver ce livre ou d'accéder au serveur.";
            return of(null);
          })
        );
      })
    ).subscribe({
      next: book => { this.selectedBook = book; this.loading = false; }
    });
  }

  ngOnDestroy(): void { this.subscription?.unsubscribe(); }
}
