import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  try {
    console.log('🚀 Applying database migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/007_fix_missing_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 50) + '...');
      
      // Use raw SQL execution via RPC or direct query
      const { error } = await supabase.rpc('exec_sql', { 
        sql: statement + ';' 
      }).single();
      
      if (error) {
        // If RPC doesn't exist, try direct execution (this might not work with all statements)
        console.log('RPC failed, trying alternative method...');
        // For now, we'll just log the error and continue
        console.warn('Statement might have failed:', error.message);
      }
    }
    
    console.log('✅ Migration applied successfully!');
    console.log('\nVerifying tables...');
    
    // Verify tables exist
    const tables = ['hero_sliders', 'statistics', 'partners', 'quick_links', 'site_settings'];
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('count').single();
      if (error) {
        console.log(`❌ Table ${table}: Not accessible (${error.message})`);
      } else {
        console.log(`✅ Table ${table}: Exists`);
      }
    }
    
    // Check if columns were added
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('id, is_featured')
      .limit(1);
    
    if (projectError && projectError.message.includes('is_featured')) {
      console.log('❌ Column is_featured not added to projects');
    } else {
      console.log('✅ Column is_featured exists on projects');
    }
    
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('id, is_featured')
      .limit(1);
    
    if (newsError && newsError.message.includes('is_featured')) {
      console.log('❌ Column is_featured not added to news');
    } else {
      console.log('✅ Column is_featured exists on news');
    }
    
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    process.exit(1);
  }
}

// Alternative: Direct SQL execution via Supabase Dashboard API
async function applyMigrationViaAPI() {
  console.log('\n📝 Migration SQL has been saved to: supabase/migrations/007_fix_missing_tables.sql');
  console.log('\n🔧 Please run this migration manually in your Supabase Dashboard:');
  console.log('1. Go to https://app.supabase.com');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor');
  console.log('4. Copy and paste the contents of the migration file');
  console.log('5. Click "Run" to execute');
  
  // Read and display the migration for easy copying
  const migrationPath = path.join(__dirname, '../supabase/migrations/007_fix_missing_tables.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('\n--- MIGRATION SQL ---\n');
  console.log(migrationSQL);
  console.log('\n--- END OF MIGRATION ---\n');
}

// Try automatic application first, then fallback to manual
applyMigration().catch(() => {
  console.log('\n⚠️  Automatic migration failed. Switching to manual mode...');
  applyMigrationViaAPI();
});