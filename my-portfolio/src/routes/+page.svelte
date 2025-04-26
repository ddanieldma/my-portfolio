<script>
    import projects from "$lib/projects.json"
    import Project from "$lib/Project.svelte";
    import Stats from "$lib/Stats.svelte";

    import {onMount } from "svelte";

    let githubData = null;
    let loading = true;
    let error = null;

    let dataLabels = [
        "Followers",
        "Following",
        "Public Repos"
    ]
    let dataKeys = dataLabels.map(label => label.toLowerCase().replace(" ", "_"))

    onMount(async () => {
        try{
            const response = await fetch('https://api.github.com/users/ddanieldma')
            githubData = await response.json()
            
            githubData = Object.fromEntries(
                dataKeys.map(key => [key, githubData[key]])
            )

            githubData = Object.values(githubData)
            console.log("githubData", githubData)
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

<Stats 
    sectionTitle="My GitHub stats"
    data={githubData}
    dataLabels={dataLabels}
    loading={loading}
    error={error}
/>