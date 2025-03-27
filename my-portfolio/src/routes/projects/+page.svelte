<svelte:head>
    <title>Meus projetos</title>
</svelte:head>

<script>
    import projects from "$lib/projects.json"
</script>

<h1>
    { projects.length} Projects page
</h1>

<div class="projects">
    {#each projects as p}
        <article>
            <h3>{p.title}</h3>
            <img src={p.image} alt="" />
            <p>{p.description}</p>
        </article>
    {/each}
</div>