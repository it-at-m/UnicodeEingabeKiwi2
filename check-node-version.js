// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const semver = require('semver');


// Assuming the script checks Node version to decide on setting an environment variable
if (semver.gte(process.version, '17.0.0')) {
    console.log("Node version is 17 or higher, setting --openssl-legacy-provider");
    process.env.NODE_OPTIONS = '--openssl-legacy-provider';
}

// Now, construct and execute your command based on the script's arguments
// Ensure there's at least one argument to form a valid command
const commandArgs = process.argv.slice(2); // Skip 'node' and script path
if (commandArgs.length > 0) {
    const command = commandArgs.join(' ');
    console.log(`Executing command: ${command}`);
    execSync(command, { stdio: 'inherit' });
} else {
    console.error("No command provided to execute.");
    process.exit(1);
}
