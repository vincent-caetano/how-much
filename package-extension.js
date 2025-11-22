#!/usr/bin/env node

/**
 * Package extension for Chrome Web Store submission
 * Creates a zip file with only the necessary files, ensuring manifest.json is at the root
 */

import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Required files for the extension
const REQUIRED_FILES = [
  'manifest.json',
  'popup.html',
  'popup.js',
  'popup.css',
  'content.js',
];

const REQUIRED_DIRS = [
  'icons',
  '_locales',
];

// Files/directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  'src',
  'dist',
  'public',
  '.git',
  '.vscode',
  '.idea',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'jsconfig.json',
  'components.json',
  'index.html',
  'README.md',
  'DEVELOPMENT.md',
  '.gitignore',
  '.cursorrules',
  '.DS_Store',
  '*.old',
  '*.log',
];

function checkRequiredFiles() {
  const missing = [];
  
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      missing.push(file);
    }
  }
  
  for (const dir of REQUIRED_DIRS) {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      missing.push(dir);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required files/directories:');
    missing.forEach(item => console.error(`   - ${item}`));
    console.error('\n💡 Make sure you have run: npm run build');
    process.exit(1);
  }
  
  // Check if popup.js and popup.css exist (they should be built)
  const popupJsPath = path.join(__dirname, 'popup.js');
  const popupCssPath = path.join(__dirname, 'popup.css');
  
  if (!fs.existsSync(popupJsPath) || !fs.existsSync(popupCssPath)) {
    console.error('❌ Built files (popup.js, popup.css) not found.');
    console.error('💡 Run: npm run build');
    process.exit(1);
  }
}

function shouldExclude(filePath) {
  const relativePath = path.relative(__dirname, filePath);
  const fileName = path.basename(filePath);
  
  // Check exclude patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      const glob = pattern.replace('*', '.*');
      const regex = new RegExp(glob);
      if (regex.test(fileName) || regex.test(relativePath)) {
        return true;
      }
    } else {
      if (relativePath.startsWith(pattern) || fileName === pattern) {
        return true;
      }
    }
  }
  
  return false;
}

async function createZip() {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, 'extension.zip');
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
      store: false // Use deflate compression
    });

    output.on('close', () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`✅ Extension packaged successfully!`);
      console.log(`   File: ${outputPath}`);
      console.log(`   Size: ${sizeMB} MB`);
      console.log(`\n📦 Ready for Chrome Web Store submission!`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add required files - ensure they're added at root level
    for (const file of REQUIRED_FILES) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        // Use { name: file } to ensure file is at root, not in a subdirectory
        archive.file(filePath, { name: file });
        console.log(`   ✓ Added: ${file}`);
      }
    }

    // Add required directories - ensure they maintain their structure
    for (const dir of REQUIRED_DIRS) {
      const dirPath = path.join(__dirname, dir);
      if (fs.existsSync(dirPath)) {
        // Use { name: dir } to ensure directory is at root level
        archive.directory(dirPath, dir, false);
        console.log(`   ✓ Added: ${dir}/`);
      }
    }

    archive.finalize();
  });
}

async function main() {
  console.log('📦 Packaging extension for Chrome Web Store...\n');
  
  // Check if required files exist
  checkRequiredFiles();
  
  // Remove old zip if it exists
  const zipPath = path.join(__dirname, 'extension.zip');
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
    console.log('   🗑️  Removed old extension.zip\n');
  }
  
  // Create zip
  await createZip();
}

main().catch((error) => {
  console.error('❌ Error packaging extension:', error);
  process.exit(1);
});

