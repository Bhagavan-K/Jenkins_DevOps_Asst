pipeline {
    agent {
        label 'windows-agent'
    }
    
    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                // Simulating build process
                bat 'mkdir -p build'
                bat 'copy index.html build\\'
                bat 'copy test.js build\\'
            }
            post {
                success {
                    echo 'Build completed successfully!'
                }
                failure {
                    echo 'Build failed!'
                }
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                // Simulating test process
                bat 'echo "Testing started" > test_results.txt'
                bat 'echo "All tests passed" >> test_results.txt'
            }
            post {
                always {
                    echo 'Test stage completed'
                }
                failure {
                    echo 'Tests failed!'
                    error 'Test stage failed'
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                echo 'Deploying to Staging environment...'
                // Simulating deployment
                bat 'mkdir -p staging'
                bat 'copy build\\*.* staging\\'
            }
            post {
                success {
                    echo 'Successfully deployed to Staging!'
                }
                failure {
                    echo 'Staging deployment failed!'
                    error 'Staging deploy failed'
                }
            }
        }
        
        stage('Deploy to Production') {
            input {
                message "Deploy to production?"
                ok "Proceed"
            }
            steps {
                echo 'Deploying to Production environment...'
                // Simulating deployment
                bat 'mkdir -p production'
                bat 'copy staging\\*.* production\\'
            }
            post {
                success {
                    echo 'Successfully deployed to Production!'
                }
                failure {
                    echo 'Production deployment failed!'
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
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}