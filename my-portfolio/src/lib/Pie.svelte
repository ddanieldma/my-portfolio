<script>
    import * as d3 from 'd3';

    // Generator of arcs with radius of 50.
    let arcGenerator = d3
        .arc()
        .innerRadius(0)
        .outerRadius(50);

    // Generating arc with angle values
    let arc = arcGenerator({
        startAngle: 0,
        endAngle: 2 * Math.PI
    })

    // Pie chart data. Now accessible outside of the component.
    export let data = [];

    // Setting variables before reactive statement
    let arcData;
    let arcs;

    $: {
        // Reactively calculate arcData and arcs the same way we did 
        // before with sliceGenerator and arcGenerator
        arcData = sliceGenerator(data);
        arcs = arcData.map(d => arcGenerator(d));
    }

    // Defining colors to go with the data using a preset palette
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    // Slice generator that uses d3.pie to generate the angles of the slices
    // Defining slice generator to generate the slices based on the value 
    // field of received data
    let sliceGenerator = d3.pie().value(d => d.value);

    // --- Adding selection functionality to chart in projects page ---
    // Variable to store the selection in the pie chart
    export let selectedIndex = -1
</script>

<div class="pie-chart">
    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, index}
            <!-- Here we use () since colors is now a function -->
            <path 
                d={arc} fill={colors(index)} 
                on:click={e => selectedIndex = selectedIndex === index ? -1 : index}
                class:selected={selectedIndex === index}
                />
                {/each}
            </svg>
            
            <!-- Legend of the pie chart using an unordered list -->
            <ul class="legend">
                {#each data as d, index}
                    <li style="--color: { colors(index) }">
                        <span
                            class="swatch"
                            class:selected={selectedIndex === index}
                        ></span>

                        {d.label}

                        <em>({d.value})</em>
                    </li>
                {/each}
            </ul>
</div>

<style>
    svg {
        max-width: 20em;
        margin-block: 2em;

        /* Do not clip shapes outside the viewBox */
        overflow: visible;
    }

    .swatch {
        background-color: var(--color);
        width: 20px;
        height: 20px;
    }

    svg:has(path:hover) path:not(:hover) {
        opacity: 50%;
    }
    path {
        transition: 300ms;
        cursor: pointer;
    }
    svg:has(.selected) path:not(.selected) {
        opacity: 50%;
    }

    .selected {
        --color: oklch(60% 45% 0) !important;
        
        &:is(path) {
            fill: var(--color) !important;
        }
        
        &:is(li) {
            color: var(--color);
            opacity: 100%;
        }
    }

    ul:has(.selected) li:not(.selected) {
        color: gray;
    }
    ul:has(.selected) li:has(.selected) {
        color: var(--font-color);
    }

    path:hover {
        opacity: 100% !important;
    }

    ul {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;

        padding: 0;
        margin: 0;
    }

    li {
        display: flex;

        justify-content: start;
        align-items: end;

        gap: 5px;

        color: var(--font-color);
    }

    span {
        /* Needed for a span element to have width and height */
        width: 15px;
        height: 15px;

        /* Background color of the same color in the graph */
        background-color: var(--color);

        /* Small adjustment to make it look better */
        margin-bottom: 2px;

        /* Turning into a ball */
        border-radius: 50%;
    }

    .pie-chart {
        width: 100%;
        
        display: flex;
        align-items: center;

        align-self: center;
        gap: 5%;
    }
</style>