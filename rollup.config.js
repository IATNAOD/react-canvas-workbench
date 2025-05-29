import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import autoprefixer from 'autoprefixer';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import postcssUrl from 'postcss-url';

import pkg from './package.json' with { type: 'json' };

export default {
	input: 'src/index.js',
	output: [
		{ file: pkg.main, format: 'cjs', sourcemap: true },
		{ file: pkg.module, format: 'esm', sourcemap: true },
	],
	plugins: [
		peerDepsExternal(),
		resolve({ extensions: ['.js', '.jsx', '.scss'] }),
		commonjs(),
		json(),
		url({ include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif'] }),

		postcss({
			extensions: ['.css', '.scss', '.sass'],
			preprocessor: (content, id) =>
				new Promise((resolve, reject) => {
					const result = require('sass').renderSync({ file: id });
					resolve({ code: result.css.toString() });
				}),
			plugins: [autoprefixer(), postcssUrl({ url: 'inline' })],
			minimize: true,
			sourceMap: true,
		}),
		babel({
			babelHelpers: 'runtime',
			exclude: 'node_modules/**',
			extensions: ['.js', '.jsx'],
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
			preventAssignment: true,
		}),
	],
};
