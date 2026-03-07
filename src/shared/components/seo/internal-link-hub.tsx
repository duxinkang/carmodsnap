type LinkItem = {
  href: string;
  label: string;
};

const linkHubContent = {
  en: {
    title: 'Explore CarModSnap Resources',
    description:
      'Discover related tools, examples, and pricing to plan your next car modification project.',
    links: [
      { href: '/pricing', label: 'Compare Pricing Plans' },
      { href: '/showcases', label: 'View Car Build Showcases' },
      { href: '/blog', label: 'Read Car Mod Guides' },
      { href: '/carmodder', label: 'Try the Car Mod Visualizer' },
    ],
  },
  zh: {
    title: '探索 CarModSnap 相关页面',
    description: '查看套餐、案例和教程，快速规划你的下一次汽车改装。',
    links: [
      { href: '/pricing', label: '对比套餐价格' },
      { href: '/showcases', label: '查看改装案例展示' },
      { href: '/blog', label: '阅读改装教程文章' },
      { href: '/carmodder', label: '体验汽车改装可视化工具' },
    ],
  },
};

function getLocalizedHref(locale: string, href: string) {
  return locale === 'zh' ? `/zh${href}` : href;
}

export function InternalLinkHub({ locale }: { locale: string }) {
  const isZh = locale === 'zh';
  const content = isZh ? linkHubContent.zh : linkHubContent.en;

  return (
    <section className="container py-12">
      <div className="rounded-xl border bg-muted/20 p-6">
        <h2 className="text-xl font-semibold">{content.title}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{content.description}</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {content.links.map((item: LinkItem) => (
            <li key={item.href}>
              <a
                href={getLocalizedHref(locale, item.href)}
                className="text-primary underline-offset-4 hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
