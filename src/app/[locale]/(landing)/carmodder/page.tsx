'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function CarModderConfigurator() {
  const t = useTranslations('pages.carmodder');

  const [activeTab, setActiveTab] = useState('paint');
  const [selectedModel, setSelectedModel] = useState('gtr-alpha');
  const [selectedColor, setSelectedColor] = useState('midnight');
  const [chromeDelete, setChromeDelete] = useState(true);
  const [carbonRoof, setCarbonRoof] = useState(false);

  const carModels = [
    { id: 'gtr-alpha', name: 'GT-R Alpha', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYteF3CmMGa4Dvr8C54J4R00-1F0pFhGln4vPSVtN6cYRAK6jMs9hfl8-UsPpw1vqyPhpaUrudxXbqO97695sXgM2VxzzjbluiVu8_razlyebXDSRuTdcCegpDZK2WnTD6LnNhi2RSWbfMhFRLzkE4K743AH2VO4pyFFyVRQ2HsjC-44xpDkPG3_Qup0mG0J3pnDpvHM9L3EiiooNBU_3EdR_G7rsP2XhQBsRL6Z_ydQGtGK0LKXMZLYOj7UqAde3vCTZuSMbWNz7j' },
    { id: 'camaro-ss', name: 'Camaro SS', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvkdsvIASo9VYxEGtZfE93g2hbXenOuPKkNsXOF7K-pBPngQHMcPyO7yQQkI9bI-PwjxlWzBBdhUnkPHVoszWVbBXszhXSANCdlBdtsyp0YabJmyaPLu2-NyFpD3BWUC-GM09MDw5At_IRGgcNsPgAy_HNX-Rzl2fBmLLuagIU4Kj6SGqshfBmFl6I5gKqUGq3tC8HeaPp3KhCVqT3tGS0XbyyOx-e7wptFbkZkN7aooGBa4AMr325y32rsD4ruISgO529tLIbKEXe' },
    { id: 'mustang-gt', name: 'Mustang GT', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXO_02dH43yvUrxz5Za3DXRbIzreGDSSLHoeID1-AOx1frhFDdP0LuBfNM2TB1u3YiQBAGRRGOvBEiOzcZ-kB-dWn2m_6kl4Y53equhZ5hx4Evq_8sWu5nSv4i8zJ10nGME_MhAMJr4bXWAIUAQKW62kP-Vx1QUg9ijMwp0tc7faKu0jUc-r8WXq6jWRs7aDV6b5fgKs-UV7HUZoCLWzhB1TnBLPGeOfYalayYZs-AydBLISeDpDI4K5infBflgC-OV4_D0CR7PMVp' },
    { id: 'charger-srt', name: 'Charger SRT', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWmjJfBqd3blotv3p7l-bFPEW6bOCzaehZkqwIC26Y0srFqiQqxlOf1OvW3F5DVuiW8oTuG6ZXDS2Z60Q_Hu0HRW_QoIBKkb6RvEeJhYfF_K-tS08Oq4ghlG7mmfIGp_eUJwSrPRL-npve8Fe_lwEBCfyLycd43zTh8bTH8CfsZAbjaIfa1ZvrX_2mkGhR6LM3eVJWOphUq7-zUqIK4spglFW3Ri4eQRUG3pT_ItXs59ciO02DJVFmkNtfZxL8LPFO0Hd2jxHvGP7P' },
    { id: 'gr-supra', name: 'GR Supra', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkVVUdghPFve7r32Uh_Y7R-7tdnF502w5kzN6HJuTJ3vcY9deDPz2Df3TeYzzCyVH6DdL4kQyP9oJOLU5eGIxzoDWuJcwm415wYV6Y7JrzCEXqQvpUihmuYpGVdsLwHdv-jbGr_xqPLHRFkSK9diGl9VWbQRVSgCdYIDKQeligqnglfJQLN0DFhaWPfliQTCBHbbrWEqzRyVAlFAZ1-3tqC3FQEd9QMEVUFaMV2yENHIZ6IXw74Ew7j9iyIo3Q_5pEzO0Y4aranHG5' },
  ];

  const paintColors = [
    { id: 'midnight', name: 'Midnight', color: '#1a1a1a' },
    { id: 'crimson', name: 'Crimson', color: '#800020' },
    { id: 'navy', name: 'Navy', color: '#003366' },
    { id: 'white', name: 'Pearl White', color: '#f0f0f0' },
    { id: 'gunmetal', name: 'Gunmetal', color: '#4a5568' },
    { id: 'gold', name: 'Gold', color: '#d69e2e' },
    { id: 'gradient', name: 'Purple-Indigo', gradient: 'from-purple-500 to-indigo-500' },
  ];

  const finishTypes = [
    { id: 'gloss-metallic', name: t('glossMetallic') },
    { id: 'matte-wrap', name: t('matteWrap') },
    { id: 'satin-pearl', name: t('satinPearl') },
    { id: 'chrome', name: t('chrome') },
  ];

  const [selectedFinish, setSelectedFinish] = useState('gloss-metallic');

  return (
    <div className="min-h-screen bg-[#131022] text-white overflow-hidden font-[family-name:var(--font-sans)]">
      <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-full bg-[#4725f4] flex items-center justify-center shadow-[0_0_20px_rgba(71,37,244,0.5)]"
            whileHover={{ scale: 1.05 }}
          >
            <span className="material-icons text-white text-xl">speed</span>
          </motion.div>
          <span className="text-xl font-bold tracking-widest uppercase">ModPlayground</span>
        </div>
        <div className="pointer-events-auto flex gap-4">
          <motion.button
            className="p-3 rounded-full bg-[#26233b]/50 hover:bg-[#26233b] transition-colors backdrop-blur-md border border-white/5"
            whileHover={{ scale: 1.05 }}
          >
            <span className="material-icons text-white/70">account_circle</span>
          </motion.button>
          <motion.button
            className="p-3 rounded-full bg-[#26233b]/50 hover:bg-[#26233b] transition-colors backdrop-blur-md border border-white/5"
            whileHover={{ scale: 1.05 }}
          >
            <span className="material-icons text-white/70">menu</span>
          </motion.button>
        </div>
      </nav>

      <main className="flex-1 flex relative h-screen">
        <section className="flex-1 relative bg-gradient-to-br from-[#1a162e] to-[#0d0b16] flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4725f4]/10 via-transparent to-transparent opacity-50"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_top,rgba(71,37,244,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(71,37,244,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_top,black,transparent)]"></div>

          <div className="relative w-full max-w-5xl aspect-[16/9] z-10 group">
            <motion.img
              key={selectedModel}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsZWumdXQb7TShmm6XfRQwTXJAyf3KHIFPmLS-U7ZFanr2PddZ1EiCieYOdYC_0HYXxoUpN987fwAmFKyDy-ffMZakhAgeLZUxUjE-gx727W4zaIUmtWcloEjq0UR5wejDfLSOpICKNyuFetz9iDQin3MycbNggpD3qm6IIbg_Hh99jMCOXiSfp83uaGmEvaAbTJoCvIo5qnqcnWll0u52jse0t4fXXq7xw5rfRMtBA_pBvO2nQjzxiZxkgyH73mgYvZv1z85LSyED"
              alt="GT-R Alpha Car"
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-105"
            />

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/50 backdrop-blur-md text-xs px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                <span className="material-icons text-sm">360</span> Drag to Rotate
              </div>
              <div className="bg-black/50 backdrop-blur-md text-xs px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                <span className="material-icons text-sm">zoom_in</span> Scroll to Zoom
              </div>
            </div>
          </div>

          <div className="absolute top-28 left-8 z-20">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">{t('carName')}</h1>
            <div className="flex items-center gap-3">
              <span className="bg-[#4725f4]/20 text-[#4725f4] border border-[#4725f4]/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">AWD</span>
              <span className="text-white/60 text-sm">3.8L V6 Twin-Turbo</span>
            </div>
            <div className="mt-6">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{t('totalBuildCost')}</p>
              <p className="text-3xl text-[#4725f4] font-bold">{t('carPrice')}</p>
            </div>
          </div>

          <div className="absolute bottom-32 right-[440px] flex flex-col gap-2 z-20">
            <motion.button
              className="w-10 h-10 rounded-full bg-[#1c1833] border border-white/10 text-white/80 hover:bg-[#4725f4] hover:text-white hover:border-[#4725f4] transition-all flex items-center justify-center shadow-lg"
              title={t('interiorView')}
              whileHover={{ scale: 1.05 }}
            >
              <span className="material-icons text-lg">airline_seat_recline_extra</span>
            </motion.button>
            <motion.button
              className="w-10 h-10 rounded-full bg-[#4725f4] border border-[#4725f4] text-white transition-all flex items-center justify-center shadow-lg shadow-[#4725f4]/50"
              title={t('exteriorView')}
              whileHover={{ scale: 1.05 }}
            >
              <span className="material-icons text-lg">directions_car</span>
            </motion.button>
            <motion.button
              className="w-10 h-10 rounded-full bg-[#1c1833] border border-white/10 text-white/80 hover:bg-[#4725f4] hover:text-white hover:border-[#4725f4] transition-all flex items-center justify-center shadow-lg"
              title={t('nightMode')}
              whileHover={{ scale: 1.05 }}
            >
              <span className="material-icons text-lg">dark_mode</span>
            </motion.button>
          </div>
        </section>

        <aside className="w-[400px] bg-[#1c192e] border-l border-white/5 flex flex-col z-30 shadow-2xl relative">
          <div className="px-6 pt-8 pb-4">
            <div className="flex p-1 bg-[#26233b] rounded-full mb-6">
              {['paint', 'wheels', 'stance'].map((tab) => (
                <motion.button
                  key={tab}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                    activeTab === tab
                      ? 'bg-[#4725f4] text-white shadow-[0_0_20px_-5px_rgba(71,37,244,0.5)]'
                      : 'text-white/60 hover:text-white'
                  }`}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ scale: activeTab === tab ? 1 : 1.02 }}
                >
                  {t(`${tab}Tab`)}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-bold">{t(`${activeTab}Title`)}</h2>
              <span className="text-xs text-[#4725f4] bg-[#4725f4]/10 px-2 py-1 rounded border border-[#4725f4]/20">+${t(`${activeTab}Price`)}</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">{t(`${activeTab}Description`)}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {activeTab === 'paint' && (
              <>
                <div>
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{t('finishType')}</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {finishTypes.map((finish) => (
                      <motion.button
                        key={finish.id}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedFinish === finish.id
                            ? 'bg-[#26233b] border border-[#4725f4] text-[#4725f4] shadow-[0_0_20px_-5px_rgba(71,37,244,0.5)]'
                            : 'bg-[#26233b] border border-white/5 hover:border-white/20 text-white/60'
                        }`}
                        onClick={() => setSelectedFinish(finish.id)}
                        whileHover={{ scale: 1.02 }}
                      >
                        {finish.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">{t('manufacturerColors')}</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {paintColors.map((colorOption) => (
                      <motion.div
                        key={colorOption.id}
                        className="group relative cursor-pointer"
                        onClick={() => setSelectedColor(colorOption.id)}
                        whileHover={{ scale: 1.1 }}
                      >
                        <div
                          className={`w-full aspect-square rounded-full border-2 relative overflow-hidden ${
                            selectedColor === colorOption.id
                              ? 'border-[#4725f4] shadow-[0_0_20px_rgba(71,37,244,0.5)]'
                              : 'border-transparent group-hover:border-white/20'
                          } ${colorOption.gradient ? `bg-gradient-to-br ${colorOption.gradient}` : ''}`}
                          style={colorOption.color ? { backgroundColor: colorOption.color } : {}}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                          <div className="absolute top-2 left-2 w-4 h-2 bg-white/20 rounded-full blur-[2px]"></div>
                        </div>
                        {selectedColor === colorOption.id && (
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-medium text-white">
                            {t(`colors.${colorOption.id}`)}
                          </span>
                        )}
                      </motion.div>
                    ))}
                    <motion.div
                      className="group relative cursor-pointer flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-full aspect-square rounded-full bg-[#26233b] border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-colors">
                        <span className="material-icons text-lg">add</span>
                      </div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('custom')}
                      </span>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">{t('accents')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#26233b] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center">
                          <span className="material-icons text-white/50 text-sm">visibility_off</span>
                        </div>
                        <span className="text-sm font-medium">{t('chromeDelete')}</span>
                      </div>
                      <motion.div
                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                          chromeDelete ? 'bg-[#4725f4] shadow-[0_0_20px_-5px_rgba(71,37,244,0.5)]' : 'bg-white/10'
                        }`}
                        onClick={() => setChromeDelete(!chromeDelete)}
                      >
                        <motion.div
                          className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm ${chromeDelete ? 'right-1' : 'left-1'}`}
                          animate={{ left: chromeDelete ? 'auto' : '4px', right: chromeDelete ? '4px' : 'auto' }}
                        />
                      </motion.div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#26233b] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center">
                          <span className="material-icons text-white/50 text-sm">wb_sunny</span>
                        </div>
                        <span className="text-sm font-medium">{t('carbonRoof')}</span>
                      </div>
                      <motion.div
                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                          carbonRoof ? 'bg-[#4725f4] shadow-[0_0_20px_-5px_rgba(71,37,244,0.5)]' : 'bg-white/10'
                        }`}
                        onClick={() => setCarbonRoof(!carbonRoof)}
                      >
                        <motion.div
                          className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm ${carbonRoof ? 'right-1' : 'left-1'}`}
                          animate={{ left: carbonRoof ? 'auto' : '4px', right: carbonRoof ? '4px' : 'auto' }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'wheels' && (
              <div className="text-center py-12 text-white/40">
                <span className="material-icons text-4xl mb-4">album</span>
                <p>{t('wheelsDescription')}</p>
              </div>
            )}

            {activeTab === 'stance' && (
              <div className="text-center py-12 text-white/40">
                <span className="material-icons text-4xl mb-4">tune</span>
                <p>{t('stanceDescription')}</p>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 w-full bg-[#1c192e]/95 backdrop-blur-xl border-t border-white/5 p-6 flex flex-col gap-3">
            <motion.button
              className="w-full py-4 bg-[#4725f4] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#361bb5] transition-colors shadow-[0_0_30px_-5px_rgba(71,37,244,0.8)] flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{t('saveBuild')}</span>
              <span className="material-icons text-lg">arrow_forward</span>
            </motion.button>
            <div className="flex gap-3">
              <motion.button
                className="flex-1 py-3 bg-[#26233b] text-white rounded-xl text-sm font-bold border border-white/5 hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {t('share')}
              </motion.button>
              <motion.button
                className="flex-1 py-3 bg-[#26233b] text-white rounded-xl text-sm font-bold border border-white/5 hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {t('quote')}
              </motion.button>
            </div>
          </div>
        </aside>
      </main>

      <section className="absolute bottom-6 left-6 right-[424px] z-40">
        <div className="bg-[rgba(19,16,34,0.7)] backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {carModels.map((model) => (
              <motion.div
                key={model.id}
                className={`flex-shrink-0 w-48 rounded-xl p-3 cursor-pointer transition-all ${
                  selectedModel === model.id
                    ? 'bg-[#4725f4]/20 border border-[#4725f4]'
                    : 'bg-[#26233b]/40 border border-white/5 hover:bg-[#26233b] hover:border-white/20'
                }`}
                onClick={() => setSelectedModel(model.id)}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-full h-20 mb-2 relative flex items-center justify-center">
                  <img
                    src={model.image}
                    alt={`${model.name} silhouette`}
                    className={`w-full h-full object-contain mix-blend-screen transition-all ${
                      selectedModel === model.id ? 'opacity-100' : 'opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0'
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-bold uppercase tracking-wide ${
                    selectedModel === model.id ? 'text-white' : 'text-white/60'
                  }`}>{model.name}</span>
                  {selectedModel === model.id && (
                    <span className="w-2 h-2 rounded-full bg-[#4725f4] shadow-[0_0_10px_rgba(71,37,244,1)]"></span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    </div>
  );
}
