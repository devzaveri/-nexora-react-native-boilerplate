const execa = require('execa');
const ora = require('ora');
const chalk = require('chalk');

/**
 * Get dependencies based on selected features
 * @param {object} config - Project configuration
 * @returns {object} Dependencies object with regular and dev dependencies
 */
function getDependenciesForFeatures(config) {
  const dependencies = {
    dependencies: [],
    devDependencies: []
  };
  
  // Core dependencies
  dependencies.dependencies.push('@react-navigation/native', 'react-native-screens', 'react-native-safe-area-context');
  
  // Navigation dependencies
  if (config.navigation === 'stack' || config.navigation === 'drawer' || config.navigation === 'tabs') {
    dependencies.dependencies.push('@react-navigation/native-stack');
    
    if (config.navigation === 'drawer') {
      dependencies.dependencies.push('@react-navigation/drawer', 'react-native-gesture-handler', 'react-native-reanimated');
    }
    
    if (config.navigation === 'tabs') {
      dependencies.dependencies.push('@react-navigation/bottom-tabs');
    }
  }
  
  // State management
  if (config.state === 'redux') {
    dependencies.dependencies.push('@reduxjs/toolkit', 'react-redux');
  } else if (config.state === 'zustand') {
    dependencies.dependencies.push('zustand');
  }
  
  // Storage
  if (config.storage === 'async-storage') {
    dependencies.dependencies.push('@react-native-async-storage/async-storage');
  } else if (config.storage === 'mmkv') {
    dependencies.dependencies.push('react-native-mmkv');
  }
  
  // UI framework
  if (config.ui === 'styled-components') {
    dependencies.dependencies.push('styled-components');
    dependencies.devDependencies.push('@types/styled-components');
  } else if (config.ui === 'tailwind') {
    dependencies.dependencies.push('tailwind-rn');
    dependencies.devDependencies.push('postcss', 'autoprefixer', 'tailwindcss');
  }
  
  // API services
  if (config.api) {
    dependencies.dependencies.push('axios');
  }
  
  // Firebase
  if (config.firebase) {
    dependencies.dependencies.push(
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      '@react-native-firebase/firestore',
      '@react-native-firebase/storage',
      '@react-native-firebase/messaging',
      '@react-native-firebase/crashlytics',
      '@react-native-firebase/analytics'
    );
  }
  
  // Localization
  if (config.localization) {
    dependencies.dependencies.push('i18next', 'react-i18next');
  }
  
  // Auth
  if (config.auth) {
    // Auth depends on the chosen auth provider
    if (config.firebase) {
      // Firebase auth already included
    } else {
      dependencies.dependencies.push('jwt-decode', '@react-native-async-storage/async-storage');
    }
  }
  
  // Theme system
  if (config.theme) {
    // No additional packages needed for theme system, it's custom implementation
  }
  
  return dependencies;
}

/**
 * Install dependencies based on selected features
 * @param {string} projectDir - Project directory
 * @param {object} config - Project configuration
 */
async function installDependencies(projectDir, config) {
  const { dependencies, devDependencies } = getDependenciesForFeatures(config);
  
  if (dependencies.length === 0 && devDependencies.length === 0) {
    return;
  }
  
  const spinner = ora('Installing dependencies...').start();
  
  try {
    // Install regular dependencies
    if (dependencies.length > 0) {
      const installCmd = 'npm';
      const installArgs = ['install', '--save', '--legacy-peer-deps', ...dependencies];
      
      await execa(installCmd, installArgs, { cwd: projectDir });
    }
    
    // Install dev dependencies
    if (devDependencies.length > 0) {
      const installCmd = 'npm';
      const installArgs = ['install', '--save-dev', '--legacy-peer-deps', ...devDependencies];
      
      await execa(installCmd, installArgs, { cwd: projectDir });
    }
    
    spinner.succeed('Dependencies installed successfully');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    console.error(chalk.red('Error installing dependencies:'), error.message);
    throw error;
  }
}

/**
 * Uninstall dependencies for a specific feature
 * @param {string} projectDir - Project directory
 * @param {string} feature - Feature to uninstall dependencies for
 */
async function uninstallDependencies(projectDir, feature) {
  const packagesToUninstall = getDependenciesForFeature(feature);
  
  if (packagesToUninstall.length === 0) {
    return;
  }
  
  const spinner = ora(`Uninstalling ${feature} dependencies...`).start();
  
  try {
    const uninstallCmd = 'npm';
    const uninstallArgs = ['uninstall', '--legacy-peer-deps', ...packagesToUninstall];
    
    await execa(uninstallCmd, uninstallArgs, { cwd: projectDir });
    
    spinner.succeed(`${feature} dependencies uninstalled successfully`);
  } catch (error) {
    spinner.fail(`Failed to uninstall ${feature} dependencies`);
    console.error(chalk.red(`Error uninstalling ${feature} dependencies:`), error.message);
    throw error;
  }
}

/**
 * Get dependencies for a specific feature
 * @param {string} feature - Feature to get dependencies for
 * @returns {array} Array of package names
 */
function getDependenciesForFeature(feature) {
  const packages = [];
  
  switch (feature) {
    case 'navigation':
      packages.push('@react-navigation/native', 'react-native-screens', 'react-native-safe-area-context');
      break;
    case 'drawer':
      packages.push('@react-navigation/drawer', 'react-native-gesture-handler', 'react-native-reanimated');
      break;
    case 'tabs':
      packages.push('@react-navigation/bottom-tabs');
      break;
    case 'stack':
      packages.push('@react-navigation/native-stack');
      break;
    case 'redux':
      packages.push('@reduxjs/toolkit', 'react-redux');
      break;
    case 'zustand':
      packages.push('zustand');
      break;
    case 'mmkv':
      packages.push('react-native-mmkv');
      break;
    case 'styled-components':
      packages.push('styled-components', '@types/styled-components');
      break;
    case 'tailwind':
      packages.push('tailwind-rn', 'postcss', 'autoprefixer', 'tailwindcss');
      break;
    case 'api':
      packages.push('axios');
      break;
    case 'firebase':
      packages.push(
        '@react-native-firebase/app',
        '@react-native-firebase/auth',
        '@react-native-firebase/firestore',
        '@react-native-firebase/storage',
        '@react-native-firebase/messaging',
        '@react-native-firebase/crashlytics',
        '@react-native-firebase/analytics'
      );
      break;
    case 'localization':
      packages.push('i18next', 'react-i18next');
      break;
  }
  
  return packages;
}

module.exports = {
  installDependencies,
  uninstallDependencies,
  getDependenciesForFeatures
};
