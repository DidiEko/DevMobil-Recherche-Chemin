# DevMobil — Recherche de chemin

Projet réalisé dans le cadre du cours DevMobil à la HEIG-VD.

L’application génère un terrain avec un automate cellulaire.
Un cercle rejoint une destination choisie au clic ou au toucher,
en contournant les murs.

## Lancer le projet

1. Ouvrir le dossier dans VS Code.
2. Activer l’extension Live Server.
3. Faire un clic droit sur index.html puis « Open with Live Server ».

Aucune installation de dépendances npm n’est nécessaire.
Les bibliothèques utilisées sont incluses dans le projet.

## Utilisation

- Cliquer ou toucher une case libre pour choisir une destination.
- Le cercle suit automatiquement le chemin calculé.
- Une destination inaccessible est signalée en rouge.
- Les nouvelles destinations sont ignorées pendant le déplacement.
- Le bouton « Nouveau terrain » régénère le terrain et replace le cercle.
- Ce bouton est désactivé pendant un trajet.

## Organisation du code

| Fichier | Rôle |
| --- | --- |
| index.js | Initialisation et coordination de l’application |
| class/Automaton.js | Grille, génération du terrain et dessin des cellules |
| class/AutomatonWithPathfinding.js | Voisins accessibles et recherche de chemin BFS |
| class/Circle.js | Propriétés et dessin du cercle |
| class/Vector2D.js | Calculs sur les vecteurs et interpolation lerp |
| class/Tweens.js | Gestion des interpolations dans le temps |
| class/PathFollower.js | Animation du cercle le long du chemin |
| class/SceneRenderer.js | Dessin de la scène et de la destination |
| class/PointerController.js | Gestion du clic et du toucher |
| lib/mainloop.min.js | Boucle de simulation et de rendu |
| style.css | Mise en page et apparence |

## Génération du terrain

- Grille de 20 lignes et 30 colonnes.
- Taille des cellules adaptée à l’espace disponible.
- Règle de l’automate : B678/S345678.
- Probabilité initiale de cellule libre : 0.65.
- Huit générations avant l’affichage du terrain.
- 1 représente une case libre ; 0 représente un mur.
- Le terrain reste fixe pendant les déplacements.

Le paramètre 0.65 a été choisi pour obtenir davantage d’espaces ouverts.
Certaines zones peuvent néanmoins rester isolées.

## Recherche de chemin

Le parcours en largeur (BFS) part de la destination.
Il construit une flowMap qui indique, pour chaque case accessible,
la prochaine case à rejoindre.

Les déplacements utilisent les huit directions.
Une diagonale est autorisée uniquement si les deux cases
qui bordent ce déplacement sont libres.

Le cercle ne peut pas passer d’un bord à l’autre de la grille.
Le BFS minimise le nombre de pas, pas nécessairement la distance
géométrique, car une diagonale compte comme un pas.

## Animation

MainLoop.js met à jour les tweens et déclenche le dessin.

Chaque segment utilise une tween de 0 à 1 et Vector2D.lerp.
Sa durée dépend de sa distance et de la vitesse du cercle.

Une seule tween de déplacement est active à la fois.
L’animation est mise en pause lorsque l’onglet est masqué.

Si la fenêtre change de taille pendant un trajet, les dimensions
internes du canvas sont ajustées à l’arrivée.

## Personnalisation

Ajout d’un bouton « Nouveau terrain » permettant de générer
un autre terrain sans recharger la page.

## Sources et assistance

- Consignes du projet « Projet 1 — Recherche de chemin ».
- Supports et exemples du cours de Nicolas Chabloz.
- Classes Vector2D et Tweens issues des ressources du cours.
- Ajout de la méthode lerp à Vector2D.
- Adaptation de la boucle de mise à jour de Tweens pour différer
  le traitement des nouvelles tweens à la mise à jour suivante.
- MainLoop.js d’Isaac Sukin, sous licence MIT.
- Assistance de ChatGPT pour la construction progressive du projet,
  l’organisation du code et la correction d’erreurs.