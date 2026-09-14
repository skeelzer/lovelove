# Calendrier de l'avant (local)

Ce projet est 100% local pour l'instant.

## Structure

- 15 cases: J, J-1, ..., J-14
- Date cible: 28 septembre 2026
- Une case est ouvrable seulement si sa date est atteinte
- Affichage du contenu dans une popup

## Fichiers

- index.html: structure de la page
- style.css: style romantique/mignon + responsive
- script.js: logique des cases, dates, popup, verrous
- assets/images: images a ajouter plus tard
- assets/games: mini-jeux a ajouter plus tard

## Ajouter du contenu plus tard

Dans script.js, chaque case est creee avec:

- contentType: "placeholder" | "image" | "game"
- text: texte de la case
- imagePath: chemin local de l'image (si contentType = image)
- gameHtml: HTML du mini-jeu (si contentType = game)

On le fera ensemble case par case.
