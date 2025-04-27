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
    
    // Margin for accounting for the axis
    let margin = {top: 10, right: 10, bottom: 30, left: 20};

    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
    }
    usableArea.width = usableArea.right - usableArea.left
    usableArea.height = usableArea.bottom - usableArea.top

    $: xScale = d3.scaleTime()
        .domain([minDate, maxDatePlusOne])
        .range([usableArea.left, usableArea.right])
        .nice();

    $: yScale = d3.scaleLinear()
        .domain([24, 0])
        .range([usableArea.bottom, usableArea.top])

    // --- Adding scatter plot axis ---
    let xAxis, yAxis
    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale))
        
        d3.select(yAxis).call(
            d3.axisLeft(yScale)
                .tickFormat(
                    d => String(d % 24).
                    padStart(2, "0") + ":00"
                )
        )
    }

    let yAxisGridlines
    $: {
        d3.select(yAxisGridlines).call(
            d3.axisLeft(yScale)
                .tickFormat("")
                .tickSize(-usableArea.width)
        )
    }
</script>

<h1>
    Meta
</h1>

<h3>
    Commits by time and day
</h3>

<svg viewBox="0 0 {width} {height}">
    <!-- First the gridlines -->
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
    
    <!-- Than the axis -->
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />

    
    <!-- Finally, the dots. They must be the last thing, since we want them
        to be drawn over anything else -->
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
    
    .gridlines {
        stroke-opacity: .2;
    }

</style>