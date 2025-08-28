# 🏛️ MUCTAT - Plateforme Digitale du Ministère de l'Urbanisme

**Ministère de l'Urbanisme, du Cadre de Vie et de l'Aménagement du Territoire**  
République du Sénégal 🇸🇳

## 📋 Vue d'ensemble

Plateforme web moderne et complète pour le MUCTAT, intégrant :
- Site institutionnel public
- Console d'administration avancée
- Système de gestion de contenu (CMS)
- Portail de services aux citoyens

### 🎯 Année : 2025

## 🚀 Technologies

- **Frontend** : Next.js 15, React 18, TypeScript
- **Styling** : Tailwind CSS, Shadcn/UI
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **Déploiement** : Docker, Vercel/Netlify ready

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/votre-org/muctat-platform.git
cd muctat-platform

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# Lancer en développement
npm run dev
```

## 🔐 Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Exécutez les migrations SQL dans l'ordre :
   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_auth_setup.sql
   ...
   supabase/migrations/011_final_fixes.sql
   ```
3. Configurez les variables d'environnement

## 📊 Insertion des données

```bash
# Données de démonstration
npm run seed:demo

# Données de production
npm run seed:production
```

## 🌐 Accès

### Site Public
- URL : http://localhost:3000
- Pages principales :
  - `/` - Accueil
  - `/ministere/*` - Informations institutionnelles
  - `/projets` - Projets d'urbanisme
  - `/actualites` - Actualités
  - `/services/*` - Services aux citoyens

### Console Admin
- URL : http://localhost:3000/admin
- Identifiants par défaut :
  - Email : `admin@muctat.gov.sn`
  - Mot de passe : `Admin@MUCTAT2024`

⚠️ **Important** : Changez le mot de passe après le premier déploiement !

## 🚢 Déploiement

### Option 1 : Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Option 2 : Docker

```bash
# Build
docker build -t muctat-platform .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  muctat-platform
```

### Option 3 : Serveur traditionnel

```bash
# Build pour production
npm run build

# Démarrer
npm start
```

## 📁 Structure du projet

```
/workspace
├── src/
│   ├── app/              # Routes Next.js App Router
│   │   ├── (public)/     # Pages publiques
│   │   ├── (admin)/      # Console admin
│   │   └── (auth)/       # Authentification
│   ├── components/       # Composants React
│   ├── lib/             # Utilitaires et services
│   └── styles/          # Styles globaux
├── public/              # Assets statiques
├── supabase/           # Migrations SQL
└── scripts/            # Scripts utilitaires
```

## 🔧 Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Démarrer en production
npm run lint         # Vérification du code
npm run type-check   # Vérification TypeScript
```

## 📸 Images requises

Les images suivantes sont nécessaires :
- `/public/logo.png` - Logo du ministère
- `/public/images/portraitministre.png` - Photo du ministre
- `/public/images/pnalru.png` - Image du programme PNALRU

## 🛡️ Sécurité

- Authentification via Supabase Auth
- Row Level Security (RLS) sur toutes les tables
- Protection CSRF intégrée
- Headers de sécurité configurés
- Validation des données côté serveur

## 📈 Fonctionnalités principales

### Site Public
- ✅ Pages institutionnelles complètes
- ✅ Système de recherche global
- ✅ Actualités et événements
- ✅ Appels d'offres
- ✅ Formulaires téléchargeables
- ✅ Galerie média
- ✅ Multi-langue (FR/EN)
- ✅ Accessibilité WCAG 2.1

### Console Admin
- ✅ Dashboard avec statistiques
- ✅ Gestion complète du contenu
- ✅ Upload et gestion des médias
- ✅ Gestion des utilisateurs et rôles
- ✅ Audit trail
- ✅ Éditeur WYSIWYG

## 🤝 Support

Pour toute question ou problème :
- Email : support@muctat.gov.sn
- Documentation : [docs.muctat.gov.sn](https://docs.muctat.gov.sn)

## 📄 Licence

© 2025 Ministère de l'Urbanisme, du Cadre de Vie et de l'Aménagement du Territoire - République du Sénégal

---

**Développé avec ❤️ pour le Sénégal 🇸🇳**