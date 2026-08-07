export interface CategoryProduct {
  name: string;
  description: string;
  image: string;
}

export const categoryDetails: Record<string, CategoryProduct[]> = {
  'Building Materials': [
    {
      name: 'Cement & Building essentials',
      description: 'Cement bags, Mamba Cement,DOGONGO,KBC , HRC, PPC 32.5,',
      image: 'https://images.pexels.com/photos/29817952/pexels-photo-29817952.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Bricks & Blocks',
      description: 'Stock bricks, maxi bricks, cement blocks',
      image: 'https://images.pexels.com/photos/15500197/pexels-photo-15500197.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Timber & Board Products',
      description: 'Pine timber, plywood, MDF, chipboard, ceiling boards',
      image: 'https://images.pexels.com/photos/172284/pexels-photo-172284.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Reinforcement & Mesh',
      description: 'Steel rebar, reinforcing mesh, binding wire',
      image: 'https://images.pexels.com/photos/37426459/pexels-photo-37426459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
  ],
  'Tools & Equipment': [
    {
      name: 'Hand Tools',
      description: 'Hammers, spanners, pliers, screwdrivers and more',
      image: 'https://images.pexels.com/photos/5194861/pexels-photo-5194861.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Power Tools',
      description: 'Drills, grinders, saws, sanders',
      image: 'https://images.pexels.com/photos/5846153/pexels-photo-5846153.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Measuring Tools',
      description: 'Tape measures, spirit levels',
      image: 'https://images.pexels.com/photos/4312854/pexels-photo-4312854.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Ladders & Access Equipment',
      description: 'Step ladders, extension ladders, scaffolding',
      image: 'https://images.pexels.com/photos/1233338/pexels-photo-1233338.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Workwear & PPE',
      description: 'Gloves, safety glasses, boots, helmets',
      image: 'https://images.pexels.com/photos/8488037/pexels-photo-8488037.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
  ],
  'Plumbing & Essentials': [
    {
      name: 'Pipes & Fittings',
      description: 'PVC, copper, and PEX pipes with connectors and fittings',
      image: 'https://images.pexels.com/photos/29301874/pexels-photo-29301874.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Taps & Mixers',
      description: 'Basin mixers, kitchen taps, shower mixers',
      image: 'https://images.pexels.com/photos/3761559/pexels-photo-3761559.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Toilets, Cisterns & Basins',
      description: 'Toilets, cisterns, pedestals, wall-mounted basins',
      image: 'https://images.pexels.com/photos/7545637/pexels-photo-7545637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Geysers & Water Heating',
      description: 'Electric geysers, solar water heaters, geyser accessories',
      image: 'https://images.pexels.com/photos/38733791/pexels-photo-38733791.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Drainage & Guttering',
      description: 'Drainage pipes, guttering, downpipes, waste traps',
      image: 'https://images.pexels.com/photos/10372434/pexels-photo-10372434.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Water Tanks & Pumps',
      description: 'Water storage tanks, pressure pumps, submersible pumps',
      image: 'https://images.pexels.com/photos/12726229/pexels-photo-12726229.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
  ],
  'Roofing & Cladding': [
    {
      name: 'IBR & Corrugated Sheeting',
      description: 'IBR roof sheets, corrugated iron, Rolltop Ridging, Harvey tiles',
      image: 'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=8182228765128289',
    },
    {
      name: 'Roof Tiles',
      description: 'Clay tiles, concrete tiles, ridge tiles',
      image: 'https://images.pexels.com/photos/35450667/pexels-photo-35450667.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Trusses & Timber Roofing',
      description: 'Kaapa, Pareline, Treated Poles (CCA), Brandering',
      image: 'https://images.pexels.com/photos/8491084/pexels-photo-8491084.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Paint Solutions',
      description: 'Enamel Paint, Waterproofing Paint, Primers and Undercoats, PVA and Acrylic, Roofing paint',
      image: 'https://images.pexels.com/photos/4457372/pexels-photo-4457372.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Fascia Boards & Cladding',
      description: 'Fascia boards, barge boards, cladding panels',
      image: 'https://images.pexels.com/photos/163993/pexels-photo-163993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
  ],
  'Flooring & Finishes': [
    {
      name: 'Ceramic & Porcelain Tiles',
      description: 'Floor tiles, wall tiles, Mesoic Tile,porcelain tiles',
      image: 'https://images.pexels.com/photos/8092429/pexels-photo-8092429.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Vinyl & Laminate Flooring',
      description: 'Vinyl, laminate flooring, engineered wood',
      image: 'https://images.pexels.com/photos/4263067/pexels-photo-4263067.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Tile Adhesive & Grout',
      description: 'Tile adhesive, grout, tile spacers, primers',
      image: 'https://images.pexels.com/photos/11806490/pexels-photo-11806490.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Skirting Boards',
      description: 'MDF skirting, pine skirting, PVC skirting',
      image: 'https://images.pexels.com/photos/19866428/pexels-photo-19866428.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Paint & Varnishes',
      description: 'Interior paint, exterior paint, wood varnishes',
      image: 'https://images.pexels.com/photos/5799083/pexels-photo-5799083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Wallpaper & Wall Panels',
      description: 'Decorative wallpaper, wall panels, 3D panels',
      image: 'https://images.pexels.com/photos/6908566/pexels-photo-6908566.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
  ],
  'Doors & Fittings': [
    {
      name: 'Wooden Doors',
      description: 'Panel doors, flush doors, solid wood doors',
      image: 'https://images.pexels.com/photos/12700466/pexels-photo-12700466.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Metal Frames',
      description: 'Steel door frames, aluminum frames, hollow metal frames',
      image: 'https://images.pexels.com/photos/32207751/pexels-photo-32207751.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Door Hardware',
      description: 'Hinges, handles, locks, latches, door stoppers',
      image: 'https://images.pexels.com/photos/13425281/pexels-photo-13425281.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
  ],
  'Security': [
    {
      name: 'Door Locks & Deadbolts',
      description: 'Mortice locks, deadbolts, rim locks, keyless entry',
      image: 'https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Padlocks & Chains',
      description: 'Brass padlocks, hardened chains, combination locks',
      image: 'https://images.pexels.com/photos/3828944/pexels-photo-3828944.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Security Gates',
      description: 'Sliding gates, folding gates, burglar bars',
      image: 'https://images.pexels.com/photos/26050773/pexels-photo-26050773.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
  ],
  'Garden & Decoration': [
    {
      name: 'Garden Tools',
      description: 'Spades, rakes, forks, hoes, pruners',
      image: 'https://images.pexels.com/photos/3971211/pexels-photo-3971211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Wheelbarrows & Trolleys',
      description: 'Wheelbarrows, garden carts, heavy-duty trolleys',
      image: 'https://images.pexels.com/photos/7728711/pexels-photo-7728711.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Hoses & Irrigation',
      description: 'Garden hoses, sprinklers, drip irrigation, connectors',
      image: 'https://images.pexels.com/photos/4870798/pexels-photo-4870798.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      name: 'Fencing & Trellis',
      description: 'Garden fencing, trellis panels, posts, wire mesh',
      image: 'https://images.pexels.com/photos/14776744/pexels-photo-14776744.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
  ],
};
