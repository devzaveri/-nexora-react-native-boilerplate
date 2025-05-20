# Nexora React Native Boilerplate CLI

A powerful CLI tool for generating fully dynamic, developer-first React Native boilerplates.

## Overview

This CLI tool allows you to:
- Create new React Native projects with customizable features
- Add/remove features at any point during development
- Change app name dynamically
- Configure app settings

## Installation

```bash
npm install -g @nexora/react-native-boilerplate
```

After installation, you can use the CLI with:

```bash
nexora-rn create MyAwesomeApp
```

Or use it directly with npx:

```bash
npx @nexora/react-native-boilerplate create MyAwesomeApp
```

## Usage

### Create a new project

```bash
nexora-rn create MyAwesomeApp
```

Or with npx:

```bash
npx @nexora/react-native-boilerplate create MyAwesomeApp
```

This interactive command will prompt you to select features for your project.

### Add a feature to an existing project

```bash
nexora-rn add drawer
```

Supported features:
- Navigation types: `drawer`, `tabs`, `stack`
- Auth: `auth`
- Firebase: `firebase`
- API service: `api`
- State management: `redux`, `zustand`
- Localization: `localization`
- Theme system: `theme`
- UI frameworks: `tailwind`, `styled-components`
- Storage: `mmkv`

### Remove a feature

```bash
nexora-rn remove firebase
```

### Rename your app

```bash
nexora-rn rename "New App Name"
```

### Configure app settings

```bash
nexora-rn config --theme dark
```

## Features

- **Dynamic App Name Change**: Rename your app at any point
- **Flexible Navigation**: Stack, Bottom Tabs, and Drawer navigation
- **Theme System**: Light/Dark theme with toggle support
- **Localization**: i18n support with language switching
- **State Management**: Redux Toolkit, Zustand, or Context API
- **Firebase Integration**: Auth, Firestore, and optional services
- **REST API Service Layer**: Axios with service abstraction
- **Storage Options**: AsyncStorage or MMKV
- **UI Framework Options**: styled-components or tailwind-rn
- **Reusable Components**: Theme-aware, i18n-ready components

## Folder Structure

```
src/
├── assets/             # Fonts, images, icons
├── components/         # Reusable UI elements (theme-aware)
├── config/             # Theme, localization, constants
├── hooks/              # Custom React hooks
├── navigation/         # Stack, Drawer, Tabs
├── screens/            # Home, Auth, Settings
├── services/           # API, Firebase
├── store/              # Zustand or Redux
├── localization/       # en.json, gu.json, etc.
├── utils/              # Helpers, formatters
└── App.tsx or App.js
```

## Development

### Prerequisites

- Node.js >= 14.0.0
- npm >= 7.0.0

### Building

```bash
git clone https://github.com/nexora/react-native-boilerplate.git
cd react-native-boilerplate
npm install
npm link
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

#### 1. Error when installing dependencies

If you encounter errors during dependency installation, try the following:

```bash
cd YourProjectName
npm cache clean --force
npm install --legacy-peer-deps
```

#### 2. Issues with template generation

If there are problems with template files:

```bash
nexora-rn config --reset
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/nexora/react-native-boilerplate/tags).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
