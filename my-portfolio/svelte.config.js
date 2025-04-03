import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');
const repoName = "my-portfolio";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true
		}),

		paths: {
			base: dev ? '' : `/${repoName}`,
		},
	},
};

export default config;