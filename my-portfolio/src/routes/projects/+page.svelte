<svelte:head>
    <title>Meus projetos</title>
</svelte:head>

<script>
    import * as d3 from 'd3';

    import projects from "$lib/projects.json"
    import Project from "$lib/Project.svelte";

    // --- Pie chart of projects x year ---
    import Pie from "$lib/Pie.svelte";

    // Defining data of pie chart using the projects data
    // Manipulating data with d3 to get count of projects per year
    let rolledData = d3.rollups(projects, v => v.length, d => d.year)
    // Setting the data to the suitable format for the chart in pieData
    let pieData = rolledData.map(([year, count]) => {
        return {value: count, label: year}
    })

    // --- Searching through projects ---
    // Variable to hold the search text
    let query = "";
    // Filtering projects by the search. Need to be reactive to run every
    // time we update the search input field
    $: filteredProjects = projects.filter(project => {
        // Searching for the whole project data (title and content)
        let values = Object.values(project).join("\n").toLowerCase();
        
        return values.includes(query.toLowerCase())
    })
</script>

<Pie data={pieData}/>

<!-- Input field for the projects -->
<input 
    type="search"
    bind:value={query}
    aria-label="Search projects"
    placeholder="🔍 Search projects..."
/>

<h1>
    { filteredProjects.length} Projects page
</h1>

<div class="projects">
    {#each filteredProjects as p}
        <Project data={p} />
    {/each}
</div>