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
