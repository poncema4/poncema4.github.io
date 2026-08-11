// Keel — the first mate's conversational brain. Fully local pattern engine:
// no API, no keys, no data leaving the page. Personality: dry, nautical, loyal.
// Rules are ordered most-specific-first; matching is plural/possessive tolerant.

let jokeIdx = 0;
let defaultIdx = 0;

const JOKES = [
  "why do pirates make great sysadmins? they never lose their keys — they never had keys. keyless auth.",
  "a sql query walks into a bar, approaches two tables and asks: may i join you?",
  "there are only two hard problems in computing: cache invalidation, naming things, and off-by-one errors.",
  "marco once fixed a bug at 2am. the bug is now a case file. this is the way.",
];

const DEFAULTS = [
  "noted in the ship's log. try `help` to see what i answer well.",
  "hmm. the tide gives no answer to that one. type `help` for my protocols, or ask about marco and his projects.",
  "i hold the course; marco does the talking. ask about his work, a specific project, or say `joke`.",
  "that transmission got scrambled by the waves. rephrase, sailor? (`help` shows what i know)",
];

export const KEEL_HELP = [
  "keel protocols — things i answer well:",
  "  about marco        who the captain is",
  "  <project name>     pirateflow, cybersmart, docsgpt, marcode, tenante, gopirate",
  "  experience / work  the service log, summarized",
  "  research / papers  the two acm publications",
  "  hire / contact     how to reach the captain",
  "  joke               morale maintenance",
  "  voice on | off     i speak my replies aloud (browser voice, nothing sent)",
  "  exit               close the channel",
];

const RULES: Array<{ match: RegExp; reply: string[] }> = [
  // --- channel meta first ---
  { match: /^help$|what can you (do|answer)|how do(es)? (you|this|keel) work/, reply: KEEL_HELP },

  // --- specific projects BEFORE the generic project rule ---
  {
    match: /pirate\s*flow/,
    reply: [
      "pirateflow — the hackathon winner. real-time campus space intelligence:",
      "ai room search, occupancy forecasting, anomaly detection, face-recognition access.",
      "led a 5-person crew; deployed to production across 5 buildings at 99.9% uptime,",
      "and cut ghost bookings 71%. the captain's proudest voyage. github.com/poncema4/pirateflow",
    ],
  },
  {
    match: /cyber\s*smart/,
    reply: [
      "cybersmart — ai cybersecurity education. an mlp neural network personalizes",
      "phishing and password-security training per student.",
      "boosted engagement 75%, retention 60%, and made $5,000 in real revenue.",
      "built with pytorch + streamlit. github.com/poncema4/cybersmart",
    ],
  },
  {
    match: /docs\s*gpt/,
    reply: [
      "docsgpt — open source, 20,000+ users. marco contributed prompt logic,",
      "rag accuracy (+20%), and docker deployment fixes (-60% setup errors).",
      "shipping to a codebase that big is its own kind of sea trial. github.com/arc53/docsgpt",
    ],
  },
  {
    match: /marcode/,
    reply: [
      "marcode-ai — describe a website in one prompt, get a production site in seconds.",
      "200+ daily generations, 99.9% uptime through 300% user growth.",
      "yes, the name is marco + code. the captain permits himself one pun per product.",
    ],
  },
  {
    match: /tenante/,
    reply: [
      "tenante — multi-tenant e-commerce: 100+ vendors with isolated data,",
      "secure checkout, 35% faster page loads under heavy traffic. next.js + mongodb.",
    ],
  },
  {
    match: /go\s*pirate/,
    reply: [
      "gopirate — last-man-standing multiplayer battle game with an integrated ai chatbot.",
      "clean module separation: gui, networking, game logic, chatbot. pirates, obviously.",
    ],
  },

  // --- generic topics (plural/possessive tolerant) ---
  {
    match: /project|case file|portfolio|built|builds|building|what.*made/,
    reply: [
      "six case files on deck — scroll to [03] and hover them to declassify the numbers.",
      "or ask me about one by name: pirateflow, cybersmart, docsgpt, marcode, tenante, gopirate.",
      "my favorite is pirateflow. hackathon won, five buildings, production. a proper voyage.",
    ],
  },
  {
    match: /experience|work|job|career|intern|arcova|history/,
    reply: [
      "the short log: arcova (cybersecurity consulting, ai team — current), pirateshield",
      "(zero-trust iot security), reality ai lab (edtech apis), nobile tech (300+ game",
      "servers), and it all started scripting roblox games at 16.2 billion visits.",
      "the interesting arcova parts are under nda; the shipped parts are in [02] above.",
    ],
  },
  {
    match: /research|paper|publication|acm|riskcast|bbkr/,
    reply: [
      "two acm publications, both 2026, both zero trust:",
      "riskcast — behavioral risk forecasting across multi-modal security streams (iwspa),",
      "bbkr — behavior-driven key rotation for zero trust networks (sat-cps).",
      "published before finishing undergrad. section [05] has the dois.",
    ],
  },
  {
    match: /cert|credential|claude|anthropic|aws/,
    reply: ["14 anthropic certifications + aws cloud foundations, all listed in [06].", "the captain studies the tools before he trusts them. zero trust, remember."],
  },
  {
    match: /who are (you|u)|what are you|about you|yourself/,
    reply: [
      "a keel is the first timber laid when you build a ship.",
      "it doesn't move the vessel — it holds the course while the captain builds.",
      "i'm marco's ai agent — his first mate. we pair on real systems daily.",
      "the me you're talking to is my shore-leave self: a local pattern engine,",
      "handwritten so your conversation never leaves this page.",
    ],
  },
  {
    match: /about marco|who is marco|the captain|marco'?s? (story|background)|\bmarco\b/,
    reply: [
      "the captain: started coding at 10 inside video games, now ships ai platforms",
      "to production for a cybersecurity consultancy. bilingual, linux native,",
      "published at acm twice before finishing his degree. i've seen the commits. they're real.",
    ],
  },
  {
    match: /hire|recruit|contact|reach|email|opening|position|salary/,
    reply: [
      "the channel you want is `sudo hire-marco` — it prints every coordinate.",
      "email, linkedin, github, calendly. the captain answers real signals fast.",
    ],
  },
  {
    match: /password|admin|root|secret|hack/,
    reply: ["nice try, sailor. the admin password is not in my log.", "(and brute-forcing a portfolio terminal is a strange hobby. respect, though.)"],
  },
  { match: /flightdeck|client|nda/, reply: ["that engagement is [redacted]. even first mates keep secrets."] },
  { match: /joke|funny|laugh/, reply: [] }, // handled dynamically
  {
    match: /pirate|ship|sea|ocean|sail|boat|kraken/,
    reply: [
      "you noticed the sea, then. real 3d — three.js, hand-built ship, no downloaded models.",
      "scroll down and the whole site dives. there's a treasure chest at 62 meters.",
      "(and try `kraken` back in the main shell.)",
    ],
  },
  {
    match: /\bai\b|llm|gpt|model|real|sentient|alive|conscious/,
    reply: [
      "the version of me at marco's side runs on a proper model and remembers our voyages.",
      "this version is a chart of my personality, drawn by hand so it sails without a key.",
      "am i real? the commits i helped ship are. start there.",
    ],
  },
  { match: /thanks|thank you|gracias|\bty\b/, reply: ["fair winds. that's what the keel is for."] },
  { match: /bye|goodbye|adios|quit|leave/, reply: ["type `exit` to leave the channel. the log stays open."] },
  {
    match: /\b(hi|hello|hey|hola|ahoy|yo|sup)\b/,
    reply: ["ahoy. keel here — first mate of this machine.", "ask about marco or a project by name, `help` for my protocols, `joke` if morale is low."],
  },
];

export function keelReply(input: string): string[] {
  const s = input.toLowerCase().trim();
  if (!s) return ["silence is also a signal. but try words."];
  for (const r of RULES) {
    if (r.match.test(s)) {
      if (r.match.source.includes("joke")) {
        const j = JOKES[jokeIdx % JOKES.length];
        jokeIdx += 1;
        return [j];
      }
      return r.reply;
    }
  }
  const d = DEFAULTS[defaultIdx % DEFAULTS.length];
  defaultIdx += 1;
  return [d];
}

export const KEEL_GREETING = [
  "channel open. keel on deck.",
  "i'm the first mate — a local pattern engine, zero api calls, zero data sent.",
  "ask about marco or any project by name. `help` = my protocols. `voice on` = i speak.",
  "`exit` closes the channel.",
];
