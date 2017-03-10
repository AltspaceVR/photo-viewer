import cjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/main.js',
	format: 'iife',
	plugins: [cjs(), resolve(), buble()],
	dest: 'public/bundle.js'
}
