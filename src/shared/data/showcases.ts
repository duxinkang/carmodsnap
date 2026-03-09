export interface ShowcaseEntry {
  id: number;
  slug: string;
  title: string;
  description: string;
  summary: string;
  creator: string;
  creatorRole: string;
  vehicle: string;
  style: string;
  image: string;
  imageAlt: string;
  avatar?: string | null;
  avatarInitial?: string;
  badge?: string;
  tags?: string[];
  aspect: 'portrait' | 'landscape' | 'square';
  filter: 'trending' | 'latest' | 'jdm' | 'euro';
}

export const showcaseEntries: ShowcaseEntry[] = [
  {
    id: 1,
    slug: 'cyber-porsche-911',
    title: 'Cyber Porsche 911',
    description:
      'Matte black widebody Porsche 911 concept with futuristic aero and aggressive stance details.',
    summary:
      'A stealth-led 911 concept focused on matte wrap direction, widened bodywork, and a premium dark-wheel setup.',
    creator: '@turbo_tom',
    creatorRole: 'Wrap concept creator',
    vehicle: 'Porsche 911',
    style: 'Widebody matte wrap build',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBjQeU8ByQCyrRUYs8TyOmpEFVfzNfAfh9tQkLGfcbSVSKP2e9QhIONoOOmCZk31zC8gw__-fWKZqrOkHzqz3XVUCGBJsR1LPFK5EGi5ZlyhrOG6KrhzK40nFn6ZLMZXDITWwKrH8Kl_mZP3sMtQw36X0m9MBwLNwcChjss3S6kmH7NafXKmya5mDEN-EfTLmgeGf5y2g-cQFhdaw3kscZ85toRAWhRGbEgEeJCFxmXrOrV6_5WPpGhTaeSpsthRDDARTJnlumZpzKV',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWgCqsD7JPUMDDT0EBw13Ar8OnDBveJmD1T0MEcyfyeSz4aeFunqkYcmEDmBWpMm6zZUSXFsLkhPDInThYn6-yxqn58UyjY6qwmTegIzQsoIktXH65fUF-hPVWyBVe_8nIgkj7UkgA2XvLalb-au7u0IDUkvrrMLPKOuQmUrzYVd0EDPC82syI8g5Pcbut0gT3C9Mi5SPkMboVwXPjBSP-eQewASZjypE0qIayuJdp5VlSCA-Hq10n86tzum1Dn7TAYIctBCamSZVC',
    imageAlt:
      'Matte black Porsche 911 showcase with widebody styling and dark custom wheels.',
    badge: 'Wrap of the Month',
    tags: ['Matte Black', 'Widebody'],
    aspect: 'portrait',
    filter: 'trending',
  },
  {
    id: 2,
    slug: 'neon-benz-gt',
    title: 'Neon Benz GT',
    description:
      'High-contrast Mercedes GT concept balancing neon-inspired trim accents with a low, premium road stance.',
    summary:
      'A luxury-meets-nightlife showcase built around brighter trim accents, stronger reflections, and a cleaner road-focused silhouette.',
    creator: '@sarah_drifts',
    creatorRole: 'Performance styling creator',
    vehicle: 'Mercedes-AMG GT',
    style: 'Euro luxury street build',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtgdkG6AZ9nAi9niwTJPoMyHRhNhXGmdK4r6EONGZSsIqybaG2NnGCNkUJMP2QQJDVameFTqjFQiIbwNYnF3sT8hKlrJYyv1rh9YrbfO9jdO7coJ_DP5jpi6EtlznCRvpaUmEng1UWSOffgU_rZeiXJIaDYK84in_zes2AwLA1EdZAS0baJ07HvkpW4TUJGefuDjBhkLvG1Ffm_YB4i_5__grqJwMYfPYEFneZsl-ugOjUWXBzrE34Dt5zwkUSpjrXp8AN2HGLAweo',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDuV_qNiFd_5kV5cnF15sDPXM0YXvWoUQtNnatSkK8m1zWQ6NkjJ67gSu7pEjPrWXd1lmWOTuVz8s3HzOz-GJc8aSXqm-kJUZMc22r5nxV9jHbb59eFhYC2vPoPKLBXcg-yREQzUpF-6LsPBfdpv-tcsWsXoUivjKxbo_8gNTvH9qqLgTlJovwnkaDyLcPqT9RqtW8ATTkk6FcA3JrVWeZfSjJLMOQb3L6cyHkhQheQKeidPHtzq5_pDgkcJSmxppGBd8720Xp8WrMm',
    imageAlt:
      'Mercedes-AMG GT showcase with neon-inspired trim highlights and premium street styling.',
    aspect: 'landscape',
    filter: 'euro',
  },
  {
    id: 3,
    slug: 'midnight-runner-gtr',
    title: 'Midnight Runner GTR',
    description:
      'Dark Nissan GT-R concept using chameleon-toned reflections, low stance, and a sharper night-drive character.',
    summary:
      'A GT-R showcase designed around changing reflections and high-contrast body lines to test more dramatic nighttime styling.',
    creator: '@kai_works',
    creatorRole: 'JDM concept builder',
    vehicle: 'Nissan GT-R',
    style: 'JDM night-spec concept',
    avatarInitial: 'K',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHNcdsgszUHbz20v14p-dxPnqEV6BOq4wQXh_5RLbyEuOl4L6-xtgl8IAeU7Cany_ZFPI3t0nwo13_WsKo6yCiXbsyWFtegpCtlcUHCSvktPsJzikw_7NkqfUINB3ZRb3mo9zwPKp35j-riN4urK1RK0J_CDefhe0fjOk0h3I7iKbHOaCVsKQi5Ox1BW5oYtfGuw3Qsy_xze4JmfTxO-LB6sjgce6a4XFAJVE43fOsyhfsqeq1MPAWUTKa6kH5v8OcNxYFpXQX_UVn',
    imageAlt:
      'Nissan GT-R showcase with midnight chameleon finish and aggressive JDM-inspired stance.',
    tags: ['Chameleon'],
    aspect: 'portrait',
    filter: 'jdm',
  },
  {
    id: 4,
    slug: 'stealth-mode-rs7',
    title: 'Stealth Mode RS7',
    description:
      'Audi RS7 showcase testing darker luxury styling, restrained aero, and a muted premium finish direction.',
    summary:
      'An RS7 case study for buyers who want a stealthy executive build rather than an overly loud performance look.',
    creator: '@audi_fanatic',
    creatorRole: 'Euro build curator',
    vehicle: 'Audi RS7',
    style: 'Stealth executive build',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlG2eiawuDJLx6jRqfEZoVkSniNfMVLIvzNjH59HA7sF9q8_GNF7jjgDx9C-yCzTwpBmDht4x3xPWxysOV_6XoM4WAvadfiIwYWwsxqR2_qxA9rrBCGvqRibumVHQXW_y6zmr6Q3KjGfx01fyiMsPPaEB6H2zPcg02cIxedas_AIZcCju0iXaayK0zV4ha5iM0Wt9Nl6t2_oZbpAiaFB8uFl9ynCbnRIsSuCODvfcbuf2IwXvEpnzH0dgy1Gfte7KBi_pAZrYtuaQD',
    imageAlt:
      'Audi RS7 showcase with stealth-style dark finish and premium European luxury stance.',
    aspect: 'square',
    filter: 'euro',
  },
  {
    id: 5,
    slug: 'drift-spec-m4',
    title: 'Drift Spec M4',
    description:
      'BMW M4 showcase exploring satin white body direction, motorsport body balance, and drift-inspired styling cues.',
    summary:
      'A more aggressive M4 visual brief focused on satin finish, stronger wheel contrast, and a purpose-built track attitude.',
    creator: '@sideways_sam',
    creatorRole: 'Track build stylist',
    vehicle: 'BMW M4',
    style: 'Drift-inspired street build',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsH4eDKFEFqigYwdpKfAQNbQ0A2tQSB9HyOJ6D41E6WufNUnQnWG5F-di2UMHnUwF8ei_o9rkcySQnBtiogdjR2bt4R7pcPZIbEvAJTbTp93tucpdGaEyFYojZTEwwp7TPdB0Jhi6lw8oOqXG9ZoMqxMNzMS_2embG7sO4OIbfwbE84q4itVlEgLn7AROEghKc5TpjEgX92TN-Nas7d5rgulu58FruWRB1yPVQ_gIH4IsP70PMKibFNCdf1XdPbN5MBqGTKTb3AS6y',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5ZggYKJ4T9Q3uUR5h6uYOGspW0AWN9O0crYbJDJ-UEmFwjXwmrjGZM8EnrxyUcdp2ZwYQI5OXvfrp9f-lSUtI1j3Vgv9MJif3U4gx9WJx59hzmHpW1h-GjcSmSdnhVpkQ4bu4vJsO_0s1KFIQvQhQXJIaM2pXyeCbYYj6q0VIzzMRRsM8ZuLj5N45ynE6fyK7BpeC-Rkm1nsiIscd2DlMLsu1rJzEFZO2yujEnZUdjkIpoxFzHnreZJhtyyvCtj5qZUzleTQ_n1DY',
    imageAlt:
      'BMW M4 showcase with satin white finish and drift-inspired performance styling.',
    tags: ['Satin White'],
    aspect: 'portrait',
    filter: 'latest',
  },
  {
    id: 6,
    slug: 'cherry-bomb-supra',
    title: 'Cherry Bomb Supra',
    description:
      'Toyota Supra showcase built around a bright statement color, cleaner body graphics, and a sharper tuner silhouette.',
    summary:
      'A color-forward Supra case for users deciding whether a loud performance wrap still feels balanced on the full car.',
    creator: '@jdm_king',
    creatorRole: 'JDM visual curator',
    vehicle: 'Toyota Supra',
    style: 'Color-led tuner build',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAb3PhsvqgkVJ6Ynp6DXBkbl_YkIeiO-9JUNvaV34NPig6m76b1jLgdqXaVxkUjZMnDmJyRriWLtY1XHlOSUmJOEBvT1zHa8l7BAq54xF_hdkPPBUvn4y9_yIVUmqbyf__l4m554Ex3OMLf1bTF9f0rsh6ZfOXVY4m_TdldS4mLAfPlSZuCZb8hGrOVY_gJ7iloYZ0ZsYt6AIAw7_IbOUa0R44krY02gwMNfMl1lASn3F9uF6--Qd1draVf78W9lsYWrgZzxR6Tls5j',
    imageAlt:
      'Toyota Supra showcase with bold cherry-toned styling and tuner-oriented proportions.',
    aspect: 'landscape',
    filter: 'jdm',
  },
  {
    id: 7,
    slug: 'alcantara-custom',
    title: 'Alcantara Custom',
    description:
      'Interior-focused concept showing how premium trim direction can support a full custom build story.',
    summary:
      'A trim-and-material case study for users planning interior upgrades and wanting a stronger luxury narrative around the build.',
    creator: '@stitch_works',
    creatorRole: 'Interior trim specialist',
    vehicle: 'Custom interior project',
    style: 'Premium interior detail build',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBt79p3YRy1J_d3vMJHA6hPQYmDHWzQjLxG5ap7xBpOgLgjiq948ESfJf8kr-YHbGYKJ3tWnwRliMoIw456DeWsVtCuvJU3BpOlATSDLbXpLNrCo5cm_NP6FweBr1xD68lcqExnoubbdGUwGBPTrngK8mw1yRxmYQj7bVX1ynC5J724Gd4nzPA_G7NDhUW2JS7Tn3OuCWn1EFtWTL07HxueOyXZjG0a3buIP48qez0436gYjVOuUDOYBZ_gnjhizd6AaQFi1J_R6RQc',
    imageAlt:
      'Custom interior showcase featuring Alcantara-style trim and premium cockpit detailing.',
    tags: ['Interior'],
    aspect: 'portrait',
    filter: 'latest',
  },
];

export function getShowcaseBySlug(slug: string) {
  return showcaseEntries.find((entry) => entry.slug === slug) || null;
}

export function getShowcaseUrl(slug: string) {
  return `/showcases/${slug}`;
}
