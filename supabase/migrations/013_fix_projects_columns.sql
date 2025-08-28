-- Ajouter les colonnes manquantes pour les projets
-- Date: Janvier 2025

-- 1. Ajouter featured_image si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE projects ADD COLUMN featured_image text;
  END IF;
END $$;

-- 2. Ajouter featured_order si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'featured_order'
  ) THEN
    ALTER TABLE projects ADD COLUMN featured_order integer DEFAULT 0;
  END IF;
END $$;

-- 3. Ajouter les colonnes manquantes pour news aussi
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE news ADD COLUMN featured_image text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'author'
  ) THEN
    ALTER TABLE news ADD COLUMN author text DEFAULT 'MUCTAT';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'category'
  ) THEN
    ALTER TABLE news ADD COLUMN category text DEFAULT 'general' CHECK (category IN ('general', 'announcement', 'event', 'partnership', 'press'));
  END IF;
END $$;