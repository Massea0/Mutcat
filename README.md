# MUCTAT - Plateforme Digitale du Ministère de l'Urbanisme du Sénégal

## 🇸🇳 Vue d'ensemble

Plateforme digitale révolutionnaire pour le Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires (MUCTAT) de la République du Sénégal. Cette solution intègre un site web institutionnel, un intranet sécurisé et des fonctionnalités d'intelligence artificielle avancées.

## ✨ Fonctionnalités Principales

### Site Institutionnel Public
- **Présentation du Ministère** : Missions, organisation, directions et agences
- **Actualités et Événements** : Système de gestion de contenu dynamique
- **Projets** : Suivi des projets d'urbanisme (PNALRU, Pôles Territoriaux, Vision 2050)
- **Services en ligne** : Publications, appels d'offres, carrières, FAQ
- **Portail Médias** : Galerie photos/vidéos, podcasts, communiqués

### Intranet Sécurisé
- Authentification forte multi-niveaux (admin, agent, citoyen)
- Partage de documents internes avec versioning
- Messagerie interne et collaboration
- Tableaux de bord de suivi de projets

### Intelligence Artificielle
- **Chatbot Interactif** : Assistant virtuel 24/7 avec compréhension du langage naturel
- **Analyse des Interactions** : Synthèse automatique des retours citoyens
- **Synthèse des Appels d'Offres** : Extraction et analyse intelligente des opportunités

### Intégration Réseaux Sociaux
- Publication centralisée multi-plateformes (Twitter/X, LinkedIn, Instagram)
- Flux sociaux intégrés en temps réel
- Gestion unifiée des contenus

## 🛠 Stack Technique

### Frontend
- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **UI Components** : Radix UI
- **Animations** : Framer Motion
- **Icons** : Lucide React, React Icons

### Backend & Infrastructure
- **BaaS** : Supabase
  - PostgreSQL Database
  - Authentication
  - Real-time subscriptions
  - Storage (images, documents)
  - Edge Functions
- **AI/ML** : OpenAI API
- **Analytics** : Vercel Analytics

### Sécurité
- HTTPS/SSL obligatoire
- Authentification JWT avec refresh tokens
- Row Level Security (RLS) sur Supabase
- Protection OWASP Top 10
- Conformité ISO 27001

## 📦 Installation

### Prérequis
- Node.js 18+ et npm 9+
- Compte Supabase
- Clés API (OpenAI, réseaux sociaux)

### Configuration

1. **Cloner le repository**
```bash
git clone https://github.com/muctat/platform.git
cd muctat-platform
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**

Créer un fichier `.env.local` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Social Media APIs
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Initialiser la base de données**

Exécuter le script SQL dans Supabase :
```bash
supabase db push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement à chaque push sur `main`

### Option 2 : Data Center National

1. **Build de production**
```bash
npm run build
```

2. **Démarrer le serveur**
```bash
npm start
```

3. **Configuration Nginx** (exemple)
```nginx
server {
    listen 80;
    server_name muctat.sn;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3 : Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 Design System

### Couleurs Principales
- **Vert Sénégal** : #00923f (Primaire)
- **Jaune Sénégal** : #ffb800 (Secondaire)
- **Rouge Sénégal** : #d91010 (Accent)

### Philosophie
- Design épuré et minimaliste
- Coins arrondis sur tous les composants
- Animations subtiles et performantes
- Mobile-first responsive
- Accessibilité WCAG AAA

## 🔒 Sécurité

### Mesures Implémentées
- ✅ Certificat SSL/TLS
- ✅ Authentication multi-facteurs (MFA)
- ✅ Protection contre les injections SQL
- ✅ Protection XSS
- ✅ Protection CSRF
- ✅ Rate limiting
- ✅ Sauvegardes automatiques
- ✅ Monitoring en temps réel

## 📊 Monitoring & Analytics

- Tableau de bord temps réel
- Métriques de performance (Core Web Vitals)
- Suivi des erreurs (Sentry)
- Analytics utilisateurs (respectueux RGPD)

## 🌍 Internationalisation

- Support bilingue : Français (défaut) / Anglais
- Changement de langue dynamique
- Traductions complètes de l'interface
- Formats de date/nombre localisés

## 📝 Documentation

### Structure du Projet
```
muctat-platform/
├── src/
│   ├── app/              # Pages et routes Next.js
│   ├── components/       # Composants React réutilisables
│   │   ├── ui/          # Composants UI de base
│   │   ├── layout/      # Composants de mise en page
│   │   ├── home/        # Composants page d'accueil
│   │   └── chatbot/     # Widget chatbot IA
│   ├── lib/             # Utilitaires et configurations
│   │   ├── supabase/    # Client et config Supabase
│   │   └── i18n/        # Traductions
│   └── types/           # Types TypeScript
├── public/              # Assets statiques
├── supabase/           # Migrations et config DB
└── package.json        # Dépendances
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Propriété du Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires de la République du Sénégal.

## 📞 Support

- **Email** : support-technique@muctat.sn
- **Documentation** : [docs.muctat.sn](https://docs.muctat.sn)
- **Issues** : GitHub Issues

## 🙏 Remerciements

- Ministère de l'Urbanisme du Sénégal
- Partenaires techniques et financiers
- Communauté open source

---

**République du Sénégal** 🇸🇳  
*Un Peuple, Un But, Une Foi*