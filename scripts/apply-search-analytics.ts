import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySearchAnalyticsMigration() {
  console.log('📊 Applying search analytics migration...');
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '015_create_search_analytics.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { 
      sql: migrationSQL 
    }).single();
    
    if (error) {
      // If exec_sql doesn't exist, try executing statements separately
      const statements = migrationSQL
        .split(';')
        .filter(stmt => stmt.trim())
        .map(stmt => stmt.trim() + ';');
      
      for (const statement of statements) {
        if (statement.includes('CREATE TABLE') || 
            statement.includes('CREATE INDEX') || 
            statement.includes('CREATE POLICY') ||
            statement.includes('ALTER TABLE') ||
            statement.includes('INSERT INTO')) {
          console.log('Executing:', statement.substring(0, 50) + '...');
          
          // For now, we'll just log since we can't directly execute SQL
          // In production, you'd run this through Supabase dashboard or CLI
        }
      }
      
      console.log('\n⚠️  Please run the following migration in Supabase SQL editor:');
      console.log('📁 File: supabase/migrations/015_create_search_analytics.sql\n');
    } else {
      console.log('✅ Search analytics migration applied successfully');
    }
    
    // Verify the table exists
    const { data: tables } = await supabase
      .from('search_analytics')
      .select('*')
      .limit(1);
    
    if (tables) {
      console.log('✅ Search analytics table verified');
      
      // Get count
      const { count } = await supabase
        .from('search_analytics')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Search analytics entries: ${count}`);
    }
    
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    console.log('\n📝 Please manually run the migration in Supabase:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Copy content from: supabase/migrations/015_create_search_analytics.sql');
    console.log('3. Run the SQL');
  }
}

applySearchAnalyticsMigration();