<svelte:head>
    <title>Meus projetos</title>
</svelte:head>

<script>
    import projects from "$lib/projects.json"
    import Project from "$lib/Project.svelte";
    import Pie from "$lib/Pie.svelte";
</script>

<Pie />

<h1>
    { projects.length} Projects page
</h1>

<div class="chart">
    <Pie />
</div>


<div class="projects">
    {#each projects as p}
        <Project data={p} />
    {/each}
</div>

<style>
    .chart{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>