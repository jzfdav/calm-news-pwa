import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, 'package.json');
const workflowDir = path.join(rootDir, '.github/workflows');

function validate() {
  if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json not found');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageManager = packageJson.packageManager;

  const hasPackageManager = packageManager && packageManager.startsWith('pnpm@');

  if (!fs.existsSync(workflowDir)) {
    return;
  }

  const files = fs.readdirSync(workflowDir);
  let hasError = false;

  files.forEach(file => {
    if (file.endsWith('.yml') || file.endsWith('.yaml')) {
      const content = fs.readFileSync(path.join(workflowDir, file), 'utf8');
      
      if (hasPackageManager) {
        // If packageManager is defined, we should NOT define version in action-setup to avoid "Multiple versions specified" error
        const regex = /uses:\s+pnpm\/action-setup@.*\n\s+with:\s*\n\s+version:/g;
        if (regex.test(content)) {
          console.error(`Error in ${file}: "version" specified in pnpm/action-setup, but "packageManager" is already defined in package.json. Remove "version" from the workflow to avoid conflicts.`);
          hasError = true;
        }
      }
    }
  });

  if (hasError) {
    process.exit(1);
  } else {
    console.log('CI configuration is consistent with package.json');
  }
}

validate();
