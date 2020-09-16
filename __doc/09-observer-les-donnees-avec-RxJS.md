# Observer les données avec RxJS

[reactivX](http://reactivex.io/documentation/subject.html)

erreur rxjs
[RXJS own d.ts file error](https://github.com/ReactiveX/rxjs/issues/3654)
solution :
  
    reinstalling rxjs and rxjs compat did the trick for me. "npm install --save rxjs@6 rxjs-compat@6".

[Observables](https://angular.io/guide/observables)

Pour réagir à des événements ou à des données de manière asynchrone (c'est-à-dire ne pas devoir
attendre qu'une tâche, par exemple un appel HTTP, soit terminée avant de passer à la ligne de code
suivante), il y a eu plusieurs méthodes depuis quelques années.  Il y a le système de callback,
par exemple, ou encore les Promise.  Avec l'API RxJS, fourni et très intégré dans Angular, la méthode
proposée est celle des Observables.

## Observables

Mais qu'est-ce qu'un Observable ?

Très simplement, un Observable est un objet qui émet des informations auxquelles on souhaite réagir.
Ces informations peuvent venir d'un champ de texte dans lequel l'utilisateur rentre des données, ou
de la progression d'un chargement de fichier, par exemple.  Elles peuvent également venir de la
communication avec un serveur : le client HTTP, que vous verrez dans un chapitre ultérieur,
emploie les Observables.

Les Observables sont mis à disposition par **RxJS**, un package tiers qui est fourni avec Angular.
Il s'agit d'un sujet très vaste, vous trouverez toute la documentation sur le site
[ReactiveX](http://reactivex.io/documentation/observable.html).

À cet Observable, on associe un Observer — un bloc de code qui sera exécuté à chaque fois que
l'Observable émet une information.  L'Observable émet trois types d'information : des données,
une erreur, ou un message complete.  Du coup, tout Observer peut avoir trois fonctions : une pour
réagir à chaque type d'information.

Pour créer un cas concret simple, vous allez créer un Observable dans **AppComponent** qui enverra
un nouveau chiffre toutes les secondes.  Vous allez ensuite observer cet Observable et l'afficher
dans le DOM : de cette manière, vous pourrez dire à l'utilisateur depuis combien de temps il
visualise l'application.

Pour avoir accès aux Observables et aux méthodes que vous allez utiliser, il faut ajouter deux imports :

````typescript
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
````

Le premier import sert à rendre disponible le type Observable, et le deuxième vous donne accès à la méthode
que vous allez utiliser : la méthode **interval()**, qui crée un Observable qui émet un chiffre croissant à
intervalles réguliers et qui prend le nombre de millisecondes souhaité pour l'intervalle comme argument.

Implémentez **OnInit** et créez l'Observable dans **ngOnInit()** :

````typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    const counter = Observable.interval(1000);
  }
}
````

Maintenant que vous avez un Observable, il faut l'observer !  Pour cela, vous utiliserez la fonction
**subscribe()**, qui prendra comme arguments entre une et trois fonctions anonymes pour gérer les trois
types d'informations que cet Observable peut envoyer : des données, une erreur ou un message **complete**.

Créez une variable **secondes** dans **AppComponent** et affichez-la dans le template :

````typescript
export class AppComponent implements OnInit {

  secondes: number;

  ngOnInit() {
    const counter = Observable.interval(1000);
  }
}
````

````html
<ul class="nav navbar-nav">
    <li routerLinkActive="active"><a routerLink="auth">Authentification</a></li>
    <li routerLinkActive="active"><a routerLink="appareils">Appareils</a></li>
</ul>
<div class="navbar-right">
    <p>Vous êtes connecté depuis {{ secondes }} secondes !</p>
</div>
````

Maintenant vous allez souscrire à l'Observable et créer trois fonctions : la première va se déclencher
à chaque émission de données par l'Observable et va attribuer cette valeur à la variable "secondes" ;
la deuxième gèrera toute erreur éventuelle ; et la troisième se déclenchera si l'Observable s'achève :

````typescript
ngOnInit() {
    const counter = Observable.interval(1000);
    counter.subscribe(
      (value) => {
        this.secondes = value;
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ' + error);
      },
      () => {
        console.log('Observable complete!');
      }
    );
}
````

Dans le cas actuel, l'Observable que vous avez créé ne rendra pas d'erreur et ne se complétera pas.
Je veux simplement vous montrer l'intégration complète de la fonction **subscribe()**. Il est possible
de souscrire à un Observable en intégrant uniquement la première fonction.

Le compteur dans le DOM fonctionne, et continuera à compter à l'infini !  Dans le chapitre suivant,
vous verrez comment éviter les erreurs potentielles liées à ce genre de comportement infini.

## Subscriptions

Dans le chapitre précédent, vous avez appris à créer un Observable et à vous y souscrire.  Pour rappel,
la fonction **subscribe()** prend comme arguments trois fonctions anonymes :

- la première se déclenche à chaque fois que l'Observable émet de nouvelles données, et reçoit ces données
  comme argument ;

- la deuxième se déclenche si l'Observable émet une erreur, et reçoit cette erreur comme argument ;

- la troisième se déclenche si l'Observable s'achève, et ne reçoit pas d'argument.

Pour l'instant, cette souscription n'est pas stockée dans une variable : on ne peut donc plus y toucher
une fois qu'elle est lancée, et ça peut vous causer des bugs !  En effet, une souscription à un Observable
qui continue à l'infini continuera à recevoir les données, que l'on s'en serve ou non, et vous pouvez en
subir des comportements inattendus.

Ce n'est pas le cas pour tous les Observables. Généralement, les souscriptions aux Observables fournis par
Angular se suppriment toutes seules lors de la destruction du component.

Afin d'éviter tout problème, quand vous utilisez des Observables personnalisés, il est vivement conseillé
de stocker la souscription dans un objet Subscription (à importer depuis ``rxjs/Subscription``) :

````typescript
export class AppComponent implements OnInit {

  secondes: number;
  counterSubscription: Subscription;

  ngOnInit() {
    const counter = Observable.interval(1000);
    this.counterSubscription = counter.subscribe(
      (value) => {
        this.secondes = value;
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ' + error);
      },
      () => {
        console.log('Observable complete!');
      }
    );
  }
}
````

Le code fonctionne de la même manière qu'avant, mais vous pouvez maintenant y ajouter le code qui
évitera les bugs liés aux Observables.  Vous allez implémenter une nouvelle interface, **OnDestroy**
(qui s'importe depuis ``@angular/core``), avec sa fonction **ngOnDestroy()** qui se déclenche quand
un component est détruit :

````typescript
export class AppComponent implements OnInit, OnDestroy {

  secondes: number;
  counterSubscription: Subscription;

  ngOnInit() {
    const counter = Observable.interval(1000);
    this.counterSubscription = counter.subscribe(
      (value) => {
        this.secondes = value;
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ' + error);
      },
      () => {
        console.log('Observable complete!');
      }
    );
  }

  ngOnDestroy() {
    this.counterSubscription.unsubscribe();
  }
}
````

 La fonction **unsubscribe()** détruit la souscription et empêche les comportements inattendus liés
 aux Observables infinis, donc n'oubliez pas de unsubscribe !

## Subjects

Il existe un type d'Observable qui permet non seulement de réagir à de nouvelles informations, mais
également d'en émettre.  Imaginez une variable dans un service, par exemple, qui peut être modifié
depuis plusieurs components ET qui fera réagir tous les components qui y sont liés en même temps.
Voici l'intérêt des Subjects.

Pour l'application des appareils électriques, l'utilisation d'un Subject pour gérer la mise à jour
des appareils électriques permettra de mettre en place un niveau d'abstraction afin d'éviter des bugs
potentiels avec la manipulation de données.  Pour l'instant, l'array dans **AppareilViewComponent** est
une référence directe à l'array dans **AppareilService**.  Dans ce cas précis, cela fonctionne, mais
dans une application plus complexe, cela peut créer des problèmes de gestion de données.  De plus,
le service ne peut rien refuser : l'array peut être modifié directement depuis n'importe quel endroit
du code.  Pour corriger cela, il y a plusieurs étapes :

- rendre l'array des appareils **private** ;

- créer un Subject dans le service ;

- créer une méthode qui, quand le service reçoit de nouvelles données, fait émettre ces données par le
  Subject et appeler cette méthode dans toutes les méthodes qui en ont besoin ;

- souscrire à ce Subject depuis **AppareilViewComponent** pour recevoir les données émises, émettre les
  premières données, et implémenter **OnDestroy** pour détruire la souscription.

Première étape (dans **AppareilService** ) :  

````typescript
  private appareils = [
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
````

Deuxième étape (dans **AppareilService**) :

````typescript
import { Subject } from 'rxjs/Subject';

export class AppareilService {
  
  appareilsSubject = new Subject<any[]>();
  
  private appareils = [
````

Quand vous déclarez un Subject, il faut dire quel type de données il gèrera.  Puisque nous n'avons pas
créé d'interface pour les appareils (vous pouvez le faire si vous le souhaitez), il gèrera des array
de type **any[]**.  N'oubliez pas l'import !

Troisième étape, toujours dans **AppareilService** :

````typescript
emitAppareilSubject() {
    this.appareilsSubject.next(this.appareils.slice());
  }

switchOnAll() {
    for(let appareil of this.appareils) {
      appareil.status = 'allumé';
    }
    this.emitAppareilSubject();
}

switchOffAll() {
    for(let appareil of this.appareils) {
      appareil.status = 'éteint';
      this.emitAppareilSubject();
    }
}

switchOnOne(i: number) {
    this.appareils[i].status = 'allumé';
    this.emitAppareilSubject();
}

switchOffOne(i: number) {
    this.appareils[i].status = 'éteint';
    this.emitAppareilSubject();
}
````

Dernière étape, dans **AppareilViewComponent** :  

````typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppareilService } from '../services/appareil.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-appareil-view',
  templateUrl: './appareil-view.component.html',
  styleUrls: ['./appareil-view.component.scss']
})
export class AppareilViewComponent implements OnInit, OnDestroy {

  appareils: any[];
  appareilSubscription: Subscription;

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
    this.appareilSubscription = this.appareilService.appareilsSubject.subscribe(
      (appareils: any[]) => {
        this.appareils = appareils;
      }
    );
    this.appareilService.emitAppareilSubject();
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

  ngOnDestroy() {
    this.appareilSubscription.unsubscribe();
  }

}
````

L'application refonctionne comme avant, mais avec une différence cruciale de méthodologie : il y a
une abstraction entre le service et les components, où les données sont maintenues à jour grâce au Subject.

Pourquoi est-ce important ?

Dans ce cas précis, ce n'est pas fondamentalement nécessaire, mais imaginez qu'on intègre un système qui
vérifie périodiquement le statut des appareils.  Si les données sont mises à jour par une autre partie
de l'application, il faut que l'utilisateur voie ce changement sans avoir à recharger la page.  Il va
de même dans l'autre sens : un changement au niveau du view doit pouvoir être reflété par le reste de
l'application sans rechargement.

## Opérateurs

L'API RxJS propose énormément de possibilités — beaucoup trop pour tout voir dans ce cours.  Cependant,
j'aimerais vous parler rapidement de l'existence des opérateurs.

Un opérateur est une fonction qui se place entre l'Observable et l'Observer (la Subscription, par exemple),
et qui peut filtrer et/ou modifier les données reçues avant même qu'elles n'arrivent à la Subscription.
Voici quelques exemples rapides :

- **map()** : modifie les valeurs reçues — peut effectuer des calculs sur des chiffres, transformer du texte,
  créer des objets…

- **filter()** : comme son nom l'indique, filtre les valeurs reçues selon la fonction qu'on lui passe en argument.

- **throttleTime()** : impose un délai minimum entre deux valeurs — par exemple, si un Observable émet cinq
  valeurs par seconde, mais ce sont uniquement les valeurs reçues toutes les secondes qui vous intéressent,
  vous pouvez passer **throttleTime(1000)** comme opérateur.

- **scan()** et **reduce()** : permettent d'exécuter une fonction qui réunit l'ensemble des valeurs reçues selon
  une fonction que vous lui passez — par exemple, vous pouvez faire la somme de toutes les valeurs reçues.
  La différence basique entre les deux opérateurs : **reduce()** vous retourne uniquement la valeur finale,
  alors que **scan()** retourne chaque étape du calcul.

Ce chapitre n'est qu'une introduction au monde des Observables RxJS pour vous présenter les éléments qui
peuvent vous être utiles très rapidement et ceux qui sont intégrés dans certains services Angular.
Pour en savoir plus, n'hésitez pas à consulter la documentation sur le site 
[ReactiveX](http://reactivex.io/documentation/observable.html).
