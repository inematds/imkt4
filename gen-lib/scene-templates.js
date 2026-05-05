/**
 * Scene templates compartilhados — CriaProf (25 cenas × 2 momentos = 50 imgs)
 * e GERTRAN nostalgia (20 cenas × 1 momento = 20 imgs).
 *
 * Cada template recebe um `profile` (config da profissão) e retorna array
 * de { file, prompt } prontos pra generateImage().
 *
 * Estrutura do profile (ver config/profissoes-30.js):
 *   {
 *     slug, label,
 *     character: 'Brazilian woman with warm tan skin, ...',
 *     pronoun: 'she' | 'he',
 *     props: {
 *       child_object, // brinquedo/objeto de infância relacionado à profissão
 *       school_context, // contexto escolar/aula
 *       teen_hobby, // hobby adolescente
 *       first_tool, // primeira ferramenta profissional clássica
 *       workplace, // ambiente de trabalho típico
 *       classic_task, // tarefa central clássica
 *       new_tool, // ferramenta digital/moderna
 *       ai_application, // como IA entra na profissão
 *     },
 *     gertran_props: [20 strings - cena única era-específica]
 *   }
 */

const S_OLD = 'shot on 35mm film, cinematic grading, warm tungsten light, film grain, slight vignette, no text, no captions, no logos';
const S_MID = 'cinematic, shallow depth of field, natural light, editorial photography, muted contemporary palette, no text, no captions, no logos';
const S_FUT = 'neo-noir clinical lighting, soft glassmorphism, teal accents, volumetric light, soft bokeh, futuristic minimal, no text, no captions, no logos';

const char = (p, age, extra = '') => `${p.character}, about ${age} years old${extra ? ', ' + extra : ''}`;

/**
 * CriaProf — 25 cenas × 2 momentos (ini = ambiente/objeto, fim = personagem)
 */
function criaProfScenes(p) {
  const c = p.props;
  const scenes = [
    // ========= INFÂNCIA (1980s) =========
    // 1 — 6 anos: observando pai/mãe trabalhar
    { n: 1, ini: `Cozy 1980s Brazilian home with ${c.parent_workspace}, warm afternoon light spilling through curtains, nostalgic domestic scene, ${S_OLD}`,
           fim: `${char(p, 6, `small child with tanned skin and dark hair, simple cotton clothes, curiously watching a parent ${c.parent_activity}`)}, tender observant gaze, warm lamp light, ${S_OLD}` },
    // 2 — 7 anos: brincando com objeto simbólico
    { n: 2, ini: `1980s brazilian bedroom with ${c.child_object} sitting on a bedspread, old wooden toy shelf behind, warm nostalgic afternoon glow, ${S_OLD}`,
           fim: `${char(p, 7, `child with tanned skin, dark hair in ${p.hair_style}, simple clothes, pretending to ${c.child_pretend} using ${c.child_object}`)}, concentrated playful expression, ${S_OLD}` },
    // 3 — 9 anos: escola antiga brasileira
    { n: 3, ini: `1980s brazilian public school classroom with wooden desks, chalkboard with ${c.school_context}, sunlight through louvered windows, ${S_OLD}`,
           fim: `${char(p, 9, `child in school uniform, dark hair, backpack, tanned skin`)} raising a hand at a desk, eager bright eyes, chalk dust in the air, ${S_OLD}` },
    // 4 — 10 anos: descobrindo interesse concreto
    { n: 4, ini: `Warm family living room 1980s with a ${c.discovery_object} on a crochet tablecloth, old TV tube in background, ${S_OLD}`,
           fim: `${char(p, 10, `child with dark hair, tanned skin, casual clothes`)} examining ${c.discovery_object} with wide fascinated eyes, ${S_OLD}` },

    // ========= PRÉ-ADOLESCÊNCIA / ADOLESCÊNCIA (1990s) =========
    // 5 — 12 anos: primeira ajuda concreta
    { n: 5, ini: `Early 1990s brazilian home scene with ${c.first_help_setup}, muted afternoon light, familiar household clutter, ${S_OLD}`,
           fim: `${char(p, 12, `pre-teen with dark hair in ${p.hair_style}, school outfit, tanned skin`)} ${c.first_help_action}, caring focused expression, ${S_OLD}` },
    // 6 — 14 anos: aula relacionada à área
    { n: 6, ini: `1990s brazilian classroom with ${c.class_visual} on the wall, a notebook open on a wooden desk, afternoon sunlight, ${S_OLD}`,
           fim: `${char(p, 14, `teenager with dark hair in ${p.hair_style}, tanned skin, school uniform`)} studying ${c.class_visual} with absorbed concentration, ${S_OLD}` },
    // 7 — 16 anos: hobby adolescente ligado à profissão
    { n: 7, ini: `Late 1990s brazilian teen bedroom with ${c.teen_hobby_setup}, posters on wall, boombox stereo, warm window light, ${S_OLD}`,
           fim: `${char(p, 16, `teenager with dark hair, tanned skin, casual 90s clothes`)} engaged in ${c.teen_hobby}, confident absorbed expression, ${S_OLD}` },
    // 8 — 18 anos: decidindo o caminho
    { n: 8, ini: `Late 1990s brazilian dining table with ${c.decision_artifacts} (course catalog, vestibular books), family kitchen warmth, ${S_MID}`,
           fim: `${char(p, 18, `young adult with dark hair, tanned skin, simple clothes`)} looking at ${c.decision_artifacts} with thoughtful determined eyes, ${S_MID}` },

    // ========= UNIVERSIDADE / FORMAÇÃO INICIAL (2000s) =========
    // 9 — 20 anos: faculdade/curso técnico
    { n: 9, ini: `Early 2000s brazilian ${c.school_institution} hallway with bulletin board, backpacks on the floor, natural daylight through tall windows, ${S_MID}`,
           fim: `${char(p, 20, `university student, tanned skin, dark hair in ${p.hair_style}, backpack, practical student clothing`)} standing proudly in front of a ${c.institution_sign} sign, determined smile, ${S_MID}` },
    // 10 — 22 anos: estudo profundo
    { n: 10, ini: `University study room with ${c.deep_study_artifacts}, notebooks piled, coffee cup, clean daylight, ${S_MID}`,
            fim: `${char(p, 22, `student with dark hair, tanned skin, lab coat or professional top`)} analyzing ${c.deep_study_artifacts} with focused studious expression, ${S_MID}` },
    // 11 — 24 anos: primeiro estágio
    { n: 11, ini: `Small ${c.workplace_small} with ${c.internship_setup}, soft neutral daylight, early-career simplicity, ${S_MID}`,
            fim: `${char(p, 24, `young intern, tanned skin, dark hair, professional entry-level uniform`)} ${c.internship_action}, calm attentive face, ${S_MID}` },
    // 12 — 26 anos: formatura
    { n: 12, ini: `Early 2000s graduation scene, empty graduation cap and diploma on a table, family photograph nearby, soft warm light, ${S_MID}`,
            fim: `${char(p, 26, `new graduate, tanned skin, dark hair`)} in graduation gown holding a diploma, proud emotional smile, soft bokeh, ${S_MID}` },

    // ========= PROFISSIONAL CLÁSSICO (2005-2012) =========
    // 13 — 28 anos: primeiro emprego formal
    { n: 13, ini: `${c.workplace} in 2000s with ${c.classic_tool} on a work surface, warm professional ambient light, ${S_MID}`,
            fim: `${char(p, 28, `young professional, tanned skin, dark hair in ${p.hair_style}`)} using ${c.classic_tool} for ${c.classic_task}, focused competent expression, ${S_MID}` },
    // 14 — 30 anos: dominando ofício clássico
    { n: 14, ini: `Well-organized ${c.workplace} with ${c.mastery_setup}, soft morning light, practiced rhythm of work, ${S_MID}`,
            fim: `${char(p, 30, `established professional, tanned skin, dark hair`)} confidently performing ${c.classic_task} with ${c.mastery_setup}, quiet mastery on face, ${S_MID}` },
    // 15 — 32 anos: relação com cliente/paciente/aluno
    { n: 15, ini: `${c.workplace} set up for a ${c.client_interaction_type}, chairs or bed positioned, natural light, ${S_MID}`,
            fim: `${char(p, 32, `mid-career professional, tanned skin, dark hair`)} ${c.client_interaction_action}, warm attentive interaction, ${S_MID}` },

    // ========= PRIMEIRAS ONDAS TECH (2013-2020) =========
    // 16 — 34 anos: internet chega ao ofício
    { n: 16, ini: `${c.workplace} in 2010s with a desktop monitor showing ${c.internet_wave_screen}, cables visible, mix of old and new, ${S_MID}`,
            fim: `${char(p, 34, `professional, tanned skin, dark hair with perhaps a first subtle silver strand`)} adapting to a desktop computer running ${c.internet_wave_screen}, curious learning expression, ${S_MID}` },
    // 17 — 36 anos: smartphone transforma rotina
    { n: 17, ini: `Close-up on a smartphone running ${c.mobile_app} next to ${c.classic_tool}, ${c.workplace} background out of focus, ${S_MID}`,
            fim: `${char(p, 36, `professional, tanned skin, dark hair with a few silver strands`)} using a smartphone app ${c.mobile_app} during work, engaged modern expression, ${S_MID}` },
    // 18 — 38 anos: redes sociais / presença digital
    { n: 18, ini: `${c.workplace} with a tripod smartphone set up for ${c.social_presence}, ring light visible, ${S_MID}`,
            fim: `${char(p, 38, `professional, tanned skin, dark hair with growing silver streaks`)} recording a short ${c.social_presence} in her/his workspace, kind instructional smile, ${S_MID}` },
    // 19 — 40 anos: teleconferência / pandemia
    { n: 19, ini: `Home office with a laptop showing a video-call ${c.remote_session}, soft daylight, 2020-era improvised workspace, ${S_MID}`,
            fim: `${char(p, 40, `professional at home office, tanned skin, dark hair with clear silver streaks, simple casual shirt`)} conducting a remote ${c.remote_session} over video call, attentive patient smile, ${S_MID}` },

    // ========= ERA IA (2023+) =========
    // 20 — 42 anos: dashboards / dados / análise
    { n: 20, ini: `Close-up of a monitor showing ${c.data_dashboard}, modern clinical/professional UI, teal accents, soft ambient light, ${S_FUT}`,
            fim: `${char(p, 42, `senior professional, tanned skin, dark hair with clear silver streaks, modern workplace uniform`)} analyzing ${c.data_dashboard} on a big monitor, reflective analytical expression, ${S_FUT}` },
    // 21 — 44 anos: primeira exposição a IA
    { n: 21, ini: `Clean modern screen showing ${c.ai_interface} with personalized output and progress charts, soft teal UI accents, ${S_FUT}`,
            fim: `${char(p, 44, `veteran professional, tanned skin, dark hair elegantly streaked with silver`)} reviewing an AI-suggested ${c.ai_application} on a tablet, thoughtful experienced face, ${S_FUT}` },
    // 22 — 46 anos: IA no dia-a-dia
    { n: 22, ini: `${c.workplace} with a ${c.ai_daily_tool} subtly integrated into the workflow, modern ambient teal-warm gradient, ${S_FUT}`,
            fim: `${char(p, 46, `senior professional, tanned skin, dark hair with elegant silver streaks in ${p.hair_style}`)} calmly using ${c.ai_daily_tool} while working with a client, smooth confident flow, ${S_FUT}` },
    // 23 — 48 anos: mentora
    { n: 23, ini: `${c.workplace} with a junior colleague's notebook open, older mentor's hand gesturing to explain, soft collaborative light, ${S_FUT}`,
            fim: `${char(p, 48, `senior professional, tanned skin, silver-streaked dark hair`)} mentoring a younger colleague, warm knowing smile, quiet authority, ${S_FUT}` },
    // 24 — hero portrait
    { n: 24, ini: `Bright modern ${c.workplace} space with equipment and tools in soft out-of-focus background, warm-cool gradient ambient light, no people, ${S_FUT}`,
            fim: `Heroic cinematic close-up portrait of the same ${p.character}, about 50 years old, dark hair with elegant silver streaks in ${p.hair_style}, professional modern top, quietly confident warm smile looking slightly upward, soft rim light, blurred workplace background, editorial quality, ${S_FUT}` },
    // 25 — wide cinematic final
    { n: 25, ini: `Wide cinematic shot of ${c.workplace} bathed in golden-hour window light, equipment arranged, sense of legacy and future, no people, ${S_FUT}`,
            fim: `Wide cinematic shot of the same ${p.character}, about 50 years old with silver-streaked dark hair, standing confidently in ${c.workplace}, golden hour light, professional modern attire, quiet authority in posture, editorial quality, ${S_FUT}` },
  ];

  return scenes.flatMap((s) => [
    { file: `cena${String(s.n).padStart(2, '0')}-ini.png`, prompt: s.ini },
    { file: `cena${String(s.n).padStart(2, '0')}-fim.png`, prompt: s.fim },
  ]);
}

/**
 * GERTRAN nostalgia — 20 cenas focadas em objetos/ambientes era-específicos.
 * Não precisam do personagem — são artefatos que provocam lembrança.
 * profile.gertran_nostalgia é um array de 20 descriptors. Cada descriptor:
 *   { era: 'OLD' | 'MID' | 'FUT', subject: 'close-up description', context: 'contexto extra opcional' }
 */
function gertranNostalgiaScenes(p) {
  const eraStyle = { OLD: S_OLD, MID: S_MID, FUT: S_FUT };
  const list = [...p.gertran_nostalgia];
  const c = p.props || {};
  // Auto-pad até 20 itens com genéricos coerentes à profissão.
  const generic = [
    { era: 'OLD', subject: `Nostalgic 1980s brazilian ${c.workplace || 'workplace'} with analog tools and warm afternoon light` },
    { era: 'OLD', subject: `Close-up of a hand-written ${c.parent_activity ? 'note' : 'ledger'} from the 1980s with blue ink` },
    { era: 'OLD', subject: `Vintage ${c.classic_tool || 'tool of the trade'} on a wooden surface, 1980s domestic warmth` },
    { era: 'MID', subject: `Early 2000s ${c.workplace || 'workplace'} with a desktop computer showing ${c.internet_wave_screen || 'basic management software'}` },
    { era: 'MID', subject: `Close-up of a smartphone running ${c.mobile_app || 'a professional app'} next to ${c.classic_tool || 'classic tools'}` },
    { era: 'MID', subject: `A laptop showing a ${c.remote_session || 'video call'} session, 2020-era improvised home workspace` },
    { era: 'FUT', subject: `Modern monitor showing ${c.data_dashboard || 'a professional dashboard'} with teal UI accents` },
    { era: 'FUT', subject: `Close-up of ${c.ai_daily_tool || 'an AI-assisted tool'} running on a tablet, professional hand swiping` },
    { era: 'FUT', subject: `Cinematic wide shot of a modern ${c.workplace || 'workplace'} integrating classic expertise and AI technology` },
  ];
  while (list.length < 20) list.push(generic[list.length % generic.length]);
  return list.slice(0, 20).map((s, i) => {
    const style = eraStyle[s.era] || S_MID;
    const ctx = s.context ? `, ${s.context}` : '';
    return {
      file: `nost${String(i + 1).padStart(2, '0')}.png`,
      prompt: `${s.subject}${ctx}, ${style}`,
    };
  });
}

// ===================================================================
// Templates v2 — 3 formatos "transformation-focused" (sem personagem,
// foco em artefatos/ferramentas/ambientes que mudaram). Todos geram
// 50 imagens por profissão.
// ===================================================================

const ERA_STYLE = { OLD: S_OLD, MID: S_MID, FUT: S_FUT };

/**
 * (a) Pareado — 25 pares "antes × depois", 50 imgs total.
 *   parXXa.png = versão OLD/MID (antes)
 *   parXXb.png = versão FUT (depois)
 * Extrai pares de gertran_nostalgia + fallbacks de props.
 */
function pairedChangesScenes(p) {
  const nost = p.gertran_nostalgia || [];
  const olds = nost.filter((n) => n.era === 'OLD');
  const mids = nost.filter((n) => n.era === 'MID');
  const futs = nost.filter((n) => n.era === 'FUT');
  const c = p.props || {};

  // Pool de "befores" (old + mid) e "afters" (fut) — ciclar se não bater 25
  const befores = [...olds, ...mids];
  const afters = [...futs];

  // Extras derivados de props (se faltar material)
  const extraBefores = [
    { era: 'OLD', subject: `Close-up of a 1980s ${c.classic_tool || 'professional tool'} on a wooden workbench` },
    { era: 'OLD', subject: `Vintage 1980s ${c.workplace_small || c.workplace || 'workplace'} with warm tungsten light` },
    { era: 'OLD', subject: `Old hand-written ${c.classic_task ? c.classic_task + ' notes' : 'work notebook'} in blue ink` },
    { era: 'MID', subject: `Early 2000s ${c.workplace || 'workplace'} with a desktop computer running ${c.internet_wave_screen || 'management software'}` },
    { era: 'MID', subject: `Close-up of a smartphone running ${c.mobile_app || 'a professional app'} beside ${c.classic_tool || 'classic tools'}` },
    { era: 'MID', subject: `A laptop showing a remote ${c.remote_session || 'video consultation'} during 2020s` },
  ];
  const extraAfters = [
    { era: 'FUT', subject: `Modern monitor showing ${c.ai_interface || c.data_dashboard || 'an AI dashboard'} with teal UI accents` },
    { era: 'FUT', subject: `Close-up of ${c.ai_daily_tool || 'an AI-assisted tool'} running on a tablet with precise glowing UI` },
    { era: 'FUT', subject: `Cinematic wide shot of a modern ${c.workplace || 'workplace'} integrating classic expertise and AI` },
    { era: 'FUT', subject: `Futuristic professional hand swiping ${c.ai_interface || 'an AI interface'} on a tablet, soft rim light` },
  ];

  const B = befores.length >= 25 ? befores : [...befores, ...extraBefores, ...extraBefores];
  const A = afters.length >= 25 ? afters : [...afters, ...extraAfters, ...extraAfters];

  const out = [];
  for (let i = 0; i < 25; i += 1) {
    const b = B[i % B.length];
    const a = A[i % A.length];
    const num = String(i + 1).padStart(2, '0');
    out.push({ file: `par${num}a.png`, prompt: `${b.subject}, ${ERA_STYLE[b.era] || S_MID}` });
    out.push({ file: `par${num}b.png`, prompt: `${a.subject}, ${ERA_STYLE[a.era] || S_FUT}` });
  }
  return out;
}

/**
 * (b) Artefatos — 50 imgs de ferramentas/ambientes em progressão cronológica,
 * sem pessoas. Expande gertran_nostalgia (~20) com descriptors derivados de props
 * pra chegar em 50.
 */
function artifactTimelineScenes(p) {
  const nost = p.gertran_nostalgia || [];
  const c = p.props || {};

  const extras = [
    { era: 'OLD', subject: `Close-up of a 1980s ${c.classic_tool || 'professional tool'} on a worn wooden workbench, warm tungsten light` },
    { era: 'OLD', subject: `Vintage brazilian 1980s ${c.workplace_small || c.workplace || 'workplace'} in quiet afternoon sun` },
    { era: 'OLD', subject: `Old ${c.decision_artifacts || 'career guide'} laid on a wooden desk with blue-ink annotations` },
    { era: 'OLD', subject: `1980s brazilian family ${c.parent_workspace || 'home'} with warm lamp light, no people` },
    { era: 'OLD', subject: `Vintage ${c.child_object || 'toy set'} on a crochet tablecloth with old wooden furniture` },
    { era: 'OLD', subject: `Old ${c.discovery_object || 'reference book'} open on a wooden table, ink pen beside` },
    { era: 'OLD', subject: `1980s ${c.workplace || 'workspace'} corner with period-authentic tools and soft daylight` },
    { era: 'MID', subject: `Early 2000s ${c.workplace || 'workplace'} with a beige desktop computer running ${c.internet_wave_screen || 'management software'}` },
    { era: 'MID', subject: `Close-up of a smartphone running ${c.mobile_app || 'a professional app'} on a tidy modern desk` },
    { era: 'MID', subject: `2000s office desk with a laptop, a mug of coffee, and a printed work chart` },
    { era: 'MID', subject: `A 2010s tablet showing ${c.internet_wave_screen || 'digital records'} with modern UI` },
    { era: 'MID', subject: `Close-up of a 2010s ${c.classic_tool || 'tool'} modernized with a digital screen interface` },
    { era: 'MID', subject: `A laptop showing a remote ${c.remote_session || 'video session'}, 2020 pandemic-era setup` },
    { era: 'MID', subject: `Close-up of a smartwatch showing ${c.mobile_app || 'a professional app'} notification` },
    { era: 'FUT', subject: `Modern monitor showing ${c.ai_interface || 'an AI analytical dashboard'} with live data and teal UI` },
    { era: 'FUT', subject: `Close-up of ${c.ai_daily_tool || 'an AI tool'} in operation on a tablet, subtle glow, modern context` },
    { era: 'FUT', subject: `Futuristic ${c.workplace || 'workspace'} with soft teal ambient light and integrated displays` },
    { era: 'FUT', subject: `Close-up of a professional hand swiping ${c.data_dashboard || 'an AI dashboard'} on a tablet` },
    { era: 'FUT', subject: `Modern ${c.ai_interface || 'AI interface'} running analytical overlays on a high-res display` },
    { era: 'FUT', subject: `Cinematic wide shot of a modern ${c.workplace || 'workspace'} integrating classic expertise and AI tools, no people` },
    { era: 'FUT', subject: `Close-up of ${c.ai_application || 'an AI prediction'} displayed on a sleek tablet screen` },
    { era: 'FUT', subject: `Futuristic detail of ${c.ai_daily_tool || 'AI tool'} with soft rim light and glowing indicators` },
  ];

  // Ordena por era (OLD primeiro, MID meio, FUT fim) e mescla com nost
  const eraOrder = { OLD: 0, MID: 1, FUT: 2 };
  const all = [...nost, ...extras].sort((x, y) => eraOrder[x.era] - eraOrder[y.era]);
  return all.slice(0, 50).map((s, i) => ({
    file: `art${String(i + 1).padStart(2, '0')}.png`,
    prompt: `${s.subject}, ${ERA_STYLE[s.era] || S_MID}`,
  }));
}

/**
 * (c) Décadas — 10 imgs por década (80s, 90s, 2000s, 2010s, 2020s-AI) = 50 imgs.
 * Cada década foca em como a profissão operava naquele momento, sem pessoas.
 */
function decadeTimelineScenes(p) {
  const c = p.props || {};
  const pro = (p.label || 'professional').toLowerCase();

  const mk = (era, decadeLabel, subjects) => subjects.map((subject) => ({ era, decade: decadeLabel, subject }));

  const d80s = mk('OLD', '1980s', [
    `1980s brazilian ${c.workplace_small || c.workplace || 'workplace'} with period-authentic tools and warm tungsten light`,
    `Close-up of a 1980s ${c.classic_tool || 'tool of the trade'} on a wooden workbench`,
    `Vintage 1980s ${pro} office with paper logs and a brass desk lamp`,
    `Old 1980s ${c.discovery_object || 'reference book'} open on a wooden desk with blue-ink notes`,
    `1980s brazilian ${c.workplace || 'workspace'} corner with film-grain nostalgia`,
    `Vintage 1980s ${c.parent_workspace || 'home setting'} with crochet tablecloth and afternoon sun`,
    `Old 1980s ${pro} handwritten ledger with columns of notes on ruled paper`,
    `Vintage 1980s brazilian community with professionals serving clients in-person`,
    `Close-up of a 1980s typewriter/paper-filing cabinet in a ${pro} context`,
    `1980s brazilian family watching a tube TV with a warm living-room glow`,
  ]);

  const d90s = mk('OLD', '1990s', [
    `1990s brazilian ${c.workplace || 'workspace'} with fax machine and paper files stacked`,
    `Close-up of a 1990s cordless phone next to a ${c.classic_tool || 'professional tool'}`,
    `Vintage 1990s brazilian office with an early desktop computer (CRT) mid-use`,
    `Old 1990s ${pro} with a VHS tape cassette for training or recording`,
    `1990s brazilian ${c.workplace || 'workspace'} corner with early internet modem blinking`,
    `Close-up of 1990s paper memos clipped to a corkboard beside a fax`,
    `Vintage 1990s brazilian family phone with a rotary dial and address book`,
    `Old 1990s stationery and carbon-copy forms on a ${pro} desk`,
    `1990s brazilian office supply catalog open on a wooden table`,
    `Close-up of a 1990s CRT monitor running early MS-DOS or Windows 95 app`,
  ]);

  const d2000s = mk('MID', '2000s', [
    `Early 2000s brazilian ${c.workplace || 'workplace'} with a beige desktop PC running ${c.internet_wave_screen || 'management software'}`,
    `Close-up of a 2000s CD-ROM software installer disc next to a keyboard`,
    `Vintage 2000s brazilian office with a cordless VoIP phone and a wired mouse`,
    `Early 2000s ${pro} inbox showing an email chain on a CRT monitor`,
    `Close-up of a 2000s Palm or early PDA device showing a professional schedule`,
    `2000s brazilian office with a small network printer and fluorescent light`,
    `Early 2000s laptop with a chunky build on a ${pro} desk`,
    `Close-up of a 2000s cell phone with T9 keypad showing a work SMS`,
    `Vintage 2000s professional credentials printed badge on a lanyard`,
    `Close-up of 2000s pen drive and CD case on a ${pro} desk`,
  ]);

  const d2010s = mk('MID', '2010s', [
    `2010s brazilian ${c.workplace || 'workplace'} with an LCD monitor running ${c.internet_wave_screen || 'cloud management software'}`,
    `Close-up of a 2010s smartphone running ${c.mobile_app || 'a professional app'} on a ${c.workplace_small || c.workplace || 'workplace'} desk`,
    `A 2010s tablet showing ${c.data_dashboard || 'professional analytics'} on a modern desk`,
    `Vintage 2010s brazilian ${pro} Instagram page being photographed for social presence`,
    `Close-up of a 2010s LinkedIn professional profile on a laptop screen`,
    `A 2010s Zoom/Skype video call window on a laptop during 2020s pandemic`,
    `Close-up of 2010s smartwatch showing ${c.mobile_app || 'a professional notification'}`,
    `Vintage 2010s ${pro} cloud-sharing link on a laptop next to coffee`,
    `2010s brazilian co-working space with MacBook laptops and plants`,
    `Close-up of a 2010s webcam and microphone for remote professional streaming`,
  ]);

  const d2020s = mk('FUT', '2020s-AI', [
    `Modern 2020s monitor showing ${c.ai_interface || 'an AI analytical dashboard'} with teal UI accents`,
    `Close-up of ${c.ai_daily_tool || 'an AI-assisted tool'} running on a tablet with glowing indicators`,
    `Futuristic 2020s ${c.workplace || 'workspace'} with soft ambient teal light and integrated displays`,
    `Close-up of a professional hand swiping ${c.data_dashboard || 'an AI insight dashboard'} on a tablet`,
    `Modern AI-generated visualization of ${c.ai_application || 'professional outcomes'} on a high-res display`,
    `Cinematic wide shot of a 2020s ${c.workplace || 'workspace'} integrating classic expertise and AI tools`,
    `Close-up of ${c.ai_interface || 'AI interface'} displaying predictive analytics in a modern office`,
    `Futuristic detail of ${c.ai_daily_tool || 'AI tool'} in use on a tablet with soft rim light`,
    `2020s brazilian ${pro} hybrid workspace with laptop, tablet, and AI-assisted overlays`,
    `Close-up of ${c.ai_application || 'AI output'} displayed with elegant typography on a modern device`,
  ]);

  return [...d80s, ...d90s, ...d2000s, ...d2010s, ...d2020s].slice(0, 50).map((s, i) => ({
    file: `dec${String(i + 1).padStart(2, '0')}.png`,
    prompt: `${s.subject}, ${ERA_STYLE[s.era] || S_MID}`,
  }));
}

module.exports = {
  criaProfScenes,
  gertranNostalgiaScenes,
  pairedChangesScenes,
  artifactTimelineScenes,
  decadeTimelineScenes,
  S_OLD, S_MID, S_FUT,
};
