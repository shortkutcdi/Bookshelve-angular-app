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
    this.router.navigate(['/auth', 'signin'])
  }

}
