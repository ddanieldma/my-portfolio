import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			pages: 'build', // directory to output the static site
			assets: 'build', // directory for static assets (should usually be the same as pages)
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : '/my-portfolio',
		},
	},
};

export default config;