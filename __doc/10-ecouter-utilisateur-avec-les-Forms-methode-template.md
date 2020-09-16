# Ecouter l'utilisateur avec les Forms : méthode template

Jusqu'ici, dans ce cours, vous avez appris à créer une application dynamique qui permet d'échanger
des informations entre components à l'aide des services et des Observables, qui change l'affichage
selon le routing et qui réagit à certains événements provenant de l'utilisateur, comme des clics sur
un bouton, par exemple.  Cependant, pour l'instant, toutes les données que vous avez utilisées ont
été codées "en dur" dans l'application, c'est-à-dire fournies ni par l'utilisateur, ni par un serveur.
Dans les chapitres suivants, vous allez apprendre à interagir avec l'utilisateur et avec les serveurs
afin de créer une application totalement dynamique.

En Angular, il y a deux grandes méthodes pour créer des formulaires :

- la méthode __template__ : vous créez votre formulaire dans le template, et Angular l'analyse pour comprendre
  les différents inputs et pour en mettre à disposition le contenu ;

- la méthode __réactive__ : vous créez votre formulaire en TypeScript et dans le template, puis vous en faites
  la liaison manuellement — cette approche est plus complexe, mais elle permet beaucoup plus de contrôle et
  une approche dynamique.

    N'oubliez pas d'importer FormsModule dans AppModule si ce n'est pas déjà fait !

Dans la suite de ce chapitre nous allons découvrir la méthode template.

## Créez le formulaire

Pour comprendre et pratiquer cette méthode, vous allez créer un nouveau component __EditAppareilComponent__
qui permettra à l'utilisateur d'enregistrer un nouvel appareil électrique :

````html
<div class="row">
  <div class="col-sm-8 col-sm-offset-2">
    <form>
      <div class="form-group">
        <label for="name">
          Nom de l'appareil
        </label>
        <input type="text" id="name" class="form-control">
      </div>
      <div class="form-group">
        <label for="status">
          État de l'appareil
        </label>
        <select id="status" class="form-control">
          <option value="allumé">Allumé</option>
          <option value="éteint">Éteint</option>
        </select>
      </div>
      <button class="btn btn-primary">Enregistrer</button>
    </form>
  </div>
</div>
````

Angular parcourt votre template et trouve la balise ``<form>``, créant ainsi un objet qui sera utilisable
depuis votre code TypeScript.  Avant de passer à la soumission du formulaire, il faut signaler à Angular
quels inputs correspondront à des __controls__, c'est-à-dire des champs dont le contenu est à soumettre.
Pour cela, il suffit d'ajouter deux attributs aux inputs en question : un attribut name, qui correspondra
à la clef de la paire clef-valeur qui sera rendu, et l'attribut __ngModel__, sans parenthèses ni crochets.
Ce deuxième attribut signale à Angular que vous souhaitez enregistrer ce contrôle :

````html
<div class="form-group">
    <label for="name">
      Nom de l'appareil
    </label>
    <input type="text" id="name" class="form-control" name="name" ngModel>
</div>
<div class="form-group">
    <label for="status">
      État de l'appareil
    </label>
    <select id="status" class="form-control" name="status" ngModel>
      <option value="allumé">Allumé</option>
      <option value="éteint">Éteint</option>
    </select>
</div>
````

Il faut maintenant préparer la gestion de la soumission de ce formulaire. Dans votre template,
au lieu d'ajouter un événement sur le bouton, vous allez déclarer le bouton de type __submit__, et
ajouter le code suivant dans la balise ``<form>`` :

````html
<form (ngSubmit)="onSubmit(f)" #f="ngForm">
````

````html
<button class="btn btn-primary" type="submit">Enregistrer</button>
````

Déclarer le bouton de type submit à l'intérieur du ``<form>`` déclenche le comportement de soumission
classique de HTML.  En ajoutant l'attribut __(ngSubmit)__, vous recevez cette soumission et exécutez
la méthode __onSubmit()__ (que vous n'avez pas encore créée).

L'attribut __#f__ est ce qu'on appelle une référence locale.  Vous donnez simplement un nom à l'objet
sur lequel vous ajoutez cet attribut ; ce nom sera ensuite utilisable par Angular.  C'est d'ailleurs
le cas ici : on appelle le formulaire __f__ pour ensuite le passer comme argument à la méthode de soumission.

**Remarque** :

De manière générale, on ne donne pas de valeur à une référence locale : on écrit simplement __#f__ ou
__#my-name__. Dans ce cas précis d'un formulaire en méthode template, on y attribue la valeur __ngForm__
pour avoir accès à l'objet créé par Angular.

Pour récapituler : quand l'utilisateur clique sur le bouton de type submit, la méthode que vous attribuez à
__(ngSubmit)__ est exécutée, et grâce à la référence locale  ``#f="ngForm"``, vous pouvez passer l'objet à la méthode
(et donc la récupérer dans votre code TypeScript).

Créez maintenant la méthode __onSubmit()__ afin de recevoir les informations venant du formulaire.  Pour l'instant,
vous allez simplement les afficher dans la console :

````typescript
onSubmit(form: NgForm) {
    console.log(form.value);
}
````

Ici vous utilisez la propriété __value__ du __NgForm__. L'objet __NgForm__ (à importer depuis ``@angular/forms``)
comporte beaucoup de propriétés très intéressantes ; je n'en expliquerai que certaines dans ce cours, mais
vous pouvez en trouver la liste complète dans la [documentation officielle](https://angular.io/guide/forms).

Pour avoir accès au formulaire, créez une nouvelle route dans __AppModule__ et un __routerLink__ correspondant
dans la barre de menu :

````typescript
const appRoutes: Routes = [
  { path: 'appareils', canActivate: [AuthGuard], component: AppareilViewComponent },
  { path: 'appareils/:id', canActivate: [AuthGuard], component: SingleAppareilComponent },
  { path: 'edit', canActivate: [AuthGuard], component: EditAppareilComponent },
  { path: 'auth', component: AuthComponent },
  { path: '', component: AppareilViewComponent },
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: 'not-found' }
];
````

````html
<ul class="nav navbar-nav">
    <li routerLinkActive="active"><a routerLink="auth">Authentification</a></li>
    <li routerLinkActive="active"><a routerLink="appareils">Appareils</a></li>
    <li routerLinkActive="active"><a routerLink="edit">Nouvel appareil</a></li>
</ul>
````

Naviguez vers cette nouvelle page.  Si vous tapez "Télévision" comme nom et choisissez "Éteint" et
vous cliquez sur "Enregistrer", dans la console vous avez :

    edit-appareil.component.ts:17
    ▶ {name: "Télévision", status: "éteint"}

Ça y est, vous avez accès aux informations du formulaire !  Avant de les traiter et d'en créer un nouvel
appareil, vous allez d'abord ajouter une validation du formulaire, afin que l'utilisateur ne puisse pas
le soumettre sans rentrer des données valables.

## Validez les données

Pour le formulaire de cette application, on peut dire que le nom de l'appareil est un champ obligatoire.
Pour ajouter cette obligation, ajoutez simplement la directive suivante :

````html
<input type="text" id="name" class="form-control" name="name" ngModel required>
````

Cet attribut ressemble à un attribut HTML5 classique, mais sachez qu'Angular désactive par défaut le
comportement de validation HTML5.

Le champ est obligatoire, mais le formulaire peut encore être soumis, car vous n'avez pas encore intégré
l'état de validation du formulaire.  Pour accomplir cela, vous allez lier la propriété __disabled__ du bouton
à la propriété __invalid__ du formulaire, qui est mise à disposition par Angular :

````html
<button class="btn btn-primary" type="submit" [disabled]="f.invalid">Enregistrer</button>
````

Vous employez la référence locale __f__ pour avoir accès à l'objet __NgForm__, et donc à sa propriété __invalid__,
désactivant le bouton si elle retourne __true__.

Il serait intéressant de déclarer l'appareil éteint par défaut afin de ne pas laisser ce champ vide.
Pour déclarer une réponse par défaut, vous allez créer une variable TypeScript et la lier à la propriété
__ngModel__ du contrôle :

````typescript
export class EditAppareilComponent implements OnInit {

  defaultOnOff = 'éteint';

  constructor() { }
````

````html
<select id="status" class="form-control" name="status" [ngModel]="defaultOnOff">
      <option value="allumé">Allumé</option>
      <option value="éteint">Éteint</option>
</select>
````

Ainsi, le formulaire ne pourra être soumis que si le champ "Nom de l'appareil" n'est pas vide, et l'option
choisie par défaut empêche le deuxième champ d'être vide également.

Il ne reste plus qu'à exploiter ces données et en créer un nouvel appareil !

## Exploitez les données

Dans la méthode __onSubmit()__, vous allez récupérer les données et les attribuer à deux constantes pour
les envoyer à __AppareilService__ :

````typescript
onSubmit(form: NgForm) {
    const name = form.value['name'];
    const status = form.value['status'];
}
````

Puisque vous savez que le formulaire comportera forcément un champ __name__ et un champ __status__, vous savez
que vous pouvez utiliser cette syntaxe sans problème.

Créez maintenant la méthode dans __AppareilService__ qui générera le nouvel appareil :

````typescript
addAppareil(name: string, status: string) {
    const appareilObject = {
      id: 0,
      name: '',
      status: ''
    };
    appareilObject.name = name;
    appareilObject.status = status;
    appareilObject.id = this.appareils[(this.appareils.length - 1)].id + 1;
    this.appareils.push(appareilObject);
    this.emitAppareilSubject();
}
````

Cette méthode crée un objet du bon format, et attribue le nom et le statut qui lui sont passés comme arguments.
La ligne pour l'id prend l'id du dernier élément actuel de l'array et ajoute 1.  Ensuite, l'objet complété est
ajouté à l'array et le Subject est déclenché pour tout garder à jour.

Il ne reste plus qu'à intégrer cette fonction dans __EditAppareilComponent__.  Il serait intéressant qu'une fois
l'appareil créé, l'utilisateur soit redirigé vers la liste des appareils.  N'oubliez pas d'importer et d'injecter
le router pour cela, ainsi qu' __AppareilService__ :

````typescript
export class EditAppareilComponent implements OnInit {

  defaultOnOff = 'éteint';

  constructor(private appareilService: AppareilService,
              private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const name = form.value['name'];
    const status = form.value['status'];
    this.appareilService.addAppareil(name, status);
    this.router.navigate(['/appareils']);
  }

}
````

Et voilà !  Maintenant, grâce à un formulaire simple géré par la méthode template, l'utilisateur peut créer un
nouvel appareil pour la liste.