const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const execa = require('execa');
const { loadProjectConfig, saveProjectConfig } = require('./config');
const TemplateManager = require('./templateManager');

/**
 * Manages feature operations in the React Native project
 */
class FeatureManager {
  /**
   * Add a feature to a project
   * @param {string} projectDir - Project directory
   * @param {string} feature - Feature to add
   */
  static async addFeature(projectDir, feature) {
    const spinner = ora(`Adding ${feature} feature...`).start();

    try {
      // Load project config
      const config = await loadProjectConfig(projectDir);

      // Check if feature is already installed
      if (this.isFeatureInstalled(config, feature)) {
        spinner.info(`Feature ${feature} is already installed.`);
        return config;
      }

      // Update config with the new feature
      const updatedConfig = this.updateConfigWithFeature(config, feature, true);

      // Install dependencies
      await this.installFeatureDependencies(projectDir, feature);

      // Generate feature code
      await TemplateManager.generateFeature(projectDir, feature, updatedConfig);

      // Save updated config
      await saveProjectConfig(projectDir, updatedConfig);

      spinner.succeed(`Added ${feature} feature successfully!`);
      return updatedConfig;
    } catch (error) {
      spinner.fail(`Failed to add ${feature} feature`);
      throw error;
    }
  }

  /**
   * Remove a feature from a project
   * @param {string} projectDir - Project directory
   * @param {string} feature - Feature to remove
   */
  static async removeFeature(projectDir, feature) {
    const spinner = ora(`Removing ${feature} feature...`).start();

    try {
      // Load project config
      const config = await loadProjectConfig(projectDir);

      // Check if feature is installed
      if (!this.isFeatureInstalled(config, feature)) {
        spinner.info(`Feature ${feature} is not installed.`);
        return config;
      }

      // Update config to remove the feature
      const updatedConfig = this.updateConfigWithFeature(config, feature, false);

      // Uninstall dependencies
      await this.uninstallFeatureDependencies(projectDir, feature);

      // Clean up feature files
      await this.cleanupFeatureFiles(projectDir, feature);

      // Update App files and configurations
      await this.updateAppForFeatureRemoval(projectDir, feature, updatedConfig);

      // Save updated config
      await saveProjectConfig(projectDir, updatedConfig);

      spinner.succeed(`Removed ${feature} feature successfully!`);
      return updatedConfig;
    } catch (error) {
      spinner.fail(`Failed to remove ${feature} feature`);
      throw error;
    }
  }

  /**
   * Check if a feature is installed in the project
   * @param {object} config - Project configuration
   * @param {string} feature - Feature to check
   * @returns {boolean} True if the feature is installed
   */
  static isFeatureInstalled(config, feature) {
    switch (feature) {
      case 'navigation':
        const navTypes = Array.isArray(config.navigation) ? config.navigation : [config.navigation];
        return navTypes.length > 0 && !navTypes.includes('none');
      case 'drawer':
        const drawerNav = Array.isArray(config.navigation) ? config.navigation : [config.navigation];
        return drawerNav.includes('drawer');
      case 'tabs':
        const tabsNav = Array.isArray(config.navigation) ? config.navigation : [config.navigation];
        return tabsNav.includes('tabs');
      case 'stack':
        const stackNav = Array.isArray(config.navigation) ? config.navigation : [config.navigation];
        return stackNav.includes('stack');
      case 'redux':
        return config.state === 'redux';
      case 'zustand':
        return config.state === 'zustand';
      case 'mmkv':
        return config.storage === 'mmkv';
      case 'styled-components':
        return config.ui === 'styled-components';
      case 'tailwind':
        return config.ui === 'tailwind';
      case 'theme':
      case 'localization':
      case 'api':
      case 'firebase':
      case 'auth':
        return config[feature] === true;
      default:
        return false;
    }
  }

  /**
   * Update project config with a feature's enabled/disabled status
   * @param {object} config - Project configuration
   * @param {string} feature - Feature to update
   * @param {boolean} enable - Whether to enable or disable the feature
   * @returns {object} Updated configuration
   */
  static updateConfigWithFeature(config, feature, enable) {
    const updatedConfig = { ...config };

    switch (feature) {
      case 'navigation':
        updatedConfig.navigation = enable ? ['stack'] : [];
        break;
      case 'drawer':
        if (enable) {
          // Add drawer to navigation types if not already present
          const navTypes = Array.isArray(updatedConfig.navigation) ? updatedConfig.navigation : [updatedConfig.navigation];
          if (!navTypes.includes('drawer')) {
            updatedConfig.navigation = Array.isArray(updatedConfig.navigation) ? 
              [...updatedConfig.navigation, 'drawer'] : 
              [updatedConfig.navigation, 'drawer'];
          }
        } else {
          // Remove drawer from navigation types
          updatedConfig.navigation = Array.isArray(updatedConfig.navigation) ?
            updatedConfig.navigation.filter(type => type !== 'drawer') :
            (updatedConfig.navigation === 'drawer' ? [] : [updatedConfig.navigation]);
        }
        break;
      case 'tabs':
        if (enable) {
          // Add tabs to navigation types if not already present
          const navTypes = Array.isArray(updatedConfig.navigation) ? updatedConfig.navigation : [updatedConfig.navigation];
          if (!navTypes.includes('tabs')) {
            updatedConfig.navigation = Array.isArray(updatedConfig.navigation) ? 
              [...updatedConfig.navigation, 'tabs'] : 
              [updatedConfig.navigation, 'tabs'];
          }
        } else {
          // Remove tabs from navigation types
          updatedConfig.navigation = Array.isArray(updatedConfig.navigation) ?
            updatedConfig.navigation.filter(type => type !== 'tabs') :
            (updatedConfig.navigation === 'tabs' ? [] : [updatedConfig.navigation]);
        }
        break;
      case 'stack':
        if (enable) {
          // Add stack to navigation types if not already present
          const navTypes = Array.isArray(updatedConfig.navigation) ? updatedConfig.navigation : [updatedConfig.navigation];
          if (!navTypes.includes('stack')) {
            updatedConfig.navigation = Array.isArray(updatedConfig.navigation) ? 
              [...updatedConfig.navigation, 'stack'] : 
              [updatedConfig.navigation, 'stack'];
          }
        } else {
          // Remove stack from navigation types
          updatedConfig.navigation = Array.isArray(updatedConfig.navigation) ?
            updatedConfig.navigation.filter(type => type !== 'stack') :
            (updatedConfig.navigation === 'stack' ? [] : [updatedConfig.navigation]);
        }
        break;
      case 'redux':
        updatedConfig.state = enable ? 'redux' : 'none';
        break;
      case 'zustand':
        updatedConfig.state = enable ? 'zustand' : 'none';
        break;
      case 'mmkv':
        updatedConfig.storage = enable ? 'mmkv' : 'async-storage';
        break;
      case 'styled-components':
        updatedConfig.ui = enable ? 'styled-components' : 'none';
        break;
      case 'tailwind':
        updatedConfig.ui = enable ? 'tailwind' : 'none';
        break;
      case 'theme':
      case 'localization':
      case 'api':
      case 'firebase':
      case 'auth':
        updatedConfig[feature] = enable;
        break;
    }

    return updatedConfig;
  }

  /**
   * Install dependencies for a specific feature
   * @param {string} projectDir - Project directory
   * @param {string} feature - Feature to install dependencies for
   */
  static async installFeatureDependencies(projectDir, feature) {
    const dependencies = this.getFeatureDependencies(feature);

    if (dependencies.length === 0) {
      return;
    }

    const spinner = ora(`Installing dependencies for ${feature}...`).start();

    try {
      await execa('npm', ['install', '--save', ...dependencies], { cwd: projectDir });
      spinner.succeed(`Dependencies for ${feature} installed`);
    } catch (error) {
      spinner.fail(`Failed to install dependencies for ${feature}`);
      throw error;
    }
  }

  /**
   * Uninstall dependencies for a specific feature
   * @param {string} projectDir - Project directory
   * @param {string} feature - Feature to uninstall dependencies for
   */
  static async uninstallFeatureDependencies(projectDir, feature) {
    const dependencies = this.getFeatureDependencies(feature);

    if (dependencies.length === 0) {
      return;
    }

    const spinner = ora(`Uninstalling dependencies for ${feature}...`).start();

    try {
      await execa('npm', ['uninstall', ...dependencies], { cwd: projectDir });
      spinner.succeed(`Dependencies for ${feature} uninstalled`);
    } catch (error) {
      spinner.fail(`Failed to uninstall dependencies for ${feature}`);
      throw error;
    }
  }

  /**
   * Get dependencies for a specific feature
   * @param {string} feature - Feature to get dependencies for
   * @returns {Array} Array of dependencies
   */
  static getFeatureDependencies(feature) {
    switch (feature) {
      case 'navigation':
      case 'drawer':
      case 'tabs':
      case 'stack':
        return ['@react-navigation/native', 'react-native-screens', 'react-native-safe-area-context'];
      case 'drawer':
        return ['@react-navigation/drawer', 'react-native-gesture-handler', 'react-native-reanimated'];
      case 'tabs':
        return ['@react-navigation/bottom-tabs'];
      case 'stack':
        return ['@react-navigation/native-stack'];
      case 'redux':
        return ['@reduxjs/toolkit', 'react-redux'];
      case 'zustand':
        return ['zustand'];
      case 'mmkv':
        return ['react-native-mmkv'];
      case 'styled-components':
        return ['styled-components', '@types/styled-components'];
      case 'tailwind':
        return ['tailwind-rn', 'tailwindcss', 'postcss', 'autoprefixer'];
      case 'api':
        return ['axios'];
      case 'firebase':
        return ['@react-native-firebase/app', '@react-native-firebase/auth', '@react-native-firebase/firestore'];
      case 'localization':
        return ['i18next', 'react-i18next'];
      case 'auth':
        return [];  // Auth uses either Firebase or custom implementation
      case 'theme':
        return [];  // Theme system is custom implementation
      default:
        return [];
    }
  }

  /**
   * Clean up files related to a specific feature
   * @param {string} projectDir - Project directory
   * @param {string} feature - Feature to clean up
   */
  static async cleanupFeatureFiles(projectDir, feature) {
    const directories = this.getFeatureDirectories(feature);

    for (const dir of directories) {
      const fullPath = path.join(projectDir, dir);
      if (await fs.pathExists(fullPath)) {
        await fs.remove(fullPath);
      }
    }
  }

  /**
   * Get directories related to a specific feature
   * @param {string} feature - Feature to get directories for
   * @returns {Array} Array of directories
   */
  static getFeatureDirectories(feature) {
    switch (feature) {
      case 'navigation':
      case 'drawer':
      case 'tabs':
      case 'stack':
        return ['src/navigation'];
      case 'redux':
      case 'zustand':
        return ['src/store'];
      case 'api':
        return ['src/services/api'];
      case 'firebase':
        return ['src/services/firebase'];
      case 'localization':
        return ['src/localization'];
      case 'auth':
        return ['src/screens/auth'];
      case 'theme':
        return ['src/config/theme'];
      default:
        return [];
    }
  }

  /**
   * Update App files and configurations when a feature is removed
   * @param {string} projectDir - Project directory
   * @param {string} feature - Removed feature
   * @param {object} updatedConfig - Updated project configuration
   */
  static async updateAppForFeatureRemoval(projectDir, feature, updatedConfig) {
    // This would update the main App.js/App.tsx file to remove references to the feature
    // Implementation would depend on the specific feature being removed
    
    // Determine if the project is JavaScript or TypeScript
    const isTypeScript = await fs.pathExists(path.join(projectDir, 'tsconfig.json'));
    const appFileName = isTypeScript ? 'App.tsx' : 'App.js';
    const appFilePath = path.join(projectDir, appFileName);

    // Implement feature-specific App file updates
    // For a complete implementation, each feature would have its own update logic
    console.log(chalk.blue(`Updating ${appFileName} for ${feature} removal...`));
  }
}

module.exports = FeatureManager;
