#!/usr/bin/env tsx
/**
 * Script pour corriger les Dialogs dans les pages admin
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const adminDir = join(__dirname, '..', 'src', 'app', '(admin)', 'admin');

function fixDialogsInFile(filePath: string) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Pattern pour trouver DialogContent sans aria-describedby
  const dialogPattern = /<DialogContent\s+className="[^"]*">/g;
  
  if (dialogPattern.test(content)) {
    // Remplacer DialogContent pour ajouter aria-describedby
    content = content.replace(
      /<DialogContent\s+className="([^"]*)">/g,
      '<DialogContent className="$1" aria-describedby="dialog-description">'
    );
    
    // Ajouter la description après DialogTitle si elle n'existe pas
    if (!content.includes('id="dialog-description"')) {
      content = content.replace(
        /(<DialogTitle>[\s\S]*?<\/DialogTitle>)(\s*<\/DialogHeader>)/g,
        '$1\n            <p id="dialog-description" className="sr-only">Formulaire de gestion</p>$2'
      );
    }
    
    modified = true;
  }
  
  if (modified) {
    writeFileSync(filePath, content);
    console.log(`✅ Corrigé: ${filePath}`);
    return true;
  }
  
  return false;
}

// Parcourir tous les fichiers dans le dossier admin
const files = readdirSync(adminDir, { recursive: true });
let fixedCount = 0;

files.forEach(file => {
  const fullPath = join(adminDir, file.toString());
  if (fullPath.endsWith('.tsx') && fullPath.includes('page.tsx')) {
    if (fixDialogsInFile(fullPath)) {
      fixedCount++;
    }
  }
});

console.log(`\n📊 Total: ${fixedCount} fichiers corrigés`);