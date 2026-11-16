
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of, switchMap } from 'rxjs';
import { AuthorEntity, BookEntity } from '../books/model/bookEntity';
import { BooksService } from '../books/service/books-service';

@Component({
  selector: 'app-admin', standalone: true, imports: [ReactiveFormsModule],
  templateUrl: './admin.html', styleUrls: ['./admin.css']
})
export class Admin {
  private builder = inject(FormBuilder);
  private booksService = inject(BooksService);
  message = '';
  succes = false;
  enCours = false;

  bookForm = this.builder.group({
    category: ['', Validators.required],
    title: ['', Validators.required],
    cost: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    authors: this.builder.array<FormGroup>([]),
    year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    description: ['', Validators.required]
  });

  get authors(): FormArray { return this.bookForm.get('authors') as FormArray; }

  addAuthor(): void {
    this.authors.push(this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    }));
  }

  removeAuthor(index: number): void { this.authors.removeAt(index); }

  onSubmit(): void {
    if (this.bookForm.invalid || this.enCours) return;
    this.enCours = true;
    this.message = '';
    const form = this.bookForm.value;
    const book = new BookEntity(
      0, form.category!, form.title!, Number(form.cost), [],
      Number(form.year), form.description!
    );
    const authors = (form.authors ?? []) as {firstName: string; lastName: string}[];

    this.booksService.addBook(book).pipe(
      switchMap(saved => {
        if (!authors.length) return of(saved);
        const operations = authors.map(author =>
          this.booksService.getAuthorsNamed(author.firstName, author.lastName).pipe(
            switchMap(found => found.length
              ? this.booksService.updateBookAuthors(saved.id, found[0].id)
              : this.booksService.addBookAuthor(
                  saved.id, new AuthorEntity(0, author.firstName, author.lastName)
                )
            )
          )
        );
        return forkJoin(operations).pipe(switchMap(() => of(saved)));
      })
    ).subscribe({
      next: saved => {
        this.enCours = false;
        this.succes = true;
        this.message = `Livre ajouté avec succès (no ${saved.id}).`;
        this.bookForm.reset();
        this.authors.clear();
      },
      error: () => {
        this.enCours = false;
        this.succes = false;
        this.message = "Impossible de terminer l'ajout du livre ou de ses auteurs.";
      }
    });
  }
}
