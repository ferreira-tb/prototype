import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.js',
        format: 'iife',
        generatedCode: 'es2015'
    },
    plugins: [
        nodeResolve({ extensions: ['.mjs', '.js', '.mts', '.ts'] }),
        typescript({ tsconfig: 'tsconfig.json' })
    ]
};