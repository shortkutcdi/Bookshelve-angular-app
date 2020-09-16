# Structurer le document avec des Directives

Les directives sont des instructions intégrées dans le DOM que vous utiliserez presque systématiquement
quand vous créerez des applications Angular.  Quand Angular lit votre template et rencontre une directive
qu'il reconnait, il suit les instructions correspondantes.  Vous pouvez créer vos propres directives,
mais dans le cadre de ce cours, nous allons uniquement aborder certaines directives qui sont fournies
avec Angular et qui sont extrêmement utiles.

Il existe deux types principaux de directive : les **directives structurelles** et les **directives par attribut**.

## Les directives structurelles ``*ng...``

Ce sont des directives qui, comme leur nom l'indique, modifient la structure du document.  Dans ce chapitre,
vous allez en découvrir deux (il en existe d'autres) :  

- ``*ngIf``  pour afficher des données de façon conditionnelle
- ``*ngFor`` pour itérer des données dans un array, par exemple

### *ngIf

Un component auquel on ajoute la directive  __*ngIf="condition"__  ne s'affichera que si la condition est "truthy"
(elle retourne la valeur  true  où la variable mentionnée est définie et non-nulle), comme un statement  **if**  classique.

Pour une démonstration simple, ajoutez une  ``<div>``  rouge qui ne s'affichera que si l'appareil est éteint :

````html
<li class="list-group-item">
  <div style="width:20px;height:20px;background-color:red;" 
       *ngIf="appareilStatus === 'éteint'"></div>
  <h4>Appareil : {{ appareilName }} -- Statut : {{ getStatus() }}</h4>
  <input type="text" class="form-control" [(ngModel)]="appareilName">
</li>
````

### *ngFor

Lorsque l'on ajoute la directive  __*ngFor="let obj of myArray"__  à un component, Angular itérera l'array  **myArray**
et affichera un component par objet  **obj** .  Pour en comprendre l'utilisation, je vous propose de modifier la façon
dont votre application génère des appareils électriques.

On peut imaginer que votre application récupère, depuis un serveur, un array contenant tous les appareils
et leurs états.  Pour l'instant, créez cet array directement dans  AppComponent  :

app.component.ts

````typescript
export class AppComponent {
  isAuth = false;

  appareils = [
    {
      name: 'Machine à laver',
      status: 'éteint'
    },
    {
      name: 'Frigo',
      status: 'allumé'
    },
    {
      name: 'Ordinateur',
      status: 'éteint'
    }
  ];

  constructor() {
````

Vous avez un array avec trois objets, chaque objet ayant une propriété **name** et une propriété **status**.
Vous pourriez même créer une interface ou une class TypeScript **Appareil**, mais dans ce cas simple ce n'est pas nécessaire.

Maintenant la magie  __*ngFor__  :

````html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <h2>Mes appareils</h2>
      <ul class="list-group">
        <app-appareil  *ngFor="let appareil of appareils"
                       [appareilName]="appareil.name"
                       [appareilStatus]="appareil.status"></app-appareil>
      </ul>
      <button class="btn btn-success"
              [disabled]="!isAuth"
              (click)="onAllumer()">Tout allumer</button>
    </div>
  </div>
</div>
````

Le statement __let appareil of appareils__, comme dans une for loop classique, itère pour chaque élément
**appareil** (nom arbitraire) de l'array **appareils**. Après cette directive, vous pouvez maintenant
utiliser l'objet **appareil**, dont vous connaissez la forme, à l'intérieur de cette balise HTML.
Vous pouvez donc utiliser le property binding, et y passer les propriétés **name** et **status**  de cet objet.

**Remarque**

    N'oubliez pas l'astérisque devant ces directives, qui signifie à Angular de les traiter
    comme directives structurelles !

## Les directives par attribut

À la différence des directives structurelles, les directives par attribut modifient le comportement
d'un objet déjà existant.  Vous avez déjà utilisé une directive de ce type sans le savoir :
la directive **ngModel**  que vous avez employée pour le two-way binding, qui modifie la valeur
du ``<input>`` et répond à tout changement qu'on lui apporte.  
Je vais vous montrer deux autres exemples très utiles : **ngStyle** et **ngClass**,
qui permettent d'attribuer des styles ou des classes de manière dynamique.

### ngStyle

Cette directive permet d'appliquer des styles à un objet du DOM de manière dynamique. Imaginez que,
pour l'application des appareils électriques, vous souhaitiez modifier la couleur du texte selon
si l'appareil est allumé ou non, disons vert pour allumé, rouge pour éteint. **ngStyle** vous permet de faire cela :

````html
<h4 [ngStyle]="{color: getColor()}">Appareil : {{ appareilName }} -- Statut : {{ getStatus() }}</h4>
````

**ngStyle** prend un objet JS de type clé-valeur, avec comme clé le style à modifier, et comme valeur
la valeur souhaitée pour ce style. Ici, vous faites appel à une fonction **getColor()** dans **AppareilComponent**
que vous allez maintenant créer :

````typescript
getColor() {
    if(this.appareilStatus === 'allumé') {
      return 'green';
    } else if(this.appareilStatus === 'éteint') {
      return 'red';
    }
}
````

Cette fonction retourne la valeur __'green'__ si l'appareil est allumé, et __'red'__ s'il est éteint,
modifiant ainsi la couleur du texte dans le template.

### ngClass

Au-delà de modifier des styles directement, il peut être très utile d'ajouter des classes CSS à
un élément de manière dynamique.  Comme **ngStyle**, **ngClass** prend un objet clé-valeur, mais
cette fois avec la classe à appliquer en clé, et la condition en valeur.

Pour cet exemple, je vous propose d'appliquer des classes Bootstrap à la balise  ``<li>``  
en fonction du statut de l'appareil :

````html
<li [ngClass]="{'list-group-item': true,
                'list-group-item-success': appareilStatus === 'allumé',
                'list-group-item-danger': appareilStatus === 'éteint'}">
  <div style="width:20px;height:20px;background-color:red;"
       *ngIf="appareilStatus === 'éteint'"></div>
  <h4 [ngStyle]="{color: getColor()}">Appareil : {{ appareilName }} -- Statut : {{ getStatus() }}</h4>
  <input type="text" class="form-control" [(ngModel)]="appareilName">
</li>
````

Angular appliquera donc systématiquement la classe **list-group-item**, et selon le contenu de la variable
**appareilStatus**, appliquera l'une ou l'autre des deux autres classes.  Vous pouvez bien évidemment
créer vos propres classes et les utiliser ; j'ai simplement choisi des classes Bootstrap pour simplifier l'explication.

**Remarque**
  
  Que ce soit pour  ngStyle  ou pour  ngClass , les objets JS peuvent être des variables valables dans 
  votre TypeScript qui seront ensuite référencées par la directive, par exemple : __[ngClass]="myClassObject"__