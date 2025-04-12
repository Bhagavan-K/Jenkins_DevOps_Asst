# Jenkins CI/CD Pipeline Assignment

This repository contains a basic Jenkins-based continuous integration and continuous deployment (CI/CD) pipeline project that demonstrates automation of software delivery processes.

## Project Overview

This project establishes a complete Jenkins CI/CD pipeline with master-slave architecture to automate building, testing, and deploying a web application across staging and production environments. The pipeline is designed to handle branch management and pull requests within a Git workflow.

## Features

- Master-slave Jenkins architecture for distributed builds
- Multi-stage pipeline (Build, Test, Deploy)
- Automated testing with custom test framework
- Staged deployments (Staging → Production)
- Branch management and pull request handling
- Failure handling and recovery strategies

## Pipeline Stages

The pipeline consists of the following stages:

1. **Build** - Compiles and packages the application
2. **Test** - Runs automated tests to verify functionality
3. **Deploy to Staging** - Deploys to staging environment for validation
4. **Integration Testing** - End-to-end integration tests to ensure components work together as expected
5. **Deploy to Production** - Deploys to production after manual approval
6. **Smoke Test Production** - Basic sanity checks in the production environment to confirm the deployment was successful

## Setup Instructions

### Prerequisites

- Java 17 or 21 (compatible for Jenkins)
- Git
- Jenkins (latest LTS version)
- Ngrok or AWS EC2 (To expose local host)

### Jenkins Configuration

1. Create administrator user
2. Configure master-slave architecture
3. Install required plugins(over recommended plugins suggested during Jenkins installation):
   - Git Integration
   - Pipeline

### Running the Pipeline

1. Create a new Pipeline job in Jenkins
2. Configure SCM to point to this repository
3. Set the pipeline script path to `Jenkinsfile`
4. Run the pipeline

## Failure Handling

The pipeline includes post-conditions for each stage to handle failures gracefully. Failed builds trigger notifications and store diagnostic information for troubleshooting.

## Branch Management

- `main` branch contains production-ready code
- Development occurs in feature branches
- Pull requests are used to merge changes into `main`
- Jenkins automatically builds and tests pull requests

## Environments

- **Staging**: Pre-production environment for validation
- **Production**: Live environment accessed by end users

## Benefits of CI/CD

- Faster development cycles
- Early bug detection
- Reduced manual intervention
- Consistent build processes
- Improved code quality
- Better team collaboration
- Reliable deployments
- Rapid feedback loops

## License

This project is for educational purposes. Feel free to use and modify according to your needs.
