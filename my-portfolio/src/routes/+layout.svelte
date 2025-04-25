<script>
    import { base } from "$app/paths"
    import { page } from "$app/stores"
    import { onMount } from "svelte";
    
    let pages = [
        {url: "/", title: "Home"},
        {url: "/contact", title: "Contact"},
        {url: "/cv", title: "Curriculum"},
        {url: "/projects", title: "Projects"},
        {url: "/meta", title: "Meta"},
        {url: "https://github.com/ddanieldma", title: "GitHub"},
    ]

    let localStorage = globalThis.localStorage ?? {}
    
    function updateColorScheme() {
        if (root) {
            let actualColorScheme = colorScheme;

            if (colorScheme === 'light dark') {
                // Using media query to detect OS preference
                actualColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
            }
            
            root.style.setProperty('color-scheme', colorScheme)

            if (actualColorScheme === 'dark'){
                root.classList.add('dark')
            }
            else {
                root.classList.remove('dark')
            }
            console.log('Setting color-scheme:', actualColorScheme)
        }
    }

    // Variable to hold default color scheme preference
    let colorScheme = 'light dark'
    let root;

    onMount(() => {
        // Accessing localStorage in SvelteKit
        if (typeof window !== 'undefined') {
            colorScheme = localStorage.getItem('colorScheme') || 'light dark';
        }
        root = document.documentElement;
        updateColorScheme(); // Initial application of the theme.
        // If no theme is set, will set to 'light dark'.
    })

    // Reactive statement to update the theme and localStorage
    $: {
        if (root) {
            updateColorScheme();
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('colorScheme', colorScheme)
        }
    }
</script>

<nav>
    {#each pages as page_info}
        <a
            href={
                page_info.url.startsWith("http") ?
                page_info.url :
                `${base}${page_info.url}`
            }
            
            class:current={ $page.route.id === page_info.url }
            
            target={
                page_info.url.startsWith('http') ?
                "_blank" :
                undefined
            }
        >
            {page_info.title}
        </a>
    {/each}
</nav>

<label for="" class="color-scheme">
    Theme:
    <!-- Creating reactivity by double binding values -> if one changes, the other changes too -->
    <select bind:value={ colorScheme }>
        <option value="light dark">
            Automatic
        </option>
        <option value="light">
            Light
        </option>
        <option value="dark">
            Dark
        </option>
    </select>
</label>

<slot />

<style>
/* Color switcher */
.color-scheme {
	position: absolute;
	
	top: 1rem;
	right: 1rem;

	display: inline-flex;
	gap: 4px;

	font-family: inherit;
	font-size: 80%;
}
</style>