'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  AutoAwesome,
  MapPin,
  MoreVertical,
  Wallpaper,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import { getShowcaseUrl, showcaseEntries } from '@/shared/data/showcases';

export default function CommunityShowcase() {
  const t = useTranslations('pages.carmodder');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', name: t('all') },
    { id: 'trending', name: t('trending') },
    { id: 'latest', name: t('latest') },
    { id: 'jdm', name: t('jdmLegends') },
    { id: 'euro', name: t('euroLuxury') },
  ];

  const showcaseItems = showcaseEntries.map((item) => ({
    ...item,
    badge: item.badge === 'Wrap of the Month' ? t('wrapOfTheMonth') : item.badge,
  }));
  const filteredItems =
    activeFilter === 'all'
      ? showcaseItems
      : showcaseItems.filter((item) => item.filter === activeFilter);

  return (
    <div className="min-h-screen bg-[#131022] font-[family-name:var(--font-sans)] text-white">
      <header className="sticky top-14 z-30 w-full border-b border-white/12 bg-[#131022]/90 shadow-[0_12px_30px_-26px_rgba(0,0,0,0.95)] backdrop-blur-xl lg:top-18">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4725f4] shadow-[0_0_20px_rgba(71,37,244,0.5)]">
              <AutoAwesome className="h-5 w-5 text-white" />
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
          {filteredItems.map((item, index) => (
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
                <Image
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={item.image}
                  alt={item.imageAlt}
                  width={960}
                  height={
                    item.aspect === 'portrait'
                      ? 1280
                      : item.aspect === 'landscape'
                        ? 540
                        : 960
                  }
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
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
                  <Link
                    href={getShowcaseUrl(item.slug)}
                    className={`mb-1 block font-bold text-white hover:text-[#c7bbff] ${
                      item.aspect === 'landscape' ? 'text-lg' : 'text-xl'
                    }`}
                  >
                    {item.title}
                  </Link>
                  <p className="mb-3 line-clamp-2 text-sm text-slate-200/85">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="flex items-center gap-2">
                      {item.avatar ? (
                        <Image
                          className="h-8 w-8 rounded-full border border-white/20 object-cover"
                          src={item.avatar}
                          alt={item.creator}
                          width={32}
                          height={32}
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
                      CONCEPT
                    </span>
                  </div>
                  <div className="mt-3">
                    <Link
                      href={getShowcaseUrl(item.slug)}
                      className="text-sm font-semibold text-[#c7bbff] hover:text-white"
                    >
                      View concept brief
                    </Link>
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
              <Wallpaper className="h-6 w-6" />
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
            <MoreVertical className="h-5 w-5" />
          </button>

          <motion.button
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#4725f4] px-6 py-3 font-bold text-white shadow-lg shadow-[#4725f4]/30 transition-all hover:scale-105 hover:bg-[#361bb8] active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></span>
            <MapPin className="h-5 w-5" />
            <span className="whitespace-nowrap">{t('findLocalWrapShop')}</span>
          </motion.button>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] animate-pulse rounded-full bg-[#4725f4] mix-blend-screen blur-[128px] filter"></div>
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600 mix-blend-screen blur-[128px] filter"></div>
      </div>

    </div>
  );
}
