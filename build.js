const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // Install root dependencies
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Navigate to frontend and install dependencies
  console.log('📦 Installing frontend dependencies...');
  process.chdir(path.join(__dirname, 'packages', 'frontend'));
  
  // Force install all dependencies including dev dependencies
  execSync('npm install --force', { stdio: 'inherit' });
  
  // Build the frontend
  console.log('🔨 Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
