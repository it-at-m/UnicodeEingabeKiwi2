const { execSync } = require('child_process');
const semver = require('semver');

// Get the current Node.js version
const nodeVersion = process.version;

// Check if the version is >= 17
if (semver.gte(nodeVersion, '17.0.0')) {
  // Set NODE_OPTIONS for versions 17 and above
  process.env.NODE_OPTIONS = '--openssl-legacy-provider';
}

// Execute the original command passed as an argument
const originalCommand = process.argv.slice(2).join(' ');
execSync(originalCommand, { stdio: 'inherit' });
