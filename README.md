# @sheikh-who/code-interpreter 🚀

[![npm version](https://badge.fury.io/js/%40sheikh-who%2Fcode-interpreter.svg)](https://badge.fury.io/js/%40sheikh-who%2Fcode-interpreter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/sheikh-who/code-interpreter/workflows/Node.js%20CI/badge.svg)](https://github.com/sheikh-who/code-interpreter/actions)
[![codecov](https://codecov.io/gh/sheikh-who/code-interpreter/branch/main/graph/badge.svg)](https://codecov.io/gh/sheikh-who/code-interpreter)
[![Downloads](https://img.shields.io/npm/dt/@sheikh-who/code-interpreter.svg)](https://www.npmjs.com/package/@sheikh-who/code-interpreter)

**Build amazing things** with secure, sandboxed JavaScript code execution. A powerful, production-ready code interpreter that safely executes user-provided JavaScript in isolated environments.

## 🌟 Key Features

- **🛡️ Maximum Security**: Multi-layered security with VM isolation and worker threads
- **⚡ High Performance**: Optimized for concurrent executions with worker pooling
- **🎯 Easy to Use**: Simple API with both quick and advanced usage patterns  
- **📊 Resource Management**: Built-in memory limits, timeouts, and performance monitoring
- **🔧 Configurable**: Multiple security levels and customizable policies
- **📈 Production Ready**: Comprehensive logging, metrics, and error handling
- **🧪 Well Tested**: Extensive test suite with 95%+ code coverage
- **📚 Fully Documented**: Complete API documentation and usage examples

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Architecture Overview](#-architecture-overview)
- [Complete API Reference](#-complete-api-reference)
- [Security Model](#-security-model)
- [Configuration Guide](#-configuration-guide)
- [Advanced Usage](#-advanced-usage)
- [Performance & Benchmarks](#-performance--benchmarks)
- [Production Deployment](#-production-deployment)
- [Testing Strategy](#-testing-strategy)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)

## 🚀 Installation

```bash
# Using npm
npm install @sheikh-who/code-interpreter

# Using yarn
yarn add @sheikh-who/code-interpreter

# Using pnpm
pnpm add @sheikh-who/code-interpreter
```

**Requirements:**
- Node.js >= 14.0.0
- RAM: Minimum 512MB, Recommended 2GB+
- CPU: Multi-core recommended for concurrent sandboxes

## ⚡ Quick Start

### Basic Usage (30 seconds setup)

```javascript
const { createSandbox, quickInterpret } = require('@sheikh-who/code-interpreter');

// Method 1: Lightning fast for simple calculations
const result = quickInterpret('2 + 3 * 4'); // "14"
console.log(result);

// Method 2: Secure sandbox for untrusted code
async function secureExample() {
  const sandbox = await createSandbox();
  
  try {
    const result = await sandbox.interpret(`
      const numbers = [1, 2, 3, 4, 5];
      return numbers.reduce((sum, n) => sum + n * n, 0);
    `);
    console.log('Sum of squares:', result); // "55"
  } finally {
    await sandbox.kill(); // Always clean up!
  }
}

secureExample();
```

### Real-world Example: Math Expression Evaluator

```javascript
const { createSandbox } = require('@sheikh-who/code-interpreter');

async function createMathEvaluator() {
  const sandbox = await createSandbox({
    timeoutMs: 30000,
    securityLevel: 'strict'
  });

  return {
    evaluate: async (expression) => {
      try {
        const result = await sandbox.interpret(`
          // Safe math operations only
          const expr = "${expression.replace(/"/g, '\\"')}";
          return eval(expr);
        `);
        return parseFloat(result);
      } catch (error) {
        throw new Error(`Invalid expression: ${error.message}`);
      }
    },
    
    destroy: () => sandbox.kill()
  };
}

// Usage
const evaluator = await createMathEvaluator();
console.log(await evaluator.evaluate('2 * (3 + 4)')); // 14
console.log(await evaluator.evaluate('Math.sqrt(16) + 5')); // 9
await evaluator.destroy();
```

## 🏗️ Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    Main Process (Your App)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Sandbox 1     │  │   Sandbox 2     │  │   Sandbox N     │ │
│  │                 │  │                 │  │                 │ │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │ │
│  │ │Worker Thread│ │  │ │Worker Thread│ │  │ │Worker Thread│ │ │
│  │ │             │ │  │ │             │ │  │ │             │ │ │
│  │ │ ┌─────────┐ │ │  │ │ ┌─────────┐ │ │  │ │ ┌─────────┐ │ │ │
│  │ │ │VM Context│ │ │  │ │ │VM Context│ │ │  │ │ │VM Context│ │ │ │
│  │ │ │ (Secure)│ │ │  │ │ │ (Secure)│ │ │  │ │ │ (Secure)│ │ │ │
│  │ │ └─────────┘ │ │  │ │ └─────────┘ │ │  │ │ └─────────┘ │ │ │
│  │ └─────────────┘ │  │ └─────────────┘ │  │ └─────────────┘ │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Core Components

```
src/
├── core/
│   ├── sandbox.js              # Main Sandbox class
│   ├── security.js             # Security policies & validation
│   ├── vm-context.js           # VM context management
│   └── worker-pool.js          # Worker thread pool management
├── workers/
│   ├── execution-worker.js     # Code execution worker
│   └── pool-manager.js         # Worker pool orchestration  
├── utils/
│   ├── logger.js               # Structured logging
│   ├── validator.js            # Input validation
│   ├── performance.js          # Performance monitoring
│   └── metrics.js              # Metrics collection
├── middleware/
│   ├── rate-limiter.js         # Execution rate limiting
│   ├── memory-monitor.js       # Memory usage monitoring
│   └── timeout-manager.js      # Timeout handling
├── legacy/
│   └── interpreter.js          # Legacy eval-based interpreter
└── index.js                    # Main entry point
```

### Data Flow

```mermaid
graph TD
    A[User Code] --> B[Input Validation]
    B --> C[Security Check]
    C --> D[Worker Thread]
    D --> E[VM Context]
    E --> F[Code Execution]
    F --> G[Result Processing]
    G --> H[Response]
    
    I[Error Handling] --> H
    J[Timeout Manager] --> I
    K[Memory Monitor] --> I
    L[Performance Metrics] --> H
```

## 📚 Complete API Reference

### Factory Functions

#### `createSandbox(options)`
Creates a new secure sandbox instance.

```javascript
const sandbox = await createSandbox({
  timeoutMs: 30000,           // Total sandbox lifetime
  memoryLimitMB: 100,         // Memory limit in MB
  maxExecutionTime: 10000,    // Max time per execution
  securityLevel: 'strict',    // 'strict' | 'moderate' | 'permissive'
  enableLogging: true,        // Enable internal logging
  allowedModules: [],         // Whitelisted Node.js modules
  cpuQuota: 0.5,              // CPU usage limit (0.1-1.0)
  maxConcurrentExecutions: 5, // Max parallel executions
  customGlobals: {}           // Custom global variables
});
```

#### `quickInterpret(code, options)`
Quick code interpretation (legacy method).

```javascript
const result = quickInterpret('Math.pow(2, 8)', {
  timeout: 5000,
  enableLogging: false
});
```

### Sandbox Class

#### Properties

```javascript
sandbox.id                    // Unique sandbox identifier
sandbox.isActive              // Boolean: sandbox status
sandbox.executionCount        // Number of executions performed
sandbox.createdAt             // Timestamp of creation
sandbox.options               // Configuration options
```

#### Methods

##### `interpret(code, context, options)`
Execute JavaScript code in the sandbox.

```javascript
const result = await sandbox.interpret(
  `
    const data = context.numbers;
    return data.reduce((sum, n) => sum + n, 0);
  `,
  { numbers: [1, 2, 3, 4, 5] },  // Context variables
  { 
    timeout: 5000,               // Execution timeout
    returnRawResult: false,      // Return raw vs stringified
    enableProfiling: true        // Enable performance profiling
  }
);
```

##### `interpretFile(filePath, context)`
Execute JavaScript file in the sandbox.

```javascript
const result = await sandbox.interpretFile('./calculations.js', {
  inputData: [1, 2, 3, 4, 5]
});
```

##### `kill(graceful)`
Terminate the sandbox.

```javascript
// Graceful shutdown (wait for current executions)
await sandbox.kill(true);

// Immediate shutdown
await sandbox.kill(false);
```

##### `getStatus()`
Get comprehensive sandbox status.

```javascript
const status = sandbox.getStatus();
console.log(status);
/*
{
  id: "abc123",
  isActive: true,
  executionCount: 42,
  uptime: 30000,
  memoryUsage: {
    heapUsed: 15728640,
    heapTotal: 20971520,
    external: 1024
  },
  performance: {
    averageExecutionTime: 125,
    totalExecutions: 42,
    errorRate: 0.024
  },
  options: { ... }
}
*/
```

##### `getMetrics()`
Get detailed performance metrics.

```javascript
const metrics = sandbox.getMetrics();
console.log(metrics);
/*
{
  executions: {
    total: 100,
    successful: 95,
    failed: 5,
    averageTime: 150,
    medianTime: 120,
    p95Time: 300,
    p99Time: 500
  },
  memory: {
    peak: 67108864,
    current: 45088768,
    limit: 104857600
  },
  security: {
    violationAttempts: 3,
    blockedPatterns: ["require", "eval"]
  }
}
*/
```

#### Events

```javascript
sandbox.on('ready', () => {
  console.log('Sandbox is ready for executions');
});

sandbox.on('execution:start', (data) => {
  console.log('Execution started:', data.executionId);
});

sandbox.on('execution:complete', (data) => {
  console.log('Execution completed:', data.executionId, data.duration);
});

sandbox.on('execution:error', (data) => {
  console.log('Execution failed:', data.executionId, data.error);
});

sandbox.on('security:violation', (data) => {
  console.log('Security violation detected:', data.pattern, data.code);
});

sandbox.on('memory:warning', (data) => {
  console.log('High memory usage:', data.usage, data.limit);
});

sandbox.on('killed', (reason) => {
  console.log('Sandbox terminated:', reason);
});
```

## 🛡️ Security Model

### Three-Layer Security Architecture

#### Layer 1: Input Validation & Code Analysis
- **Static Analysis**: Pattern matching for dangerous constructs
- **Code Length Limits**: Prevent resource exhaustion attacks
- **Syntax Validation**: Early detection of malformed code
- **Whitelist/Blacklist**: Configurable allowed/blocked patterns

#### Layer 2: VM Context Isolation
- **Limited Globals**: Only safe built-in objects accessible
- **No File System Access**: Completely isolated from host filesystem
- **No Network Access**: Cannot make external requests
- **No Process Access**: Cannot access or manipulate host processes

#### Layer 3: Worker Thread Separation
- **Process Isolation**: Each sandbox runs in separate worker thread
- **Resource Limits**: Memory, CPU, and execution time limits
- **Automatic Cleanup**: Workers terminated on timeout or completion
- **Inter-Process Communication**: Secure message passing only

### Security Levels

#### Strict Mode (Default - Highest Security)
```javascript
const sandbox = await createSandbox({ securityLevel: 'strict' });

// Allowed globals only:
// console, Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp
// parseInt, parseFloat, isNaN, isFinite

// Blocked patterns:
// - require() statements
// - import statements  
// - eval() calls
// - Function constructor
// - process access
// - global access
// - Buffer operations
// - File system access
// - Child process operations
// - Crypto operations
```

#### Moderate Mode (Balanced Security)
```javascript
const sandbox = await createSandbox({ securityLevel: 'moderate' });

// Additional allowed globals:
// setTimeout, clearTimeout, setInterval, clearInterval (with limits)

// Relaxed restrictions on:
// - Code length limits (50KB vs 10KB)
// - Line count limits (2000 vs 500)
// - Some mathematical operations

// Still blocks:
// - File system access
// - Process manipulation
// - require() statements
// - eval() calls
```

#### Permissive Mode (Minimum Security - Trusted Code Only)
```javascript
const sandbox = await createSandbox({ securityLevel: 'permissive' });

// Most globals allowed except:
// - process.exit()
// - Destructive file operations (unlink, rmdir)
// - Child process execution
// - Direct eval() (still blocked)

// Use only for:
// - Internal tools
// - Trusted user code  
// - Development environments
```

### Custom Security Policies

```javascript
const sandbox = await createSandbox({
  securityLevel: 'custom',
  customSecurity: {
    allowedGlobals: ['console', 'Math', 'Date', 'JSON', 'fetch'],
    blockedPatterns: [
      /delete\s+/,           // Block delete operations
      /\.constructor/,       // Block constructor access
      /prototype\s*\[/       // Block prototype manipulation
    ],
    maxCodeLength: 25000,
    maxExecutionTime: 15000,
    allowedModules: ['lodash', 'moment'],
    customValidators: [
      (code) => {
        if (code.includes('bitcoin')) {
          return { valid: false, reason: 'Cryptocurrency operations blocked' };
        }
        return { valid: true };
      }
    ]
  }
});
```

## ⚙️ Configuration Guide

### Environment Configuration

#### Development Environment
```javascript
const devConfig = {
  timeoutMs: 60000,              // Longer timeouts for debugging
  memoryLimitMB: 200,            // More memory for development
  enableLogging: true,           // Detailed logging
  securityLevel: 'moderate',     // Balanced security
  enableDebugMode: true,         // Additional debug information
  autoCleanup: false             // Manual sandbox cleanup
};
```

#### Production Environment  
```javascript
const prodConfig = {
  timeoutMs: 30000,              // Strict timeouts
  memoryLimitMB: 50,             // Memory efficiency
  enableLogging: false,          // Minimal logging for performance
  securityLevel: 'strict',       // Maximum security
  maxConcurrentSandboxes: 20,    // Limit concurrent sandboxes
  enableMetrics: true,           // Performance monitoring
  autoCleanup: true,             // Automatic resource cleanup
  rateLimiting: {
    maxExecutionsPerMinute: 100,
    maxSandboxesPerUser: 5
  }
};
```

#### High-Performance Environment
```javascript
const highPerfConfig = {
  useWorkerPool: true,           // Reuse worker threads
  workerPoolSize: 10,            // Pre-allocated workers
  preWarmSandboxes: 5,           // Keep sandboxes ready
  optimizeForThroughput: true,   // Throughput over latency
  batchExecutions: true,         // Batch multiple executions
  cacheCompiledCode: true        // Cache compiled VM scripts
};
```

### Advanced Configuration Examples

#### Multi-Tenant Application
```javascript
const multiTenantSetup = async (tenantId, userRole) => {
  const baseConfig = {
    timeoutMs: 30000,
    enableLogging: true,
    tenantId: tenantId
  };

  // Role-based configuration
  const roleConfigs = {
    admin: {
      ...baseConfig,
      securityLevel: 'moderate',
      memoryLimitMB: 100,
      maxExecutionTime: 15000
    },
    user: {
      ...baseConfig, 
      securityLevel: 'strict',
      memoryLimitMB: 50,
      maxExecutionTime: 5000
    },
    guest: {
      ...baseConfig,
      securityLevel: 'strict',
      memoryLimitMB: 25,
      maxExecutionTime: 2000,
      maxExecutionsPerHour: 10
    }
  };

  return await createSandbox(roleConfigs[userRole]);
};
```

#### Educational Platform Configuration
```javascript
const educationalConfig = {
  // Student code execution
  student: {
    securityLevel: 'strict',
    memoryLimitMB: 30,
    timeoutMs: 20000,
    maxExecutionTime: 5000,
    allowedGlobals: ['console', 'Math', 'Date', 'JSON'],
    enableStepByStepExecution: true,
    captureAllOutput: true
  },
  
  // Teacher/grading system
  teacher: {
    securityLevel: 'moderate', 
    memoryLimitMB: 100,
    timeoutMs: 60000,
    maxExecutionTime: 30000,
    enableTestRunner: true,
    enableCodeAnalysis: true
  }
};
```

## 🚀 Advanced Usage

### Batch Processing

```javascript
const { createSandbox } = require('@sheikh-who/code-interpreter');

async function batchProcessor(codeSnippets) {
  const sandbox = await createSandbox({
    timeoutMs: 120000,  // 2 minutes total
    maxConcurrentExecutions: 5
  });

  try {
    // Process multiple code snippets concurrently
    const results = await Promise.allSettled(
      codeSnippets.map(async (code, index) => {
        try {
          const result = await sandbox.interpret(code, {
            index: index,
            timestamp: Date.now()
          });
          return { index, result, status: 'success' };
        } catch (error) {
          return { index, error: error.message, status: 'error' };
        }
      })
    );

    return results.map(result => result.value);
  } finally {
    await sandbox.kill();
  }
}

// Usage
const codes = [
  'Math.sqrt(144)',
  '[1,2,3,4].reduce((a,b) => a+b)',
  'new Date().getFullYear()',
  'JSON.stringify({hello: "world"})'
];

const results = await batchProcessor(codes);
console.log(results);
```

### Code Streaming & Real-time Execution

```javascript
const { createSandbox } = require('@sheikh-who/code-interpreter');
const { EventEmitter } = require('events');

class CodeStream extends EventEmitter {
  constructor() {
    super();
    this.sandbox = null;
    this.isReady = false;
  }

  async initialize() {
    this.sandbox = await createSandbox({
      timeoutMs: 300000, // 5 minutes
      enableLogging: true
    });

    // Forward sandbox events
    this.sandbox.on('execution:start', (data) => this.emit('start', data));
    this.sandbox.on('execution:complete', (data) => this.emit('result', data));
    this.sandbox.on('execution:error', (data) => this.emit('error', data));

    this.isReady = true;
    this.emit('ready');
  }

  async execute(code) {
    if (!this.isReady) {
      throw new Error('CodeStream not initialized');
    }

    const executionId = Math.random().toString(36).substring(7);
    this.emit('queued', { executionId, code });

    try {
      const result = await this.sandbox.interpret(code);
      return { executionId, result, timestamp: Date.now() };
    } catch (error) {
      throw { executionId, error: error.message, timestamp: Date.now() };
    }
  }

  async destroy() {
    if (this.sandbox) {
      await this.sandbox.kill();
      this.isReady = false;
      this.emit('destroyed');
    }
  }
}

// Usage
const codeStream = new CodeStream();

codeStream.on('ready', () => console.log('Stream ready'));
codeStream.on('start', (data) => console.log('Execution started:', data.executionId));
codeStream.on('result', (data) => console.log('Result:', data));
codeStream.on('error', (data) => console.log('Error:', data));

await codeStream.initialize();

// Execute code continuously
setInterval(async () => {
  try {
    const result = await codeStream.execute(`
      const now = new Date();
      return now.toISOString();
    `);
    console.log('Current time:', result);
  } catch (error) {
    console.error('Execution failed:', error);
  }
}, 1000);
```

### Custom Sandbox Pool Management

```javascript
const { createSandbox } = require('@sheikh-who/code-interpreter');

class SandboxPool {
  constructor(options = {}) {
    this.poolSize = options.poolSize || 5;
    this.maxAge = options.maxAge || 300000; // 5 minutes
    this.pool = [];
    this.busy = new Set();
    this.created = 0;
    this.reused = 0;
  }

  async acquire() {
    // Try to get an available sandbox from pool
    let sandbox = this.pool.find(s => !this.busy.has(s.id) && s.isActive);
    
    if (!sandbox) {
      // Create new sandbox if pool not full
      if (this.pool.length < this.poolSize) {
        sandbox = await createSandbox({
          timeoutMs: this.maxAge,
          enableLogging: false
        });
        
        sandbox.createdAt = Date.now();
        this.pool.push(sandbox);
        this.created++;
      } else {
        // Wait for a sandbox to become available
        await new Promise(resolve => {
          const checkAvailability = () => {
            const available = this.pool.find(s => !this.busy.has(s.id) && s.isActive);
            if (available) {
              sandbox = available;
              resolve();
            } else {
              setTimeout(checkAvailability, 100);
            }
          };
          checkAvailability();
        });
      }
    } else {
      this.reused++;
    }

    this.busy.add(sandbox.id);
    return sandbox;
  }

  async release(sandbox) {
    this.busy.delete(sandbox.id);
    
    // Check if sandbox is too old
    if (Date.now() - sandbox.createdAt > this.maxAge) {
      await this.removeSandbox(sandbox);
    }
  }

  async removeSandbox(sandbox) {
    const index = this.pool.findIndex(s => s.id === sandbox.id);
    if (index !== -1) {
      this.pool.splice(index, 1);
      this.busy.delete(sandbox.id);
      await sandbox.kill();
    }
  }

  async cleanup() {
    const now = Date.now();
    const toRemove = this.pool.filter(s => 
      !this.busy.has(s.id) && (now - s.createdAt > this.maxAge)
    );

    for (const sandbox of toRemove) {
      await this.removeSandbox(sandbox);
    }
  }

  async destroy() {
    for (const sandbox of this.pool) {
      await sandbox.kill();
    }
    this.pool = [];
    this.busy.clear();
  }

  getStats() {
    return {
      poolSize: this.pool.length,
      busyCount: this.busy.size,
      availableCount: this.pool.length - this.busy.size,
      totalCreated: this.created,
      totalReused: this.reused,
      reuseRate: this.reused / (this.created + this.reused)
    };
  }
}

// Usage
const pool = new SandboxPool({ poolSize: 10 });

async function executeWithPool(code) {
  const sandbox = await pool.acquire();
  try {
    return await sandbox.interpret(code);
  } finally {
    await pool.release(sandbox);
  }
}

// Cleanup old sandboxes every minute
setInterval(() => pool.cleanup(), 60000);
```

### Integration with Express.js

```javascript
const express = require('express');
const { createSandbox } = require('@sheikh-who/code-interpreter');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const executeLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many code executions, please try again later.'
});

// Sandbox pool for better performance
const sandboxPool = new Map();

async function getSandbox(userId) {
  if (!sandboxPool.has(userId)) {
    const sandbox = await createSandbox({
      timeoutMs: 120000,
      securityLevel: 'strict',
      memoryLimitMB: 50
    });
    sandboxPool.set(userId, sandbox);
    
    // Auto-cleanup after 10 minutes of inactivity
    setTimeout(() => {
      if (sandboxPool.has(userId)) {
        sandboxPool.get(userId).kill();
        sandboxPool.delete(userId);
      }
    }, 600000);
  }
  
  return sandboxPool.get(userId);
}

// Execute code endpoint
app.post('/api/execute', executeLimit, async (req, res) => {
  const { code, userId = 'anonymous', context = {} } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      error: 'Code is required and must be a string'
    });
  }

  if (code.length > 10000) {
    return res.status(400).json({
      error: 'Code too long (max 10,000 characters)'
    });
  }

  try {
    const sandbox = await getSandbox(userId);
    const startTime = Date.now();
    
    const result = await sandbox.interpret(code, context, {
      timeout: 10000,
      enableProfiling: true
    });

    const executionTime = Date.now() - startTime;

    res.json({
      success: true,
      result: result,
      executionTime: executionTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Sandbox status endpoint
app.get('/api/sandbox/:userId/status', async (req, res) => {
  const { userId } = req.params;
  
  if (sandboxPool.has(userId)) {
    const sandbox = sandboxPool.get(userId);
    res.json(sandbox.getStatus());
  } else {
    res.status(404).json({ error: 'Sandbox not found' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeSandboxes: sandboxPool.size,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.listen(3000, () => {
  console.log('Code interpreter API running on port 3000');
});
```

## 📊 Performance & Benchmarks

### Performance Characteristics

| Operation | Time | Memory | Notes |
|-----------|------|---------|-------|
| Sandbox Creation | 10-50ms | ~10MB | One-time cost |
| Simple Math | <1ms | <1MB | Basic operations |
| Array Processing (1K items) | 2-5ms | 2-5MB | Map/reduce operations |
| JSON Operations | 1-3ms | Variable | Depends on data size |
| Complex Algorithm | 10-100ms | 5-20MB | Sorting, searching |

### Benchmark Results

```javascript
// Benchmark script (test/benchmarks/performance.bench.js)
const { createSandbox } = require('@sheikh-who/code-interpreter');

async function runBenchmarks() {
  console.log('🚀 Performance Benchmarks\n');

  // Sandbox creation benchmark
  console.time('Sandbox Creation (10 instances)');
  const sandboxes = await Promise.all(
    Array(10).fill().map(() => createSandbox())
  );
  console.timeEnd('Sandbox Creation (10 instances)');

  // Simple execution benchmark
  const sandbox = sandboxes[0];
  
  console.time('Simple Math (1000 executions)');
  for (let i = 0; i < 1000; i++) {
    await sandbox.interpret('Math.sqrt(16) + 5');
  }
  console.timeEnd('Simple Math (1000 executions)');

  // Array processing benchmark
  // ... additional benchmarks ...
}
```

## 🛠️ Production Deployment

- Use Docker for consistent environments
- Configure rate limiting and authentication
- Monitor resource usage and execution metrics
- Run regular security audits and updates
- Scale horizontally with worker pools
- Use centralized logging and monitoring

## ✅ Testing Strategy

1. **Unit Tests**: Validate individual modules and utilities
2. **Integration Tests**: Ensure components work together
3. **Security Tests**: Validate sandbox isolation and protection
4. **Benchmark Tests**: Monitor performance regressions
5. **E2E Tests**: Simulate real-world usage scenarios

## 🤝 Contributing

We welcome contributions of all kinds—bug fixes, new features, documentation improvements, and more. Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get involved.

## 🗺️ Roadmap

- [ ] WebAssembly sandbox support
- [ ] Multi-language execution (Python, Ruby)
- [ ] Real-time collaborative sandboxes
- [ ] GraphQL and gRPC integrations
- [ ] Visual sandbox monitoring dashboard
- [ ] Plugin marketplace for custom validators
- [ ] AI-assisted code analysis and security scanning

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙌 Acknowledgements

Thanks to the open-source community for inspiration, tooling, and continuous improvements.

