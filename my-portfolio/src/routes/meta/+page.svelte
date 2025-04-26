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

        // --- Computing commits data ---
        // First defining the array
        let commits = []

        // Grouping data by commit
        commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
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
        })

        console.log("Commits data", commits)
    })

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

</script>

<h1>
    Meta
</h1>

Page about the stats of the source code of this project

<p>
    Total lines of code: {data.length}
</p>

<Stats 
    sectionTitle="Summary"
    data={statsData}
    dataLabels={statsLabels}
    loading={loading}
    error={error}
/>