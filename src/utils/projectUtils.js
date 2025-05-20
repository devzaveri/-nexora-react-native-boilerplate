const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

/**
 * Utility functions for project operations
 */
class ProjectUtils {
  /**
   * Create React Native project directory structure
   * @param {string} projectDir - Project directory
   * @param {object} config - Project configuration
   */
  static async createProjectStructure(projectDir, config) {
    const spinner = ora('Creating project structure...').start();

    try {
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
        directories.push('src/services/api');
      }

      if (config.firebase) {
        directories.push('src/services/firebase');
      }

      if (config.localization) {
        directories.push('src/localization');
      }

      if (config.auth) {
        directories.push('src/screens/auth');
      }

      if (config.theme) {
        directories.push('src/config/theme');
      }

      // Create directories
      for (const dir of directories) {
        await fs.ensureDir(path.join(projectDir, dir));
      }

      spinner.succeed('Project structure created');
    } catch (error) {
      spinner.fail('Failed to create project structure');
      throw error;
    }
  }

  /**
   * Update project dependencies in package.json
   * @param {string} projectDir - Project directory
   * @param {object} dependencies - Dependencies object with regular and dev dependencies
   */
  static async updatePackageJson(projectDir, dependencies) {
    const packageJsonPath = path.join(projectDir, 'package.json');

    try {
      // Read package.json
      const packageJson = await fs.readJson(packageJsonPath);

      // Add dependencies
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...dependencies.dependencies,
      };

      // Add dev dependencies
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        ...dependencies.devDependencies,
      };

      // Add scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        "pod": "cd ios && pod install && cd ..",
        "clean": "rm -rf node_modules && npm install && npm run pod",
      };

      // Write updated package.json
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      return true;
    } catch (error) {
      console.error(chalk.red('Error updating package.json:'), error.message);
      throw error;
    }
  }

  /**
   * Link assets like fonts
   * @param {string} projectDir - Project directory
   */
  static async linkAssets(projectDir) {
    const spinner = ora('Linking assets...').start();

    try {
      // Check if there are assets to link
      const fontsDir = path.join(projectDir, 'src/assets/fonts');
      if (await fs.pathExists(fontsDir)) {
        // Run react-native link
        await execa('npx', ['react-native', 'link'], { cwd: projectDir });
        spinner.succeed('Assets linked');
      } else {
        spinner.succeed('No assets to link');
      }
    } catch (error) {
      spinner.fail('Failed to link assets');
      throw error;
    }
  }

  /**
   * Update app name in various configuration files
   * @param {string} projectDir - Project directory
   * @param {string} appName - New app name
   */
  static async updateAppName(projectDir, appName) {
    const spinner = ora(`Updating app name to "${appName}"...`).start();

    try {
      // Update app.json
      const appJsonPath = path.join(projectDir, 'app.json');
      if (await fs.pathExists(appJsonPath)) {
        const appJson = await fs.readJson(appJsonPath);
        appJson.name = appName;
        appJson.displayName = appName;
        await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
      }

      // Update package.json
      const packageJsonPath = path.join(projectDir, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = appName.toLowerCase().replace(/\s+/g, '-');
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      spinner.succeed(`App name updated to "${appName}"`);
    } catch (error) {
      spinner.fail(`Failed to update app name to "${appName}"`);
      throw error;
    }
  }

  /**
   * Create gitignore file with appropriate entries
   * @param {string} projectDir - Project directory
   */
  static async createGitignore(projectDir) {
    const gitignorePath = path.join(projectDir, '.gitignore');
    
    // Standard entries for React Native projects
    const gitignoreContent = `
# OSX
#
.DS_Store

# Xcode
#
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
ios/.xcode.env.local

# Android/IntelliJ
#
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/
*.keystore
!debug.keystore

# node.js
#
node_modules/
npm-debug.log
yarn-error.log

# fastlane
#
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots
fastlane/test_output

# Bundle artifact
*.jsbundle

# Ruby / CocoaPods
/ios/Pods/
/vendor/bundle/

# Temporary files created by Metro
.metro-health-check*

# Nexora CLI config
.nexora-cli-config.json

# Environment variables
.env
.env.*
!.env.example
`;

    await fs.writeFile(gitignorePath, gitignoreContent);
  }

  /**
   * Update environment configuration
   * @param {string} projectDir - Project directory
   * @param {object} config - Project configuration
   */
  static async setupEnvironmentConfig(projectDir, config) {
    // Create .env.example file
    const envExamplePath = path.join(projectDir, '.env.example');
    
    let envContent = '# Example Environment Variables\n\n';
    
    // Add variables based on features
    if (config.api) {
      envContent += 'API_URL=https://api.example.com\n';
    }
    
    if (config.firebase) {
      envContent += 'FIREBASE_API_KEY=your_firebase_api_key\n';
      envContent += 'FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain\n';
      envContent += 'FIREBASE_PROJECT_ID=your_firebase_project_id\n';
      envContent += 'FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket\n';
      envContent += 'FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id\n';
      envContent += 'FIREBASE_APP_ID=your_firebase_app_id\n';
    }
    
    await fs.writeFile(envExamplePath, envContent);
  }

  /**
   * Create a README.md file for the project
   * @param {string} projectDir - Project directory
   * @param {object} config - Project configuration
   */
  static async createReadme(projectDir, config) {
    const readmePath = path.join(projectDir, 'README.md');
    
    const readmeContent = `# ${config.name}

A React Native application created with @nexora/react-native-boilerplate.

## Features

${this.getFeaturesList(config)}

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. Clone the repository
2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. For iOS, install CocoaPods dependencies:

\`\`\`bash
cd ios && pod install && cd ..
\`\`\`

### Running the app

\`\`\`bash
# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
\`\`\`

## Project Structure

\`\`\`
src/
├── assets/             # Fonts, images, icons
├── components/         # Reusable UI components
├── config/             # App configuration
├── hooks/              # Custom React hooks
${config.navigation !== 'none' ? '├── navigation/         # Navigation configuration\n' : ''}${config.state !== 'none' ? '├── store/              # State management\n' : ''}${config.services ? '├── services/           # API services\n' : ''}${config.localization ? '├── localization/        # i18n translations\n' : ''}├── screens/            # App screens
└── utils/              # Utility functions
\`\`\`

## Dynamic Feature Management

This project supports dynamic feature management using the @nexora/react-native-boilerplate CLI.

\`\`\`bash
# Add a feature
npx @nexora/react-native-boilerplate add drawer

# Remove a feature
npx @nexora/react-native-boilerplate remove firebase

# Rename the app
npx @nexora/react-native-boilerplate rename "New App Name"

# Configure app settings
npx @nexora/react-native-boilerplate config --theme dark
\`\`\`
`;

    await fs.writeFile(readmePath, readmeContent);
  }

  /**
   * Get a formatted list of project features
   * @param {object} config - Project configuration
   * @returns {string} Formatted list of features
   */
  static getFeaturesList(config) {
    const features = [];
    
    if (config.navigation !== 'none') {
      features.push(`- Navigation: ${config.navigation} navigation`);
    }
    
    if (config.state !== 'none') {
      features.push(`- State Management: ${config.state}`);
    }
    
    if (config.storage === 'mmkv') {
      features.push('- Storage: MMKV for high-performance storage');
    } else {
      features.push('- Storage: AsyncStorage');
    }
    
    if (config.ui !== 'none') {
      features.push(`- UI Framework: ${config.ui}`);
    }
    
    if (config.theme) {
      features.push('- Theme System: Light/dark mode support');
    }
    
    if (config.localization) {
      features.push('- Localization: i18n support');
    }
    
    if (config.api) {
      features.push('- API Services: Axios with service abstraction');
    }
    
    if (config.firebase) {
      features.push('- Firebase Integration: Authentication and Firestore');
    }
    
    if (config.auth) {
      features.push('- Authentication Flow');
    }
    
    return features.join('\n');
  }
}

module.exports = ProjectUtils;
