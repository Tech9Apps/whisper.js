import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		target: 'node14',
		outDir: 'dist',
		lib: {
			entry: './src/index.ts',
			formats: ['cjs'],
			fileName: 'index',
		},
		rollupOptions: {
			external: ['fs', 'path', 'module'],
		},
	},
	plugins: [dts()],
});