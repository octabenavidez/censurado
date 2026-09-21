const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Builds the project and pushes the compiled static artifacts to the deploy branch.
 */
function publishDeploy() {
  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.join(rootDir, 'dist');

  console.log('1. Checking project types and integrity...');
  execSync('npm run check', { cwd: rootDir, stdio: 'inherit' });

  console.log('2. Compiling production build...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

  console.log('3. Verifying build output...');
  execSync('python scripts/verify-build.py', { cwd: rootDir, stdio: 'inherit' });

  console.log('4. Publishing static files to deploy branch...');
  const gitDir = path.join(distDir, '.git');
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }

  try {
    execSync('git init --initial-branch=deploy', { cwd: distDir, stdio: 'inherit' });
    execSync('git config user.name "octabenavidez"', { cwd: distDir, stdio: 'inherit' });
    execSync('git config user.email "octabenavidezsarmiento@gmail.com"', { cwd: distDir, stdio: 'inherit' });
    execSync('git remote add origin https://github.com/octabenavidez/censurado.git', { cwd: distDir, stdio: 'inherit' });
    execSync('git add --all', { cwd: distDir, stdio: 'inherit' });
    execSync('git commit -m "Deploy latest build"', { cwd: distDir, stdio: 'inherit' });
    execSync('git push -u origin deploy --force', { cwd: distDir, stdio: 'inherit' });
    console.log('SUCCESS: Successfully updated deploy branch on origin.');
  } finally {
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }
  }
}

publishDeploy();
