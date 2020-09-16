# Interagissez avec un serveur avec HttpClient

Dans une application Angular, vous aurez très souvent besoin de faire des appels à un
backend ou à un autre serveur — pour enregistrer ou charger des données, par exemple,
ou pour effectuer des calculs ou des modifications de données que vous ne souhaitez pas
faire faire par le frontend.  Angular met à disposition un service appelé __HttpClient__
qui permet de créer et d'exécuter des appels HTTP (fait par AJAX - Asynchronous JavaScript
and XML) et de réagir aux informations retournées par le serveur.

Dans ce chapitre, vous allez configurer un backend avec le service Firebase de Google.
Ce service permet la création d'un backend complet sans coder, et node comprend énormément
de services, dont l'authentification, une base de données NoSQL et un stockage de fichiers.
Dans un chapitre ultérieur, vous apprendrez à utiliser les fonctions mises à disposition par
Firebase afin de mieux intégrer le service. Pour ce chapitre, vous allez simplement utiliser
l'API HTTP afin de comprendre l'utilisation de __HttpClient__.

Préparez le backend
Allez à [firebase.com](https://firebase.google.com/), créez un compte Google ou authentifiez-vous si
vous en avez déjà un, et créez un nouveau projet Firebase.  Vous pouvez le domicilier dans votre pays
de résidence et lui donner le nom que vous voulez.

Une fois arrivé sur la console, allez dans Database et choisissez le Realtime Database.  Afin
d'éviter tout problème d'authentification pour l'instant, allez dans la section "Règles" et
définissez __read__ et __write__ en __true__, puis publiez les règles modifiées :

    {
      "rules": {
        ".read": "true",
        ".write": "true"
      }
    }

Revenez à la section Données et notez l'URL de votre base de données, vous allez en avoir besoin
pour configurer les appels HTTP :

    https://httpclient-demo-firebaseio.com/

    httpclient-demo: null

Le backend est maintenant prêt, et vous allez pouvoir intégrer __HttpClient__ à votre application des
appareils électriques.

## Envoyez vers le backend

Pour avoir accès au service __HttpClient__, il faut tout d'abord ajouter __HttpClientModule__, importé depuis
__@angular/common/http__, à votre __AppModule__ :  

````typescript
imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
],
````

Vous allez utiliser __HttpClient__, dans un premier temps, pour la gestion des données de la liste d'appareils.
Vous allez donc l'injecter dans __AppareilService__, en y ayant auparavant ajouté le décorateur __@Injectable()__
(importé depuis __@angular/core__) :

````typescript
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppareilService {

  appareilsSubject = new Subject<any[]>();

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
  
  constructor(private httpClient: HttpClient) { }
````

Si votre service n'avait pas encore de constructeur, créez-le pour injecter __HttpClient__.

Vous allez d'abord créer une méthode qui va enregistrer l'array __appareils__ dans la base de données au
endpoint __/appareils__ par la méthode POST :

````typescript
saveAppareilsToServer() {
    this.httpClient
      .post('https://httpclient-demo.firebaseio.com/appareils.json', this.appareils)
      .subscribe(
        () => {
          console.log('Enregistrement terminé !');
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
}
````

Analysez cette méthode :

- la méthode __post()__, qui permet de lancer un appel POST, prend comme premier argument l'URL visée,
  et comme deuxième argument le corps de l'appel, c'est-à-dire ce qu'il faut envoyer à l'URL ;

- l'extension __.json__ de l'URL est une spécificité Firebase, pour lui dire que vous lui envoyez des
  données au format JSON ;

- la méthode __post()__  retourne un Observable — elle ne fait pas d'appel à elle toute seule.  C'est en y
  souscrivant que l'appel est lancé ;

- dans la méthode __subscribe()__, vous prévoyez le cas où tout fonctionne et le cas où le serveur vous
  renverrait une erreur.

Créez maintenant un bouton dans __AppareilViewComponent__ qui déclenche cette sauvegarde (en passant, si
vous ne l'avez pas encore fait, vous pouvez retirer l'activation conditionnelle des boutons "Tout allumer"
et "Tout éteindre") :

````html
<button class="btn btn-success"
        (click)="onAllumer()">Tout allumer</button>
<button class="btn btn-danger"
        (click)="onEteindre()">Tout éteindre</button>
<button class="btn btn-primary"
        (click)="onSave()">Enregistrer les appareils</button>
````

````typescript
onSave() {
    this.appareilService.saveAppareilsToServer();
}
````

Enregistrez le tout, et cliquez sur le bouton que vous venez de créer : vous devez avoir votre message de
réussite qui apparait dans la console.  Si vous regardez maintenant la console Firebase :

    httpclient-demo
    |
    +---- appareils
          |
          +---- -KwkuPwrflSl8RgUrmD
                  |
                  +---- 0
                  |     |---- id: 1
                  |     |---- name: "Machine à laver"
                  |     L---- status: "éteint"
                  |
                  +---- 1
                  |     |---- id: 2
                  |     |---- name: "Frigo"
                  |     L---- status: "allumé"
                  |
                  +---- 2
                        |---- id: 3
                        |---- name: "Ordinateur"
                        |---- status: "éteint"

Firebase a créé un nouveau node sous __appareils__ avec un identifiant unique, et y a enregistré
votre array __appareils__.

Cependant, si vous cliquez plusieurs fois sur ce bouton, Firebase continuera à créer de nouveaux nodes, et
dans ce cas de figure, ce n'est pas le comportement souhaité. Il faudrait que chaque enregistrement écrase
le précédent : pour cela, utilisez plutôt la méthode  put()  (il n'y a pas besoin de changer les arguments,
car les méthodes __put()__ et __post()__ prennent les deux mêmes premiers arguments) :

````typescript
saveAppareilsToServer() {
    this.httpClient
      .put('https://httpclient-demo.firebaseio.com/appareils.json', this.appareils)
      .subscribe(
        () => {
          console.log('Enregistrement terminé !');
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
}
````

Maintenant, quand vous enregistrez les données, votre console Firebase montre le node suivant :

    httpclient-demo
    |
    L---- appareils
          |
          +---- 0
          +---- 1
          +---- 2

Ainsi, vous savez envoyer des données vers un serveur avec les méthodes POST et PUT.  Pour la suite, vous
allez intégrer la requête GET pour récupérer et traiter des données depuis le serveur.

## Recevez depuis le backend

Afin de demander la liste des appareils (maintenant stocké au endpoint __/appareils__), vous allez créer
une nouvelle méthode qui emploie la méthode __get()__ dans __AppareilService__ :

````typescript
getAppareilsFromServer() {
    this.httpClient
      .get<any[]>('https://httpclient-demo.firebaseio.com/appareils.json')
      .subscribe(
        (response) => {
          this.appareils = response;
          this.emitAppareilSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
}
````

Comme pour __post()__ et __put()__, la méthode get() retourne un Observable, mais puisqu'ici, vous allez
recevoir des données, TypeScript a besoin de savoir de quel type elles seront (l'objet retourné est
d'office considéré comme étant un Object).  Vous devez donc, dans ce cas précis, ajouter __<any[]>__
pour dire que vous allez recevoir un array de type  any , et que donc TypeScript peut traiter cet
objet comme un array : si vous ne le faites pas, TypeScript vous dira qu'un array ne peut pas être
redéfini comme Object.

Vous pouvez maintenant vider l'array __appareils__ du service et intégrer un bouton au component
permettant de déclencher la méthode __getAppareilsFromServer()__ :

````html
<button class="btn btn-success"
        (click)="onAllumer()">Tout allumer</button>
<button class="btn btn-danger"
        (click)="onEteindre()">Tout éteindre</button>
<button class="btn btn-primary"
        (click)="onSave()">Enregistrer les appareils</button>
<button class="btn btn-primary"
        (click)="onFetch()">Récupérer les appareils</button>
````

````typescript
onFetch() {
    this.appareilService.getAppareilsFromServer();
}
````

Maintenant, vous pouvez ajouter de nouveaux appareils, en modifier l'état et les sauvegarder,
puis récupérer la liste sauvegardée.

Il serait également possible de rendre automatique le chargement et l'enregistrement des appareils
(par exemple en appelant la méthode __getAppareilsFromServer()__ dans __ngOnInit()__, et __saveAppareilsToServer()__
après chaque modification), mais j'ai souhaité vous laisser la possibilité de les exécuter manuellement afin
de voir le résultat de manière plus concrète.

Dans ce chapitre, vous avez appris à passer des appels à un serveur HTTP avec le service __HttpClient__.
Vous avez utilisé un backend Firebase pour cette démonstration : en effet, Firebase propose une API
beaucoup plus flexible que des appels HTTP simples afin de profiter pleinement des services proposés.
Dans les prochains chapitres de ce cours, vous allez apprendre à intégrer certains des services Firebase
dans votre application.