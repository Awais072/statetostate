import { PrismaClient, Role, PostStatus, CommentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting StateToState U.S. State News taxonomy migration & seeding...");

  // 1. Create / Upsert Admin User
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@statetostate.com").toLowerCase();

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      bio: "Editor-in-Chief at StateToState. Covering statehouse legislation, regional economies, infrastructure modernization, and governance across the United States.",
    },
    create: {
      name: process.env.ADMIN_NAME || "StateToState Admin",
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Editor-in-Chief at StateToState. Covering statehouse legislation, regional economies, infrastructure modernization, and governance across the United States.",
    },
  });

  const staffEmail = "marcus@statetostate.com";
  const staffAuthor = await prisma.user.upsert({
    where: { email: staffEmail },
    update: {
      bio: "Senior State Politics & Economics Correspondent at StateToState. Specializing in interstate commerce, energy grids, and municipal fiscal policy.",
    },
    create: {
      name: "Marcus Vance",
      email: staffEmail,
      passwordHash,
      role: Role.AUTHOR,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Senior State Politics & Economics Correspondent at StateToState. Specializing in interstate commerce, energy grids, and municipal fiscal policy.",
    },
  });

  console.log(`Verified admin (${admin.email}) and staff correspondent (${staffAuthor.email}).`);

  // 2. Upsert the 5 U.S. State News Categories
  const stateCategoriesData = [
    {
      name: "California",
      slug: "california",
      description: "Breaking state news, legislative developments in Sacramento, environmental policy, economic shifts, and community reporting from across the Golden State.",
      color: "#f59e0b",
    },
    {
      name: "Texas",
      slug: "texas",
      description: "Comprehensive state news, energy corridor developments, business expansion, border affairs, and legislative coverage from the Lone Star State.",
      color: "#ef4444",
    },
    {
      name: "Florida",
      slug: "florida",
      description: "State governance in Tallahassee, coastal infrastructure resilience, property insurance frameworks, and economic growth across the Sunshine State.",
      color: "#f97316",
    },
    {
      name: "New York",
      slug: "new-york",
      description: "Albany legislative affairs, statewide fiscal policies, transit modernization, healthcare funding, and regional coverage throughout New York State.",
      color: "#3b82f6",
    },
    {
      name: "Other States",
      slug: "other-states",
      description: "Essential state-level reporting, gubernatorial initiatives, and legislative dispatches from Midwest, Western, Southern, and Northeastern statehouses.",
      color: "#8b5cf6",
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of stateCategoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        color: cat.color,
      },
      create: cat,
    });
    categoryMap[cat.slug] = record.id;
  }
  console.log("Upserted 5 core U.S. State News categories (California, Texas, Florida, New York, Other States).");

  // 3. Upsert State News Tags
  const stateTags = [
    { name: "State Legislation", slug: "state-legislation" },
    { name: "Economic Development", slug: "economic-development" },
    { name: "Infrastructure", slug: "infrastructure" },
    { name: "Public Policy", slug: "public-policy" },
    { name: "Clean Energy", slug: "clean-energy" },
    { name: "Housing & Insurance", slug: "housing-insurance" },
    { name: "Public Safety", slug: "public-safety" },
    { name: "Healthcare", slug: "healthcare" },
    { name: "Manufacturing", slug: "manufacturing" },
    { name: "Interstate Affairs", slug: "interstate-affairs" },
  ];

  const tagMap: Record<string, string> = {};
  for (const t of stateTags) {
    const record = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: t,
    });
    tagMap[t.slug] = record.id;
  }
  console.log(`Upserted ${stateTags.length} state news tags.`);

  // 4. Reassign and remove legacy categories if any exist
  const legacySlugs = [
    "tech-startups",
    "celebrities-pop-culture",
    "electric-vehicles-automotive",
    "real-estate-market-news",
  ];

  const legacyCategories = await prisma.category.findMany({
    where: { slug: { in: legacySlugs } },
  });

  if (legacyCategories.length > 0) {
    console.log(`Found ${legacyCategories.length} legacy non-state categories. Cleaning up...`);
    for (const legacy of legacyCategories) {
      // Reassign any existing posts in legacy category to "Other States"
      await prisma.post.updateMany({
        where: { categoryId: legacy.id },
        data: { categoryId: categoryMap["other-states"] },
      });
      // Delete the legacy category
      await prisma.category.delete({
        where: { id: legacy.id },
      });
      console.log(`Deleted legacy category: ${legacy.name}`);
    }
  }

  // 5. Seed / Upsert Curated U.S. State News Articles
  const articles = [
    {
      title: "California Unveils Landmark 2026 Water Infrastructure and Clean Energy Grid Overhaul",
      slug: "california-water-infrastructure-clean-energy-grid-overhaul",
      excerpt: "Sacramento lawmakers and the Governor reach a historic bipartisan accord establishing a multi-billion-dollar fund for Central Valley aqueduct retrofits, inland reservoir expansion, and coastal desalination.",
      content: `In an extraordinary joint press conference in Sacramento this morning, California legislative leadership and the Governor announced final passage of the Comprehensive State Water & Energy Resiliency Act. The landmark measure commits dedicated capital over the next decade to fortify the state's most critical lifeline networks.

## Re-Engineering the Central Valley Water Corridors

The cornerstone of the legislative package targets California's aging water conveyance network:

- **State Water Project Canal Relining**: More than 140 miles of subsidence-damaged canal infrastructure will receive geotextile liners and automated weir gates, eliminating billions of gallons in annual seepage loss.
- **Off-Stream Storage Acceleration**: The state has fast-tracked environmental permitting for the proposed Sites Reservoir in Colusa County, scheduled to store 1.5 million acre-feet of winter storm runoff without damming active riverways.
- **Municipal Desalination Standards**: Clean energy powered coastal desalination standards were formalized, establishing a streamlined permit pathway for facilities using co-located offshore wind generation.

> "Water security is not a partisan talking point in California—it is the foundation of our agricultural productivity, our ecological stewardship, and our municipal survival," noted Senate leadership during the floor debate.

## Synchronizing the Renewable Power Grid

Simultaneously, the legislation creates direct statutory incentives for long-duration iron-air and pumped hydro energy storage. As California regularly exceeds 100% midday solar capacity, the new transmission corridors will channel surplus electricity directly into agricultural pumping districts, effectively converting farm irrigation pumps into flexible grid stabilizers.

With initial bond allocations releasing early next quarter, local irrigation districts and municipal water agencies across all 58 counties are preparing infrastructure bids.`,
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-10-23T08:00:00Z"),
      readingTime: 4,
      views: 3120,
      featured: true,
      trending: true,
      metaTitle: "California Water Infrastructure and Clean Energy Grid Overhaul",
      metaDesc: "Comprehensive analysis of California's landmark 2026 legislation modernizing Central Valley canals, reservoir storage, and renewable grid integration.",
      focusKeyword: "California Water Infrastructure",
      canonicalUrl: "https://statetostate.vercel.app/blog/california-water-infrastructure-clean-energy-grid-overhaul",
      authorId: admin.id,
      categoryId: categoryMap["california"],
      tagSlugs: ["infrastructure", "clean-energy", "state-legislation"],
    },
    {
      title: "Texas Semiconductor Surge: Austin and Dallas Lead National Expansion of Advanced Microchip Fabrication",
      slug: "texas-semiconductor-manufacturing-surge-austin-dallas",
      excerpt: "Supported by the Texas CHIPS Act and robust state grid expansion, Texas captures the lion's share of domestic advanced microchip manufacturing facilities.",
      content: `The Texas high-technology corridor between Williamson County and North Texas is experiencing the largest industrial building boom in state history. Major global semiconductor manufacturers have officially broken ground on expanded sub-2-nanometer silicon fabrication plants across the Lone Star State.

## Why Chipmakers Are Doubling Down on Texas

Industry executives cite several decisive state-level advantages that catalyzed their investment decisions:

1. **State Enterprise and CHIPS Fund Grants**: Texas authorized swift capital outlays from the state's dedicated semiconductor consortium fund, matching federal grants dollar-for-dollar.
2. **Dedicated Industrial Energy Siting**: The state utility commission and ERCOT approved microgrid interconnects paired with onsite utility-scale battery banks, guaranteeing 99.999% uptime for delicate cleanroom operations.
3. **University Research Partnerships**: The University of Texas at Austin and Texas A&M have coordinated engineering curricula to graduate over 4,000 specialized lithography technicians annually.

> "Texas is demonstrating that aggressive state economic development paired with deep infrastructural investment creates an unbeatable environment for foundational American manufacturing," said regional economic development commissioners.

With high-paying engineering positions multiplying across Central Texas, municipal authorities in surrounding counties are advancing roadway expansions and suburban transit links to support the swelling regional workforce.`,
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-10-22T14:30:00Z"),
      readingTime: 5,
      views: 2840,
      featured: false,
      trending: true,
      metaTitle: "Texas Semiconductor Manufacturing Surge: Austin and Dallas",
      metaDesc: "How the Texas CHIPS Act and energy grid innovations made the Lone Star State the premier domestic semiconductor manufacturing capital.",
      focusKeyword: "Texas Semiconductor Manufacturing",
      canonicalUrl: "https://statetostate.vercel.app/blog/texas-semiconductor-manufacturing-surge-austin-dallas",
      authorId: staffAuthor.id,
      categoryId: categoryMap["texas"],
      tagSlugs: ["economic-development", "manufacturing", "state-legislation"],
    },
    {
      title: "Florida Property Insurance Reform: How New State Mechanisms Are Stabilizing Coastal Homeowners",
      slug: "florida-property-insurance-reform-coastal-homeowners",
      excerpt: "State reinsurance expansions, mandatory storm-mitigation discounts, and tort reforms show initial measurable success in stabilizing Florida's residential property market.",
      content: `Two years after the Florida Legislature passed sweeping property insurance reforms during back-to-back special sessions in Tallahassee, fresh data released by the Florida Office of Insurance Regulation indicates that the state's residential insurance crisis is beginning to level out.

## Key Drivers of Market Stabilization

State officials credit three interconnected policy pillars for attracting private risk capital back into the Sunshine State:

- **The Florida Optional Reinsurance Assistance Program**: State-backed reinsurance tranches allowed small and mid-sized domestic carriers to secure affordable catastrophe backstops without passing punitive rate hikes onto consumers.
- **Tort Reform and Bad-Faith Claim Limits**: Legal reforms curtailing one-way attorney fee shifting dramatically reduced frivolous claim litigation, which previously consumed up to 70% of industry loss expenses nationwide.
- **My Safe Florida Home Grant Expansion**: Tens of thousands of homeowners received matching state grants to install hurricane clips, reinforced garage doors, and impact-resistant glazing, triggering mandatory premium reductions.

> "For the first time in nearly a decade, multiple national insurance groups have filed applications to enter or expand operations within Florida, rather than seeking policy non-renewals."

While coastal rates remain elevated relative to national baselines, the sharp double-digit annual increases that troubled Florida homeowners appear to have stabilized, offering much-needed predictability for the state's robust real estate economy.`,
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-10-21T18:15:00Z"),
      readingTime: 4,
      views: 2650,
      featured: false,
      trending: true,
      metaTitle: "Florida Property Insurance Reform Stabilizes Coastal Homeowners",
      metaDesc: "Comprehensive review of Florida insurance market legislation, state reinsurance stabilization, and coastal resilience building incentives.",
      focusKeyword: "Florida Property Insurance",
      canonicalUrl: "https://statetostate.vercel.app/blog/florida-property-insurance-reform-coastal-homeowners",
      authorId: staffAuthor.id,
      categoryId: categoryMap["florida"],
      tagSlugs: ["housing-insurance", "state-legislation", "public-policy"],
    },
    {
      title: "New York State Enacts Landmark Transit and Healthcare Stabilization Funding in Albany",
      slug: "new-york-state-transit-healthcare-stabilization-albany",
      excerpt: "Governor and state legislative leaders finalize an extensive fiscal pact securing long-term capital support for upstate rural hospitals and metropolitan transit corridors.",
      content: `Following intensive negotiations in the state capitol, New York state leaders have certified a landmark legislative agreement ensuring stable funding streams for the state's regional healthcare networks and multi-county transit arteries.

## Securing Upstate Healthcare Access

A central breakthrough in the Albany negotiations focused on struggling rural and community hospitals across Western New York, the Southern Tier, and the North Country:

- **Emergency Facility Capital Grants**: A dedicated \$850 million stabilization fund will upgrade trauma center telemetry and emergency room diagnostic equipment.
- **Physician Loan Forgiveness**: Medical graduates who commit to practicing family medicine or pediatrics in designated upstate healthcare shortage counties will receive 100% student loan amortization over five years.

## Multi-Modal Transit Modernization

Simultaneously, the state budget pact solidifies dedicated funding mechanisms for upstate transit authorities in Buffalo, Rochester, Syracuse, and Albany:

- **Bus Rapid Transit & Clean Fleets**: Regional transit systems will transition their core lines to zero-emission hydrogen-fuel-cell and battery-electric fleets by 2030.
- **Intercity Rail Station Upgrades**: Amtrak and Empire Corridor stations will see modern platform extensions to accommodate expanded daily passenger departures between New York City and Niagara Falls.

> "A strong New York requires healthy communities and connected economic corridors from Montauk to Buffalo," legislative leaders stated upon final passage.`,
      coverImage: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-10-20T12:00:00Z"),
      readingTime: 4,
      views: 2190,
      featured: false,
      trending: false,
      metaTitle: "New York State Transit and Healthcare Stabilization Funding",
      metaDesc: "Albany leaders finalize comprehensive legislative agreement supporting upstate hospitals and statewide transit modernization.",
      focusKeyword: "New York State Legislation",
      canonicalUrl: "https://statetostate.vercel.app/blog/new-york-state-transit-healthcare-stabilization-albany",
      authorId: admin.id,
      categoryId: categoryMap["new-york"],
      tagSlugs: ["healthcare", "infrastructure", "public-policy"],
    },
    {
      title: "The Midwest Industrial Renaissance: How Ohio and Michigan Are Winning Next-Generation Manufacturing",
      slug: "midwest-manufacturing-renaissance-ohio-michigan",
      excerpt: "State-level workforce academies, brownfield reclamation incentives, and multimodal rail links are transforming the Great Lakes basin into an advanced industrial powerhouse.",
      content: `The industrial heartland of the United States is undergoing a quiet but formidable rebirth. In communities across Ohio, Michigan, and Indiana, former automotive assembly sites and decommissioned steel yards are being repurposed into state-of-the-art gigafactories, precision aerospace machining centers, and commercial defense production facilities.

## Collaborative State Policies Driving Growth

State governors and regional economic partnerships have worked across state boundaries to establish competitive regional ecosystems:

- **Brownfield Ready Sites**: State programs in Ohio and Michigan cover environmental testing and infrastructure hookups upfront, allowing manufacturers to break ground months faster than on greenfield plots.
- **Apprenticeship Tax Credits**: Employers receive direct corporate tax offsets when partnering with regional community colleges to sponsor dual-enrollment industrial robotics technicians.
- **Great Lakes Water Freight Intermodalism**: Port upgrades in Cleveland, Detroit, and Toledo have connected regional factories directly with international deepwater shipping channels via the St. Lawrence Seaway.

> "The Midwest is proving that skilled trades, abundant fresh water, and deep industrial heritage remain unmatched competitive advantages in the 21st century."

As supply chain resiliency remains a top priority for corporate boards nationwide, the Great Lakes manufacturing corridor is reclaiming its position at the center of the American economy.`,
      coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-10-19T09:45:00Z"),
      readingTime: 5,
      views: 2470,
      featured: false,
      trending: true,
      metaTitle: "Midwest Advanced Manufacturing Renaissance: Ohio and Michigan",
      metaDesc: "How Ohio and Michigan are leading a major manufacturing resurgence through workforce training, brownfield reclamation, and intermodal transport.",
      focusKeyword: "Midwest Manufacturing Renaissance",
      canonicalUrl: "https://statetostate.vercel.app/blog/midwest-manufacturing-renaissance-ohio-michigan",
      authorId: staffAuthor.id,
      categoryId: categoryMap["other-states"],
      tagSlugs: ["manufacturing", "economic-development", "interstate-affairs"],
    },
    {
      title: "Pacific Northwest Wildfire Defense: Washington and Oregon Deploy Next-Gen Satellite Detection Compact",
      slug: "pacific-northwest-wildfire-defense-satellite-detection",
      excerpt: "A landmark multi-state agreement between Washington and Oregon pairs real-time orbital thermal sensors with autonomous drone surveillance to intercept wildfires within minutes of ignition.",
      content: `As climate conditions produce hotter and drier summers across the Cascade Mountains, the state forestry departments of Washington and Oregon have formally launched a joint interstate wildfire defense network called the Pacific Northwest Early Intercept Initiative.

## Real-Time Orbital Detection

Traditional fire suppression relies heavily on lookout towers, pilot spotters, and 911 calls from motorists. The new cross-state compact leverages cutting-edge technology:

1. **Constellation Thermal Scanning**: Commercial satellite arrays scan the Pacific Northwest every 12 minutes, detecting infrared signatures as small as a single lightning-struck fir tree.
2. **Autonomous Reconnaissance Drones**: When an anomalous heat signature is detected, long-range solar-powered drones launch autonomously from state airstrips to provide real-time 4K video and wind vector data to regional fire incident commanders.
3. **Cross-Border Mutual Aid Activation**: The agreement allows either state to deploy initial attack aircraft up to 40 miles across state lines without awaiting formal interstate emergency authorization.

> "Seconds matter when a blaze starts in remote timberland. By eliminating bureaucratic borders and leveraging orbital tracking, we are saving communities and preserving our natural heritage."

State forestry officials report that during initial summer trials, average response times to remote lightning strikes dropped from four hours to under 26 minutes, demonstrating the enormous potential of collaborative interstate emergency governance.`,
      coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-10-18T16:20:00Z"),
      readingTime: 4,
      views: 1890,
      featured: false,
      trending: false,
      metaTitle: "Pacific Northwest Wildfire Defense: Washington and Oregon Compact",
      metaDesc: "Washington and Oregon launch joint satellite detection and autonomous drone defense network to intercept Cascade wildfires.",
      focusKeyword: "Pacific Northwest Wildfire Defense",
      canonicalUrl: "https://statetostate.vercel.app/blog/pacific-northwest-wildfire-defense-satellite-detection",
      authorId: staffAuthor.id,
      categoryId: categoryMap["other-states"],
      tagSlugs: ["public-safety", "clean-energy", "interstate-affairs"],
    },
    {
      title: "Statehouse Summit 2026: Interstate Commerce, Remote Work Taxation, and Energy Compacts (Draft)",
      slug: "statehouse-summit-interstate-commerce-taxation-compacts",
      excerpt: "An editorial briefing examining upcoming multi-state negotiations on remote worker payroll taxation, reciprocal professional licensing, and regional power grid harmonization.",
      content: `This upcoming editorial piece reviews the working agenda of the National Governors Association upcoming policy session in Washington, D.C. Key focus areas include reciprocal professional licensing agreements, state sales tax harmonization for digital cross-border services, and regional electric grid reliability compacts.

This story is currently in peer draft review by our state policy analysis desk.`,
      coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
      status: PostStatus.DRAFT,
      publishedAt: null,
      readingTime: 3,
      views: 0,
      featured: false,
      trending: false,
      metaTitle: "Statehouse Summit 2026: Interstate Commerce and Tax Policy",
      metaDesc: "Internal preview analyzing remote work taxation and regional power compacts at the 2026 Statehouse Summit.",
      focusKeyword: "Statehouse Summit",
      canonicalUrl: "https://statetostate.vercel.app/blog/statehouse-summit-interstate-commerce-taxation-compacts",
      authorId: admin.id,
      categoryId: categoryMap["other-states"],
      tagSlugs: ["public-policy", "interstate-affairs"],
    },
  ];

  for (const art of articles) {
    const { tagSlugs, ...postData } = art;
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        coverImage: postData.coverImage,
        status: postData.status,
        publishedAt: postData.publishedAt,
        readingTime: postData.readingTime,
        views: postData.views,
        featured: postData.featured,
        trending: postData.trending,
        metaTitle: postData.metaTitle,
        metaDesc: postData.metaDesc,
        focusKeyword: postData.focusKeyword,
        canonicalUrl: postData.canonicalUrl,
        authorId: postData.authorId,
        categoryId: postData.categoryId,
      },
      create: postData,
    });

    // Link tags
    await prisma.postTag.deleteMany({ where: { postId: post.id } });
    for (const slug of tagSlugs) {
      if (tagMap[slug]) {
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tagMap[slug],
          },
        });
      }
    }
  }

  console.log(`Successfully seeded/upserted ${articles.length} U.S. State News stories.`);
  console.log("StateToState U.S. State News migration complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
