<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<script>
    import projects from "$lib/projects.json"
    import Project from "$lib/Project.svelte"
</script>

<h1>
    Projects page. Number of projects: { projects.length }
</h1>

<div class="projects">
    {#each projects as p}
        <Project data={p} hLevel="3" />
    {/each}
</div>

<style>
    .projects{
        margin: 0;
        grid-row: span 3;   
        grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
    }

</style>
