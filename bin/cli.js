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
const { updateProject } = require('../src/commands/update');
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

// Configure command
program
  .command('config')
  .description('Configure your React Native project settings')
  .option('--language <language>', 'Change language (JavaScript, TypeScript)')
  .option('--navigation <type>', 'Change navigation type (stack, drawer, tabs, none)')
  .option('--state <manager>', 'Change state management (redux, zustand, none)')
  .option('--ui <framework>', 'Change UI framework (styled-components, tailwind)')
  .option('--storage <type>', 'Change storage type (async-storage, mmkv)')
  .action(async (options) => {
    try {
      await configureApp(options);
    } catch (error) {
      console.error(chalk.red('Error configuring app:'), error);
      process.exit(1);
    }
  });

// Update command
program
  .command('update')
  .description('Update an existing project with the latest template features and fixes')
  .option('--features <features>', 'Comma-separated list of specific features to update')
  .option('--force', 'Force update even if the project is already up to date', false)
  .option('--yes', 'Skip confirmation prompts', false)
  .option('--no-backup', 'Skip creating a backup before updating', false)
  .option('--skip-install', 'Skip installing dependencies after update', false)
  .action(async (options) => {
    try {
      await updateProject(options);
    } catch (error) {
      console.error(chalk.red('Error updating project:'), error);
      process.exit(1);
    }
  });

program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.addHelpText('after', `
Examples:
  $ nexora-rn create MyAwesomeApp
  $ nexora-rn add firebase
  $ nexora-rn remove theme
  $ nexora-rn rename "My New App Name"
  $ nexora-rn config --theme dark
  $ nexora-rn update
  $ nexora-rn update --features navigation,theme
`);

program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
