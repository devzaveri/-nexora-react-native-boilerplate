<div align="center">
  <h1>Nexora React Native Boilerplate CLI</h1>
  <p><strong>A powerful CLI tool for generating fully dynamic, developer-first React Native boilerplates</strong></p>
  <br/>
</div>

![Version](https://img.shields.io/npm/v/@nexora/react-native-boilerplate)
![License](https://img.shields.io/npm/l/@nexora/react-native-boilerplate)
![Downloads](https://img.shields.io/npm/dt/@nexora/react-native-boilerplate)

## 🚀 Overview

The **Nexora React Native Boilerplate CLI** is a comprehensive tool designed to streamline React Native development by providing a fully customizable and dynamic project structure. Unlike other boilerplates that are static, this CLI allows you to add, remove, and modify features at any point during your project's lifecycle.

### Key Capabilities

- **Dynamic Project Management**: Add or remove features at any stage of development
- **Feature-Rich Templates**: Navigation, state management, UI frameworks, and more
- **Multiple Navigation Support**: Combine stack, tabs, and drawer navigation in a single app
- **Template Updates**: Update existing projects with the latest template fixes and improvements
- **Developer-First Approach**: Optimized for productivity and flexibility with powerful CLI options
- **Consistent Architecture**: Enforces best practices and maintainable code structure
- **Typescript & JavaScript Support**: Choose your preferred language during setup or switch later
- **Zero Configuration**: Get started with minimal setup
- **Post-Scaffold Modifications**: Change app name, add/remove features, or reconfigure at any time

## 📦 Installation

### Global Installation (Recommended)

Install the package globally to use the CLI commands from anywhere:

```bash
npm install -g @nexora-dev/react-native-boilerplate
```

After installation, you can use the CLI with:

```bash
nexora-rn create MyAwesomeApp
```

### Using with npx (No Installation)

Alternatively, use it directly with npx without installing:

```bash
npx @nexora-dev/react-native-boilerplate create MyAwesomeApp
```

### System Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v7.0.0 or higher
- **React Native**: Compatible with React Native 0.70.0 and above

## 🛠️ Usage Guide

> **Note**: All commands support the `--help` flag for detailed usage information. For example: `nexora-rn add --help`

### Creating a New Project

Create a new React Native project with interactive prompts to select your desired features:

```bash
nexora-rn create MyAwesomeApp
```

During project creation, you'll be prompted to select:

- **Language**: JavaScript or TypeScript
- **Navigation Type**: Choose navigation types (comma-separated: stack,tabs,drawer) (default: "stack")
- **State Management**: Redux Toolkit, Zustand, or Context API (optional)
- **UI Framework**: styled-components or tailwind-rn
- **Additional Features**: Authentication, API services, Firebase, Localization, etc.
- **Storage**: AsyncStorage (default) or MMKV
- **Theme System**: Light/Dark mode support
- **Sample Screens**: Home, Settings, Profile, etc.

#### Example with Options

```bash
nexora-rn create MyAwesomeApp --navigation=stack,tabs,drawer --typescript --state=redux --ui=styled-components --features=auth,firebase,localization
```

#### JavaScript/TypeScript Toggle

You can switch between JavaScript and TypeScript even after project creation:

```bash
nexora-rn convert --to=typescript  # Convert JS project to TypeScript
nexora-rn convert --to=javascript  # Convert TS project to JavaScript
```

### Adding Features to an Existing Project

Add new features to your project at any time:

```bash
nexora-rn add drawer
```

This will:
1. Install required dependencies
2. Generate necessary files and configurations
3. Update existing files to integrate the new feature
4. Provide usage examples

#### Adding UI Components

Add specific UI components to your project:

```bash
nexora-rn add component Button
nexora-rn add component Card
nexora-rn add component Input
```

You can specify the UI framework to use:

```bash
nexora-rn add component Modal --ui=styled-components
nexora-rn add component Toast --ui=tailwind
```

For TypeScript projects:

```bash
nexora-rn add component Dropdown --typescript
```

#### Supported Features

| Category | Features | Description |
|----------|----------|-------------|
| **Navigation** | `stack`, `tabs`, `drawer` | Different navigation patterns (can be used in combination) |
| **Authentication** | `auth` | User authentication flows and screens |
| **Backend** | `firebase` | Firebase integration (Auth, Firestore, Storage, FCM) |
| **API** | `api` | REST API service layer with Axios |
| **State** | `redux`, `zustand`, `context` | State management solutions |
| **Internationalization** | `localization` | i18n support with language switching |
| **Styling** | `theme`, `tailwind`, `styled-components` | UI and theming options |
| **Storage** | `asyncstorage`, `mmkv` | Local storage solutions |
| **Assets** | `fonts` | Custom font integration |
| **UI Components** | `components` | Reusable UI components |
| **Screens** | `screens` | Sample screen templates |

### Removing Features

Remove features that are no longer needed:

```bash
nexora-rn remove firebase
```

This will:
1. Remove related dependencies
2. Clean up configuration files
3. Remove feature-specific code
4. Update imports and references

#### Removing UI Components

Remove specific UI components from your project:

```bash
nexora-rn remove component Button
nexora-rn remove component Card
```

Remove all components of a specific type:

```bash
nexora-rn remove components --ui=tailwind
```

Remove unused components (those not imported anywhere in your project):

```bash
nexora-rn cleanup components
```

### Renaming Your App

Rename your application at any point in development:

```bash
nexora-rn rename "New App Name"
```

This command updates:
- App display name in app.json/app.config.js
- Package name in package.json
- Bundle identifiers in native files
- References throughout the codebase

### Configuring App Settings

Update configuration settings with a simple command:

```bash
nexora-rn config --theme dark --primaryColor "#3498db" --apiUrl "https://api.example.com"
```

### Updating Projects with Latest Template Changes

Update your existing projects with the latest template features and fixes:

```bash
nexora-rn update
```

This command will:
1. Check if your project is a valid Nexora React Native project
2. Create a backup of your project (can be disabled)
3. Update templates with the latest fixes and improvements
4. Only update files that have changed
5. Preserve your customizations where possible

#### Update Options

You can customize the update process with various options:

```bash
# Update only specific features
nexora-rn update --features navigation,theme

# Force update even if the project is already up to date
nexora-rn update --force

# Skip confirmation prompts
nexora-rn update --yes

# Skip creating a backup
nexora-rn update --no-backup

# Skip installing dependencies after update
nexora-rn update --skip-install
```

#### Available Configuration Options

```bash
# Set theme mode
nexora-rn config --theme dark

# Configure API endpoint
nexora-rn config --apiUrl "https://api.example.com"

# Set primary color
nexora-rn config --primaryColor "#3498db"

# Change font family
nexora-rn config --fontFamily "Roboto"

# Configure Firebase settings
nexora-rn config --firebase.region "us-central1"

# Toggle features
nexora-rn config --enableFeature analytics
nexora-rn config --disableFeature crashlytics

# Reset to defaults
nexora-rn config --reset
```

#### Configuration File

All settings are stored in `.nexora-cli-config.json` at the root of your project. This file tracks your project setup to avoid duplicates and ensure consistent feature management.

## ✨ Features in Detail

### Dynamic App Name Change

Rename your app at any point in the development cycle without manual file editing. The CLI automatically updates all necessary files including:

- `app.json` and `package.json`
- Native iOS and Android files
- App display name and bundle identifiers

### Navigation System

A flexible navigation system built on React Navigation with support for:

- **Stack Navigation**: For screen-to-screen navigation with transitions
- **Bottom Tab Navigation**: For main app sections with customizable icons
- **Drawer Navigation**: For apps with many navigation options
- **Nested Navigation**: Combine different navigation types
- **Authentication Flow**: Protected routes with authentication checks

All navigation types are fully typed in TypeScript projects and include proper screen props typing.

### Theme System

A comprehensive theming solution that includes:

- **Light/Dark Mode**: Toggle between themes with automatic system preference detection
- **Theme Context**: React Context for accessing theme values throughout the app
- **Themed Components**: UI components that automatically adapt to the current theme
- **Custom Theming**: Easily extend with your own color schemes and design tokens
- **Live Theme Parent View**: `<ThemeProvider>` wrapper for the app with dynamic theme switching
- **Customizable Theme Variables**: Change primary colors, font families, and other design tokens

```javascript
// Example theme usage
import { useTheme } from '../config/theme';

const MyComponent = () => {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Themed Text</Text>
    </View>
  );
};
```

### Localization

Built-in internationalization with i18n-js:

- **Multiple Languages**: Support for any number of languages
- **Language Switching**: Runtime language changing with persistence
- **Translation Components**: Components that automatically translate text
- **Pluralization**: Support for plural forms and number formatting
- **Date/Time Formatting**: Locale-aware date and time formatting
- **Auto-Detection**: Automatic language detection with fallback
- **Centralized Locales**: Organized locale files (en.json, gu.json, etc.)
- **Dynamic Addition**: Add new languages at any point in development

```javascript
// Example localization usage
import { useTranslation } from 'react-i18next';

const WelcomeScreen = () => {
  const { t } = useTranslation();
  return (
    <Text>{t('welcome.greeting', { name: 'User' })}</Text>
  );
};
```

### State Management

Options for different state management approaches:

- **Redux Toolkit**: For complex state with DevTools support and RTK Query
- **Zustand**: For simpler state management with hooks-based API
- **Context API**: For component-specific or lightweight state needs

Each option includes:
- Pre-configured stores
- Authentication state management
- Persistence options
- TypeScript type definitions

### Firebase Integration

Seamless Firebase integration with:

- **Authentication**: Email/password, social logins, phone auth
- **Firestore**: Document/collection management with typed data
- **Storage**: File upload/download with progress tracking
- **Cloud Functions**: Client SDK for calling serverless functions
- **Analytics**: User behavior tracking
- **Crashlytics**: Error reporting

### REST API Service Layer

A robust API service built on Axios:

- **Service Abstraction**: Clean separation of API logic
- **Request/Response Interceptors**: For authentication, logging, etc.
- **Error Handling**: Centralized error processing
- **Cancellation**: Support for cancelling pending requests
- **TypeScript Integration**: Fully typed requests and responses
- **Environment Variables**: Different endpoints for dev/staging/production

### Storage Options

Flexible local storage solutions:

- **AsyncStorage**: React Native's standard storage API
- **MMKV**: High-performance alternative to AsyncStorage
- **Storage Hooks**: Custom hooks for easy data persistence
- **Encryption**: Options for securing sensitive data

### UI Framework Options

Choose your preferred styling approach:

- **styled-components**: Component-based styling with theme support
- **tailwind-rn**: Utility-first approach with TailwindCSS classes

### Reusable Components

A library of pre-built, customizable components:

- **Buttons**: Various styles, sizes, and states
- **Text**: Typography components with theme and localization support
- **Cards**: Flexible container components
- **Inputs**: Form elements with validation
- **Modals**: Customizable dialog components
- **Loaders**: Loading indicators and skeletons
- **Toasts**: Notification system

All components are:
- Theme-aware (adapting to light/dark mode)
- Accessibility-friendly
- Customizable via props
- Available in both JavaScript and TypeScript

#### Creating Custom Components

Create your own custom components that follow the same patterns:

```bash
nexora-rn generate component MyCustomComponent
```

This will create a new component with the following structure:

```
src/components/MyCustomComponent/
├── index.js             # Main component file
├── styles.js            # Component styles
└── MyCustomComponent.test.js  # Test file
```

For TypeScript projects:

```bash
nexora-rn generate component MyCustomComponent --typescript
```

This creates:

```
src/components/MyCustomComponent/
├── index.tsx            # Main component file with types
├── styles.ts            # Typed styles
└── MyCustomComponent.test.tsx  # Typed test file
```

## 📁 Project Structure

The Nexora React Native Boilerplate follows a feature-based architecture that promotes maintainability and scalability:

```
YourProject/
├── src/
│   ├── assets/                 # Static resources
│   │   ├── fonts/             # Custom fonts
│   │   ├── images/            # Images and graphics
│   │   └── icons/             # SVG and other icons
│   │
│   ├── components/            # Reusable UI components
│   │   ├── Button/            # Component with its tests and styles
│   │   ├── Card/              # Each component in its own directory
│   │   ├── Input/             # With index.js/ts for clean imports
│   │   └── common/            # Shared component utilities
│   │
│   ├── config/                # Application configuration
│   │   ├── theme.js           # Theme definitions and provider
│   │   ├── constants.js       # App-wide constants
│   │   └── env.js             # Environment variables
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js         # Authentication hooks
│   │   ├── useTheme.js        # Theme access hook
│   │   └── useApi.js          # API interaction hooks
│   │
│   ├── navigation/            # Navigation configuration
│   │   ├── AppNavigator.js    # Main app navigator
│   │   ├── AuthNavigator.js   # Authentication flows
│   │   ├── TabNavigator.js    # Bottom tab configuration
│   │   └── DrawerNavigator.js # Drawer menu configuration
│   │
│   ├── screens/               # Application screens
│   │   ├── Home/              # Each screen in its own directory
│   │   ├── Auth/              # With component, styles, and tests
│   │   │   ├── Login.js       # Login screen
│   │   │   └── Register.js    # Registration screen
│   │   └── Settings/          # Settings screens
│   │
│   ├── services/              # External service integrations
│   │   ├── api/               # API service layer
│   │   │   ├── client.js      # Axios instance and interceptors
│   │   │   ├── endpoints.js   # API endpoint definitions
│   │   │   └── services/      # Service methods by domain
│   │   └── firebase/          # Firebase services
│   │       ├── auth.js        # Authentication methods
│   │       ├── firestore.js   # Database interactions
│   │       └── storage.js     # File storage methods
│   │
│   ├── store/                 # State management
│   │   ├── index.js           # Store configuration
│   │   ├── slices/            # Redux slices or Zustand stores
│   │   └── selectors.js       # State selectors
│   │
│   ├── localization/          # i18n resources
│   │   ├── i18n.js            # i18n configuration
│   │   ├── en.json            # English translations
│   │   └── es.json            # Spanish translations
│   │
│   ├── utils/                 # Utility functions
│   │   ├── formatting.js      # Data formatting helpers
│   │   ├── validation.js      # Form validation
│   │   └── storage.js         # Storage helpers
│   │
│   └── App.js                 # Application entry point
│
├── android/                   # Android native code
├── ios/                       # iOS native code
├── __tests__/                 # Test directory
├── .env                       # Environment variables
└── package.json               # Dependencies and scripts
```

### Key Architectural Principles

1. **Component Isolation**: Each component includes its own styles, tests, and documentation
2. **Feature Encapsulation**: Related functionality is grouped together
3. **Clean Imports**: Index files enable clean import statements
4. **Separation of Concerns**: UI, business logic, and data access are separated
5. **Consistent Naming**: Predictable file and directory naming conventions

## 👨‍💻 Development and Contribution

### Setting Up the Development Environment

```bash
# Clone the repository
git clone https://github.com/devzaveri/-nexora-react-native-boilerplate.git

# Navigate to the directory
cd -nexora-react-native-boilerplate

# Install dependencies
npm install

# Link the package locally for testing
npm link
```

### Development Workflow

1. Make your changes to the CLI or templates
2. Test locally using the linked package:
   ```bash
   nexora-rn create TestApp
   ```
3. Run tests and linting:
   ```bash
   npm test
   npm run lint
   ```

### Project Architecture

The CLI project is organized as follows:

```
react-native-boilerplate/
├── bin/                  # CLI entry point
├── src/
│   ├── commands/         # CLI command implementations
│   │   ├── add.js        # Add feature command
│   │   ├── create.js     # Create project command
│   │   ├── remove.js     # Remove feature command
│   │   ├── rename.js     # Rename app command
│   │   └── config.js     # Configure settings command
│   ├── templates/        # Project templates
│   │   ├── api/          # API service templates
│   │   ├── auth/         # Authentication templates
│   │   ├── firebase/     # Firebase integration templates
│   │   ├── navigation/   # Navigation templates
│   │   │   ├── stack/    # Stack navigation templates
│   │   │   ├── tabs/     # Tab navigation templates
│   │   │   └── drawer/   # Drawer navigation templates
│   │   ├── redux/        # Redux state management templates
│   │   ├── ui/           # UI component templates
│   │   │   ├── styled-components/ # Styled-components templates
│   │   │   └── tailwind/ # Tailwind templates
│   │   ├── zustand/      # Zustand state management templates
│   │   ├── localization/ # i18n templates
│   │   ├── storage/      # Storage templates
│   │   └── theme/        # Theme system templates
│   └── utils/            # Helper utilities
│       ├── featureManager.js # Feature installation/removal
│       ├── templateManager.js # Template processing
│       ├── dependencies.js # Dependency management
│       └── projectUtils.js # Project file operations
└── package.json          # Project configuration
```

### Modular Architecture

The CLI is designed with a modular architecture that allows for easy extension:

- Each feature is encapsulated in its own module
- Modules can be installed/uninstalled cleanly
- The `.nexora-cli-config.json` file tracks project setup
- New modules can be added without modifying core code

## 🤝 Contributing

We welcome contributions from the community! This project is open for collaboration, and we're excited to see your ideas and improvements.

### Contribution Guidelines

1. **Fork the Repository**: Create your own fork of the project from [github.com/devzaveri/-nexora-react-native-boilerplate](https://github.com/devzaveri/-nexora-react-native-boilerplate)

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/-nexora-react-native-boilerplate.git
   cd -nexora-react-native-boilerplate
   ```

3. **Set Up Development Environment**:
   ```bash
   npm install
   npm link  # To test locally
   ```

4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

5. **Make Your Changes**: Implement your feature or bug fix

6. **Test Your Changes**:
   ```bash
   # Create a test project
   nexora-rn create TestProject
   # Test your specific feature
   nexora-rn add your-feature
   ```

7. **Follow Code Style**: Ensure your code follows the project's style guidelines

8. **Document Your Changes**: Update documentation as needed

9. **Commit Your Changes**:
   ```bash
   git commit -m 'Add: Implement amazing feature'
   ```

10. **Push to Your Branch**:
    ```bash
    git push origin feature/amazing-feature
    ```

11. **Open a Pull Request**: Submit a PR with a clear description of your changes

### Types of Contributions We're Looking For

- **New Feature Templates**: Add support for additional libraries and tools
- **UI Components**: Create new reusable UI components
- **Navigation Patterns**: Implement additional navigation patterns
- **State Management Solutions**: Add support for other state management libraries
- **Documentation Improvements**: Enhance guides and examples
- **Bug Fixes**: Help identify and fix issues
- **Performance Optimizations**: Improve CLI and template performance

### Development Workflow

When developing new features or fixing bugs, follow this workflow:

1. **Create an Issue**: Before starting work, create an issue describing what you plan to do
2. **Discuss the Approach**: Get feedback on your proposed implementation
3. **Implement Changes**: Make your changes in a feature branch
4. **Add Tests**: Ensure your changes are tested
5. **Update Documentation**: Make sure documentation reflects your changes
6. **Submit PR**: Reference the original issue in your pull request

### Code of Conduct

We expect all contributors to be respectful and inclusive. Any form of harassment or disrespectful behavior will not be tolerated.

## ❓ Troubleshooting and FAQ

### Common Issues and Solutions

#### Installation Issues

**Error: EACCES permission denied**

This occurs when trying to install the package globally without sufficient permissions:

```bash
# Solution: Use sudo (on macOS/Linux)
sudo npm install -g @nexora/react-native-boilerplate

# Alternative: Fix npm permissions
npm config set prefix ~/.npm
export PATH="$PATH:~/.npm/bin"
```

#### Dependency Installation Errors

**Error when installing project dependencies**

```bash
# Solution 1: Clear npm cache and use legacy peer deps
cd YourProjectName
npm cache clean --force
npm install --legacy-peer-deps

# Solution 2: Try using Yarn instead
yarn install
```

#### Template Generation Issues

**Corrupted or incomplete template files**

```bash
# Reset the configuration
nexora-rn config --reset

# Regenerate the project
nexora-rn create MyApp --force
```

#### iOS Build Errors

**Pod installation fails**

```bash
# Solution: Clean and reinstall pods
cd ios
pod deintegrate
pod install --repo-update
```

#### Android Build Errors

**Gradle build failures**

```bash
# Solution: Clean the project
cd android
./gradlew clean
```

### FAQ

#### Can I use this with Expo?

No, this boilerplate is designed for React Native CLI projects only. It uses native modules that require linking, which is not compatible with Expo's managed workflow.

#### How do I update an existing project to the latest template?

Currently, there's no automatic update mechanism. The recommended approach is to create a new project and migrate your code manually.

#### Can I customize the templates?

Yes! Fork the repository and modify the templates in the `src/templates` directory to suit your needs.

#### How do I contribute a new feature template?

Create a new directory in the appropriate category under `src/templates` with your feature implementation, then update the feature manager in `src/utils/featureManager.js` to include your new feature.

#### How do I create my own component templates?

Component templates are located in `src/templates/ui/[framework]/[language]/src/components/`. To add a new component template:

1. Create a new file in the appropriate directory (e.g., `MyComponent.js` or `MyComponent.tsx`)
2. Implement your component following the existing patterns
3. Update `src/utils/templates.js` to include your new component

#### Can I use this CLI to manage existing React Native projects?

Yes, but with some limitations. The CLI works best with projects that were initially created using this boilerplate. For existing projects, you can:

1. Use `nexora-rn add component [name]` to add individual components
2. Manually copy templates from the CLI's template directory
3. Use `nexora-rn init` in an existing project to add boilerplate structure

## 📋 Additional Information

### Versioning

This project follows [Semantic Versioning (SemVer)](http://semver.org/):

- **Major version (X.0.0)**: Incompatible API changes
- **Minor version (0.X.0)**: New features in a backward-compatible manner
- **Patch version (0.0.X)**: Backward-compatible bug fixes

For available versions, see the [tags on this repository](https://github.com/devzaveri/-nexora-react-native-boilerplate/tags).

### Roadmap

Upcoming features and improvements:

- [ ] Expo support with EAS build configuration
- [ ] React Native Web compatibility
- [ ] Additional UI component libraries
- [ ] GraphQL integration
- [ ] E2E testing templates
- [ ] CI/CD pipeline templates
- [ ] Project analytics and performance monitoring
- [ ] Plugin system for community modules
- [ ] Auto-generate translation keys when new text is added
- [ ] ESLint + Prettier + Husky git hooks templates
- [ ] Error-free imports with enhanced TypeScript types

### Code Quality

The boilerplate includes:

- **ESLint Configuration**: Customized rules for React Native
- **Prettier Setup**: Consistent code formatting
- **TypeScript Support**: Comprehensive type definitions
- **Optional Git Hooks**: Using Husky for pre-commit checks

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/devzaveri">Nexora</a></p>
  <p>
    <a href="https://github.com/devzaveri/-nexora-react-native-boilerplate/issues">Report Bug</a> •
    <a href="https://github.com/devzaveri/-nexora-react-native-boilerplate/issues">Request Feature</a>
  </p>
</div>
