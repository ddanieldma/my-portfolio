<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';

    import Stats from '$lib/Stats.svelte';

    // Defining metadata data array
    let data = []
    let loading = true
    let error = null

    // --- Fetching and using codebase data ---
    onMount(async () => {
        // Fetching and ensuring correct types in data
        data = await d3.csv('/loc.csv', row => ({
            ...row,
            line: Number(row.line),
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + "T00:00" + row.timezone),
            datetime: new Date(row.datetime)
        }))
    })

    $: commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
        // Getting first line register of the commit
        let first = lines[0]
        // Defining the values based on this first line
        let {author, date, time, timezone, datetime} = first
        // Better structuring commit data
        let ret = {
            id: commit,
            url: 'https://github.com/ddanieldma/my-portfolio/commit/' + commit,
            author, date, time, timezone, datetime,
            hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
            totalLines: lines.length
        }
        
        // Like ret.lines = lines
        // but non-enumerable so it doesn't show up in JSON.stringify
        Object.defineProperty(ret, "lines", {
            value: lines,
            configurable: true,
            writable: true,
            enumerable: false
        })
        
        // Set loading to false to allow stats component to update
        loading = false

        console.log(commits)

        return ret;
    })

    // --- Setting up data for the stats component
    let statsLabels = [
        "Total Lines of Code",
        "Files",
        "Commits"
    ]

    $: statsData = [
        data.length,
        d3.groups(data, d => d.file).length,
        d3.groups(data, d => d.commit).length
    ]

    // --- Scatter plot ---
    // Dimensions of the coordinate space
    let width = 1000, height = 600;

    $: minDate = d3.min(commits.map(d => d.date))
    $: maxDate = d3.max(commits.map(d => d.date))
    $: maxDatePlusOne = new Date(maxDate)
    $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1)

    $: xScale = d3.scaleTime()
        .domain([minDate, maxDatePlusOne])
        .range([0, width])
        .nice();

    $: yScale = d3.scaleLinear()
        .domain([24, 0])
        .range([height, 0])
</script>

<h1>
    Meta
</h1>

<h3>
    Commits by time and day
</h3>

<svg viewBox="0 0 {width} {height}">
    <g class="dots">
        {#each commits as commit, index}
            <circle 
                cx = { xScale(commit.datetime) }
                cy = { yScale(commit.hourFrac) }
                r="5"
                fill="steelblue"
            />
        {/each}
    </g>
</svg>

<Stats 
    sectionTitle="Summary"
    data={statsData}
    dataLabels={statsLabels}
    loading={loading}
    error={error}
/>

<style>
    svg {
        overflow: visible;
    }
</style>