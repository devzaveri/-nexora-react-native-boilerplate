#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const ora = require('ora');
const { createProject } = require('../src/commands/create');
const { addFeature } = require('../src/commands/add');
const { removeFeature } = require('../src/commands/remove');
const { renameApp } = require('../src/commands/rename');
const { configureApp } = require('../src/commands/config');
const packageJson = require('../package.json');

// Print banner
console.log(chalk.blue(`
╔═╗ ╔╗                                
║║╚╗║║                                
║╔╗╚╝║╔══╗╔╗╔╗╔══╗╔═╗ ╔══╗  ╔═╗╔══╗  
║║╚╗║║║╔╗║║║║║║╔╗║║╔╗╗║╔╗╝  ║╔╝╚ ╗║  
║║ ║║║║║═╣║╚╝║║║═╣║║║║║╚╗╗  ║║ ║╚╝╚╗ 
╚╝ ╚═╝╚══╝╚══╝╚══╝╚╝╚╝╚═╝╚  ╚╝ ╚═══╝ 
`));
console.log(chalk.blue(`React Native Boilerplate CLI v${packageJson.version}`));
console.log(chalk.blue('A developer-first React Native project generator'));
console.log('');

program
  .version(packageJson.version)
  .description('Create and manage your React Native projects with dynamic features');

// Main command to create a new project
program
  .command('create <projectName>')
  .description('Create a new React Native project with selected features')
  .option('--language <language>', 'Choose JavaScript or TypeScript', 'TypeScript')
  .option('--navigation <types>', 'Choose navigation types (comma-separated: stack,tabs,drawer)', 'stack')
  .option('--state <manager>', 'Choose state management (redux, zustand, none)', 'none')
  .option('--theme', 'Include theme system', false)
  .option('--localization', 'Include localization support', false)
  .option('--firebase', 'Include Firebase setup', false)
  .option('--api', 'Include REST API service layer', false)
  .option('--storage <type>', 'Choose storage type (async-storage, mmkv)', 'async-storage')
  .option('--ui <framework>', 'Choose UI framework (styled-components, tailwind)', 'styled-components')
  .option('--sample-screens', 'Include sample screens', false)
  .option('--skipPrompts', 'Skip interactive prompts and use command line options', false)
  .action(async (projectName, options) => {
    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error);
      process.exit(1);
    }
  });

// Add a feature to an existing project
program
  .command('add <feature>')
  .description('Add a feature to an existing project')
  .option('-p, --path <path>', 'Path to the project', '.')
  .action(async (feature, options) => {
    try {
      await addFeature(feature, options);
    } catch (error) {
      console.error(chalk.red(`Error adding ${feature}:`), error);
      process.exit(1);
    }
  });

// Remove a feature from an existing project
program
  .command('remove <feature>')
  .description('Remove a feature from an existing project')
  .option('-p, --path <path>', 'Path to the project', '.')
  .action(async (feature, options) => {
    try {
      await removeFeature(feature, options);
    } catch (error) {
      console.error(chalk.red(`Error removing ${feature}:`), error);
      process.exit(1);
    }
  });

// Rename the app
program
  .command('rename <newName>')
  .description('Rename the React Native app')
  .option('-p, --path <path>', 'Path to the project', '.')
  .action(async (newName, options) => {
    try {
      await renameApp(newName, options);
    } catch (error) {
      console.error(chalk.red('Error renaming app:'), error);
      process.exit(1);
    }
  });

// Configure app settings
program
  .command('config')
  .description('Configure app settings')
  .option('-p, --path <path>', 'Path to the project', '.')
  .option('--theme <theme>', 'Set default theme (light, dark)')
  .option('--language <language>', 'Set default language')
  .action(async (options) => {
    try {
      await configureApp(options);
    } catch (error) {
      console.error(chalk.red('Error configuring app:'), error);
      process.exit(1);
    }
  });

// Default command when no args are provided
program.addHelpText('after', `
Examples:
  $ nexora-rn create MyAwesomeApp
  $ nexora-rn add drawer
  $ nexora-rn remove firebase
  $ nexora-rn rename "New App Name"
  $ nexora-rn config --theme dark

Or use with npx:
  $ npx @nexora/react-native-boilerplate create MyAwesomeApp
`);

program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
