import { BooksService } from './../../services/books.service';
import { Book } from './../../models/Book.model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})
export class SingleBookComponent implements OnInit {

  book: Book;

  constructor(private bookService: BooksService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.book = new Book('', '');  // créer un livre vide temporaire
    const id = this.route.snapshot.params['id'];
    this.bookService.getSingleBook(+id).then(
      (book: Book) => {
        this.book = book; // livre récupéré dans le serveur
      }
    ); // + pour le cast en tant que number
  }

  onBack() {
    this.router.navigate(['/books']);
  }

}
