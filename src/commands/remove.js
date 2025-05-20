const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { loadProjectConfig, saveProjectConfig } = require('../utils/config');
const { uninstallDependencies } = require('../utils/dependencies');
const { cleanupFeatureFiles } = require('../utils/cleanup');

/**
 * Remove a feature from an existing project
 * @param {string} feature - Feature to remove
 * @param {object} options - CLI options
 */
async function removeFeature(feature, options) {
  const projectDir = path.resolve(process.cwd(), options.path);
  
  // Check if project exists and has config
  if (!fs.existsSync(path.join(projectDir, '.nexora-cli-config.json'))) {
    console.error(chalk.red('Error: Not a Nexora React Native project or missing configuration.'));
    console.log(chalk.yellow('This command can only be run in a project created with @nexora/react-native-boilerplate.'));
    process.exit(1);
  }
  
  // Load project configuration
  const projectConfig = await loadProjectConfig(projectDir);
  
  // Validate feature
  const validFeatures = ['navigation', 'drawer', 'tabs', 'stack', 'auth', 'firebase', 'api', 
    'redux', 'zustand', 'localization', 'theme', 'tailwind', 'styled-components', 'mmkv', 'fonts'];
    
  if (!validFeatures.includes(feature)) {
    console.error(chalk.red(`Error: '${feature}' is not a valid feature.`));
    console.log(chalk.yellow(`Valid features are: ${validFeatures.join(', ')}`));
    process.exit(1);
  }

  // Check if the feature exists in the project
  if (!featureExists(projectConfig, feature)) {
    console.log(chalk.yellow(`Feature '${feature}' is not installed in this project.`));
    return;
  }
  
  // Warning about potential data loss
  console.log(chalk.yellow(`Warning: Removing the '${feature}' feature may cause data loss and require code adjustments.`));
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to remove this feature?',
      default: false,
    },
  ]);
  
  if (!confirm) {
    console.log(chalk.yellow('Operation canceled.'));
    return;
  }
  
  // Remove feature from project
  await processFeatureRemoval(projectDir, projectConfig, feature);
  
  console.log(chalk.green(`\nFeature '${feature}' removed successfully! 🎉`));
}

/**
 * Process the removal of a feature from the project
 */
async function processFeatureRemoval(projectDir, projectConfig, feature) {
  const spinner = ora(`Removing ${feature} from your project...`).start();
  
  try {
    // Update project config without the feature
    const updatedConfig = updateProjectConfigWithoutFeature(projectConfig, feature);
    
    // Uninstall dependencies for the feature
    await uninstallDependencies(projectDir, feature);
    
    // Remove feature-specific files
    await cleanupFeatureFiles(projectDir, feature);
    
    // Save updated project configuration
    await saveProjectConfig(projectDir, updatedConfig);
    
    spinner.succeed(`Feature '${feature}' removed successfully`);
    return updatedConfig;
  } catch (error) {
    spinner.fail(`Failed to remove feature '${feature}'`);
    throw error;
  }
}

/**
 * Update project config without the removed feature
 */
function updateProjectConfigWithoutFeature(projectConfig, feature) {
  const updatedConfig = { ...projectConfig };
  
  switch (feature) {
    case 'navigation':
    case 'drawer':
    case 'tabs':
    case 'stack':
      updatedConfig.navigation = 'none';
      break;
    case 'redux':
    case 'zustand':
      updatedConfig.state = 'none';
      break;
    case 'tailwind':
    case 'styled-components':
      updatedConfig.ui = 'none';
      break;
    case 'mmkv':
      updatedConfig.storage = 'async-storage';
      break;
    case 'firebase':
    case 'api':
    case 'theme':
    case 'localization':
    case 'auth':
      updatedConfig[feature] = false;
      break;
  }
  
  return updatedConfig;
}

/**
 * Check if a feature exists in the project configuration
 */
function featureExists(projectConfig, feature) {
  switch (feature) {
    case 'drawer':
      return projectConfig.navigation === 'drawer';
    case 'tabs':
      return projectConfig.navigation === 'tabs';
    case 'stack':
      return projectConfig.navigation === 'stack';
    case 'navigation':
      return projectConfig.navigation !== 'none';
    case 'redux':
      return projectConfig.state === 'redux';
    case 'zustand':
      return projectConfig.state === 'zustand';
    case 'tailwind':
      return projectConfig.ui === 'tailwind';
    case 'styled-components':
      return projectConfig.ui === 'styled-components';
    case 'mmkv':
      return projectConfig.storage === 'mmkv';
    case 'firebase':
    case 'api':
    case 'theme':
    case 'localization':
    case 'auth':
      return projectConfig[feature] === true;
    default:
      return false;
  }
}

module.exports = { removeFeature };
