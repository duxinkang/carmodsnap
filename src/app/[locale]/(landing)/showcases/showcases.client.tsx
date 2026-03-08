'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function CommunityShowcase() {
  const t = useTranslations('pages.carmodder');
  const [activeFilter, setActiveFilter] = useState('trending');

  const filters = [
    { id: 'trending', name: t('trending') },
    { id: 'latest', name: t('latest') },
    { id: 'jdm', name: t('jdmLegends') },
    { id: 'euro', name: t('euroLuxury') },
  ];

  const showcaseItems = [
    {
      id: 1,
      title: 'Cyber Porsche 911',
      creator: '@turbo_tom',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBjQeU8ByQCyrRUYs8TyOmpEFVfzNfAfh9tQkLGfcbSVSKP2e9QhIONoOOmCZk31zC8gw__-fWKZqrOkHzqz3XVUCGBJsR1LPFK5EGi5ZlyhrOG6KrhzK40nFn6ZLMZXDITWwKrH8Kl_mZP3sMtQw36X0m9MBwLNwcChjss3S6kmH7NafXKmya5mDEN-EfTLmgeGf5y2g-cQFhdaw3kscZ85toRAWhRGbEgEeJCFxmXrOrV6_5WPpGhTaeSpsthRDDARTJnlumZpzKV',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCWgCqsD7JPUMDDT0EBw13Ar8OnDBveJmD1T0MEcyfyeSz4aeFunqkYcmEDmBWpMm6zZUSXFsLkhPDInThYn6-yxqn58UyjY6qwmTegIzQsoIktXH65fUF-hPVWyBVe_8nIgkj7UkgA2XvLalb-au7u0IDUkvrrMLPKOuQmUrzYVd0EDPC82syI8g5Pcbut0gT3C9Mi5SPkMboVwXPjBSP-eQewASZjypE0qIayuJdp5VlSCA-Hq10n86tzum1Dn7TAYIctBCamSZVC',
      badge: t('wrapOfTheMonth'),
      tags: ['Matte Black', 'Widebody'],
      aspect: 'portrait',
    },
    {
      id: 2,
      title: 'Neon Benz GT',
      creator: '@sarah_drifts',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAtgdkG6AZ9nAi9niwTJPoMyHRhNhXGmdK4r6EONGZSsIqybaG2NnGCNkUJMP2QQJDVameFTqjFQiIbwNYnF3sT8hKlrJYyv1rh9YrbfO9jdO7coJ_DP5jpi6EtlznCRvpaUmEng1UWSOffgU_rZeiXJIaDYK84in_zes2AwLA1EdZAS0baJ07HvkpW4TUJGefuDjBhkLvG1Ffm_YB4i_5__grqJwMYfPYEFneZsl-ugOjUWXBzrE34Dt5zwkUSpjrXp8AN2HGLAweo',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDuV_qNiFd_5kV5cnF15sDPXM0YXvWoUQtNnatSkK8m1zWQ6NkjJ67gSu7pEjPrWXd1lmWOTuVz8s3HzOz-GJc8aSXqm-kJUZMc22r5nxV9jHbb59eFhYC2vPoPKLBXcg-yREQzUpF-6LsPBfdpv-tcsWsXoUivjKxbo_8gNTvH9qqLgTlJovwnkaDyLcPqT9RqtW8ATTkk6FcA3JrVWeZfSjJLMOQb3L6cyHkhQheQKeidPHtzq5_pDgkcJSmxppGBd8720Xp8WrMm',
      aspect: 'landscape',
    },
    {
      id: 3,
      title: 'Midnight Runner GTR',
      creator: '@kai_works',
      avatar: null,
      avatarInitial: 'K',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBHNcdsgszUHbz20v14p-dxPnqEV6BOq4wQXh_5RLbyEuOl4L6-xtgl8IAeU7Cany_ZFPI3t0nwo13_WsKo6yCiXbsyWFtegpCtlcUHCSvktPsJzikw_7NkqfUINB3ZRb3mo9zwPKp35j-riN4urK1RK0J_CDefhe0fjOk0h3I7iKbHOaCVsKQi5Ox1BW5oYtfGuw3Qsy_xze4JmfTxO-LB6sjgce6a4XFAJVE43fOsyhfsqeq1MPAWUTKa6kH5v8OcNxYFpXQX_UVn',
      tags: ['Chameleon'],
      aspect: 'portrait',
    },
    {
      id: 4,
      title: 'Stealth Mode RS7',
      creator: '@audi_fanatic',
      avatar: null,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAlG2eiawuDJLx6jRqfEZoVkSniNfMVLIvzNjH59HA7sF9q8_GNF7jjgDx9C-yCzTwpBmDht4x3xPWxysOV_6XoM4WAvadfiIwYWwsxqR2_qxA9rrBCGvqRibumVHQXW_y6zmr6Q3KjGfx01fyiMsPPaEB6H2zPcg02cIxedas_AIZcCju0iXaayK0zV4ha5iM0Wt9Nl6t2_oZbpAiaFB8uFl9ynCbnRIsSuCODvfcbuf2IwXvEpnzH0dgy1Gfte7KBi_pAZrYtuaQD',
      aspect: 'square',
    },
    {
      id: 5,
      title: 'Drift Spec M4',
      creator: '@sideways_sam',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCsH4eDKFEFqigYwdpKfAQNbQ0A2tQSB9HyOJ6D41E6WufNUnQnWG5F-di2UMHnUwF8ei_o9rkcySQnBtiogdjR2bt4R7pcPZIbEvAJTbTp93tucpdGaEyFYojZTEwwp7TPdB0Jhi6lw8oOqXG9ZoMqxMNzMS_2embG7sO4OIbfwbE84q4itVlEgLn7AROEghKc5TpjEgX92TN-Nas7d5rgulu58FruWRB1yPVQ_gIH4IsP70PMKibFNCdf1XdPbN5MBqGTKTb3AS6y',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC5ZggYKJ4T9Q3uUR5h6uYOGspW0AWN9O0crYbJDJ-UEmFwjXwmrjGZM8EnrxyUcdp2ZwYQI5OXvfrp9f-lSUtI1j3Vgv9MJif3U4gx9WJx59hzmHpW1h-GjcSmSdnhVpkQ4bu4vJsO_0s1KFIQvQhQXJIaM2pXyeCbYYj6q0VIzzMRRsM8ZuLj5N45ynE6fyK7BpeC-Rkm1nsiIscd2DlMLsu1rJzEFZO2yujEnZUdjkIpoxFzHnreZJhtyyvCtj5qZUzleTQ_n1DY',
      tags: ['Satin White'],
      aspect: 'portrait',
    },
    {
      id: 6,
      title: 'Cherry Bomb Supra',
      creator: '@jdm_king',
      avatar: null,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAb3PhsvqgkVJ6Ynp6DXBkbl_YkIeiO-9JUNvaV34NPig6m76b1jLgdqXaVxkUjZMnDmJyRriWLtY1XHlOSUmJOEBvT1zHa8l7BAq54xF_hdkPPBUvn4y9_yIVUmqbyf__l4m554Ex3OMLf1bTF9f0rsh6ZfOXVY4m_TdldS4mLAfPlSZuCZb8hGrOVY_gJ7iloYZ0ZsYt6AIAw7_IbOUa0R44krY02gwMNfMl1lASn3F9uF6--Qd1draVf78W9lsYWrgZzxR6Tls5j',
      aspect: 'landscape',
    },
    {
      id: 7,
      title: 'Alcantara Custom',
      creator: '@stitch_works',
      avatar: null,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBt79p3YRy1J_d3vMJHA6hPQYmDHWzQjLxG5ap7xBpOgLgjiq948ESfJf8kr-YHbGYKJ3tWnwRliMoIw456DeWsVtCuvJU3BpOlATSDLbXpLNrCo5cm_NP6FweBr1xD68lcqExnoubbdGUwGBPTrngK8mw1yRxmYQj7bVX1ynC5J724Gd4nzPA_G7NDhUW2JS7Tn3OuCWn1EFtWTL07HxueOyXZjG0a3buIP48qez0436gYjVOuUDOYBZ_gnjhizd6AaQFi1J_R6RQc',
      tags: ['Interior'],
      aspect: 'portrait',
    },
  ];

  return (
    <div className="min-h-screen bg-[#131022] font-[family-name:var(--font-sans)] text-white">
      <header className="sticky top-14 z-30 w-full border-b border-white/12 bg-[#131022]/90 shadow-[0_12px_30px_-26px_rgba(0,0,0,0.95)] backdrop-blur-xl lg:top-18">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4725f4] shadow-[0_0_20px_rgba(71,37,244,0.5)]">
              <span className="material-icons text-white">auto_fix_high</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight uppercase">
                {t('wallOfFame')}
              </h1>
              <p className="text-xs text-slate-200/85">
                {t('communityBuildsSeason')}
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:w-auto md:pb-0 [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                className={`rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? 'bg-[#4725f4] text-white shadow-[0_0_20px_-5px_rgba(71,37,244,0.5)]'
                    : 'border border-white/15 bg-[#1c1833]/92 text-slate-100/90 hover:border-[#4725f4]/50 hover:text-white'
                }`}
                onClick={() => setActiveFilter(filter.id)}
                whileHover={{ scale: 1.02 }}
              >
                {filter.name}
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:px-8">
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative break-inside-avoid overflow-hidden rounded-lg border border-white/5 bg-[#1c1833] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_-5px_rgba(71,37,244,0.5)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div
                className={`relative w-full overflow-hidden ${
                  item.aspect === 'portrait'
                    ? 'aspect-[3/4]'
                    : item.aspect === 'landscape'
                      ? 'aspect-video'
                      : 'aspect-square'
                }`}
              >
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={item.image}
                  alt={item.title}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/90 ${
                    item.aspect === 'landscape'
                      ? 'via-transparent'
                      : 'via-black/20'
                  } to-transparent opacity-90`}
                ></div>

                {item.badge && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md">
                      {item.badge}
                    </span>
                  </div>
                )}

                <div className="absolute right-0 bottom-0 left-0 p-5">
                  {item.tags && (
                    <div className="mb-2 flex gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="rounded-full border border-[#4725f4]/30 bg-[#4725f4]/30 px-2 py-0.5 text-[10px] text-[#a5b4fc] backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3
                    className={`mb-1 font-bold text-white ${
                      item.aspect === 'landscape' ? 'text-lg' : 'text-xl'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="flex items-center gap-2">
                      {item.avatar ? (
                        <img
                          className="h-8 w-8 rounded-full border border-white/20"
                          src={item.avatar}
                          alt={item.creator}
                        />
                      ) : item.avatarInitial ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-[#4725f4] text-xs font-bold text-white">
                          {item.avatarInitial}
                        </div>
                      ) : null}
                      <span className="text-sm font-medium text-gray-200">
                        {item.creator}
                      </span>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-xs font-semibold tracking-wide text-white/90">
                      DEMO
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            className="group relative flex break-inside-avoid flex-col items-center justify-center overflow-hidden rounded-lg border border-[#4725f4]/30 bg-gradient-to-br from-[#4725f4]/20 to-[#1c1833] p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="material-icons mb-3 text-4xl text-[#4725f4]">
              campaign
            </span>
            <h3 className="mb-2 text-xl font-bold text-white">
              {t('joinTheChallenge')}
            </h3>
            <p className="mb-4 text-sm text-slate-200/90">{t('submitYourWrap')}</p>
            <motion.button
              className="rounded-full bg-[#4725f4] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#361bb8]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('submitBuild')}
            </motion.button>
          </motion.div>
        </div>
      </main>

      <div className="pointer-events-none fixed right-0 bottom-8 left-0 z-50 flex justify-center px-4">
        <div className="pointer-events-auto flex max-w-full items-center gap-4 overflow-hidden rounded-full border border-white/15 bg-[#17132a]/88 p-2 pr-2 pl-6 shadow-[0_0_30px_-5px_rgba(71,37,244,0.7)] backdrop-blur-xl">
          <div className="flex hidden items-center gap-4 border-r border-white/15 pr-4 sm:flex">
            <button className="group relative flex flex-col items-center justify-center text-slate-200/85 transition-colors hover:text-white">
              <span className="material-icons text-2xl">wallpaper</span>
              <span className="pointer-events-none absolute -top-10 rounded bg-black px-2 py-1 text-[10px] whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                {t('saveWallpaper')}
              </span>
            </button>
            <button className="group relative flex flex-col items-center justify-center text-slate-200/85 transition-colors hover:text-red-400">
              <span className="text-lg font-bold">RED</span>
              <span className="pointer-events-none absolute -top-10 rounded bg-black px-2 py-1 text-[10px] whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                {t('shareToXiaohongshu')}
              </span>
            </button>
          </div>

          <button className="text-slate-200/85 sm:hidden">
            <span className="material-icons">more_vert</span>
          </button>

          <motion.button
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#4725f4] px-6 py-3 font-bold text-white shadow-lg shadow-[#4725f4]/30 transition-all hover:scale-105 hover:bg-[#361bb8] active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></span>
            <span className="material-icons text-xl">location_on</span>
            <span className="whitespace-nowrap">{t('findLocalWrapShop')}</span>
          </motion.button>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] animate-pulse rounded-full bg-[#4725f4] mix-blend-screen blur-[128px] filter"></div>
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600 mix-blend-screen blur-[128px] filter"></div>
      </div>

      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
