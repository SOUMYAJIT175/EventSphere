/**
 * EventSphere - Curated Events Database
 * Scheduled between 6 November 2026 and 30 December 2026 (inclusive).
 * Covers Technology, Music, Sports, Education, Business, Arts & Culture.
 */

const sampleEvents = [
  {
    id: "evt-tech-00",
    title: "CyberShield India Summit: Zero-Trust Security 2026",
    category: "Technology",
    featured: false,
    price: "₹999",
    isFree: false,
    date: "2026-11-06T09:00:00+05:30",
    endDate: "2026-11-06T15:00:00+05:30",
    dateDisplay: "Nov 06, 2026 • 09:00 AM IST",
    venue: "Vigyan Bhavan Convention Center",
    city: "New Delhi, NCR",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A national symposium addressing cyber defense resilience, zero-trust cloud architectures, and proactive threat mitigation.",
    fullDescription: "CyberShield India convened leading cybersecurity officers, CERT-In specialists, and security analysts. Keynotes focused on zero-trust enterprise security, AI-powered SOC automation, and quantum-resistant encryption. Attendees engaged in real-time red team vs. blue team defense simulations.",
    highlights: [
      "Keynote by Dr. Rajiv Nambiar on National Cyber Infrastructure",
      "Live Ransomware Defense & Red-Teaming Simulation",
      "Executive Briefing on India Data Protection Act (DPDP) Compliance",
      "Enterprise Zero-Trust Implementation Playbook for all delegates"
    ],
    schedule: [
      { time: "09:00 AM - 10:00 AM", title: "Registration & Morning Cyber Briefing" },
      { time: "10:00 AM - 12:00 PM", title: "Keynote: Zero-Trust Architectures for Cloud Infrastructures" },
      { time: "12:30 PM - 03:00 PM", title: "Live Cyber-Range Breach Simulation & Concluding Address" }
    ],
    speakers: [
      { name: "Dr. Rajiv Nambiar", role: "Chief Information Security Strategist, CyberCore", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "National Cyber Defense Alliance",
    seatsLeft: 0,
    totalSeats: 300
  },
  {
    id: "evt-tech-01",
    title: "Global Tech Innovators Summit 2026",
    category: "Technology",
    featured: true,
    price: "₹1,499",
    isFree: false,
    date: "2026-11-15T09:30:00+05:30", // 9 days remaining from Nov 6
    endDate: "2026-11-17T18:00:00+05:30",
    dateDisplay: "Nov 15, 2026 • 09:30 AM IST",
    venue: "Silicon Hall, Tech Park",
    city: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "The premier gathering of AI researchers, cloud architects, and tech founders shaping the future of autonomous intelligence.",
    fullDescription: "Join over 2,500 technologists, innovators, and venture leaders for three transformative days. Featuring keynotes on generative AI, quantum computing infrastructure, robotics, and next-gen developer tooling. Network with top engineering minds, participate in live workshops, and discover revolutionary breakthroughs.",
    highlights: [
      "Keynote by Dr. Aravind Swaminathan (Director of Applied AI Labs)",
      "40+ Technical Deep-Dive Sessions & Live Code Walkthroughs",
      "Hands-on Agentic AI & Microservices Workshop",
      "Exclusive Startup Pitch Arena with ₹2.5 Cr in grants",
      "Complimentary gourmet lunch, official swag kit & verified certificate"
    ],
    schedule: [
      { time: "09:30 AM - 10:30 AM", title: "Registration & Welcome Networking Breakfast" },
      { time: "10:30 AM - 12:00 PM", title: "Keynote: The Sovereign AI Landscape 2027" },
      { time: "12:00 PM - 01:30 PM", title: "Breakout Panels: Cloud Native & Distributed Systems" },
      { time: "01:30 PM - 02:30 PM", title: "Lunch & Interactive Demo Booths" },
      { time: "02:30 PM - 05:00 PM", title: "Hands-on Workshop & Startup Pitch Finals" }
    ],
    speakers: [
      { name: "Dr. Aravind Swaminathan", role: "AI Research Lead, DeepNeural", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Pooja Deshmukh", role: "VP of Engineering, CloudScale", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "TechSphere Foundation India",
    seatsLeft: 42,
    totalSeats: 350
  },
  {
    id: "evt-music-02",
    title: "Echoes in the Mist: Indie Music Fest",
    category: "Music",
    featured: true,
    price: "₹899",
    isFree: false,
    date: "2026-11-21T17:00:00+05:30", // 15 days remaining from Nov 6
    endDate: "2026-11-21T23:30:00+05:30",
    dateDisplay: "Nov 21, 2026 • 05:00 PM IST",
    venue: "Amphitheatre, Green Meadows",
    city: "Pune, Maharashtra",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "An electrifying open-air evening celebrating indie folk, electronic fusion, and live acoustic sensations under the stars.",
    fullDescription: "Experience an unforgettable fusion of soulful acoustic melodies, ambient indie rock, and experimental electronic soundscapes. Curated across two state-of-the-art stages with immersive light installations, artisanal food trucks, and intimate chillout zones.",
    highlights: [
      "Headlining act by The Velvet Horizon & Soul String Quartet",
      "Dual stages: The Canopy Acoustic & The Electric Grove",
      "Eco-friendly zero-waste festival grounds with artisanal craft stalls",
      "Live interactive jam circle and sound bath meditation"
    ],
    schedule: [
      { time: "05:00 PM - 06:15 PM", title: "Gates Open & Sunset Acoustic Opener" },
      { time: "06:30 PM - 08:00 PM", title: "Indie Rock Fusion Stage Performance" },
      { time: "08:15 PM - 10:30 PM", title: "Headliner Performance & Laser Light Spectacle" }
    ],
    speakers: [
      { name: "Kabir Sen", role: "Lead Vocalist, Velvet Horizon", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Meera Nair", role: "Indie Solo Performer & Violinist", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "Cadence Live Entertainment",
    seatsLeft: 78,
    totalSeats: 800
  },
  {
    id: "evt-sports-03",
    title: "City Marathon & Fitness Carnival 2026",
    category: "Sports",
    featured: false,
    price: "Free",
    isFree: true,
    date: "2026-11-28T05:45:00+05:30", // 22 days remaining from Nov 6
    endDate: "2026-11-28T13:00:00+05:30",
    dateDisplay: "Nov 28, 2026 • 05:45 AM IST",
    venue: "Central Promenade Boulevard",
    city: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Lace up for Mumbai's flagship community fitness run with 5K, 10K, and Half Marathon routes plus wellness booths.",
    fullDescription: "A celebration of endurance, health, and community spirit. Certified by national athletics bodies, the course guides runners along breathtaking waterfront boulevards. Features hydration stations every kilometer, real-time RFID chip timing, medical support teams, and post-run nutrition feasts.",
    highlights: [
      "Choice of 5K Fun Run, 10K Timed Challenge, or 21K Half Marathon",
      "RFID bib timing tag, moisture-wicking dry-fit running jersey & medal",
      "Pre-run dynamic warm-up led by Olympic marathon trainers",
      "Post-race wellness festival with physio consultations & nutrition bars"
    ],
    schedule: [
      { time: "05:45 AM - 06:15 AM", title: "Warmup Zumba Session & Flag-off 21K" },
      { time: "06:30 AM - 06:45 AM", title: "Flag-off 10K and 5K Runners" },
      { time: "08:30 AM - 10:30 AM", title: "Medal Ceremony & Fitness Carnival Gala" }
    ],
    speakers: [
      { name: "Rohan Verma", role: "Ultra-Marathoner & Athletics Coach", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "Metropolitan Athletics League",
    seatsLeft: 320,
    totalSeats: 1500
  },
  {
    id: "evt-biz-04",
    title: "VentureSpark: Founder & Investor Summit",
    category: "Business",
    featured: true,
    price: "₹1,499",
    isFree: false,
    date: "2026-12-05T10:00:00+05:30", // 29 days remaining from Nov 6
    endDate: "2026-12-06T18:00:00+05:30",
    dateDisplay: "Dec 05, 2026 • 10:00 AM IST",
    venue: "Grand Convention Center, Aerocity",
    city: "New Delhi, NCR",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Meet 150+ angel investors, venture capitalists, and top accelerators funding India's next unicorn ventures.",
    fullDescription: "VentureSpark is the defining conference for early-stage and growth founders seeking capital, mentorship, and enterprise partnerships. Features curated 1-on-1 investor speed dating, B2B deal rooms, regulatory masterclasses, and an exhibition hall showcasing 200 disruptive tech startups.",
    highlights: [
      "Curated 1-on-1 Investor Speed Dating Rooms",
      "Keynote panels on cross-border venture capital trends",
      "Founders Masterclass: Scaling from Seed to Series A",
      "Exclusive networking VIP mixer & enterprise matchmaking"
    ],
    schedule: [
      { time: "10:00 AM - 11:00 AM", title: "Opening Address: India Tech Growth Decade" },
      { time: "11:15 AM - 01:00 PM", title: "Startup Pitch Battlefield - Round 1" },
      { time: "02:00 PM - 04:30 PM", title: "Investor-Founder Speed Dating Sessions" },
      { time: "04:30 PM - 06:00 PM", title: "Deal Announcements & Cocktail Mixer" }
    ],
    speakers: [
      { name: "Rohit Bansal", role: "Managing Partner, Elevation Horizons", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
      { name: "Shalini Kapoor", role: "Angel Investor & Ex-Fintech Founder", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "VentureSpark Network India",
    seatsLeft: 35,
    totalSeats: 400
  },
  {
    id: "evt-edu-05",
    title: "AI in Education: Future Classrooms Conclave",
    category: "Education",
    featured: false,
    price: "Free",
    isFree: true,
    date: "2026-12-11T11:00:00+05:30", // 35 days remaining from Nov 6
    endDate: "2026-12-12T17:00:00+05:30",
    dateDisplay: "Dec 11, 2026 • 11:00 AM IST",
    venue: "Auditorium Hall, National Science Center",
    city: "Hyderabad, Telangana",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Exploring intelligent tutoring, personalized adaptive curricula, and responsible AI policies for schools and universities.",
    fullDescription: "A national symposium addressing the seismic transformation of learning systems powered by generative AI. Leading educational psychologists, school chancellors, and EdTech pioneers will demonstrate breakthrough tools that personalize learning journeys and empower educators.",
    highlights: [
      "Live demonstrations of real-time multi-lingual AI tutoring systems",
      "Panel: Ethics, Assessment Integrity, and AI in STEM Higher Ed",
      "Release of the National K-12 AI Integration Blueprint",
      "Accredited Continuing Professional Development (CPD) certificate"
    ],
    schedule: [
      { time: "11:00 AM - 12:15 PM", title: "Keynote: Pedagogies for the Intelligence Age" },
      { time: "12:30 PM - 01:45 PM", title: "Live EdTech Showcase & Teacher Demos" },
      { time: "02:30 PM - 04:30 PM", title: "Breakout Workshops on Adaptive Curriculum Design" }
    ],
    speakers: [
      { name: "Prof. Sunita Rao", role: "Chair of Educational Tech, IIT Hyderabad", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "EdTech Futures India",
    seatsLeft: 120,
    totalSeats: 500
  },
  {
    id: "evt-arts-06",
    title: "KalaKriti: Modern Art & Craft Biennale",
    category: "Arts & Culture",
    featured: false,
    price: "₹499",
    isFree: false,
    date: "2026-12-16T14:00:00+05:30", // 40 days remaining from Nov 6
    endDate: "2026-12-18T20:00:00+05:30",
    dateDisplay: "Dec 16, 2026 • 02:00 PM IST",
    venue: "Royal Heritage Courtyard",
    city: "Jaipur, Rajasthan",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A sensory celebration of contemporary sculptures, traditional handloom showcases, and generative digital canvas installations.",
    fullDescription: "KalaKriti unites traditional master artisans with cutting-edge digital artists in the majestic setting of Jaipur. Spanning five curated pavilions, the exhibition explores the timeless bridge between handmade heritage techniques and futuristic algorithmic art installations.",
    highlights: [
      "Over 350 curated physical and generative NFT art installations",
      "Live handloom weaving and blue pottery masterclasses",
      "Heritage architectural night walk with ambient soundscapes",
      "Collector's art auction in aid of regional artisan guilds"
    ],
    schedule: [
      { time: "02:00 PM - 03:30 PM", title: "Gallery Tour & Artist Showcase Opening" },
      { time: "03:30 PM - 05:30 PM", title: "Hands-on Pottery & Painting Workshops" },
      { time: "06:00 PM - 08:30 PM", title: "Night Illuminations & Classical Instrumental Jugalbandi" }
    ],
    speakers: [
      { name: "Ananya Singhania", role: "Curator & Contemporary Visual Artist", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "Heritage Arts Council of Rajasthan",
    seatsLeft: 95,
    totalSeats: 600
  },
  {
    id: "evt-tech-07",
    title: "NextGen Web3 & Autonomous AI Hackathon",
    category: "Technology",
    featured: false,
    price: "Free",
    isFree: true,
    date: "2026-12-20T10:00:00+05:30", // 44 days remaining from Nov 6
    endDate: "2026-12-22T19:00:00+05:30",
    dateDisplay: "Dec 20, 2026 • 10:00 AM IST",
    venue: "T-Hub Innovation Center",
    city: "Hyderabad, Telangana",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A non-stop 36-hour code marathon solving high-stakes challenges in decentralized protocols, smart agents, and edge computing.",
    fullDescription: "Gathering 500 elite engineers, smart contract developers, and AI practitioners under one roof. Teams will build production-grade prototypes with direct mentorship from protocol architects and venture incubators. Prizes include ₹15 Lakhs in developer grants and fast-track seed funding.",
    highlights: [
      "₹15 Lakhs total prize pool + ₹50 Lakhs seed incubation grants",
      "API bounties from leading blockchain and cloud foundation partners",
      "24/7 dedicated mentor bullpen with protocol core contributors",
      "Unlimited energy drinks, catered meals & developer comfort pods"
    ],
    schedule: [
      { time: "10:00 AM - 11:30 AM", title: "Opening Keynote: Future of Edge Computing" },
      { time: "11:45 AM - 01:30 PM", title: "Zero-Knowledge Proofs & Rust Sprints" },
      { time: "02:00 PM - 07:00 PM", title: "Hacking Starts & Mentor Clinic Checkpoints" }
    ],
    speakers: [
      { name: "Varun Reddy", role: "Head of Developer Ecosystem, HyperChain Labs", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "T-Hub Hackathon Foundation",
    seatsLeft: 64,
    totalSeats: 500
  },
  {
    id: "evt-music-08",
    title: "Winter Symphony: Classical Fusion Gala",
    category: "Music",
    featured: false,
    price: "₹799",
    isFree: false,
    date: "2026-12-23T18:30:00+05:30", // 47 days remaining from Nov 6
    endDate: "2026-12-23T22:30:00+05:30",
    dateDisplay: "Dec 23, 2026 • 06:30 PM IST",
    venue: "Victoria Open Grounds",
    city: "Kolkata, West Bengal",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Experience world-class Indian classical sitar and sarod virtuosos collaborating with a 40-piece Western chamber orchestra.",
    fullDescription: "A landmark symphonic production celebrating the harmonious dialogue between North Indian raga improvisations and European classical orchestrations. Set against historic colonnades with bespoke acoustic shell engineering.",
    highlights: [
      "World premiere concerto composed by Grammy-nominated maestro Joydeep Sen",
      "40-piece chamber orchestra performing alongside classical Indian masters",
      "High-fidelity acoustic shell designed specifically for outdoor symphonies",
      "Commemorative vinyl record and program guide included for Premium tier"
    ],
    schedule: [
      { time: "06:30 PM - 07:15 PM", title: "Raga Yaman Orchestral Overture" },
      { time: "07:30 PM - 08:45 PM", title: "East-West Symphonic Concerto" },
      { time: "09:00 PM - 10:15 PM", title: "Grand Finale: Tarana in D Minor" }
    ],
    speakers: [
      { name: "Joydeep Sen", role: "Sitar Maestro & Symphonic Composer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "Kolkata Philharmonic Society",
    seatsLeft: 84,
    totalSeats: 700
  },
  {
    id: "evt-sports-09",
    title: "National Inter-Club Badminton Championship",
    category: "Sports",
    featured: false,
    price: "₹299",
    isFree: false,
    date: "2026-12-26T08:30:00+05:30", // 50 days remaining from Nov 6
    endDate: "2026-12-27T19:30:00+05:30",
    dateDisplay: "Dec 26, 2026 • 08:30 AM IST",
    venue: "Indira Gandhi Indoor Stadium",
    city: "New Delhi, Delhi",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Top seeded national shuttlers battle across singles, doubles, and mixed categories in high-speed, heart-stopping matches.",
    fullDescription: "India's premier domestic badminton showdown bringing together rising youth prodigies and seasoned Olympians. Competing on BWF-standard synthetic courts with Hawk-Eye line calling and digital scoreboards.",
    highlights: [
      "BWF Grade-A sanctioned competitive scoring and courts",
      "Live multi-angle LED courtside replays and Hawk-Eye tracking",
      "Post-match autograph and photo zone with Olympic medalists",
      "Exclusive sports merchandise stalls and Yonex racquet demo stations"
    ],
    schedule: [
      { time: "08:30 AM - 12:30 PM", title: "Quarter Finals (Singles & Doubles)" },
      { time: "02:00 PM - 05:00 PM", title: "Semi-Final Clashes" },
      { time: "06:00 PM - 08:00 PM", title: "Championship Finals & Award Presentation" }
    ],
    speakers: [
      { name: "Jwala Menon", role: "National Coach & Former Olympian", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "Indian Youth Sports Federation",
    seatsLeft: 110,
    totalSeats: 900
  },
  {
    id: "evt-arts-10",
    title: "CinemaVerse: Independent Film Screening & Q&A",
    category: "Arts & Culture",
    featured: false,
    price: "₹399",
    isFree: false,
    date: "2026-12-28T16:00:00+05:30", // 52 days remaining from Nov 6
    endDate: "2026-12-29T21:00:00+05:30",
    dateDisplay: "Dec 28, 2026 • 04:00 PM IST",
    venue: "Prithvi Cine Pavilion",
    city: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Exclusive screenings of 6 award-winning independent short films followed by an interactive dialogue with the directors.",
    fullDescription: "CinemaVerse showcases courageous storytelling from independent filmmakers across the subcontinent. From gritty social dramas to poetic surrealism, each screening offers fresh cinematic perspectives. Concludes with a panel on guerilla filmmaking and crowdfunding.",
    highlights: [
      "Curated screening of 6 festival-selected short movies (4K Dolby Vision)",
      "Uncensored director and cinematographer panel discussion",
      "Networking reception with casting agents & independent producers",
      "Screenwriting craft guide booklet for every ticket holder"
    ],
    schedule: [
      { time: "04:00 PM - 06:00 PM", title: "Screening Block 1: Three Narrative Shorts" },
      { time: "06:15 PM - 08:00 PM", title: "Screening Block 2: Experimental & Documentary Shorts" },
      { time: "08:15 PM - 09:30 PM", title: "Filmmaker Q&A & Cinephile Networking Mixer" }
    ],
    speakers: [
      { name: "Devika Sen", role: "National Award-winning Filmmaker", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "Indie Cinema Collective",
    seatsLeft: 22,
    totalSeats: 180
  },
  {
    id: "evt-biz-11",
    title: "FinTech 360: Digital Banking & Payments",
    category: "Business",
    featured: false,
    price: "₹1,899",
    isFree: false,
    date: "2026-12-29T09:00:00+05:30", // 53 days remaining from Nov 6
    endDate: "2026-12-29T18:00:00+05:30",
    dateDisplay: "Dec 29, 2026 • 09:00 AM IST",
    venue: "JW Marriott Ballroom",
    city: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Explore the evolution of UPI, central bank digital currencies (CBDC), fraud analytics, and neo-banking infrastructure.",
    fullDescription: "A high-impact conference convening banking executives, payment aggregators, regulators, and fintech disruptors. Gain strategic insights into credit enablement, AI-driven risk scoring, and next-generation contactless transactions.",
    highlights: [
      "Keynotes from NPCI and major digital banking CXOs",
      "Security deep-dive: Real-time fraud detection with graph neural nets",
      "Executive closed-door roundtable on cross-border UPI corridors",
      "5-star networking buffet and conference proceedings whitepaper"
    ],
    schedule: [
      { time: "09:00 AM - 10:30 AM", title: "Keynote: The 100-Billion Transaction Era" },
      { time: "11:00 AM - 01:00 PM", title: "Panel: AI-Powered Underwriting & Neo-banks" },
      { time: "02:00 PM - 04:30 PM", title: "CBDC and Cross-Border Settlements Showcase" }
    ],
    speakers: [
      { name: "Ramesh Narayanan", role: "Chief Innovation Officer, NeoFin Bank", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "FinTech Council of India",
    seatsLeft: 18,
    totalSeats: 250
  },
  {
    id: "evt-edu-12",
    title: "Global Higher Education & Career Fair 2026",
    category: "Education",
    featured: false,
    price: "Free",
    isFree: true,
    date: "2026-12-30T10:00:00+05:30", // 54 days remaining from Nov 6
    endDate: "2026-12-30T18:00:00+05:30",
    dateDisplay: "Dec 30, 2026 • 10:00 AM IST",
    venue: "World Trade Center Hall 3",
    city: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Meet representatives from 80+ prestigious global universities for master's programs, scholarships, and visa counseling.",
    fullDescription: "Your gateway to premier international education. Connect directly with official admissions delegates from the US, UK, Canada, Germany, and Australia. Includes free profile evaluation, GRE/IELTS strategy sessions, and on-the-spot scholarship eligibility checks.",
    highlights: [
      "Direct face-to-face interaction with 80+ university representatives",
      "Free 1-on-1 resume and Statement of Purpose (SOP) review clinic",
      "Live seminar on student visa regulations and post-study work permits",
      "Exclusive ₹10 Lakhs scholarship pool offered directly by attending institutions"
    ],
    schedule: [
      { time: "10:00 AM - 12:00 PM", title: "Admissions Expo & Booth Walkthroughs" },
      { time: "12:30 PM - 02:00 PM", title: "Masterclass: Crafting Winning Ivy League SOPs" },
      { time: "02:30 PM - 05:00 PM", title: "1-on-1 Counseling & Spot Assessment Rounds" }
    ],
    speakers: [
      { name: "Dr. Evelyn Vance", role: "Director of International Admissions, Oxford Prep", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80" }
    ],
    organizer: "Global Horizons Education Consortium",
    seatsLeft: 150,
    totalSeats: 1200
  }
];

// Helper to look up an event by its ID
function getEventById(eventId) {
  return sampleEvents.find(event => event.id === eventId) || null;
}

// Export for usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sampleEvents, getEventById };
}
