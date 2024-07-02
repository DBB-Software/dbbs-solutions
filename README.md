# DBBS Platform Base

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Repository Structure](#repository-structure)
5. [Configuration Details](#configuration-details)
6. [Contribution Guidelines](#contribution-guidelines)
7. [FAQs/Troubleshooting](#faqstroubleshooting)
8. [Contact Information](#contact-information)
9. [License](#license)


## Introduction
Welcome to the DBBS Platform Base, a comprehensive solution developed by DBB Software that is designed to revolutionize the management and development of complex software ecosystems. This platform is the foundation of a robust monorepo approach, enabling the creation of diverse applications, including APIs (both server-based and serverless), mobile apps with React Native, and web applications (React SPA and SSR).

At DBBS Platform Base, our focus is on providing a strong and adaptable foundation for software development. We address the challenges of managing multiple applications within a single repository with our seamless, efficient approach to generating a base monorepo structure complete with all necessary applications and tools.

Our platform is defined by its opinionated design, offering a suite of predefined, rigorously tested configurations and modules. This framework minimizes the time developers spend on architectural decisions, allowing more focus on innovation. DBBS Platform Base is more than a tool; it represents a shift in how development ecosystems are managed and scaled, merging industry best practices with cutting-edge technologies. Join us in advancing the future of software development.
### Key Advantages of DBBS Platform Base:
- **Streamlined Development Process:**
  Through our CLI interface or configuration files, developers can easily assign necessary modules to each application, tailoring functionalities to meet specific needs within the monorepo.
- **Time Efficiency:**
  The platform's predefined configurations and opinionated nature drastically cut down setup time, allowing developers to dive into coding immediately.
- **Consistency and Quality:**
  Uniform structure and configurations across projects enhance overall development quality, ensuring a consistent and high-standard output.


## Prerequisites

Before diving into the DBBS Platform Base, ensure the following prerequisites are met for a smooth experience:

- **Git**: Essential for source control management.
- **Node.js & NPM**: Required for managing dependencies and running scripts. Check the `.nvmrc` file for the exact Node.js version.
- **AWS CLI**: Necessary for handling AWS services, version 2.14.0 or higher.
- **Serverless Framework**: Version 3.38.0 or higher for deploying serverless applications.
- **Knowledge Base**: Familiarity with JavaScript/TypeScript, React, and serverless concepts will be beneficial.

These tools and knowledge are key to effectively using and contributing to the DBBS Platform Base.
### Essential Tools
- **Git:** Required for version control and repository management. Ensure Git is installed on your machine.
- **Node.js & NPM:** The platform is dependent on Node.js. The required version is specified in the `.nvmrc` file in the root of the repository. The corresponding npm version should be used as per the Node.js version.

### AWS Integration
- **AWS CLI v2.14.0 or Higher:** For managing AWS services, install AWS CLI version 2.14.0 or higher.
- **Serverless Framework v3.38.0 or Higher:** To deploy serverless applications, you'll need the Serverless Framework. Install version 3.38.0 or higher for optimal compatibility.

### AWS Account Setup
- **AWS Account:** An AWS account is necessary for deploying applications. Set up your account if you haven't already.
- **AWS CLI Keys:** Generate AWS CLI keys with the following permissions to ensure full functionality with AWS services:
    - AWSCloudFormationFullAccess
    - AWSLambda_FullAccess
    - AmazonAPIGatewayAdministrator
    - AmazonS3FullAccess
    - AmazonEC2ContainerRegistryFullAccess
    - SecretsManagerReadWrite

### Recommended Knowledge
- **JavaScript/TypeScript:** Familiarity with JavaScript or TypeScript is essential, as our platform is heavily based on these languages.
- **React & React Native:** Basic understanding of React for web apps and React Native for mobile app development.
- **Serverless Architecture:** Knowledge of serverless concepts is beneficial for working with serverless APIs.

## Installation
Setting up the DBBS Platform Base is straightforward. Follow these steps to get started:
1. **Clone the Repository**
   Begin by cloning the repository to your local machine.
   ```bash
   git clone https://github.com/DBB-Software/dbbs-platform-base
   ```
   This command clones the DBBS Platform Base repository from GitHub.
2. **Install Dependencies**
   Makefile is designed to automate the setup of dependencies for project. 
   It uses Homebrew, asdf, and Yarn to manage installations and versions of tools and packages. Required steps:
   Navigate to the root directory of the cloned repository.
   ```bash
   cd dbbs-platform-base
   ```
   Install all dependencies while in the root directory of the cloned repository.
   ```bash
   make setup-dependencies
   ```
   Check the versions of installed tools while in the root directory of the cloned repository.
   ```bash
   make check-versions
   ```
   Ensure that Homebrew and asdf are correctly set in your PATH. If not, the script will open instructions for installation and adding Homebrew and asdf to your shell.
   If Yarn is not installed or is outdated, the Makefile will install or update it using Corepack.
3. **Build the Monorepo**
   Once the dependencies are installed, build the entire monorepo to ensure all components are properly compiled.
   ```bash
   yarn build
   ```
4. **AWS Credentials Setup**
   For deploying applications and accessing AWS services, set your AWS credentials. Replace `<AWS_ACCESS_KEY_ID>` and `<AWS_SECRET_ACCESS_KEY>` with your actual AWS credentials.
   ```bash
   export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
   export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
   ```
5. **Run Example Applications**
   To start all example applications, use the following command:
   ```bash
   yarn dev
   ```
6. **Generate New Applications**
   If you want to create a new application, use the `npx turbo gen` command and follow the instructions in the console.
   ```bash
   npx turbo gen
   ```

## Usage

The DBBS Platform Base offers a set of commands to manage and operate your monorepo efficiently. These commands are designed to enhance flexibility and enable targeted development tasks for specific packages or applications. Below is a guide to the key commands and their functionalities:

1. **Linting**
   To ensure code quality and consistency, use the lint command. This will check your code for any stylistic or programming errors.
   ```bash
   yarn lint
   ```

2. **Building**
   To compile your code and prepare it for deployment, use the build command. This is essential for making sure your applications are ready for production.
   ```bash
   yarn build
   ```

3. **Testing**
   Running tests is crucial for maintaining code quality. Use the test command to execute your test suites.
   ```bash
   yarn test
   ```

4. **Starting Applications**
   To start a specific application in a production environment, use the start command.
   ```bash
   target=<app-name> yarn start
   ```
   Replace `<app-name>` with the name of the application you wish to start.

5. **Development Mode**
   For a development environment with hot reloading, use the dev command. This is particularly useful during the development phase for immediate feedback.
   ```bash
   target=<app-name> yarn dev
   ```
   Replace `<app-name>` with the name of the application you're developing.

6. **Local start**
   For local environment to emulate AWS resources [LocalStack](https://www.localstack.cloud/) is used. To start the local environment and emulate AWS resources using LocalStack, run the start:localstack command from the root directory. This will start applications along with additional AWS services in docker container such as S3, etc. 

### Additional Tips

- **Targeted Commands:** Most commands support a `target` env variable at the beginning of command to specify which package or app the command should run for. This allows for more granular control over your development workflow.
- **Custom Scripts:** You can also define custom scripts in your `package.json` to streamline your workflow further.

With these commands and tips, you can fully leverage the capabilities of the DBBS Platform Base to streamline your development process.

#### Commands:
- `yarn dev`

#### Targeted Commands:
- `target=web-spa yarn start`
- `target=web-spa yarn dev`

In addition to the standard development commands, the DBBS Platform includes Cypress testing commands to facilitate end-to-end testing. These commands leverage the Cypress testing framework for interactive and headless test execution.
- `target=web-spa yarn cypress:open` - Launches the Cypress Test Runner in an interactive mode, allowing developers to visually inspect and debug tests.
- `target=web-spa yarn cypress:run` - Executes Cypress tests in a headless mode, suitable for automated test runs in continuous integration (CI) pipelines.

#### Makefile Targets:
- `setup-dependencies` - The main target for setting up all dependencies. It runs the following targets in order: `check-brew`, `asdf-install`, and `install-deps`.
- `check-brew` - Checks if Homebrew is installed on the system. If not, it prompts the user to install Homebrew by providing the installation instructions.
- `asdf-install` - Installs asdf and its plugins for managing Node.js, Ruby, and Cocoapods versions. It also updates all asdf plugins and installs the specified versions of the tools.
- `install-deps` - Installs the project's dependencies, which include Node.js modules and the AWS CLI. It runs the `install-node-modules` and `install-awscli` targets.
- `install-node-modules` - Installs the required Node.js modules using Yarn.
- `check-asdf-path` - Checks if asdf is correctly set in the system's PATH. If not, it opens instructions for adding asdf to the shell.
- `check-yarn` - Checks if Yarn is installed and up to date. If not, it installs Yarn using Corepack. It also updates local Yarn to the stable version if the installed version is lower than 4.0.
- `install-awscli` - Installs the AWS CLI using Homebrew.
- `check-versions` - Checks and prints the versions of installed tools, including asdf, Node.js, Ruby, Cocoapods, Yarn and the AWS CLI.

#### Scripts:
The .sh scripts are in **`/scripts`** folder. Below is an outline of the scripts, along with their purpose:
##### download.env.sh
Script for downloading environment variables from AWS Secret Manager. It requires the `STAGE`, `AWS_PROFILE`, and `SECRET_PREFIX` variables to be set. There are three ways to set the envs:

1. **Inline variable**
   ```bash
   STAGE="your-stage" AWS_PROFILE="your-aws-profile" SECRET_PREFIX="your-secret-prefix" ./download.env.sh

   ```
2. **With export in terminal**
   ```bash
   export STAGE="your-stage"
   export AWS_PROFILE="your-aws-profile"
   export SECRET_PREFIX="your-secret-prefix"
   ./script.sh

   ```
3. **Define the `STAGE`, `AWS_PROFILE`, `SECRET_PREFIX` in `scripts/env-constants.sh`**.
   ```bash
   # Define the AWS profile (default value)
   AWS_PROFILE="${AWS_PROFILE:-default-aws-profile}"

   # Define the secret prefix (default value)
   SECRET_PREFIX="${SECRET_PREFIX:-dbbs-platform}"

   # Define the stage (default value)
   STAGE="${STAGE:-default-stage}"
   ```

##### upload-settings.sh
The main script for uploading application settings to an S3 bucket. It requires the `SETTINGS_S3_BUCKET_NAME` and `AWS_PROFILE` variables to be set. There are three ways to set the `SETTINGS_S3_BUCKET_NAME` and `AWS_PROFILE`:

1. **Inline variable**
   ```bash
   SETTINGS_S3_BUCKET_NAME="your-s3-bucket-name" ./scripts/upload-settings.sh
   ```
2. **With export in terminal**
   ```bash
   export SETTINGS_S3_BUCKET_NAME="your-s3-bucket-name"
   ./scripts/upload-settings.sh
   ```
3. **Define the `SETTINGS_S3_BUCKET_NAME` in `scripts/env-constants.sh`**.
   ```bash
   #!/bin/bash

   # Define a list of environment names
   readonly ENVIRONMENTS=("local" "development" "production" "staging")

   # Define the S3 bucket name (default value)
   SETTINGS_S3_BUCKET_NAME="${SETTINGS_S3_BUCKET_NAME:-default-s3-bucket-name}"

   ```

#### `upload-env.sh`
Script for uploading environment variables from AWS Secret Manager. It requires the `STAGE`, `AWS_PROFILE`, and `SECRET_PREFIX` variables to be set. There are three ways to set the envs:

1. **Inline variable**
   ```bash
   STAGE="your-stage" AWS_PROFILE="your-aws-profile" SECRET_PREFIX="your-secret-prefix" ./scripts/upload-env.sh

   ```
2. **With export in terminal**
   ```bash
   export STAGE="your-stage"
   export AWS_PROFILE="your-aws-profile"
   export SECRET_PREFIX="your-secret-prefix"
   ./scripts/upload-env.sh

   ```
3. **Define the `STAGE`, `AWS_PROFILE`, `SECRET_PREFIX` in `scripts/env-constants.sh`**.
   ```bash
   # Define the AWS profile (default value)
   AWS_PROFILE="${AWS_PROFILE:-default-aws-profile}"

   # Define the secret prefix (default value)
   SECRET_PREFIX="${SECRET_PREFIX:-dbbs-platform}"

   # Define the stage (default value)
   STAGE="${STAGE:-default-stage}"
   ```

## Repository Structure
The DBBS Platform Base monorepo is structured to facilitate ease of navigation and development across various components. Below is an outline of the key directories and files, along with their purpose:
- **`/apps`**: This directory contains the individual applications developed within the monorepo. Each sub-directory represents a separate application, such as server, serverless APIs, React SPA, React SSR, and React Native mobile apps.
- **`/packages`**: Contains shared packages or libraries that are used across multiple applications within the monorepo. This promotes code reusability and consistency.
- **`/serverless-layer`**: Specific to serverless applications, this directory hosts the common layers used in serverless deployments, such as shared libraries and utilities.
- **`/turbo`**: This directory contains configurations and scripts related to the Turbo repository management tool, which helps in managing and scaling the monorepo efficiently.
- **`yarn.lock` & `package.json`**: These files manage dependencies for the entire monorepo.
- **`tsconfig.json`**: Configuration file for TypeScript, setting compiler options for the projects.
- **`turbo.json`**: Configuration file for the Turbo tool, defining the build dependencies and optimizations.

### Apps
This directory encompasses a diverse array of applications, spanning web, server, mobile, and function-based applications. The DBBS Platform provides a comprehensive set of tools and configurations to facilitate efficient development across various application types.

#### Front End:
- Server-Side Rendered Next.js App (SSR) - application provides the ability to generate static pages
- React Single Page Apps (SPA)

#### Back End:
- Server NestJS App
- Serverless NestJS App
- Serverless App

#### Mobile application
- React Native cross-platform mobile app

For each application, a predefined set of initial configurations is supplied. These include:
- ESLint Configuration
- Jest Configuration
- TypeScript Configurations

Additionally, a sample component is provided for each application, serving as a practical illustration of the application's structure.
These applications serve as diverse templates for building customer systems. Whether you are constructing a web interface, server logic, mobile application, or a serverless function, the DBBS Platform offers a solid foundation to expedite development.

### Packages
The packages folder serves as a repository for common elements shared across various applications within the DBBS Platform. It encapsulates fundamental configurations, reusable components, and essential features, providing a centralized resource for streamlined development. These are modules that are used in apps to cover the basic logic of end-customer applications, such as authorization, logging, multi-tenancy configuration, etc.

#### Common Configurations:
- Settings Configuration
- ESLint Base Configuration
- TypeScript Base Configurations

#### React Components and Features:
A collection of React components and features designed to enhance the user interface and functionality across applications.

#### NestJS Modules:
A set of NestJS modules, including middlewares, filters, interceptors, guards, and pipes. These modules contribute to the backend logic and functionality shared among applications.

#### AWS Package Wrapper:
To ensure smoother integration with AWS services, the packages folder includes a wrapper for key AWS packages. This simplifies the usage of AWS functionalities across different applications.

The packages folder consolidates common elements critical for maintaining consistency and efficiency in development. By centralizing configurations, components, and modules, developers can seamlessly integrate shared functionalities into their respective applications.

### ESLint and TypeScript Configurations

#### Base Configurations
Found within the platform are base configurations for ESLint and TypeScript. These configurations establish consistent coding standards and type checking throughout the entire monorepository.

Importantly, the base configurations are inherited by the monorepo, promoting uniformity in coding practices and type safety across projects.

#### Framework-Specific Guidelines
In addition to the base configurations, the guidelines incorporate framework-specific settings for various application and package types.

#### Versatility Across Apps
These configurations cater to the unique needs of web, server, mobile, and function applications. They provide tailored guidelines for each, optimizing the development experience based on specific requirements.

#### Purpose
The primary goal of these configuration guidelines is to establish a consistent foundation for development. By integrating base configurations and framework-specific settings, developers benefit from standardized coding practices and streamlined development processes.

#### How to Use
Review and implement the configuration guidelines relevant to your project. Whether you're working on an application or a package, these guidelines are crucial for maintaining code quality and ensuring seamless integration within the diverse ecosystem of the DBBS Platform.

### Generators
The generators folder is a key component of the DBBS Platform, offering a streamlined approach to generating necessary applications with custom names. Each application from the apps folder has a corresponding generator, enabling developers to create applications tailored to their specific needs efficiently through CLI commands.

#### Individual Generators
Within the generators folder, there exists a dedicated generator for each application located in the apps folder. These generators encapsulate the necessary configurations and structures for the corresponding applications.
The generators empower developers to create needed applications with custom names effortlessly through Command Line Interface (CLI) commands. This functionality enhances flexibility and expedites the application setup process.
The generator folder simplifies and accelerates the application creation process. Developers can easily generate needed applications with personalized names, ensuring a more efficient and adaptable development workflow.

## Configuration Details

The DBBS Platform Base is designed to be highly configurable to meet a variety of development needs. Below is an overview of key configuration files and settings within the monorepo:

- **`package.json`**: This file at the root level defines project dependencies and scripts. It's essential for managing npm packages and can be customized to include additional scripts or dependencies as required.

- **`tsconfig.json`**: TypeScript configurations are managed here. Adjust compiler options and include paths according to your project's TypeScript requirements.

- **`turbo.json`**: This configuration file is vital for the Turbo repository management tool. It defines the build dependencies and strategies for optimizing the monorepo's performance.

- **`/apps` Directory Configurations**: Each application within the `/apps` directory may have its own configuration files, such as `.env` for environment variables and specific setup files. These should be configured based on the needs of each individual app.

- **Serverless Configuration**: For serverless applications, configurations are typically found in the `serverless.yml` files within the respective application directories. Adjust these files to configure your serverless deployments.

### Tips for Effective Configuration:

- **Keep Configurations Organized**: Maintain a clear structure in your configuration files for ease of maintenance and updates.
- **Document Customizations**: If you add custom scripts or make significant changes to configuration files, document these changes either in the README or a separate documentation file.
- **Version Control**: Regularly commit changes to your configuration files to version control, allowing you to track and revert changes if needed.

By properly configuring the DBBS Platform Base, you can ensure that it aligns with your development objectives and works seamlessly across different environments.


## Technology Stack

The DBBS Platform Base utilizes a diverse and modern technology stack to offer a robust and efficient development experience. Below is an overview of the key technologies used and their specific roles within the platform:
- **[NestJS](https://github.com/nestjs/nest)**: A progressive Node.js framework used for building efficient, reliable, and scalable server-side applications.
- **[Next.js](https://github.com/vercel/next.js)**: A React framework that enables functionalities such as server-side rendering and generating static websites, enhancing the performance of web applications.
- **[Material UI](https://github.com/mui/material-ui)**: A popular UI framework for React applications, known for its responsive and customizable components that speed up the design process.
- **[Serverless](https://github.com/serverless/serverless)**: A framework for building and deploying serverless applications, streamlining the process of managing cloud resources and reducing operational overhead.
- **[OpenNext](https://github.com/sst/open-next)**: This technology enhances Next.js applications, providing additional capabilities and integrations for a more comprehensive development toolkit.
- **[Turbo](https://github.com/vercel/turbo)**: A high-performance build system and repository management tool designed to optimize the development and scaling of monorepos like ours.
- **[Vite](https://vitejs.dev/)**: An innovative front-end build tool that significantly improves the development experience with features like instant server start and lightning-fast hot module replacement (HMR).
- **[Jest](https://jestjs.io/)**: A delightful JavaScript testing framework with a focus on simplicity, providing a flexible and scalable testing solution for our applications.

Our technology stack is carefully selected to ensure the platform remains at the forefront of development innovation, offering a powerful combination of speed, efficiency, and scalability.


## Contribution Guidelines

We warmly welcome contributions to the DBBS Platform Base! Whether you're fixing bugs, improving documentation, or suggesting new features, your input is invaluable. Here's how you can contribute:

### Getting Started
1. **Fork the Repository**: Start by forking the repository on GitHub. This creates your own copy of the project where you can make changes.
2. **Clone Your Fork**: Clone your fork to your local machine to start working on the changes.
   ```bash
   git clone https://github.com/your-username/dbbs-platform-base
   ```
3. **Create a New Branch**: Always create a new branch for your changes. This keeps the work organized and makes it easier to manage pull requests.
   ```bash
   git checkout -b your-branch-name
   ```

### Making Contributions
- **Code Contributions**: When contributing code, ensure it adheres to the project's coding standards and write tests where applicable.
- **Documentation**: If you are contributing to documentation, ensure your changes are clear, concise, and helpful for other users.
- **Bug Reports and Feature Requests**: Use the GitHub Issues section to report bugs or suggest new features. Please provide as much detail as possible to help us understand the issue or feature.

### Submitting Your Changes
1. **Commit Your Changes**: Make your changes and commit them with a clear commit message.
   ```bash
   git commit -m "A brief description of your changes"
   ```
2. **Push to Your Fork**: Push the changes to your forked repository.
   ```bash
   git push origin your-branch-name
   ```
3. **Create a Pull Request**: Go to the original repository on GitHub and create a pull request from your branch. Provide a clear description of your changes and the purpose of the pull request.

### Code Review
- Once you've submitted a pull request, it will be reviewed by the maintainers. Be open to feedback and make any requested changes if necessary.

### Stay Updated
- Regularly pull changes from the main repository to keep your fork up to date. This minimizes the chances of conflicts.

### Code of Conduct
- Please adhere to the Code of Conduct while interacting with the project. Respectful and constructive communication is expected from all participants.

By following these guidelines, you can contribute to making DBBS Platform Base an even better tool for everyone. We look forward to your contributions!

### Questions or Issues?
- If you have any questions or run into issues, don't hesitate to reach out for help or clarification.

Thank you for contributing to the DBBS Platform Base!

## FAQs/Troubleshooting

This section aims to address common questions and provide solutions to frequent issues that users might encounter while working with the DBBS Platform Base.

### Frequently Asked Questions (FAQs)

1. **Q: How do I update my local repository with the latest changes from the main repo?**
   A: Use the `git pull` command to fetch and merge the latest changes from the main repository.

2. **Q: What should I do if I encounter npm dependency conflicts?**
   A: Ensure that you are using the same npm version as specified in the project. If the issue persists, try removing the `node_modules` directory and the `yarn.lock` file, then run `yarn` again.

3. **Q: Can I contribute to a feature or bugfix without being assigned?**
   A: Absolutely! Feel free to pick up any unassigned issues. We recommend commenting on the issue to let others know you're working on it.

### Troubleshooting Common Issues

1. **Issue: Build failing due to TypeScript errors.**
   Solution: Ensure that your TypeScript version matches the one specified in the project. Check for any type mismatches or syntax errors in your code.

2. **Issue: Serverless deployment errors.**
   Solution: Verify that your AWS credentials are correctly set up and that you have the necessary permissions. Also, check the `serverless.yml` configurations for any inconsistencies.

3. **Issue: The application not running after recent updates.**
   Solution: Pull the latest changes from the main repository and rebuild the application. If the issue persists, it might be due to incompatible local environment settings.

### Additional Help

If your question or issue isn't covered here, don't hesitate to reach out to us or raise an issue on GitHub. We are continually updating this section based on user feedback and common queries.

For detailed documentation and guides, refer to the `/documentation` directory in the repository.


## Contact Information

We value your feedback and contributions to the DBBS Platform Base. If you have any questions or suggestions or need support, here are several ways to get in touch with us:

- **General Inquiries and Support**: For any general questions about the platform or if you need assistance, please visit our website [DBB Software](https://dbbsoftware.com/) and use the contact form provided.

- **GitHub Issues**: For specific issues, feature requests, or bugs related to the platform, please use the [GitHub Issues](https://github.com/DBB-Software/dbbs-platform-base/issues) page. This is the fastest way to directly communicate with our development team and track the resolution of your issue.

- **Community Discussion and Contributions**: Join our community discussions on [GitHub Discussions](https://github.com/DBB-Software/dbbs-platform-base/discussions) for broader topics, ideas exchange, and collaborative discussions.

- **Social Media**: Follow us on our social media channels for the latest news, updates, and insights:
    - [DBB Software on LinkedIn](https://www.linkedin.com/company/dbbsoftware)
    - [DBB Software on Twitter](https://twitter.com/dbb_software)

- **Email Contact**: For more formal or detailed inquiries, feel free to reach out to us via email at [in@dbbsoftware.com](mailto:in@dbbsoftware.com).

We're always here to help and are committed to ensuring you have the best experience with the DBBS Platform Base. Your input and participation drive the continuous improvement of our platform.


## License

The DBBS Platform Base is open-source software licensed under the [MIT License](LICENSE).

### Key Points of the MIT License:
- **Freedom to Use**: You are free to use this software in your own projects, commercial or otherwise.
- **Permission to Modify**: You have the right to modify the code to suit your needs.
- **Redistribution**: You can distribute the original or modified versions of the software.
- **No Warranty**: The software is provided "as is", without warranty of any kind.

This license allows for maximum flexibility and broad use, encouraging innovation and collaboration. For the full terms and conditions, please refer to the [LICENSE](LICENSE) file in the repository.

We believe in open-source software and the power of community collaboration, and we hope this licensing choice helps foster a vibrant and supportive ecosystem around the DBBS Platform Base.
