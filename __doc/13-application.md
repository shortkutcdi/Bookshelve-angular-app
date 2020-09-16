# app

## structure de l'application

- quels composants

authentification :
component permettant de créer un nouvel utilisateur
component connecter un utilisateur existant

- quels services

service qui gère les interactions avec le serveur pour l'authentification

- quels modèles de données

les livres pourront être consultés sous forme de liste et individuellement
il faudra pouvoir :

- ajouter
- modifier
- supprimer

==>

un component pour la view liste
un component pour la view individuelle
Un component comportant un formulaire pour l'ajout et la modification des livres

un service de gestion des components
un component séparé pour la barre de navigation
Ajouter le routing => protéger certaineses routes par l'authentification (canActivate)

modèle de données :

un livre aura :

- un titre
- un nom d'auteur
- avec un photo facultative ( public photo ?: string)

## générer l'application

    ng new oc13-bookshelves --styles=scss --skip-tests=true

    --styles=scss : les styles seront en scss
    --skip-tests=true : les fichier de test ne sont pas générés

### 1 Créer les components :

    ng g c auth/signup  // crée un composant signup dans auth/ -- inscription nouvel utilisateur
    ng g c auth/signin  // crée un composant signin dans auth/ -- connexion d'un utilisateur existant
    ng g c book-list                // list view des livres
    ng g c book-list/single-book    // view d'un livre (dans le dossier book-list/)
    ng g c book-list/book-form      // formulaire création/modification d'un livre (dans book-list/)
    ng g c header                   // component pour le header

### 2 Créer les services :

    ng g s services/auth            // service pour l'authentification
    ng g s services/books           // service pour les livres
    ng g s services/auth-guard      // guard pour l'authentification

### 3 Installer bootstraps :

    npm install bootstrap@3.3.7 --save

ajouter les styles boostrap :

angular.json :

            "styles": [
              "../../node_modules/bootstrap/dist/css/bootstrap.css",  //<<<<<<<<<<<<< lien symbolique
              "src/styles.css"
            ],

### 4 enregistrer les services (imports) - app.modules.ts

Enregistrer les services dans app.modules.ts section providers
Ajouter les modules nécessaires FormsModule, ReactiveFormsModule, HttpClientModule avec leur imports respectifs

````typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { BookListComponent } from './book-list/book-list.component';
import { SingleBookComponent } from './book-list/single-book/single-book.component';
import { BookFormComponent } from './book-list/book-form/book-form.component';
import { HeaderComponent } from './header/header.component';

import { BooksService } from './services/books.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    BookListComponent,
    SingleBookComponent,
    BookFormComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    AuthGuardService,
    AuthService,
    BooksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

#### 5 enregistrer les routes - app.module.ts

````typescript
const appRoutes: Routes = [
  {path: 'auth/signup',     component: SignupComponent},
  {path: 'auth/signin',     component: SigninComponent},
  {path: 'books',           component: BookListComponent},
  {path: 'booklist/new',    component: BookFormComponent},
  {path: 'books/view/:id',  component: SingleBookComponent},

];
````

Intégrer les routes __appRoutes__ avec RouterModule.forRoot()

````typescript
  imports: [
    //...,
    RouterModule.forRoot(appRoutes)
  ],
````

imports :

````typescript
import { Routes, RouterModule } from '@angular/router';
````

## model - livre

models/Books.model.ts

````typescript
export class Book {

    photo: string;  // attribut optionnel

    constructor(public title: string, public author: string) { }
}
````

## header - naviguer dans l'application

header/header.component.ts

````html
<nav class="navbar nabar-default">
  <div class="container-fluid">
    <ul class="nav navbar-nav">
      <li><a routerLink="/books"            routerLinkActive="active" >Livres</a></li> <!-- remplacement de href par routerLink -->
    </ul>
    <ul class="nav navbar-nav navbar-right">
      <li><a routerLink="/auth/signup"      routerLinkActive="active">Créer un compte</a></li>
      <li><a routerLink="/auth/signin"      routerLinkActive="active">Connexion</a></li>  <!-- routerLinkActive -- ajoute la classe "active" qd route active -->
    </ul>
  </div>
</nav>
````

Ajout header dans app.component.html

````html
<app-header></app-header>

<div class="container">
  <router-outlet></router-outlet> <!-- recevoir les routes de l'application -->
</div>
````

## installer les outils de firebase

  npm intall firebase --save  -- install les services de firebase

## créer nouveau projet firebase - oc-angular-bookshelves

  oc-angular-bookshelves

Console firebase

Cliquer sur : ajouter Firebase à votre application web

Copier le script :

````javascript
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAh3laMzAG3zW-uXRRykDyeMM_k2KBhCyg",
    authDomain: "oc-angular-bookshelves.firebaseapp.com",
    databaseURL: "https://oc-angular-bookshelves.firebaseio.com",
    projectId: "oc-angular-bookshelves",
    storageBucket: "oc-angular-bookshelves.appspot.com",
    messagingSenderId: "590458053516"
  };
  firebase.initializeApp(config);
````

## lier notre application angular à l'application firebase

Coller le script dans le constructeur de app.component.ts (component de base de notre app angular)
==> permet de lier notre application angular à l'appli firebase

````typescript
import { Component } from '@angular/core';
import * as firebase from 'firebase';       // ajouter l'import <<<<<<<<<<<<<<<

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyAh3laMzAG3zW-uXRRykDyeMM_k2KBhCyg",
      authDomain: "oc-angular-bookshelves.firebaseapp.com",
      databaseURL: "https://oc-angular-bookshelves.firebaseio.com",
      projectId: "oc-angular-bookshelves",
      storageBucket: "oc-angular-bookshelves.appspot.com",
      messagingSenderId: "590458053516"
    };
    firebase.initializeApp(config);
  }

}
````

## firebase authentification

Project overview/develop/

  section authentication / configurer un mode de connexion :

choisir : par adresse email et mot de passe / activer et enregistrer

## AuthService utilisant la méthode de firebase

Importer firebase

````typescript
import * as firebase from 'firebase';
````

créer 3 méthodes :

- créer un nouvel utilisateur       (Promise avec firebase.auth().createUserWithEmailAndPassword(email, password))
- connecter un utilisateur existant (Promise avec firebase.auth().signInWithEmailAndPassword(email, password))
- déconnexion de l'utilisateur      (avec firebase.auth().signOut())

````typescript
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { resolve } from 'q';
import { ResolveEnd } from '@angular/router';

@Injectable()
export class AuthService {

  constructor() { }

  // création méthode asynchrone
  createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  // création méthode asynchrone - connexion
  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
  // deconnexion
  signOutUser() {
    firebase.auth().signOut();
  }

}
````

## signup - créer un compte

````typescript
export class SignupComponent implements OnInit { // enregistrer un utilisateur

  signUpForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.signUpForm = this.formBuilder.group(
      {
        email:    ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern('/[0-9-a-z-A-Z](6,)/')]]
      }
    );

  }

  onSubmit() {
    const formValue = this.signUpForm.value;
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;

    this.authService.createNewUser(email, password).then(
      () => {
        this.router.navigate(['/books']),
      },
      (error) => {
        this.errorMessage = 'Erreur de création utilisateur ' + error;
      }
    );
  }

}
````

````html
<div class="col-sm-8 col-sm-offset-2">
    <h2>Créer un compte</h2>

    <form [formGroup]="signUpForm" (ngSubmit)="onSubmit()">
  
      <div class="form-group">
        <label for="email">Email</label>
        <input type="text" class="form-control" id="email"
                formControlName="email" required>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" class="form-control" id="password"
                formControlName="password" required>
      </div>
  
      <button type="submit" class="btn btn-primary" [disabled]="signUpForm.invalid" >Créer un compte</button>
    </form>
    <p class="text-danger">{{ errorMessage }}</p>
  </div>
````

Créer un compte :

renseigner email et password

  email: test@test.net
  password: testtest

## connexion - déconnexion SignInComponent

````typescript
export class SigninComponent implements OnInit { // connexion

  signInForm: FormGroup;
  errorMessage: string;
  authStatus: boolean;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.authStatus = this.authService.isAuth;
  }

  initForm() {
    this.signInForm = this.formBuilder.group({
      email:    ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    });
  }

  onSubmitForm() {
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;
    this.authService.signInUser(email, password).then(
       () => {
          this.authStatus = this.authService.isAuth;
          this.router.navigate(['/books']);
           return true;
         },
        (error) => {
          this.errorMessage = error;
          return false;
        }
     );
  }

  onSignOut() {
    this.authService.signOutUser();
    this.authStatus = this.authService.isAuth;
  }

}
````

````html
<div class="col-sm-8 col-sm-offset-2">
  <div *ngIf="!authStatus">
    <h2>Connexion</h2>
    <form [formGroup]="signInForm" (ngSubmit)="onSubmitForm()">
  
      <div class="form-group">
        <label for="email">Email</label>
        <input type="text" class="form-control" id="email"
                formControlName="email" required>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" class="form-control" id="password"
                formControlName="password" required>
      </div>
  
      <button type="submit" class="btn btn-default" [disabled]="signInForm.invalid" >Connecter</button>
  
    </form>
    <p class="text-danger">{{errorMessage}}</p>
  </div>
</div>
````

## header component - liens

utilisation d'une variable d'authentification
  
    isAuth: boolean;

Utilisation de la méthode onAuthStateChanged() de l'api de firebase

    firebase.auth().onAuthStateChanged()

````typescript
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) { // si user detecté - un objet user est créé
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );
  }

  signOut() {
    this.authService.signOutUser();
    this.isAuth = false;
    this.router.navigate(['/auth', 'signin'])
  }

}
````

````html
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <ul class="nav navbar-nav">
      <li><a routerLink="/books"            routerLinkActive="active" >Livres</a></li> <!-- remplacement de href par routerLink -->
    </ul>

    <ul class="nav navbar-nav navbar-right">
      <li *ngIf="!isAuth"><a routerLink="/auth/signup"      routerLinkActive="active">Créer un compte</a></li>
      <li *ngIf="!isAuth"><a routerLink="/auth/signin"
        routerLinkActive="active">Connexion</a></li>  <!-- routerLinkActive -- ajoute la classe "active" qd route active -->

      <li *ngIf="isAuth"><a (click)="signOut()" style="cursor:pointer;">Déconnexion</a></li>
      {{isAuth}}
    </ul>
  </div>
</nav>
````

## AuthGuard service

utilisation de l'api firebase - méthode onAuthStateChanged

implements CanActivate => implémenter méthode canActivate qui retourne une Promise

````typescript
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
          firebase.auth().onAuthStateChanged(
            (user) => {
              if (user) {
                resolve(true);
              } else {
                this.router.navigate(['/auth', 'signin']);
                resolve(false); // pas le droit d'accès à cette route
              }
            }
          );
        }
    );
  }

}
````

## ajouter AuthGuardService - protection des routes books

Protection des routes books avec ajout de :

    canActivate: [AuthGuardService]

app.modules.ts

````typescript
const appRoutes: Routes = [
  {path: 'auth/signup',     component: SignupComponent},
  {path: 'auth/signin',     component: SigninComponent},
  {path: 'books',           component: BookListComponent,   canActivate: [AuthGuardService]},
  {path: 'booklist/new',    component: BookFormComponent,   canActivate: [AuthGuardService]},
  {path: 'books/view/:id',  component: SingleBookComponent, canActivate: [AuthGuardService]},
  {path: '',                redirectTo: '/books',   pathMatch: 'full' },
  { path: '**', redirectTo: '/books'}
];

@NgModule({
  declarations: [
    //...
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuardService,
    AuthService,
    BooksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

## intégrer la base de données

fonctionalités de l'application :
création, visualisation et la suppression des livres liés à la bdd de firebase

### peupler BooksService

[retreive data](https://firebase.google.com/docs/database/admin/retrieve-data)