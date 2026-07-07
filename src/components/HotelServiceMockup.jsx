import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Sparkles, Utensils, Car, Layers, ArrowRight, Send, CheckCircle2 } from 'lucide-react';
import { useT } from '@/lib/i18n';

export function HotelServiceMockup() {
  const t = useT();
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle through mock interactions
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    { icon: Sparkles, label: t('hsSvcClean') || 'Xonani tozalash' },
    { icon: Utensils, label: t('hsSvcFood') || 'Ovqat buyurtma' },
    { icon: Car, label: t('hsSvcTaxi') || 'Taksi chaqirish' },
    { icon: Layers, label: t('hsSvcTowel') || 'Sochiq / buyum' },
  ];

  return (
    <div className="relative flex justify-center perspective-1000">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-72 h-72 bg-primary/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute w-60 h-60 bg-violet-500/20 rounded-full blur-3xl ml-20 mt-20" 
        />
      </div>

      {/* Floating Phone Frame */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotateX: [2, -2, 2], rotateY: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-[280px] rounded-[2.5rem] border-[8px] border-foreground/10 bg-card shadow-2xl overflow-hidden"
      >
        {/* Glossy reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* Status bar */}
        <div className="h-7 bg-background/80 backdrop-blur flex items-center justify-center z-20 relative">
          <div className="w-16 h-1.5 rounded-full bg-foreground/15" />
        </div>

        {/* Header */}
        <div className="px-5 pt-5 pb-4 text-center border-b bg-gradient-to-b from-primary/5 to-transparent">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-primary/20"
          >
            <QrCode className="h-7 w-7" />
          </motion.div>
          <div className="text-[15px] font-bold tracking-tight">TheHotelSaaS</div>
          <div className="text-xs font-medium text-primary/80 mt-0.5">Room 204</div>
        </div>

        {/* Service Menu */}
        <div className="px-4 py-5 bg-background relative h-[320px]">
          <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            {t('hsMenuTitle') || 'Xizmatni tanlang'}
          </div>
          
          <div className="space-y-2.5 relative z-10">
            {services.map((s, i) => {
              const isActive = activeStep === 1 && i === 0; // Simulate click on the first item
              return (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: isActive ? 0.95 : 1,
                    backgroundColor: isActive ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--card))',
                    borderColor: isActive ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))'
                  }}
                  className="flex items-center gap-3 rounded-xl border bg-card px-3 py-3 shadow-sm transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[13px] font-medium">{s.label}</span>
                  <ArrowRight className={`h-4 w-4 ml-auto transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </motion.div>
              );
            })}
          </div>

          {/* Simulated Telegram Notification */}
          <AnimatePresence>
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-5 left-4 right-4 z-20"
              >
                <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-3 shadow-xl shadow-blue-500/20 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Send className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium opacity-90">Telegram bot</span>
                  </div>
                  <div className="text-xs font-semibold">Yangi buyurtma: Xona 204</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Xonani tozalash so'raldi.</div>
                  <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-2">
                    <span className="text-[10px] opacity-75">Hozir</span>
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
      
      {/* Floating decorative badges */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -right-8 top-1/4 bg-card border rounded-xl p-2.5 shadow-xl z-20 flex items-center gap-2"
        style={{ transform: "translateZ(30px)" }}
      >
        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
        <span className="text-[10px] font-bold">Avto-tarjima</span>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute -left-6 bottom-1/3 bg-card border rounded-xl p-2.5 shadow-xl z-20 flex items-center gap-2"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center"><Send className="w-3 h-3"/></div>
        <span className="text-[10px] font-bold">Tezkor xabar</span>
      </motion.div>

    </div>
  );
}
