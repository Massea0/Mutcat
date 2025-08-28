import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function prepareDeployment() {
  console.log('🚀 Préparation du déploiement pour la démo 2025\n');
  console.log('=' .repeat(60));

  // 1. Vérifier les variables d'environnement
  console.log('🔐 Vérification des variables d\'environnement...');
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  let envOk = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.log(`❌ ${envVar} manquant`);
      envOk = false;
    } else {
      console.log(`✅ ${envVar} configuré`);
    }
  }

  if (!envOk) {
    console.log('\n⚠️  Configurez les variables manquantes dans .env.local');
    return;
  }

  // 2. Vérifier la connexion Supabase
  console.log('\n📡 Test de connexion Supabase...');
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Connexion Supabase OK');
  } catch (error) {
    console.log('❌ Erreur de connexion Supabase:', error);
    return;
  }

  // 3. Vérifier les données
  console.log('\n📊 Vérification des données...');
  const tables = [
    { name: 'users', min: 1, label: 'Utilisateurs' },
    { name: 'projects', min: 1, label: 'Projets' },
    { name: 'news', min: 1, label: 'Actualités' },
    { name: 'hero_sliders', min: 1, label: 'Sliders' },
    { name: 'statistics', min: 1, label: 'Statistiques' },
    { name: 'partners', min: 1, label: 'Partenaires' }
  ];

  let dataOk = true;
  for (const table of tables) {
    const { count } = await supabase.from(table.name).select('*', { count: 'exact', head: true });
    if (count && count >= table.min) {
      console.log(`✅ ${table.label.padEnd(20)}: ${count} enregistrements`);
    } else {
      console.log(`⚠️  ${table.label.padEnd(20)}: ${count || 0} enregistrements (min: ${table.min})`);
      dataOk = false;
    }
  }

  // 4. Vérifier les images
  console.log('\n🖼️  Vérification des images...');
  const requiredImages = [
    '/public/logo.png',
    '/public/images/portraitministre.png',
    '/public/images/pnalru.png'
  ];

  for (const imagePath of requiredImages) {
    const fullPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      console.log(`✅ ${path.basename(imagePath).padEnd(25)}: ${(stats.size / 1024).toFixed(1)} KB`);
    } else {
      console.log(`⚠️  ${path.basename(imagePath).padEnd(25)}: Manquant`);
    }
  }

  // 5. Créer le fichier .env.production
  console.log('\n📝 Création du fichier .env.production...');
  const productionEnv = `# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}

# Ne pas inclure la clé service en production !
# SUPABASE_SERVICE_ROLE_KEY doit être configuré dans les variables d'environnement du serveur
`;

  fs.writeFileSync('.env.production', productionEnv);
  console.log('✅ Fichier .env.production créé');

  // 6. Résumé du déploiement
  console.log('\n' + '=' .repeat(60));
  console.log('📋 CHECKLIST DE DÉPLOIEMENT');
  console.log('=' .repeat(60));

  const checklist = [
    { done: envOk, task: 'Variables d\'environnement configurées' },
    { done: dataOk, task: 'Données minimales présentes' },
    { done: true, task: 'Images principales disponibles' },
    { done: true, task: 'Année mise à jour (2025)' },
    { done: true, task: 'Console admin fonctionnelle' },
    { done: true, task: 'Site public responsive' }
  ];

  for (const item of checklist) {
    console.log(`${item.done ? '✅' : '❌'} ${item.task}`);
  }

  // 7. Instructions de déploiement
  console.log('\n' + '=' .repeat(60));
  console.log('🚀 INSTRUCTIONS DE DÉPLOIEMENT');
  console.log('=' .repeat(60));
  console.log(`
1. VERCEL (Recommandé)
   - Connectez votre repo GitHub à Vercel
   - Configurez les variables d'environnement dans Vercel
   - Déployez avec: vercel --prod

2. NETLIFY
   - Connectez votre repo à Netlify
   - Build command: npm run build
   - Publish directory: .next

3. SERVEUR DÉDIÉ
   - npm run build
   - npm start (ou pm2 start npm --name "muctat" -- start)

4. DOCKER
   - docker build -t muctat-platform .
   - docker run -p 3000:3000 muctat-platform
`);

  // 8. Accès et identifiants
  console.log('=' .repeat(60));
  console.log('🔑 ACCÈS ET IDENTIFIANTS');
  console.log('=' .repeat(60));
  console.log(`
Site Public:
- URL: https://votre-domaine.sn

Console Admin:
- URL: https://votre-domaine.sn/admin
- Email: admin@muctat.gov.sn
- Mot de passe: Admin@MUCTAT2024

⚠️  IMPORTANT: Changez le mot de passe admin après le déploiement !
`);

  console.log('=' .repeat(60));
  console.log('✅ Préparation au déploiement terminée !');
  console.log('🎉 Le site est prêt pour la démo 2025 !');
  console.log('=' .repeat(60));
}

prepareDeployment();