const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Builds the project and pushes the compiled static artifacts to the deploy branch.
 */
function publishDeploy() {
  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.join(rootDir, 'dist');
  const rootOptions = { cwd: rootDir, stdio: ['ignore', 'inherit', 'inherit'], shell: true };
  const distOptions = { cwd: distDir, stdio: ['ignore', 'inherit', 'inherit'], shell: true };

  console.log('1. Compiling production build...');
  execSync('npm run build', rootOptions);

  console.log('2. Verifying build output...');
  execSync('python scripts/verify-build.py', rootOptions);

  console.log('3. Publishing static files to deploy branch...');
  const gitDir = path.join(distDir, '.git');
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }

  try {
    execSync('git init --initial-branch=deploy', distOptions);
    execSync('git config user.name "octabenavidez"', distOptions);
    execSync('git config user.email "octabenavidezsarmiento@gmail.com"', distOptions);
    execSync('git remote add origin https://github.com/octabenavidez/censurado.git', distOptions);
    execSync('git add --all', distOptions);
    execSync('git commit -m "Deploy latest build with new favicon"', distOptions);
    execSync('git push -u origin deploy --force', distOptions);
    console.log('SUCCESS: Successfully updated deploy branch on origin.');
  } finally {
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }
  }
}

publishDeploy();
