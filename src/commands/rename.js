const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { changeCase } = require('change-case');
const replace = require('replace-in-file');
const { loadProjectConfig, saveProjectConfig } = require('../utils/config');

/**
 * Rename the React Native app
 * @param {string} newName - New name for the app
 * @param {object} options - CLI options
 */
async function renameApp(newName, options) {
  const projectDir = path.resolve(process.cwd(), options.path);
  
  // Check if project exists and has config
  if (!fs.existsSync(path.join(projectDir, '.nexora-cli-config.json'))) {
    console.error(chalk.red('Error: Not a Nexora React Native project or missing configuration.'));
    console.log(chalk.yellow('This command can only be run in a project created with @nexora/react-native-boilerplate.'));
    process.exit(1);
  }
  
  // Load project configuration
  const projectConfig = await loadProjectConfig(projectDir);
  
  const spinner = ora(`Renaming app to "${newName}"...`).start();
  
  try {
    // Update project name in configuration
    const oldName = projectConfig.name;
    projectConfig.name = newName;
    
    // Update app.json
    await updateAppJson(projectDir, newName);
    
    // Update package.json
    await updatePackageJson(projectDir, newName);
    
    // Update project references in code
    await updateCodeReferences(projectDir, oldName, newName);
    
    // Save updated project configuration
    await saveProjectConfig(projectDir, projectConfig);
    
    spinner.succeed(`App renamed to "${newName}" successfully`);
    
    console.log(chalk.green('\nApp renamed successfully! 🎉'));
    console.log(chalk.yellow('\nNote: You may need to run the following commands:'));
    console.log(chalk.cyan('  npx react-native-rename-next') + ' (if installed)');
    console.log(chalk.cyan('  npx pod-install ios') + ' (for iOS)');
    console.log(chalk.yellow('\nThen restart your development server.'));
  } catch (error) {
    spinner.fail(`Failed to rename app to "${newName}"`);
    console.error(chalk.red('Error:'), error.message);
    throw error;
  }
}

/**
 * Update app.json with new app name
 */
async function updateAppJson(projectDir, newName) {
  const appJsonPath = path.join(projectDir, 'app.json');
  
  if (!fs.existsSync(appJsonPath)) {
    return;
  }
  
  try {
    const appJson = await fs.readJson(appJsonPath);
    
    if (appJson.name) {
      appJson.name = newName;
    }
    
    if (appJson.displayName) {
      appJson.displayName = newName;
    }
    
    await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to update app.json: ${error.message}`);
  }
}

/**
 * Update package.json with new app name
 */
async function updatePackageJson(projectDir, newName) {
  const packageJsonPath = path.join(projectDir, 'package.json');
  
  try {
    const packageJson = await fs.readJson(packageJsonPath);
    
    // Convert name to kebab-case for package name
    const kebabName = changeCase(newName).paramCase;
    packageJson.name = kebabName;
    
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to update package.json: ${error.message}`);
  }
}

/**
 * Update code references to the app name
 */
async function updateCodeReferences(projectDir, oldName, newName) {
  // This is a simplified implementation that handles some basic references
  // For a complete solution, react-native-rename or a similar package would be used
  
  try {
    // Find files with potential name references
    const options = {
      files: [
        path.join(projectDir, 'src/**/*.js'),
        path.join(projectDir, 'src/**/*.jsx'),
        path.join(projectDir, 'src/**/*.ts'),
        path.join(projectDir, 'src/**/*.tsx'),
        path.join(projectDir, 'index.js'),
        path.join(projectDir, 'index.tsx'),
      ],
      from: [
        new RegExp(`name:\\s*["']${oldName}["']`, 'g'),
        new RegExp(`displayName:\\s*["']${oldName}["']`, 'g'),
        new RegExp(`title:\\s*["']${oldName}["']`, 'g'),
        new RegExp(`appName\\s*=\\s*["']${oldName}["']`, 'g'),
      ],
      to: (match) => match.replace(oldName, newName),
      countMatches: true,
    };

    const results = await replace(options);
    const changedFiles = results.filter(result => result.hasChanged);
    
    if (changedFiles.length > 0) {
      console.log(chalk.green(`Updated app name references in ${changedFiles.length} files.`));
    }

  } catch (error) {
    throw new Error(`Error updating code references: ${error.message}`);
  }
}

module.exports = { renameApp };
