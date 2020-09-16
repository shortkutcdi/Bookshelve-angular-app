# app gerer les photos - intégrer le stockage de fichier

Stockage de fichier avec firebase storage

## firebase storage

- ajouter un photo
- afficher dans singleBook.component
- supprimer photo de l'application si suppression livre

### BookService - uploader photo

````typescript
  // méthode asynchrone - uploader un fichier prend du temps
  // méthode on() -- pour réagir aux events de l'upload
  uploadFile(file: File) {
    return new Promise(
      (Resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
                      .child('/image/' + almostUniqueFileName + file.name) // nom du fichier
                      .put(file);
        // à chaque changement d'état on souhaite réagir  TaskEvent.STATE_CHANGED
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement...');
          },
          (error) => {
            console.log('Erreur de chargement ' + error);
            reject();  // on reject la promise car erreur
          },
          () => { // complete - chargement se termine correctement
            resolve(upload.snapshot.downloadURL); // downloadURL est l'url directe à l'image ds le storage
                                                  // permettre de l'enregistrer ds la bdd lié au livre
                                                  // et l'afficher dans singleBook component
          }
        );
      }
    );
  }
````

### bookFormComponent

`````typescript
export class BookFormComponent implements OnInit {

  bookForm: FormGroup;
  fileIsUploading = false; // indiquer si un fichier se télécharge
  fileUrl: string;         // url du fichier
  fileUploaded = false;    // fichier téléchargé

  constructor(private bookService: BooksService,
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

    this.bookService.createBook(newBook);
    this.router.navigate(['/books']);
  }

  // input type file détecte un fichier
  // va déclencher onUploadFile sur l'event de l'input
  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);  // quand on télécharge on a un tableau event.target.file
                                                // ds notre cas 1 seul fichier d'où event.target.file[0]
  }

  // va déclencher la méthode du service uploadFile()
  // mettre à jour le DOM au fur et à mesure
  onUploadFile(file: File) {
    this.fileIsUploading = true; // on est ds onUploadFIle donc logiquement true
    this.bookService.uploadFile(file).then(
      // si le chargement réussi on récupère une url - voir service uploadFile() L91
      (url: string) => {
        this.fileUrl = url; // enregistrer l'url
        this.fileIsUploading = false; // ici le fichier est téléchargé donc false
        this.fileUploaded = true; // car ici le fichier est téléchargé
      }
    );
  }
````

### bookForm template - input file

````html
    <form [formGroup]="bookForm" (ngSubmit)="onSaveBook()">
      <div class="form-group">
        <label for="title">Titre</label>
        <input type="text" class="form-control"
               formControlName="title">
      </div>
      <div class="form-group">
        <label for="author">Auteur</label>
        <input type="text" class="form-control"
               formControlName="author">
      </div>
      <div class="form-group">
        <h4>Ajouter une photo</h4>
        <label for="photo">Photo</label>
        <input type="file" class="form-control"
               (change)="detectFiles($event)"   
               accept="image/*"    
               formControlName="photo"> <!-- (change) surveille l'évènement au changement - accept="image/*" type de fichier image-->
        <p class="text-success" *ngIf="fileUploaded">Fichier chargé !</p>       
      </div>
      <!-- désactiver le boutton si formulaire invalide et si fichier en cours de téléchargement -->
      <button type="submit" class="btn btn-default" [disabled]="bookForm.invalid || fileIsUploading" >Enregistrer</button>
    </form>
````

## afficher l'image ds singleBook component template

````html
<div class="row">
  <div class="col-xs-12">

    <img alt="" style="max-width: 400px;" 
         [src]="book.photo" 
         *ngIf="book.photo" >

    <h1>{{book.title}}</h1>
    <h3>{{book.author}}</h3>
    <button class="btn btn-default" (click)="onBack()">Retour</button>
  </div>
</div>
````

### supprimer un livre - une photo (si présent) bookService

````typescript

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
````