const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const Handlebars = require('handlebars');
const { glob } = require('glob');

/**
 * Process templates for the selected features
 * @param {string} projectDir - Project directory
 * @param {object} config - Project configuration
 * @param {array} specificFeatures - Optional array of specific features to process
 * @param {object} options - Additional options
 * @param {boolean} options.update - Whether this is an update to an existing project
 */
async function processTemplates(projectDir, config, specificFeatures = [], options = {}) {
  const templateDir = path.join(__dirname, '../templates');
  const tempDir = path.join(__dirname, '../.temp');
  
  try {
    // Clean up temporary directory
    await fs.ensureDir(tempDir);
    await fs.emptyDir(tempDir);
    
    // Copy and process templates for each feature
    const featuresToProcess = specificFeatures.length > 0
      ? specificFeatures
      : getFeaturesToProcess(config);
    
    for (const feature of featuresToProcess) {
      await processFeatureTemplates(templateDir, projectDir, tempDir, config, feature, options);
    }
    
    // Process App.(js|tsx) file
    await processAppFile(projectDir, config, options);
    
    // Clean up
    await fs.remove(tempDir);
  } catch (error) {
    console.error(chalk.red('Error processing templates:'), error);
    throw error;
  }
}

/**
 * Get list of features to process templates for
 */
function getFeaturesToProcess(config) {
  const features = ['core'];
  
  if (config.specificFeature) {
    features.push(config.specificFeature);
    return features;
  }
  
  // Handle navigation types (can be an array for multiple types)
  if (config.navigation && config.navigation !== 'none') {
    features.push('navigation');
    
    // Handle multiple navigation types
    if (Array.isArray(config.navigation)) {
      // Add each navigation type as a feature
      config.navigation.forEach(navType => {
        if (navType !== 'none') {
          features.push(navType);
        }
      });
    } else {
      // Single navigation type
      features.push(config.navigation);
    }
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

/**
 * Process templates for a specific feature
 * @param {string} templateDir - Template directory
 * @param {string} projectDir - Project directory
 * @param {string} tempDir - Temporary directory
 * @param {object} config - Project configuration
 * @param {string} feature - Feature to process
 * @param {object} options - Additional options
 * @param {boolean} options.update - Whether this is an update to an existing project
 */
async function processFeatureTemplates(templateDir, projectDir, tempDir, config, feature, options = {}) {
  // Determine language folder to use
  const languageFolder = config.language === 'TypeScript' ? 'typescript' : 'javascript';
  const featureTemplateDir = path.join(templateDir, feature, languageFolder);
  
  if (!await fs.pathExists(featureTemplateDir)) {
    console.log(chalk.yellow(`No templates found for feature: ${feature}`));
    return;
  }
  
  // Get all template files for the selected language only
  const templateFiles = await glob('**/*', { cwd: featureTemplateDir, nodir: true });
  
  // Make sure we only process files for the selected language
  const isTypeScript = config.language === 'TypeScript';
  
  for (const templateFile of templateFiles) {
    // Skip any TypeScript files if JavaScript is selected, and vice versa
    if (!isTypeScript && templateFile.endsWith('.tsx')) continue;
    if (!isTypeScript && templateFile.endsWith('.ts')) continue;
    if (isTypeScript && templateFile.endsWith('.jsx')) continue;
    if (isTypeScript && templateFile.endsWith('.js') && !templateFile.includes('babel.config.js') && !templateFile.includes('metro.config.js')) continue;
    
    const templatePath = path.join(featureTemplateDir, templateFile);
    const outputPath = path.join(projectDir, templateFile.replace('__NAME__', config.name));
    
    // Create directory if it doesn't exist
    await fs.ensureDir(path.dirname(outputPath));
    
    // Process template with Handlebars
    let templateContent = await fs.readFile(templatePath, 'utf8');

    // Pre-process React Native JSX syntax to avoid conflicts with Handlebars
    // Replace React Native style double curly braces with placeholders
    let templatePlaceholders = {};
    
    // 1. Handle trackColor={{ false: colors.border, true: colors.primary }}
    templatePlaceholders.trackColor = templateContent.match(/trackColor={{\s*false:\s*colors\.\w+,\s*true:\s*colors\.\w+\s*}}/g) || [];
    for (let i = 0; i < templatePlaceholders.trackColor.length; i++) {
      templateContent = templateContent.replace(templatePlaceholders.trackColor[i], `trackColor=PLACEHOLDER_TRACKCOLOR_${i}`);
    }
    
    // 2. Handle screenOptions={{ headerShown: true, ... }}
    templatePlaceholders.screenOptions = templateContent.match(/screenOptions={{[\s\S]*?}}/g) || [];
    for (let i = 0; i < templatePlaceholders.screenOptions.length; i++) {
      templateContent = templateContent.replace(templatePlaceholders.screenOptions[i], `screenOptions=PLACEHOLDER_SCREENOPTIONS_${i}`);
    }
    
    // 3. Handle any other JSX props with double curly braces
    templatePlaceholders.jsxProps = templateContent.match(/\w+={{[\s\S]*?}}/g) || [];
    // Filter out already processed placeholders
    templatePlaceholders.jsxProps = templatePlaceholders.jsxProps.filter(prop => 
      !templatePlaceholders.trackColor.includes(prop) && 
      !templatePlaceholders.screenOptions.includes(prop)
    );
    for (let i = 0; i < templatePlaceholders.jsxProps.length; i++) {
      templateContent = templateContent.replace(templatePlaceholders.jsxProps[i], `jsxprop=PLACEHOLDER_JSXPROP_${i}`);
    }

    // Compile the template
    const template = Handlebars.compile(templateContent);
    let processedContent = template({ ...config, projectName: config.name });

    // Post-process to restore React Native JSX syntax
    // 1. Restore trackColor placeholders
    for (let i = 0; i < templatePlaceholders.trackColor.length; i++) {
      processedContent = processedContent.replace(`trackColor=PLACEHOLDER_TRACKCOLOR_${i}`, templatePlaceholders.trackColor[i]);
    }
    
    // 2. Restore screenOptions placeholders
    for (let i = 0; i < templatePlaceholders.screenOptions.length; i++) {
      processedContent = processedContent.replace(`screenOptions=PLACEHOLDER_SCREENOPTIONS_${i}`, templatePlaceholders.screenOptions[i]);
    }
    
    // 3. Restore other JSX props placeholders
    for (let i = 0; i < templatePlaceholders.jsxProps.length; i++) {
      processedContent = processedContent.replace(`jsxprop=PLACEHOLDER_JSXPROP_${i}`, templatePlaceholders.jsxProps[i]);
    }
    
    // Check if this is an update and the file already exists
    const fileExists = await fs.pathExists(outputPath);
    
    if (options.update && fileExists) {
      // In update mode, we need to be careful about overwriting user-modified files
      // Read the existing file content
      const existingContent = await fs.readFile(outputPath, 'utf8');
      
      // Only update the file if it's different from the template
      if (existingContent !== processedContent) {
        // Write processed template to output path
        await fs.writeFile(outputPath, processedContent);
        console.log(chalk.green(`Updated: ${path.relative(projectDir, outputPath)}`));
      } else {
        console.log(chalk.gray(`Skipped (unchanged): ${path.relative(projectDir, outputPath)}`));
      }
    } else {
      // In create mode or if the file doesn't exist yet
      // Write processed template to output path
      await fs.writeFile(outputPath, processedContent);
      console.log(chalk.green(`Created: ${path.relative(projectDir, outputPath)}`));
    }
  }
}

/**
 * Process the main App.(js|tsx) file based on selected features
 * @param {string} projectDir - Project directory
 * @param {object} config - Project configuration
 * @param {object} options - Additional options
 * @param {boolean} options.update - Whether this is an update to an existing project
 */
async function processAppFile(projectDir, config, options = {}) {
  const extension = config.language === 'TypeScript' ? 'tsx' : 'js';
  const appFile = path.join(projectDir, `App.${extension}`);
  
  if (!await fs.pathExists(appFile)) {
    console.log(chalk.yellow(`App.${extension} not found, skipping modification`));
    return;
  }
  
  // Read App file content
  let content = await fs.readFile(appFile, 'utf8');
  
  // Create a new App file based on the features
  const imports = [];
  const providers = [];
  const providerClosings = [];
  
  // Add navigation
  if (config.navigation !== 'none') {
    imports.push(`import { NavigationContainer } from '@react-navigation/native';`);
    imports.push(`import { AppNavigator } from './src/navigation';`);
    
    providers.push(`<NavigationContainer>`);
    providerClosings.push(`</NavigationContainer>`);
  }
  
  // Add Redux provider
  if (config.state === 'redux') {
    imports.push(`import { Provider } from 'react-redux';`);
    imports.push(`import { store } from './src/store';`);
    
    providers.unshift(`<Provider store={store}>`);
    providerClosings.push(`</Provider>`);
  }
  
  // Add theme provider
  if (config.theme) {
    imports.push(`import { ThemeProvider } from './src/config/theme';`);
    
    providers.unshift(`<ThemeProvider>`);
    providerClosings.push(`</ThemeProvider>`);
  }
  
  // Add localization provider
  if (config.localization) {
    imports.push(`import { LocalizationProvider } from './src/localization';`);
    
    providers.unshift(`<LocalizationProvider>`);
    providerClosings.push(`</LocalizationProvider>`);
  }
  
  // Build App component with all providers
  let appComponent = '';
  if (config.navigation !== 'none') {
    appComponent = '<AppNavigator />';
  } else {
    appComponent = '<View style={styles.container}><Text>Welcome to {config.name}!</Text></View>';
    imports.push(`import { View, Text, StyleSheet } from 'react-native';`);
  }
  
  // Wrap the app component with providers
  for (let i = 0; i < providers.length; i++) {
    appComponent = `${providers[i]}
  ${appComponent}
  ${providerClosings[i]}`;
  }
  
  // Create the complete App component
  const appContent = `
${imports.join('\n')}
${config.language === 'TypeScript' ? '\nimport React from \'react\';' : '\nimport React from \'react\';'}

${config.language === 'TypeScript' ? 'const App = () => {' : 'function App() {'}
  return (
  ${appComponent}
  );
}

${!config.navigation ? `
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
` : ''}

export default App;
`;

  // In update mode, check if the file has changed before overwriting
  if (options.update) {
    // Read the existing file content
    const existingContent = await fs.readFile(appFile, 'utf8');
    
    // Only update the file if it's different from the template
    if (existingContent !== appContent) {
      // Write updated App file
      await fs.writeFile(appFile, appContent);
      console.log(chalk.green(`Updated: App.${extension}`));
    } else {
      console.log(chalk.gray(`Skipped updating App.${extension} (unchanged)`));
    }
  } else {
    // Write updated App file
    await fs.writeFile(appFile, appContent);
    console.log(chalk.green(`Updated: App.${extension}`));
  }
}

module.exports = {
  processTemplates
};
