# web component

un web component est un partie js qui peut fonctionner en autonomie dans une appli

## Angular et les Composants Web

Section 2, session 13

## C'est quoi, les Web Components ?

Les Web Components désignent un standard qui permet aux développeurs de créer des sections complétement autonomes au sein de leurs pages web. On peut par exemple créer un composant web qui gère l'affichage d'articles dans notre application: ce composant web fonctionnera indépendamment du reste de la page, il possèdera son propre code HTML, son propre code CSS et son propre code JavaScript, encapsulé dans le composant web. Il faudra ensuite insérer ce composant web dans la page principale de notre application pour indiquer que, à tel endroit, nous voulons afficher des articles grâce à ce composant web.

On peut voir les Web Components comme des widgets réutilisables.

## Angular et les Web Components

Les Web Components utilisent des capacités standards, nouvelles ou en cours de développements, des navigateurs. Il s'agit de technologies récentes qui ne sont pas encore supportées par tous les navigateurs. Pour les utiliser dès aujourd'hui, nous devrons utiliser des polyfills pour combler les lacunes de couverture des navigateurs.

Un polyfill est un ensemble de fonction, souvent sous forme de scripts JavaScript, permettant de simuler sur un navigateur web ancien des fonctionnalités qui ne sont pas nativement disponibles.

Les Web Components sont composés de quatre technologies différentes, qui peuvent chacune être utilisées séparément, mais qui une fois assemblées forme le standard des Web Components :

Les éléments personnalisés (Custom Elements) permettent de créer ses propres éléments HTML valides.
Le DOM de l'ombre (Shadow DOM) permet d'encapsuler du code HTML, CSS et JavaScript qui n'interfère pas avec le DOM principal de la page web.
Les templates HTML (HTML Templates) permettent de développer des morceaux de code HTML qui ne sont pas interprétés au chargement de la page.
Les imports HTML (HTML Imports) permettent d'importer du HTML dans une autre page HTML.
Pour ceux qui ne s'en souviennent plus, le DOM est une représentation de votre code HTML sous forme d'arbre. Ainsi un élément ``<ul>``  a des éléments fils ``<li> ``. L'élément racine du DOM est donc la balise ``<html>`` .

