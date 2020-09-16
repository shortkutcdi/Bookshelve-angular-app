import { Book } from './../models/Book.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';


@Injectable()
export class BooksService {

  books: Book[] = [];
  bookSubject = new Subject<Book[]>();

  constructor() { this.getBooks(); }

  emitBooks() {
    this.bookSubject.next(this.books);
  }

  // enregitrer les livres dans la bdd firebase
  saveBooks() {
    firebase.database().ref('/books').set( this.books ); // set fonction comme le put en http
                                                        // si on a quelque chose dans books il sera remplacé
  }

  // récupérer la liste des livres
  // on() va réagir sur des event dans la bdd
  // à chaque fois qu'une valeur ds bdd sera modifiée le callback sera exécuté
  getBooks() {
    firebase.database().ref('/books')
      .on('value', (data) => {
          this.books = data.val() ? data.val() : [];
          this.emitBooks();
        }
      );
  }

  // once() va récupérer les données une fois
  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createBook(newBook: Book) {
    this.books.push(newBook);  // ajouter newBook a books
    this.saveBooks(); // enregistrer sur le serveur
    this.emitBooks(); // emettre le subject
  }

  removeBook(book: Book) {
    if (book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => { console.log('photo supprimée'); }
        ).catch(
          (error) => { console.log('Fichier non trouvé ' + error); }
        );
      }

    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if(bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  // méthode asynchrone -> uploader un fichier prend du temps
  // méthode on() -- pour réagir aux events de l'upload
/*   uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString(); // créer un nom de fichier unique
        const upload = firebase.storage().ref()
                      .child('image/' + almostUniqueFileName + file.name) // nom du fichier
                      .put(file);
        // upload.on() permet de surveiller les changements              
        // à chaque changement d'état on souhaite réagir  TaskEvent.STATE_CHANGED
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => { // 1. en cours
            console.log('Chargement...');
          },
          (error) => { // 2. erreur de chargement
            console.log('Erreur de chargement ' + error);
            reject();  // on reject la promise car erreur
          },
          // complete envoie l'url ds resolve - (upload.snapshot.downloadURL)
          () => { // 3. complete - chargement se termine correctement - resolve(url) -> renvoie l'url
            resolve(upload.snapshot.downloadURL); // downloadURL est l'url directe à l'image ds le storage
                                                  // permettre de l'enregistrer ds la bdd lié au livre
                                                  // et l'afficher dans singleBook component
          }
        );
      }
    );
  } */

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.downloadURL);
          }
        );
      }
    );
  }

}
