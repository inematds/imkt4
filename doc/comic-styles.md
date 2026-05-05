# Comic Styles — Variações Visuais para CriaProf-CTA-916

5 sub-estilos de quadrinho americano testados em 2026-05-03 para gerar versões alternativas do template CriaProf-CTA-916.

Amostras geradas em `/tmp/comic-samples/` (cena: criança fisioterapeuta brincando com bonecas).

---

## A — Classic Newspaper Strip (Calvin & Hobbes)

**Vibe:** linha à mão, aquarela suave, expressivo, cotidiano, universal. Funciona pra mostrar criança/adulto/idoso da mesma profissão sem perder identidade.

**Referências:** Bill Watterson (Calvin and Hobbes), Charles Schulz (Peanuts), Jim Davis (Garfield).

**Prompt suffix:**
```
Newspaper comic strip illustration in the style of Bill Watterson Calvin and Hobbes,
expressive ink linework with light watercolor wash, hand-drawn aesthetic,
no text, no captions, no logos
```

Sample: `/tmp/comic-samples/A_calvin_hobbes.png`

---

## B — MAD Magazine Satire

**Vibe:** caricatura exagerada, traços nervosos, cores planas brilhantes, humor ácido. Mais editorial e satírico.

**Referências:** Mort Drucker, Sergio Aragonés, Jack Davis (MAD Magazine).

**Prompt suffix:**
```
MAD Magazine satirical illustration in the style of Mort Drucker,
exaggerated caricature with nervous expressive ink linework,
flat brilliant cartoon colors, ironic humorous tone,
no text, no captions, no logos
```

Sample: `/tmp/comic-samples/B_mad_magazine.png`

---

## C — Pop Art Lichtenstein

**Vibe:** halftone Ben-Day dots, cores primárias chapadas, contornos pretos grossos, dramático. Forte impacto visual mas pode cansar a vista em 50 imgs sequência.

**Referências:** Roy Lichtenstein, comic books 1960s (Marvel/DC silver age).

**Prompt suffix:**
```
Pop art comic book panel in the style of Roy Lichtenstein,
prominent Ben-Day halftone dots, bold primary colors,
thick black outlines, dramatic 1960s comic book aesthetic,
no text, no captions, no logos
```

Sample: `/tmp/comic-samples/C_pop_art_lichtenstein.png`

---

## D — Modern Indie Adventure Time

**Vibe:** traço simples, cores chapadas, formas bean-shaped, expressões cute e bobas. Apelo geração Z / millennial.

**Referências:** Pendleton Ward (Adventure Time), Rebecca Sugar (Steven Universe).

**Prompt suffix:**
```
Modern indie cartoon illustration in the style of Adventure Time by Pendleton Ward,
simple bold line work, flat solid colors,
bean-shaped characters with simple dot eyes, cute silly expression,
no text, no captions, no logos
```

Sample: `/tmp/comic-samples/D_adventure_time.png`

---

## E — Sunday Color Comic 80s (Bloom County / FoxTrot)

**Vibe:** aquarela suave, traço fino, narrativo, paleta nostálgica 80s. Mais "intelectual" e sutil que A.

**Referências:** Berkeley Breathed (Bloom County), Bill Amend (FoxTrot).

**Prompt suffix:**
```
Sunday newspaper color comic strip in the style of Berkeley Breathed Bloom County and FoxTrot,
soft watercolor illustration with fine ink line,
80s nostalgic palette, gentle narrative humor,
no text, no captions, no logos
```

Sample: `/tmp/comic-samples/E_sunday_strip_bloom_county.png`

---

## Notas de implementação

- Todos os 5 estilos rodam em `flux2-klein` fast 512² — ~2s/img
- Para batch all (90 profissões × 50 imgs = 4500 imgs): ~2.5h por estilo
- Captions Bebas Neue amarelo continuam funcionando bem sobre todos os 5
- Estrutura render (37s, hook, CTA) idêntica à versão photo

## Como criar versão de outro estilo

1. Clonar `gen-lib/scene-templates.js` → `scene-templates-comic-X.js`, trocar `S_OLD/S_MID/S_FUT` pelo prompt suffix do estilo
2. Clonar `gen-criaprof.js` → `gen-criaprof-comic-X.js` apontando pro novo template + nova pasta de saída
3. Clonar `render-criaprof-cta-916.js` → `render-criaprof-comic-X-cta-916.js` ajustando paths de input/output
4. Clonar `batch-criaprof-cta.js` → `batch-criaprof-comic-X-cta.js`
