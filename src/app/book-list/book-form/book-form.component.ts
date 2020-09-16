import { BooksService } from './../../services/books.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from '../../models/Book.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  bookForm: FormGroup;
  fileIsUploading = false; // indiquer si un fichier se télécharge
  fileUrl: string;         // url du fichier
  fileUploaded = false;    // fichier téléchargé

  constructor(private booksService: BooksService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.bookForm = this.formBuilder.group(
      {
        title: ['', Validators.required],
        author: ['', Validators.required]
      }
    );

  }
  onSaveBook() {
    const title = this.bookForm.get('title').value;
    const author = this.bookForm.get('author').value;
    const newBook = new Book(title, author);
    // si un url de fichier présent sur la page
    // on enregistre la photo ds book
    if (this.fileUrl && this.fileUrl !== '') {
      newBook.photo = this.fileUrl;
    }
    this.booksService.createBook(newBook);
    this.router.navigate(['/books']);
  }

  // input type file détecte un fichier
  // va déclencher onUploadFile sue l'event de l'input
  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);  // quand on télécharge on a un tableau de event.target.file
                                                // ds notre cas 1 seul fichier event.target.file[0]
  }

  // va déclencher la méthode du service uploadFile()
  // mettre à jour le DOM au fur et à mesure
/*   onUploadFile(file: File) {
    this.fileIsUploading = true; // on est ds onUploadFIle donc logiquement true
    this.booksService.uploadFile(file).then(
      // si le chargement réussi on récupère une url - voir service uploadFile() L91
      (url: string) => {
        this.fileUrl = url; // enregistrer l'url
        this.fileIsUploading = false; // ici le fichier est téléchargé donc false
        this.fileUploaded = true; // car ici le fichier est téléchargé
      }
    );
  } */

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.booksService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
}

}
