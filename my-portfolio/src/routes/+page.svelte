<script>
    import projects from "$lib/projects.json"
    import Project from "$lib/Project.svelte";

    import {onMount } from "svelte";

    let githubData = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        try{
            const response = await fetch('https://api.github.com/users/ddanieldma')
            githubData = await response.json()
        }
        catch (err) {
            error = err;
        }
        loading = false
    })
</script>

<h1> Daniel de Miranda Almeida </h1>

<p> I'm a Data Science and Artificial Inteligence student </p>

<img src="images/daniel-miranda.jpg" alt="a dog in the middle of tulips" width="500">

<p>
    Caros amigos, a revolução dos costumes apresenta tendências no sentido de aprovar a manutenção das diretrizes de desenvolvimento para o futuro. Nunca é demais lembrar o peso e o significado destes problemas, uma vez que a mobilidade dos capitais internacionais oferece uma interessante oportunidade para verificação das condições inegavelmente apropriadas.
</p>
<p>
    Dado o fluxo de dados atual, a disposição dos elementos HTML causou o bug da execução de requisições effcientes na API. Nesse pull request, a compilação final do programa otimizou a renderização do nosso servidor de DNS.
</p>
<p>
    Desde ontem a noite o gerenciador de dependências do frontend deletou todas as entradas de compilação multi-plataforma de forma assíncrona. Dado o fluxo de dados atual, o módulo de recursão paralela otimizou a renderização na estabilidade do protocolo de transferência de dados.
</p>
<p>
    Caros amigos, a revolução dos costumes apresenta tendências no sentido de aprovar a manutenção das diretrizes de desenvolvimento para o futuro. Nunca é demais lembrar o peso e o significado destes problemas, uma vez que a mobilidade dos capitais internacionais oferece uma interessante oportunidade para verificação das condições inegavelmente apropriadas.
</p>

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
        <h2>Estatísicas do meu GitHub</h2>
        <dl>
            <div>
                <dt>Followers</dt>
                <dd>{githubData.followers}</dd>
            </div>
            <div>
                <dt>Following</dt>
                <dd>{githubData.following}</dd>
            </div>
            <div>
                <dt>Public Repos</dt>
                <dd>{githubData.public_repos}</dd>
            </div>
        </dl>
    </section>
{/if}

<style>
    dl{
        width: 100%;
        
        display: flex;
        justify-content: space-around;
    }

    dl div{
        height: 20%;
    }

    dt{
        grid-row: 1;
        font-family: inherit;
        font-weight: bold;
        color: var(--border-bottom-color-a-currnt);
        text-transform: uppercase;
    }
    dd{
        font-family: inherit;
        font-weight: bold;
    }
    section{
        border-width:0.15em;
        border-style:solid;
        border-color:var(--border-bottom-color-a-currnt);
        padding-left: 1em;
        padding-right: 1em;

        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
</style>