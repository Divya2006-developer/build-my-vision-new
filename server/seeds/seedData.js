const bcrypt = require('bcryptjs');
const { initDatabase, db } = require('../config/db');

async function seed() {
  console.log('[SEED] Initializing database...');
  await initDatabase();

  console.log('[SEED] Clearing old data if any...');
  if (db._clearStore) {
    db._clearStore();
  }

  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('password123', salt);

  console.log('[SEED] Creating users...');

  // 1. Designers
  const designer1 = await db.users.create({
    name: 'Elena Vance, AIA',
    email: 'designer@vision.com',
    password: defaultPassword,
    role: 'designer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 234-5678',
    bio: 'Award-winning architect specializing in sustainable passive homes and biophilic architecture. 10+ years experience transforming residential dreams into eco-friendly sanctuaries.'
  });

  const designer2 = await db.users.create({
    name: 'Marcus Sterling, PE',
    email: 'marcus@vision.com',
    password: defaultPassword,
    role: 'designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 345-6789',
    bio: 'Structural engineer and modern minimalist architect. Expert in large-span commercial spaces, steel-frame buildings, and contemporary open-concept residences.'
  });

  const designer3 = await db.users.create({
    name: 'Sarah Lin',
    email: 'sarah@vision.com',
    password: defaultPassword,
    role: 'designer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 456-7890',
    bio: 'Educational & civic facility planner. Passionate about designing dynamic learning environments, children’s spaces, and adaptive reuse community buildings.'
  });

  // 2. Customers
  const customer1 = await db.users.create({
    name: 'Alex Morgan',
    email: 'customer@vision.com',
    password: defaultPassword,
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 876-5432',
    bio: 'First-time homebuilder planning a family dream villa with lots of natural sunlight and sustainable materials.'
  });

  const customer2 = await db.users.create({
    name: 'David Patel',
    email: 'david@vision.com',
    password: defaultPassword,
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 987-6543',
    bio: 'Startup founder building a boutique headquarters and community cafe.'
  });

  console.log('[SEED] Creating designer profiles...');
  await db.designers.saveProfile({
    user_id: designer1.id,
    title: 'Lead Architect & Passive House Specialist',
    specializations: ['Sustainable / Biophilic', 'Modern Minimalist', 'Residential Homes', 'Passive Solar'],
    experience_years: 10,
    location: 'Portland, OR / Remote',
    rating: 4.96,
    reviews_count: 38,
    completed_projects: 45,
    bio: 'Dedicated to bringing warmth and natural daylight into every corner. I work directly with everyday homeowners without technical jargon.',
    education_credentials: 'M.Arch Harvard GSD, LEED AP BD+C',
    software_tools: 'AutoCAD, Revit, SketchUp, Lumion, Rhino 3D',
    featured: true
  });

  await db.designers.saveProfile({
    user_id: designer2.id,
    title: 'Senior Structural Engineer & Architect',
    specializations: ['Commercial Buildings', 'Structural Engineering', 'Industrial / Modern', 'Retail & Hospitality'],
    experience_years: 12,
    location: 'Chicago, IL / Remote',
    rating: 4.92,
    reviews_count: 29,
    completed_projects: 52,
    bio: 'I fuse structural rigor with clean aesthetic lines. Specializing in high-efficiency workspaces and cantilevered residential homes.',
    education_credentials: 'M.S. Structural Engineering, Licensed PE',
    software_tools: 'ETABS, AutoCAD, Revit, SAP2000, 3ds Max',
    featured: true
  });

  await db.designers.saveProfile({
    user_id: designer3.id,
    title: 'Educational & Community Architect',
    specializations: ['Educational / Schools', 'Community Centers', 'Daycares', 'Playgrounds'],
    experience_years: 8,
    location: 'Austin, TX / Remote',
    rating: 4.88,
    reviews_count: 24,
    completed_projects: 31,
    bio: 'Creating human-centered learning environments where natural light and flexible zones spark creativity and safety.',
    education_credentials: 'B.Arch Cornell University',
    software_tools: 'ArchiCAD, SketchUp, Enscape, Photoshop',
    featured: false
  });

  console.log('[SEED] Creating portfolios...');
  await db.portfolios.create({
    designer_id: designer1.id,
    title: 'The Solarium Eco-Villa',
    category: 'residential',
    description: 'A 3,200 sq.ft net-zero residential villa with south-facing double glazing, rammed-earth thermal mass walls, and a central biophilic garden courtyard.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    blueprint_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    style: 'Sustainable / Biophilic',
    area_sqft: 3200,
    location: 'Bend, Oregon',
    year_completed: 2024,
    tags: ['Solar Orientation', 'Biophilic Courtyard', 'Passive Cooling', 'Open Concept']
  });

  await db.portfolios.create({
    designer_id: designer1.id,
    title: 'Nordic Timber Chalet',
    category: 'residential',
    description: 'Minimalist Scandinavian lakeside home featuring mass timber glulam framing, floor-to-ceiling panoramic views, and acoustic cedar ceilings.',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    blueprint_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    style: 'Scandinavian Minimalist',
    area_sqft: 2400,
    location: 'Lake Tahoe, CA',
    year_completed: 2023,
    tags: ['Mass Timber', 'Nordic Light', 'Triple Glazing', 'Fireplace Hearth']
  });

  await db.portfolios.create({
    designer_id: designer2.id,
    title: 'Apex Innovation Tech Loft',
    category: 'commercial',
    description: 'Converted historic industrial warehouse into an open-plan tech creative campus with cantilevered mezzanine meeting pods and acoustic micro-offices.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    blueprint_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    style: 'Industrial Modern',
    area_sqft: 8500,
    location: 'West Loop, Chicago',
    year_completed: 2024,
    tags: ['Steel Trusses', 'Exposed Concrete', 'Acoustic Pods', 'Collaborative Zones']
  });

  await db.portfolios.create({
    designer_id: designer3.id,
    title: 'Greenwood Montessori Early Learning Center',
    category: 'educational',
    description: 'Child-scale exploratory educational campus with sunlit circular classrooms, indoor sensory sand gardens, and zero-barrier outdoor nature play corridors.',
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    blueprint_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    style: 'Contemporary Child-Centric',
    area_sqft: 6400,
    location: 'Austin, Texas',
    year_completed: 2024,
    tags: ['Daylit Classrooms', 'Acoustic Isolation', 'Child Ergonomics', 'Courtyard Play']
  });

  console.log('[SEED] Creating sample projects across request-to-delivery lifecycle...');

  // Project 1: Alex Morgan -> Elena Vance (Status: client_review)
  const proj1 = await db.projects.create({
    customer_id: customer1.id,
    designer_id: designer1.id,
    title: 'Morning Sun Family Sanctuary',
    building_type: 'residential_home',
    plot_dimensions: '60ft x 110ft (Corner Lot)',
    num_floors: 2,
    rooms_needed: '4 Bedrooms, 3.5 Baths, Home Office, Sunlit Kitchen & Walk-in Pantry',
    style_preference: 'Modern Minimalist',
    budget_range: '$120,000 - $180,000',
    timeline_preference: '3 - 4 months',
    description: 'We want our living area and breakfast nook flooded with morning sunlight. The children need a safe playroom on the ground floor with views from the kitchen, and my partner needs a quiet, sound-insulated office for video calls. An outdoor deck connected seamlessly to the kitchen is a must!',
    special_requirements: 'Wheelchair-friendly guest bedroom on ground floor; provision for future solar rooftop panels; warm wooden textures instead of cold hospital whites.',
    inspiration_urls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ],
    technical_summary: {
      architectural_classification: 'MODERN MINIMALIST RESIDENTIAL HOME',
      spatial_layout: 'Open-concept continuous spatial flow with column-free spans, integrating kitchen-dining-living into a unified great room with visual axis to outdoor courtyard.',
      fenestration_and_lighting: 'High-performance solar orientation: East/South-facing clerestory glazing, floor-to-ceiling curtain walls, and UV-filtering double-glazed units for daylight factor optimization.',
      structural_and_materials: 'Reinforced concrete post-and-beam with glulam timber accents, engineered white oak flooring, acoustic plasterboard ceiling panels.',
      sustainability_and_mep: [
        'Rooftop Photovoltaic (PV) array conduit pre-install & inverter battery storage provision.',
        'STC 55+ acoustic partition assemblies for sound transmission loss in office suite.',
        'ADA Universal Design compliance: zero-threshold entries and ground floor accessible suite.'
      ],
      kickoff_alignment_checklist: [
        'Confirm preferred floor-to-ceiling heights (9ft standard vs 10.5ft voluminous).',
        'Review municipal setback rules for corner lot driveway positioning.',
        'Verify passive shading overhang depth to prevent summer glare.'
      ]
    }
  });
  await db.projects.updateStatus(proj1.id, 'client_review', designer1.id);

  // Deliverables for Project 1
  const deliv1 = await db.deliverables.create({
    project_id: proj1.id,
    designer_id: designer1.id,
    stage: 'concept_draft',
    title: 'Ground & Upper Level Spatial Floor Plan v1.2',
    description: 'Detailed 2D layout showing room adjacencies, eastern sun orientation vectors, acoustic home office buffer, and ground floor accessible suite.',
    file_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    file_type: 'image',
    version: 1,
    status: 'revision_requested'
  });

  const deliv2 = await db.deliverables.create({
    project_id: proj1.id,
    designer_id: designer1.id,
    stage: 'schematic_drawings',
    title: '3D Exterior Render & Morning Sun Light Study',
    description: 'High-resolution photometric render demonstrating 8:30 AM sun penetration through the eastern clerestory into the kitchen breakfast nook.',
    file_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    file_type: 'image',
    version: 1,
    status: 'pending_review'
  });

  // Revision pin on deliverable 1
  await db.revisions.create({
    deliverable_id: deliv1.id,
    project_id: proj1.id,
    customer_id: customer1.id,
    feedback_text: 'Can we widen the sliding glass door to the patio from 8ft to 12ft so the deck feels like a true extension of the living room?',
    pin_x: 62.5,
    pin_y: 44.0,
    status: 'open'
  });

  // Project 2: David Patel -> Marcus Sterling (Status: concept_drafting)
  const proj2 = await db.projects.create({
    customer_id: customer2.id,
    designer_id: designer2.id,
    title: 'Catalyst Creative Tech Hub & Cafe',
    building_type: 'commercial_building',
    plot_dimensions: '80ft x 140ft',
    num_floors: 3,
    rooms_needed: 'Ground Floor Espresso Bar, 2 Floors Open Co-working & Boardrooms',
    style_preference: 'Industrial Modern',
    budget_range: '$250,000+',
    timeline_preference: '4 - 6 months',
    description: 'A vibrant multi-use creative commercial building. Street-facing public coffee roastery on ground floor, with modern tech offices above featuring high ceilings, exposed black steel framing, and glass partitions.',
    special_requirements: 'Heavy acoustic dampening between cafe and 2nd floor offices; freight elevator or wide service staircase; high-capacity fiber routing conduits.',
    inspiration_urls: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ],
    technical_summary: {
      architectural_classification: 'INDUSTRIAL MODERN COMMERCIAL BUILDING',
      spatial_layout: 'Mixed-use vertical zoning: public mercantile at grade level with secured access control to upper-level creative studios.',
      fenestration_and_lighting: 'Storefront commercial glazing system with acoustic laminate panes (OITC 38) and industrial aluminum mullions.',
      structural_and_materials: 'Exposed structural steel portal frames, corrugated metal composite decking with 4-inch concrete slab top.',
      sustainability_and_mep: [
        'Dedicated outdoor air system (DOAS) with heat recovery ventilation for high-occupancy workspaces.',
        'High-density STC 60 acoustic floor barrier separating ground floor roastery from second floor workspaces.'
      ],
      kickoff_alignment_checklist: [
        'Confirm municipal commercial parking stalls ratio requirements.',
        'Verify fire sprinkler riser placement and dual egress emergency stairs.'
      ]
    }
  });
  await db.projects.updateStatus(proj2.id, 'concept_drafting', designer2.id);

  // Project 3: Alex Morgan (Status: submitted - unassigned open request)
  await db.projects.create({
    customer_id: customer1.id,
    designer_id: null,
    title: 'Meadowview Eco-Cabin & Studio',
    building_type: 'tiny_house',
    plot_dimensions: '40ft x 60ft rural plot',
    num_floors: 1,
    rooms_needed: '1 Bedroom, Loft Sleeping, Compact Kitchenette, Covered Porch',
    style_preference: 'Sustainable / Biophilic',
    budget_range: '$40,000 - $70,000',
    timeline_preference: '1 - 2 months',
    description: 'Looking to build an off-grid tiny cabin retreat with a sleeping loft, compost toilet plumbing setup, wood burning stove, and a covered porch to watch sunsets.',
    special_requirements: 'Off-grid solar battery bank storage space; rainwater harvesting tank integration; lightweight framing easy to build on rocky ground.',
    inspiration_urls: [],
    technical_summary: {
      architectural_classification: 'SUSTAINABLE / BIOPHILIC TINY HOUSE',
      spatial_layout: 'Micro-compact multi-functional envelope with vertical volume utilization via mezzanine loft.',
      fenestration_and_lighting: 'Strategic western operable awning windows for sunset views with deep eaves for solar shading.',
      structural_and_materials: 'Helical screw pile foundation with light wood-frame SIPs (Structural Insulated Panels) for rapid assembly.',
      sustainability_and_mep: [
        'Zero-grid DC micro-distribution electrical setup.',
        'Rainwater filtration & gravity-fed graywater irrigation.'
      ],
      kickoff_alignment_checklist: [
        'Confirm local building codes regarding tiny home minimum square footage regulations.',
        'Determine soil bearing capacity for screw pile anchoring.'
      ]
    }
  });

  // Project 4: David Patel -> Sarah Lin (Status: final_delivered - Completed project with review)
  const proj4 = await db.projects.create({
    customer_id: customer2.id,
    designer_id: designer3.id,
    title: 'Discovery Early Learning Academy',
    building_type: 'school_educational',
    plot_dimensions: '120ft x 180ft',
    num_floors: 1,
    rooms_needed: '4 Classrooms, Sensory Play Hall, Staff Lounge, Secure Courtyard',
    style_preference: 'Contemporary Child-Centric',
    budget_range: '$180,000 - $250,000',
    timeline_preference: '3 - 4 months',
    description: 'A dedicated kindergarten school prioritizing safety, soft daylight, low windowsill heights so kids can see outside, and an internal courtyard shielded from the street.',
    special_requirements: 'Rounded interior wall corners; non-toxic linoleum flooring; panic button access control doors.',
    inspiration_urls: [],
    technical_summary: {
      architectural_classification: 'CONTEMPORARY CHILD-CENTRIC SCHOOL EDUCATIONAL',
      spatial_layout: 'Single-story perimeter ring layout oriented around a secure central courtyard playground.',
      fenestration_and_lighting: 'Low sill height windows (18" above finished floor) with laminated safety glass.',
      structural_and_materials: 'Non-combustible steel framing with impact-resistant wallboard and bio-based linoleum flooring.',
      sustainability_and_mep: [
        'Low-VOC finishes and high-efficiency MERV 13 filtration ventilation.',
        'Full ADA child-accessible fixture heights throughout all washrooms.'
      ],
      kickoff_alignment_checklist: [
        'Verify state childcare licensing capacity guidelines.',
        'Confirm playground safety fall zone clearances.'
      ]
    }
  });
  await db.projects.updateStatus(proj4.id, 'final_delivered', designer3.id);

  // Final deliverables for Project 4
  await db.deliverables.create({
    project_id: proj4.id,
    designer_id: designer3.id,
    stage: 'final_delivery',
    title: 'Complete Architectural Blueprints & Permit Construction Set (PDF + DWG)',
    description: 'Full architectural construction document package including site plan, foundation details, life-safety egress plans, and window schedules ready for city permit approval.',
    file_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    file_type: 'image',
    version: 3,
    status: 'approved'
  });

  // Customer review for Sarah Lin
  await db.reviews.create({
    project_id: proj4.id,
    customer_id: customer2.id,
    designer_id: designer3.id,
    rating: 5,
    comment: 'Sarah was incredible! She took our very basic ideas and translated them into a school design that passed city permitting on the first submission. The children and parents love the sunlit sensory play hall!'
  });

  console.log('[SEED] Creating chat messages for Project 1...');
  await db.messages.create({
    project_id: proj1.id,
    sender_id: designer1.id,
    receiver_id: customer1.id,
    message_text: 'Hi Alex! Welcome to Build My Vision. I have reviewed your submission and translated your daylight requirements into high-performance clerestory glazing specifications. I just uploaded the draft floor plans!'
  });

  await db.messages.create({
    project_id: proj1.id,
    sender_id: customer1.id,
    receiver_id: designer1.id,
    message_text: 'Thank you Elena! The layout is wonderful. I pinned a quick note on Deliverable #1 about widening the sliding glass door to the patio. Take a look and let me know if that works structurally!'
  });

  await db.messages.create({
    project_id: proj1.id,
    sender_id: designer1.id,
    receiver_id: customer1.id,
    message_text: 'Absolutely! I checked the load-bearing lintel calculations—we can easily expand it to 12ft with a steel header beam. Updating the 3D render now!'
  });

  console.log('[SEED] Database seeded successfully with realistic test data!');
  console.log('----------------------------------------------------');
  console.log('Demo Accounts:');
  console.log('Customer Demo: customer@vision.com / password123');
  console.log('Designer Demo: designer@vision.com / password123');
  console.log('----------------------------------------------------');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}

module.exports = seed;
