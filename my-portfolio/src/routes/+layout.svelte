<script>
    let pages = [
        {url: ".", title: "Home"},
        {url: "contact/", title: "Contact"},
        {url: "cv/", title: "Curriculum"},
        {url: "projects/", title: "Projects"},
        {url: "https://github.com/ddanieldma", title: "Projects"},
    ]

    import { base } from "$app/paths";
    import { page } from "$app/stores"
</script>

<nav>
    {#each pages as page_info}
        <a
            href={page_info.url.startsWith("http") ? page_info.url: `${base}${page_info.url}`}
            class:current={ $page.route.id === page_info.url }
        >
            {page_info.title}
        </a>
    {/each}
</nav>

<slot />

<!-- href="{page_info.url}" -->