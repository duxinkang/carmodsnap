import { Post } from '@/shared/types/blocks/blog';

type ClusterDefinition = {
  id: string;
  slugs: string[];
  decisionPath?: string[];
};

const CLUSTERS: ClusterDefinition[] = [
  {
    id: 'wrap-decision',
    slugs: [
      'car-wrap-vs-paint',
      'how-much-does-a-car-wrap-cost',
      'matte-vs-gloss-wrap',
      'car-wrap-visualizer-tool',
      'compare-car-wrap-colors-online',
      'car-wrap-mockup-online',
      'find-car-wrap-shop-and-get-quotes',
      'car-paint-color-visualizer',
      'tesla-wrap-visualizer',
      'truck-wrap-visualizer',
      'chrome-delete-visualizer',
      'ppf-vs-wrap-visualizer',
    ],
    decisionPath: [
      'car-wrap-vs-paint',
      'how-much-does-a-car-wrap-cost',
      'matte-vs-gloss-wrap',
      'car-wrap-visualizer-tool',
      'car-wrap-mockup-online',
      'find-car-wrap-shop-and-get-quotes',
    ],
  },
  {
    id: 'wheel-decision',
    slugs: [
      'how-to-choose-wheels-for-your-car',
      'wheel-fitment-visualizer',
      'see-wheels-on-my-car',
      'custom-rims-on-my-car',
    ],
    decisionPath: [
      'how-to-choose-wheels-for-your-car',
      'wheel-fitment-visualizer',
      'see-wheels-on-my-car',
      'custom-rims-on-my-car',
    ],
  },
  {
    id: 'build-planning',
    slugs: [
      '3d-car-configurator-online',
      'ai-car-modification-visualizer',
      'before-after-car-mod-simulator',
      'car-modification-preview-tool',
      'virtual-car-customizer',
    ],
    decisionPath: [
      'ai-car-modification-visualizer',
      '3d-car-configurator-online',
      'before-after-car-mod-simulator',
      'virtual-car-customizer',
    ],
  },
  {
    id: 'aero-styling',
    slugs: [
      'body-kit-visualizer',
      'widebody-kit-visualizer',
      'car-livery-design-tool',
    ],
    decisionPath: [
      'body-kit-visualizer',
      'widebody-kit-visualizer',
      'car-livery-design-tool',
    ],
  },
];

function uniquePosts(posts: Post[]) {
  const seen = new Set<string>();

  return posts.filter((post) => {
    if (!post.slug || seen.has(post.slug)) {
      return false;
    }

    seen.add(post.slug);
    return true;
  });
}

function sortByCluster(slugOrder: string[], posts: Post[]) {
  const order = new Map(slugOrder.map((slug, index) => [slug, index]));

  return [...posts].sort((a, b) => {
    const aIndex = order.get(a.slug || '') ?? Number.MAX_SAFE_INTEGER;
    const bIndex = order.get(b.slug || '') ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}

export function buildPostRelationships(currentPost: Post, allPosts: Post[]) {
  const currentSlug = currentPost.slug;
  if (!currentSlug) {
    return {
      decisionPath: [] as Post[],
      relatedGuides: [] as Post[],
    };
  }

  const postsBySlug = new Map(
    allPosts
      .filter((post) => post.slug)
      .map((post) => [post.slug as string, post])
  );

  const matchingClusters = CLUSTERS.filter((cluster) =>
    cluster.slugs.includes(currentSlug)
  );

  const decisionPath = uniquePosts(
    matchingClusters.flatMap((cluster) =>
      (cluster.decisionPath || [])
        .filter((slug) => slug !== currentSlug)
        .map((slug) => postsBySlug.get(slug))
        .filter((post): post is Post => Boolean(post))
    )
  );

  const relatedCandidates = uniquePosts(
    matchingClusters.flatMap((cluster) =>
      cluster.slugs
        .filter((slug) => slug !== currentSlug)
        .map((slug) => postsBySlug.get(slug))
        .filter((post): post is Post => Boolean(post))
    )
  );

  const orderedRelated = matchingClusters.length
    ? sortByCluster(matchingClusters[0].slugs, relatedCandidates)
    : [];

  return {
    decisionPath: decisionPath.slice(0, 5),
    relatedGuides: orderedRelated.slice(0, 4),
  };
}
