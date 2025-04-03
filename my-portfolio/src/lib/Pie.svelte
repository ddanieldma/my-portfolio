<script>
    // Imporitng everything from d3
    import * as d3 from 'd3';
    
    // Creating an arc generator to support generation of circles
    let arcGenerator = d3
        .arc()
        .innerRadius(0)
        .outerRadius(50);

    // Pie chart data and colors
    let data = [
        1,
        2,
        3,
        4,
        5,
        5
    ]

    // Setting automatic colors with d3
    // Colors is now a function that returns a specific color for each 
    // index given
    let colors = d3.scaleOrdinal(d3.schemeTableau10)

    // Creating the slices with the data
    let sliceGenerator = d3.pie()

    let arcData = sliceGenerator(data)

    let arcs = arcData.map(d => arcGenerator(d))


    // // Generating a circle using the arc generator
    // let arc = arcGenerator({
    //     startAngle: 0,
    //     // Rotating 360 degrees (2pi)
    //     endAngle: 2 * Math.PI
    // })

</script>

<svg viewBox="-50 -50 100 100">
    <!-- Using d3 to auto generate the path (the thing that draws the things) -->
    {#each arcs as arc, index}
        <path d={arc} fill={colors(index)} />
    {/each}

</svg>

<style>
svg {
    max-width: 20em;
    margin-block: 2em;

    /* Do not clip shapes outside the viewBox */
    overflow: visible;
}

</style>