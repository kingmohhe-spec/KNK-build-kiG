export interface CategoryProduct {
  name: string;
  description: string;
  image: string;
}

export const categoryDetails: Record<string, CategoryProduct[]> = {
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
      description: 'Tape measures, spirit levels, laser levels',
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
};
