<svelte:head>
    <title>Meus projetos</title>
</svelte:head>

<script>
    import * as d3 from 'd3';

    import projects from "$lib/projects.json"
    import Project from "$lib/Project.svelte";

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

    // --- Pie chart of projects x year ---
    import Pie from "$lib/Pie.svelte";

    let pieData;
    // Updating the pie chart with the filtered projects using multi-line
    // commands with the reactive statement ($)
    $: {
        // Initializing empty component
        pieData = {};
        
        // Defining data of pie chart using the filtered projects data
        // Manipulating data with d3 to get count of projects per year
        let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year)
        
        // Setting the data to the suitable format for the chart in pieData
        pieData = rolledData.map(([year, count]) => {
            return {value: count, label: year}
        })
    }

    // --- Updating projects when clicking in the chart ---
    let selectedYearIndex = -1;
    // Setting year selection with reactivity
    let selectedYear;
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

    // Filtering (the already filtered)projects by year
    $: filteredByYear = filteredProjects.filter(project => {
        if (selectedYear) {
            return project.year === selectedYear;
        }

        return true;
    })
</script>

<!-- Binding year index to the pie chart -->
<Pie 
    data={pieData}
    bind:selectedIndex={selectedYearIndex}
/>

<!-- Input field for the projects -->
<input 
type="search"
bind:value={query}
aria-label="Search projects"
placeholder="🔍 Search projects..."
/>

<h1>
    { filteredByYear.length} Projects page
</h1>

<div class="projects">
    {#each filteredByYear as p}
    <Project data={p} />
    {/each}
</div>