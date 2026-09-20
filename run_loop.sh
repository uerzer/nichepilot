#!/bin/bash
# NichePilot - Continuous Loop Runner
# Runs the pipeline continuously with configurable intervals

set -e

INTERVAL=${1:-3600}  # Default: 1 hour (3600 seconds)
MAX_RUNS=${2:-0}     # Default: unlimited (0 = infinite)

echo "🔄 NichePilot - Continuous Loop Mode"
echo "======================================"
echo "Interval: ${INTERVAL} seconds"
echo "Max runs: ${MAX_RUNS} (0 = infinite)"
echo "Press Ctrl+C to stop"
echo "======================================"
echo ""

RUN_COUNT=0

while true; do
    RUN_COUNT=$((RUN_COUNT + 1))
    
    echo "🚀 Starting run #${RUN_COUNT}"
    echo "Timestamp: $(date)"
    echo ""
    
    # Run the full pipeline
    bash run_all.sh
    
    echo ""
    echo "✅ Run #${RUN_COUNT} complete"
    echo ""
    
    # Check if we've hit max runs
    if [ ${MAX_RUNS} -gt 0 ] && [ ${RUN_COUNT} -ge ${MAX_RUNS} ]; then
        echo "🏁 Reached max runs (${MAX_RUNS}). Stopping."
        exit 0
    fi
    
    # Wait for next interval
    echo "⏳ Waiting ${INTERVAL} seconds before next run..."
    echo ""
    sleep ${INTERVAL}
done
