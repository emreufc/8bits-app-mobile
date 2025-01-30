# 8bites

This application is a Software Engineering Project developed by seven ITU Computer Engineering students. The project is a mobile application that provides personalized recipe recommendations, shopping cart and inventory management features. It automatically deducts the ingredients used in recipes from the kitchen inventory and suggests meals based on the available ingredients. You can watch the detailed demo video explaining the UI flow and backend requests from the following link: [Demo Video](https://drive.google.com/file/d/1t82_sSYkLF6yDWvukfuv3dIUyxev8I20/view?usp=sharing)

## Getting Started

Follow the steps below to run this project on your local environment.

### Requirements

- [Node.js](https://nodejs.org/) (v14 or higher)
- [NPM](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Ionic CLI](https://ionicframework.com/docs/cli/installation) (Must be installed globally)

### Installation

1. Ensure that **Node.js** and **NPM** are installed:
   ```bash
   node -v
   npm -v
   ```

2. Install **Ionic CLI** globally:
   ```bash
   npm install -g @ionic/cli
   ```

3. Clone the project or start a new Ionic project:
   ```bash
   git clone https://github.com/user/project-name.git
   cd project-name
   ```

   *or*
   ```bash
   ionic start project-name blank
   cd project-name
   ```

4. Install project dependencies:
   ```bash
   npm install
   ```

### Starting the Development Server

To run the project in your local development environment, use the following command:
```bash
ionic serve
```

This command starts the project locally on `http://localhost:8100` and automatically reloads changes made to the files. This is ideal for rapid development and testing.

### Running the Application on a Device or Emulator

1. **Add Android or iOS platform:**
   ```bash
   ionic capacitor add android
   ionic capacitor add ios
   ```

2. Run the application on a device or emulator:
   ```bash
   ionic capacitor run android
   ionic capacitor run ios
   ```

   *Note: You need a Mac and Xcode to run the iOS application.*

## Project Structure

The general folder structure of the project is as follows:
```
project-name/
├── src/
│   ├── app/
│   ├── assets/
│   ├── environments/
│   └── index.html
├── capacitor.config.ts
├── package.json
└── README.md
```

## Useful Commands

- **To build the Ionic application:**
  ```bash
  ionic build
  ```

- **To synchronize Capacitor commands:**
  ```bash
  ionic capacitor sync
  
