'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  MoreVertical,
  Palette,
  PlayCircle,
  Rotate3D,
  Share2,
  ShoppingBag,
  Wallpaper,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { preconnect, preload } from 'react-dom';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel';
import { BeforeAfterSlider } from '@/shared/components/ui/before-after-slider';
import { beforeAfterItems } from '@/shared/config/before-after';

export default function CarModderLanding() {
  const t = useTranslations('pages.carmodder');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const heroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDciVRobZQzVQn_4Vgc4xRll_frKDXa0AjsS86SBFoXStRExyIwa0Dkn0YdsLuJ1BuJIdiuncl6usnfQSWqsISPMnEV4SQw1TMwKkB0yYAH59ALL1my1HgQQ28OHgqQ3dIMpWlT4sN8KM9YsK4GdK10kzQElQAScm6G5M3qHfLiShH2AhRDBNPUoItTi27W-5tIv80LK1R8N2S_dQD-_a14zHgFct5NsDUtuEXTIWQHkBY0Fh9KUKkKmEVDMicX0HOcuHBE2CRxRlzX';

  preconnect('https://lh3.googleusercontent.com', { crossOrigin: 'anonymous' });
  preconnect('https://images.unsplash.com', { crossOrigin: 'anonymous' });
  preload(heroImage, { as: 'image', fetchPriority: 'high' });
  preload(beforeAfterItems[0].beforeImage, {
    as: 'image',
    fetchPriority: 'high',
  });
  preload(beforeAfterItems[0].afterImage, {
    as: 'image',
    fetchPriority: 'high',
  });

  const featuredConfigs = [
    {
      id: 1,
      name: 'Concept Alpha',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBwFUIkDnnZFtjiE_Az2t2eZMLbdlxQrl5X3sv5TNIDWTCz6Fk6VagQYgu9ZXDZL-eexnEWR_N8ZUgvD_fO9IhWXey9NZQT3W4HfulSMuySYECdEQkHCh6NluWMCOtmudPsKzhXLZUzzjHBRFnMA-_5eQHaOAICHXw6qpZhiIvvB71IPHvqAD6Gy8ORicIH6wQWQDZ7lFkX_gNExsXpnQGL5_9A_jNcy_AiU35NqLtLy0HruH5iI0QLUr3-v19ydlJJzGJaH1jVpZud',
    },
    {
      id: 2,
      name: 'Concept Beta',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAZJvt63WYUuL2rBEN0penNHC-MVt8r0vCXfTJLc0RlHIwk7aSEZmkXDBw-CQ52X5kyevCFsNb8q466y6VwgPW7e233OM9c9D3Nn1YkvGFjlal2xxH7yFUBKGbeAagvIjPvNzo6RY4OCtdipEHNRFJmV-kGooKQMTFkHRwbvTQRkfzef0enbxCwtOJpn2lRhcXK0LEQpruslRI7TTzMHLFt5fYuvHv3ZFr6TJlXVNIjnHEUHLviyoaZyyws1x0XrJNBBBlgMRgT7hgp',
    },
    {
      id: 3,
      name: 'Concept Gamma',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCzbp2MbIqzBn3pXHxon0WsA6vmwUohT2KrYHcpRu6raupupn4_5EEnKwfDu3cajBpSOcNyXJULCs70ji5DBX5Fr_u6IH_1bq_hMJ7jnN4szTaqU1x6FuRQer1nD-ipFnixr4C4oDVzenzUh4hpisLPL61cmtDyRvpWGUoPKcFZfutO3pg-6sr_f5Wo8h5_Byz3CA-TjSkbtyRLUTNJKrUZimWlAGLU14wTESDsCXKzoo_ZcVnWjdRNuyzHwkDPVCG7SGxs97--j7l5',
    },
  ];

  const faqs = [
    {
      question: t('faq1Question'),
      answer: t('faq1Answer'),
    },
    {
      question: t('faq2Question'),
      answer: t('faq2Answer'),
    },
    {
      question: t('faq3Question'),
      answer: t('faq3Answer'),
    },
    {
      question: t('faq4Question'),
      answer: t('faq4Answer'),
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] font-[family-name:var(--font-sans)] text-white">
      {/* Navigation handled by layout */}

      <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
        <div className="absolute inset-0 z-0 bg-[#050505]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(71,37,244,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(71,37,244,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)] bg-[size:100px_100px]"></div>
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-[#4725f4]/20 mix-blend-screen blur-[120px]"></div>
          <div className="absolute right-0 bottom-0 h-[800px] w-[800px] rounded-full bg-[#4725f4]/10 mix-blend-screen blur-[150px]"></div>
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12">
          <div className="order-2 flex flex-col justify-center pt-10 text-center lg:order-1 lg:col-span-5 lg:pt-0 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 self-center rounded-full border border-[#4725f4]/30 bg-[#4725f4]/10 px-3 py-1 text-xs font-bold tracking-wider text-[#4725f4] lg:self-start"
            >
              <span className="h-2 w-2 animate-ping rounded-full bg-[#4725f4]"></span>
              {t('newKitAvailable')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-5xl leading-[1.1] font-bold tracking-tight text-white lg:text-7xl"
            >
              {t('visualizeYourDreamBuild')} <br />
              <span className="bg-gradient-to-r from-[#4725f4] to-purple-400 bg-clip-text text-transparent [text-shadow:0_0_20px_rgba(71,37,244,0.5)]">
                {t('dreamBuild')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-10 max-w-lg text-lg leading-relaxed font-light text-slate-200/90 lg:mx-0"
            >
              {t('ultimateConfiguratorDescription')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/carmodder"
                  className="group relative block w-full overflow-hidden rounded-full bg-[#4725f4] px-8 py-4 text-base font-bold text-white transition-all hover:shadow-[0_0_30px_rgba(71,37,244,0.4)] sm:w-auto"
                >
                  <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {t('startModding')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>

              <motion.button
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-8 py-4 text-base font-medium text-slate-50 transition-colors hover:bg-white/[0.12] sm:w-auto"
                whileHover={{ scale: 1.05 }}
              >
                <PlayCircle className="h-5 w-5 text-slate-200" />
                {t('watchDemo')}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex items-center justify-center gap-8 border-t border-white/10 pt-8 lg:justify-start"
            >
              <div>
                <div className="text-2xl font-bold text-white">{t('buildsCreatedCount')}</div>
                <div className="text-xs tracking-widest text-slate-300 uppercase">
                  {t('buildsCreated')}
                </div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <div className="text-2xl font-bold text-white">{t('texturesCount')}</div>
                <div className="text-xs tracking-widest text-slate-300 uppercase">
                  {t('textures')}
                </div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <div className="text-2xl font-bold text-white">{t('carModelsCount')}</div>
                <div className="text-xs tracking-widest text-slate-300 uppercase">
                  {t('carModels')}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative order-1 flex h-[50vh] w-full items-center justify-center [perspective:1000px] lg:order-2 lg:col-span-7 lg:h-[80vh]">
            <div className="absolute bottom-10 left-1/2 z-0 h-20 w-[80%] -translate-x-1/2 scale-y-50 rounded-[100%] bg-[#4725f4]/40 blur-[60px]"></div>

            <Carousel
              opts={{
                loop: true,
              }}
              className="w-full max-w-4xl"
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="group relative z-10 w-full transform cursor-pointer transition-transform duration-700 hover:scale-105">
                    <Image
                      className="h-auto w-full object-contain drop-shadow-2xl"
                      src={heroImage}
                      alt="Dark sports car with custom wheels and body kit in neon lighting - CarModSnap 3D visualization"
                      width={1600}
                      height={900}
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                </CarouselItem>

                <CarouselItem>
                  <div className="group relative z-10 w-full transform cursor-pointer transition-transform duration-700 hover:scale-105">
                    <Image
                      className="h-auto w-full object-contain drop-shadow-2xl"
                      src="/front_img/image_巴塞罗那MWC｜小米Vision..._7.png"
                      alt="CarModSnap platform demonstration at Barcelona MWC technology showcase"
                      width={1600}
                      height={900}
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                </CarouselItem>

                <CarouselItem>
                  <div className="group relative z-10 w-full transform cursor-pointer transition-transform duration-700 hover:scale-105">
                    <Image
                      className="h-auto w-full object-contain drop-shadow-2xl"
                      src="/front_img/image_巴塞罗那MWC｜小米Vision..._9.png"
                      alt="AI-powered car customization technology displayed at Barcelona MWC"
                      width={1600}
                      height={900}
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>

              <CarouselPrevious className="absolute top-1/2 left-4 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/30" />
              <CarouselNext className="absolute top-1/2 right-4 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/30" />
            </Carousel>

            <motion.div
              className="absolute top-20 right-0 hidden animate-bounce [animation-duration:3000ms] lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex w-16 flex-col items-center gap-3 rounded-2xl border-l-4 border-l-[#4725f4] bg-[rgba(19,16,34,0.6)] p-4 backdrop-blur-md">
                <div className="h-8 w-8 cursor-pointer rounded-full bg-red-500 ring-2 ring-transparent ring-offset-2 ring-offset-black transition-all hover:ring-white"></div>
                <div className="h-8 w-8 cursor-pointer rounded-full bg-blue-500 ring-2 ring-transparent ring-offset-2 ring-offset-black transition-all hover:ring-white"></div>
                <div className="h-8 w-8 cursor-pointer rounded-full bg-gray-200 ring-2 ring-transparent ring-offset-2 ring-offset-black transition-all hover:ring-white"></div>
                <div className="h-8 w-8 cursor-pointer rounded-full bg-yellow-400 ring-2 ring-transparent ring-offset-2 ring-offset-black transition-all hover:ring-white"></div>
                <div className="my-1 h-px w-full bg-white/20"></div>
                <Palette className="h-5 w-5 cursor-pointer text-white/50 hover:text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative z-20 overflow-hidden border-y border-white/5 bg-[#131022] py-6">
        <motion.div className="animate-marquee flex items-center gap-16 whitespace-nowrap opacity-80 transition-opacity duration-500 hover:opacity-100">
          <div className="flex items-center gap-3 text-lg font-medium tracking-wider text-white/90">
            <Rotate3D className="h-5 w-5 text-[#4725f4]" />{' '}
            {t('threeSixtyVisualization')}
          </div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-lg font-medium tracking-wider text-white/90">
            <Palette className="h-5 w-5 text-[#4725f4]" />{' '}
            {t('realTimeRendering')}
          </div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-lg font-medium tracking-wider text-white/90">
            <Share2 className="h-5 w-5 text-[#4725f4]" />{' '}
            {t('instantSharing')}
          </div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-lg font-medium tracking-wider text-white/90">
            <ShoppingBag className="h-5 w-5 text-[#4725f4]" />{' '}
            {t('oneClickOrdering')}
          </div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-lg font-medium tracking-wider text-white/90">
            <Rotate3D className="h-5 w-5 text-[#4725f4]" />{' '}
            {t('threeSixtyVisualization')}
          </div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-lg font-medium tracking-wider text-white/90">
            <Palette className="h-5 w-5 text-[#4725f4]" />{' '}
            {t('realTimeRendering')}
          </div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-lg font-medium tracking-wider text-white/90">
            <Share2 className="h-5 w-5 text-[#4725f4]" />{' '}
            {t('instantSharing')}
          </div>
          <div className="h-2 w-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-lg font-medium tracking-wider text-white/90">
            <ShoppingBag className="h-5 w-5 text-[#4725f4]" />{' '}
            {t('oneClickOrdering')}
          </div>
        </motion.div>
      </div>

      <section className="relative bg-[#131022] px-6 py-24">
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#4725f4]/50 to-transparent"></div>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                {t('communityBuilds')}
              </h2>
              <p className="text-slate-200/90">{t('trendingConfigs')}</p>
              <p className="mt-2 text-xs text-slate-300">
                {t('demoDataNotice')}
              </p>
            </div>
            <Link
              className="hidden items-center gap-2 text-[#4725f4] transition-colors hover:text-white md:flex"
              href="/showcases"
            >
              {t('viewGallery')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredConfigs.map((config, index) => (
              <motion.div
                key={config.id}
                className="group relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.08] transition-all duration-300 hover:border-[#4725f4]/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={config.image}
                    alt={`${config.name} - Custom car modification with wheels and body kit - CarModSnap community build`}
                    width={960}
                    height={720}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131022] to-transparent opacity-80"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-bold text-white">
                        {config.name}
                      </h3>
                      <p className="text-sm text-slate-200/90">
                        {t('sampleConcept')}
                      </p>
                    </div>
                    <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[#4725f4]/40 bg-[#4725f4]/15 px-3 text-xs font-semibold tracking-wide text-[#a5b4fc] uppercase">
                      Concept
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Comparison Section */}
      <section className="relative bg-[#0a0a14] px-6 py-24">
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#4725f4]/50 to-transparent"></div>
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-[#4725f4]/30 bg-[#4725f4]/10 px-4 py-2 text-xs font-bold tracking-wider text-[#4725f4]"
            >
              <span className="h-2 w-2 animate-ping rounded-full bg-[#4725f4]"></span>
              AI-Powered Transformation
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mt-6 mb-4 text-3xl font-bold text-white md:text-5xl"
            >
              See the{' '}
              <span className="bg-gradient-to-r from-[#4725f4] to-purple-400 bg-clip-text text-transparent">
                Difference
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-lg text-slate-200/90"
            >
              Drag the slider to explore example transformations and compare
              styling directions before committing to a real-world build.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {beforeAfterItems.map((item, index) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index % 2 === 0 ? 0 : 0.1 }}
                viewport={{ once: true }}
              >
                <BeforeAfterSlider
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  beforeFallbackImage={item.beforeFallbackImage}
                  afterFallbackImage={item.afterFallbackImage}
                  beforeLabel={item.beforeLabel}
                  afterLabel={item.afterLabel}
                  aspectRatio="video"
                />
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-slate-200/90">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link
              href="/carmodder"
              className="group relative inline-flex overflow-hidden rounded-full bg-[#4725f4] px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(71,37,244,0.4)]"
            >
              <span className="relative flex items-center justify-center gap-2">
                Create Your Transformation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FIND A LOCAL PRO SECTION - Commented out
      <section id="find-shop" className="w-full min-h-[85vh] flex items-center justify-center relative pt-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-40">
          <img alt="Dark modified sports car in a neon garage" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeDhVSJUkBVkpoG9AOd9dsm7vvj6NthGMQubdP4mwBTjqbBzWxmtS1T8yXVIX7Ka2atZ-PovVsgo9HWl_kw-lFP_D8gNQrvNv6Ov3WuDWK8oSfRrfOoDKry6k2B8cLIy0QCxqVpkqNC4XXQEgyFbm-ogJvmihSr6tkCXilQTasy3JrlbAJ8paKSY7wQWto5bb6emKIsvdDHKW-Q58kcaku2cC-Dlqo8gMkWHEZHcbeFDZ3kaMFB85SeoD3cDjymFUZ-oq3SdEASfKO" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#131022] via-[#131022]/80 to-[#131022]"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4725f4]/10 border border-[#4725f4]/20 text-[#4725f4] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#4725f4] animate-pulse"></span>
              {t('networkActive')}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white">
              {t('bringYourBuild')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4725f4] to-indigo-300">{t('toLife')}</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              {t('connectWithLocalShopsDescription')}
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <img alt="User portrait" className="w-10 h-10 rounded-full border-2 border-[#131022] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBepcf9o8DRbbQMlRVYGk9JSZZ8kl08SMupo7Sbcm8BRgew9aeDbTkUvNG3d-Jtfzn1Ozl07O4QVlongNR5G0RnYzH6TJCOpPuEOtUXMana0JffDOYMpXisAixcN0f5MUvCXOESCDmtW8j9I72hVNppouCoWlJq8gLrHXRhUE5zcwwKpeLzxUqLeYO67h93mdx7HG6awLlTM5VOxzNDoBxBwEsQLMOkkzOtDLHmqqHLgmkn7D22vP_8EikXCd4Yp-gZsBpR2LLNw5Jc" />
                <img alt="User portrait" className="w-10 h-10 rounded-full border-2 border-[#131022] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLKig7pekK34j1hnEJtwV4mKQDJn9kmk-StRSbK5OS66bkaUSn6X19VTG6B13Y4Q30wCG5E8nrfmvwbQ47D6XWGUsKIk3gwORT4Mse_wd8AUQ0xhJLxYfxK40Mmp4GKxEAMLDsSdBs5Pb1Oeeo8JIj6Jmm0hXN1VI71CQ2T70xGjSZ3T4uxG3n97q88OcLGpduw5mqHLvoZl-VjnVcPl_eqbmdK9hodLengXCpSlNsQBLRNv3ChzqK6ttnDcd_SaMDP6tn3vymUSOd" />
                <img alt="User portrait" className="w-10 h-10 rounded-full border-2 border-[#131022] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcWSMMOmCpbuCy4z8m3XlHH-ZMaYzR2B_F9KKEOPHBGGfL2Mrz8MNYGhvMntP0Yq1tg_-fjdhz44BQmc0HbSQK7jit4rtIKqUZeBM_5u2Z7_JhiMfo0nCJR5O1xL7zcsYEj0d2SRzuMES5WGibSxUJ2_t7n8uUbe1DCYgTlGmfbMkZi4h8c-eC2Ll_wljjtZdTF2LYghTUQntRXrbp5zZ-GRjPZU5wofILQbblUeOqWa9I2PPfbxzgT6EfcWWVLC5QhzMoyETqR_17" />
              </div>
              <div className="text-sm text-slate-300">
                <span className="text-white font-bold">2,400+</span> {t('enthusiastsConnected')}
              </div>
            </div>
          </div>

          <motion.div
            className="bg-[rgba(28,24,48,0.6)] backdrop-blur-md p-8 rounded-lg shadow-2xl shadow-[#4725f4]/10 w-full max-w-md mx-auto lg:ml-auto transform hover:scale-[1.01] transition-transform duration-500 border border-[rgba(71,37,244,0.1)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{t('findALocalPro')}</h2>
              <p className="text-slate-400 text-sm">{t('getQuotesFromCertifiedShops')}</p>
            </div>

            <form className="space-y-4" onSubmit={handleSearchShops}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-2 uppercase tracking-wide">{t('locationLabel')}</label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">location_on</span>
                  <input
                    className="w-full bg-[#26233b] border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-full focus:outline-none focus:border-[#4725f4] focus:ring-1 focus:ring-[#4725f4] placeholder-slate-500 transition-all"
                    placeholder={t('zipCodeOrCityPlaceholder')}
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-2 uppercase tracking-wide">{t('vehicleLabel')}</label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">directions_car</span>
                  <select
                    className="w-full bg-[#26233b] border border-slate-700 text-white pl-12 pr-10 py-3.5 rounded-full focus:outline-none focus:border-[#4725f4] focus:ring-1 focus:ring-[#4725f4] appearance-none cursor-pointer text-slate-300"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option disabled value="">{t('selectCarModel')}</option>
                    <option value="jdm">{t('jdmCars')}</option>
                    <option value="euro">{t('euroCars')}</option>
                    <option value="muscle">{t('muscleCars')}</option>
                    <option value="exotic">{t('exoticCars')}</option>
                    <option value="truck">{t('truckSuv')}</option>
                  </select>
                  <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-2 uppercase tracking-wide">{t('serviceLabel')}</label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">format_paint</span>
                  <select
                    className="w-full bg-[#26233b] border border-slate-700 text-white pl-12 pr-10 py-3.5 rounded-full focus:outline-none focus:border-[#4725f4] focus:ring-1 focus:ring-[#4725f4] appearance-none cursor-pointer text-slate-300"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                  >
                    <option disabled value="">{t('modificationType')}</option>
                    <option value="full_wrap">{t('fullColorChange')}</option>
                    <option value="chrome_delete">{t('chromeDelete')}</option>
                    <option value="ppf">{t('paintProtection')}</option>
                    <option value="tint">{t('windowTint')}</option>
                    <option value="ceramic">{t('ceramicCoating')}</option>
                  </select>
                  <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-[#4725f4] hover:bg-[#361bb8] text-white font-bold py-4 rounded-full mt-2 shadow-lg shadow-[#4725f4]/25 hover:shadow-[#4725f4]/40 transition-all duration-300 flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{t('getQuotesNow')}</span>
                <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </motion.button>

              <p className="text-center text-xs text-slate-500 mt-4">
                {t('freeServiceMessage')}
              </p>
            </form>
          </motion.div>
        </div>
      </section>
      */}

      <section className="relative z-10 w-full border-t border-slate-800 bg-[#131022] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold tracking-widest text-[#4725f4] uppercase">
              {t('support')}
            </span>
            <h2 className="mt-2 mb-4 text-3xl font-bold text-white md:text-4xl">
              {t('faqTitle')}
            </h2>
            <p className="text-slate-200/85">{t('faqDescription')}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                className="group overflow-hidden rounded-lg border border-slate-700/90 bg-[#1b1730] transition-all duration-300 open:border-[#4725f4]/50 open:ring-1 open:ring-[#4725f4]/20"
                onToggle={() => toggleFaq(index)}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-6">
                  <span className="text-lg font-medium text-white transition-colors group-hover:text-[#4725f4]">
                    {faq.question}
                  </span>
                  <ChevronDown className="h-5 w-5 text-slate-300 transition-transform group-open:rotate-180 group-open:text-[#4725f4]" />
                </summary>
                <div className="border-t border-slate-700/70 px-6 pt-4 pb-6 leading-relaxed text-slate-200/85">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-slate-800 bg-[#0f0d1c] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-xl border border-slate-700 bg-[#17132a] p-6">
          <h2 className="text-xl font-semibold text-white">
            {t('seoLinkHubTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {t('seoLinkHubDescription')}
          </p>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm">
            <li>
              <Link
                className="text-[#9f8cff] underline hover:text-white"
                href="/pricing"
              >
                {t('seoLinkPricing')}
              </Link>
            </li>
            <li>
              <Link
                className="text-[#9f8cff] underline hover:text-white"
                href="/showcases"
              >
                {t('seoLinkShowcases')}
              </Link>
            </li>
            <li>
              <Link
                className="text-[#9f8cff] underline hover:text-white"
                href="/blog"
              >
                {t('seoLinkBlog')}
              </Link>
            </li>
            <li>
              <Link
                className="text-[#9f8cff] underline hover:text-white"
                href="/carmodder"
              >
                {t('seoLinkVisualizer')}
              </Link>
            </li>
          </ul>
        </div>
      </section>

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

          {/* <a href="#find-shop">
            <motion.button
              className="flex items-center gap-2 bg-[#4725f4] hover:bg-[#361bb8] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-[#4725f4]/30 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <span className="material-icons text-xl">location_on</span>
              <span className="whitespace-nowrap">{t('findLocalWrapShop')}</span>
            </motion.button>
          </a> */}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] animate-pulse rounded-full bg-[#4725f4] mix-blend-screen blur-[128px] filter"></div>
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600 mix-blend-screen blur-[128px] filter"></div>
      </div>

    </div>
  );
}
