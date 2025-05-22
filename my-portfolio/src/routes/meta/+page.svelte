<script>
    import * as d3 from 'd3';

    import { onMount } from 'svelte';

    import Stats from '$lib/Stats.svelte';
    import Bar from '$lib/Bar.svelte';
    import Scatterplot from './Scatterplot.svelte';

    // Defining metadata data array
    let data = []
    let loading = true
    let error = null
    let commitMaxTime
    let minDate
    let maxDate
    let clickedCommits = []

    // Dimensions of the coordinate space
    let width = 1000, height = 600;

    // --- Fetching and using codebase data ---
    onMount(async () => {
        // Fetching and ensuring correct types in data
        data = await d3.csv('./data/loc.csv', row => ({
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

        return ret;
    }).sort(d => d.totalLines)

    $: minDate = d3.min(commits.map(d => d.date))
    $: maxDate = d3.max(commits.map(d => d.date))
    
    // Filtered version of commits based on commitMaxTime
    $: filteredCommits = commits.filter(commit => commit.datetime <= commitMaxTime)
    
    // Getting min and max dates for filtered commits (with fallbacks to
    // original dates)
    $: filteredMinDate = commits.length > 0 ? d3.min(commits, d => d.date) : minDate
    $: filteredMaxDate = commits.length > 0 ? d3.max(commits, d => d.date) : maxDate
    $: filteredMaxDatePlusOne = new Date(filteredMaxDate)
    $: filteredMaxDatePlusOne.setDate(filteredMaxDatePlusOne.getDate() + 1)

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

    // --- Bar chart ---
    // Organizing data in suitable format
    $: allTypes = Array.from(
        new Set(
            data.map(d => d.type)
        )
    )
    
    $: selectedLines = (clickedCommits.length > 0
        ? clickedCommits
        : commits
    ).flatMap(d => d.lines)
    $: selectedCounts = d3.rollup(
        selectedLines,
        v => v.length,
        d => d.type
    )
    $: languageBreakdown = allTypes.map(
        type => [type, selectedCounts.get(type) || 0]
    )

    // --- Adding date filter ---
    // Commit progress as the percentage of the total time span.
    let commitProgress = 100;
    // Mapping percentage to date
    $: timeScale = d3.scaleTime().domain([minDate, maxDate]).range([0, 100]);
    $: commitMaxTime = timeScale.invert(commitProgress)
</script>

<h1>
    Meta
</h1>

<div class="slider-container">
    <div class="slider">
        <label for="slider">Show commits until:</label>
        <input type="range" id="slider" name="slider" min=0 max=100 bind:value={commitProgress}/>
    </div>

    <time class="time-label">{commitMaxTime.toLocaleString()}</time>
</div>

<h3>
    Commits by time and day
</h3>

<Scatterplot commits={filteredCommits} bind:clickedCommits={clickedCommits}/>

<Bar data={languageBreakdown} width={width} />



<Stats 
    sectionTitle="Summary"
    data={statsData}
    dataLabels={statsLabels}
    loading={loading}
    error={error}
/>

<style>
    .slider-container{
        display: flex;
        flex-direction: column;
    }

    .slider{
        width: 100%;
    }

    input[type=range] {
        width: 100%;
    
    }

    .time-label {
        width: 100%;
        font-size: 0.75em;
        text-align: right;
    }
</style>