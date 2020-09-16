import { BooksService } from './../services/books.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Book } from './../models/Book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[];
  booksSubscription: Subscription; // pour souscrire au subject du service

  constructor(private bookService: BooksService,
              private router: Router) { }

  ngOnInit() {
    this.booksSubscription = this.bookService.bookSubject.subscribe(
      (books: Book[]) => {
        this.books = books; // met  à jour de l'array local this.books depuis le service
      }
    );
    this.bookService.emitBooks();  // faire émettre le subject
  }

  onNewBook() {
    this.router.navigate(['/books', 'new']); // équivaut à "/books/new"
  }

  onDeleteBook(book: Book) {
    this.bookService.removeBook(book);
  }

  onViewBook(id: number) {
    this.router.navigate(['/books', 'view', id]);
  }

  ngOnDestroy(): void {
    this.booksSubscription.unsubscribe();
  }

}
