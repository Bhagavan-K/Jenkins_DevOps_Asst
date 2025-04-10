pipeline {
    agent none
    
    environment {
        PROJECT_NAME = "Jenkins_DevOps_Asst"
        GITHUB_REPO = "https://github.com/Bhagavan-K/Jenkins_DevOps_Asst.git"
        EMAIL_NOTIFICATION = "radhakrishna.kbns@gmail.com"
    }
    
    stages {
        stage('Checkout') {
            agent {
                label 'windows-agent'
            }
            steps {
                echo 'Checking out from source control...'
                checkout scm
                
                script {
                    // Add build information to source code
                    bat """
                        echo "Build ID: ${env.BUILD_ID}" > build-info.txt
                        echo "Node: ${env.NODE_NAME}" >> build-info.txt
                        echo "Timestamp: ${new Date().format("yyyy-MM-dd HH:mm:ss")}" >> build-info.txt
                    """
                }
            }
        }
        
        stage('Build') {
            agent {
                label 'windows-agent'
            }
            steps {
                echo 'Building the application...'
                
                // Create build directory and copy files
                bat 'if not exist build mkdir build'
                bat 'copy index.html build\\'
                bat 'copy test.js build\\'
                bat 'copy build-info.txt build\\'
                
                // Generate build version file
                script {
                    def buildVersion = "${env.BUILD_NUMBER}-${new Date().format("yyyyMMddHHmmss")}"
                    bat "echo ${buildVersion} > build\\version.txt"
                    echo "Built version: ${buildVersion}"
                }
            }
            post {
                success {
                    echo 'Build completed successfully!'
                }
                failure {
                    echo 'Build failed!'
                }
                always {
                    archiveArtifacts artifacts: 'build/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Code Analysis') {
            agent {
                label 'windows-agent'
            }
            steps {
                echo 'Running code analysis...'
                
                // Simulate code analysis.
                bat '''
                    echo "Running code quality checks..."
                    if not exist reports mkdir reports
                    echo "Code analysis completed on %DATE% %TIME%" > reports\\analysis-report.txt
                    echo "No major issues found." >> reports\\analysis-report.txt
                '''
                
                // Archive the analysis reports
                archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            }
        }
        
        stage('Test') {
            agent {
                label 'windows-agent'
            }
            steps {
                echo 'Running tests...'
                
                // Run custom test script.
                bat '''
                    if not exist test-results mkdir test-results
                    echo "Test execution started at %DATE% %TIME%" > test-results\\test_results.txt
                    
                    REM Simulate running NodeJS tests
                    echo "Running unit tests..." >> test-results\\test_results.txt
                    echo "Running integration tests..." >> test-results\\test_results.txt
                    echo "All tests passed" >> test-results\\test_results.txt
                '''
                
                // Read the test results
                script {
                    def testResults = readFile('test-results/test_results.txt')
                    echo "Test Results: ${testResults}"
                    
                    // This is where you might check for failures
                    if (!testResults.contains("All tests passed")) {
                        error "Tests failed! Check test results for details."
                    }
                }
            }
            post {
                always {
                    echo 'Test stage completed'
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
                failure {
                    echo 'Tests failed!'
                    error 'Test stage failed'
                }
            }
        }
        
        stage('Deploy to Staging') {
            agent {
                label 'windows-agent'
            }
            steps {
                echo 'Deploying to Staging environment...'
                
                // Create staging directory and deploy files
                bat 'if not exist staging mkdir staging'
                bat 'copy build\\*.* staging\\'
                
                // Add environment marker
                bat 'echo "ENVIRONMENT=STAGING" > staging\\env.properties'
                
                // Simulate configuration for staging
                bat '''
                    echo "Configuring application for staging environment..."
                    echo "stage.server=staging-server" > staging\\config.properties
                    echo "stage.db=staging-db" >> staging\\config.properties
                    echo "stage.api.url=https://api-staging.example.com" >> staging\\config.properties
                '''
                
                // Simulate service restart
                bat 'echo "Restarting services on staging environment..." > staging\\deploy.log'
                bat 'echo "Staging deployment completed at %DATE% %TIME%" >> staging\\deploy.log'
            }
            post {
                success {
                    echo 'Successfully deployed to Staging!'
                }
                failure {
                    echo 'Staging deployment failed!'
                    error 'Staging deploy failed'
                }
                always {
                    archiveArtifacts artifacts: 'staging/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Integration Tests on Staging') {
            agent {
                label 'windows-agent'
            }
            steps {
                echo 'Running integration tests on staging environment...'
                
                // Simulate running integration tests against staging
                bat '''
                    if not exist test-results mkdir test-results
                    echo "Integration tests started at %DATE% %TIME%" > test-results\\staging-integration.txt
                    echo "Testing endpoints on staging environment..." >> test-results\\staging-integration.txt
                    echo "All integration tests passed" >> test-results\\staging-integration.txt
                '''
                
                // Check results
                script {
                    def integrationResults = readFile('test-results/staging-integration.txt')
                    echo "Integration Test Results: ${integrationResults}"
                    
                    if (!integrationResults.contains("All integration tests passed")) {
                        error "Integration tests failed on staging!"
                    }
                }
            }
        }
        
        stage('Deploy to Production') {
            agent {
                label 'windows-agent'
            }
            input {
                message "Deploy to production?"
                ok "Proceed"
                submitter "admin,manager"
            }
            steps {
                echo 'Deploying to Production environment...'
                
                // Create production directory and deploy files
                bat 'if not exist production mkdir production'
                bat 'copy staging\\*.* production\\'
                
                // Update environment marker
                bat 'echo "ENVIRONMENT=PRODUCTION" > production\\env.properties'
                
                // Simulate configuration for production
                bat '''
                    echo "Configuring application for production environment..."
                    echo "prod.server=production-server" > production\\config.properties
                    echo "prod.db=production-db" >> production\\config.properties
                    echo "prod.api.url=https://api.example.com" >> production\\config.properties
                '''
                
                // Simulate service restart
                bat 'echo "Restarting services on production environment..." > production\\deploy.log'
                bat 'echo "Production deployment completed at %DATE% %TIME%" >> production\\deploy.log'
            }
            post {
                success {
                    echo 'Successfully deployed to Production!'
                }
                failure {
                    echo 'Production deployment failed!'
                    script {
                        // Rollback if production deployment fails
                        echo 'Initiating rollback procedure...'
                        bat 'echo "ROLLBACK INITIATED at %DATE% %TIME%" > production\\rollback.log'
                        bat 'echo "Restoring previous version..." >> production\\rollback.log'
                    }
                }
                always {
                    archiveArtifacts artifacts: 'production/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Smoke Test Production') {
            agent {
                label 'windows-agent'
            }
            steps {
                echo 'Running smoke tests on production environment...'
                
                // Simulate smoke tests
                bat '''
                    if not exist test-results mkdir test-results
                    echo "Smoke tests started at %DATE% %TIME%" > test-results\\production-smoke.txt
                    echo "Verifying critical features on production..." >> test-results\\production-smoke.txt
                    echo "All smoke tests passed" >> test-results\\production-smoke.txt
                '''
                
                // Check results
                script {
                    def smokeResults = readFile('test-results/production-smoke.txt')
                    echo "Smoke Test Results: ${smokeResults}"
                    
                    if (!smokeResults.contains("All smoke tests passed")) {
                        error "Smoke tests failed on production!"
                    }
                }
            }
            post {
                failure {
                    echo 'Production smoke tests failed!'
                    
                    // Trigger rollback
                    script {
                        echo 'Initiating emergency rollback due to failed smoke tests!'
                        bat 'echo "EMERGENCY ROLLBACK at %DATE% %TIME%" > production\\emergency-rollback.log'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution complete'
        }
        success {
            echo 'Pipeline executed successfully!'
            
            // Send notification on success
            echo 'Sending success notification...'
        }
        failure {
            echo 'Pipeline execution failed!'
            
            // Send notification on failure
            echo 'Sending failure notification...'
        }
    }
}