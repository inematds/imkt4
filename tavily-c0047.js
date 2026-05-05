const { tavily } = require('@tavily/core');
const fs = require('fs');
const envData = fs.readFileSync('.env', 'utf-8');
const TAVILY_API_KEY = envData.match(/TAVILY_API_KEY=(.*)/)[1].trim();

if (!TAVILY_API_KEY) {
  console.error("TAVILY_API_KEY não encontrada no arquivo .env.");
  process.exit(1);
}

const client = tavily({ apiKey: TAVILY_API_KEY });

const queries = [
  "Dia das Mães 2026 tendências marketing digital inteligência artificial educação online Brasil",
  "campanhas Dia das Mães concorrentes educação IA automação estratégias marketing 2025",
  "mães empreendedoras dores desejos equilíbrio tempo carreira família IA produtividade",
  "melhores hooks anúncios Dia das Mães empreendedoras tecnologia IA empoderamento feminino",
  "conteúdo viral Dia das Mães redes sociais instagram 2025 2026 mães profissionais"
];

async function runSearches() {
  const results = {};
  for (const query of queries) {
    console.log(`Buscando: ${query}`);
    try {
      const response = await client.search(query, {
        searchDepth: "advanced",
        maxResults: 5
      });
      results[query] = response.results.map(r => ({ title: r.title, content: r.content }));
    } catch (e) {
      console.error(`Erro ao buscar "${query}": ${e.message}`);
    }
  }

  fs.writeFileSync('tavily_c0047_results.json', JSON.stringify(results, null, 2));
  console.log('Resultados salvos em tavily_c0047_results.json');
}

runSearches();
