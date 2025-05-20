const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');
const chalk = require('chalk');

// Register Handlebars helpers
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('neq', function(a, b) {
  return a !== b;
});

Handlebars.registerHelper('contains', function(haystack, needle) {
  return haystack && haystack.includes(needle);
});

/**
 * Template manager for handling dynamic code generation
 */
class TemplateManager {
  /**
   * Generate code from a template string
   * @param {string} template - Template string
   * @param {object} data - Data to populate the template
   * @returns {string} Generated code
   */
  static generateCode(template, data) {
    try {
      const compiledTemplate = Handlebars.compile(template);
      return compiledTemplate(data);
    } catch (error) {
      console.error(chalk.red('Error generating code:'), error.message);
      throw error;
    }
  }

  /**
   * Generate a file from a template
   * @param {string} templatePath - Path to the template
   * @param {string} outputPath - Path to write the generated file
   * @param {object} data - Data to populate the template
   */
  static async generateFile(templatePath, outputPath, data) {
    try {
      // Make sure the directory exists
      await fs.ensureDir(path.dirname(outputPath));

      // If the template doesn't exist, create an empty file
      if (!await fs.pathExists(templatePath)) {
        await fs.writeFile(outputPath, '');
        return;
      }

      // Read the template and generate the content
      const templateContent = await fs.readFile(templatePath, 'utf8');
      const generatedContent = this.generateCode(templateContent, data);

      // Write the generated content to the output file
      await fs.writeFile(outputPath, generatedContent);

    } catch (error) {
      console.error(chalk.red(`Error generating file ${outputPath}:`), error.message);
      throw error;
    }
  }

  /**
   * Generate code for a specific feature
   * @param {string} projectDir - Project directory
   * @param {string} feature - Feature to generate code for
   * @param {object} config - Project configuration
   */
  static async generateFeature(projectDir, feature, config) {
    try {
      const featureTemplates = {
        'navigation': this.generateNavigationFeature,
        'redux': this.generateReduxFeature,
        'zustand': this.generateZustandFeature,
        'theme': this.generateThemeFeature,
        'localization': this.generateLocalizationFeature,
        'api': this.generateApiFeature,
        'firebase': this.generateFirebaseFeature,
        'auth': this.generateAuthFeature,
        'mmkv': this.generateMmkvFeature,
        'styled-components': this.generateStyledComponentsFeature,
        'tailwind': this.generateTailwindFeature,
      };

      if (featureTemplates[feature]) {
        await featureTemplates[feature](projectDir, config);
        console.log(chalk.green(`Generated code for ${feature} feature`));
      } else {
        console.log(chalk.yellow(`No template generator found for feature: ${feature}`));
      }
    } catch (error) {
      console.error(chalk.red(`Error generating feature ${feature}:`), error.message);
      throw error;
    }
  }

  /**
   * Generate navigation feature
   */
  static async generateNavigationFeature(projectDir, config) {
    // Implementation details for generating navigation code
    // This would check config.navigation and generate the appropriate navigation setup
    console.log(chalk.blue('Generating navigation feature...'));
  }

  /**
   * Generate Redux feature
   */
  static async generateReduxFeature(projectDir, config) {
    // Implementation details for generating Redux setup
    console.log(chalk.blue('Generating Redux feature...'));
  }

  /**
   * Generate Zustand feature
   */
  static async generateZustandFeature(projectDir, config) {
    // Implementation details for generating Zustand setup
    console.log(chalk.blue('Generating Zustand feature...'));
  }

  /**
   * Generate theme feature
   */
  static async generateThemeFeature(projectDir, config) {
    // Implementation details for generating theme system
    console.log(chalk.blue('Generating theme feature...'));
  }

  /**
   * Generate localization feature
   */
  static async generateLocalizationFeature(projectDir, config) {
    // Implementation details for generating localization setup
    console.log(chalk.blue('Generating localization feature...'));
  }

  /**
   * Generate API service feature
   */
  static async generateApiFeature(projectDir, config) {
    // Implementation details for generating API service layer
    console.log(chalk.blue('Generating API feature...'));
  }

  /**
   * Generate Firebase feature
   */
  static async generateFirebaseFeature(projectDir, config) {
    // Implementation details for generating Firebase setup
    console.log(chalk.blue('Generating Firebase feature...'));
  }

  /**
   * Generate auth feature
   */
  static async generateAuthFeature(projectDir, config) {
    // Implementation details for generating auth flow
    console.log(chalk.blue('Generating auth feature...'));
  }

  /**
   * Generate MMKV storage feature
   */
  static async generateMmkvFeature(projectDir, config) {
    // Implementation details for generating MMKV storage setup
    console.log(chalk.blue('Generating MMKV feature...'));
  }

  /**
   * Generate styled-components feature
   */
  static async generateStyledComponentsFeature(projectDir, config) {
    // Implementation details for generating styled-components setup
    console.log(chalk.blue('Generating styled-components feature...'));
  }

  /**
   * Generate Tailwind feature
   */
  static async generateTailwindFeature(projectDir, config) {
    // Implementation details for generating Tailwind setup
    console.log(chalk.blue('Generating Tailwind feature...'));
  }
}

module.exports = TemplateManager;
