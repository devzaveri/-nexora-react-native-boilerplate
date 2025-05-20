const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { glob } = require('glob');

/**
 * Clean up files related to a specific feature
 * @param {string} projectDir - Project directory
 * @param {string} feature - Feature to clean up
 */
async function cleanupFeatureFiles(projectDir, feature) {
  // Determine which directories and files to clean up based on feature
  const pathsToRemove = getPathsToRemove(projectDir, feature);
  
  for (const pathToRemove of pathsToRemove) {
    if (await fs.pathExists(pathToRemove)) {
      try {
        if ((await fs.stat(pathToRemove)).isDirectory()) {
          await fs.remove(pathToRemove);
          console.log(chalk.yellow(`Removed directory: ${path.relative(projectDir, pathToRemove)}`));
        } else {
          await fs.remove(pathToRemove);
          console.log(chalk.yellow(`Removed file: ${path.relative(projectDir, pathToRemove)}`));
        }
      } catch (error) {
        console.error(chalk.red(`Error removing ${pathToRemove}: ${error.message}`));
      }
    }
  }
  
  // Some features require modifying existing files rather than removing them
  await modifyExistingFiles(projectDir, feature);
}

/**
 * Get paths to remove based on feature
 */
function getPathsToRemove(projectDir, feature) {
  const pathsToRemove = [];
  
  switch (feature) {
    case 'navigation':
    case 'drawer':
    case 'tabs':
    case 'stack':
      pathsToRemove.push(path.join(projectDir, 'src/navigation'));
      break;
      
    case 'redux':
    case 'zustand':
      pathsToRemove.push(path.join(projectDir, 'src/store'));
      break;
      
    case 'firebase':
      pathsToRemove.push(path.join(projectDir, 'src/services/firebase'));
      break;
      
    case 'api':
      pathsToRemove.push(path.join(projectDir, 'src/services/api'));
      break;
      
    case 'theme':
      pathsToRemove.push(path.join(projectDir, 'src/config/theme'));
      break;
      
    case 'localization':
      pathsToRemove.push(path.join(projectDir, 'src/localization'));
      break;
      
    case 'auth':
      pathsToRemove.push(path.join(projectDir, 'src/screens/auth'));
      break;
  }
  
  return pathsToRemove;
}

/**
 * Modify existing files to remove feature-specific code
 */
async function modifyExistingFiles(projectDir, feature) {
  // Determine which files to modify based on feature
  const extension = await determineProjectLanguage(projectDir);
  const appFile = path.join(projectDir, `App.${extension}`);
  
  if (!await fs.pathExists(appFile)) {
    return;
  }
  
  // Read App file content
  let content = await fs.readFile(appFile, 'utf8');
  
  switch (feature) {
    case 'navigation':
    case 'drawer':
    case 'tabs':
    case 'stack':
      // Remove NavigationContainer and related imports
      content = content.replace(/import.*NavigationContainer.*from.*@react-navigation\/native.*;\n/g, '');
      content = content.replace(/import.*AppNavigator.*from.*src\/navigation.*;\n/g, '');
      content = content.replace(/<NavigationContainer>\s*<AppNavigator\s*\/>\s*<\/NavigationContainer>/g, 
        '<View style={styles.container}><Text>Welcome to your React Native App!</Text></View>');
      
      // Add View and Text imports if they don't exist
      if (!content.includes('import { View, Text')) {
        content = content.replace(/import React from 'react';\n/, 
          "import React from 'react';\nimport { View, Text, StyleSheet } from 'react-native';\n");
      }
      
      // Add styles if they don't exist
      if (!content.includes('const styles = StyleSheet.create(')) {
        content = content.replace(/export default App;/, 
          `const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});\n\nexport default App;`);
      }
      break;
      
    case 'redux':
      // Remove Provider and store imports
      content = content.replace(/import.*Provider.*from.*react-redux.*;\n/g, '');
      content = content.replace(/import.*store.*from.*src\/store.*;\n/g, '');
      content = content.replace(/<Provider\s+store=\{store\}>\s*(.*)\s*<\/Provider>/gs, '$1');
      break;
      
    case 'zustand':
      // Zustand doesn't typically use providers, but we'll remove any imports
      content = content.replace(/import.*from.*zustand.*;\n/g, '');
      break;
      
    case 'theme':
      // Remove ThemeProvider and related imports
      content = content.replace(/import.*ThemeProvider.*from.*src\/config\/theme.*;\n/g, '');
      content = content.replace(/<ThemeProvider>\s*(.*)\s*<\/ThemeProvider>/gs, '$1');
      break;
      
    case 'localization':
      // Remove LocalizationProvider and related imports
      content = content.replace(/import.*LocalizationProvider.*from.*src\/localization.*;\n/g, '');
      content = content.replace(/<LocalizationProvider>\s*(.*)\s*<\/LocalizationProvider>/gs, '$1');
      break;
  }
  
  // Write updated App file
  await fs.writeFile(appFile, content);
  console.log(chalk.green(`Updated: App.${extension} to remove ${feature}`));
}

/**
 * Determine if the project uses JavaScript or TypeScript
 */
async function determineProjectLanguage(projectDir) {
  // Check if App.tsx exists
  if (await fs.pathExists(path.join(projectDir, 'App.tsx'))) {
    return 'tsx';
  }
  
  // Otherwise assume JavaScript
  return 'js';
}

module.exports = {
  cleanupFeatureFiles
};
