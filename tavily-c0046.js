const { tavily } = require('@tavily/core');
const fs = require('fs');

const envData = fs.readFileSync('.env', 'utf-8');
const TAVILY_API_KEY = envData.match(/TAVILY_API_KEY=(.*)/)[1].trim();

if (!TAVILY_API_KEY) {
  console.error("TAVILY_API_KEY is not set in the .env file.");
  process.exit(1);
}

const client = tavily({ apiKey: TAVILY_API_KEY });

const queries = [
  "formatos de conteudo instagram carrossel video reels 2025 tendencias engajamento alcance",
  "estrategia volume conteudo redes sociais instagram diversidade formatos marketing digital brasil 2025",
  "dores profissionais brasileiros aprender inteligencia artificial automacao produtividade educacao online 2025",
  "melhores hooks anuncios inteligencia artificial formacao online carrossel instagram alta conversao brasil",
  "conteudo viral inteligencia artificial educacao digital comunidade online instagram tiktok brasil 2025"
];

async function runSearches() {
  const results = {};
  for (const query of queries) {
    console.log(`Pesquisando: ${query}`);
    try {
      const response = await client.search(query, {
        searchDepth: "advanced",
        maxResults: 5
      });
      results[query] = response.results.map(r => ({ title: r.title, content: r.content }));
    } catch (e) {
      console.error(`Erro ao pesquisar "${query}": ${e.message}`);
    }
  }

  fs.writeFileSync('tavily_c0046_results.json', JSON.stringify(results, null, 2));
  console.log('Resultados salvos em tavily_c0046_results.json');
}

runSearches();
