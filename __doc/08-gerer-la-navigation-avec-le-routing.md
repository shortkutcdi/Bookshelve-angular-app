# gérer la navigation avec le routing

[Routing & navigartion](https://angular.io/guide/router)

L'un des énormes avantages d'utiliser Angular est de pouvoir créer des "single page application" (SPA).
Sur le Web, ces applications sont rapides et lisses : il n'y a qu'un seul chargement de page au début,
et même si les données mettent parfois du temps à arriver, la sensation pour l'utilisateur est celle
d'une application native.  Au lieu de charger une nouvelle page à chaque clic ou à chaque changement d'URL,
on remplace le contenu ou une partie du contenu de la page : on modifie les components qui y sont affichés,
ou le contenu de ces components.  On accomplit tout cela avec le "routing", où l'application lit le contenu
de l'URL pour afficher le ou les components requis.

L'application des appareils électriques n'a que la view des appareils à afficher pour le moment ; je vous propose
de créer un component pour l'authentification (qui restera simulée pour l'instant) et vous créerez un menu
permettant de naviguer entre les views.

Tout d'abord, créez le component avec le CLI :

    ng g c auth

Vous allez également devoir modifier un peu l'organisation actuelle afin d'intégrer plus facilement le routing :
vous allez créer un component qui contiendra toute la view actuelle et qui s'appellera **AppareilViewComponent** :

    ng g c appareil-view

Ensuite, coupez tout le contenu de la colonne dans **app.component.html**, enregistrez-le dans
**appareil-view.component.html**, et remplacez-le par la nouvelle balise  ``<app-appareil-view>`` :

````html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <app-appareil-view></app-appareil-view>
    </div>
  </div>
</div>
````

Il faudra également déménager la logique de cette view pour que tout re-marche : injectez **AppareilService**,
créez l'array **appareils**, intégrez la logique **ngOnInit** et déplacez les fonctions **onAllumer()** et **onEteindre()** :

````typescript
import { Component, OnInit } from '@angular/core';
import { AppareilService } from '../services/appareil.service';

@Component({
  selector: 'app-appareil-view',
  templateUrl: './appareil-view.component.html',
  styleUrls: ['./appareil-view.component.scss']
})
export class AppareilViewComponent implements OnInit {

  appareils: any[];

  lastUpdate = new Promise((resolve, reject) => {
    const date = new Date();
    setTimeout(
      () => {
        resolve(date);
      }, 2000
    );
  });

  constructor(private appareilService: AppareilService) { }

  ngOnInit() {
    this.appareils = this.appareilService.appareils;
  }

  onAllumer() {
    this.appareilService.switchOnAll();
  }

  onEteindre() {
    if(confirm('Etes-vous sûr de vouloir éteindre tous vos appareils ?')) {
      this.appareilService.switchOffAll();
    } else {
      return null;
    }
  }

}
````

Vous pouvez faire le ménage dans **AppComponent**, en retirant tout ce qui n'y sert plus.  
Créez également une boolean **isAuth** dans **AppareilViewComponent**, et déclarez-la comme
**false**, car vous allez intégrer un service d'authentification pour la suite.

Ajoutez la barre de navigation suivante à  AppComponent  :  

````html
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-collapse">
      <ul class="nav navbar-nav">
        <li><a href="#">Authentification</a></li>
        <li class="active"><a href="#">Appareils</a></li>
      </ul>
    </div>
  </div>
</nav>
````

Maintenant, tout est prêt pour créer le routing de l'application.

## Créer les routes

Il s'agit des instructions d'affichage à suivre pour chaque URL, c'est-à-dire quel(s) component(s)
il faut afficher à quel(s) endroit(s) pour un URL donné.

Puisque le routing d'une application est fondamentale pour son fonctionnement, on déclare les routes
dans **app.module.ts**.

    Il est possible d'avoir un fichier séparé pour le routing, mais en termes de fonctionnalité,
    cela ne change rien : c'est juste une question d'organisation du code.

On crée une constante de type **Routes** (qu'on importe depuis  ``@angular/router`` ) qui est un array
d'objets JS qui prennent une certaine forme :

````typescript
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MonPremierComponent } from './mon-premier/mon-premier.component';
import { AppareilComponent } from './appareil/appareil.component';
import { FormsModule } from '@angular/forms';
import { AppareilService } from './services/appareil.service';
import { AuthComponent } from './auth/auth.component';
import { AppareilViewComponent } from './appareil-view/appareil-view.component';
import { Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'appareils', component: AppareilViewComponent },
  { path: 'auth', component: AuthComponent },
  { path: '', component: AppareilViewComponent }
];
````

Le path correspond au string qui viendra après le ``/``  dans l'URL : sur votre serveur local,
le premier path ici correspond donc à ``localhost:4200/appareils``.

    Ne pas ajouter de slash au début de la propriété  path .

Ensuite, le  component  correspond au component que l'on veut afficher lorsque l'utilisateur navigue
au **path**  choisi.

J'ai ajouté un **path** vide, qui correspond tout simplement à ``localhost:4200`` (ou à la racine de
l'application seule), car si on ne traite pas le **path** vide, chaque refresh de l'application la
fera planter.  Je vous montrerai d'autres façons de gérer cela dans les chapitres suivants.

Les routes sont maintenant créées, mais il faut les enregistrer dans votre application.  Pour cela,
vous allez importer **RouterModule** depuis ``@angular/router`` et vous allez l'ajouter à l'array
**imports** de votre **AppModule**, tout en lui appelant la méthode **forRoot()** en lui passant
l'array de routes que vous venez de créer :

````typescript
imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
],
````

Maintenant que les routes sont enregistrées, il ne reste plus qu'à dire à Angular où vous souhaitez afficher
les components dans le template lorsque l'utilisateur navigue vers la route en question.
On utilise la balise ``<router-outlet>`` :

````html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
````

Lorsque vous changez de route (pour l'instant, en modifiant l'URL directement dans la barre d'adresse du navigateur),
la page n'est pas rechargée, mais le contenu sous la barre de navigation change.  Dans le chapitre suivant, vous allez
intégrer les liens de la barre de navigation afin que l'utilisateur puisse naviguer facilement.

## Naviguez avec les routerLink

Afin que l'utilisateur puisse naviguer à l'intérieur de votre application, il est nécessaire de créer des liens ou
des boutons qui naviguent vers les routes que vous avez créées.  Dans le chapitre précédent, vous avez créé
des liens typiques dans la barre de navigation, mais qui ne font rien pour l'instant.

Vous pourriez vous dire qu'il suffirait de marquer le **path** de vos routes directement dans l'attribut **href**, et
techniquement, cela permet d'atteindre les routes que vous avez créées.

    Alors pourquoi on ne fait pas comme ça ?

Tout simplement parce que, si vous regardez bien, en employant cette technique, la page est rechargée à chaque clic !
On perd totalement l'intérêt d'une Single Page App !

Du coup, on retire l'attribut **href** et on le remplace par l'attribut **routerLink** :

````html
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-collapse">
      <ul class="nav navbar-nav">
        <li><a routerLink="auth">Authentification</a></li>
        <li class="active"><a routerLink="appareils">Appareils</a></li>
      </ul>
    </div>
  </div>
</nav>
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
````

Ainsi, les routes sont chargées instantanément : on conserve l'ergonomie d'une SPA.

Pour finaliser cette étape, il serait intéressant que la classe **active** ne s'applique
qu'au lien du component réellement actif.  Heureusement, Angular fournit un attribut
pour cela qui peut être ajouté au lien directement ou à son élément parent :

````html
<ul class="nav navbar-nav">
    <li routerLinkActive="active"><a routerLink="auth">Authentification</a></li>
    <li routerLinkActive="active"><a routerLink="appareils">Appareils</a></li>
</ul>
````

Maintenant, les liens s'activent visuellement.

## Naviguez avec le Route

Il peut y avoir des cas où vous aurez besoin d'exécuter du code avant une navigation.  Par exemple,
on peut avoir besoin d'authentifier un utilisateur et, si l'authentification fonctionne, de naviguer
vers la page que l'utilisateur souhaite voir.  Je vous propose d'intégrer cette fonctionnalité à
l'application des appareils électriques (l'authentification elle-même restera simulée pour l'instant).

Tout d'abord, créez un nouveau fichier **auth.service.ts**  dans le dossier services pour gérer
l'authentification (n'oubliez pas de l'ajouter également dans l'array  providers  dans **AppModule**) :

````typescript
export class AuthService {

  isAuth = false;

  signIn() {
    return new Promise(
      (resolve, reject) => {
        setTimeout(
          () => {
            this.isAuth = true;
            resolve(true);
          }, 2000
        );
      }
    );
  }

  signOut() {
    this.isAuth = false;
  }
}
````

La variable **isAuth** donne l'état d'authentification de l'utilisateur.  La méthode **signOut()** "déconnecte"
l'utilisateur, et la méthode **signIn()** authentifie automatiquement l'utilisateur au bout de 2 secondes,
simulant le délai de communication avec un serveur.

Dans le component **AuthComponent**, vous allez simplement créer deux boutons et les méthodes correspondantes
pour se connecter et se déconnecter (qui s'afficheront de manière contextuelle : le bouton "se connecter"
ne s'affichera que si l'utilisateur est déconnecté et vice versa) :

````typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  authStatus: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatus = this.authService.isAuth;
  }

  onSignIn() {
    this.authService.signIn().then(
      () => {
        console.log('Sign in successful!');
        this.authStatus = this.authService.isAuth;
      }
    );
  }

  onSignOut() {
    this.authService.signOut();
    this.authStatus = this.authService.isAuth;
  }

}
````

Puisque la méthode **signIn()** du service retourne une Promise, on peut employer une fonction callback
asynchrone avec **.then()** pour exécuter du code une fois la Promise résolue.  Ajoutez simplement les boutons,
et tout sera prêt pour intégrer la navigation :

````html
<h2>Authentification</h2>
<button class="btn btn-success" *ngIf="!authStatus" (click)="onSignIn()">Se connecter</button>
<button class="btn btn-danger" *ngIf="authStatus" (click)="onSignOut()">Se déconnecter</button>
````

Le comportement recherché serait qu'une fois l'utilisateur authentifié, l'application navigue automatiquement
vers la view des appareils.  Pour cela, il faut injecter le  Router  (importé depuis  @angular/router ) pour
accéder à la méthode  navigate()  :

````typescript
constructor(private authService: AuthService, private router: Router) { }
onSignIn() {
    this.authService.signIn().then(
      () => {
        console.log('Sign in successful!');
        this.authStatus = this.authService.isAuth;
        this.router.navigate(['appareils']);
      }
    );
}
````

La fonction navigate prend comme argument un array d'éléments (ce qui permet de créer des chemins à partir
de variables, par exemple) qui, dans ce cas, n'a qu'un seul membre : le  path  souhaité.

Le chemin **appareils** est toujours accessible actuellement, même sans authentification : dans un chapitre
ultérieur, vous apprendrez à le sécuriser totalement.  Avant cela, vous allez apprendre à ajouter des
paramètres à vos routes.

## Paramètres de routes

Imaginez qu'on souhaite pouvoir cliquer sur un appareil dans la liste d'appareils afin d'afficher une page avec
plus d'informations sur cet appareil : on peut imaginer un système de routing de type ``appareils/nom-de-l'appareil`` ,
par exemple.  Si on n'avait que deux ou trois appareils, on pourrait être tenté de créer une route par appareil,
mais imaginez un cas de figure où l'on aurait 30 appareils, ou 300.  Imaginez qu'on laisse l'utilisateur créer
de nouveaux appareils ; l'approche de créer une route par appareil n'est pas adaptée.  Dans ce genre de cas,
on choisira plutôt de créer une route avec paramètre.

Tout d'abord, vous allez créer la route dans  AppModule  :

````typescript
const appRoutes: Routes = [
  { path: 'appareils', component: AppareilViewComponent },
  { path: 'appareils/:id', component: SingleAppareilComponent },
  { path: 'auth', component: AuthComponent },
  { path: '', component: AppareilViewComponent }
];
````

L'utilisation des deux-points  ``:``  avant un fragment de route déclare ce fragment comme étant un paramètre :
tous les chemins de type ``appareils/*`` seront renvoyés vers **SingleAppareilComponent**,  que vous allez
maintenant créer :

````typescript
import { Component, OnInit } from '@angular/core';
import { AppareilService } from '../services/appareil.service';

@Component({
  selector: 'app-single-appareil',
  templateUrl: './single-appareil.component.html',
  styleUrls: ['./single-appareil.component.scss']
})
export class SingleAppareilComponent implements OnInit {

  name: string = 'Appareil';
  status: string = 'Statut';

  constructor(private appareilService: AppareilService) { }

  ngOnInit() {
  }

}
````

````html
<h2>{{ name }}</h2>
<p>Statut : {{ status }}</p>
<a routerLink="/appareils">Retour à la liste</a>
````

Pour l'instant, si vous naviguez vers  ``/appareils/nom``, peu importe le nom que vous choisissez,
vous avez accès à  SingleAppareilComponent .  Maintenant, vous allez y injecter **ActivatedRoute**,
importé depuis  ``@angular/router`` , afin de récupérer le fragment **id** de l'URL :

````typescript
constructor(private appareilService: AppareilService,
            private route: ActivatedRoute) { }
````

Puis, dans **ngOnInit()**, vous allez utiliser l'objet **snapshot** qui contient les paramètres de l'URL
et, pour l'instant, attribuer le paramètre **id** à la variable **name** :

````typescript
ngOnInit() {
    this.name = this.route.snapshot.params['id'];
}
````

Ainsi, le fragment que vous tapez dans la barre d'adresse après ``appareils/`` s'affichera dans le template,
mais ce n'est pas le comportement recherché.  Pour atteindre l'objectif souhaité, commencez par ajouter,
dans **AppareilService**, un identifiant unique pour chaque appareil et une méthode qui rendra l'appareil
correspondant à un identifiant :

````typescript
appareils = [
    {
      id: 1,
      name: 'Machine à laver',
      status: 'éteint'
    },
    {
      id: 2,
      name: 'Frigo',
      status: 'allumé'
    },
    {
      id: 3,
      name: 'Ordinateur',
      status: 'éteint'
    }
];
getAppareilById(id: number) {
    const appareil = this.appareils.find(
      (s) => {
        return s.id === id;
      }
    );
    return appareil;
}
````

Maintenant, dans **SingleAppareilComponent**, vous allez récupérer l'identifiant de l'URL et l'utiliser
pour récupérer l'appareil correspondant :

````typescript
ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.name = this.appareilService.getAppareilById(+id).name;
    this.status = this.appareilService.getAppareilById(+id).status;
}
````

Puisqu'un fragment d'URL est forcément de type **string**, et que la méthode **getAppareilById()** prend un
nombre comme argument, il ne faut pas oublier d'utiliser ``+`` avant **id** dans l'appel pour caster la
variable comme nombre.

Vous pouvez naviguer manuellement vers ``/appareils/2``, par exemple, mais cela recharge encore la page, et
vous perdez l'état des appareils (si vous en allumez ou éteignez par exemple).  Pour finaliser cette fonctionnalité,
intégrez l'identifiant unique dans **AppareilComponent** et dans **AppareilViewComponent**, puis créez un **routerLink**
pour chaque appareil qui permet d'en regarder le détail :

````typescript
@Input() appareilName: string;
@Input() appareilStatus: string;
@Input() index: number;
@Input() id: number;
````

````html
<ul class="list-group">
  <app-appareil  *ngFor="let appareil of appareils; let i = index"
                 [appareilName]="appareil.name"
                 [appareilStatus]="appareil.status"
                 [index]="i" 
                 [id]="appareil.id"></app-appareil>
</ul>
<h4 [ngStyle]="{color: getColor()}">Appareil : {{ appareilName }} -- Statut : {{ getStatus() }}</h4>
<a [routerLink]="[id]">Détail</a>
````

Ici, vous utilisez le format array pour **routerLink** en property binding afin d'accéder à la variable **id**.

Ça y est !  Vous pouvez maintenant accéder à la page Détail pour chaque appareil, et les informations de statut
qui s'y trouvent sont automatiquement à jour grâce à l'utilisation du service.

## Redirection

Il peut y avoir des cas de figure où l'on souhaiterait rediriger un utilisateur, par exemple pour afficher une
page 404 lorsqu'il entre une URL qui n'existe pas.

Pour l'application des appareils électriques, commencez par créer un component 404 très simple, appelé 
**four-oh-four.component.t** :

````html
<h2>Erreur 404</h2>
<p>La page que vous cherchez n'existe pas !</p>
````

Ensuite, vous allez ajouter la route "directe" vers cette page, ainsi qu'une route "wildcard", qui redirigera
toute route inconnue vers la page d'erreur :

````typescript
const appRoutes: Routes = [
  { path: 'appareils', component: AppareilViewComponent },
  { path: 'appareils/:id', component: SingleAppareilComponent },
  { path: 'auth', component: AuthComponent },
  { path: '', component: AppareilViewComponent },
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: 'not-found' }
];
````

Ainsi, quand vous entrez un chemin dans la barre de navigation qui n'est pas directement pris en charge par votre
application, vous êtes redirigé vers ``/not-found`` et donc le component 404.

## Guards

Il peut y avoir des cas de figure où vous souhaiterez exécuter du code avant qu'un utilisateur puisse accéder à
une route ; par exemple, vous pouvez souhaiter vérifier son authentification ou son identité. Techniquement,
ce serait possible en insérant du code dans la méthode **ngOnInit()** de chaque component, mais cela deviendrait lourd,
avec du code répété et une multiplication des erreurs potentielles.  Ce serait donc mieux d'avoir une façon
de centraliser ce genre de fonctionnalité.  Pour cela, il existe la guard **canActivate**.

Une guard est en effet un service qu'Angular exécutera au moment où l'utilisateur essaye de naviguer vers la
route sélectionnée. Ce service implémente l'interface **canActivate**, et donc doit contenir une méthode du même
nom qui prend les arguments **ActivatedRouteSnapshot** et **RouterStateSnapshot** (qui lui seront fournis par
Angular au moment de l'exécution) et retourne une valeur booléenne, soit de manière synchrone (boolean),
soit de manière asynchrone (sous forme de Promise ou d'Observable) :

````typescript
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  }
}
````

N'oubliez pas d'importer les différents éléments en haut du fichier.

Si vous ne connaissez pas encore les Observables, ne vous inquiétez pas, vous les découvrirez
en détail dans le chapitre suivant.

Sauvegardez ce fichier dans le dossier  services  sous le nom **auth-guard.service.ts**.

Ensuite, il faut injecter le service  AuthService  dans ce nouveau service.  Pour injecter un service
dans un autre service, il faut que le service dans lequel on injecte un autre ait le décorateur __@Injectable__,
à importer depuis  ``@angular/core`` :

````typescript
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  }
}
````

À l'intérieur de la méthode **canActivate()**, vous allez vérifier l'état de l'authentification dans **AuthService**.
Si l'utilisateur est authentifié, la méthode renverra  true , permettant l'accès à la route protégée.  Sinon, vous
pourriez retourner  false , mais cela empêchera simplement l'accès sans autre fonctionnalité.  Il serait intéressant
de rediriger l'utilisateur vers la page d'authentification, le poussant à s'identifier :

````typescript
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isAuth) {
      return true;
    } else {
      this.router.navigate(['/auth']);
    }
  }
}
````

Pour appliquer cette garde à la route ``/appareils`` et à toutes ses routes enfants, il faut l'ajouter dans
**AppModule**.  N'oubliez pas d'ajouter **AuthGuard** à l'array **providers**, puisqu'il s'agit d'un service :

````typescript
const appRoutes: Routes = [
  { path: 'appareils', canActivate: [AuthGuard], component: AppareilViewComponent },
  { path: 'appareils/:id', canActivate: [AuthGuard], component: SingleAppareilComponent },
  { path: 'auth', component: AuthComponent },
  { path: '', component: AppareilViewComponent },
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: 'not-found' }
];
````

Maintenant, si vous essayez d'accéder à  /appareils  sans être authentifié, vous êtes automatiquement
redirigé vers ``/auth``.  Si vous cliquez sur "Se connecter", vous pouvez accéder à la liste d'appareils sans problème.

La route ``/appareils`` étant protégée, vous pouvez retirer les liaisons  disabled  des boutons "Tout allumer"
et "Tout éteindre", car vous pouvez être certain que tout utilisateur accédant à cette route sera authentifié.

Dans ce chapitre, vous avez appris à gérer le routing de votre application avec des **routerLink** et de manière
programmatique (avec ``router.navigate()``).  Vous avez également vu comment rediriger un utilisateur, et comment
protéger des routes de votre application avec les guards.