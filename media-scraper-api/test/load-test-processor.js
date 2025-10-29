// Track metrics across the test
const metrics = {
  startTime: Date.now(),
  jobsSubmitted: 0,
  jobsFailed: 0,
  totalResponseTime: 0,
  maxResponseTime: 0,
  minResponseTime: Infinity,
  statusCounts: {},
  errorTypes: {},
};

module.exports = {
  setCustomData,
  afterResponse,
  logFinalMetrics,
};

function setCustomData(requestParams, context, ee, next) {
  // Add random think time (500ms to 3000ms)
  const delay = Math.floor(Math.random() * 2500) + 500;
  context.vars.thinkTime = delay / 1000;

  // Add timestamp for tracking
  context.vars.timestamp = new Date().toISOString();

  // Add request ID for debugging
  context.vars.requestId = `req_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  return next();
}

function afterResponse(requestParams, response, context, ee, next) {
  const responseTime = response.timings?.phases?.firstByte || 0;

  // Update basic metrics
  metrics.jobsSubmitted++;
  metrics.totalResponseTime += responseTime;
  metrics.maxResponseTime = Math.max(metrics.maxResponseTime, responseTime);
  metrics.minResponseTime = Math.min(metrics.minResponseTime, responseTime);

  // Track status codes
  const statusCode = response.statusCode;
  metrics.statusCounts[statusCode] =
    (metrics.statusCounts[statusCode] || 0) + 1;

  // Handle errors
  if (statusCode >= 400) {
    metrics.jobsFailed++;
    const errorType = getErrorType(statusCode);
    metrics.errorTypes[errorType] = (metrics.errorTypes[errorType] || 0) + 1;

    console.log(
      `[ERROR] ${context.vars.requestId} - Status: ${statusCode}, URL: ${requestParams.url}`,
    );
  }

  // Parse and emit custom metrics
  if (response.body && response.headers['content-type']?.includes('json')) {
    try {
      const body = JSON.parse(response.body);

      // Track job submission metrics
      if (Array.isArray(body) && body.length > 0) {
        ee.emit('counter', 'jobs.submitted', body.length);

        body.forEach((job) => {
          if (job.status) {
            ee.emit('counter', `job.status.${job.status}`, 1);
          }
        });
      }

      // Track processing time if available
      if (body.processingTimeMs) {
        ee.emit('customStat', {
          stat: 'scraper.processingTime',
          value: body.processingTimeMs,
        });
      }

      // Track media counts
      if (body.imageCount !== undefined) {
        ee.emit('customStat', {
          stat: 'scraper.imagesFound',
          value: body.imageCount,
        });
      }

      if (body.videoCount !== undefined) {
        ee.emit('customStat', {
          stat: 'scraper.videosFound',
          value: body.videoCount,
        });
      }

      // Track queue statistics
      if (body.meta) {
        ee.emit('customStat', {
          stat: 'api.totalItems',
          value: body.meta.totalItems || 0,
        });
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }

  // Emit custom latency metric
  ee.emit('customStat', {
    stat: 'api.responseTime',
    value: responseTime,
  });

  // Log memory warnings periodically
  if (metrics.jobsSubmitted % 100 === 0) {
    const memUsage = process.memoryUsage();
    const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);

    console.log(
      `[METRICS] Jobs: ${metrics.jobsSubmitted}, Avg Response: ${Math.round(
        metrics.totalResponseTime / metrics.jobsSubmitted,
      )}ms, Client Memory: ${memUsageMB}MB`,
    );
  }

  return next();
}

/**
 * Log final metrics summary
 * Called at the end of the test
 */
function logFinalMetrics(context, ee, next) {
  const duration = (Date.now() - metrics.startTime) / 1000;
  const avgResponseTime =
    metrics.jobsSubmitted > 0
      ? Math.round(metrics.totalResponseTime / metrics.jobsSubmitted)
      : 0;
  const errorRate =
    metrics.jobsSubmitted > 0
      ? ((metrics.jobsFailed / metrics.jobsSubmitted) * 100).toFixed(2)
      : 0;

  console.log('\n' + '='.repeat(80));
  console.log('LOAD TEST SUMMARY - Media Scraper API (1 CPU / 1GB RAM)');
  console.log('='.repeat(80));
  console.log(`Test Duration:        ${duration.toFixed(1)}s`);
  console.log(`Jobs Submitted:       ${metrics.jobsSubmitted}`);
  console.log(`Jobs Failed:          ${metrics.jobsFailed}`);
  console.log(`Error Rate:           ${errorRate}%`);
  console.log(
    `Throughput:           ${(metrics.jobsSubmitted / duration).toFixed(
      2,
    )} req/s`,
  );
  console.log(`Avg Response Time:    ${avgResponseTime}ms`);
  console.log(
    `Min Response Time:    ${
      metrics.minResponseTime === Infinity ? 0 : metrics.minResponseTime
    }ms`,
  );
  console.log(`Max Response Time:    ${metrics.maxResponseTime}ms`);
  console.log('\nStatus Code Distribution:');
  Object.entries(metrics.statusCounts)
    .sort(([a], [b]) => a - b)
    .forEach(([code, count]) => {
      const percentage = ((count / metrics.jobsSubmitted) * 100).toFixed(1);
      console.log(`  ${code}: ${count} (${percentage}%)`);
    });

  if (Object.keys(metrics.errorTypes).length > 0) {
    console.log('\nError Types:');
    Object.entries(metrics.errorTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }

  console.log('\nClient Resource Usage:');
  const memUsage = process.memoryUsage();
  console.log(
    `  Heap Used:    ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
  );
  console.log(
    `  Heap Total:   ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
  );
  console.log(
    `  External:     ${Math.round(memUsage.external / 1024 / 1024)}MB`,
  );
  console.log(`  RSS:          ${Math.round(memUsage.rss / 1024 / 1024)}MB`);

  console.log('\nPerformance Assessment:');
  assessPerformance(errorRate, avgResponseTime);

  console.log('='.repeat(80) + '\n');

  return next();
}

/**
 * Determine error type from status code
 */
function getErrorType(statusCode) {
  if (statusCode === 400) return 'Bad Request';
  if (statusCode === 401) return 'Unauthorized';
  if (statusCode === 403) return 'Forbidden';
  if (statusCode === 404) return 'Not Found';
  if (statusCode === 429) return 'Rate Limited';
  if (statusCode >= 500) return 'Server Error';
  return 'Other Error';
}

/**
 * Assess performance based on metrics
 */
function assessPerformance(errorRate, avgResponseTime) {
  const issues = [];
  const successes = [];

  // Error rate assessment
  if (errorRate > 10) {
    issues.push(`Error: High error rate: ${errorRate}% (target: <5%)`);
  } else if (errorRate > 5) {
    issues.push(`Error: Moderate error rate: ${errorRate}% (target: <5%)`);
  } else {
    successes.push(`Error: Error rate within acceptable range: ${errorRate}%`);
  }

  // Response time assessment
  if (avgResponseTime > 2000) {
    issues.push(
      `High average response time: ${avgResponseTime}ms (target: <500ms)`,
    );
  } else if (avgResponseTime > 500) {
    issues.push(
      `Moderate average response time: ${avgResponseTime}ms (target: <500ms)`,
    );
  } else {
    successes.push(`Response time within target: ${avgResponseTime}ms`);
  }

  // Throughput assessment
  const throughput =
    metrics.jobsSubmitted / ((Date.now() - metrics.startTime) / 1000);
  if (throughput < 10) {
    issues.push(`Low throughput: ${throughput.toFixed(2)} req/s`);
  } else {
    successes.push(`Good throughput: ${throughput.toFixed(2)} req/s`);
  }

  // Print assessment
  if (successes.length > 0) {
    console.log('\n  Successes:');
    successes.forEach((s) => console.log(`    ${s}`));
  }

  if (issues.length > 0) {
    console.log('\n  Issues:');
    issues.forEach((i) => console.log(`    ${i}`));
  }

  if (issues.length === 0) {
    console.log('\n  OVERALL: All performance targets met!');
  } else if (issues.filter((i) => i.startsWith('Error')).length > 0) {
    console.log('\n  OVERALL: Critical performance issues detected');
  } else {
    console.log(
      '\n  OVERALL: Some performance concerns, but system is functional',
    );
  }
}
