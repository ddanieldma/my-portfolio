<script>
    import * as d3 from 'd3';

    import {
        computePosition,
        autoPlacement,
        offset,
    } from '@floating-ui/dom'

    // --- Scatter plot ---
    export let commits
    
    // Dimensions of the coordinate space
    let width = 1000, height = 600;
    
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

    $: minDate = d3.min(commits.map(d => d.date))
    $: maxDate = d3.max(commits.map(d => d.date))
    $: maxDatePlusOne = new Date(maxDate)
    $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1)

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

    // --- Adding tooltip ---
    // Defining the cursor
    let cursor = {x: 0, y: 0}
    
    let hoveredIndex = -1
    $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {}
    
    // Using floating UI to make an improved tooltip
    let commitTooltip;
    // Making it follow the mouse
    let tooltipPosition = {x: 0, y: 0}

    // --- Clickable commits ---
    // Should work with a toggle switch, where we add commits that are 
    // clicked and remove those that are clicked again
    export let clickedCommits = []

    async function dotInteraction(index, evt) {
        let hoveredDot = evt.target;
        
        if (evt.type === "mouseenter") {
            hoveredIndex = index
            cursor = {x: evt.x, y: evt.y}

            tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
                strategy: "fixed", // because we use position fixed
                middleware: [
                    offset(5), // spacing from tooltip to dot
                    autoPlacement()
                ],
            })
        }
        else if (evt.type === "mouseleave") {
            hoveredIndex = -1
        }
        else if(evt.type === "click") {
            let commit = commits[index]
            // Adding newly clicked commit
            if (!clickedCommits.includes(commit)){
                clickedCommits = [...clickedCommits, commit]
            }
            else {
                clickedCommits = clickedCommits.filter(c => c !== commit)
            }
            console.log("clicked commits:", clickedCommits)
        }
    }

    // --- Making the size of the dots as the number of lines edited in 
    // the commit ---
    // Defining the scale of the radii
    $: rScale = d3.scaleSqrt()
        .domain(d3.extent(commits.map(d => d.totalLines)))
        .range([2, 30])
</script>

<svg viewBox="0 0 {width} {height}">
    <!-- First the gridlines -->
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
    
    <!-- Than the axis -->
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />

    
    <!-- Finally, the dots. They must be the last thing, since we want them
        to be drawn over anything else -->
    <g class="dots">
        {#each commits as commit, index (commit.id)}
            <circle 
                on:mouseenter={evt => dotInteraction(index, evt)}
                on:mouseleave={evt => dotInteraction(index, evt)}
                on:click={ evt => dotInteraction(index, evt) }
            
                class:selected={ clickedCommits.includes(commit) }

                cx = { xScale(commit.datetime) }
                cy = { yScale(commit.hourFrac) }
                r={ rScale(commit.totalLines) }
                fill="steelblue"
            />
        {/each}
    </g>
</svg>

<dl
    class="info tooltip"
    hidden={hoveredIndex === -1}
    style = "top: {tooltipPosition.y}px; left: {tooltipPosition.x}px"
    bind:this={commitTooltip}
>
    <div>
        <dt>Commit</dt>
        <dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>
    </div>

    <div>
        <dt>Date</dt>
        <dd>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>
    </div>
    
    <div>
        <dt>Time</dt>
        <dd>{ hoveredCommit.time }</dd>
    </div>

    <div>
        <dt>Author</dt>
        <dd>{ hoveredCommit.author }</dd>
    </div>
    
    <div>
        <dt>Lines</dt>
        <dd>{ hoveredCommit.totalLines }</dd>
    </div>
</dl>

<style>
    svg {
        overflow: visible;
    }
    
    .gridlines {
        stroke-opacity: .2;
    }

    .info{
        display: flex;
        flex-direction: column;
        align-items: start;

        margin: 0;
        padding:10px;

        background-color: oklch(100% 0% 0 / 80%);
        box-shadow: 1px 1px 3px 3px gray;
        border-radius: 5px;
        backdrop-filter: blur(10px);
        
        transition-duration: 500ms;
        transition-property: opacity, visibility;

        &[hidden]:not(:hover, :focus-within){
            opacity: 0;
            visibility: hidden;
        }
    }

    .info div {
        display: flex;
        align-items: center;
    }

    .info dd{
        font-weight: 400;
    }

    .tooltip{
        position: fixed;
        top: 1em;
        left: 1em;
    }

    circle {
        transition: 200ms;

        transform-origin: center;
        transform-box: fill-box;

        &:hover {
            transform: scale(1.5);
            fill-opacity: 1;
        }

        fill-opacity: 0.2;

        @starting-style {
            r: 0;
        }
    }

    .selected {
        fill-opacity: 1;
        
        fill: var(--border-bottom-color-a-current);
    }
</style>