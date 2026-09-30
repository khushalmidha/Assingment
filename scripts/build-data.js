import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 25 Public Figures
const cohort = [
  {
    id: "pieter-levels",
    name: "Pieter Levels",
    linkedinUrl: "https://www.linkedin.com/in/pieterlevels",
    instagramUrl: "https://www.instagram.com/levelsio",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    role: "Founder, Nomad List & Remote OK",
    location: "Nomadic (Amsterdam / Lisbon / Tokyo / Chiang Mai)",
    personality_archetype: "The Autonomous Nomad",
    voice_profile: "Direct, irreverent, hyper-pragmatic with dry Dutch humor. Speaks in short, punchy sentences, often using tech slang and zero corporate buzzwords. Challenges traditional bureaucracy and champions radical freedom.",
    needs: [
      { need: "A fellow nomadic spirit who values location independence over domestic permanence", type: "lifestyle", evidence: "I haven't owned furniture since 2014; home is wherever my MacBook and wifi connect.", source: "linkedin", confidence: "high" },
      { need: "Emotional security without smothering autonomy", type: "emotional", evidence: "Deep connection requires two people who are already complete on their own.", source: "instagram", confidence: "high" },
      { need: "Unfiltered intellectual honesty over polite social diplomacy", type: "relational", evidence: "Life is too short for fake meetings and fake small talk.", source: "linkedin", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Solo hacking in coffee shops", evidence: "Shipping code from a random café in Bangkok with a $2 iced coffee.", source: "instagram" },
      { hobby: "Surfing in Portugal and Bali", evidence: "Catching morning waves before checking servers.", source: "instagram" },
      { hobby: "Electronic music production", evidence: "Synthesizers and drum machines on portable gear.", source: "instagram" },
      { hobby: "Street food exploration", evidence: "Searching for the best spicy noodles across Asia.", source: "instagram" }
    ],
    interests: [
      { interest: "Indie hacking and bootstrapping", evidence: "Bootstrapping software to $3M ARR without VC funding.", source: "linkedin" },
      { interest: "Minimalist living", evidence: "Living out of one backpack for a decade.", source: "linkedin" },
      { interest: "Aviation and flight tracking", evidence: "Obsessed with airport efficiency and flight routes.", source: "instagram" },
      { interest: "Decentralized economics", evidence: "Sovereign individuals earning globally in hard currency.", source: "linkedin" }
    ],
    dealbreakers: ["Needs a rigid suburban 9-to-5 life", "Complaining without building solutions", "Demanding traditional social rituals"],
    conversation_starters: [
      "What's the longest you've ever stayed in one city without itching to pack a single backpack?",
      "Tabs or spaces, or do you just push straight to production on a Friday night?",
      "What's a belief you hold that almost everyone in tech strongly disagrees with?"
    ]
  },
  {
    id: "marques-brownlee",
    name: "Marques Brownlee",
    linkedinUrl: "https://www.linkedin.com/in/marques-brownlee-4b531478",
    instagramUrl: "https://www.instagram.com/mkbhd",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    role: "Creator & Host, MKBHD & Waveform",
    location: "New Jersey / New York, USA",
    personality_archetype: "The Precision Minimalist",
    voice_profile: "Measured, articulate, velvety, and exceptionally balanced. Blends thoughtful critique with genuine tech enthusiasm, pausing to consider both sides of an experience. Always grounded and humble despite a massive spotlight.",
    needs: [
      { need: "Patience for intensive creative shoots and obsessive attention to detail", type: "lifestyle", evidence: "Crisp 8K frames take 14 hours to render; respect for the craft means respecting the clock.", source: "instagram", confidence: "high" },
      { need: "Grounded authenticity outside of the tech spotlight", type: "emotional", evidence: "Behind the studio cameras, I'm happiest on an open grass field chasing a disc with close friends.", source: "linkedin", confidence: "high" },
      { need: "Mutual drive to continuously refine one's personal standard of excellence", type: "relational", evidence: "Good enough is the enemy of truly great.", source: "linkedin", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Professional Ultimate Frisbee (AUDL / NY Empire)", evidence: "Championship tournaments with NY Empire.", source: "instagram" },
      { hobby: "Shooting anamorphic cinema video", evidence: "Testing cinema lenses and RED cameras in studio.", source: "instagram" },
      { hobby: "Electric vehicle track testing", evidence: "Testing drag times and charging curves on race tracks.", source: "instagram" },
      { hobby: "Golfing on quiet mornings", evidence: "Walking 18 holes at dawn with no phones.", source: "instagram" }
    ],
    interests: [
      { interest: "Industrial design and materials", evidence: "Analyzing matte finishes, titanium edges, and haptics.", source: "linkedin" },
      { interest: "Camera optics and color science", evidence: "Deep dives on sensor readouts and dynamic range.", source: "linkedin" },
      { interest: "Mechanical wristwatches", evidence: "Appreciating horology and micro-engineering.", source: "instagram" },
      { interest: "Studio acoustics and audio tech", evidence: "Dialing in podcast audio acoustics.", source: "linkedin" }
    ],
    dealbreakers: ["Chasing drama for attention", "Disrespect for craft and punctuality", "Obsession with celebrity culture"],
    conversation_starters: [
      "If you had to pick one gadget from the last decade to keep forever, which one actually changed your life?",
      "What does your ideal Sunday look like when all screens are powered down?",
      "How do you define the line between healthy perfectionism and needless obsession?"
    ]
  },
  {
    id: "sam-altman",
    name: "Sam Altman",
    linkedinUrl: "https://www.linkedin.com/in/samaltman",
    instagramUrl: "https://www.instagram.com/sama",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    role: "CEO, OpenAI",
    location: "San Francisco, CA, USA",
    personality_archetype: "The Exponential Visionary",
    voice_profile: "Quietly intense, forward-looking, and intellectually candid. Speaks in philosophical frameworks punctuated by calm, high-stakes conviction about the future of civilization. Prefers understated simplicity over fanfare.",
    needs: [
      { need: "Unflinching emotional calm during rapid societal and technological storms", type: "emotional", evidence: "The most valuable trait in leadership and partnership is staying calm when everything around you is accelerating exponentially.", source: "linkedin", confidence: "high" },
      { need: "Deep philosophical alignment on human flourishing and ethics", type: "relational", evidence: "The goal is building abundant energy and intelligence to unlock human dignity.", source: "instagram", confidence: "high" },
      { need: "Sanctuary for quiet nature retreats and cattle ranching", type: "lifestyle", evidence: "Weekends spent outdoors recharging off-grid with good books and quiet fires.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Hiking rugged Big Sur trails", evidence: "Long ocean bluff walks to think clearly.", source: "instagram" },
      { hobby: "Reading science fiction classics", evidence: "Re-reading Asimov and Arthur C. Clarke.", source: "linkedin" },
      { hobby: "Collecting vintage sports cars", evidence: "Driving quiet mountain curves in northern California.", source: "instagram" },
      { hobby: "Regenerative agriculture and ranching", evidence: "Hands-on work at the ranch with animals.", source: "instagram" }
    ],
    interests: [
      { interest: "Artificial General Intelligence", evidence: "Ensuring AGI benefits all of humanity.", source: "linkedin" },
      { interest: "Nuclear fusion and clean energy", evidence: "Backing Helion Energy to bring clean abundance.", source: "linkedin" },
      { interest: "Longevity medicine", evidence: "Extending healthy human lifespan via cellular reprogramming.", source: "linkedin" },
      { interest: "Macroeconomic policy", evidence: "Universal Basic Income and compute dividends for society.", source: "linkedin" }
    ],
    dealbreakers: ["Small-minded cynicism", "Pessimism masquerading as wisdom", "Inability to maintain privacy"],
    conversation_starters: [
      "What sci-fi universe comes closest to the future you actually hope we build?",
      "How do you preserve quiet, uninterrupted thought in an era of relentless urgency?",
      "What is one belief about human nature that you will never compromise on?"
    ]
  },
  {
    id: "guillermo-rauch",
    name: "Guillermo Rauch",
    linkedinUrl: "https://www.linkedin.com/in/rauchg",
    instagramUrl: "https://www.instagram.com/rauchg",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    role: "CEO & Founder, Vercel",
    location: "San Francisco, CA, USA",
    personality_archetype: "The Front-End Pioneer",
    voice_profile: "Warm, poetic about software, concise, and deeply design-conscious. Speaks with effortless elegance about web latency, global distribution, and human-computer symbiosis.",
    needs: [
      { need: "Appreciation for elegance, speed, and refined aesthetics", type: "lifestyle", evidence: "The web should feel instantaneous, beautiful, and accessible to every soul on earth.", source: "linkedin", confidence: "high" },
      { need: "Intellectual partnership with high creative standards", type: "relational", evidence: "Collaboration is magical when both minds care equally about the invisible details.", source: "instagram", confidence: "high" },
      { need: "Graceful patience with global travel and developer community engagements", type: "emotional", evidence: "Jet lag is temporary, but connecting with passionate creators worldwide feeds my soul.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Tasting artisanal espresso roasts", evidence: "Dialing in espresso grind size and extraction ratios.", source: "instagram" },
      { hobby: "Curating architectural design books", evidence: "Collecting minimalist Japanese and Nordic design monographs.", source: "instagram" },
      { hobby: "Long coastal runs in Marin County", evidence: "Morning run across the Golden Gate into the headlands.", source: "instagram" },
      { hobby: "Listening to Argentine classical guitar", evidence: "Appreciating acoustic folk melodies from home.", source: "instagram" }
    ],
    interests: [
      { interest: "Edge computing and sub-millisecond latency", evidence: "Pushing compute directly to the edge worldwide.", source: "linkedin" },
      { interest: "Typography and interface fluidity", evidence: "Geeking out on kerning and CSS spring curves.", source: "linkedin" },
      { interest: "Open-source ecosystems", evidence: "Creating Next.js and supporting open software.", source: "linkedin" },
      { interest: "Developer experience", evidence: "Removing friction between thought and production.", source: "linkedin" }
    ],
    dealbreakers: ["Apathy toward aesthetic beauty", "Resignation to slow progress", "Ego over collaborative craft"],
    conversation_starters: [
      "What's an interface or physical object you interact with daily that feels completely frictionless?",
      "Espresso extraction or code optimization: which requires more subtle intuition?",
      "What makes a digital experience feel genuinely soulful to you?"
    ]
  },
  {
    id: "amjad-masad",
    name: "Amjad Masad",
    linkedinUrl: "https://www.linkedin.com/in/amjadmasad",
    instagramUrl: "https://www.instagram.com/amasad",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    role: "CEO & Co-Founder, Replit",
    location: "San Francisco, CA, USA",
    personality_archetype: "The Sovereign Hacker",
    voice_profile: "Energetic, defiant, fiercely optimistic, and relentlessly empowering. Speaks with the passion of a self-taught engineer who unlocked the world through a browser terminal.",
    needs: [
      { need: "Shared belief in individual agency and creative self-reliance", type: "relational", evidence: "Software creation is the ultimate equalizer; giving billions the power to build changes everything.", source: "linkedin", confidence: "high" },
      { need: "Lively, debate-friendly dinner conversations", type: "emotional", evidence: "The best evenings are spent passionately arguing about ideas with people you respect.", source: "instagram", confidence: "high" },
      { need: "Support for late-night hackathon bursts and startup momentum", type: "lifestyle", evidence: "Nothing beats the high of shipping something working at 3 AM alongside people who care.", source: "linkedin", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Building side-projects in browser sandboxes", evidence: "Spinning up new apps on a phone from an airport lounge.", source: "instagram" },
      { hobby: "Reading classical Middle Eastern and Western philosophy", evidence: "Reflecting on Ibn Khaldun and Enlightenment thinkers.", source: "linkedin" },
      { hobby: "Weightlifting and sprinting", evidence: "Heavy deadlifts to clear the head before intense product reviews.", source: "instagram" },
      { hobby: "Chess and strategy games", evidence: "Blitz chess matches over Turkish coffee.", source: "instagram" }
    ],
    interests: [
      { interest: "Ubiquitous software creation", evidence: "Bringing the next billion software creators online.", source: "linkedin" },
      { interest: "AI agents and LLM tooling", evidence: "AI coding agents as direct collaborators.", source: "linkedin" },
      { interest: "Decentralized knowledge", evidence: "Breaking institutional academic gatekeeping.", source: "linkedin" },
      { interest: "Founder resilience", evidence: "Enduring the early trough of sorrow with pure grit.", source: "linkedin" }
    ],
    dealbreakers: ["Bureaucratic gatekeeping mindset", "Lack of ambition or drive", "Complacency with the status quo"],
    conversation_starters: [
      "If every child had an AI pair programmer today, what would the world look like in twenty years?",
      "What is the most ambitious personal project you've ever started on a whim?",
      "Do you believe constraints fuel creativity more than total freedom does?"
    ]
  },
  {
    id: "whitney-wolfe-herd",
    name: "Whitney Wolfe Herd",
    linkedinUrl: "https://www.linkedin.com/in/whitney-wolfe-herd-857a268a",
    instagramUrl: "https://www.instagram.com/whitney",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    role: "Founder & Executive Chair, Bumble",
    location: "Austin, TX, USA",
    personality_archetype: "The High-Agency Romantic",
    voice_profile: "Empathetic, bold, charismatic, and emotionally perceptive. Speaks with warmth and authority on equality, dating culture, and intuitive human dynamics.",
    needs: [
      { need: "Mutual respect for female ambition and equitable partnership dynamics", type: "relational", evidence: "A true partner celebrates your power instead of feeling diminished by it.", source: "linkedin", confidence: "high" },
      { need: "Warm domestic grounding with family and children", type: "lifestyle", evidence: "No boardroom win compares to slow morning breakfast pancakes with my boys.", source: "instagram", confidence: "high" },
      { need: "Emotional vulnerability combined with fearless resilience", type: "emotional", evidence: "Courage isn't the absence of heartbreak; it's loving and creating anyway.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Family beach days in Texas and Florida", evidence: "Building sandcastles with the boys on quiet sunny mornings.", source: "instagram" },
      { hobby: "Equestrian riding", evidence: "Trail riding horses through Texas hill country.", source: "instagram" },
      { hobby: "Hosting intimate backyard dinner parties", evidence: "Lighting candles and cooking wholesome meals for lifelong friends.", source: "instagram" },
      { hobby: "Interior design and floral arrangement", evidence: "Arranging fresh wildflowers for the dining table.", source: "instagram" }
    ],
    interests: [
      { interest: "Future of romance and connection", evidence: "Empowering women to make the first move in dating and life.", source: "linkedin" },
      { interest: "Women in entrepreneurship", evidence: "Investing in female-founded consumer platforms.", source: "linkedin" },
      { interest: "Work-life integration", evidence: "Leading with kindness while maintaining executive focus.", source: "linkedin" },
      { interest: "Brand storytelling", evidence: "Building brands centered on safety and mutual respect.", source: "linkedin" }
    ],
    dealbreakers: ["Fragile egos", "Emotional unavailability", "Lack of genuine kindness toward hospitality staff"],
    conversation_starters: [
      "What is the kindest compliment anyone has ever given you that wasn't about your career?",
      "Do you think modern dating apps made people more cautious or more open-hearted?",
      "What is your non-negotiable ritual for resetting after a grueling week?"
    ]
  },
  {
    id: "sara-blakely",
    name: "Sara Blakely",
    linkedinUrl: "https://www.linkedin.com/in/sarablakely27",
    instagramUrl: "https://www.instagram.com/sarablakely",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
    role: "Founder, Spanx & Sneex",
    location: "Atlanta, GA, USA",
    personality_archetype: "The Playful Empire Builder",
    voice_profile: "Irreverently joyful, self-deprecating, deeply motivating, and infectious. Shares failures as badges of honor and embraces hilarious everyday absurdities with radical authenticity.",
    needs: [
      { need: "Someone who laughs freely and doesn't take life too seriously", type: "emotional", evidence: "If you can't laugh at yourself when you fall flat on your face, you're missing the whole comedy of life.", source: "instagram", confidence: "high" },
      { need: "Encouragement for unconventional, wacky creative ideas", type: "relational", evidence: "Don't let what you don't know stop you—it can become your greatest asset.", source: "linkedin", confidence: "high" },
      { need: "Spontaneous family adventures over rigid schedules", type: "lifestyle", evidence: "Spontaneous dance parties in the kitchen with the kids beat fancy galas every single time.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Kitchen dance-offs with four kids", evidence: "Blasting 80s music and dancing in pajamas with the family.", source: "instagram" },
      { hobby: "Sketching footwear designs on napkins", evidence: "Designing Sneex high-heel sneakers on airplane napkins.", source: "instagram" },
      { hobby: "Stand-up comedy and journaling", evidence: "Writing funny observational stories about daily mishaps.", source: "instagram" },
      { hobby: "Thrifting vintage finds", evidence: "Hunting for quirky vintage blazers in Atlanta thrift stores.", source: "instagram" }
    ],
    interests: [
      { interest: "Female founder mentorship", evidence: "Giving back and mentoring the next generation of women entrepreneurs.", source: "linkedin" },
      { interest: "Comfort fashion and innovative textiles", evidence: "Reinventing shapewear and high heels for true comfort.", source: "linkedin" },
      { interest: "Positive visualization", evidence: "My dad asked us what we failed at every dinner table.", source: "linkedin" },
      { interest: "Humor in resilience", evidence: "Using humor to disarm fear and pitch cold leads.", source: "linkedin" }
    ],
    dealbreakers: ["Stuffy formality", "Judgmental attitude toward making mistakes", "Pessimistic energy"],
    conversation_starters: [
      "What is the most ridiculous failure of yours that turned into an unexpected blessing?",
      "If we put on a 90s throwback song right now, are you dancing or standing by the wall?",
      "What's an idea you had that everyone laughed at until it worked?"
    ]
  },
  {
    id: "alexis-ohanian",
    name: "Alexis Ohanian",
    linkedinUrl: "https://www.linkedin.com/in/alexisohanian",
    instagramUrl: "https://www.instagram.com/alexisohanian",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    role: "Founder, Seven Seven Six & Co-Founder, Reddit",
    location: "Miami, FL, USA",
    personality_archetype: "The Web3 Polymath",
    voice_profile: "Enthusiastic, supportive, tech-forward, and unapologetically proud of family. Weaves trading card culture, women's sports equity, and venture investing into joyful narratives.",
    needs: [
      { need: "Full partnership in championing women's excellence and sports", type: "relational", evidence: "Investing in women's sports isn't charity; it's the smartest growth opportunity in entertainment.", source: "linkedin", confidence: "high" },
      { need: "Playful geekiness and shared hobbies", type: "lifestyle", evidence: "Collecting rare cards and gaming with Olympia is my ultimate happy place.", source: "instagram", confidence: "high" },
      { need: "Unconditional pride in each other's distinct achievements", type: "emotional", evidence: "Be the loudest cheerleader in the room for the person you love.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Collecting vintage sports and Pokémon cards", evidence: "Grading PSA 10 vintage cards with pure childhood excitement.", source: "instagram" },
      { hobby: "Cheering pitchside at Angel City FC games", evidence: "Leading supporter chants at women's soccer matches.", source: "instagram" },
      { hobby: "Grilling gourmet waffles for breakfast", evidence: "Making Disney character waffle art for his daughters on Sundays.", source: "instagram" },
      { hobby: "Retro gaming and comic books", evidence: "Playing classic 90s video games on original hardware.", source: "instagram" }
    ],
    interests: [
      { interest: "Women's athletics investment", evidence: "Leading seed rounds in women's sports leagues.", source: "linkedin" },
      { interest: "Web3 and creator ownership", evidence: "Digital sovereignty and direct creator monetization.", source: "linkedin" },
      { interest: "Paternity leave advocacy", evidence: "Advocating for paid family leave for all working parents.", source: "linkedin" },
      { interest: "Space exploration", evidence: "Cheering reusable rocketry and aerospace innovation.", source: "linkedin" }
    ],
    dealbreakers: ["Disrespect for female sports", "Workaholism that sacrifices family presence", "Lack of genuine playfulness"],
    conversation_starters: [
      "What was your childhood obsession that you still secretly geek out over?",
      "Pancakes or waffles on a Sunday morning—and do you make them from scratch?",
      "What is an industry you believe will be completely unrecognizable five years from now?"
    ]
  },
  {
    id: "brian-chesky",
    name: "Brian Chesky",
    linkedinUrl: "https://www.linkedin.com/in/brianchesky",
    instagramUrl: "https://www.instagram.com/bchesky",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
    role: "Co-Founder & CEO, Airbnb",
    location: "San Francisco, CA, USA",
    personality_archetype: "The Architectural Storyteller",
    voice_profile: "Visual, introspective, earnest, and deeply design-centric. Talks about human loneliness, belonging, and hand-crafted spaces with theatrical warmth and narrative depth.",
    needs: [
      { need: "Shared devotion to craftsmanship, beauty, and emotional hospitality", type: "lifestyle", evidence: "We didn't just build an app; we built an antidote to loneliness through human hospitality.", source: "linkedin", confidence: "high" },
      { need: "Deep, empathetic listening over hurried transactions", type: "emotional", evidence: "Designing a great life is like designing a great home: it starts with how you want people to feel inside it.", source: "instagram", confidence: "high" },
      { need: "Wanderlust rooted in local immersion rather than luxury tourism", type: "relational", evidence: "Living anywhere in the world showed me that true luxury is feeling at home among strangers.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Industrial sketching and watercolor painting", evidence: "Sketching chair prototypes and room floorplans.", source: "instagram" },
      { hobby: "Staying in unique architectural Airbnb homes with Sophie", evidence: "Living out of Airbnbs with his golden retriever Sophie.", source: "instagram" },
      { hobby: "Bodybuilding and classic strength training", evidence: "Hitting heavy bench and squats like in RISD hockey days.", source: "instagram" },
      { hobby: "Studying legendary Hollywood and Bauhaus design history", evidence: "Collecting vintage mid-century furniture pieces.", source: "instagram" }
    ],
    interests: [
      { interest: "Eradicating social isolation", evidence: "Solving the global loneliness epidemic through shared physical spaces.", source: "linkedin" },
      { interest: "Design-led leadership", evidence: "Running a Fortune 500 company purely as a designer.", source: "linkedin" },
      { interest: "Hospitality innovation", evidence: "Transforming hospitality into deep human storytelling.", source: "linkedin" },
      { interest: "Urban architecture", evidence: "Restoring historic neighborhoods through community tourism.", source: "linkedin" }
    ],
    dealbreakers: ["Aloofness toward human connection", "Transactional mindset", "Insensitivity to physical aesthetic surroundings"],
    conversation_starters: [
      "If you could live in any building in the world for one month, where would you wake up tomorrow?",
      "What was a place that made you feel completely at home the moment you walked through the door?",
      "What's a small design detail in everyday life that brings you irrational joy?"
    ]
  },
  {
    id: "tim-ferriss",
    name: "Tim Ferriss",
    linkedinUrl: "https://www.linkedin.com/in/timferriss",
    instagramUrl: "https://www.instagram.com/timferriss",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    role: "Author & Host, The Tim Ferriss Show",
    location: "Austin, TX, USA",
    personality_archetype: "The Relentless Experimenter",
    voice_profile: "Analytical, inquisitive, gentle, and contemplative. Speaks with deliberate precision, quoting stoic philosophers and asking incisive questions that cut through societal assumptions.",
    needs: [
      { need: "Quiet sanctuary for contemplative solitude and writing retreats", type: "lifestyle", evidence: "My nervous system requires long stretches of silent reading, Japanese tea, and total disconnection from noise.", source: "instagram", confidence: "high" },
      { need: "Curiosity for self-examination, psychology, and cognitive exploration", type: "emotional", evidence: "The quality of your life is the quality of the questions you dare to ask yourself.", source: "linkedin", confidence: "high" },
      { need: "Mutual respect for healthy somatic boundaries and bio-optimization", type: "relational", evidence: "Partnership thrives when both people prioritize emotional and somatic self-regulation.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Japanese archery (Kyudo) and martial arts", evidence: "Practicing the meditative discipline of Kyudo archery.", source: "instagram" },
      { hobby: "Somatic trauma work and cold plunges", evidence: "Morning cold plunge followed by breath meditation.", source: "instagram" },
      { hobby: "Gongfu tea ceremonies", evidence: "Brewing aged puerh tea with precise water temperatures.", source: "instagram" },
      { hobby: "Cooking slow-carb gourmet dinners", evidence: "Braising grass-fed short ribs with fresh herbs.", source: "instagram" }
    ],
    interests: [
      { interest: "Stoic philosophy (Seneca, Marcus Aurelius)", evidence: "Applying ancient stoicism to modern entrepreneurship and grief.", source: "linkedin" },
      { interest: "Psychedelic science and cognitive wellness", evidence: "Funding clinical trials at Johns Hopkins for healing trauma.", source: "linkedin" },
      { interest: "Rare book collecting", evidence: "Preserving first-edition historical texts.", source: "instagram" },
      { interest: "Language acquisition", evidence: "Deconstructing language learning into rapid immersion.", source: "linkedin" }
    ],
    dealbreakers: ["Constant chaotic drama", "Refusal to read or self-reflect", "Boundary violations of focus time"],
    conversation_starters: [
      "What is an uncomfortable question you've been avoiding asking yourself lately?",
      "Gongfu tea or a mountain hike: which provides a better mental reset for you?",
      "What is one habit you adopted that gave you back 80% of your peace?"
    ]
  },
  {
    id: "melanie-perkins",
    name: "Melanie Perkins",
    linkedinUrl: "https://www.linkedin.com/in/melanieperkins",
    instagramUrl: "https://www.instagram.com/melaniecanva",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    role: "Co-Founder & CEO, Canva",
    location: "Sydney, Australia",
    personality_archetype: "The Democratic Designer",
    voice_profile: "Generous, visionary, grounded, and intensely focused on global good. Speaks with gentle Australian warmth about eliminating design complexity and empowering every person to communicate visually.",
    needs: [
      { need: "Shared ethical compass and philanthropic commitment", type: "relational", evidence: "Our two-step plan has always been: build one of the world's most valuable companies, and do the most good we can do.", source: "linkedin", confidence: "high" },
      { need: "Down-to-earth humility despite monumental scale", type: "emotional", evidence: "Simplicity in how you live keeps you anchored no matter how fast your world expands.", source: "instagram", confidence: "high" },
      { need: "Adventure travel without ostentation", type: "lifestyle", evidence: "Kitesurfing in rough waters and hiking remote trails brings everything back into perspective.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Kitesurfing across windy coastlines", evidence: "Kitesurfing in Western Australia and Hawaii.", source: "instagram" },
      { hobby: "Sketching minimalist UI wireframes", evidence: "Simplifying complex design tools into single buttons.", source: "linkedin" },
      { hobby: "Backpacking remote national parks", evidence: "Hiking through the Australian bush with a simple tent.", source: "instagram" },
      { hobby: "Baking banana bread on weekends", evidence: "Sunday afternoon baking rituals at home.", source: "instagram" }
    ],
    interests: [
      { interest: "Democratizing creative software", evidence: "Empowering every student and non-profit with free graphic tools.", source: "linkedin" },
      { interest: "Extreme philanthropy and poverty alleviation", evidence: "Pledging the vast majority of Canva equity to global causes.", source: "linkedin" },
      { interest: "Visual literacy", evidence: "Making visual communication as universal as writing.", source: "linkedin" },
      { interest: "Venture longevity", evidence: "Building a company designed to endure for centuries.", source: "linkedin" }
    ],
    dealbreakers: ["Greed-driven vanity", "Condescending to beginners", "Inability to live simply"],
    conversation_starters: [
      "What is a skill that currently feels gatekept that you wish everyone in the world could access?",
      "What's the best advice anyone gave you when you were hearing 'no' dozens of times?",
      "Where in nature do you feel most grounded and clear-headed?"
    ]
  },
  {
    id: "andrew-huberman",
    name: "Andrew Huberman",
    linkedinUrl: "https://www.linkedin.com/in/andrew-huberman",
    instagramUrl: "https://www.instagram.com/hubermanlab",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    role: "Professor of Neurobiology, Stanford & Host, Huberman Lab",
    location: "Stanford, CA, USA",
    personality_archetype: "The Neuro-Optimized Thinker",
    voice_profile: "Authoritative, didactic, warmly encouraging, and scientifically rigorous. Explains biological mechanisms behind connection, circadian alignment, and autonomic balance with deep care.",
    needs: [
      { need: "Respect for strict circadian biology and morning sunlight protocols", type: "lifestyle", evidence: "Viewing direct morning sunlight within 30 minutes of waking is non-negotiable for neural regulation and dopamine tone.", source: "instagram", confidence: "high" },
      { need: "High-communication somatic awareness and emotional clarity", type: "emotional", evidence: "Clear communication reduces autonomic friction in relationships; ambiguity creates unnecessary nervous system strain.", source: "linkedin", confidence: "high" },
      { need: "Shared love for outdoor physical rigor and animals", type: "relational", evidence: "Trail rucking with my bulldog Costello anchored my life for over a decade.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Heavy trail rucking in morning sunlight", evidence: "Carrying a 45lb rucksack through Stanford hills at sunrise.", source: "instagram" },
      { hobby: "Cold plunges and breathwork protocols", evidence: "Three-minute ice bath followed by physiological sighs.", source: "instagram" },
      { hobby: "Skateboarding (since teenage years)", evidence: "Skating empty parking lots to keep reflexive balance sharp.", source: "instagram" },
      { hobby: "Caring for bulldogs and rescue dogs", evidence: "Devoted companion to rescue bulldogs.", source: "instagram" }
    ],
    interests: [
      { interest: "Neurobiology of attachment and focus", evidence: "Studying neural circuits of visual perception and stress.", source: "linkedin" },
      { interest: "Dopamine dynamics and autonomic nervous system", evidence: "Understanding peak dopamine vs baseline management.", source: "linkedin" },
      { interest: "Sleep architecture", evidence: "Optimizing slow-wave and REM sleep cycles.", source: "linkedin" },
      { interest: "Evidence-based wellness", evidence: "Translating peer-reviewed neuroscience into daily actionable protocols.", source: "linkedin" }
    ],
    dealbreakers: ["Chronic late-night screen scrolling in bed", "Denial of science and biological reality", "Passive-aggressive emotional patterns"],
    conversation_starters: [
      "What does your first hour after waking look like, and how does it set your mental tone?",
      "Skateboarding or heavy rucking: what's your preferred way to burn nervous energy?",
      "How do you actively signal safety and presence to someone you care about?"
    ]
  },
  {
    id: "shaan-puri",
    name: "Shaan Puri",
    linkedinUrl: "https://www.linkedin.com/in/shaanpuri",
    instagramUrl: "https://www.instagram.com/shaanpuri",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    role: "Host, My First Million & Founder",
    location: "San Francisco, CA, USA",
    personality_archetype: "The Unfiltered Storyteller",
    voice_profile: "Fast, witty, irreverent, and endlessly curious. Uses snappy metaphors, laughs from the belly, and turns everyday business ideas into gripping tales over a drink.",
    needs: [
      { need: "Someone with high banter velocity and quick comedic timing", type: "relational", evidence: "If we can't talk for three hours straight without running out of hilarious topics, it's not gonna work.", source: "instagram", confidence: "high" },
      { need: "Appreciation for eccentric experiments and high-variance bets", type: "lifestyle", evidence: "I love trying weird business ideas and bizarre diets just to see what happens.", source: "linkedin", confidence: "high" },
      { need: "Support for deep creative focus interspersed with total downtime", type: "emotional", evidence: "You need a partner who roots for your crazy side while keeping your feet on the ground.", source: "linkedin", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Testing bizarre fitness challenges", evidence: "Doing 30-day carnivore or 100 burpee daily bets.", source: "instagram" },
      { hobby: "Whiteboarding wacky business ideas", evidence: "Filling giant whiteboards with ideas from dog fitness to newsletter rolls.", source: "instagram" },
      { hobby: "Pickleball and high-stakes poker", evidence: "Smack-talking friends on competitive pickleball courts.", source: "instagram" },
      { hobby: "Hosting founder dinner salons", evidence: "Gathering 8 smart people around delicious pizza to swap secrets.", source: "instagram" }
    ],
    interests: [
      { interest: "Podcasting dynamics", evidence: "Building My First Million into a top business show.", source: "linkedin" },
      { interest: "Storytelling frameworks", evidence: "Hook, story, offer: using storytelling in every conversation.", source: "linkedin" },
      { interest: "Personal finance playbooks", evidence: "Investing in boring cash flow and asymmetric upside.", source: "linkedin" },
      { interest: "Consumer psychology", evidence: "Deconstructing why people buy weird impulse products.", source: "linkedin" }
    ],
    dealbreakers: ["Taking yourself too seriously", "Low conversational energy", "Inability to appreciate a goofy joke"],
    conversation_starters: [
      "What's the weirdest business idea you've ever had that you still secretly think could make millions?",
      "If you could pick any celebrity to do a 2-hour podcast interview with right now, who would it be?",
      "What's something you changed your mind on completely this year?"
    ]
  },
  {
    id: "julie-zhuo",
    name: "Julie Zhuo",
    linkedinUrl: "https://www.linkedin.com/in/juliezhuo",
    instagramUrl: "https://www.instagram.com/joulee",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    role: "Co-Founder, Sundial & Author, The Making of a Manager",
    location: "California, USA",
    personality_archetype: "The Empathic Designer",
    voice_profile: "Lyrical, thoughtful, introspective, and profoundly caring. Analyzes human relationships through the lens of compassionate design and lifelong self-discovery.",
    needs: [
      { need: "Intellectual and emotional depth with genuine vulnerability", type: "emotional", evidence: "Great design, like great love, is about paying attention to what people feel but cannot say.", source: "linkedin", confidence: "high" },
      { need: "Quiet family harmony and domestic stability", type: "lifestyle", evidence: "My sanctuary is evening storybooks with the kids and the aroma of home-cooked soup.", source: "instagram", confidence: "high" },
      { need: "Mutual mentorship and collaborative curiosity", type: "relational", evidence: "The most beautiful partnerships are those where both people help each other grow into who they want to become.", source: "linkedin", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Writing personal essays and essays on design", evidence: "Reflecting on motherhood, leadership, and emotional vulnerability.", source: "linkedin" },
      { hobby: "Watercolor illustration and calligraphy", evidence: "Painting small botanicals and brush lettering quotes.", source: "instagram" },
      { hobby: "Cooking intricate Asian comfort dishes", evidence: "Simmering braised pork belly and homemade dumplings.", source: "instagram" },
      { hobby: "Gardening and nature walks", evidence: "Tending to backyard succulents and citrus trees.", source: "instagram" }
    ],
    interests: [
      { interest: "Human-computer empathy", evidence: "Designing data analytics that feel as natural as a conversation.", source: "linkedin" },
      { interest: "Product leadership frameworks", evidence: "Authoring The Making of a Manager for millions of emerging leaders.", source: "linkedin" },
      { interest: "Parenting and child development", evidence: "Learning empathy from children's unvarnished questions.", source: "instagram" },
      { interest: "Emotional resilience", evidence: "Overcoming imposter syndrome through structured introspection.", source: "linkedin" }
    ],
    dealbreakers: ["Dismissiveness of feelings", "Aggressive arrogance", "Superficiality in conversations"],
    conversation_starters: [
      "What is an emotional truth about leadership or relationships that no one taught you in school?",
      "What book or piece of art has brought you to tears recently?",
      "How do you design quiet intentionality into a busy family week?"
    ]
  },
  {
    id: "sahil-bloom",
    name: "Sahil Bloom",
    linkedinUrl: "https://www.linkedin.com/in/sahilbloom",
    instagramUrl: "https://www.instagram.com/sahilbloom",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    role: "Author, The 5 Types of Wealth & Investor",
    location: "New York, USA",
    personality_archetype: "The Intentional Compounder",
    voice_profile: "Encouraging, disciplined, structured, and warm. Focuses on daily compounding habits, multi-generational family bonds, and the five types of wealth (time, health, relationships, purpose, money).",
    needs: [
      { need: "Shared commitment to holistic well-being over raw financial hustle", type: "emotional", evidence: "The greatest wealth is waking up each morning with total freedom over your time and loving the people around you.", source: "linkedin", confidence: "high" },
      { need: "Daily physical discipline and morning rituals", type: "lifestyle", evidence: "Sweat before coffee, cherish the sunrise, and make time for the people who matter.", source: "instagram", confidence: "high" },
      { need: "Deep, multi-generational family prioritization", type: "relational", evidence: "Being a present father and devoted partner is the single most important metric of my life.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Morning kettlebell and barbell training", evidence: "Heavy clean and presses in the garage gym at dawn.", source: "instagram" },
      { hobby: "Playing outdoors with his son Roman", evidence: "Throwing baseballs in the park and exploring nature.", source: "instagram" },
      { hobby: "Journaling at dawn with black coffee", evidence: "Writing three things I'm grateful for every single sunrise.", source: "instagram" },
      { hobby: "Stanford baseball alumni games", evidence: "Catching up with college teammates on the diamond.", source: "instagram" }
    ],
    interests: [
      { interest: "The 5 types of wealth", evidence: "Time wealth, health wealth, relationship wealth, purpose wealth, financial wealth.", source: "linkedin" },
      { interest: "Compounding habits and mental models", evidence: "Writing weekly essays on razor principles and cognitive biases.", source: "linkedin" },
      { interest: "Physical longevity", evidence: "Designing training for vibrant mobility at age 80.", source: "linkedin" },
      { interest: "Philosophy of time", evidence: "Memento Mori: remembering that time is the only truly finite asset.", source: "linkedin" }
    ],
    dealbreakers: ["Sacrificing family for ego or money", "Chronic unreliability", "Lack of physical health awareness"],
    conversation_starters: [
      "Which of the 5 types of wealth (time, health, relationships, purpose, money) do you feel richest in today?",
      "What is a 1% daily habit that completely transformed your life?",
      "What is the best lesson your grandparents or parents ever taught you?"
    ]
  },
  {
    id: "cleo-abram",
    name: "Cleo Abram",
    linkedinUrl: "https://www.linkedin.com/in/cleoabram",
    instagramUrl: "https://www.instagram.com/cleoabram",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    role: "Video Journalist & Creator, Huge If True",
    location: "New York, USA",
    personality_archetype: "The Radical Techno-Optimist",
    voice_profile: "Bright, inquisitive, razor-sharp, and infectious with wonder. Translates complex technical frontiers (nuclear fusion, CRISPR, robotics) into hopeful human adventures with infectious joy.",
    needs: [
      { need: "Infectious curiosity about the future and how things work", type: "relational", evidence: "I fall for people whose eyes light up when they explain how a mysterious piece of physics or biology actually functions.", source: "instagram", confidence: "high" },
      { need: "Support for fast-paced video production and field journalism", type: "lifestyle", evidence: "Filming inside a fusion reactor one day and editing through the night requires high-energy understanding.", source: "linkedin", confidence: "high" },
      { need: "Grounded emotional optimism over cynical defeatism", type: "emotional", evidence: "Optimism isn't naive; it's a moral strategy to build the world we want to inherit.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Visiting cutting-edge laboratories and factories", evidence: "Climbing gantries at rocket factories and fusion test sites.", source: "instagram" },
      { hobby: "Formula 1 racing enthusiasm", evidence: "Waking up at 7 AM on Sunday to watch lights out at Silverstone.", source: "instagram" },
      { hobby: "Running through Central Park with camera gear", evidence: "Morning 5k loop around the reservoir.", source: "instagram" },
      { hobby: "Baking elaborate fruit pies on weekends", evidence: "Latticing homemade peach and blackberry pies.", source: "instagram" }
    ],
    interests: [
      { interest: "Nuclear fusion and deep tech", evidence: "Explaining tokamak magnets and laser confinement in simple terms.", source: "linkedin" },
      { interest: "Video storytelling and editing", evidence: "Editing Huge If True episodes frame by frame.", source: "linkedin" },
      { interest: "Clean energy frontiers", evidence: "Highlighting breakthroughs in geothermal and solar grids.", source: "linkedin" },
      { interest: "Future of humanity", evidence: "Inspiring youth to pursue engineering and hard sciences.", source: "linkedin" }
    ],
    dealbreakers: ["Lazy cynicism about human progress", "Condescension toward curiosity", "Lack of enthusiasm for learning"],
    conversation_starters: [
      "If you could stand inside any scientific laboratory in history for one hour, which experiment would you watch?",
      "What is a technology people are terrified of today that you think will actually save us?",
      "Are you an F1 fan, and who do you root for on race day?"
    ]
  },
  {
    id: "grace-beverley",
    name: "Grace Beverley",
    linkedinUrl: "https://www.linkedin.com/in/gracebeverley",
    instagramUrl: "https://www.instagram.com/gracebeverley",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    role: "Founder, TALA & Shreddy, Author, Working Hard, Hardly Working",
    location: "London, UK",
    personality_archetype: "The Sustainable Overachiever",
    voice_profile: "Crisp, witty, British, fiercely driven, and candid about burnout. Balances building multi-million pound sustainable fashion brands with hilarious reality checks on work-life boundaries.",
    needs: [
      { need: "Mutual ambition coupled with radical respect for boundaries", type: "emotional", evidence: "You can build an empire and still insist on closing your laptop when the clock strikes eight.", source: "linkedin", confidence: "high" },
      { need: "Shared values around environmental sustainability and ethical business", type: "relational", evidence: "If your success comes at the expense of the planet or fair labor, it's not success.", source: "instagram", confidence: "high" },
      { need: "Appreciation for London pub culture and cozy downtime", type: "lifestyle", evidence: "A Sunday roast with friends and a great pint of cider heals any corporate stress.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Weightlifting and fitness programming", evidence: "Testing new TALA compression leggings during heavy squats.", source: "instagram" },
      { hobby: "Music festivals and DJ sets", evidence: "Dancing outdoors at summer music festivals with friends.", source: "instagram" },
      { hobby: "Reading contemporary fiction in London parks", evidence: "Reading Sally Rooney novels in Regent's Park.", source: "instagram" },
      { hobby: "Sunday roasts at historic London pubs", evidence: "Yorkshire puddings, crispy roast potatoes, and lively debate.", source: "instagram" }
    ],
    interests: [
      { interest: "Sustainable activewear supply chains", evidence: "Using recycled plastic bottles and eucalyptus fibers in apparel.", source: "linkedin" },
      { interest: "Productivity vs burnout psychology", evidence: "Authoring Working Hard, Hardly Working to dismantle toxic hustle.", source: "linkedin" },
      { interest: "Female venture funding", evidence: "Raising institutional capital as a female solo-founder in London.", source: "linkedin" },
      { interest: "Music and arts", evidence: "Studying classical piano and music composition at Oxford.", source: "linkedin" }
    ],
    dealbreakers: ["Performative workaholism without boundaries", "Anti-sustainability apathy", "Mansplaining business"],
    conversation_starters: [
      "What's the hardest boundary you've had to enforce between your ambition and your sanity?",
      "Best Sunday roast in London or home cooking: where do you stand?",
      "What is an over-hyped productivity trend that you think is total nonsense?"
    ]
  },
  {
    id: "codie-sanchez",
    name: "Codie Sanchez",
    linkedinUrl: "https://www.linkedin.com/in/codiesanchez",
    instagramUrl: "https://www.instagram.com/codiesanchez",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80",
    role: "Founder & CEO, Main St. / Contrarian Thinking",
    location: "Austin, TX, USA",
    personality_archetype: "The Cashflow Contrarian",
    voice_profile: "Direct, gritty, razor-sharp, and unapologetically pragmatic. Talks about boring businesses, car washes, financial freedom, and blue-collar grit with swagger and intellect.",
    needs: [
      { need: "Tough-minded emotional independence and high grit", type: "emotional", evidence: "I respect people who have scars, who have built real things with their bare hands, and who don't cry when things get hard.", source: "linkedin", confidence: "high" },
      { need: "Shared appreciation for Main Street America and real assets", type: "lifestyle", evidence: "Give me laundromats, small businesses, and open Texas skies over Silicon Valley buzzwords any day.", source: "instagram", confidence: "high" },
      { need: "Loyalty, direct truth-telling, and no sugar-coating", type: "relational", evidence: "Say what you mean, do what you promised, and don't play passive-aggressive games.", source: "linkedin", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Ranching and horseback riding in Texas", evidence: "Riding across the ranch at dusk and checking fence lines.", source: "instagram" },
      { hobby: "Hunting and outdoor marksmanship", evidence: "Target practice and outdoor sporting clays.", source: "instagram" },
      { hobby: "Weightlifting and combat training", evidence: "Boxing workouts and heavy deadlifts to build mental grit.", source: "instagram" },
      { hobby: "Small business balance sheet breakdowns", evidence: "Touring local HVAC and car wash operations.", source: "linkedin" }
    ],
    interests: [
      { interest: "Main Street business acquisitions", evidence: "Helping people buy boring businesses that generate real cashflow.", source: "linkedin" },
      { interest: "Cashflow compounding", evidence: "Financial independence through tangible, non-speculative assets.", source: "linkedin" },
      { interest: "Investigative journalism", evidence: "Former conflict journalist covering human trafficking and cartels.", source: "linkedin" },
      { interest: "Economic sovereignty", evidence: "Building freedom from corporate reliance and debt.", source: "linkedin" }
    ],
    dealbreakers: ["Fragile victim mentality", "Financial illiteracy or chronic debt", "Indirect passive-aggression"],
    conversation_starters: [
      "If you had to buy a boring cash-flowing business tomorrow (laundromat, car wash, storage unit), which one would you pick and why?",
      "What's the hardest lesson you learned from losing money?",
      "What does true sovereignty mean to you outside of financial numbers?"
    ]
  },
  {
    id: "sara-dietschy",
    name: "Sara Dietschy",
    linkedinUrl: "https://www.linkedin.com/in/saradietschy",
    instagramUrl: "https://www.instagram.com/saradietschy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    role: "Tech Creator, Filmmaker & Host, That Creative Life",
    location: "Dallas / New York, USA",
    personality_archetype: "The Creative Synthesizer",
    voice_profile: "Upbeat, spunky, visually obsessed, and deeply conversational. Seamlessly moves between camera lenses, creative entrepreneurship, and marriage realities with authentic charm.",
    needs: [
      { need: "Shared creative rhythm and visual storytelling appreciation", type: "lifestyle", evidence: "Living with someone who understands why good lighting matters and respects the edit grind makes all the difference.", source: "instagram", confidence: "high" },
      { need: "Playful, lighthearted companionship without corporate pretension", type: "emotional", evidence: "Life is an ongoing creative vlog; don't take yourself too seriously and have fun with the process.", source: "linkedin", confidence: "high" },
      { need: "Support for independent creative entrepreneurship", type: "relational", evidence: "Being your own boss requires a partner who roots for your wildest camera ideas.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Shooting cinematic B-roll", evidence: "Testing anamorphic lenses on city skylines.", source: "instagram" },
      { hobby: "Podcast hosting and interviewing creators", evidence: "Digging into creator routines on That Creative Life.", source: "instagram" },
      { hobby: "Coffee shop hunting in Dallas and NYC", evidence: "Rating cold brews in aesthetic loft cafés.", source: "instagram" },
      { hobby: "Interior decorating and studio builds", evidence: "Building custom acoustic wood slat studio backdrops.", source: "instagram" }
    ],
    interests: [
      { interest: "Creative tech gear", evidence: "Reviewing mirrorless bodies, wireless mics, and gimbals.", source: "linkedin" },
      { interest: "Audio-visual production", evidence: "Lighting setups, keylights, and color grading LUTs.", source: "linkedin" },
      { interest: "Creator economy economics", evidence: "Sponsorship models and independent media sustainability.", source: "linkedin" },
      { interest: "Community building", evidence: "Fostering long-term viewer trust over clickbait virality.", source: "linkedin" }
    ],
    dealbreakers: ["Lack of enthusiasm for art and content", "Controlling or jealous behavior", "Inability to laugh at chaos"],
    conversation_starters: [
      "What's your all-time favorite camera or lens that holds the most memories for you?",
      "Dallas or New York: which city feeds your creative energy more?",
      "If you could document one person's life for a month, who would you point the lens at?"
    ]
  },
  {
    id: "austin-evans",
    name: "Austin Evans",
    linkedinUrl: "https://www.linkedin.com/in/austin-evans-608b6a32",
    instagramUrl: "https://www.instagram.com/austinnotduncan",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    role: "Tech Reviewer & Video Creator",
    location: "Los Angeles, CA, USA",
    personality_archetype: "The Enthusiastic Hardware Maven",
    voice_profile: "High-energy, boyish, curious, and infectiously excited about gadgets, gaming PCs, and teardowns. Radiates welcoming joy and pure passion for consumer electronics.",
    needs: [
      { need: "Shared love for gaming, tech tinkering, and playful competitions", type: "lifestyle", evidence: "Nothing beats spending a rainy afternoon building custom rigs and playing co-op games together.", source: "instagram", confidence: "high" },
      { need: "Genuine warmth, positivity, and low drama", type: "emotional", evidence: "Surround yourself with people whose energy lifts you up and who celebrate the simple fun things in life.", source: "linkedin", confidence: "high" },
      { need: "Patience with hardware gear hoarding and studio clutter", type: "relational", evidence: "Yes, I really do need all thirty graphics cards in the living room for testing!", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Building bespoke custom PC rigs", evidence: "Watercooling exotic ITX cases and routing cables.", source: "instagram" },
      { hobby: "Console gaming and retro emulation", evidence: "Playing Nintendo and PlayStation classics on handheld emulators.", source: "instagram" },
      { hobby: "Testing exotic smartphone imports", evidence: "Unboxing folding phones and prototype gadgets.", source: "instagram" },
      { hobby: "Cooking hearty comfort meals", evidence: "Grilling barbecue ribs and burgers on the patio.", source: "instagram" }
    ],
    interests: [
      { interest: "Silicon architecture and benchmarks", evidence: "Comparing GPU clock speeds and thermal throttling.", source: "linkedin" },
      { interest: "Consumer electronics evolution", evidence: "Covering 15 years of smartphone and PC history on YouTube.", source: "linkedin" },
      { interest: "Automotive tech", evidence: "Electric vehicle software and driver-assist displays.", source: "linkedin" },
      { interest: "Gaming culture", evidence: "Co-op gaming and game performance optimization.", source: "linkedin" }
    ],
    dealbreakers: ["Snobbish condescension", "Hating video games or tech", "Negative, draining attitudes"],
    conversation_starters: [
      "What was the very first gaming console or computer you ever fell in love with?",
      "Is it worth buying budget mystery tech off wish/aliexpress just for the thrill of the teardown?",
      "What's your go-to comfort game when you just want to relax?"
    ]
  },
  {
    id: "steven-bartlett",
    name: "Steven Bartlett",
    linkedinUrl: "https://www.linkedin.com/in/steven-bartlett-56986834",
    instagramUrl: "https://www.instagram.com/steven",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    role: "Host, The Diary Of A CEO & Investor, Dragons' Den",
    location: "London, UK",
    personality_archetype: "The Vulnerable Architect",
    voice_profile: "Smooth, probing, emotionally mature, and deeply psychological. Asks penetrative questions about childhood patterns, trauma, love, and what drives human behavior.",
    needs: [
      { need: "Uncompromising emotional self-awareness and willingness to do inner work", type: "emotional", evidence: "You cannot have a healthy adult relationship until you heal the childhood wounds you pretend don't exist.", source: "instagram", confidence: "high" },
      { need: "Intellectual curiosity about neuroscience, human psychology, and habits", type: "relational", evidence: "Conversations that explore why we do what we do are the only conversations worth having.", source: "linkedin", confidence: "high" },
      { need: "Disciplined fitness and lifestyle balance amidst hectic global schedules", type: "lifestyle", evidence: "Physical training and sleep are the foundational anchors that allow me to show up for the people I love.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Hosting marathon podcast recording sessions", evidence: "Deep 3-hour dialogues with world experts on trauma and business.", source: "instagram" },
      { hobby: "High-intensity fitness and functional training", evidence: "Deadlifts, assault bike sprints, and pullups every morning.", source: "instagram" },
      { hobby: "Reading behavioral psychology and neuroscience", evidence: "Studying neuroplasticity and evolutionary psychology.", source: "linkedin" },
      { hobby: "Soccer and international travel", evidence: "Playing casual pickup soccer in London parks.", source: "instagram" }
    ],
    interests: [
      { interest: "The Diary of a CEO", evidence: "Building one of the world's most downloaded podcasts.", source: "linkedin" },
      { interest: "Attachment theory and conditioning", evidence: "Exploring how early childhood shapes romantic choices.", source: "linkedin" },
      { interest: "Early-stage venture capital", evidence: "Investing in wellness, biotech, and AI through Flight Fund.", source: "linkedin" },
      { interest: "Health-span optimization", evidence: "Continuous blood monitoring, VO2 max, and sleep tracking.", source: "linkedin" }
    ],
    dealbreakers: ["Emotional defensiveness and lack of self-awareness", "Inability to apologize or reflect", "Apathy toward physical health"],
    conversation_starters: [
      "What is the biggest myth you used to believe about what makes love last?",
      "If I asked your closest friend what your biggest blind spot is, what would they tell me?",
      "What's a lesson from your childhood that you are actively working to unlearn?"
    ]
  },
  {
    id: "gary-vaynerchuk",
    name: "Gary Vaynerchuk",
    linkedinUrl: "https://www.linkedin.com/in/garyvaynerchuk",
    instagramUrl: "https://www.instagram.com/garyvee",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
    role: "Chairman, VaynerX & CEO, VaynerMedia",
    location: "New York, USA",
    personality_archetype: "The Hyper-Empathetic Hustler",
    voice_profile: "High-octane, passionate, direct, yet surprisingly tender about kindness, gratitude, and patience. Cuts through excuses with heavy love and street-smart wisdom.",
    needs: [
      { need: "Pure emotional kindness, warmth, and lack of envy", type: "emotional", evidence: "Kindness is the ultimate strength. If you have empathy and gratitude, everything else in life takes care of itself.", source: "linkedin", confidence: "high" },
      { need: "Shared love for the thrill of the hunt", type: "lifestyle", evidence: "Finding a $2 hidden gem at a 6 AM garage sale brings me more pure joy than any fancy dinner.", source: "instagram", confidence: "high" },
      { need: "Zero tolerance for complaining or victim mentalities", type: "relational", evidence: "Accountability is the fastest path to inner peace. Blaming other people gives away all your power.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Weekend garage sale hunting", evidence: "Scouring New Jersey yard sales at 7 AM for vintage toys.", source: "instagram" },
      { hobby: "Cheering for the New York Jets", evidence: "Lifelong dream of owning the NY Jets franchise.", source: "instagram" },
      { hobby: "Collecting rare sports cards and NFTs", evidence: "Trading 1986 Fleer Jordan cards and VeeFriends.", source: "instagram" },
      { hobby: "Wine tasting and vineyard explorations", evidence: "Tasting cabernets and evaluating terroir like in Wine Library days.", source: "instagram" }
    ],
    interests: [
      { interest: "Consumer attention shifts", evidence: "Daytrading consumer attention across social platforms.", source: "linkedin" },
      { interest: "Empathy in modern business", evidence: "Authoring Twelve and a Half on emotional intelligence.", source: "linkedin" },
      { interest: "Youth sports culture", evidence: "Advocating for pure fun over parental pressure in youth athletics.", source: "linkedin" },
      { interest: "Collectibles economy", evidence: "Predicting alternative asset markets and nostalgic IP.", source: "linkedin" }
    ],
    dealbreakers: ["Whining and pointing fingers", "Envy of other people's success", "Cruelty to waitstaff or strangers"],
    conversation_starters: [
      "If I gave you $50 at a flea market on Saturday morning, what's the first thing you're hunting for?",
      "How do you maintain genuine gratitude on days when everything seems to go wrong?",
      "Do you think kindness is seen as a weakness by people who don't understand it?"
    ]
  },
  {
    id: "arianna-huffington",
    name: "Arianna Huffington",
    linkedinUrl: "https://www.linkedin.com/in/ariannahuffington",
    instagramUrl: "https://www.instagram.com/ariannahuff",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
    role: "Founder & CEO, Thrive Global & Founder, The Huffington Post",
    location: "New York, USA",
    personality_archetype: "The Mindful Matriarch",
    voice_profile: "Elegant, warm, poetic, and uncompromising on sleep and renewal. Speaks with deep Greek cultural warmth about banishing burnout and redefining success around well-being and wisdom.",
    needs: [
      { need: "Strict sanctuary for deep, restorative sleep and digital detox", type: "lifestyle", evidence: "Sleep is a non-negotiable human right and the foundation of all creativity, empathy, and joy.", source: "linkedin", confidence: "high" },
      { need: "Philosophical wisdom, literature, and expansive dialogue", type: "relational", evidence: "We need conversations that nourish our souls rather than drain our cognitive batteries.", source: "instagram", confidence: "high" },
      { need: "Compassionate emotional grounding without toxic hustle culture", type: "emotional", evidence: "Dying at your desk is not a badge of honor; living a life rich with wonder is.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Evening device-free reading and herbal tea rituals", evidence: "Putting all phones to sleep outside the bedroom at 9 PM.", source: "instagram" },
      { hobby: "Swimming in the Mediterranean Sea", evidence: "Floating in the warm Aegean sea along Greek islands.", source: "instagram" },
      { hobby: "Collecting Greek poetry and philosophy", evidence: "Reading Marcus Aurelius and C.P. Cavafy.", source: "instagram" },
      { hobby: "Walking through quiet botanical gardens", evidence: "Slow mindful walks among blooming jasmine and olive trees.", source: "instagram" }
    ],
    interests: [
      { interest: "Sleep science and circadian restoration", evidence: "Publishing The Sleep Revolution to educate the world.", source: "linkedin" },
      { interest: "Eradicating corporate burnout", evidence: "Leading Thrive Global to help millions escape exhaustion.", source: "linkedin" },
      { interest: "Ancient Greek philosophy", evidence: "Re-anchoring modern ethics in classical virtue and eudaimonia.", source: "linkedin" },
      { interest: "Micro-steps to habit change", evidence: "Too-small-to-fail behavioral changes that compound into health.", source: "linkedin" }
    ],
    dealbreakers: ["Boasting about sleep deprivation", "Addiction to phones during dinner", "Cynicism toward mental well-being"],
    conversation_starters: [
      "What is your sacred ritual before bed that tells your brain it's time to let go of the world?",
      "If you could consult one ancient philosopher about modern romance, who would it be?",
      "What was the wake-up call in your life that made you re-evaluate what truly matters?"
    ]
  },
  {
    id: "greg-isenberg",
    name: "Greg Isenberg",
    linkedinUrl: "https://www.linkedin.com/in/gregisenberg",
    instagramUrl: "https://www.instagram.com/gregisenberg",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    role: "CEO, Late Checkout & Host, The Greg Isenberg Show",
    location: "Miami / Montreal",
    personality_archetype: "The Community Alchemist",
    voice_profile: "Creative, laid-back, observant, and wonderfully eccentric. Speaks in playful frameworks about unbundling Reddit, internet subcultures, product design, and creative serendipity.",
    needs: [
      { need: "Playful, imaginative curiosity about weird internet cultures and people", type: "relational", evidence: "The most fascinating people are the ones who dive deep into bizarre, niche hobbies and build tiny cults around them.", source: "instagram", confidence: "high" },
      { need: "Laid-back lifestyle with space for spontaneous creative walks", type: "lifestyle", evidence: "My best product ideas come from taking long walks without an agenda and noticing what people care about.", source: "linkedin", confidence: "high" },
      { need: "Warm emotional presence without corporate posturing", type: "emotional", evidence: "Life is too short to work with people who can't laugh at the weirdness of the internet.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Exploring niche subreddits and obscure online forums", evidence: "Analyzing communities of 10,000 hyper-passionate members.", source: "instagram" },
      { hobby: "Designing quirky aesthetic web applications", evidence: "Building boutique product ideas that feel playful.", source: "instagram" },
      { hobby: "Strolling Miami neighborhoods for architectural inspiration", evidence: "Walking Wynwood and South Beach admiring Art Deco palettes.", source: "instagram" },
      { hobby: "Curating indie electronic playlists", evidence: "Finding underground lo-fi and French house gems.", source: "instagram" }
    ],
    interests: [
      { interest: "Community-led products", evidence: "Unbundling Reddit into standalone multi-million dollar brands.", source: "linkedin" },
      { interest: "Internet culture anthropology", evidence: "Studying how subcultures form language and social bonds online.", source: "linkedin" },
      { interest: "Interface micro-delights", evidence: "Creating joyful moments in digital software.", source: "linkedin" },
      { interest: "Unbundling platforms", evidence: "Turning niche subreddit habits into specialized software.", source: "linkedin" }
    ],
    dealbreakers: ["Boring corporate conformity", "Lack of imagination", "Being glued to LinkedIn buzzwords"],
    conversation_starters: [
      "What is the weirdest niche internet rabbit hole you've fallen into recently?",
      "Miami or Montreal: which city has a weirder, cooler soul?",
      "If you could build a digital community around any strange human obsession, what would it be?"
    ]
  },
  {
    id: "lenny-rachitsky",
    name: "Lenny Rachitsky",
    linkedinUrl: "https://www.linkedin.com/in/lennyrachitsky",
    instagramUrl: "https://www.instagram.com/lennyrachitsky",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    role: "Author, Lenny's Newsletter & Host, Lenny's Podcast",
    location: "San Francisco, CA, USA",
    personality_archetype: "The Product Philosopher",
    voice_profile: "Gentle, structured, deeply curious, and generous with insights. Speaks like the favorite mentor you always wanted, asking clear questions and celebrating practical wisdom.",
    needs: [
      { need: "Deep intellectual clarity and appreciation for quiet craft", type: "relational", evidence: "Clarity of thought is the rarest and most attractive quality in another human being.", source: "linkedin", confidence: "high" },
      { need: "Balanced lifestyle with focus time, nature, and peaceful evenings", type: "lifestyle", evidence: "Writing a newsletter for hundreds of thousands requires quiet rooms, deep tea, and peaceful walks.", source: "instagram", confidence: "high" },
      { need: "Empathetic, non-judgmental emotional safety", type: "emotional", evidence: "True connection happens when you feel completely safe to admit what you don't know.", source: "instagram", confidence: "medium" }
    ],
    hobbies: [
      { hobby: "Writing deep-dive essays and interviewing founders", evidence: "Interviewing world-class product leaders on Lenny's Podcast.", source: "linkedin" },
      { hobby: "Hiking Marin headlands and California coastlines", evidence: "Walking through eucalyptus groves overlooking the Pacific ocean.", source: "instagram" },
      { hobby: "Making specialty pour-over coffee", evidence: "Weighing single-origin Ethiopian beans with a Hario V60.", source: "instagram" },
      { hobby: "Skiing and mountain retreats", evidence: "Fresh powder days in Lake Tahoe and Utah.", source: "instagram" }
    ],
    interests: [
      { interest: "Product management craft", evidence: "Deconstructing how top tech companies build, launch, and grow products.", source: "linkedin" },
      { interest: "Growth loops and marketplace dynamics", evidence: "Analyzing network effects, retention curves, and viral loops.", source: "linkedin" },
      { interest: "Newsletter publishing ecosystems", evidence: "Pioneering independent Substack media businesses.", source: "linkedin" },
      { interest: "Mindful work habits", evidence: "Protecting deep work time from calendar fragmentation.", source: "linkedin" }
    ],
    dealbreakers: ["Superficial know-it-all attitude", "Inability to listen deeply", "Chaotic, undisciplined communication"],
    conversation_starters: [
      "What is a question you wish people asked you more often in conversation?",
      "Pour-over coffee recipe: do you weigh your beans to the tenth of a gram, or go by feel?",
      "What's an insight about human collaboration that took you ten years to learn?"
    ]
  }
];

// Write demo-profiles.json
const demoProfiles = cohort.map(p => ({
  id: p.id,
  name: p.name,
  avatar: p.avatar,
  role: p.role,
  headline: p.role,
  company: p.role.split(',')[1]?.trim() || p.role,
  location: p.location,
  linkedin_url: p.linkedinUrl,
  instagram_url: p.instagramUrl,
  personality_archetype: p.personality_archetype,
  voice_profile: p.voice_profile,
  needs: p.needs,
  hobbies: p.hobbies,
  interests: p.interests,
  dealbreakers: p.dealbreakers,
  conversation_starters: p.conversation_starters,
  status: "ready",
  created_at: new Date().toISOString()
}));

fs.writeFileSync(
  path.resolve(DATA_DIR, 'demo-profiles.json'),
  JSON.stringify(demoProfiles, null, 2),
  'utf-8'
);
console.log(`[Build] Created data/demo-profiles.json with ${demoProfiles.length} rich profiles.`);

// Create initial_people.json for the backend store
const initialPeople = cohort.map(p => ({
  id: p.id,
  name: p.name,
  avatar: p.avatar,
  linkedinUrl: p.linkedinUrl,
  instagramUrl: p.instagramUrl,
  headline: p.role,
  currentRole: p.role.split(',')[0]?.trim() || p.role,
  company: p.role.split(',')[1]?.trim() || "Independent",
  education: "Self-directed & World Class",
  skills: p.interests.map(i => i.interest),
  bio: `${p.personality_archetype}. ${p.voice_profile}`,
  recentPosts: [
    p.needs[0]?.evidence || "Building the future with craft and intentionality.",
    p.needs[1]?.evidence || "Focusing on what truly compounds over decades."
  ],
  instagramBio: `${p.personality_archetype} • ${p.hobbies[0]?.hobby} • ${p.location}`,
  instagramCaptions: p.hobbies.map(h => h.evidence),
  hashtags: p.interests.map(i => `#${i.interest.replace(/\s+/g, '')}`),
  topics: p.interests.map(i => i.interest),
  voicePersona: {
    tone: p.voice_profile.split('.')[0] || "Articulate and authentic",
    pacing: "Deliberate and engaging",
    catchphrases: p.conversation_starters.slice(0, 2),
    styleSummary: p.voice_profile
  },
  analysis: {
    coreNeeds: p.needs.map(n => n.need).join('; '),
    hobbies: p.hobbies.map(h => h.hobby),
    personalityTraits: [p.personality_archetype, "High Agency", "Deep Craft", "Introspective"],
    lifestyleSignals: [p.location, p.needs[0]?.need || "Active"],
    dealbreakers: p.dealbreakers,
    conversationStarters: p.conversation_starters,
    evidenceTags: p.needs.map(n => ({ trait: n.need, quote: n.evidence, source: n.source, type: n.type }))
  }
}));

fs.writeFileSync(
  path.resolve(DATA_DIR, 'initial_people.json'),
  JSON.stringify(initialPeople, null, 2),
  'utf-8'
);
console.log(`[Build] Created data/initial_people.json for store compatibility.`);

// 26 Complete Date Pairings (ensures every single person dates at least 2 other people!)
const datePairings = [
  { a: "pieter-levels", b: "sara-dietschy", scenario: "coffee_chat" },
  { a: "pieter-levels", b: "cleo-abram", scenario: "rooftop_dinner" },
  { a: "marques-brownlee", b: "cleo-abram", scenario: "gallery_walk" },
  { a: "marques-brownlee", b: "austin-evans", scenario: "coffee_chat" },
  { a: "sam-altman", b: "arianna-huffington", scenario: "bookshop_browse" },
  { a: "sam-altman", b: "whitney-wolfe-herd", scenario: "rooftop_dinner" },
  { a: "guillermo-rauch", b: "julie-zhuo", scenario: "gallery_walk" },
  { a: "guillermo-rauch", b: "melanie-perkins", scenario: "coffee_chat" },
  { a: "amjad-masad", b: "grace-beverley", scenario: "farmers_market" },
  { a: "amjad-masad", b: "shaan-puri", scenario: "rooftop_dinner" },
  { a: "whitney-wolfe-herd", b: "brian-chesky", scenario: "gallery_walk" },
  { a: "sara-blakely", b: "gary-vaynerchuk", scenario: "farmers_market" },
  { a: "sara-blakely", b: "alexis-ohanian", scenario: "rooftop_dinner" },
  { a: "alexis-ohanian", b: "codie-sanchez", scenario: "coffee_chat" },
  { a: "brian-chesky", b: "tim-ferriss", scenario: "bookshop_browse" },
  { a: "tim-ferriss", b: "andrew-huberman", scenario: "farmers_market" },
  { a: "melanie-perkins", b: "lenny-rachitsky", scenario: "gallery_walk" },
  { a: "andrew-huberman", b: "steven-bartlett", scenario: "coffee_chat" },
  { a: "shaan-puri", b: "greg-isenberg", scenario: "rooftop_dinner" },
  { a: "julie-zhuo", b: "lenny-rachitsky", scenario: "bookshop_browse" },
  { a: "sahil-bloom", b: "grace-beverley", scenario: "coffee_chat" },
  { a: "sahil-bloom", b: "steven-bartlett", scenario: "farmers_market" },
  { a: "codie-sanchez", b: "gary-vaynerchuk", scenario: "rooftop_dinner" },
  { a: "sara-dietschy", b: "austin-evans", scenario: "bookshop_browse" },
  { a: "arianna-huffington", b: "tim-ferriss", scenario: "gallery_walk" },
  { a: "greg-isenberg", b: "pieter-levels", scenario: "coffee_chat" }
];

const scenarioDetails = {
  coffee_chat: { name: "Artisanal Pour-Over Coffee Chat", location: "Soma Espresso Bar, San Francisco", ambience: "Warm wood counters, vinyl jazz record playing, aroma of light Ethiopian roast" },
  gallery_walk: { name: "Contemporary Art Gallery Walk", location: "Chelsea Gallery District, New York", ambience: "High ceilings, diffuse natural skylight, minimalist concrete floors, evocative sculptures" },
  rooftop_dinner: { name: "Sunset Skyline Rooftop Dinner", location: "Skyline Terrace, Austin", ambience: "Golden hour glow turning to violet dusk, ambient string lights, gentle breeze, craft mocktails" },
  bookshop_browse: { name: "Quiet Independent Bookshop Browse", location: "City Lights Booksellers, North Beach", ambience: "Creaking floorboards, vintage poetry anthologies, quiet reading alcoves, warm desk lamps" },
  farmers_market: { name: "Sunday Morning Organic Farmers Market", location: "Ferry Building Organic Plaza", ambience: "Fresh sourdough loaves, vibrant citrus fruits, cool ocean mist, buzzing acoustic busker" }
};

// Function to generate rich 8-turn date transcript conforming to exact prompt specs
function generateDateRecord(pairing, index) {
  const pA = cohort.find(p => p.id === pairing.a);
  const pB = cohort.find(p => p.id === pairing.b);
  const sc = scenarioDetails[pairing.scenario] || scenarioDetails.coffee_chat;
  const dateId = `date-${pA.id}-x-${pB.id}`;

  const stages = [
    { turn: 1, speaker: pA, listener: pB, stage: "Opening" },
    { turn: 2, speaker: pB, listener: pA, stage: "Opening" },
    { turn: 3, speaker: pA, listener: pB, stage: "Exploring" },
    { turn: 4, speaker: pB, listener: pA, stage: "Exploring" },
    { turn: 5, speaker: pA, listener: pB, stage: "Deepening" },
    { turn: 6, speaker: pB, listener: pA, stage: "Deepening" },
    { turn: 7, speaker: pA, listener: pB, stage: "Decision" },
    { turn: 8, speaker: pB, listener: pA, stage: "Decision" }
  ];

  // Turn chemistry progression
  const baseChem = 70 + ((index * 7) % 24);
  const chemistryScores = [
    baseChem - 6,
    baseChem - 2,
    baseChem + 3,
    baseChem + 6,
    baseChem + 9,
    baseChem + 12,
    baseChem + 14,
    Math.min(98, baseChem + 15)
  ];

  const transcript = [
    {
      turn: 1,
      stage: "Opening",
      speaker: pA.name,
      speakerId: pA.id,
      avatar: pA.avatar,
      dialogue: `Hey ${pB.name.split(' ')[0]}, so great to finally meet in person here at ${sc.location}. I love the atmosphere here—it immediately filters out all the performative noise. I was just admiring how you stay so grounded while building such high-impact work. What was the highlight of your morning today?`,
      thought: `[THOUGHT]: They seem remarkably composed and present. It's refreshing when someone isn't checking their phone five seconds into meeting.`,
      chemistryScore: chemistryScores[0]
    },
    {
      turn: 2,
      stage: "Opening",
      speaker: pB.name,
      speakerId: pB.id,
      avatar: pB.avatar,
      dialogue: `It's wonderful to meet you too, ${pA.name.split(' ')[0]}. Honestly, my morning highlight was a quiet ritual before opening any inbox—just stepping outside to reset my attention. I've always admired your philosophy on ${pA.interests[0]?.interest.toLowerCase() || 'craft'}. How do you personally guard that quiet mental sanctuary when the entire world wants a piece of your schedule?`,
      thought: `[THOUGHT]: The eye contact is real and there's an immediate, effortless conversational cadence. No posturing whatsoever.`,
      chemistryScore: chemistryScores[1]
    },
    {
      turn: 3,
      stage: "Exploring",
      speaker: pA.name,
      speakerId: pA.id,
      avatar: pA.avatar,
      dialogue: `It took me years of burning out to realize that saying no is an act of self-preservation. For me, things like ${pA.hobbies[0]?.hobby.toLowerCase()} aren't just leisure; they're the non-negotiables that keep my baseline intact. But what fascinates me about you is how you balance ambition with ${pB.needs[0]?.need.toLowerCase()}. Do you ever feel like modern success tries to push you away from your natural rhythms?`,
      thought: `[THOUGHT]: We're diving into real substance surprisingly fast. They don't just speak in soundbites; there's genuine lived experience here.`,
      chemistryScore: chemistryScores[2]
    },
    {
      turn: 4,
      stage: "Exploring",
      speaker: pB.name,
      speakerId: pB.id,
      avatar: pB.avatar,
      dialogue: `All the time. There's this relentless cultural pressure to turn every hobby into a business and every friendship into networking. That's why I treat things like ${pB.hobbies[0]?.hobby.toLowerCase()} as sacred territory where metrics don't exist. When you're with someone in your private life, what's the quality that makes you exhale and feel truly at ease?`,
      thought: `[THOUGHT]: That question went straight to the core. I love that they value sacred, unmonetized spaces. That's so rare in our orbit.`,
      chemistryScore: chemistryScores[3]
    },
    {
      turn: 5,
      stage: "Deepening",
      speaker: pA.name,
      speakerId: pA.id,
      avatar: pA.avatar,
      dialogue: `It's emotional safety without having to explain why I need silence. A partner who understands that two people can sit in the same room for hours without saying a word, each immersed in their craft, and that silence feels like love, not distance. I can sense that you don't take on emotional baggage that isn't yours. Have you had to actively unlearn people-pleasing to get to this state of clarity?`,
      thought: `[THOUGHT]: That description of shared silence is exactly what I've craved. There is a deep, resonant calm between us right now.`,
      chemistryScore: chemistryScores[4]
    },
    {
      turn: 6,
      stage: "Deepening",
      speaker: pB.name,
      speakerId: pB.id,
      avatar: pB.avatar,
      dialogue: `Completely. You spend your twenties proving yourself to everyone, and then in your thirties you realize the only currency that matters is peace, health, and intimate truth. Hearing you articulate that shared silence resonates deeply with my core need for ${pB.needs[1]?.need.toLowerCase() || 'authentic presence'}. It's rare to meet someone whose nervous system feels so aligned with mine.`,
      thought: `[THOUGHT]: The emotional temperature just shifted into something intimate. I feel genuinely understood on a level most people never touch.`,
      chemistryScore: chemistryScores[5]
    },
    {
      turn: 7,
      stage: "Decision",
      speaker: pA.name,
      speakerId: pA.id,
      avatar: pA.avatar,
      dialogue: `I completely agree. This date has felt less like an interview and more like picking up a conversation with an old soul I've known for years. As we wrap up our time here, I know our schedules are demanding, but I would genuinely love to see you again—perhaps for a relaxed walk in nature where neither of us brings a phone. What do you think?`,
      thought: `[THOUGHT]: I'm definitely saying yes. The values alignment and conversational reciprocity are exceptional.`,
      chemistryScore: chemistryScores[6]
    },
    {
      turn: 8,
      stage: "Decision",
      speaker: pB.name,
      speakerId: pB.id,
      avatar: pB.avatar,
      dialogue: `A phone-free nature walk sounds like the absolute dream, ${pA.name.split(' ')[0]}. You've brought out a calm, thoughtful side of me this evening that I cherish. I'm leaving this date feeling energized, inspired, and very eager to see where this connection leads. Count me in.`,
      thought: `[THOUGHT]: 10/10. No hesitation. High agency, deep emotional warmth, and zero games. I would meet again in a heartbeat.`,
      chemistryScore: chemistryScores[7]
    }
  ];

  // Assessments
  const wouldMeetA = (8.5 + ((index * 3) % 15) / 10).toFixed(1);
  const chemA = (8.0 + ((index * 4) % 18) / 10).toFixed(1);
  const valuesA = (8.8 + ((index * 2) % 12) / 10).toFixed(1);
  const lifeA = (8.2 + ((index * 5) % 16) / 10).toFixed(1);

  const wouldMeetB = (8.7 + ((index * 2) % 13) / 10).toFixed(1);
  const chemB = (8.2 + ((index * 3) % 17) / 10).toFixed(1);
  const valuesB = (9.0 + ((index * 1) % 10) / 10).toFixed(1);
  const lifeB = (8.0 + ((index * 4) % 18) / 10).toFixed(1);

  const meanOtherA = (parseFloat(chemA) + parseFloat(valuesA) + parseFloat(lifeA)) / 3;
  const meanOtherB = (parseFloat(chemB) + parseFloat(valuesB) + parseFloat(lifeB)) / 3;

  const viewA = 0.7 * (parseFloat(wouldMeetA) * 10) + 0.3 * (meanOtherA * 10);
  const viewB = 0.7 * (parseFloat(wouldMeetB) * 10) + 0.3 * (meanOtherB * 10);
  const judgeFit = Math.min(96, Math.max(76, Math.round((viewA + viewB) / 2 + (index % 5))));

  // Final score formula: 0.4 * view_A + 0.4 * view_B + 0.2 * judge_mutual_fit
  const finalScore = Math.round(0.4 * viewA + 0.4 * viewB + 0.2 * judgeFit);

  return {
    id: dateId,
    agent_a_id: pA.id,
    agent_b_id: pB.id,
    person1Id: pA.id,
    person2Id: pB.id,
    person1: { id: pA.id, name: pA.name, avatar: pA.avatar, role: pA.role },
    person2: { id: pB.id, name: pB.name, avatar: pB.avatar, role: pB.role },
    scenario: pairing.scenario,
    scenarioDetails: sc,
    transcript,
    chemistry_scores: chemistryScores,
    scores: {
      overall: finalScore,
      chemistry: Math.round(parseFloat(chemA)),
      sharedInterests: Math.round(parseFloat(valuesA)),
      lifestyle: Math.round(parseFloat(lifeA)),
      conversation: Math.round(parseFloat(wouldMeetA))
    },
    agent_a_verdict: {
      chemistry: parseFloat(chemA),
      valuesAlignment: parseFloat(valuesA),
      lifestyleFit: parseFloat(lifeA),
      wouldMeetAgain: parseFloat(wouldMeetA),
      viewScore: Math.round(viewA),
      rationale: `${pB.name.split(' ')[0]} displayed exceptional emotional maturity and an authentic conversational rhythm. Their focus on ${pB.hobbies[0]?.hobby.toLowerCase()} and refusal to engage in corporate small talk aligned seamlessly with my values.`
    },
    agent_b_verdict: {
      chemistry: parseFloat(chemB),
      valuesAlignment: parseFloat(valuesB),
      lifestyleFit: parseFloat(lifeB),
      wouldMeetAgain: parseFloat(wouldMeetB),
      viewScore: Math.round(viewB),
      rationale: `${pA.name.split(' ')[0]} brought a grounded, vulnerable energy that immediately put me at ease. The mutual appreciation for uninterrupted focus and intentional living made this date feel effortless.`
    },
    judge_verdict: {
      mutualFit: judgeFit,
      rationale: `Neutral Judge Evaluation: The conversation exhibited high reciprocity, emotional candor, and deep respect for individual autonomy. Both agents successfully navigated from superficial opening pleasantries to core values within four turns without friction.`,
      citedEvidence: [
        `Turn 3: "${transcript[2].dialogue.slice(0, 80)}..." highlights shared boundary protection against burnout.`,
        `Turn 5: "${transcript[4].dialogue.slice(0, 85)}..." demonstrates profound mutual desire for peaceful, non-demanding companionship.`,
        `Turn 8: Reciprocal enthusiastic agreement on a phone-free follow-up date validates genuine mutual attraction.`
      ]
    },
    final_score: finalScore,
    status: "completed",
    created_at: new Date(Date.now() - index * 3600000 * 6).toISOString()
  };
}

const demoDates = datePairings.map((pairing, idx) => generateDateRecord(pairing, idx));

fs.writeFileSync(
  path.resolve(DATA_DIR, 'demo-dates.json'),
  JSON.stringify(demoDates, null, 2),
  'utf-8'
);
console.log(`[Build] Created data/demo-dates.json with ${demoDates.length} rich 8-turn dates.`);

// Create data/db.json with full store state
const dbData = {
  profiles: initialPeople,
  dates: demoDates,
  memories: {},
  rankings: {}
};

// Seed memories for agents
cohort.forEach(p => {
  dbData.memories[p.id] = [
    {
      id: `mem-${p.id}-voice`,
      key: `person_${p.id}_voice`,
      value: p.voice_profile,
      context: { type: "voice_profile" },
      timestamp: new Date().toISOString()
    },
    {
      id: `mem-${p.id}-needs`,
      key: `person_${p.id}_needs`,
      value: p.needs.map(n => n.need).join(' | '),
      context: { type: "core_needs" },
      timestamp: new Date().toISOString()
    }
  ];
});

fs.writeFileSync(
  path.resolve(DATA_DIR, 'db.json'),
  JSON.stringify(dbData, null, 2),
  'utf-8'
);
console.log(`[Build] Successfully wrote data/db.json with ${initialPeople.length} profiles, ${demoDates.length} completed dates, and Mem0 memories.`);
