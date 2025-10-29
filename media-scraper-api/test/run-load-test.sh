#!/bin/bash

##############################################################################
# Load Test Runner Script for Media Scraper API
# Target: 1 CPU / 1GB RAM server handling ~5000 concurrent scraping requests
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:4000}"
TEST_DURATION="${TEST_DURATION:-full}" # full, quick, or burst
OUTPUT_DIR="./test/results"

##############################################################################
# Functions
##############################################################################

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN} $1${NC}"
}

print_error() {
    echo -e "${RED} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW} $1${NC}"
}

print_info() {
    echo -e "${BLUE}  $1${NC}"
}

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if Artillery is installed
    # if ! command -v artillery &> /dev/null; then
    #     print_error "Artillery is not installed"
    #     echo "Install it with: npm install -g artillery@latest"
    #     exit 1
    # fi
    # print_success "Artillery is installed ($(artillery version))"
    
    # Check if API is running
    if ! curl -s "${API_URL}/api/v1/scraper/statistics" > /dev/null; then
        print_error "API is not responding at ${API_URL}"
        echo "Start the API with: yarn start:prod or docker-compose up -d"
        exit 1
    fi
    print_success "API is running at ${API_URL}"
    
    # Check if jq is available (optional but helpful)
    if command -v jq &> /dev/null; then
        print_success "jq is installed (for JSON parsing)"
    else
        print_warning "jq is not installed (optional, but recommended)"
        echo "Install it with: brew install jq (macOS) or apt-get install jq (Linux)"
    fi
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    print_success "Output directory ready: $OUTPUT_DIR"
    
    echo ""
}

show_baseline_stats() {
    print_header "Baseline System Statistics"
    
    if command -v jq &> /dev/null; then
        curl -s "${API_URL}/api/v1/scraper/statistics" | jq '.'
    else
        curl -s "${API_URL}/api/v1/scraper/statistics"
    fi
    
    echo ""
}

run_load_test() {
    print_header "Starting Load Test: $TEST_DURATION"
    
    local test_file="./test/load-test.yml"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local output_file="${OUTPUT_DIR}/load-test-${timestamp}.json"
    local report_file="${OUTPUT_DIR}/load-test-${timestamp}.html"
    
    print_info "Test configuration: $test_file"
    print_info "Target: $API_URL"
    print_info "Output: $output_file"
    
    echo ""
    print_warning "This test will take approximately 17 minutes to complete"
    print_info "Monitor progress in the terminal and check:"
    echo "  - API statistics: curl ${API_URL}/api/v1/scraper/statistics | jq"
    echo "  - Bull Board: http://localhost:3001"
    echo "  - Docker stats: docker stats"
    
    echo ""
    print_info "Press Ctrl+C to abort the test (not recommended)"
    sleep 3
    
    # Run Artillery
    echo ""
    if npx artillery run \
        --target "$API_URL" \
        --output "$output_file" \
        "$test_file"; then
        
        print_success "Load test completed successfully!"
        
        # Generate HTML report if possible
        if command -v artillery &> /dev/null; then
            print_info "Generating HTML report..."
            artillery report "$output_file" --output "$report_file" 2>/dev/null || true
            if [ -f "$report_file" ]; then
                print_success "HTML report generated: $report_file"
                echo "Open it with: open $report_file (macOS) or xdg-open $report_file (Linux)"
            fi
        fi
        
        return 0
    else
        print_error "Load test failed or was interrupted"
        return 1
    fi
}

show_final_stats() {
    print_header "Final System Statistics"
    
    sleep 5  # Wait for system to stabilize
    
    if command -v jq &> /dev/null; then
        local stats=$(curl -s "${API_URL}/api/v1/scraper/statistics")
        
        echo "$stats" | jq '.'
        
        echo ""
        print_header "Summary"
        
        local queue_total=$(echo "$stats" | jq -r '.queue.total')
        local db_completed=$(echo "$stats" | jq -r '.database.completed')
        local db_failed=$(echo "$stats" | jq -r '.database.failed')
        local success_rate=$(echo "$stats" | jq -r '.database.successRate')
        local health_status=$(echo "$stats" | jq -r '.health.status')
        
        echo "Queue Total:      $queue_total jobs"
        echo "Jobs Completed:   $db_completed"
        echo "Jobs Failed:      $db_failed"
        echo "Success Rate:     $success_rate"
        echo "Health Status:    $health_status"
        
        echo ""
        
        # Determine overall result
        if [ "$health_status" = "healthy" ]; then
            print_success "System is healthy and stable!"
        else
            print_warning "System is under load but operational"
        fi
        
    else
        curl -s "${API_URL}/api/v1/scraper/statistics"
    fi
    
    echo ""
}

show_recommendations() {
    print_header "Post-Test Recommendations"
    
    echo "1. Review the Artillery report for detailed metrics"
    echo "2. Check API logs for any errors or warnings"
    echo "3. Monitor system recovery over the next 10-15 minutes"
    echo "4. If queue is large, let workers process the backlog"
    echo "5. Compare results against success criteria in LOAD_TEST_GUIDE.md"
    
    echo ""
    print_info "To clean up test data:"
    echo "  - Stop services: docker-compose down"
    echo "  - Clear database: docker-compose down -v"
    echo "  - Clear Redis: docker exec -it media-scraper-redis redis-cli FLUSHALL"
    
    echo ""
}

##############################################################################
# Main Script
##############################################################################

main() {
    clear
    
    print_header "Media Scraper API - Load Test Runner"
    echo "Target: 1 CPU / 1GB RAM | Goal: 5000 concurrent requests"
    echo ""
    
    # Run checks
    check_prerequisites
    
    # Show baseline
    show_baseline_stats
    
    # Confirm before starting
    read -p "Ready to start load test? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Load test cancelled"
        exit 0
    fi
    
    # Run the test
    if run_load_test; then
        echo ""
        show_final_stats
        show_recommendations
        
        print_success "Load test completed successfully! 🎉"
        exit 0
    else
        print_error "Load test failed"
        exit 1
    fi
}

##############################################################################
# Script Entry Point
##############################################################################

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --url)
            API_URL="$2"
            shift 2
            ;;
        --duration)
            TEST_DURATION="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --url URL          API URL (default: http://localhost:4000)"
            echo "  --duration TYPE    Test duration: full, quick, burst (default: full)"
            echo "  --help             Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                                    # Run full test on localhost"
            echo "  $0 --url http://remote:4000           # Test remote server"
            echo "  $0 --duration quick                   # Run quick test"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main
main

