-- Migration pour mettre à jour la table users avec les colonnes nécessaires

-- Ajouter les colonnes manquantes à la table users si elles n'existent pas
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer',
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar TEXT,
ADD COLUMN IF NOT EXISTS permissions TEXT[];

-- Créer un index sur le rôle pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Mettre à jour les politiques RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir tous les profils publics
CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone" 
ON users FOR SELECT 
USING (true);

-- Politique pour permettre aux utilisateurs de modifier leur propre profil
CREATE POLICY IF NOT EXISTS "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Politique pour permettre aux admins de tout faire
CREATE POLICY IF NOT EXISTS "Admins can do everything" 
ON users FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Fonction pour créer automatiquement un profil utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();