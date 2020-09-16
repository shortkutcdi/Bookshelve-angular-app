# Ecouter l'utilisateur avec les Forms : méthode réactive

[méthode réactive](https://openclassrooms.com/fr/courses/4668271-developpez-des-applications-web-avec-angular/5090131-ecoutez-lutilisateur-avec-les-forms-methode-reactive)

## Préparez le terrain

À la différence de la méthode template où Angular crée l'objet du formulaire, pour la méthode réactive,
vous devez le créer vous-même et le relier à votre template.  Même si cela a l'air plus complexe, cela
vous permet de gérer votre formulaire en détail, notamment avec la création programmatique de contrôles
(permettant, par exemple, à l'utilisateur d'ajouter des champs).

Pour illustrer la méthode réactive, vous allez créer une nouvelle section dans l'application des appareils
électriques : vous allez permettre aux utilisateurs de créer un profil utilisateur simple.  Cette démonstration
utilisera des compétences que vous avez apprises tout au long de ce cours, et vous allez également créer votre
premier modèle de données sous forme d'une classe TypeScript.

Commencez par le modèle __User__ ; créez un nouveau dossier __models__,  et dedans un fichier __User.model.ts__ :

````typescript
export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public drinkPreference: string,
    public hobbies?: string[]
  ) {}
}
````

Ce modèle pourra donc être utilisé dans le reste de l'application en l'important dans les components où
vous en avez besoin.  Cette syntaxe de constructeur permet l'utilisation du mot-clé __new__, et les arguments
passés seront attribués à des variables qui portent les noms choisis ici, par exemple  
``const user = new User('James', 'Smith', 'james@james.com', 'jus d\'orange', ['football', 'lecture'])``
créera un nouvel objet __User__ avec ces valeurs attribuées aux variables __user.firstName__, __user.lastName__ etc.

Ensuite, créez un __UserService__  simple qui stockera la liste des objets __User__ et qui comportera une méthode
permettant d'ajouter un utilisateur à la liste :

````typescript
import { User } from '../models/User.model';
import { Subject } from 'rxjs/Subject';

export class UserService {
  private users: User[];
  userSubject = new Subject<User[]>();

  emitUsers() {
    this.userSubject.next(this.users.slice());
  }

  addUser(user: User) {
    this.users.push(user);
    this.emitUsers();
  }
}
````

Ce service contient un array privé d'objets de type personnalisé __User__ et un Subject pour émettre cet array.
La méthode __emitUsers()__ déclenche ce Subject et la méthode __addUser()__ ajoute un objet __User__ à l'array,
puis déclenche le Subject.

__Remarque__ :
N'oubliez pas d'ajouter ce nouveau service à l'array __providers__ dans __AppModule__ !

L'étape suivante est de créer __UserListComponent__ — pour simplifier cet exemple, vous n'allez pas créer
un component pour les utilisateurs individuels :

````typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[];
  userSubscription: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.userSubject.subscribe(
      (users: User[]) => {
        this.users = users;
      }
    );
    this.userService.emitUsers();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
````

Ce component très simple souscrit au Subject dans __UserService__ et le déclenche pour en récupérer
les informations et les rendre disponibles au template (que vous allez maintenant créer) :

````html
<ul class="list-group">
  <li class="list-group-item" *ngFor="let user of users">
    <h3>{{ user.firstName }} {{ user.lastName }}</h3>
    <p>{{ user.email }}</p>
    <p>Cette persone préfère le {{ user.drinkPreference }}</p>
    <p *ngIf="user.hobbies && user.hobbies.length > 0">
      Cette personne a des hobbies !
      <span *ngFor="let hobby of user.hobbies">{{ hobby }} - </span>
    </p>
  </li>
</ul>
````

Ici, vous appliquez des directives __*ngFor__ et  _*ngIf__ pour afficher la liste des utilisateurs et
leurs hobbies, s'ils en ont.

Afin de pouvoir visualiser ce nouveau component, ajoutez une route __users__ dans __AppModule__, et créez
un __routerLink__.  Ajoutez également un objet __User__ codé en dur dans le service pour voir les résultats :

````typescript
const appRoutes: Routes = [
  { path: 'appareils', canActivate: [AuthGuard], component: AppareilViewComponent },
  { path: 'appareils/:id', canActivate: [AuthGuard], component: SingleAppareilComponent },
  { path: 'edit', canActivate: [AuthGuard], component: EditAppareilComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'users', component: UserListComponent },
  { path: '', component: AppareilViewComponent },
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: 'not-found' }
];
````

````html
<ul class="nav navbar-nav">
    <li routerLinkActive="active"><a routerLink="auth">Authentification</a></li>
    <li routerLinkActive="active"><a routerLink="appareils">Appareils</a></li>
    <li routerLinkActive="active"><a routerLink="edit">Nouvel appareil</a></li>
    <li routerLinkActive="active"><a routerLink="users">Utilisateurs</a></li>
</ul>
````

````typescript
private users: User[] = [
    new User('Will', 'Alexander', 'will@will.com', 'jus d\'orange', ['coder', 'boire du café'])
];
````

Notez que j'ai choisi de ne pas protéger la route avec __AuthGuard__ afin d'accélérer le processus.

Dernière étape : il faut ajouter __ReactiveFormsModule__, importé depuis ``@angular/forms``, à l'array
__imports__ de votre __AppModule__ :

````typescript
imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
],
````

Maintenant que tout est prêt, vous allez créer __NewUserComponent__ qui contiendra votre formulaire réactif.

## Construisez un formulaire avec FormBuilder

Dans la méthode template, l'objet formulaire mis à disposition par Angular était de type __NgForm__, mais ce
n'est pas le cas pour les formulaires réactifs.  Un formulaire réactif est de type __FormGroup__, et il
regroupe plusieurs __FormControl__ (tous les deux importés depuis __@angular/forms__).  Vous commencez
d'abord, donc, par créer l'objet dans votre nouveau component __NewUserComponent__ :

````typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  userForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
````

Ensuite, vous allez créer une méthode qui sera appelée dans le constructeur pour la population de
cet objet, et vous allez également injecter __FormBuilder__, importé depuis __@angular/forms__ :

````typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  userForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
  }

}
````

__FormBuilder__ est une classe qui vous met à disposition des méthodes facilitant la création d'objet
__FormGroup__.  Vous allez maintenant utiliser la méthode __group__ à l'intérieur de votre méthode __initForm()__
pour commencer à créer le formulaire :

````typescript
initForm() {
    this.userForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      email: '',
      drinkPreference: ''
    });
}
````

La méthode __group__ prend comme argument un objet où les clés correspondent aux noms des contrôles souhaités
et les valeurs correspondent aux valeurs par défaut de ces champs.  Puisque l'objectif est d'avoir des champs
vides au départ, chaque valeur ici correspond au string vide.

Les contrôles correspondants aux hobbies seront ajoutés par la suite avec une autre méthode.

Il faut maintenant créer le template du formulaire et lier ce template à l'objet __userForm__ que vous venez de créer :

````html
<div class="col-sm-8 col-sm-offset-2">
  <form [formGroup]="userForm" (ngSubmit)="onSubmitForm()">
    <div class="form-group">
      <label for="firstName">Prénom</label>
      <input type="text" id="firstName" class="form-control" formControlName="firstName">
    </div>
    <div class="form-group">
      <label for="lastName">Nom</label>
      <input type="text" id="lastName" class="form-control" formControlName="lastName">
    </div>
    <div class="form-group">
      <label for="email">Adresse e-mail</label>
      <input type="text" id="email" class="form-control" formControlName="email">
    </div>
    <div class="form-group">
      <label for="drinkPreference">Quelle boisson préférez-vous ?</label>
      <select id="drinkPreference" class="form-control" formControlName="drinkPreference">
        <option value="jus d\'orange">Jus d'orange</option>
        <option value="jus de mangue">Jus de mangue</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary">Soumettre</button>
  </form>
</div>
````

Analysez le template :

- Sur la balise ``<form>``, vous utilisez le property binding pour lier l'objet  userForm  à l'attribut __formGroup__
  du formulaire, créant la liaison pour Angular entre le template et le TypeScript.

- Également dans la balise ``<form>``, vous avez toujours une méthode __onSubmitForm()__ liée à __ngSubmit__, mais vous
  n'avez plus besoin de passer le formulaire comme argument puisque vous y avez déjà accès par l'objet __userForm__
  que vous avez créé.

- Sur chaque ``<input>`` qui correspond à un __control__ du formulaire, vous ajoutez l'attribut __formControlName__
  où vous passez un string correspondant au nom du __control__ dans l'objet TypeScript.

- Le bouton de type __submit__ déclenche l'événement __ngSubmit__, déclenchant ainsi la méthode __onSubmitForm()__,
  que vous allez créer dans votre TypeScript.

Pour tout mettre ensemble, injectez __UserService__ et __Router__ (sans oublier de les importer) dans le
constructeur du component, et créez la méthode __onSubmitForm()__ :

````typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/User.model';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  userForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      email: '',
      drinkPreference: ''
    });
  }

  onSubmitForm() {
    const formValue = this.userForm.value;
    const newUser = new User(
      formValue['firstName'],
      formValue['lastName'],
      formValue['email'],
      formValue['drinkPreference']
    );
    this.userService.addUser(newUser);
    this.router.navigate(['/users']);
  }
}
````

La méthode __onSubmitForm()__ récupère la __value__ du formulaire, et crée un nouvel objet __User__
(à importer en haut) à partir de la valeur des __controls__ du formulaire.  Ensuite, elle ajoute
le nouvel utilisateur au service et navigue vers __/users__ pour en montrer le résultat.

Il ne reste plus qu'à ajouter un lien dans __UserListComponent__ qui permet d'accéder à __NewUserComponent__
et de créer la route correspondante __new-user__ dans __AppModule__ :

````html
<ul class="list-group">
  <li class="list-group-item" *ngFor="let user of users">
    <h3>{{ user.firstName }} {{ user.lastName }}</h3>
    <p>{{ user.email }}</p>
    <p>Cette persone préfère le {{ user.drinkPreference }}</p>
    <p *ngIf="user.hobbies && user.hobbies.length > 0">
      Cette personne a des hobbies !
      <span *ngFor="let hobby of user.hobbies">{{ hobby }} - </span>
    </p>
  </li>
  <a routerLink="/new-user">Nouvel utilisateur</a>
</ul>
````

Puisque ce __routerLink__ se trouve à l'intérieur du __router-outlet__, il faut ajouter un __/__ au début
de l'URL pour naviguer vers  ``localhost:4200/new-user``.  Si vous ne mettez pas le __/__, ce lien naviguera
vers ``localhost:4200/users/new-user``

````typescript
{ path: 'users', component: UserListComponent },
{ path: 'new-user', component: NewUserComponent },
````

## Validators

Comme pour la méthode template, il existe un outil pour la validation de données dans la méthode réactive :
les __Validators__.  Pour ajouter la validation, vous allez modifier légèrement votre exécution de __FormBuilder.group__ :

````typescript
initForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      drinkPreference: ['', Validators.required]
    });
}
````

Plutôt qu'un string simple, vous passez un array à chaque __control__, avec comme premier élément la valeur
par défaut souhaitée, et comme deuxième élément le ou les __Validators__ (dans un array s'il y en a plusieurs)
souhaités.  Il faut également importer __Validators__ depuis __@angular/forms__.  Dans ce cas de figure, tous
les champs sont requis et la valeur du champ __email__ doit être sous un format valable d'adresse mail
(la validité de l'adresse elle-même n'est forcément pas évaluée).

Même si les __Validators__ sont des fonctions, il ne faut pas ajouter les parenthèses __()__ en les déclarant ici.
Les déclarations de __Validators__ dans __FormBuilder__ informent Angular de la validation souhaitée : Angular
s'occupe ensuite d'exécuter ces fonctions au bon moment.

En liant la validité de __userForm__ à la propriété __disabled__ du bouton __submit__, vous intégrez la validation de données :

````html
<button type="submit" class="btn btn-primary" [disabled]="userForm.invalid">Soumettre</button>
````

Dans ce chapitre, vous avez vu les Validators __required__ et __email__ : il en existe d'autres, et vous avez également
la possibilité de créer des Validators personnalisés. Pour plus d'informations, référez-vous à la section
correspondante de la [documentation Angular validators](https://angular.io/api/forms/Validators).
[form validation](https://angular.io/guide/form-validation)

## Ajoutez dynamiquement des FormControl

Pour l'instant, vous n'avez pas encore laissé la possibilité à l'utilisateur d'ajouter ses hobbies.  Il serait
intéressant de lui laisser la possibilité d'en ajouter autant qu'il veut, et pour cela, vous allez utiliser un
__FormArray__.  Un __FormArray__ est un array de plusieurs __FormControl__, et permet, par exemple, d'ajouter des nouveaux
__controls__ à un formulaire.  Vous allez utiliser cette méthode pour permettre à l'utilisateur d'ajouter ses hobbies.

Modifiez d'abord __initForm()__ pour ajouter un __FormArray__ vide qui s'appellera hobbies avec la méthode __array__ :

````typescript
initForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      drinkPreference: ['', Validators.required],
      hobbies: this.formBuilder.array([])
    });
}
````

Modifiez ensuite __onSubmitForm()__ pour récupérer les valeurs, si elles existent (sinon, retournez un array vide) :

````typescript
onSubmitForm() {
    const formValue = this.userForm.value;
    const newUser = new User(
      formValue['firstName'],
      formValue['lastName'],
      formValue['email'],
      formValue['drinkPreference'],
      formValue['hobbies'] ? formValue['hobbies'] : []
    );
    this.userService.addUser(newUser);
    this.router.navigate(['/users']);
}
````

Afin d'avoir accès aux __controls__ à l'intérieur de l'array, pour des raisons de typage strict liées à TypeScript,
il faut créer une méthode qui retourne __hobbies__ par la méthode __get()__ sous forme de __FormArray__ (__FormArray__
s'importe depuis __@angular/forms__)  :

````typescript
getHobbies(): FormArray {
    return this.userForm.get('hobbies') as FormArray;
}
````

Ensuite, vous allez créer la méthode qui permet d'ajouter un __FormControl__ à __hobbies__, permettant ainsi
à l'utilisateur d'en ajouter autant qu'il veut.  Vous allez également rendre le nouveau champ requis, afin de
ne pas avoir un array de __hobbies__ avec des string vides :

````typescript
onAddHobby() {
    const newHobbyControl = this.formBuilder.control(null, Validators.required);
    this.getHobbies().push(newHobbyControl);
}
````

Cette méthode crée un __control__ avec la méthode __FormBuilder.control()__, et l'ajoute au __FormArray__ rendu
disponible par la méthode __getHobbies()__.

Enfin, il faut ajouter une section au template qui permet d'ajouter des hobbies en ajoutant des __<input>__ :

````html
<div formArrayName="hobbies">
      <h3>Vos hobbies</h3>
      <div class="form-group" *ngFor="let hobbyControl of getHobbies().controls; let i = index">
        <input type="text" class="form-control" [formControlName]="i">
      </div>
      <button type="button" class="btn btn-success" (click)="onAddHobby()">Ajouter un hobby</button>
</div>
<button type="submit" class="btn btn-primary" [disabled]="userForm.invalid">Soumettre</button>
````

Analysez cette __<div>__ :

- à la __<div>__ qui englobe toute la partie __hobbies__, vous ajoutez l'attribut __formArrayName__, qui correspond
  au nom choisi dans votre TypeScript ;

- la __<div>__ de class __form-group__ est ensuite répété pour chaque  FormControl  dans le  FormArray
  (retourné par __getHobbies()__, initialement vide, en notant l'index afin de créer un nom unique
  pour chaque __FormControl__;

- dans cette __<div>__, vous avec une __<input>__ qui prendra comme __formControlName__ l'index du __FormControl__ ;

- enfin, vous avez le bouton (de type  button  pour l'empêcher d'essayer de soumettre le formulaire) qui déclenche
  __onAddHobby()__, méthode qui, pour rappel, crée un nouveau __FormControl__ (affichant une nouvelle instance de
  la __<div>__ de class __form-group__, et donc créant une nouvelle __<input>__)

Félicitations !  Maintenant, vous savez créer des formulaires par deux méthodes différentes, et comment récupérer
les données saisies par l'utilisateur.  Pour l'instant, la capacité d'enregistrement et de gestion de ces données
a été limitée au service et donc tout est systématiquement remis à zéro à chaque rechargement de l'app.  Dans
les chapitres suivants, vous allez apprendre à interagir avec un serveur (et puis, plus précisément, avec
un backend Firebase) afin de rendre les données permanentes et que votre application soit totalement dynamique.