'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import autoScroll from 'embla-carousel-auto-scroll';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/shared/components/ui/carousel';

export default function CarModderLanding() {
  const t = useTranslations('pages.carmodder');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const featuredConfigs = [
    {
      id: 1,
      name: 'Concept Alpha',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwFUIkDnnZFtjiE_Az2t2eZMLbdlxQrl5X3sv5TNIDWTCz6Fk6VagQYgu9ZXDZL-eexnEWR_N8ZUgvD_fO9IhWXey9NZQT3W4HfulSMuySYECdEQkHCh6NluWMCOtmudPsKzhXLZUzzjHBRFnMA-_5eQHaOAICHXw6qpZhiIvvB71IPHvqAD6Gy8ORicIH6wQWQDZ7lFkX_gNExsXpnQGL5_9A_jNcy_AiU35NqLtLy0HruH5iI0QLUr3-v19ydlJJzGJaH1jVpZud',
    },
    {
      id: 2,
      name: 'Concept Beta',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZJvt63WYUuL2rBEN0penNHC-MVt8r0vCXfTJLc0RlHIwk7aSEZmkXDBw-CQ52X5kyevCFsNb8q466y6VwgPW7e233OM9c9D3Nn1YkvGFjlal2xxH7yFUBKGbeAagvIjPvNzo6RY4OCtdipEHNRFJmV-kGooKQMTFkHRwbvTQRkfzef0enbxCwtOJpn2lRhcXK0LEQpruslRI7TTzMHLFt5fYuvHv3ZFr6TJlXVNIjnHEUHLviyoaZyyws1x0XrJNBBBlgMRgT7hgp',
    },
    {
      id: 3,
      name: 'Concept Gamma',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzbp2MbIqzBn3pXHxon0WsA6vmwUohT2KrYHcpRu6raupupn4_5EEnKwfDu3cajBpSOcNyXJULCs70ji5DBX5Fr_u6IH_1bq_hMJ7jnN4szTaqU1x6FuRQer1nD-ipFnixr4C4oDVzenzUh4hpisLPL61cmtDyRvpWGUoPKcFZfutO3pg-6sr_f5Wo8h5_Byz3CA-TjSkbtyRLUTNJKrUZimWlAGLU14wTESDsCXKzoo_ZcVnWjdRNuyzHwkDPVCG7SGxs97--j7l5',
    }
  ];

  const faqs = [
    {
      question: t('faq1Question'),
      answer: t('faq1Answer')
    },
    {
      question: t('faq2Question'),
      answer: t('faq2Answer')
    },
    {
      question: t('faq3Question'),
      answer: t('faq3Answer')
    },
    {
      question: t('faq4Question'),
      answer: t('faq4Answer')
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-[family-name:var(--font-sans)]">
      {/* Navigation handled by layout */}

      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505] z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(71,37,244,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(71,37,244,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]"></div>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#4725f4]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#4725f4]/10 rounded-full blur-[150px] mix-blend-screen"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left pt-10 lg:pt-0 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1 rounded-full border border-[#4725f4]/30 bg-[#4725f4]/10 text-[#4725f4] text-xs font-bold tracking-wider mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#4725f4] animate-ping"></span>
              {t('newKitAvailable')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
            >
              {t('visualizeYourDreamBuild')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4725f4] to-purple-400 [text-shadow:0_0_20px_rgba(71,37,244,0.5)]">{t('dreamBuild')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-400 mb-10 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed"
            >
              {t('ultimateConfiguratorDescription')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link href="/carmodder" className="w-full sm:w-auto">
                <motion.button
                  className="group relative px-8 py-4 bg-[#4725f4] text-white text-base font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(71,37,244,0.4)] w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {t('startModding')}
                    <span className="material-icons group-hover:translate-x-1 transition-transform">tune</span>
                  </span>
                </motion.button>
              </Link>

              <motion.button
                className="px-8 py-4 bg-transparent border border-white/10 text-white text-base font-medium rounded-full hover:bg-white/5 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="material-icons text-gray-400">play_circle</span>
                {t('watchDemo')}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center lg:justify-start gap-8"
            >
              <div>
                <div className="text-2xl font-bold text-white">Beta</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{t('buildsCreated')}</div>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div>
                <div className="text-2xl font-bold text-white">Demo</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{t('textures')}</div>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
                {t('demoDataNotice')}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 relative h-[50vh] lg:h-[80vh] w-full flex items-center justify-center order-1 lg:order-2 [perspective:1000px]">
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-[#4725f4]/40 blur-[60px] rounded-[100%] z-0 scale-y-50"></div>

            <Carousel 
              opts={{ 
                loop: true 
              }} 
              className="w-full max-w-4xl"
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="relative z-10 w-full transform transition-transform duration-700 hover:scale-105 cursor-pointer group">
                    <div className="absolute top-[35%] left-[20%] z-20 group/spot">
                      <div className="w-4 h-4 bg-[#4725f4] rounded-full animate-ping absolute"></div>
                      <div className="w-4 h-4 bg-white rounded-full relative shadow-[0_0_15px_#4725f4] cursor-pointer hover:scale-125 transition-transform"></div>
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/spot:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs text-white">
                        {t('customForgedRims')}
                      </div>
                    </div>

                    <div className="absolute top-[45%] right-[25%] z-20 group/spot">
                      <div className="w-4 h-4 bg-[#4725f4] rounded-full animate-ping absolute"></div>
                      <div className="w-4 h-4 bg-white rounded-full relative shadow-[0_0_15px_#4725f4] cursor-pointer hover:scale-125 transition-transform"></div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/spot:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs text-white">
                        {t('aeroSideSkirts')}
                      </div>
                    </div>

                    <img
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDciVRobZQzVQn_4Vgc4xRll_frKDXa0AjsS86SBFoXStRExyIwa0Dkn0YdsLuJ1BuJIdiuncl6usnfQSWqsISPMnEV4SQw1TMwKkB0yYAH59ALL1my1HgQQ28OHgqQ3dIMpWlT4sN8KM9YsK4GdK10kzQElQAScm6G5M3qHfLiShH2AhRDBNPUoItTi27W-5tIv80LK1R8N2S_dQD-_a14zHgFct5NsDUtuEXTIWQHkBY0Fh9KUKkKmEVDMicX0HOcuHBE2CRxRlzX"
                      alt="Sleek dark sports car in neon environment representing Xiaomi SU7"
                    />
                  </div>
                </CarouselItem>
                

                

                
                <CarouselItem>
                  <div className="relative z-10 w-full transform transition-transform duration-700 hover:scale-105 cursor-pointer group">
                    <img
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      src="/front_img/image_巴塞罗那MWC｜小米Vision..._7.png"
                      alt="Barcelona MWC image 7"
                    />
                  </div>
                </CarouselItem>
                
                <CarouselItem>
                  <div className="relative z-10 w-full transform transition-transform duration-700 hover:scale-105 cursor-pointer group">
                    <img
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      src="/front_img/image_巴塞罗那MWC｜小米Vision..._9.png"
                      alt="Barcelona MWC image 9"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" />
            </Carousel>

            <motion.div
              className="absolute right-0 top-20 hidden lg:block animate-bounce [animation-duration:3000ms]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="bg-[rgba(19,16,34,0.6)] backdrop-blur-md p-4 rounded-2xl flex flex-col gap-3 w-16 items-center border-l-4 border-l-[#4725f4]">
                <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer ring-2 ring-offset-2 ring-offset-black ring-transparent hover:ring-white transition-all"></div>
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer ring-2 ring-offset-2 ring-offset-black ring-transparent hover:ring-white transition-all"></div>
                <div className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer ring-2 ring-offset-2 ring-offset-black ring-transparent hover:ring-white transition-all"></div>
                <div className="w-8 h-8 rounded-full bg-yellow-400 cursor-pointer ring-2 ring-offset-2 ring-offset-black ring-transparent hover:ring-white transition-all"></div>
                <div className="h-px w-full bg-white/20 my-1"></div>
                <span className="material-icons text-white/50 text-xl cursor-pointer hover:text-white">palette</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-[#131022] border-y border-white/5 overflow-hidden py-6 relative z-20">
        <motion.div
          className="flex gap-16 items-center whitespace-nowrap animate-marquee opacity-60 hover:opacity-100 transition-opacity duration-500"
        >
          <div className="flex items-center gap-3 text-white/80 text-lg tracking-wider font-medium">
            <span className="material-icons text-[#4725f4]">3d_rotation</span> {t('threeSixtyVisualization')}
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-white/80 text-lg tracking-wider font-medium">
            <span className="material-icons text-[#4725f4]">blur_on</span> {t('realTimeRendering')}
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-white/80 text-lg tracking-wider font-medium">
            <span className="material-icons text-[#4725f4]">share</span> {t('instantSharing')}
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-white/80 text-lg tracking-wider font-medium">
            <span className="material-icons text-[#4725f4]">shopping_bag</span> {t('oneClickOrdering')}
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-white/80 text-lg tracking-wider font-medium">
            <span className="material-icons text-[#4725f4]">3d_rotation</span> {t('threeSixtyVisualization')}
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-white/80 text-lg tracking-wider font-medium">
            <span className="material-icons text-[#4725f4]">blur_on</span> {t('realTimeRendering')}
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-white/80 text-lg tracking-wider font-medium">
            <span className="material-icons text-[#4725f4]">share</span> {t('instantSharing')}
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="flex items-center gap-3 text-white/80 text-lg tracking-wider font-medium">
            <span className="material-icons text-[#4725f4]">shopping_bag</span> {t('oneClickOrdering')}
          </div>
        </motion.div>
      </div>

      <section className="py-24 px-6 bg-[#131022] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4725f4]/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('communityBuilds')}</h2>
              <p className="text-gray-400">{t('trendingConfigs')}</p>
              <p className="text-xs text-gray-500 mt-2">{t('demoDataNotice')}</p>
            </div>
            <a className="hidden md:flex items-center gap-2 text-[#4725f4] hover:text-white transition-colors" href="#">
              {t('viewGallery')} <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredConfigs.map((config, index) => (
              <motion.div
                key={config.id}
                className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-[#4725f4]/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={config.image}
                    alt={`${config.name} car configuration`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131022] to-transparent opacity-80"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{config.name}</h3>
                      <p className="text-sm text-gray-400">{t('sampleConcept')}</p>
                    </div>
                    <motion.button
                      className="w-10 h-10 rounded-full bg-[#4725f4]/20 text-[#4725f4] flex items-center justify-center hover:bg-[#4725f4] hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="material-icons text-sm">favorite</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

      <section className="w-full py-20 px-4 sm:px-6 relative z-10 bg-[#131022] border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#4725f4] font-bold tracking-widest text-sm uppercase">{t('support')}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">{t('faqTitle')}</h2>
            <p className="text-slate-400">{t('faqDescription')}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                className="group bg-[#1c1830] border border-slate-800 rounded-lg overflow-hidden transition-all duration-300 open:border-[#4725f4]/50 open:ring-1 open:ring-[#4725f4]/20"
                onToggle={() => toggleFaq(index)}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-medium text-lg text-white group-hover:text-[#4725f4] transition-colors">{faq.question}</span>
                  <span className="material-icons text-slate-500 transition-transform group-open:rotate-180 group-open:text-[#4725f4]">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="bg-[#1c1830]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_-5px_rgba(71,37,244,0.7)] rounded-full p-2 pl-6 pr-2 flex items-center gap-4 pointer-events-auto max-w-full overflow-hidden">
          <div className="flex items-center gap-4 border-r border-white/10 pr-4 hidden sm:flex">
            <button className="group relative flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors">
              <span className="material-icons text-2xl">wallpaper</span>
              <span className="absolute -top-10 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {t('saveWallpaper')}
              </span>
            </button>
            <button className="group relative flex flex-col items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
              <span className="font-bold text-lg">RED</span>
              <span className="absolute -top-10 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {t('shareToXiaohongshu')}
              </span>
            </button>
          </div>

          <button className="sm:hidden text-gray-400">
            <span className="material-icons">more_vert</span>
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

      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#4725f4] rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px]"></div>
      </div>

      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    </div>
  );
}
