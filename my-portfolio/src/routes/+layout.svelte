<script>
    import { base } from "$app/paths"
    import { page } from "$app/stores"
    
    let pages = [
        {url: "/", title: "Home"},
        {url: "/contact", title: "Contact"},
        {url: "/cv", title: "Curriculum"},
        {url: "/projects", title: "Projects"},
        {url: "https://github.com/ddanieldma", title: "Projects"},
    ]

    let localStorage = globalThis.localStorage ?? {}
    
    // Variable to hold color scheme preference
    let colorScheme = localStorage.colorScheme
        ? localStorage.colorScheme
        : "light dark"

    // Variable to hold the <html> element
    let root = globalThis?.document?.documentElement // the optional chaining operator "?" is added to avoid error
    $: root?.style.setProperty("color-scheme", colorScheme) // "$": reactive statement: this changes every time its dependencies change
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