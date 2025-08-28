-- Corrections finales pour la démo 2025

-- Projects: Ajouter la colonne content si elle n'existe pas
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content TEXT;

-- News: Supprimer la contrainte de catégorie pour permettre toutes les valeurs
ALTER TABLE news DROP CONSTRAINT IF EXISTS news_category_check;
ALTER TABLE news ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Tenders: Ajouter la colonne type
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS type VARCHAR(100);

-- Ajouter les colonnes slug aux tables qui en ont besoin
ALTER TABLE news ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE publications ADD COLUMN IF NOT EXISTS slug VARCHAR(255);