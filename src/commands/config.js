const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { loadProjectConfig, saveProjectConfig } = require('../utils/config');
const { processTemplates } = require('../utils/templates');

/**
 * Configure app settings
 * @param {object} options - CLI options
 */
async function configureApp(options) {
  const projectDir = path.resolve(process.cwd(), options.path);
  
  // Check if project exists and has config
  if (!fs.existsSync(path.join(projectDir, '.nexora-cli-config.json'))) {
    console.error(chalk.red('Error: Not a Nexora React Native project or missing configuration.'));
    console.log(chalk.yellow('This command can only be run in a project created with @nexora/react-native-boilerplate.'));
    process.exit(1);
  }
  
  // Load project configuration
  const projectConfig = await loadProjectConfig(projectDir);
  
  // If no options are provided, prompt user for configuration
  if (!options.theme && !options.language) {
    const configOptions = await promptConfigOptions(projectConfig);
    options = { ...options, ...configOptions };
  }
  
  // Apply configuration changes
  await applyConfigChanges(projectDir, projectConfig, options);
  
  console.log(chalk.green('\nConfiguration updated successfully! 🎉'));
}

/**
 * Prompt user for configuration options
 */
async function promptConfigOptions(projectConfig) {
  console.log(chalk.blue('Please configure your app settings:'));
  
  const questions = [];
  
  // Only show theme prompt if theme system is enabled
  if (projectConfig.theme) {
    questions.push({
      type: 'list',
      name: 'theme',
      message: 'Select default theme:',
      choices: ['light', 'dark', 'system'],
      default: projectConfig.defaultTheme || 'light',
    });
  }
  
  // Only show language prompt if localization is enabled
  if (projectConfig.localization) {
    // Get available languages from localization files
    const availableLanguages = getAvailableLanguages(projectConfig);
    
    questions.push({
      type: 'list',
      name: 'language',
      message: 'Select default language:',
      choices: availableLanguages,
      default: projectConfig.defaultLanguage || 'en',
    });
  }
  
  // If no configurable options are available
  if (questions.length === 0) {
    console.log(chalk.yellow('No configurable options are available. Enable theme or localization features first.'));
    process.exit(0);
  }
  
  return inquirer.prompt(questions);
}

/**
 * Get available languages from project config
 */
function getAvailableLanguages(projectConfig) {
  // This is a placeholder - in a real implementation, this would read from locale files
  return projectConfig.availableLanguages || ['en', 'es', 'fr', 'de', 'ja'];
}

/**
 * Apply configuration changes to the project
 */
async function applyConfigChanges(projectDir, projectConfig, options) {
  const spinner = ora('Updating configuration...').start();
  
  try {
    const updatedConfig = { ...projectConfig };
    
    // Update theme configuration
    if (options.theme && projectConfig.theme) {
      updatedConfig.defaultTheme = options.theme;
      await updateThemeConfiguration(projectDir, options.theme);
    }
    
    // Update language configuration
    if (options.language && projectConfig.localization) {
      updatedConfig.defaultLanguage = options.language;
      await updateLanguageConfiguration(projectDir, options.language);
    }
    
    // Save updated configuration
    await saveProjectConfig(projectDir, updatedConfig);
    
    // Process templates with updated configuration
    await processTemplates(projectDir, updatedConfig, ['theme', 'localization']);
    
    spinner.succeed('Configuration updated');
  } catch (error) {
    spinner.fail('Failed to update configuration');
    throw error;
  }
}

/**
 * Update theme configuration in the project
 */
async function updateThemeConfiguration(projectDir, theme) {
  const themeConfigPath = path.join(projectDir, 'src/config/theme/index.js');
  
  // Check if theme config exists
  if (await fs.pathExists(themeConfigPath)) {
    try {
      const content = await fs.readFile(themeConfigPath, 'utf8');
      
      // Update default theme in configuration
      const updatedContent = content
        .replace(
          /defaultTheme:\s*['"]light['"]|defaultTheme:\s*['"]dark['"]|defaultTheme:\s*['"]system['"]/g,
          `defaultTheme: '${theme}'`
        );
      
      await fs.writeFile(themeConfigPath, updatedContent, 'utf8');
    } catch (error) {
      throw new Error(`Failed to update theme configuration: ${error.message}`);
    }
  }
}

/**
 * Update language configuration in the project
 */
async function updateLanguageConfiguration(projectDir, language) {
  const i18nConfigPath = path.join(projectDir, 'src/config/i18n.js');
  
  // Check if i18n config exists
  if (await fs.pathExists(i18nConfigPath)) {
    try {
      const content = await fs.readFile(i18nConfigPath, 'utf8');
      
      // Update default language in configuration
      const updatedContent = content
        .replace(
          /defaultLanguage:\s*['"][a-z]{2}['"]/g,
          `defaultLanguage: '${language}'`
        );
      
      await fs.writeFile(i18nConfigPath, updatedContent, 'utf8');
    } catch (error) {
      throw new Error(`Failed to update language configuration: ${error.message}`);
    }
  }
}

module.exports = { configureApp };
