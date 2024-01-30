import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/index.tsx'],
  ignore: ['amplify/**/*.{js,ts}', 'lambda-layers/**/*.js'],
}

export default config
