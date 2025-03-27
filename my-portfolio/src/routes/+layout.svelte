<script>
    let pages = [
        {url: ".", title: "Home"},
        {url: "contact/", title: "Contact"},
        {url: "cv/", title: "Curriculum"},
        {url: "projects/", title: "Projects"},
        {url: "https://github.com/ddanieldma", title: "Projects"},
    ]

    // import { base } "$app/paths"
</script>

<nav>
    {#each pages as page}
        <a href="{page.url}">{page.title}</a>
    {/each}
</nav>

<slot />