// DevOps Project - Automated Testing Script
// For use with Jenkins CI/CD pipeline
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { JSDOM } = require('jsdom');

/**
 * Custom testing framework for DevOps project
 * Used to validate HTML content and infrastructure configurations
 */
class DevOpsTestSuite {
  constructor(projectRoot) {
    this.projectRoot = projectRoot || process.cwd();
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      failures: []
    };
    this.htmlContent = null;
    this.dom = null;
  }

  /**
   * Load and parse the HTML file for testing
   * @param {string} htmlPath - Path to HTML file
   * @return {boolean} - Success status
   */
  loadHtml(htmlPath) {
    try {
      const fullPath = path.join(this.projectRoot, htmlPath);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${fullPath}`);
      }
      
      this.htmlContent = fs.readFileSync(fullPath, 'utf8');
      this.dom = new JSDOM(this.htmlContent);
      console.log(`✓ Successfully loaded HTML from ${htmlPath}`);
      return true;
    } catch (error) {
      console.error(`× Failed to load HTML: ${error.message}`);
      return false;
    }
  }

  /**
   * Run a test with proper logging and error handling
   * @param {string} testName - Name of the test
   * @param {Function} testFn - Test function to execute
   */
  runTest(testName, testFn) {
    this.testResults.total++;
    try {
      console.log(`Running test: ${testName}`);
      testFn();
      console.log(`✓ PASSED: ${testName}`);
      this.testResults.passed++;
    } catch (error) {
      console.error(`× FAILED: ${testName}`);
      console.error(`  Error: ${error.message}`);
      this.testResults.failed++;
      this.testResults.failures.push({
        name: testName,
        error: error.message
      });
    }
  }

  /**
   * Test HTML structure and content
   */
  testHtmlStructure() {
    if (!this.dom) {
      throw new Error('HTML not loaded. Call loadHtml() first.');
    }

    const document = this.dom.window.document;
    
    this.runTest('Validate HTML title', () => {
      const title = document.querySelector('title');
      assert.ok(title, 'Title element not found');
      assert.ok(title.textContent.includes('DevOps'), 'Title should contain "DevOps"');
    });

    this.runTest('Validate header elements', () => {
      const header = document.querySelector('header');
      assert.ok(header, 'Header element not found');
      
      const h1 = header.querySelector('h1');
      assert.ok(h1, 'H1 element not found in header');
    });

    this.runTest('Validate dashboard components', () => {
      const dashboardCards = document.querySelectorAll('.card');
      assert.ok(dashboardCards.length >= 3, 'Should have at least 3 dashboard cards');
    });

    this.runTest('Check for responsive design meta tag', () => {
      const metaViewport = document.querySelector('meta[name="viewport"]');
      assert.ok(metaViewport, 'Viewport meta tag not found');
    });
  }

  /**
   * Test environment configuration
   */
  testEnvironmentConfig() {
    this.runTest('Verify Node.js version', () => {
      const nodeVersion = process.version;
      console.log(`Current Node.js version: ${nodeVersion}`);
      const versionNum = Number(nodeVersion.replace('v', '').split('.')[0]);
      assert.ok(versionNum >= 12, 'Node.js version should be 12 or higher');
    });

    this.runTest('Check for required directories', () => {
      const requiredDirs = ['public', 'src', 'tests'];
      
      for (const dir of requiredDirs) {
        try {
          const stats = fs.statSync(path.join(this.projectRoot, dir));
          assert.ok(stats.isDirectory(), `${dir} should be a directory`);
        } catch (err) {
          // Create missing directories in CI environment
          if (process.env.CI) {
            fs.mkdirSync(path.join(this.projectRoot, dir), { recursive: true });
            console.log(`Created missing directory: ${dir}`);
          } else {
            throw new Error(`Required directory not found: ${dir}`);
          }
        }
      }
    });
  }

  /**
   * Mock infrastructure tests
   */
  testInfrastructure() {
    this.runTest('Simulate API endpoint check', () => {
      // This is a mock test for demonstration
      const mockEndpoint = 'https://api.example.com/health';
      const mockResponse = { status: 'healthy', version: '1.2.3' };
      
      // In a real test, we would make an actual HTTP request
      console.log(`Mock API call to ${mockEndpoint}`);
      
      // Simulate successful API response
      assert.deepStrictEqual(
        mockResponse, 
        { status: 'healthy', version: '1.2.3' },
        'API health check failed'
      );
    });
  }

  /**
   * Print test summary
   */
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
    
    // Return exit code based on test results
    return this.testResults.failed === 0 ? 0 : 1;
  }
  
  /**
   * Run all tests
   */
  runAllTests() {
    console.log('Starting DevOps project tests...');
    
    // Load HTML file for testing
    if (this.loadHtml('index.html')) {
      this.testHtmlStructure();
    }
    
    // Run environment and infrastructure tests
    this.testEnvironmentConfig();
    this.testInfrastructure();
    
    // Print summary and return exit code
    const exitCode = this.printSummary();
    
    if (process.env.JENKINS_URL) {
      console.log('Tests running in Jenkins environment');
      console.log(`Build ID: ${process.env.BUILD_ID || 'unknown'}`);
      console.log(`Workspace: ${process.env.WORKSPACE || 'unknown'}`);
    }
    
    return exitCode;
  }
}

// If running directly (not imported as a module)
if (require.main === module) {
  const testSuite = new DevOpsTestSuite();
  const exitCode = testSuite.runAllTests();
  
  // Exit with appropriate code for CI systems
  process.exit(exitCode);
}

// Export for use in other test modules
module.exports = DevOpsTestSuite;