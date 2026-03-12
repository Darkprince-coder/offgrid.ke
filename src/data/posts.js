const posts = [

  // ── 1. How many solar panels ─────────────────────────
  {
    slug:     'how-many-solar-panels',
    title:    'How Many Solar Panels Do I Need? A Practical Kenya Guide',
    date:     '2026-03-01',
    tag:      'Solar',
    tagColor: 'solar',
    readTime: '10 min',
    image:    '/images/solar-count.jpg',
    excerpt:  'Step-by-step calculation using real Kenyan sunshine hours and county data so you know your number before talking to any installer.',
    content: [
      { type:'p', text:"This is the question everyone asks first, and it is the right one to start with. The honest answer is: it depends entirely on what you want to run. There is no single number that works for every Kenyan household, but there is a straightforward formula you can apply in about 10 minutes." },
      { type:'p', text:"This guide walks you through the calculation step by step. By the end you will have a real number to bring to any installer, so no one can quote you a system that is too small or overpriced." },

      { type:'h2', text:'Step 1: List every appliance you want to run' },
      { type:'p', text:"Write down every appliance and how many hours per day you actually use it. Be honest about this. Most people undercount their fridge hours (it runs 24 hours even if the compressor cycles) and overcount how long they watch TV." },
      { type:'p', text:"Here is a realistic example for a 3-bedroom home in Nairobi:" },
      { type:'table',
        headers:['Appliance', 'Wattage', 'Hours per Day', 'Daily Wh'],
        rows:[
          ['8 LED bulbs',          '80W',    '5 hrs',  '400 Wh'],
          ['TV 32 inch',           '60W',    '5 hrs',  '300 Wh'],
          ['Decoder or DStv',      '20W',    '5 hrs',  '100 Wh'],
          ['Laptop',               '60W',    '4 hrs',  '240 Wh'],
          ['Phone charging x3',    '30W',    '2 hrs',   '60 Wh'],
          ['Wi-Fi router',         '15W',   '16 hrs',  '240 Wh'],
          ['Refrigerator 120L',    '80W',   '24 hrs',  '960 Wh'],
          ['Water pump 0.5HP',    '375W',    '1 hr',   '375 Wh'],
          ['TOTAL',                  '',       '',   '2,675 Wh/day'],
        ]
      },
      { type:'callout', title:"Do not know your wattage?", text:"Check the label on the back or bottom of the appliance. It will say something like Input: 220V, 60W. For fridges, the label shows peak draw. The average running consumption is 30 to 40 percent of that figure." },

      { type:'h2', text:'Step 2: Add a 25 percent safety margin' },
      { type:'p', text:"Real solar systems never run at 100 percent efficiency. Losses come from wiring resistance, inverter conversion, battery charge and discharge cycles, and dust or shade on panels. Adding 25 percent accounts for all of this." },
      { type:'p', text:"2,675 Wh multiplied by 1.25 equals 3,344 Wh per day. That is 3.4 kWh, which becomes your target." },

      { type:'h2', text:"Step 3: Use Kenya's actual sunshine hours" },
      { type:'p', text:"Kenya receives between 4.5 and 6.5 peak sun hours per day depending on where you are. This is the number of hours per day when the sun is strong enough to generate meaningful solar power. It is not total daylight hours." },
      { type:'table',
        headers:['Region', 'Peak Sun Hours per Day'],
        rows:[
          ['Nairobi, Central Kenya',              '5.0 to 5.5'],
          ['Mombasa, Coast region',               '5.5 to 6.0'],
          ['Rift Valley, Nakuru, Eldoret',         '5.0 to 5.8'],
          ['Nyanza, Western Kenya',               '4.5 to 5.2'],
          ['Northern Kenya, Turkana, Marsabit',   '6.0 to 6.5'],
          ['Mt. Kenya region, Nyeri, Kirinyaga',  '4.5 to 5.0'],
        ]
      },
      { type:'p', text:"Using Nairobi at 5.2 hours: 3,344 divided by 5.2 equals 643W of solar capacity needed. That is the minimum installed panel wattage your system requires." },

      { type:'h2', text:'Step 4: Convert watts to number of panels' },
      { type:'ul', items:[
        '300W panels: 643 divided by 300 equals 2.1, round up to 3 panels giving 900W total',
        '400W panels: 643 divided by 400 equals 1.6, round up to 2 panels giving 800W total',
      ]},
      { type:'callout', sky:true, title:'Real-world note', text:"Most installers will quote 4 x 300W for this load size. The extra panel is sensible backup for cloudy days and system degradation over time. Do not push back on this recommendation." },

      { type:'h2', text:'Quick reference by home type' },
      { type:'table',
        headers:['Home Type', 'Typical Appliances', 'Panels Needed'],
        rows:[
          ['Bedsitter or single room',       'Lights, TV, phone charging',          '1 to 2 x 300W'],
          ['2-bedroom, no fridge',           'Lights, TV, laptop',                  '2 to 3 x 300W'],
          ['3-bedroom with fridge',          'Full home, no electric cooking',       '3 to 4 x 300W'],
          ['3-bedroom with washing machine', 'Full home plus laundry',              '5 to 6 x 300W'],
          ['Small business or shop',         'Fridges, tills, CCTV, lighting',      '6 to 10 x 300W'],
          ['Farm or borehole pump',          'Varies by pump size and run time',   '8 to 20 x 300W'],
        ]
      },

      { type:'summary', title:'The formula in plain English', rows:[
        { label:'Step 1: Daily energy use',    value:'Add up watts x hours for all appliances' },
        { label:'Step 2: Add system losses',   value:'Multiply total by 1.25' },
        { label:'Step 3: Divide by sun hours', value:'Use 4.5 to 6.5 depending on your county' },
        { label:'Step 4: Get panel count',     value:'Divide result by your panel wattage, round up' },
        { label:'Key rule',                    value:'Always round up, never down' },
      ]},

      { type:'calculatorCTA', title:'Do the calculation automatically', text:'Enter your appliances into our free Solar Calculator and get a full system recommendation with current Kenyan prices in under 2 minutes.' },
      { type:'internalLink', label:'Next: full system costs', text:'Solar for a 3-bedroom house in Kenya: what you need and what it costs', to:'/posts/solar-3-bedroom-house' },
      { type:'internalLink', label:'Related guide', text:'Lithium vs Lead-Acid Batteries in Kenya: Which Should You Buy?', to:'/posts/lithium-vs-lead-acid' },
    ]
  },

  // ── 2. Solar for 3-bedroom house ────────────────────
  {
    slug:     'solar-3-bedroom-house',
    title:    'Solar for a 3-Bedroom House in Kenya: What You Need and What It Costs',
    date:     '2026-03-05',
    tag:      'Solar',
    tagColor: 'solar',
    readTime: '12 min',
    image:    '/images/3-bedroom-solar.jpg',
    excerpt:  'Real KSh price ranges, brand recommendations, and 5 questions to ask every installer before you sign anything.',
    content: [
      { type:'p', text:"Kenya Power charges around KSh 24 to 28 per kWh once all levies and VAT are included. A typical 3-bedroom Nairobi home spends KSh 4,000 to 8,000 per month on electricity. A well-sized solar system cuts that by 70 to 90 percent and pays for itself in 4 to 7 years. Everything after that is essentially free power." },
      { type:'p', text:"This guide covers what a complete system actually includes, what each component costs in Kenya today, which brands are worth buying, and the five questions you must ask every installer before agreeing to anything." },

      { type:'h2', text:'The four components every system needs' },
      { type:'p', text:"1) Solar panels; generate DC electricity from sunlight. Most homes use monocrystalline panels, the most efficient type available in Kenya and now the standard across the industry." },
      { type:'p', text:"2) A hybrid inverter; converts DC to AC for your appliances while managing the relationship between solar, batteries, and the KPLC grid simultaneously. This is the brain of your system." },
      { type:'p', text:"3) Batteries; store surplus daytime energy for evenings, nights, and cloudy days. This is where most of your budget goes and where most buying mistakes happen." },
      { type:'p', text:"4) Wiring, mounting, and installation; covers cables, brackets, circuit breakers, conduit, and labour. Budget KSh 15,000 to 45,000 depending on system size and roof type." },

      { type:'h2', text:'Solar panels: what to buy in Kenya' },
      { type:'table',
        headers:['Panel Type', 'Price per 300W', 'Verdict'],
        rows:[
          ['Generic or no-name',         'KSh 8,000 to 12,000',   'Avoid. No warranty support in Kenya, no datasheet'],
          ['Mid-range: Risen, DAH, Jinko','KSh 13,000 to 18,000', 'Best value. KEBS certified, good local support'],
          ['Premium: JA Solar, LONGi',   'KSh 17,000 to 25,000',  'Excellent long-term choice for larger systems'],
        ]
      },
      { type:'callout', title:'What to check before buying panels', text:"Ask for the panel datasheet. It should show a 25-year performance warranty and a 10 to 12 year product warranty. Confirm the supplier has a Kenyan office that can actually honour the warranty. If they are vague about this, walk away." },

      { type:'h2', text:'Inverters available in Kenya' },
      { type:'table',
        headers:['Brand', 'Size', 'Price Range', 'Notes'],
        rows:[
          ['Must / Voltronic', '3kW',    'KSh 35,000 to 65,000',   'Entry-level, widely available upcountry'],
          ['Growatt',          '3 to 5kW','KSh 65,000 to 120,000', 'Reliable, good app monitoring, popular in Nairobi'],
          ['Deye',             '3 to 12kW','KSh 95,000 to 350,000','Best performance-to-price ratio currently in Kenya'],
          ['Victron',          '3 to 5kW','KSh 150,000 to 280,000','Premium choice for true off-grid or farm setups'],
        ]
      },
      { type:'p', text:"Growatt or Deye at 3 to 5kW is the right choice for most 3-bedroom homes in Nairobi and other urban areas. Avoid budget inverters under KSh 35,000 for any system with a fridge or pump." },

      { type:'h2', text:'Batteries: lead-acid vs lithium' },
      { type:'table',
        headers:['',  'Lead-Acid', 'Lithium LiFePO4'],
        rows:[
          ['Upfront cost',        'KSh 15,000 to 70,000 each', 'KSh 70,000 to 300,000'],
          ['Usable depth',        '50 percent',                '80 to 90 percent'],
          ['Lifespan',            '2 to 5 years',              '8 to 15 years'],
          ['Maintenance',         'Monthly checks required',   'Zero maintenance'],
        ]
      },
      { type:'internalLink', label:'Full battery comparison', text:'Lithium vs Lead-Acid Batteries in Kenya: Which Should You Buy?', to:'/posts/lithium-vs-lead-acid' },

      { type:'h2', text:'Full system cost breakdown' },
      { type:'summary', title:'Complete 3-bedroom system, current Kenyan prices', rows:[
        { label:'4 x 300W panels',                    value:'KSh 52,000 to 100,000' },
        { label:'5kW hybrid inverter (Growatt/Deye)', value:'KSh 90,000 to 175,000' },
        { label:'Batteries: lead-acid 2 x 200Ah',    value:'KSh 60,000 to 120,000' },
        { label:'Batteries: lithium 2 x 100Ah',      value:'KSh 100,000 to 200,000' },
        { label:'Wiring, mounting, breakers',         value:'KSh 20,000 to 40,000' },
        { label:'Installation labour',                value:'KSh 15,000 to 35,000' },
        { label:'Total with lead-acid batteries',     value:'KSh 237,000 to 470,000' },
        { label:'Total with lithium batteries',       value:'KSh 277,000 to 550,000' },
      ]},

      { type:'callout', sky:true, title:'Payback period example', text:"A home spending KSh 6,000 per month on KPLC installs a KSh 350,000 system. Solar cuts the bill by 75 percent, saving KSh 4,500 per month. Payback: 350,000 divided by 4,500 equals 78 months, roughly 6.5 years. After that the savings continue for another 18 or more years." },

      { type:'h2', text:'5 questions to ask every installer' },
      { type:'ol', items:[
        'Can you show me the panel datasheet? A legitimate installer has this immediately. No datasheet is a red flag.',
        'What is the total usable battery capacity in kWh? Always ask in kWh, not battery count or Ah alone.',
        'Can I speak to a previous customer with a similar system? One honest phone call tells you more than any brochure.',
        'What happens if the inverter fails in year 3? Understand the warranty claim process before you sign.',
        'Can I see an itemised quote per component? A lump sum makes proper comparison impossible. Demand line items.',
      ]},

      { type:'calculatorCTA', title:'Get your personalised system estimate', text:'Enter your appliances into our Solar Calculator and see exactly what size system you need, with a full cost breakdown in KSh.' },
      { type:'internalLink', label:'Start here if you have not already', text:'How many solar panels do I need? A practical Kenya guide', to:'/posts/how-many-solar-panels' },
    ]
  },

  // ── 3. Best water tanks ──────────────────────────────
  {
    slug:     'best-water-tanks-kenya',
    title:    'Best Water Tanks in Kenya: Brands, Sizes, and Current Prices (2026)',
    date:     '2026-03-08',
    tag:      'Water',
    tagColor: 'water',
    readTime: '9 min',
    image:    '/images/tank-sizes.jpg',
    excerpt:  'An honest comparison of Kentank, Roto, Toptank, and more with real KSh price tables and a guide to choosing the right size for your household.',
    content: [
      { type:'p', text:"Water storage is one of the most practical investments a Kenyan household can make. Whether you are dealing with rationing from the county water company, an unreliable borehole, or simply want independence, a well-sized tank changes daily life in a real way." },
      { type:'p', text:"Kenya has a strong local manufacturing base for water tanks. Several brands have been operating for over two decades and produce genuinely good quality products. This guide helps you choose the right one without overpaying or buying something that will crack in two years." },

      { type:'h2', text:'How much water do you actually need to store?' },
      { type:'table',
        headers:['Household Type', 'Daily Per Person', 'What Is Included'],
        rows:[
          ['Basic or rural use',         '20 to 40 litres',  'Drinking, cooking, basic washing'],
          ['Urban household, normal use', '60 to 100 litres', 'Showers, toilets, laundry, cooking'],
          ['Urban household, comfortable','100 to 150 litres','Above plus garden and car washing'],
        ]
      },
      { type:'callout', sky:true, title:'Rule of thumb for sizing', text:"Multiply people by 100 litres by 3 to 5 days of reserve. A family of 5 should target at least 2,000 litres as a minimum. In areas with frequent rationing, 5,000 litres is the comfortable choice." },

      { type:'h2', text:"Kenya's main tank brands compared honestly" },
      { type:'h3', text:'Kentank by Kentainers' },
      { type:'p', text:"Manufacturing in Kenya since the 1970s. Widely considered the quality market leader for general storage. Rotationally moulded from food-grade, UV-stabilised polyethylene. Particularly well-regarded for borehole and rainwater storage where UV exposure is high." },
      { type:'h3', text:'Roto Moulders' },
      { type:'p', text:"Equal to Kentank in reputation and quality. Uses a triple-layer design with an anti-bacterial inner lining. Available from 100 litres up to 24,000 litres. Standard 17-year structural warranty, which is among the best offered in Kenya." },
      { type:'h3', text:'Toptank' },
      { type:'p', text:"The first company in Africa to produce antimicrobial plastic water tanks. KEBS certified with the Diamond Mark quality award. This is the best choice specifically for drinking water storage because the antimicrobial lining inhibits bacteria growth even when the tank is not cleaned on schedule." },
      { type:'h3', text:'Techno Tanks' },
      { type:'p', text:"Made from 100 percent virgin polyethylene with no recycled plastic content. This matters because recycled plastic can leach taste into water and is structurally weaker over time, especially in direct sunlight. Good mid-range option at a slightly lower price than Kentank or Roto." },

      { type:'h2', text:'Price guide by tank size, 2026' },
      { type:'table',
        headers:['Tank Size', 'Budget or Generic', 'Roto, Kentank, or Toptank', 'Best For'],
        rows:[
          ['1,000 L', 'KSh 4,500 to 6,500',   'KSh 7,000 to 12,000',   'Bedsitters, small apartments'],
          ['2,000 L', 'KSh 10,000 to 14,000',  'KSh 15,000 to 22,000',  'Household of 2 to 3 people'],
          ['3,000 L', 'KSh 14,000 to 18,000',  'KSh 20,000 to 28,000',  'Small family of 3 to 4'],
          ['5,000 L', 'KSh 24,000 to 34,000',  'KSh 35,000 to 50,000',  'Family of 4 to 6 people'],
          ['8,000 L', 'KSh 32,000 to 55,000',  'KSh 55,000 to 80,000',  'Large household or small farm'],
          ['10,000 L','KSh 45,000 to 70,000',  'KSh 65,000 to 100,000', 'Multi-unit property or borehole storage'],
        ]
      },
      { type:'callout', title:'The cheap tank trap', text:"Generic tanks are often made from recycled plastic. This causes water to taste off, tanks to become brittle faster, and structural cracking within 5 to 7 years. For drinking water storage always use Kentank, Roto, Toptank, or Techno. The price difference over the life of the tank is small. The quality difference is significant." },

      { type:'h2', text:'Three maintenance rules that extend tank life' },
      { type:'ol', items:[
        'Clean every 6 to 12 months. Drain the tank, scrub the inside walls with diluted bleach (1 part bleach to 10 parts water), then rinse thoroughly before refilling.',
        'Keep the lid sealed at all times. Open tanks invite mosquitoes and airborne debris. Add a fine mesh filter over the inlet pipe to catch sediment from the supply.',
        'Choose dark colours for outdoor tanks. Black and dark green tanks block UV light and significantly reduce algae growth compared to white or light blue tanks.',
      ]},

      { type:'summary', title:'Quick buying guide', rows:[
        { label:'Best overall quality',        value:'Kentank or Roto' },
        { label:'Best for drinking water',     value:'Toptank with antimicrobial lining' },
        { label:'Best value mid-range',        value:'Techno Tanks' },
        { label:'Minimum for a 5-person home', value:'3,000 litres' },
        { label:'For real water security',     value:'5,000 litres or more' },
        { label:'Always avoid',                value:'Unknown brands and recycled-plastic tanks' },
      ]},

      { type:'internalLink', label:'Pair this with', text:'Rainwater Harvesting in Kenya: A Complete Setup Guide', to:'/posts/rainwater-harvesting-kenya' },
    ]
  },

  // ── 4. Lithium vs Lead-Acid ──────────────────────────
  {
    slug:     'lithium-vs-lead-acid',
    title:    'Lithium vs Lead-Acid Batteries in Kenya: Which Should You Buy?',
    date:     '2026-03-10',
    tag:      'Solar',
    tagColor: 'solar',
    readTime: '11 min',
    image:    '/images/lead-lithium.jpg',
    excerpt:  'A no-nonsense comparison of LiFePO4 and lead-acid batteries using real Kenyan prices so you can make the right call for your budget and situation.',
    content: [
      { type:'p', text:"The battery is the most expensive and most misunderstood component of any solar system in Kenya. Get it wrong and you will be replacing it in two years. Get it right and it will serve your home for a decade or more." },
      { type:'p', text:"This guide cuts through the marketing and gives you real numbers based on current Kenyan market prices and actual cycle life performance data." },

      { type:'callout', sky:true, title:'Short answer', text:"If you can afford it, buy lithium LiFePO4. If the upfront cost is too high right now, lead-acid works but factor in that you will likely replace it every 3 to 4 years, making it more expensive in total over a 10-year period in most cases." },

      { type:'h2', text:'The key numbers side by side' },
      { type:'table',
        headers:['',  'Lead-Acid (FLA or AGM)', 'Lithium LiFePO4'],
        rows:[
          ['Typical price per 200Ah', 'KSh 18,000 to 40,000',  'KSh 80,000 to 160,000'],
          ['Usable capacity',         '40 to 50 percent',       '80 to 90 percent'],
          ['Effective kWh per 200Ah', 'Around 1.2 kWh',         'Around 4.3 kWh at 24V'],
          ['Cycle life',              '300 to 600 cycles',      '2,000 to 5,000 cycles'],
          ['Typical lifespan',        '2 to 4 years',           '8 to 15 years'],
          ['Maintenance',             'Monthly checks needed',  'Zero maintenance'],
          ['Heat tolerance',          'Poor above 35 degrees',  'Good up to 55 degrees'],
          ['Weight per 100Ah',        'Around 28kg',            'Around 12kg'],
          ['Charge efficiency',       '70 to 85 percent',       '95 to 99 percent'],
        ]
      },

      { type:'h2', text:"Why the cheaper option often costs more" },
      { type:'p', text:"A 200Ah lead-acid battery costs around KSh 25,000. But you can only safely use 50 percent of that to avoid damaging it, so you are effectively paying for 100Ah of real storage. A 100Ah LiFePO4 at 24V gives you 2.4 kWh usable versus 1.2 kWh from the lead-acid." },
      { type:'p', text:"Lead-acid batteries in Kenya's heat typically last about 400 full cycles before significant capacity loss. At one cycle per day, that is just over a year of heavy use. Most Kenyan users get 2 to 3 years from a decent AGM battery. Over 10 years you will replace them 3 to 4 times." },
      { type:'summary', title:'10-year cost comparison for a typical 3-bedroom system', rows:[
        { label:'Lead-acid (2x200Ah, replaced every 3 years)',  value:'KSh 200,000 to 280,000 total' },
        { label:'Lithium (2x100Ah LiFePO4, lasts 10+ years)',  value:'KSh 160,000 to 280,000 total' },
        { label:'Lead-acid hidden costs (checks, top-up)',      value:'KSh 5,000 to 15,000 extra' },
        { label:'Lithium hidden costs',                         value:'Near zero' },
        { label:'Better value over 10 years',                  value:'Lithium in most cases' },
      ]},

      { type:'h2', text:'When lead-acid still makes sense' },
      { type:'ul', items:[
        'Very tight upfront budget and you need the system working now',
        'Temporary installation where you plan to upgrade within 2 to 3 years',
        'Very low daily usage under 0.5 kWh per day as shallow cycling extends battery life significantly',
        'You already have a working lead-acid bank and are only expanding it',
      ]},

      { type:'h2', text:'Types of lead-acid batteries available in Kenya' },
      { type:'h3', text:'Flooded Lead-Acid (Wet Cell)' },
      { type:'p', text:"The oldest technology. Requires monthly water top-up and good ventilation because it releases hydrogen gas during charging. Cheapest option at KSh 12,000 to 22,000 per 200Ah. Available everywhere including hardware stores upcountry. Fine for outdoor sheds with ventilation and regular maintenance." },
      { type:'h3', text:'AGM (Absorbent Glass Mat)' },
      { type:'p', text:"Sealed, no maintenance required, no gas release during normal use. Suitable for indoor installation. Costs KSh 20,000 to 40,000 per 200Ah. This is the best lead-acid option for most Kenyan homes. Brands worth buying include Trojan, Ritar, Vision, and Leoch." },

      { type:'h2', text:'What to know about LiFePO4 before buying in Kenya' },
      { type:'p', text:"LiFePO4 is the chemistry you want for solar storage, not the lithium-ion from phones and laptops. It is thermally stable, does not catch fire, and handles the partial state-of-charge cycling that solar systems naturally produce." },
      { type:'callout', title:'Kenya market warning', text:"Counterfeit lithium batteries are increasingly common in Nairobi. Always ask for the BMS (Battery Management System) certificate. Check the cell brand inside: CATL, EVE, and CALB are reputable manufacturers. Buy from a supplier with a physical presence in Kenya and a written warranty." },
      { type:'table',
        headers:['Brand or Type', 'Price 100Ah 24V', 'Availability', 'Notes'],
        rows:[
          ['Pylontech US2000',       'KSh 90,000 to 130,000', 'Good',   'Most widely stocked in Nairobi'],
          ['CATL cells assembled',   'KSh 80,000 to 110,000', 'Good',   'Check BMS quality carefully'],
          ['Felicity or Lento',      'KSh 75,000 to 100,000', 'Good',   'Local brands, decent quality'],
          ['Unbranded China imports','KSh 45,000 to 70,000',  'Common', 'High risk, verify cell brand before buying'],
        ]
      },

      { type:'h2', text:'Practical buying advice for Kenya' },
      { type:'ol', items:[
        'Always ask for BMS specs. Minimum 100A continuous current rating for most home systems',
        'For lead-acid, buy oversized. A 400Ah bank for a 200Ah daily need gives much longer cycle life',
        'Never mix old and new batteries in the same bank regardless of type',
        'In Mombasa and coastal areas, humidity damages lead-acid terminals faster. AGM or lithium is preferred',
        'Get any warranty in writing. Minimum 2 years for AGM, 5 years for lithium',
      ]},

      { type:'calculatorCTA', title:'See exactly how many batteries you need', text:'Use our Solar Calculator to enter your appliances and get a full battery recommendation with current Kenyan prices.' },
      { type:'internalLink', label:'Related guide', text:'How many solar panels do I need? A practical Kenya guide', to:'/posts/how-many-solar-panels' },
      { type:'internalLink', label:'Related guide', text:'Solar for a 3-bedroom house in Kenya: what you need and what it costs', to:'/posts/solar-3-bedroom-house' },
    ]
  },

  // ── 5. Rainwater Harvesting ──────────────────────────
  {
    slug:     'rainwater-harvesting-kenya',
    title:    'Rainwater Harvesting in Kenya: A Complete Setup Guide (2026)',
    date:     '2026-03-11',
    tag:      'Water',
    tagColor: 'water',
    image:    '/images/rainwater-harvesting.jpg',
    readTime: '12 min',
    excerpt:  'Everything you need to collect, filter, and store rainwater in Kenya from rooftop collection to first-flush filters with real material costs.',
    content: [
      { type:'p', text:"Kenya receives between 500mm and 2,000mm of rainfall per year depending on the region. A typical Nairobi household with a 100m2 iron-sheet roof can collect 70,000 to 80,000 litres of water annually. That is more than enough to cover most household needs if stored and filtered properly." },
      { type:'p', text:"This guide covers everything from the rooftop catchment surface to first-flush filters, storage tanks, and basic purification, with current material costs from Nairobi and upcountry markets." },

      { type:'h2', text:'How much rainwater can you realistically collect?' },
      { type:'p', text:"The formula is simple: Roof area in m2 multiplied by rainfall in mm multiplied by 0.8 efficiency factor gives you litres collected per year." },
      { type:'table',
        headers:['Location', 'Annual Rainfall', '100m2 Roof Yield', '200m2 Roof Yield'],
        rows:[
          ['Nairobi',          '860mm',   '69,000L',  '138,000L'],
          ['Mombasa',          '1,100mm', '88,000L',  '176,000L'],
          ['Kisumu',           '1,400mm', '112,000L', '224,000L'],
          ['Nakuru',           '900mm',   '72,000L',  '144,000L'],
          ['Eldoret',          '1,100mm', '88,000L',  '176,000L'],
          ['Garissa, ASAL',    '300mm',   '24,000L',   '48,000L'],
        ]
      },
      { type:'callout', sky:true, title:'Quick roof measurement', text:"Measure your roof in steps or use Google Earth satellite view. Multiply length by width to get area. A standard 3-bedroom bungalow in Kenya typically has 80 to 120m2 of catchment area." },

      { type:'h2', text:'The 5 components of a working rainwater system' },
      { type:'h3', text:'1. Catchment surface (your roof)' },
      { type:'p', text:"Iron-sheet mabati roofs are excellent for collection. They are smooth, have large surface area, and are easy to keep clean. Tile roofs work but collect slightly less due to the rougher texture. Asbestos roofs should never be used for drinking water collection due to fibre contamination risk." },
      { type:'h3', text:'2. Gutters and downpipes' },
      { type:'p', text:"PVC guttering is cheaper and lighter than metal but expands in heat. Aluminium is more durable and worth the extra cost. You need gutters on all roof edges that slope toward your tank. A 100m2 roof needs roughly 30 to 40 metres of guttering." },
      { type:'table',
        headers:['Component', 'Material', 'Price Range', 'Notes'],
        rows:[
          ['PVC half-round gutter per metre', 'PVC',       'KSh 400 to 700',    'Most common in Kenya'],
          ['Aluminium gutter per metre',       'Aluminium', 'KSh 800 to 1,400',  'More durable, better in heat'],
          ['Downpipe per metre',               'PVC',       'KSh 300 to 500',    '100mm diameter minimum'],
          ['Gutter bracket',                   'Plastic',   'KSh 80 to 150',     'Fit every 60cm'],
          ['End caps per pair',                'PVC',       'KSh 200 to 400',    'One pair per run'],
        ]
      },
      { type:'h3', text:'3. First-flush diverter — the most important component' },
      { type:'p', text:"The first 2mm of rainfall washes dust, bird droppings, and debris off your roof. A first-flush diverter captures this contaminated water and sends it away from your storage tank. This is the most important and most overlooked component in Kenyan rainwater systems." },
      { type:'p', text:"A DIY PVC first-flush diverter for a 100m2 roof costs KSh 2,000 to 5,000 in pipe fittings from a hardware store. Ready-made units cost KSh 8,000 to 15,000. It will prevent tank contamination and dramatically reduce how often you need to clean the tank interior." },
      { type:'h3', text:'4. Storage tank' },
      { type:'p', text:"For rainwater storage, a 5,000 to 10,000L tank is right for most families. For drinking water use, Toptank with antimicrobial lining or Kentank are the recommended choices. See our full tank comparison guide for brand details and current prices." },
      { type:'internalLink', label:'Full tank guide', text:'Best water tanks in Kenya: brands, sizes, and current prices', to:'/posts/best-water-tanks-kenya' },
      { type:'h3', text:'5. Filtration and purification' },
      { type:'p', text:"For non-drinking uses like toilets, garden watering, and laundry: a basic sediment filter at the tank inlet is sufficient. For drinking water you need at minimum a ceramic filter or UV steriliser." },
      { type:'table',
        headers:['Purification Method', 'Cost', 'Removes', 'Notes'],
        rows:[
          ['Boiling',                  'Fuel cost only',       'Bacteria and viruses',               'Cheapest but uses energy or firewood'],
          ['Ceramic candle filter',    'KSh 500 to 16,000',  'Bacteria and sediment',              'Slow flow rate, replace candle every 6 months'],
          ['UV steriliser 12V solar',  'KSh 10,000 to 16,000','Bacteria and viruses',               'Best for solar-powered homes'],
          ['Gravity sand filter DIY',  'KSh 1,000 to 6,000',  'Sediment and some bacteria',         'Good first stage before ceramic or UV'],
          ['Reverse osmosis unit',     'KSh 25,000 to 60,000','Everything including chemicals',     'Highest quality, needs water pressure'],
        ]
      },

      { type:'h2', text:'Full system cost estimate' },
      { type:'summary', title:'3-bedroom home: 100m2 roof with 5,000L storage tank', rows:[
        { label:'Guttering 35m PVC',            value:'KSh 18,000 to 28,000' },
        { label:'Downpipes and fittings',        value:'KSh 5,000 to 10,000' },
        { label:'First-flush diverter',          value:'KSh 4,000 to 12,000' },
        { label:'5,000L Kentank or Roto tank',   value:'KSh 35,000 to 50,000' },
        { label:'Tank stand if elevated',        value:'KSh 8,000 to 20,000' },
        { label:'Inlet filter and overflow pipe',value:'KSh 2,000 to 5,000' },
        { label:'UV steriliser for drinking',    value:'KSh 15,000 to 35,000' },
        { label:'Labour and miscellaneous',      value:'KSh 8,000 to 18,000' },
        { label:'Total estimate',                value:'KSh 95,000 to 178,000' },
      ]},

      { type:'h2', text:'Maintenance steps most people skip' },
      { type:'ol', items:[
        'Clean gutters every 3 months. Blocked gutters overflow and waste the water you are trying to collect',
        'Inspect and empty the first-flush chamber after every significant rain',
        'Clean the tank interior annually with diluted bleach, then rinse thoroughly before refilling',
        'Replace ceramic filter candles every 6 to 12 months depending on usage',
        'Check all entry points for mosquito gaps. Fine mesh on overflow pipes and the inlet is essential in Kenya',
        'Test water quality once a year if using it for drinking',
      ]},

      { type:'callout', title:'Nairobi seasonal tip', text:"March to May and October to December are the two rainy seasons. Prioritise filling your tank during these periods. A 10,000L tank filled in April will last a family of 5 approximately 50 days at 40 litres per person per day." },

      { type:'h2', text:'Is rainwater collection legal in Kenya?' },
      { type:'p', text:"Yes. The Water Act 2016 explicitly permits rainwater harvesting for household use and county governments actively encourage it. You do not need a permit for a domestic rooftop collection system. Large-scale commercial harvesting above 500m3 per month may require registration with the Water Resources Authority." },

      { type:'calculatorCTA', title:'Add solar to your rainwater system', text:'A solar-powered pump and UV steriliser can make your water system fully off-grid. Use our Solar Calculator to size the panels you need.' },
    ]
  },

]

export default posts

export function getAllPosts() {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostBySlug(slug) {
  return posts.find(p => p.slug === slug) || null
}

export function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
