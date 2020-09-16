# Gérer les données dynamiques - data binding

[Gérer les données dynamiques](https://openclassrooms.com/fr/courses/4668271-developpez-des-applications-web-avec-angular/5088271-gerez-des-donnees-dynamiques)

L'intérêt d'utiliser Angular est de pouvoir gérer le DOM (Document Object Model :
les éléments HTML affichés par le navigateur) de manière dynamique, et pour cela,
il faut utiliser la liaison de données, ou "databinding".

Le databinding, c'est la communication entre votre code TypeScript et le template HTML
qui est montré à l'utilisateur.  

Cette communication est divisée en deux directions :

- les informations venant de votre code qui doivent être affichées dans le navigateur,
  comme par exemple des informations que votre code a calculé ou récupéré sur un serveur.  
  Les deux principales méthodes pour cela sont le "string interpolation" et le "property binding" ;

- les informations venant du template qui doivent être gérées par le code : l'utilisateur a rempli
  un formulaire ou cliqué sur un bouton, et il faut réagir et gérer ces événements.  
  On parlera de "event binding" pour cela.

Il existe également des situations comme les formulaires, par exemple, où l'on voudra une 
communication à double sens : on parle donc de "two-way binding".

## String interpolation ``{{}}``

ts->html 

L'interpolation est la manière la plus basique d'émettre des données issues de votre code TypeScript.

Imaginez une application qui vérifie l'état de vos appareils électriques à la maison pour voir
s'ils sont allumés ou non.  Créez maintenant un nouveau component  **AppareilComponent**  avec la commande suivante :

    $ ng generate component appareil

abreviation

    $ ng g c appareil

Ouvrez ensuite  **appareil.component.html**  (dans le nouveau dossier  appareil  créé par le CLI), supprimez le contenu,
et entrez le code ci-dessous :

````html
  <li class="list-group-item">
    <h4>Ceci est dans AppareilComponent</h4>
  </li>
````

Ensuite, ouvrez  **app.component.html** , et remplacez tout le contenu comme suit :

````html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <h2>Mes appareils</h2>
      <ul class="list-group">
        <app-appareil></app-appareil>
        <app-appareil></app-appareil>
        <app-appareil></app-appareil>
      </ul>
    </div>
  </div>
</div>
````

Maintenant votre navigateur devrait vous montrer quelque chose comme cela :

    Mes appareils
    Ceci est dans AppareilComponent
    Ceci est dans AppareilComponent
    Ceci est dans AppareilComponent

Pour l'instant, rien de bien spectaculaire.  Vous allez maintenant utiliser l'interpolation
pour commencer à dynamiser vos données.  Modifiez  **appareil.component.html**  ainsi :

````html
<li class="list-group-item">
  <h4>Appareil : {{ appareilName }}</h4>
</li>
````

Ici, vous trouvez la syntaxe pour l'interpolation : les doubles accolades  ``{{ }}`` .  Ce qui se trouve
entre les doubles accolades correspond à l'expression TypeScript que nous voulons afficher,
l'expression la plus simple étant une variable.  D'ailleurs, puisque la variable  **appareilName**  
n'existe pas encore, votre navigateur n'affiche rien à cet endroit pour l'instant.  
Ouvrez maintenant  **appareil.component.ts**  :

````typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appareil',
  templateUrl: './appareil.component.html',
  styleUrls: ['./appareil.component.scss']
})
export class AppareilComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
````

Ajoutez maintenant la ligne de code suivante en haut de la déclaration de class :

````typescript
export class AppareilComponent implements OnInit {
  
  appareilName: string = 'Machine à laver';

  constructor() { }
````

Une fois le fichier enregistré, votre navigateur affiche maintenant :

    Mes appareils
    Appareil : Machine à laver
    Appareil : Machine à laver
    Appareil : Machine à laver

Voilà ! Vous avez maintenant une communication entre votre code TypeScript et votre template HTML.
Pour l'instant, les valeurs sont codées "en dur", mais à terme, ces valeurs peuvent être calculées
par votre code ou récupérées sur un serveur, par exemple.
Ajoutez maintenant une nouvelle variable dans votre  **AppareilComponent**  :

````typescript
appareilName: string = 'Machine à laver';
appareilStatus: string = 'éteint';
````

Puis intégrez cette variable dans le template **appareil.component.html**:

````html
<li class="list-group-item">
  <h4>Appareil : {{ appareilName }} -- Statut: {{ appareilStatus }}</h4>
</li>
````

Votre navigateur montre ceci :

    Mes appareils
    Appareil : Machine à laver -- Statut: éteint
    Appareil : Machine à laver -- Statut: éteint
    Appareil : Machine à laver -- Statut: éteint

On peut utiliser toute expression TypeScript valable pour l'interpolation. Pour démontrer cela,
ajouter une méthode au fichier  AppareilComponent  :

````typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appareil',
  templateUrl: './appareil.component.html',
  styleUrls: ['./appareil.component.scss']
})
export class AppareilComponent implements OnInit {

  appareilName: string = 'Machine à laver';
  appareilStatus: string = 'éteint';

  constructor() { }

  ngOnInit() {
  }

  getStatus() {
    return this.appareilStatus;
  }

}
````

Alors que cette méthode ne fait que retourner la même valeur qu'avant, on peut imaginer
une situation où elle ferait un appel API, par exemple, qui retournerait le statut de
l'appareil électrique.

Modifiez maintenant le template pour prendre en compte ce changement :

````html
<li class="list-group-item">
  <h4>Appareil : {{ appareilName }} -- Statut : {{ getStatus() }}</h4>
</li>
````

Vous devez avoir le même résultat visuel dans le navigateur.

## Property binding ``[disabled]="property"``

``[property1]="property_2"``
``[property1]="'value'"``

ts->html

plutôt qu'afficher simplement le contenu d'une variable, vous pouvez modifier dynamiquement
les propriétés d'un élément du DOM en fonction de données dans votre TypeScript.

Pour votre application des appareils électriques, imaginez que si l'utilisateur est authentifié,
on lui laisse la possibilité d'allumer tous les appareils de la maison.  Puisque l'authentification
est une valeur globale, ajoutez une variable boolean dans  **AppComponent**

````typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuth = false;
}
````

Ajoutez maintenant un bouton au template global  **app.component.html** , en dessous de la liste d'appareils :

````html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <h2>Mes appareils</h2>
      <ul class="list-group">
        <app-appareil></app-appareil>
        <app-appareil></app-appareil>
        <app-appareil></app-appareil>
      </ul>
      <button class="btn btn-success" disabled>Tout allumer</button>
    </div>
  </div>
</div>
````

La propriété  disabled  permet de désactiver le bouton.  Afin de lier cette propriété au TypeScript,
il faut le mettre entre crochets  []  et l'associer à la variable ainsi :

````html
<button class="btn btn-success" [disabled]="!isAuth">Tout allume</button>
````

Le point d'exclamation fait que le bouton est désactivé lorsque  ``isAuth === false`` .  Pour montrer
que cette liaison est dynamique, créez une méthode  **constructor**  dans  **AppComponent** , dans laquelle
vous créerez une timeout qui associe la valeur  **true**  à  **isAuth**  après 4 secondes
(pour simuler, par exemple, le temps d'un appel API) :

````typescript
export class AppComponent {
  isAuth = false;

  constructor() {
    setTimeout(
      () => {
        this.isAuth = true;
      }, 4000
    );
  }
}
````

Pour en voir l'effet, rechargez la page dans votre navigateur et observez comment le bouton s'active
au bout de quatre secondes.  Pour l'instant le bouton ne fait rien : vous découvrirez comment exécuter
du code lorsque l'utilisateur cliquera dessus avec la liaison des événements, ou "event binding".

## Event binding - ``(event)="fonction()"``

html->js -- réagir dans le typescript à des évènements venant du template (html)

(event)="fonction()"

Avec le string interpolation et le property binding, vous savez communiquer depuis votre code TypeScript vers le template HTML.  
Maintenant, je vais vous montrer comment réagir dans votre code TypeScript aux événements venant du template HTML.

Actuellement, vous avez un bouton sur votre template qui s'active au bout de 4 secondes.  Vous allez maintenant
lui ajouter une fonctionnalité liée à l'événement "click" (déclenché quand l'utilisateur clique dessus).

Ajoutez la liaison suivante à votre bouton dans le template HTML :

````html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <h2>Mes appareils</h2>
      <ul class="list-group">
        <app-appareil></app-appareil>
        <app-appareil></app-appareil>
        <app-appareil></app-appareil>
      </ul>
      <button class="btn btn-success" 
              [disabled]="!isAuth" 
              (click)="onAllumer()">Tout allumer</button>
    </div>
  </div>
</div>
````

Comme vous pouvez le constater, on utilise les parenthèses  ()  pour créer une liaison à un événement.
Pour l'instant, la méthode  ``onAllumer()``  n'existe pas, donc je vous propose de la créer maintenant
dans  **app.component.ts** , en dessous du constructeur.

````typescript
onAllumer() {
    console.log('On allume tout !');
}
````

Enregistrez le fichier, et ouvrez la console dans votre navigateur.  Lorsque le bouton s'active, cliquez dessus,
et vous verrez votre message apparaître dans la console.

Même si cela reste une fonction très simple pour l'instant, cela vous montre comment lier une fonction TypeScript
à un événement venant du template.  De manière générale, vous pouvez lier du code à n'importe quelle propriété
ou événement des éléments du DOM.

[Javascript events](https://www.w3schools.com/js/js_events.asp)

## Two-way binding - [()]

La **liaison à double sens** (ou **two-way binding**) utilise la liaison par propriété et la liaison par événement
en même temps ; on l'utilise, par exemple, pour les formulaires, afin de pouvoir déclarer et de récupérer
le contenu des champs, entre autres.

par événement en même temps ; on l'utilise, par exemple, pour les formulaires, afin de pouvoir déclarer et de récupérer le contenu des champs, entre autres.

Pour pouvoir utiliser le two-way binding, il vous faut importer  **FormsModule**  depuis  ``@angular/forms``  dans
votre application.  Vous pouvez accomplir cela en l'ajoutant à l'array  imports  de votre  **AppModule**
(sans oublier d'ajouter le statement  import  correspondant en haut du fichier) :

````typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';   /*  ajout ici  */


import { AppComponent } from './app.component';
import { MonPremierComponent } from './mon-premier/mon-premier.component';
import { AppareilComponent } from './appareil/appareil.component';


@NgModule({
  declarations: [
    AppComponent,
    MonPremierComponent,
    AppareilComponent
  ],
  imports: [
    BrowserModule,
    FormsModule            /*  ajout ici  */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

Le **two-way binding** emploie le mélange des syntaxes de property binding et d'event binding :
des crochets et des parenthèses  ``[()]``  .  Pour une première démonstration, ajoutez un  ``<input>``
dans votre template  **appareil.component.html**  et liez-le à la variable  **appareilName**
en utilisant la directive  **ngModel**  :

````html
<li class="list-group-item">
  <h4>Appareil : {{ appareilName }} -- Statut : {{ getStatus() }}</h4>
  <input type="text" class="form-control" [(ngModel)]="appareilName">
</li>
````

Dans votre template, vous verrez un  ``<input>``  par appareil.  Le nom de l'appareil est déjà indiqué dedans,
et si vous le modifiez, le contenu du  ``<h4>``  est modifié avec.  Ainsi vous voyez également que chaque
instance du component  **AppareilComponent**  est entièrement indépendante une fois créée :
le fait d'en modifier une ne change rien aux autres.  Ce concept est très important, et il s'agit de
l'une des plus grandes utilités d'Angular.

## Propriétés personnalisées

Il est possible de créer des propriétés personnalisées dans un component afin de pouvoir lui transmettre
des données depuis l'extérieur.

Pour l'application des appareils électriques, il serait intéressant de faire en sorte que chaque instance
d'**AppareilComponent** ait un nom différent qu'on puisse régler depuis l'extérieur du code.  Pour ce faire,
il faut utiliser le décorateur  ``@Input()``  en remplaçant la déclaration de la variable  **appareilName**  :

````typescript
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-appareil',
  templateUrl: './appareil.component.html',
  styleUrls: ['./appareil.component.scss']
})
export class AppareilComponent implements OnInit {

  @Input() appareilName: string;
  
  appareilStatus: string = 'éteint';

  constructor() { }

  ngOnInit() {
  }

  getStatus() {
    return this.appareilStatus;
  }

}
````

    N'oubliez pas d'importer  Input  depuis  @angular/core  en haut du fichier !

Ce décorateur, en effet, crée une propriété  appareilName  qu'on peut fixer depuis la balise  ``<app-appareil>``  :

app.component.html

````html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <h2>Mes appareils</h2>
      <ul class="list-group">
        <app-appareil appareilName="Machine à laver"></app-appareil>
        <app-appareil appareilName="Frigo"></app-appareil>
        <app-appareil appareilName="Ordinateur"></app-appareil>
      </ul>
      <button class="btn btn-success"
              [disabled]="!isAuth"
              (click)="onAllumer()">Tout allumer</button>
    </div>
  </div>
</div>
````

C'est une première étape intéressante, mais ce serait encore plus dynamique de pouvoir passer
des variables depuis  **AppComponent**  pour nommer les appareils (on peut imaginer une autre partie
de l'application qui récupérerait ces noms depuis un serveur, par exemple).  
Heureusement, vous savez déjà utiliser le property binding !

Créez d'abord vos trois variables dans  **AppComponent**  :  

````typescript
export class AppComponent {
  isAuth = false;
  
  appareilOne = 'Machine à laver';
  appareilTwo = 'Frigo';
  appareilThree = 'Ordinateur';

  constructor() {
````

Maintenant, utilisez les crochets  ``[]``  pour lier le contenu de ces variables à la propriété du component :

app.comonent.html - [appareilName]="nomVariable"

````html
<ul class="list-group">
    <app-appareil [appareilName]="appareilOne"></app-appareil>
    <app-appareil [appareilName]="appareilTwo"></app-appareil>
    <app-appareil [appareilName]="appareilThree"></app-appareil>
</ul>
````

Vous pouvez également créer une propriété pour régler l'état de l'appareil :

appareil.component.ts

````typescript
export class AppareilComponent implements OnInit {

  @Input() appareilName: string;
  @Input() appareilStatus: string;

  constructor() {
````

app.component.html - [appareilStatus]="'valeur_propriété'" ou [appareilName]="variable"

````html
      <ul class="list-group">
        <app-appareil [appareilName]="appareilOne" [appareilStatus]="'éteint'"></app-appareil>
        <app-appareil [appareilName]="appareilTwo" [appareilStatus]="'allumé'"></app-appareil>
        <app-appareil [appareilName]="appareilThree" [appareilStatus]="'éteint'"></app-appareil>
      </ul>
````

Notez bien que si vous employez les crochets pour le **property binding** et que vous souhaitez y
**passer un string directement**, il faut le **mettre entre apostrophes**, car entre les guillemets,
il doit y avoir un statement de TypeScript valable. Si vous omettez les apostrophes,
vous essayez d'y passer une variable nommée  allumé  ou  éteint  et l'application ne compilera pas.
