# Message prêt à envoyer — **LIEN PERMANENT** ✅

Copiez-collez ce message dans WhatsApp/SMS/mail :

---

🌿 **L'Herbier Médicinal** — 140 plantes, 60 associations en recettes complètes,
un assistant santé, une carte des synergies et un **quizz** de 26 questions.
Gratuit, sans publicité, fonctionne sans internet.

**📱 Pour installer l'application (iPhone ou Android) :**

1️⃣ Ouvre ce lien dans **Safari** (iPhone) ou **Chrome** (Android) :

# https://neo690.github.io/

2️⃣ **Sur iPhone** : touche le bouton **Partager** (le carré avec la flèche, en bas
de l'écran), fais défiler et choisis **« Sur l'écran d'accueil »**, puis **Ajouter**.

**Sur Android** : touche les trois points ⋮ en haut à droite, puis
**« Installer l'application »** ou **« Ajouter à l'écran d'accueil »**.

3️⃣ Une icône verte 🌿 apparaît sur ton téléphone. L'application s'ouvre en plein
écran et **fonctionne même sans internet** ✔️

---

## Pourquoi ce lien est fiable

- **Hébergé sur GitHub Pages** (domaine `neo690.github.io`, HTTPS automatique) :
  le lien est **permanent**, il ne dépend ni du PC ni d'un tunnel.
  Netlify a été abandonné le 2026-10-02 (quota de compte dépassé, site refusé).
- Le service worker `herbier-v12` précache tout (shell, données, 22 polices,
  cartes, `quizz.js`) ; les planches se mettent en cache à la première visite.
- Mises à jour : `npm run www && node build-pages.mjs` (build + `git push --force`
  sur `Neo690/Neo690.github.io`). Les téléphones installés reçoivent la nouveauté
  au **prochain lancement** — l'ancien lien reste valable.
- Page d'installation (QR code, screenshots, série TikTok) :
  **https://neo690.github.io/accueil-install.html**

## Version 1.1 (2026-10-08) — mise à jour

- 💼 **Nouvel onglet « Dossier business »** : les 8 documents du projet d'herboristerie
  (guide des 148 plantes, tableau croisé fournisseurs, certificats bio vérifiés,
  comparatif de prix avec COGS mesuré 27,75 €/kg, business plan à jour,
  gamme de tisanes, pitch deck, note Algérie) — 100 % hors-ligne, tableaux optimisés
  pour petit écran, thème clair/sombre synchronisé.
- 🧠 Onglet **Quizz** : 10 questions tirées au sort parmi 26 sur les
  « formes d'organes » (carotte/œil, noix/cerveau, haricots rouges/reins…), avec
  pour chaque réponse la correction scientifique. Score enregistré sur l'appareil.
- 🔒 Signature Android vérifiée (schéma v2, `CN=Herbier Medicinal`, clé valable jusqu'en 2054).

## Android : APK signé

| Fichier | Taille | Usage |
| --- | --- | --- |
| `herbier-medicinal-release.aab` | 38,8 Mo | soumission Play Store — `versionCode 2`, `versionName 1.1` |
| `herbier-medicinal-debug.apk` | 40,3 Mo | test uniquement (non destiné à la diffusion) |

> ⚠️ La build signée APK de diffusion n'a pas été reconstruite dans ce cycle — seul
> l'AAB (Play Store) et l'APK debug (test) sont à jour du 8 oct. Pour installer sur un
> téléphone **sans le Play Store**, utiliser l'installation PWA ci-dessus (méthode
> recommandée, mise à jour automatique) ; l'APK release sera reconstruite à la
> prochaine passe de diffusion.

L'APK/AAB ne sont pas hébergés sur le site (≈ 40 Mo de plus à chaque déploiement) : ils
restent à la racine du projet et se transmettent par AirDrop / clé USB / lien de Drive.

## Historique des liens

| Lien | Statut |
| --- | --- |
| `https://neo690.github.io/` | ✅ **permanent — à utiliser depuis le 2026-10-02** |
| `https://neo690.github.io/herbier-legal/` | pages légales (politique, conditions, démo TikTok) |
| `https://heroic-buttercream-c9f175.netlify.app` | ❌ mort (quota Netlify dépassé) — lien encore présent dans d'anciens scripts TikTok publiés |
| `https://perfume-erp-incoming-neighbors.trycloudflare.com` | tunnel local (expirera à l'arrêt du PC) |
