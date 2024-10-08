import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/index.tsx', 'src/shared-logic/*.ts', 'src/types/task.ts'],
  ignore: ['amplify/**/*.{js,ts}', 'lambda-layers/**/*.js', 'vite-env.d.ts'],
}

export default config
