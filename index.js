#!/usr/bin/env node

// Main entry point for the package
// All functionality is imported from commands directory

module.exports = {
  createProject: require('./src/commands/create'),
  addFeature: require('./src/commands/add'),
  removeFeature: require('./src/commands/remove'),
  renameApp: require('./src/commands/rename'),
  configureApp: require('./src/commands/config'),
};
