
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-books', standalone: true, imports: [RouterOutlet],
  templateUrl: './books.html', styleUrls: ['./books.css']
})
export class Books {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  message = '';

  submit(value: string): void {
    const id = value.trim();
    if (!/^\d+$/.test(id)) {
      this.message = 'Veuillez entrer un identifiant numérique valide.';
      return;
    }
    this.message = '';
    this.router.navigate([id], { relativeTo: this.route });
  }
}
