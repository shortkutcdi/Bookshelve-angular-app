# améliorer la structure du code avec les services

## Qu'est-ce qu'un service

Dit très simplement, un service permet de centraliser des parties de votre code et des données
qui sont utilisées par plusieurs parties de votre application ou de manière globale par
l'application entière.  Les services permettent donc :

- de ne pas avoir le même code doublé ou triplé à différents niveaux de l'application - ça facilite
  donc la maintenance, la lisibilité et la stabilité du code ;

- de ne pas copier inutilement des données - si tout est centralisé, chaque partie de l'application
  aura accès aux mêmes informations, évitant beaucoup d'erreurs potentielles.

Dans le cas de l'application que vous avez créée lors des derniers chapitres, on pourrait imaginer
un service **AppareilService** qui contiendrait les données des appareils électriques, et également
des fonctions globales liées aux appareils, comme "tout allumer" ou "tout éteindre" que vous pourrez enfin intégrer.

L'authentification reste simulée pour l'instant, mais quand vous l'intégrerez, on pourrait imaginer un
deuxième service **AuthService** qui s'occuperait de vérifier l'authentification de l'utilisateur, et qui
pourrait également stocker des informations sur l'utilisateur actif comme son adresse mail et son pseudo.

## Injection et instances

Pour être utilisé dans l'application, un service doit être injecté, et le niveau choisi pour l'injection
est très important.  Il y a trois niveaux possibles pour cette injection :

- dans **AppModule** : ainsi, la même instance du service sera utilisée par tous les components de l'application et
  par les autres services;

- dans **AppComponent** : comme ci-dessus, tous les components auront accès à la même instance du service
  mais non les autres services ;

- dans un autre component : le component lui-même et tous ses enfants (c'est-à-dire tous les components qu'il englobe)
  auront accès à la même instance du service, mais le reste de l'application n'y aura pas accès.

Pour les exemples de ce cours, vous injecterez systématiquement les services dans **AppModule** pour rendre disponible
une seule instance par service à toutes les autres parties de votre application.

Créez maintenant un sous-dossier **services**  dans **app**, et créez-y un nouveau fichier appelé **appareil.service.ts** :

    export class AppareilService {

    }

AppModule

````typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MonPremierComponent } from './mon-premier/mon-premier.component';
import { AppareilComponent } from './appareil/appareil.component';
import { FormsModule } from '@angular/forms';
import { AppareilService } from './services/appareil.service';


@NgModule({
  declarations: [
    AppComponent,
    MonPremierComponent,
    AppareilComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    AppareilService   // injection de AppareilService dans AppModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

````

Angular crée maintenant une instance du service **AppareilService** pour l'application entière.  Pour
l'intégrer dans un component, on le déclare comme argument dans son constructeur. Intégrez-le dans
**AppComponent** (sans oublier d'ajouter l'import en haut) :

app.component.ts

````typescript
constructor(private appareilService: AppareilService) {
    setTimeout(
      () => {
        this.isAuth = true;
      }, 4000
    );
  }
````

Maintenant, dans **AppComponent**, vous avez un membre appelé **appareilService** qui correspond à l'instance de
ce service que vous avez créé dans **AppModule**.  Vous y ajouterez de la fonctionnalité dans le chapitre suivant.

## Utilisez les services

Le premier élément qu'il serait logique de déporter dans le service serait l'array appareils. Copiez-le depuis
**AppComponent**, collez-le dans **AppareilService** et, de nouveau dans **AppComponent**, déclarez **appareils**
simplement comme un array de type **any** :

src/app/services/appareil.service.ts

````typescript
export class AppareilService {
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
}
````

````typescript
export class AppComponent {

  isAuth = false;

  appareils: any[];
````

Il faut maintenant que **AppComponent** puisse récupérer les informations stockées dans **AppareilService**.
Pour cela, vous allez implémenter la méthode **ngOnInit()**.

**ngOnInit()**  correspond à une "lifecycle hook". Le détail de ces hooks va au-delà du cadre de ce cours,
mais pour l'instant, tout ce que vous avez besoin de savoir, c'est que la méthode **ngOnInit()** d'un component
est exécutée une fois par instance au moment de la création du component par Angular, et après son constructeur.
On l'utilise très souvent pour initialiser des données une fois le component créé.

Pour ce faire, vous allez d'abord créer la fonction **ngOnInit()** - généralement on la place après le constructeur
et avant les autres méthodes du component :

````typescript
constructor(private appareilService: AppareilService) {
    setTimeout(
      () => {
        this.isAuth = true;
      }, 4000
    );
  }

ngOnInit() {

}
````

Ensuite, dans la déclaration de classe **AppComponent**, vous allez implémenter l'interface **OnInit**
(en l'important depuis ``@angular/core`` en haut) :

````typescript
import { Component, OnInit } from '@angular/core';
import { AppareilService } from './services/appareil.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
````

Vous pouvez maintenant récupérer les informations depuis **AppareilService** dans la méthode **ngOnInit()** :

````typescript
ngOnInit() {
    this.appareils = this.appareilService.appareils;
}
````

La liaison directe à un array comme ici n'est généralement pas un best practice.  J'ai choisi d'employer
cette méthode ici pour montrer plus simplement l'intégration des services, mais ne vous en faites pas :
nous verrons les meilleures méthodes plus tard dans ce cours !

Votre application devrait fonctionner à nouveau, avec la liste des appareils électriques qui s'affiche comme avant.
Il n'y a aucune différence visuelle, mais votre code est maintenant plus modulaire, et ce sera plus facile d'ajouter
des fonctionnalités. Par exemple, vous allez pouvoir créer deux nouvelles méthodes : **switchOnAll()** et **switchOffAll()**
pour allumer ou éteindre tous les appareils d'un coup.

Commencez par préparer ces méthodes dans **AppareilService** :

````typescript
switchOnAll() {
    for(let appareil of this.appareils) {
      appareil.status = 'allumé';
    }
}

switchOffAll() {
    for(let appareil of this.appareils) {
      appareil.status = 'éteint';
    }
}
````

Puis ajoutez un deuxième bouton dans le template de **AppComponent** :

````html
<button class="btn btn-success"
              [disabled]="!isAuth"
              (click)="onAllumer()">Tout allumer</button>
<button class="btn btn-danger"
              [disabled]="!isAuth"
              (click)="onEteindre()">Tout éteindre</button>
````

Enfin, il ne vous reste plus qu'à capturer les événements  click  dans **AppComponent** pour ensuite
déclencher les méthodes dans **AppareilService**. Commencez déjà par **onAllumer()** :

````typescript
onAllumer() {
    this.appareilService.switchOnAll();
}
````

Ensuite, pour **onEteindre()**, vous allez d'abord afficher un message de confirmation pour vous assurer
que l'utilisateur est certain de vouloir tout éteindre :

````typescript
onEteindre() {
    if(confirm('Etes-vous sûr de vouloir éteindre tous vos appareils ?')) {
      this.appareilService.switchOffAll();
    } else {
      return null;
    }
}
````

Vos boutons allument et éteignent tous les appareils grâce à la communication entre votre **AppComponent** et
votre **AppareilService**.

    Mais j'aurais pu faire tout ça à l'intérieur du component - quel est l'intérêt d'avoir tout mis dans un service ?

Effectivement, les fonctionnalités que vous avez ajoutées pour l'instant auraient pu rester dans **AppComponent**,
mais dans le chapitre suivant, vous allez profiter du service pour créer de la communication entre vos components,
notamment des components enfants vers leur parent.

## Faites communiquer vos components

Pour l'instant, votre utilisateur ne peut qu'allumer ou éteindre tous les appareils à la fois.  Ce qui pourrait
être très intéressant, ce serait qu'il puisse en allumer ou éteindre un à la fois.
Actuellement, le plan de l'application ressemble à ça :

                            AppComponent ---------  AppareilService
                                |
                                |
            --------------------------------------------
            |                    |                     |
    AppareilComponent     AppareilComponent     AppareilComponent

**AppareilService** fournit les données sur les appareils à **AppComponent**.  Ensuite, **AppComponent** génère
trois instances de **AppareilComponent** selon ces données. Il n'y a actuellement aucune communication entre
les components enfants et leur parent. Vous pouvez modifier cela en intégrant **AppareilService** dans les
**AppareilComponent** et en créant des méthodes qui permettent de modifier un appareil à la fois.  
Procédez étape par étape.

Dans un premier temps, il faudra que chaque instance de **AppareilComponent** puisse dire à **AppareilService**
à quel membre de l'array **appareils** elle correspond. Heureusement, Angular nous permet de faire ça facilement.
Dans la directive  *ngFor , ajoutez :

````html
<ul class="list-group">
    <app-appareil  *ngFor="let appareil of appareils; let i = index"
                   [appareilName]="appareil.name"
                   [appareilStatus]="appareil.status"></app-appareil>
</ul>
````

Cette commande rend disponible l'index de l'objet **appareil** dans l'array **appareils**. Ensuite, il faut pouvoir
capturer et travailler avec cette variable : vous pouvez utiliser le property binding. Pour cela, ajoutez un membre **index**
au component en tant que **@Input()** :

````typescript
@Input() appareilName: string;
@Input() appareilStatus: string;
@Input() index: number;
````

Puis liez-y l'index **i** depuis le template :

````html
<ul class="list-group">
    <app-appareil  *ngFor="let appareil of appareils; let i = index"
                   [appareilName]="appareil.name"
                   [appareilStatus]="appareil.status" 
                   [index]="i"></app-appareil>
</ul>
````

À partir de là, vous avez une variable **index** disponible à l'intérieur du component qui correspond
à l'index de l'appareil dans l'array de **AppareilService**.
Vous verrez dans quelques instants pourquoi vous en avez besoin.

````typescript
switchOnOne(i: number) {
    this.appareils[i].status = 'allumé';
}

switchOffOne(i: number) {
    this.appareils[i].status = 'éteint';
}
````

Ensuite, dans **AppareilComponent**, vous allez d'abord intégrer le service **AppareilService**, en l'important
en haut du fichier comme toujours :

    constructor(private appareilService: AppareilService) { }

Puis vous allez préparer la méthode qui, en fonction du statut actuel de l'appareil, l'allumera ou l'éteindra :

````typescript
onSwitch() {
    if(this.appareilStatus === 'allumé') {
      this.appareilService.switchOffOne(this.index);
    } else if(this.appareilStatus === 'éteint') {
      this.appareilService.switchOnOne(this.index);
    }
}
````

**Remarque** :

Le nom **onSwitch()** ici est choisi pour respecter la norme d'employer "on" pour la capture d'un événement,
et non pour dire "switch on" comme "allumer"

Enfin, vous allez créer le bouton dans le template qui déclenchera cette méthode. Il serait intéressant que
ce bouton soit contextuel : si l'appareil est allumé, il affichera "Éteindre" et inversement.  Pour cela,
le plus simple est de créer deux boutons dotés de la directive  *ngIf  :

`````html
<li [ngClass]="{'list-group-item': true,
                'list-group-item-success': appareilStatus === 'allumé',
                'list-group-item-danger': appareilStatus === 'éteint'}">
  
  <h4 [ngStyle]="{color: getColor()}">Appareil : {{ appareilName }} -- Statut : {{ getStatus() }}</h4>
  <input type="text" class="form-control" [(ngModel)]="appareilName">

  <button class="btn btn-sm btn-success"
          *ngIf="appareilStatus === 'éteint'"
          (click)="onSwitch()">Allumer</button>
  <button class="btn btn-sm btn-danger"
          *ngIf="appareilStatus === 'allumé'"
          (click)="onSwitch()">Eteindre</button>

</li>
````

Vous pouvez supprimer la ``<div>`` conditionnelle rouge, car elle ne sert plus vraiment, avec tous les styles
que vous avez ajoutés pour signaler l'état d'un appareil.

Et voilà ! Vos components communiquent entre eux à l'aide du service, qui centralise les données et certaines fonctionnalités.
Même si les effets ne sont que visuels pour l'instant, vous pouvez très bien imaginer qu'à l'intérieur des méthodes du service
**AppareilService**, il y ait des appels API permettant de vraiment allumer ou éteindre les appareils et
d'en vérifier le fonctionnement.