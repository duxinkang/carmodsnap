export type BeforeAfterItem = {
  slug: string;
  title: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  beforePrompt: string;
  afterPrompt: string;
  beforeImage: string;
  afterImage: string;
  beforeFallbackImage: string;
  afterFallbackImage: string;
};

export const beforeAfterItems: BeforeAfterItem[] = [
  {
    slug: 'wrap-color',
    title: 'Matte Black Wrap Transformation',
    description:
      'Complete color change with premium matte finish. Drag the slider to see the dramatic difference.',
    beforeLabel: 'Stock',
    afterLabel: 'Matte Black Wrap',
    beforePrompt:
      'A stock silver BMW M3 sedan in showroom condition, clean factory paint, OEM wheels, photographed from front three-quarter angle, professional automotive photography, studio lighting, 16:9 aspect ratio',
    afterPrompt:
      'The same BMW M3 with a full matte black vinyl wrap, aggressive satin black custom forged wheels, lowered suspension, dramatic side lighting showing the matte texture, automotive editorial photography, 16:9 aspect ratio',
    beforeImage: '/imgs/before-after/wrap-color-before.jpg',
    afterImage: '/imgs/before-after/wrap-color-after.jpg',
    beforeFallbackImage:
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&q=80',
    afterFallbackImage:
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop&q=80',
  },
  {
    slug: 'wheel-upgrade',
    title: 'Custom Forged Wheel Upgrade',
    description:
      "See how the right wheels can completely transform your car's stance and presence.",
    beforeLabel: 'Stock Wheels',
    afterLabel: 'Custom Forged Rims',
    beforePrompt:
      'A white Audi RS5 with stock factory wheels, clean OEM appearance, front three-quarter view, professional automotive photography, 16:9 aspect ratio',
    afterPrompt:
      'The same Audi RS5 with custom bronze forged concave wheels, lowered on coilovers, aggressive stance, golden hour lighting highlighting the wheel design, 16:9 aspect ratio',
    beforeImage: '/imgs/before-after/wheel-upgrade-before.jpg',
    afterImage: '/imgs/before-after/wheel-upgrade-after.jpg',
    beforeFallbackImage:
      'https://images.unsplash.com/photo-1610450949368-7a322853c4bf?w=800&h=600&fit=crop&q=80',
    afterFallbackImage:
      'https://images.unsplash.com/photo-1493238792015-164e8568f09b?w=800&h=600&fit=crop&q=80',
  },
  {
    slug: 'body-kit',
    title: 'Full Aero Body Kit',
    description:
      'Front lip, side skirts, rear diffuser - experience the full aggressive treatment.',
    beforeLabel: 'Stock Body',
    afterLabel: 'Aero Body Kit',
    beforePrompt:
      'A clean white Porsche 911 Carrera, stock body, factory appearance, front three-quarter angle, professional automotive photography, 16:9 aspect ratio',
    afterPrompt:
      'The same Porsche 911 with full Techart widebody kit, front lip spoiler, side skirts, rear diffuser, aggressive aero, dramatic lighting, 16:9 aspect ratio',
    beforeImage: '/imgs/before-after/body-kit-before.jpg',
    afterImage: '/imgs/before-after/body-kit-after.jpg',
    beforeFallbackImage:
      'https://images.unsplash.com/photo-1552519507-cf0d5a6e5d0d?w=800&h=600&fit=crop&q=80',
    afterFallbackImage:
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop&q=80',
  },
  {
    slug: 'chrome-delete',
    title: 'Chrome Delete & Window Tint',
    description:
      'Subtle but impactful modification that adds a premium, aggressive look.',
    beforeLabel: 'Chrome Trim',
    afterLabel: 'Gloss Black Delete',
    beforePrompt:
      'A black Mercedes-AMG C63 with chrome window trim and silver Mercedes badges, front three-quarter view, professional automotive photography, 16:9 aspect ratio',
    afterPrompt:
      'The same Mercedes with full chrome delete, gloss black window trim, blacked out badges, 20% window tint, aggressive blacked out appearance, 16:9 aspect ratio',
    beforeImage: '/imgs/before-after/chrome-delete-before.jpg',
    afterImage: '/imgs/before-after/chrome-delete-after.jpg',
    beforeFallbackImage:
      'https://images.unsplash.com/photo-1611016186353-9af29c77880e?w=800&h=600&fit=crop&q=80',
    afterFallbackImage:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
  },
];
