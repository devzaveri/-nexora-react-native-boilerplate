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
- **Developer-First Approach**: Optimized for productivity and flexibility
- **Consistent Architecture**: Enforces best practices and maintainable code structure
- **Typescript & JavaScript Support**: Choose your preferred language
- **Zero Configuration**: Get started with minimal setup

## 📦 Installation

### Global Installation (Recommended)

Install the package globally to use the CLI commands from anywhere:

```bash
npm install -g @nexora/react-native-boilerplate
```

After installation, you can use the CLI with:

```bash
nexora-rn create MyAwesomeApp
```

### Using with npx (No Installation)

Alternatively, use it directly with npx without installing:

```bash
npx @nexora/react-native-boilerplate create MyAwesomeApp
```

### System Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v7.0.0 or higher
- **React Native**: Compatible with React Native 0.70.0 and above

## 🛠️ Usage Guide

### Creating a New Project

Create a new React Native project with interactive prompts to select your desired features:

```bash
nexora-rn create MyAwesomeApp
```

During project creation, you'll be prompted to select:

- **Language**: JavaScript or TypeScript
- **Navigation Type**: Stack, Tabs, Drawer, or any combination
- **State Management**: Redux Toolkit, Zustand, or Context API
- **UI Framework**: styled-components or tailwind-rn
- **Additional Features**: Authentication, API services, Firebase, etc.

#### Example with Options

```bash
nexora-rn create MyAwesomeApp --typescript --navigation=stack,tabs --state=redux --ui=styled-components
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

#### Supported Features

| Category | Features | Description |
|----------|----------|-------------|
| **Navigation** | `stack`, `tabs`, `drawer` | Different navigation patterns |
| **Authentication** | `auth` | User authentication flows and screens |
| **Backend** | `firebase` | Firebase integration (Auth, Firestore, etc.) |
| **API** | `api` | REST API service layer with Axios |
| **State** | `redux`, `zustand` | State management solutions |
| **Internationalization** | `localization` | i18n support with language switching |
| **Styling** | `theme`, `tailwind`, `styled-components` | UI and theming options |
| **Storage** | `asyncstorage`, `mmkv` | Local storage solutions |

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

#### Available Configuration Options

```bash
# Set theme mode
nexora-rn config --theme dark

# Configure API endpoint
nexora-rn config --apiUrl "https://api.example.com"

# Set primary color
nexora-rn config --primaryColor "#3498db"

# Reset to defaults
nexora-rn config --reset
```

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
│   ├── templates/        # Project templates
│   │   ├── api/          # API service templates
│   │   ├── auth/         # Authentication templates
│   │   ├── firebase/     # Firebase integration templates
│   │   ├── navigation/   # Navigation templates
│   │   ├── redux/        # Redux state management templates
│   │   ├── ui/           # UI component templates
│   │   └── zustand/      # Zustand state management templates
│   └── utils/            # Helper utilities
└── package.json          # Project configuration
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Contribution Guidelines

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Your Changes**: Implement your feature or bug fix
4. **Follow Code Style**: Ensure your code follows the project's style guidelines
5. **Write Tests**: Add tests for your changes
6. **Document Your Changes**: Update documentation as needed
7. **Commit Your Changes**:
   ```bash
   git commit -m 'Add: Implement amazing feature'
   ```
8. **Push to Your Branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
9. **Open a Pull Request**: Submit a PR with a clear description of your changes

### Types of Contributions

- **Bug Fixes**: Help identify and fix issues
- **Feature Additions**: Implement new features or enhancements
- **Documentation**: Improve or expand documentation
- **Templates**: Create new templates or improve existing ones
- **Testing**: Add or improve tests

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

## 📋 Additional Information

### Versioning

This project follows [Semantic Versioning (SemVer)](http://semver.org/):

- **Major version (X.0.0)**: Incompatible API changes
- **Minor version (0.X.0)**: New features in a backward-compatible manner
- **Patch version (0.0.X)**: Backward-compatible bug fixes

For available versions, see the [tags on this repository](https://github.com/devzaveri/-nexora-react-native-boilerplate/tags).

### Roadmap

Upcoming features and improvements:

- [ ] Expo support
- [ ] React Native Web compatibility
- [ ] Additional UI component libraries
- [ ] GraphQL integration
- [ ] E2E testing templates
- [ ] CI/CD pipeline templates
- [ ] Project analytics and performance monitoring

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
