
import { Pipe, PipeTransform } from '@angular/core';
import { AuthorEntity } from '../books/model/bookEntity';

@Pipe({ name: 'authornames', standalone: true })
export class AuthornamesPipe implements PipeTransform {
  transform(authors?: AuthorEntity[]): string {
    if (!authors?.length) return 'Non précisé';
    return authors.map(a => `${a.firstName} ${a.lastName}`).join(' et ');
  }
}
