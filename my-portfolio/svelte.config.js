import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');
const repoName = "my-portfolio";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ fallback: '404.html' }),

		paths: {
			base: dev ? '' : `/${repoName}`,
		},
	},
};

export default config;