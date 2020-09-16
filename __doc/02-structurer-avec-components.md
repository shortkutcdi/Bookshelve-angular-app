# Structurer avec les components

[Angular - Structurer avec les components](https://openclassrooms.com/fr/courses/4668271-developpez-des-applications-web-avec-angular/5087065-structurez-avec-les-components)

## Préparer le projet

    $ ng new mon-projet-angular --style=scss --skip-tests=true


Le premier flag (élément de la commande suivant un double tiret --) crée des fichiers  .scss  
pour les styles plutôt que des fichiers  .css .  
Le second flag annule la création des fichiers test

## installer bootstrap via npm

se placer dans le projet

    $ npm install bootstrap@3.3.7 --save

Cette commande téléchargera Bootstrap et l'intégrera dans le  ``package.json``  du projet (--save).  

Configuration bootstrap :

Il vous reste une dernière étape pour l'intégrer à votre projet.  Ouvrez le fichier  `angular.json`  (ou .angular-cli.json)
du dossier source de votre projet.  
Dans "apps", modifiez l'array  styles  comme suit :

    "styles": [
              "node_modules/bootstrap/dist/css/bootstrap.css"
              "src/styles.scss",
            ]

Maintenant vous pouvez lancer le serveur de développement local
(il faudra le couper avec Ctrl-C et le relancer s'il tournait déjà pour que les changements prennent effet)

   $ ng serve

## La structure des components d'une application Angular

Les components sont les composantes de base d'une application Angular : une application est une arborescence
de plusieurs components.

Tout d'abord, notre  AppComponent  est notre component principal : tous les autres components de
notre application seront emboîtés ou "nested" dans celui-ci.

## structure du code

index.html

````html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>MonProjetAngular</title>
    <base href="/">

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
    <app-root></app-root>  <!-- component angular-->
</body>
</html>
````

 Comme vous pouvez le constater, au lieu d'y voir tout le contenu que nous voyons dans le navigateur,
 il n'y a que cette balise vide  `<app-root>`  : il s'agit d'une balise Angular.

Le dossier qui vous intéressera principalement est le dossier  **src** , où vous trouverez tous les fichiers sources
pour votre application.

    src/ app/
          app.component.html
          app.component.scss
          app.component.ts
          app.module.ts

Ce dossier contient le module principal de l'application et les trois fichiers du component principal  **AppComponent**  :
son template en HTML, sa feuille de styles en SCSS, et son fichier TypeScript, qui contiendra sa logique.  

app.component.ts  :

````typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}
````

Ici, à l'intérieur du décorateur  @Component()  , vous trouvez un objet qui contient les éléments suivants :

- ``selector``  : il s'agit du nom qu'on utilisera comme balise HTML pour afficher ce component, comme vous l'avez vu :

    avec  ``<app-root>``  . Ce nom doit être unique et ne doit pas être un nom réservé HTML de type  
    ``<div>``  ,  ``<body>``  etc. On utilisera donc très souvent un préfixe comme  app  , par exemple ;

- ``templateUrl``  : le chemin vers le code HTML à injecter ;

- ``styleUrls``  : un array contenant un ou plusieurs chemins vers les feuilles de styles qui concernent ce component ;

Quand Angular rencontre la balise  ``<app-root>``  dans le document HTML, il sait qu'il doit en remplacer le contenu par celui du template ``app.component.html`` , en appliquant les styles  app.component.scss , le tout géré par la
logique du fichier  app.component.ts .

Pour faire un premier test, je vous propose de modifier la variable  title  dans  app.component.ts ,
d'enregistrer le fichier, et de regarder le résultat dans votre navigateur.

````typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',             /* Nom de la balise HTML */
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my awesome app';
}
````

## Créer un component avec angualr-cli

    ng generate component mon-premier

    CREATE src/app/mon-premier/mon-premier.component.html (30 bytes)
    CREATE src/app/mon-premier/mon-premier.component.ts (289 bytes)
    CREATE src/app/mon-premier/mon-premier.component.scss (0 bytes)
    UPDATE src/app/app.module.ts (414 bytes)

 CLI a créé un nouveau sous-dossier  mon-premier  et y a créé un fichier template, une feuille de styles, un fichier component et un fichier spec : il s'agit d'un fichier de test que vous pouvez supprimer, car vous ne vous en servirez pas dans le cadre de ce cours.

 CLI nous prévient également qu'il a mis à jour le fichier ``app.module.ts `` :
 ouvrez-le maintenant pour voir de quoi il s'agit

````typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MonPremierComponent } from './mon-premier/mon-premier.component'; /*  rajout  */

@NgModule({
  declarations: [
    AppComponent,
    MonPremierComponent  /*  rajout  */
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

CLI a ajouté  **MonPremierComponent**  à l'array  **declarations**  de votre module.  Il a également ajouté
le statement import en haut du fichier.  Ce sont des étapes nécessaires pour que vous puissiez utiliser
votre component au sein de votre application Angular.

Regardez maintenant le fichier  **mon-premier.component.ts**  :

````typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mon-premier',             /* Nom de la balise HTML */
  templateUrl: './mon-premier.component.html',
  styleUrls: ['./mon-premier.component.scss']
})
export class MonPremierComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
````

Vous constaterez que le CLI a créé un sélecteur :  app-mon-premier . Nous pouvons donc utiliser
ce sélecteur dans notre code pour y insérer ce component.

Revenez dans  app.component.html  et modifiez-le comme suit :

````html
<div style="text-align:center">
  <h1>
    Welcome to {{ title }}!
  </h1>
</div>
<app-mon-premier></app-mon-premier> <!--appel du module mon-premier-->
````

Dans votre navigateur, vous verrez le même titre qu'avant et, sur une deuxième ligne, le texte "mon-premier works".
Il s'agit du texte par défaut créé par le CLI que vous trouverez dans  mon-premier.component.html  :

``mon-premier.html`` :

    <p>
      mon-premier works!
    </p>
