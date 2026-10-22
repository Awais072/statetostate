import { PrismaClient, Role, PostStatus, CommentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database initialization status...");

  // 1. Check if database already has posts to prevent wiping production data
  const postCount = await prisma.post.count().catch(() => 0);
  if (postCount > 0) {
    console.log(`Database already contains ${postCount} posts. Preserving live production data.`);
    return;
  }

  // 2. Create Admin User
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME || "StateToState Admin",
      email: (process.env.ADMIN_EMAIL || "admin@statetostate.com").toLowerCase(),
      passwordHash,
      role: Role.ADMIN,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Editor-in-Chief at StateToState. Writing at the intersection of breakthrough technology, mobility revolutions, modern architecture, and contemporary culture.",
    },
  });

  const staffAuthor = await prisma.user.create({
    data: {
      name: "Marcus Vance",
      email: "marcus@statetostate.com",
      passwordHash,
      role: Role.AUTHOR,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Senior Markets & Automotive Correspondent at StateToState. Obsessed with battery chemistry, clean tech, and macro real estate cycles.",
    },
  });

  console.log(`Created admin user: ${admin.email}`);

  // 3. Create Core Categories
  const catTech = await prisma.category.create({
    data: {
      name: "Tech & Startups",
      slug: "tech-startups",
      description: "Cutting-edge artificial intelligence, venture capital rounds, developer ecosystems, and disruptive startups.",
      color: "#3b82f6",
    },
  });

  const catPop = await prisma.category.create({
    data: {
      name: "Celebrities & Pop Culture",
      slug: "celebrities-pop-culture",
      description: "The modern zeitgeist, film retrospectives, streaming wars, music trends, and cultural shifts.",
      color: "#ec4899",
    },
  });

  const catEV = await prisma.category.create({
    data: {
      name: "Electric Vehicles (EVs) & Automotive",
      slug: "electric-vehicles-automotive",
      description: "Next-gen solid-state battery tech, autonomous driving systems, charging networks, and hypercars.",
      color: "#10b981",
    },
  });

  const catRealEstate = await prisma.category.create({
    data: {
      name: "Real Estate & Market News",
      slug: "real-estate-market-news",
      description: "Macro housing dynamics, commercial real estate transformations, interest rate trajectories, and architectural marvels.",
      color: "#f59e0b",
    },
  });

  console.log("Created 4 core categories");

  // 4. Create Tags
  const tagList = [
    { name: "Artificial Intelligence", slug: "artificial-intelligence" },
    { name: "Venture Capital", slug: "venture-capital" },
    { name: "Autonomous Driving", slug: "autonomous-driving" },
    { name: "Battery Tech", slug: "battery-tech" },
    { name: "Commercial Real Estate", slug: "commercial-real-estate" },
    { name: "Architecture", slug: "architecture" },
    { name: "Cinema & Streaming", slug: "cinema-streaming" },
    { name: "Digital Culture", slug: "digital-culture" },
    { name: "Green Energy", slug: "green-energy" },
    { name: "Macroeconomics", slug: "macroeconomics" },
  ];

  const createdTags: Record<string, string> = {};
  for (const t of tagList) {
    const created = await prisma.tag.create({ data: t });
    createdTags[t.slug] = created.id;
  }
  console.log(`Created ${tagList.length} tags`);

  // 5. Create Posts across all 4 core niches
  const postsData = [
    {
      title: "The Agentic AI Paradigm: How Autonomous Software Is Reshaping Early-Stage Startups",
      slug: "agentic-ai-paradigm-early-stage-startups",
      excerpt: "Why the next generation of billion-dollar technology ventures will be founded by two-person teams orchestrating fleets of autonomous AI engineers.",
      content: `The paradigm of artificial intelligence has irrevocably pivoted. Over the last three years, the industry was captivated by conversational Large Language Models—systems designed to predict the next token in a conversational interface. Today, however, the frontier has moved toward **agentic workflows**: autonomous systems capable of reasoning, planning multi-step objectives, self-correcting errors, and executing real-world code.

## The Micro-Team Revolution

In traditional software development, scaling from prototype to product-market fit demanded engineering squads, product managers, DevOps architects, and QA testers. In 2026, venture firms like Sequoia and Benchmark are backing teams of two or three founders who generate seven-figure recurring revenue within months of inception.

How is this possible? By treating AI agents not as autocomplete copilots, but as tireless asynchronous contributors:

- **Autonomous Code Generation & Test Driven Development**: Agents generate unit tests from user stories, author minimal implementations, run test suites, inspect stack traces, and iterate until 100% green.
- **Continuous Observability**: Synthetic agents monitor production logs, identify memory leaks or edge cases, synthesize hotfix pull requests, and deploy canary builds without human intervention.
- **Hyper-Tailored Onboarding**: Startups are writing personalized sales engineering scripts generated in real time as enterprise leads interact with their landing pages.

> "We are witnessing the emergence of the 100x engineer, not because a single human writes 100x more lines of code, but because they orchestrate 100 agents executing in parallel."

## The Shift in Venture Capital Evaluation

Venture capitalists are shifting their evaluation frameworks:
1. **Agent-to-Human Leverage Ratio**: Investors evaluate how many autonomous loops run concurrently per full-time employee.
2. **Proprietary Data Moats**: Raw compute is a commodity. What matters is domain-specific feedback telemetry that refines agent prompts and fine-tuned weights.
3. **Execution Velocity**: Speed is the single defensible moat. Teams shipping daily autonomous updates outpace legacy incumbents bound to bi-weekly sprint rituals.

As we look toward the remainder of 2026, the question is no longer whether AI can write production software—it is how quickly legacy tech architectures can adapt before agile, agent-driven contenders replace them completely.`,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      readingTime: 4,
      views: 3420,
      featured: true,
      trending: true,
      metaTitle: "The Agentic AI Paradigm: Autonomous Software & Startups",
      metaDesc: "Explore how autonomous AI agents and micro-teams are disrupting early-stage software startups and modern venture capital paradigms.",
      focusKeyword: "Agentic AI Startups",
      canonicalUrl: "https://statetostate.com/blog/agentic-ai-paradigm-early-stage-startups",
      authorId: admin.id,
      categoryId: catTech.id,
      tagSlugs: ["artificial-intelligence", "venture-capital"],
    },
    {
      title: "Solid-State Batteries in 2026: The EV Range and Charging Breakthrough We Waited For",
      slug: "solid-state-batteries-ev-range-charging-breakthrough",
      excerpt: "Pilot production lines from major automakers are finally proving that 800-mile ranges and 10-minute 10-to-80% charges are no longer laboratory pipe dreams.",
      content: `For over a decade, solid-state battery technology was perpetually described as being "five years away." In 2026, however, the automotive world reached a genuine tipping point. Pilot production lines in Japan, Germany, and North America are rolling out functional sulfide- and oxide-based electrolyte cells in commercial verification vehicles.

## The Chemistry That Changes Everything

Conventional lithium-ion batteries rely on flammable liquid or gel electrolytes. While energy densities have improved steadily, they face fundamental thermodynamic and safety limits that require heavy cooling packs and protective armor.

Solid-state cells replace volatile liquid electrolytes with solid ceramics, polymers, or sulfidic compounds:

- **Gravimetric Energy Density Exceeding 450 Wh/kg**: Nearly double that of premium ternary lithium batteries currently on highways.
- **Thermal Invariance**: Drastically reduced risk of thermal runaway, eliminating several hundred kilograms of bulky liquid-glycol coolant systems.
- **Ultra-Fast Ionic Transport**: Safe 10C charge rates allowing true 10-minute replenishment without dendrite formation destroying the anode.

| Metric | Traditional Li-ion (NMC 811) | 2026 Solid-State Pilot |
| :--- | :--- | :--- |
| Energy Density | ~270 Wh/kg | 460 - 500 Wh/kg |
| 10-80% Charge Time | 22 - 35 mins | 8 - 12 mins |
| Cycle Life | 1,200 - 1,500 cycles | 2,500+ cycles |
| Thermal Stability | Up to 150°C | Up to 400°C |

## Real-World Implications for Drivers

What does this mean for the everyday consumer?
Range anxiety is eliminated. With 700 to 900 miles of highway range per charge, long-distance road trips will no longer require meticulous charging stop planning. A standard rest stop to stretch legs and grab an espresso will replenish enough energy to drive another 500 miles.

Furthermore, commercial fleet operators—from long-haul semi-trucks to delivery vans—will achieve total cost of ownership parity with diesel years ahead of previous projections.`,
      coverImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      readingTime: 5,
      views: 2890,
      featured: true,
      trending: false,
      metaTitle: "Solid-State Batteries: 2026 EV Range Breakthrough",
      metaDesc: "Comprehensive technical analysis of solid-state EV batteries, 800-mile real-world ranges, and 10-minute ultra-fast charging architectures.",
      focusKeyword: "Solid-State Batteries EV",
      canonicalUrl: "https://statetostate.com/blog/solid-state-batteries-ev-range-charging-breakthrough",
      authorId: staffAuthor.id,
      categoryId: catEV.id,
      tagSlugs: ["battery-tech", "green-energy", "autonomous-driving"],
    },
    {
      title: "Commercial Real Estate Repurposing: Converting Empty Office Towers into Biophilic Urban Living",
      slug: "commercial-real-estate-repurposing-office-towers-urban-living",
      excerpt: "How forward-thinking architects and urban developers are overcoming floorplate hurdles to transform vacant corporate monoliths into vibrant vertical communities.",
      content: `The transformation of global downtown cores continues to accelerate. Remote and hybrid work arrangements have permanently altered office occupancy patterns in cities from Manhattan to London and Tokyo. Facing rising vacancy rates and maturing CMBS debt maturities, institutional developers are initiating the most ambitious adaptive reuse projects in modern architectural history.

## The Floorplate Challenge

Converting high-rise corporate office structures into residential apartments is rarely straightforward:

1. **Deep Core Darkness**: Modern glass office towers often have deep 40-to-60 foot distances between the window perimeter and the elevator core. Residential code mandates that every legal bedroom possess operable exterior windows and natural daylight.
2. **Plumbing and HVAC Stacks**: Office buildings feature centralized restroom banks on each floor. Converting them into residential units requires drilling thousands of new vertical penetrations through post-tensioned concrete slabs to accommodate private bathrooms and kitchens.

## Innovative Architectural Solutions

Pioneering architectural firms are solving these architectural dilemmas with radical creativity:

- **Carving Interior Atriums**: Developers are slicing out center cores to install lush, multi-story biophilic garden atriums. These interior courtyards inject indirect natural light and fresh airflow deep into previously unusable interior spaces.
- **Mixed-Use Hybrid Ecosystems**: Instead of 100% residential conversions, floors 2 through 6 are transformed into urban farming greenhouses, co-working lounges, childcare centers, and wellness spas, while upper floors provide sunlit residential lofts.
- **Modular Pre-Fabricated Wet Cores**: Pre-engineered bathroom and kitchen pods built offsite are craned into open floors, drastically reducing construction timelines and labor expenses.

> "We are not merely converting offices; we are redefining the vertical neighborhood. Downtown is transitioning from an 8-hour workday commuter destination into a 24-hour walkable cultural biosphere."

As interest rates normalize and municipal tax abatements for adaptive reuse take effect, commercial real estate is transitioning from an existential crisis into an architectural renaissance.`,
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 52),
      readingTime: 6,
      views: 1940,
      featured: false,
      trending: true,
      metaTitle: "Office-to-Residential Conversions: Commercial Real Estate Rebirth",
      metaDesc: "Discover how innovative architecture and adaptive reuse are converting vacant downtown office towers into biophilic urban residential spaces.",
      focusKeyword: "Commercial Real Estate Repurposing",
      canonicalUrl: "https://statetostate.com/blog/commercial-real-estate-repurposing-office-towers-urban-living",
      authorId: staffAuthor.id,
      categoryId: catRealEstate.id,
      tagSlugs: ["commercial-real-estate", "architecture", "macroeconomics"],
    },
    {
      title: "The Streaming Wars Endgame: Why Hollywood Is Returning to Cinematic Prestige and Scarcity",
      slug: "streaming-wars-endgame-hollywood-cinema-prestige",
      excerpt: "After spending billions on subscriber acquisition through disposable volume, major entertainment studios are embracing theatrical windows and bespoke curation.",
      content: `For nearly eight years, the entertainment landscape was ruled by an all-consuming mandate: produce boundless quantities of content to fuel perpetual monthly streaming subscription growth. In pursuit of sheer algorithm engagement, studios greenlit \$200 million franchise spinoffs and high-concept miniseries at an unsustainable velocity.

In 2026, the era of frictionless peak streaming has reached its inevitable reckoning.

## The Death of the 'Infinite Scroll' Content Model

Audiences have grown weary of algorithm-driven mediocrity. When every entertainment provider releases dozen-episode series weekly that disappear from public memory within forty-eight hours, cultural impact evaporates.

Leading studios are pivoting toward a model centered on three pillars:

- **Restoration of Theatrical Exclusivity**: 90-to-120 day theatrical release windows are back. Box office receipts remain the strongest signal of cultural prestige, generating organic word-of-mouth that digital home releases can never duplicate.
- **Physical Media Resurgence**: Audiences and cinephiles are purchasing 4K Ultra HD Blu-rays in record numbers to protect access to their favorite films against streaming license expirations and retrospective edits.
- **Bespoke Curation over Algorithmic Bloat**: Studios are discovering that a single masterwork with auteur vision commands more consumer loyalty than fifty generic procedural dramas.

## The Cultural Impact of Shared Experiences

Cinema was built on collective emotional resonance—a packed theater reacting in unison to a plot twist or symphonic score. By re-centering the cinematic theatrical window, filmmakers regain the stature that fragmented streaming viewing diluted.

The entertainment industry is not dying; it is shedding the speculative excess of the streaming gold rush and rediscovering the timeless power of theatrical prestige.`,
      coverImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 80),
      readingTime: 4,
      views: 4120,
      featured: false,
      trending: true,
      metaTitle: "Streaming Wars Endgame: Hollywood's Return to Cinematic Prestige",
      metaDesc: "An analysis of Hollywood's strategic retreat from endless streaming bloat and its renewed commitment to theatrical prestige and physical scarcity.",
      focusKeyword: "Streaming Wars Cinema",
      canonicalUrl: "https://statetostate.com/blog/streaming-wars-endgame-hollywood-cinema-prestige",
      authorId: admin.id,
      categoryId: catPop.id,
      tagSlugs: ["cinema-streaming", "digital-culture"],
    },
    {
      title: "Autonomous Fleet Economics: How Robotaxis Are Redefining Urban Mobility in Tier-1 Metros",
      slug: "autonomous-fleet-economics-robotaxis-urban-mobility",
      excerpt: "Real-world revenue data from Phoenix, San Francisco, and Austin reveals the inflection point where autonomous ride-hailing becomes cheaper than private vehicle ownership.",
      content: `The theoretical debates regarding autonomous vehicles have yielded to empirical economic realities. In major metropolitan test markets across the Sun Belt and West Coast, commercial driverless fleets have quietly surpassed millions of fully autonomous passenger miles.

## The Cost per Mile Crossover

The economics of private car ownership are notoriously inefficient:
- The average personal automobile sits parked 95% of its lifespan.
- Depreciation, insurance premiums, maintenance, and parking easily exceed \$0.85 per driven mile for mid-size sedans.

In contrast, commercial robotaxi operations are nearing an operational milestone:
1. **Zero Driver Labor Costs**: While safety monitors were previously required, mature driverless clusters operate with remote fleet management oversight at a 1:20 vehicle-to-operator ratio.
2. **Continuous Asset Utilization**: Autonomous electric vehicles operate 18 hours per day, only pausing for automated depot cleaning and high-speed inductive charging during off-peak power rate windows.
3. **Sub-\$0.40 Marginal Cost per Passenger Mile**: Once amortized over 400,000 miles, robotaxi rides undercut traditional rideshare fares by more than 60%.

As urban zoning laws progressively reduce mandatory parking minimums, the transition from personal car ownership to on-demand autonomous fleets is becoming a standard financial decision for urbanites.`,
      coverImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
      readingTime: 5,
      views: 1780,
      featured: false,
      trending: false,
      metaTitle: "Autonomous Fleet Economics: The Robotaxi Tipping Point",
      metaDesc: "Economic breakdown of autonomous driverless ride-hailing fleets and the cost-per-mile comparison with private automobile ownership.",
      focusKeyword: "Autonomous Robotaxis Economics",
      canonicalUrl: "https://statetostate.com/blog/autonomous-fleet-economics-robotaxis-urban-mobility",
      authorId: staffAuthor.id,
      categoryId: catEV.id,
      tagSlugs: ["autonomous-driving", "green-energy", "macroeconomics"],
    },
    {
      title: "The Architecture of Sanctuary: Minimalist Retreats and the Psychology of Silence",
      slug: "architecture-of-sanctuary-minimalist-retreats-psychology-of-silence",
      excerpt: "Why modern luxury home buyers are abandoning maximalist smart-home automation in favor of tactile natural materials, acoustic buffering, and analog tranquility.",
      content: `In an era defined by ubiquitous notifications, ambient digital noise, and hyper-connected devices, a quiet revolution is taking hold in residential architecture. Discerning homeowners are turning away from gadget-saturated 'smart homes' filled with touchscreens and voice assistants. Instead, they are commissioning sanctuaries designed around a singular luxury: sensory peace.

## Reclaiming the Senses Through Natural Materials

The aesthetic of the new sanctuary is characterized by Japanese and Scandinavian principles—warm minimalism that prioritizes tactile connection:

- **Unfinished Timber and Rammed Earth**: Porous, raw materials that breathe, balance ambient humidity, and patina gracefully over generations.
- **Acoustic Massing**: Thick aerated limestone walls, heavy acoustic drapery, and hidden air-locks that eliminate exterior traffic decibels, lowering resting heart rates.
- **Circadian Daylighting**: Skylights and deep recessed clerestory openings designed to track the sun's azimuth without glare, gently signaling melatonin cycles.

When the home ceases to be a conduit for digital stimulus, it becomes what it was always intended to be: a profound refuge for contemplation and rejuvenation.`,
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 160),
      readingTime: 4,
      views: 2210,
      featured: false,
      trending: false,
      metaTitle: "The Architecture of Sanctuary: Minimalist Luxury Homes",
      metaDesc: "Exploring minimalist residential architecture, acoustic serenity, and natural tactile materials for peaceful modern living.",
      focusKeyword: "Minimalist Sanctuary Architecture",
      canonicalUrl: "https://statetostate.com/blog/architecture-of-sanctuary-minimalist-retreats-psychology-of-silence",
      authorId: admin.id,
      categoryId: catRealEstate.id,
      tagSlugs: ["architecture", "commercial-real-estate"],
    },
    {
      title: "Drafting the Future: Next-Gen Quantum Neural Architectures (Draft)",
      slug: "drafting-the-future-quantum-neural-architectures",
      excerpt: "An internal research preview analyzing theoretical quantum speedups in multi-modal transformer training pipelines.",
      content: `This article is currently an unreleased draft undergoing peer review by our research team. It examines the theoretical convergence of quantum annealing with generative transformer layers.`,
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.DRAFT,
      publishedAt: null,
      readingTime: 2,
      views: 0,
      featured: false,
      trending: false,
      metaTitle: "Quantum Neural Architectures: Research Preview",
      metaDesc: "Research preview exploring quantum transformer speedups.",
      focusKeyword: "Quantum AI",
      canonicalUrl: null,
      authorId: admin.id,
      categoryId: catTech.id,
      tagSlugs: ["artificial-intelligence"],
    },
  ];

  for (const postItem of postsData) {
    const { tagSlugs, ...postDetails } = postItem;
    const post = await prisma.post.create({
      data: {
        ...postDetails,
      },
    });

    // Link Tags
    for (const slug of tagSlugs) {
      const tagId = createdTags[slug];
      if (tagId) {
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId,
          },
        });
      }
    }

    // Add sample comments to published posts
    if (post.status === PostStatus.PUBLISHED) {
      await prisma.comment.create({
        data: {
          postId: post.id,
          authorName: "Elena Rostova",
          authorEmail: "elena@example.com",
          content: "Remarkable breakdown! The implications for both engineering leverage and startup capital efficiency are spot on.",
          status: CommentStatus.APPROVED,
        },
      });

      await prisma.comment.create({
        data: {
          postId: post.id,
          authorName: "David Sterling",
          authorEmail: "david.s@example.com",
          content: "I've been tracking these developments closely. The transition to biophilic and acoustic design is already visible in top architectural bids.",
          status: CommentStatus.APPROVED,
        },
      });
    }
  }

  // 6. Seed Newsletter Subscribers
  const sampleSubscribers = [
    "sarah.connor@example.com",
    "alex.thorne@example.com",
    "charlotte.bronte@example.com",
    "investor@venturelabs.io",
  ];

  for (const email of sampleSubscribers) {
    await prisma.newsletterSubscriber.create({
      data: { email },
    });
  }

  console.log("Database seeded successfully with users, categories, tags, posts, comments, and subscribers!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
