# FDCA Intranet application

This application is a Svelte-kit PWA that is designed with Tailwind-css, Skeleton-UI, Flowbite-svelte. 

The frontend is using a firebase project for most backend services such as firebase storage and firestore to allow users to read and write articles that can be read by other FDCA members.

The app is striving to always run in containers both as local project when developing and in production. 

### Getting Started

This section provides instructions on how to set up the project environment on Windows using either npm or Docker. Choose the method that best suits your development preferences and follow the steps below to get started.

We recommend having both tools at your disposal.

#### Option 1: Using npm

1. **Install Node.js and npm**: Ensure that Node.js and npm are installed on your Windows machine. You can download them from [https://nodejs.org/](https://nodejs.org/).

2. **Clone the Repository**: Clone the project repository to your local machine using Git.

    ```bash
    git clone https://github.com/cvpl-fdca/Intranet-projekt.git
    cd Intranet-projekt
    ```

3. **Navigate to the Project Directory**:

    ```bash
    cd fdca-intranet
    ```

4. **Install Dependencies**:

    ```bash
    npm install
    ```

5. **Run the Development Server**:

    ```bash
    npm run dev
    ```

    This command starts the development server. You can now access the application in your web browser at the specified address (usually `http://localhost:5173`).

#### Option 2: Using Docker

1. **Install Docker for Windows**: Download and install Docker Desktop for Windows from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop). Follow the installation instructions provided on the website.

2. **Clone the Repository**: If you haven't already, clone the project repository to your local machine.

    ```bash
    git clone https://github.com/cvpl-fdca/Intranet-projekt.git
    cd Intranet-projekt
    ```

3. **Stay in the Root Folder**: Ensure you're in the root directory of the cloned repository.

4. **Build and Run the Container**:

    ```bash
    docker-compose up --build
    ```

    This command builds the Docker image and starts the container. Once the process is complete, the application will be running and accessible through the specified ports.

Choose either method to set up your development environment and start working on the project.


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
