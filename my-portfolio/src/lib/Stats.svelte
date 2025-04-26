<script>
    export let loading = true;
    export let error = null
    export let data;
    export let dataLabels;
    export let sectionTitle;
</script>

{#if loading}
    <p>
        Carregando...
    </p>
{:else if error}
    <p class="error">
        Algo de errado aconteceu: {error.message}
    </p>
{:else}
<section>
    <h2>{sectionTitle}</h2>
    <dl>
        {#each data as dataValue, idx}
            <div>
                <dt>{dataLabels[idx]}</dt>
                <dd>{dataValue}</dd>
            </div>
        {/each}
    </dl>
</section>
{/if}

<style>
    section{
        border-width:0.15em;
        border-style:solid;
        border-color:var(--border-bottom-color-a-currnt);
        /* From https://stackoverflow.com/questions/2554181/css3-border-radius-on-a-rectangle */
        --round: 20px;
        --indent: 10px;
        border-radius: var(--round);
        background:
            radial-gradient(var(--round) at var(--indent) var(--indent), transparent 100%, var(--border-bottom-color-a-currnt) 0) top left,
            radial-gradient(var(--round) at calc(100% - var(--indent)) var(--indent), transparent 100%, var(--border-bottom-color-a-currnt) 0) top right,
            radial-gradient(var(--round) at calc(100% - var(--indent)) calc(100% - var(--indent)), transparent 100%, var(--border-bottom-color-a-currnt) 0) bottom right,
            radial-gradient(var(--round) at var(--indent) calc(100% - var(--indent)), transparent 100%, var(--border-bottom-color-a-currnt) 0) bottom left;
        background-size: 50% 50%;
        background-repeat: no-repeat;
        padding-left: 1em;
        padding-right: 1em;

        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
    
    dl{
        width: 100%;
        
        display: flex;
        justify-content: space-evenly;

        margin-bottom: 10px;
        margin-top: 0;
    }

    dl div{
        height: 20%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    dt{
        grid-row: 1;
        font-family: inherit;
        font-weight: bold;
        color: var(--border-bottom-color-a-currnt);
    }
    dd{
        font-family: inherit;
        font-weight: bold;
        margin: 0;
    }
    
    .error{
        color: red;
    }
</style>