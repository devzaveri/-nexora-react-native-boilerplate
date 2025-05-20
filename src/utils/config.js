const fs = require('fs-extra');
const path = require('path');

/**
 * Save project configuration to .nexora-cli-config.json
 * @param {string} projectDir - Project directory
 * @param {object} config - Project configuration
 */
async function saveProjectConfig(projectDir, config) {
  const configPath = path.join(projectDir, '.nexora-cli-config.json');
  try {
    await fs.writeJson(configPath, config, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to save project configuration: ${error.message}`);
  }
}

/**
 * Load project configuration from .nexora-cli-config.json
 * @param {string} projectDir - Project directory
 * @returns {object} Project configuration
 */
async function loadProjectConfig(projectDir) {
  const configPath = path.join(projectDir, '.nexora-cli-config.json');
  try {
    if (await fs.pathExists(configPath)) {
      return await fs.readJson(configPath);
    } else {
      throw new Error('Project configuration not found');
    }
  } catch (error) {
    throw new Error(`Failed to load project configuration: ${error.message}`);
  }
}

/**
 * Get a list of installed features in the project
 * @param {object} projectConfig - Project configuration
 * @returns {array} List of installed features
 */
function getInstalledFeatures(projectConfig) {
  const features = [];
  
  if (projectConfig.navigation !== 'none') {
    features.push('navigation');
    features.push(projectConfig.navigation);
  }
  
  if (projectConfig.state !== 'none') {
    features.push('state');
    features.push(projectConfig.state);
  }
  
  if (projectConfig.ui !== 'none') {
    features.push(projectConfig.ui);
  }
  
  if (projectConfig.storage === 'mmkv') {
    features.push('mmkv');
  }
  
  // Add boolean features
  ['firebase', 'api', 'theme', 'localization', 'auth'].forEach(feature => {
    if (projectConfig[feature]) {
      features.push(feature);
    }
  });
  
  return features;
}

module.exports = {
  saveProjectConfig,
  loadProjectConfig,
  getInstalledFeatures
};
