// Keep the browser's demo indicator enabled without shell-specific env syntax.
import { createRequire } from 'node:module';
process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
process.argv.push('dev', '-H', '127.0.0.1', '-p', '3000');
const require = createRequire(import.meta.url);
require('next/dist/bin/next');
