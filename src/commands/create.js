const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const execa = require('execa');
const { installDependencies } = require('../utils/dependencies');
const { processTemplates } = require('../utils/templates');
const ProjectUtils = require('../utils/projectUtils');
const FeatureManager = require('../utils/featureManager');
const TemplateManager = require('../utils/templateManager');
const { saveProjectConfig } = require('../utils/config');

/**
 * Creates a new React Native project with selected features
 * @param {string} projectName - Name of the project
 * @param {object} options - CLI options
 */
async function createProject(projectName, options) {
  console.log(chalk.blue(`Creating a new React Native project: ${chalk.bold(projectName)}`));
  
  // Process navigation option if it's a comma-separated string
  if (typeof options.navigation === 'string' && options.navigation.includes(',')) {
    options.navigation = options.navigation.split(',').map(type => type.trim());
  }
  
  // If not skipping prompts, present interactive options
  const projectConfig = !options.skipPrompts
    ? await promptForOptions(projectName, options)
    : {
        ...options,
        name: projectName,
      };
  
  // Create project directory if it doesn't exist
  const projectDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(projectDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${projectName} already exists. Do you want to overwrite it?`,
        default: false,
      },
    ]);
    
    if (!overwrite) {
      console.log(chalk.yellow('Project creation canceled.'));
      return;
    }
    
    fs.removeSync(projectDir);
  }
  
  // Create the React Native project
  await createReactNativeProject(projectName, projectConfig);
  
  // Process templates and add features
  await customizeProject(projectDir, projectConfig);
  
  console.log(chalk.green('\nProject created successfully! 🎉'));
  console.log(`
${chalk.bold('Next steps:')}
  1. ${chalk.cyan(`cd ${projectName}`)}
  2. ${chalk.cyan('npx react-native run-android')} or ${chalk.cyan('npx react-native run-ios')}
  
${chalk.bold('To add features later:')}
  ${chalk.cyan('npx @nexora/react-native-boilerplate add <feature>')}
  `);
}

/**
 * Interactive prompts for project configuration
 */
async function promptForOptions(projectName, cliOptions) {
  console.log(chalk.blue('Please configure your project:'));
  
  const questions = [
    {
      type: 'list',
      name: 'language',
      message: 'Which language would you like to use?',
      choices: ['JavaScript', 'TypeScript'],
      default: cliOptions.language || 'TypeScript',
    },
    {
      type: 'checkbox',
      name: 'navigation',
      message: 'Which navigation types would you like to use? (Select multiple if needed)',
      choices: [
        { name: 'Stack Navigation', value: 'stack' },
        { name: 'Bottom Tabs Navigation', value: 'tabs' },
        { name: 'Drawer Navigation', value: 'drawer' }
      ],
      default: cliOptions.navigation ? [cliOptions.navigation] : ['stack'],
      validate: (input) => input.length > 0 || 'Please select at least one navigation type, or none if you don\'t need navigation'
    },
    {
      type: 'list',
      name: 'state',
      message: 'Which state management solution would you like to use?',
      choices: ['redux', 'zustand', 'none'],
      default: cliOptions.state || 'none',
    },
    {
      type: 'confirm',
      name: 'theme',
      message: 'Would you like to include a theme system?',
      default: cliOptions.theme || false,
    },
    {
      type: 'confirm',
      name: 'localization',
      message: 'Would you like to include localization support?',
      default: cliOptions.localization || false,
    },
    {
      type: 'confirm',
      name: 'firebase',
      message: 'Would you like to include Firebase setup?',
      default: cliOptions.firebase || false,
    },
    {
      type: 'confirm',
      name: 'api',
      message: 'Would you like to include a REST API service layer?',
      default: cliOptions.api || false,
    },
    {
      type: 'list',
      name: 'storage',
      message: 'Which storage solution would you like to use?',
      choices: ['async-storage', 'mmkv'],
      default: cliOptions.storage || 'async-storage',
    },
    {
      type: 'list',
      name: 'ui',
      message: 'Which UI framework would you like to use?',
      choices: ['styled-components', 'tailwind'],
      default: cliOptions.ui || 'styled-components',
    },
    {
      type: 'confirm',
      name: 'sampleScreens',
      message: 'Would you like to include sample screens?',
      default: cliOptions.sampleScreens || false,
    },
  ];
  
  const answers = await inquirer.prompt(questions);
  
  return {
    ...answers,
    name: projectName,
  };
}

/**
 * Creates a vanilla React Native project using the CLI
 */
async function createReactNativeProject(projectName, config) {
  const spinner = ora('Creating React Native project...').start();
  
  try {
    // Initialize React Native project with the recommended React Native Community CLI
    await execa('npx', [
      '@react-native-community/cli',
      'init',
      projectName,
      config.language === 'TypeScript' ? '--template react-native-template-typescript' : ''
    ]);
    
    spinner.succeed('React Native project created');
  } catch (error) {
    spinner.fail('Failed to create React Native project');
    console.error('Error details:', error.stderr || error.message);
    throw new Error('Failed to create React Native project. Please make sure you have the latest Node.js and npm installed.');
  }
}

/**
 * Customizes the project with selected features
 */
async function customizeProject(projectDir, config) {
  const spinner = ora('Customizing project...').start();
  
  try {
    // Create project structure
    await ProjectUtils.createProjectStructure(projectDir, config);
    
    // Install dependencies based on selected features
    await installDependencies(projectDir, config);
    
    // Process templates for selected features
    await processTemplates(projectDir, config);
    
    // Save project configuration
    await saveProjectConfig(projectDir, config);
    
    spinner.succeed('Project customized successfully');
  } catch (error) {
    spinner.fail('Failed to customize project');
    throw error;
  }
}

/**
 * Creates the project directory structure based on selected features
 */
async function createProjectStructure(projectDir, config) {
  // Create base directories
  const directories = [
    'src/assets',
    'src/components',
    'src/config',
    'src/hooks',
    'src/utils',
    'src/screens',
  ];
  
  // Add feature-specific directories
  if (config.navigation !== 'none') {
    directories.push('src/navigation');
  }
  
  if (config.state !== 'none') {
    directories.push('src/store');
  }
  
  if (config.api) {
    directories.push('src/services');
  }
  
  if (config.localization) {
    directories.push('src/localization');
  }
  
  // Create directories
  for (const dir of directories) {
    await fs.ensureDir(path.join(projectDir, dir));
  }
}

/**
 * Get list of selected features from config
 * @param {object} config - Project configuration
 * @returns {array} Array of selected features
 */
function getSelectedFeatures(config) {
  const features = ['core'];
  
  if (config.navigation !== 'none') {
    features.push('navigation');
    features.push(config.navigation);
  }
  
  if (config.state !== 'none') {
    features.push(config.state);
  }
  
  if (config.ui !== 'none') {
    features.push(config.ui);
  }
  
  if (config.storage === 'mmkv') {
    features.push('mmkv');
  } else {
    features.push('async-storage');
  }
  
  // Add boolean features
  ['firebase', 'api', 'theme', 'localization', 'auth'].forEach(feature => {
    if (config[feature]) {
      features.push(feature);
    }
  });
  
  return features;
}

module.exports = { createProject };
