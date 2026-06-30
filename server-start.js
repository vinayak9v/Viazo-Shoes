#!/usr/bin/env node
process.argv = [process.argv[0], process.argv[1], 'start', '-p', '5356'];
require('./node_modules/next/dist/bin/next');
