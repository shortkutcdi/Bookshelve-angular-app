import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {
    // Initialize Firebase
    const config = {
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
