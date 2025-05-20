const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { processTemplates } = require('../utils/templates');
const { getProjectConfig } = require('../utils/config');
const { installDependencies } = require('../utils/dependencies');
const semver = require('semver');
const packageJson = require('../../package.json');

/**
 * Update an existing project with the latest template features and fixes
 * @param {Object} options - Command options
 */
async function updateProject(options = {}) {
  try {
    console.log(chalk.blue('Updating project with the latest template changes...'));
    
    // Get the current directory
    const projectDir = process.cwd();
    
    // Check if this is a valid Nexora React Native project
    if (!await isNexoraProject(projectDir)) {
      console.error(chalk.red('Error: This is not a valid Nexora React Native project.'));
      console.log(chalk.yellow('Please run this command from the root of a project created with Nexora React Native Boilerplate CLI.'));
      return;
    }
    
    // Get the current project configuration
    const projectConfig = await getProjectConfig(projectDir);
    
    // Get the current CLI version from the project
    const projectCliVersion = projectConfig.cliVersion || '0.0.0';
    
    // Get the latest CLI version
    const latestCliVersion = packageJson.version;
    
    console.log(chalk.blue(`Current project CLI version: ${projectCliVersion}`));
    console.log(chalk.blue(`Latest CLI version: ${latestCliVersion}`));
    
    // Check if update is needed
    if (semver.gte(projectCliVersion, latestCliVersion) && !options.force) {
      console.log(chalk.green('Your project is already up to date with the latest template version.'));
      console.log(chalk.yellow('If you want to force an update, use the --force flag.'));
      return;
    }
    
    // Ask for confirmation before updating
    if (!options.yes) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'This will update your project with the latest template changes. Some of your customizations might be overwritten. Do you want to continue?',
          default: false
        }
      ]);
      
      if (!confirm) {
        console.log(chalk.yellow('Update cancelled.'));
        return;
      }
    }
    
    // Backup the project before updating
    if (!options.noBackup) {
      const spinner = ora('Creating backup of your project...').start();
      await createBackup(projectDir);
      spinner.succeed('Backup created successfully.');
    }
    
    // Update the templates
    const spinner = ora('Updating project templates...').start();
    
    // Get the features to update
    const featuresToUpdate = options.features ? 
      options.features.split(',') : 
      Object.keys(projectConfig).filter(key => projectConfig[key] === true || 
        ['navigation', 'state', 'storage', 'ui'].includes(key));
    
    // Process templates for the selected features
    await processTemplates(projectDir, projectConfig, featuresToUpdate, { update: true });
    
    // Update the CLI version in the project config
    projectConfig.cliVersion = latestCliVersion;
    await fs.writeJSON(path.join(projectDir, '.nexora-cli.json'), projectConfig, { spaces: 2 });
    
    spinner.succeed('Project templates updated successfully.');
    
    // Install any new dependencies if needed
    if (!options.skipInstall) {
      const installSpinner = ora('Installing dependencies...').start();
      await installDependencies(projectDir, projectConfig);
      installSpinner.succeed('Dependencies installed successfully.');
    }
    
    console.log(chalk.green(`\n✅ Project successfully updated to version ${latestCliVersion}!`));
    console.log(chalk.blue('The following features were updated:'));
    console.log(chalk.blue(featuresToUpdate.join(', ')));
    
    if (!options.noBackup) {
      console.log(chalk.yellow('\nA backup of your project was created before the update.'));
      console.log(chalk.yellow('You can find it in the .nexora-backups directory.'));
    }
    
  } catch (error) {
    console.error(chalk.red('Error updating project:'), error);
    process.exit(1);
  }
}

/**
 * Check if the current directory is a valid Nexora React Native project
 * @param {string} projectDir - Project directory
 * @returns {Promise<boolean>} - True if it's a valid Nexora project
 */
async function isNexoraProject(projectDir) {
  try {
    // Check for .nexora-cli.json file
    const configExists = await fs.pathExists(path.join(projectDir, '.nexora-cli.json'));
    
    // Check for package.json with React Native
    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJsonExists = await fs.pathExists(packageJsonPath);
    
    if (packageJsonExists) {
      const packageData = await fs.readJSON(packageJsonPath);
      const hasReactNative = packageData.dependencies && packageData.dependencies['react-native'];
      
      return configExists && hasReactNative;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Create a backup of the project before updating
 * @param {string} projectDir - Project directory
 */
async function createBackup(projectDir) {
  const backupDir = path.join(projectDir, '.nexora-backups');
  await fs.ensureDir(backupDir);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);
  
  // Create a list of directories and files to backup
  // Exclude node_modules, .git, and other large directories
  const filesToCopy = await getFilesToBackup(projectDir);
  
  // Copy files to backup directory
  await fs.ensureDir(backupPath);
  for (const file of filesToCopy) {
    const sourcePath = path.join(projectDir, file);
    const targetPath = path.join(backupPath, file);
    
    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(sourcePath, targetPath);
  }
  
  return backupPath;
}

/**
 * Get the list of files to backup
 * @param {string} projectDir - Project directory
 * @returns {Promise<string[]>} - List of files to backup
 */
async function getFilesToBackup(projectDir) {
  // Exclude these directories and files from backup
  const excludes = [
    'node_modules',
    '.git',
    'android/build',
    'android/app/build',
    'ios/build',
    'ios/Pods',
    '.nexora-backups'
  ];
  
  const result = [];
  
  async function scanDir(dir, base = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const relativePath = path.join(base, entry.name);
      
      // Skip excluded directories
      if (excludes.some(exclude => relativePath.startsWith(exclude))) {
        continue;
      }
      
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(fullPath, relativePath);
      } else {
        result.push(relativePath);
      }
    }
  }
  
  await scanDir(projectDir);
  return result;
}

module.exports = {
  updateProject
};
