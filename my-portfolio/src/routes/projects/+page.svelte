<svelte:head>
    <title>Meus projetos</title>
</svelte:head>

<script>
    import projects from "$lib/projects.json"
    import Project from "$lib/Project.svelte";
</script>

<h1>
    { projects.length} Projects page
</h1>

<div class="projects">
    {#each projects as p}
        <Project data={p} />
    {/each}
</div>