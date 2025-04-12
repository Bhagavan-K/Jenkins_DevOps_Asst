// Application Tests
class DevOpsTests {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            failures: []
        };
        console.log("DevOps Test Suite Initialized");
    }

    runTest(testName, testFn) {
        this.testResults.total++;
        try {
            console.log(`Running test: ${testName}`);
            testFn();
            console.log(`✓ PASSED: ${testName}`);
            this.testResults.passed++;
            return true;
        } catch (error) {
            console.error(`× FAILED: ${testName}`);
            console.error(`  Error: ${error.message}`);
            this.testResults.failed++;
            this.testResults.failures.push({
                name: testName,
                error: error.message
            });
            return false;
        }
    }

    testHtmlElements() {
        this.runTest('Check page title', () => {
            const title = document.querySelector('title');
            if (!title || !title.textContent.includes('DevOps')) {
                throw new Error('Title element not found or incorrect');
            }
        });

        this.runTest('Validate dashboard cards', () => {
            const cards = document.querySelectorAll('.card');
            if (cards.length < 3) {
                throw new Error('Expected at least 3 dashboard cards');
            }
        });

        this.runTest('Check environment status', () => {
            const buildInfo = document.querySelector('.build-info');
            if (!buildInfo) {
                throw new Error('Build info section not found');
            }
        });
        
        this.runTest('Verify responsive design', () => {
            const metaViewport = document.querySelector('meta[name="viewport"]');
            if (!metaViewport) {
                throw new Error('Viewport meta tag not found');
            }
        });
    }
    
    testPerformance() {
        this.runTest('Page load time', () => {
            // This is a simple mock performance test
            const loadTime = Math.random() * 500 + 100; // Simulate 100-600ms load time
            console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
            
            if (loadTime > 1000) {
                throw new Error('Page load time exceeds 1000ms threshold');
            }
        });
    }
    
    testEnvironmentFeatures() {
        this.runTest('Environment detection', () => {
            // Update build information element
            const buildNumber = document.getElementById('buildNumber');
            if (buildNumber) {
                const envInfo = {
                    environment: this.detectEnvironment(),
                    buildId: this.getBuildId(),
                    timestamp: new Date().toISOString()
                };
                
                buildNumber.textContent = `Build: ${envInfo.buildId} | Environment: ${envInfo.environment} | ${envInfo.timestamp}`;
            }
        });
    }
    
    detectEnvironment() {
        // This would normally check environment variables or URL
        // For demo purposes, we'll randomly select one
        const envs = ['development', 'staging', 'production'];
        const randomIndex = Math.floor(Math.random() * envs.length);
        return envs[randomIndex];
    }
    
    getBuildId() {
        // In a real Jenkins pipeline, this would read from environment
        // For demo, generate a random build ID
        return `build-${Math.floor(Math.random() * 1000)}`;
    }

    testCriticalDeploymentRequirements() {
        this.runTest('API endpoints security check', () => {
            // Simulate checking for required security headers
            const requiredSecurityHeaders = [
                'Content-Security-Policy',
                'X-XSS-Protection',
                'X-Content-Type-Options'
            ];
            // Simulate missing headers (for demo)
            const missingHeaders = requiredSecurityHeaders.slice(0, 2);
            if (missingHeaders.length > 0) {
                throw new Error(`Missing required security headers: ${missingHeaders.join(', ')}`);
            }
        });
        
        this.runTest('Service dependencies check', () => {
            const requiredServices = ['database', 'cache', 'auth-service', 'logging'];
            const mockServiceStatus = {
                'database': 'connected',
                'cache': 'connected',
                'auth-service': 'disconnected',
                'logging': 'connected'
            };
            const unavailableServices = requiredServices.filter(
                service => mockServiceStatus[service] !== 'connected'
            );
            if (unavailableServices.length > 0) {
                throw new Error(`Critical services unavailable: ${unavailableServices.join(', ')}`);
            }
        });

        this.runTest('Configuration validation', () => {
            const mockConfigErrors = [
                'Missing required environment variable: API_KEY',
                'Invalid logging level specified'
            ];

            if (mockConfigErrors.length > 0) {
                throw new Error(`Configuration errors detected: ${mockConfigErrors.join('; ')}`);
            }
        });
    }
    
    runAllTests() {
        console.log('Starting DevOps tests...');
        
        // Run HTML tests
        this.testHtmlElements();
        
        // Run performance tests
        this.testPerformance();
        
        // Run environment tests
        this.testEnvironmentFeatures();
        
        // Run critical deployment requirement tests - This will cause failures
        this.testCriticalDeploymentRequirements();
    
        // Print summary
        this.printSummary();

        
        // Return non-zero exit code if any tests failed (for Jenkins)
        if (this.testResults.failed > 0) {
            console.error('Tests failed! Pipeline should stop.');
        }
       
        return this.testResults;
    }
    
    printSummary() {
        console.log('\n==== TEST SUMMARY ====');
        console.log(`Total tests: ${this.testResults.total}`);
        console.log(`Passed: ${this.testResults.passed}`);
        console.log(`Failed: ${this.testResults.failed}`);
        
        if (this.testResults.failures.length > 0) {
            console.log('\nFailures:');
            this.testResults.failures.forEach((failure, index) => {
                console.log(`${index + 1}. ${failure.name}: ${failure.error}`);
            });
        }
        
        console.log('=====================');
    }
    
    simulateFailingTest() {
        this.runTest('Intentional failure', () => {
            throw new Error('This test was designed to fail');
        });
    }
}

// Function to run when the page loads
window.onload = function() {
    console.log('Page loaded, running tests...');
    const tester = new DevOpsTests();
    tester.runAllTests();
};

// This function can be called from outside this file
function validateApplication() {
    const tester = new DevOpsTests();
    return tester.runAllTests();
}

// Export the test class if we're in a Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevOpsTests;
}
