import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';


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

const appRoutes: Routes = [
  {path: 'auth/signup',     component: SignupComponent},
  {path: 'auth/signin',     component: SigninComponent},
  {path: 'books',           component: BookListComponent,   canActivate: [AuthGuardService]},
  {path: 'books/new',    component: BookFormComponent,   canActivate: [AuthGuardService]},
  {path: 'books/view/:id',  component: SingleBookComponent, canActivate: [AuthGuardService]},
  {path: '',                redirectTo: 'books',   pathMatch: 'full' },
  { path: '**', redirectTo: 'books' }
];

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
