const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { loadProjectConfig, saveProjectConfig } = require('../utils/config');
const { installDependencies } = require('../utils/dependencies');
const { processTemplates } = require('../utils/templates');

/**
 * Add a feature to an existing project
 * @param {string} feature - Feature to add
 * @param {object} options - CLI options
 */
async function addFeature(feature, options) {
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

  // Check if the feature is already installed
  if (featureAlreadyExists(projectConfig, feature)) {
    console.log(chalk.yellow(`Feature '${feature}' is already installed in this project.`));
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Do you want to reinstall/update it?',
        default: false,
      },
    ]);
    
    if (!proceed) {
      console.log(chalk.yellow('Operation canceled.'));
      return;
    }
  }
  
  // Add feature to project
  await processFeatureAddition(projectDir, projectConfig, feature);
  
  console.log(chalk.green(`\nFeature '${feature}' added successfully! 🎉`));
}

/**
 * Process the addition of a feature to the project
 */
async function processFeatureAddition(projectDir, projectConfig, feature) {
  const spinner = ora(`Adding ${feature} to your project...`).start();
  
  try {
    // Update project config with new feature
    const updatedConfig = updateProjectConfigWithFeature(projectConfig, feature);
    
    // Create directories if needed
    await createFeatureDirectories(projectDir, feature);
    
    // Install dependencies for the feature
    await installDependencies(projectDir, { [feature]: true });
    
    // Process templates for the feature
    await processTemplates(projectDir, { ...updatedConfig, specificFeature: feature });
    
    // Save updated project configuration
    await saveProjectConfig(projectDir, updatedConfig);
    
    spinner.succeed(`Feature '${feature}' added successfully`);
    return updatedConfig;
  } catch (error) {
    spinner.fail(`Failed to add feature '${feature}'`);
    throw error;
  }
}

/**
 * Create directories needed for a specific feature
 */
async function createFeatureDirectories(projectDir, feature) {
  const directoriesToCreate = [];
  
  switch (feature) {
    case 'navigation':
    case 'drawer':
    case 'tabs':
    case 'stack':
      directoriesToCreate.push('src/navigation');
      break;
    case 'redux':
    case 'zustand':
      directoriesToCreate.push('src/store');
      break;
    case 'api':
      directoriesToCreate.push('src/services');
      break;
    case 'localization':
      directoriesToCreate.push('src/localization');
      break;
    case 'firebase':
      directoriesToCreate.push('src/services/firebase');
      break;
    case 'auth':
      directoriesToCreate.push('src/screens/auth');
      break;
    case 'theme':
      directoriesToCreate.push('src/config/theme');
      break;
    case 'fonts':
      directoriesToCreate.push('src/assets/fonts');
      break;
  }
  
  for (const dir of directoriesToCreate) {
    await fs.ensureDir(path.join(projectDir, dir));
  }
}

/**
 * Update project config with new feature
 */
function updateProjectConfigWithFeature(projectConfig, feature) {
  const updatedConfig = { ...projectConfig };
  
  switch (feature) {
    case 'drawer':
    case 'tabs':
    case 'stack':
      updatedConfig.navigation = feature;
      break;
    case 'redux':
    case 'zustand':
      updatedConfig.state = feature;
      break;
    case 'tailwind':
    case 'styled-components':
      updatedConfig.ui = feature;
      break;
    case 'mmkv':
      updatedConfig.storage = 'mmkv';
      break;
    case 'firebase':
    case 'api':
    case 'theme':
    case 'localization':
    case 'auth':
      updatedConfig[feature] = true;
      break;
  }
  
  return updatedConfig;
}

/**
 * Check if a feature already exists in project config
 */
function featureAlreadyExists(projectConfig, feature) {
  switch (feature) {
    case 'drawer':
    case 'tabs':
    case 'stack':
      return projectConfig.navigation === feature;
    case 'redux':
    case 'zustand':
      return projectConfig.state === feature;
    case 'tailwind':
    case 'styled-components':
      return projectConfig.ui === feature;
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

module.exports = { addFeature };
