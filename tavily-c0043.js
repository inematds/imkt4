const { tavily } = require('@tavily/core');
const fs = require('fs');

const envData = fs.readFileSync('.env', 'utf-8');
const TAVILY_API_KEY = envData.match(/TAVILY_API_KEY=(.*)/)[1].trim();

if (!TAVILY_API_KEY) {
  console.error("TAVILY_API_KEY não encontrada no .env");
  process.exit(1);
}

const client = tavily({ apiKey: TAVILY_API_KEY });

const queries = [
  "gestores liderança empresarial inteligência artificial 2025 2026 tendências transformação digital competitividade mercado",
  "executivos CEO liderança IA estratégias concorrentes marketing mensagens adoção inteligência artificial empresas brasil",
  "dores gestores resistência inteligência artificial produtividade empresas líderes que ignoram IA perdem competitividade",
  "melhores hooks anúncios gestores liderança inteligência artificial urgência provocação conteúdo viral linkedin instagram",
  "tópicos virais redes sociais liderança inteligência artificial gestão produtividade inovação competitividade 2025 2026"
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

  fs.writeFileSync('tavily_c0043_results.json', JSON.stringify(results, null, 2));
  console.log('Resultados salvos em tavily_c0043_results.json');
}

runSearches();
