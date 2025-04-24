<svelte:head>
    <title>Meus projetos</title>
</svelte:head>

<script>
    import * as d3 from 'd3';

    import projects from "$lib/projects.json"
    import Project from "$lib/Project.svelte";
    import Pie from "$lib/Pie.svelte";

    // Defining data of pie chart using the projects data
    // Manipulating data with d3 to get count of projects per year
    let rolledData = d3.rollups(projects, v => v.length, d => d.year)
    // Setting the data to the suitable format for the chart in pieData
    let pieData = rolledData.map(([year, count]) => {
        return {value: count, label: year}
    })
</script>

<Pie data={pieData}/>

<h1>
    { projects.length} Projects page
</h1>

<div class="projects">
    {#each projects as p}
        <Project data={p} />
    {/each}
</div>