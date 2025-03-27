<script>
    export let data = {}
    export let hLevel = 2
</script>

<article>
    <svelte:element this={"h" + hLevel} >{data.title}</svelte:element>
    <img src={data.image} alt="" />
    <p>{data.description}</p>
</article>

<style>
    img {
        max-width: 100%;
    }
    
    article {
        grid-template-columns: subgrid;

        grid-row: span 3;
    }

    h2 {
        margin: 0;
    }

    h1, h2, h3 {
        text-wrap: valance;
    }
</style>