# 🌱 Jardin du Coin — CRM & Services Paysagers Rive-Sud

> **Système CRM moderne, bilingue et mobile-first spécialement conçu pour simplifier la vie des entrepreneurs paysagistes desservant la Rive-Sud de Montréal.**

---

## 🌟 Points Clés & Fonctionnalités

### 🚜 1. Mode Terrain & Feuille de Route Quotidienne (Field Mode)
* **Conçu pour le camion / mobile** : Interface ultra-rapide et lisible même en plein soleil sur le terrain.
* **Itinéraire GPS en 1 clic** : Ouvre directement Google Maps avec l'adresse exacte et la ville de la Rive-Sud.
* **Informations de sécurité essentielles** :
  * Codes de barrière & accès arrière (*ex: 4829# ou loquet haut*).
  * Avertissements de chiens sur la propriété avec notes spécifiques.
  * Superficie du terrain en pi².
* **Appel & SMS direct** : Boutons instantanés pour joindre le client sans chercher dans ses contacts.
* **Validation de travail en 1 tape** : Animation et confirmation instantanée lorsque le chantier est terminé.

### 👥 2. Répertoire Clients & Propriétés Rive-Sud
* Gestion complète des propriétaires et fiches d'adresses classées par ville :
  * **Longueuil**, **Brossard**, **Boucherville**, **Saint-Lambert**, **Candiac**, **La Prairie**, **Saint-Bruno**, **Saint-Hubert**, **Greenfield Park**, **Varennes**, **Sainte-Julie**.
* Historique consolidé par client : nombre de visites effectuées, devis envoyés et factures en attente/payées.

### 📄 3. Devis & Estimations Professionnelles (Quotes)
* Générateur de soumissions avec catalogue de services paysagers intégrés :
  * Tonte de pelouse régulière, taillage de haies de cèdres, grand ménage de printemps, fermeture de terrain/ramassage de feuilles, aération & terreautage, pose de paillis, pavé uni, etc.
* **Calcul automatique des taxes du Québec** :
  * TPS (5.000%)
  * TVQ (9.975%)
* **Conversion en Facture en 1 clic** dès que le client accepte le devis.
* **Impression & Export PDF officiel** avec conditions de paiement et coordonnées complètes.

### 💳 4. Facturation & Encaissements Interac (Invoices)
* Suivi des factures en temps réel : **Émise**, **Payée**, **En retard** (*Overdue*).
* **Enregistrement rapide des paiements** :
  * Virement Interac (avec numéro de référence), Comptant / Cash, Chèque, Carte de crédit.
  * Célébration visuelle lors de l'encaissement.
* Impression de factures et reçus professionnels prêts à envoyer aux clients.
* Bloc d'instructions de virement Interac personnalisable (courriel, question et réponse secrète).

### 🌐 5. Bilinguisme Intégral (Français / English)
* Basculement instantané **FR / EN** en un seul clic dans l'en-tête.
* Termes adaptés au marché québécois et aux opérations paysagères locales.

### 🔒 6. Sauvegarde & Fiabilité Absolue
* Persistance automatique sur votre appareil (fonctionne même sans connexion internet ou serveur distant).
* **Exportation JSON complète en 1 clic** pour conserver des copies de sauvegarde sur votre ordinateur ou clé USB.
* **Restauration JSON en 1 clic** en cas de changement d'appareil.

---

## 🚀 Démarrage Rapide

### Prérequis
* [Node.js](https://nodejs.org/) (v18+)
* [npm](https://www.npmjs.com/)

### Installation & Lancement

```bash
# 1. Cloner le dépôt
git clone https://github.com/bdusouth/Jardinducoin-CRM.git
cd Jardinducoin-CRM

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur (sur votre ordinateur ou téléphone connecté au même réseau).

### Déploiement en Production

Pour créer la version de production optimisée :
```bash
npm run build
npm start
```

Le projet peut également être déployé gratuitement ou à très faible coût sur **Vercel**, **Netlify**, ou n'importe quel VPS (via Docker / Node.js).

---

## 🛠️ Stack Technique

* **Framework** : Next.js 16 (App Router) + React 19 + TypeScript
* **Design & Styles** : Tailwind CSS v4
* **Icônes** : Lucide React
* **Persistance & Données** : Local Storage & JSON Backup Engine avec modèle typé

---

## 📄 Licence
Tous droits réservés © 2026 Jardin du Coin.
