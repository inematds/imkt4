const fs = require('fs');
const { tavily } = require('@tavily/core');

const envData = fs.readFileSync('.env', 'utf-8');
const key = envData.match(/TAVILY_API_KEY=(.*)/)[1].trim();

const client = tavily({ apiKey: key });

const queries = [
  "inteligência artificial iniciantes empresas tendências 2025 transformação digital",
  "concorrentes cursos IA empresas gestores estratégias marketing Brasil 2025",
  "dores gestores empresas processos manuais automação IA resistência mudança",
  "melhores hooks anúncios IA iniciantes aprender inteligência artificial rápido",
  "conteúdo viral IA iniciantes empresas redes sociais tópicos 2025"
];

async function runSearches() {
  const results = [];
  for (const query of queries) {
    console.log(`Searching: ${query}`);
    try {
      const res = await client.search(query, { searchDepth: "advanced", maxResults: 5 });
      results.push({
        query,
        results: res.results.map(r => ({ title: r.title, content: r.content?.slice(0, 600) }))
      });
    } catch (e) {
      console.error(`Error for query "${query}":`, e.message);
      results.push({ query, results: [], error: e.message });
    }
  }
  fs.writeFileSync('tavily_c0045_results.json', JSON.stringify(results, null, 2));
  console.log('Done. Results saved to tavily_c0045_results.json');
}

runSearches();
