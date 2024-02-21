# Project Deployment Workflow

This document outlines our project's deployment workflow, including the process of moving from Dev to Testing, and finally to Prod. It also details the use of Firebase projects across different environments and provides a guide for creating and naming feature branches.

## Deployment Flow Overview

Our deployment flow is designed to ensure code quality and stability across all stages of Dev. Here's a brief overview:

1. **Feature Branches to Dev**: Developers create feature branches for new features or bug fixes. These branches can be pushed into the Dev branch without approval.
2. **Dev to Test Environment**: Once features are ready and merged into the Dev branch, a single approval is required to move the code to the Test environment.
3. **Test Environment to Prod**: After thorough Testing, the code requires four approvals to be deployed to the Prod environment.

### Firebase Project Configuration

- **Dev/Test Environment**: A single Firebase project is used for both Dev and Test environments to streamline the Dev process and facilitate easier Testing.
- **Prod Environment**: A separate Firebase project is used for the Prod environment to ensure isolation and security of live data.

## Kubernetes Deployment

- **Kubernetes Dev**: Deploys and configures the application in the Dev environment using the Firebase Dev/Test project.
- **Kubernetes Test**: Deploys and configures the application in the Test environment using the same Firebase Dev/Test project.
- **Kubernetes Prod**: Deploys and configures the application in the Prod environment using the Firebase Prod project.

## Feature Branch Workflow

### Naming Convention

Feature branches should be named using the following format to ensure clarity and consistency:

```
feature/<feature-name>
```

Replace `<feature-name>` with a concise name that describes the feature or fix being Developed.

### Creating a Feature Branch

To create a new feature branch from the Dev branch, follow these steps:

1. Ensure you're on the Dev branch and it's up to date:

```bash
git checkout Dev
git pull origin Dev
```

2. Create and switch to your new feature branch:

```bash
git checkout -b feature/<feature-name>
```

3. Push the feature branch to the remote repository:

```bash
git push -u origin feature/<feature-name>
```

### Merging Back to Dev

Once your feature is complete and Tested:

1. Merge the laTest changes from the Dev branch into your feature branch and resolve any conflicts:

```bash
git checkout feature/<feature-name>
git merge Dev
```

2. Push your changes and create a pull request to merge back into the Dev branch for further Testing and eventual deployment.

## Conclusion

This workflow is designed to maintain a high standard of code quality and ensure that our deployments are smooth and error-free. By following these guidelines, we can efficiently manage our Dev process and maintain a stable and secure application across all environments.
