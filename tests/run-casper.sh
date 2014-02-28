#!/bin/bash
echo "starting casper tests..."
casperjs test --includes=test-library.js --verbose --log-level=debug suites
