import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    // Existing localStorage hydration is scheduled for Phase 2. Keep this new
    // React rule visible while preserving the framework-only migration scope.
    files: ['src/components/layout/Header.tsx', 'src/components/api-docs/KeyManager.tsx'],
    rules: { 'react-hooks/set-state-in-effect': 'warn' },
  },
  globalIgnores(['.next/**', '.kilo/**', 'out/**', 'build/**', 'coverage/**', 'test-results/**', 'playwright-report/**', 'next-env.d.ts']),
]);
