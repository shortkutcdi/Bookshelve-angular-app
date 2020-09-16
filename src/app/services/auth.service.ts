import { Injectable } from '@angular/core';
import * as firebase from 'firebase';


@Injectable()
export class AuthService {

  constructor() { }

  // création méthode asynchrone - wrapper Promise de la fonction firebase.auth().createUserWithEmailAndPassword(email, password)
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

  // création méthode asynchrone - wrapper Promise de la fonction firebase.auth().signInWithEmailAndPassword(email, password)
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

  signOutUser() {
    firebase.auth().signOut();
  }

}
