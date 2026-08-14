import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingUp, Zap, MapPin } from 'lucide-react';

// ════════════════════════════════════════════════════════════════════
// ⚠️ SOXTA "JONLI FAOLIYAT" BILDIRISHNOMALARI O'CHIRILDI (2026-08-12)
//
// Bu komponent har 10-20 soniyada tasodifiy "yangi mijoz ulandi" oynachasini
// chiqarardi. Hammasi TO'QIB CHIQARILGAN edi, va uchtasi alohida xavfli:
//
//   1. "Toshkentdagi Dendi Plaza tizimga ulandi" — Dendi Plaza BUXOROda.
//      Ya'ni yagona real mijozning shahri ham noto'g'ri yozilgan.
//   2. "Xivadagi mehmonxona TravelLine (PMS) ga ulandi" — PMS integratsiyasi
//      MAVJUD EMAS (birorta endpoint yo'q). Bu yo'q funksiyani sotish demak.
//   3. "Buxorodagi hotel AI bilan yangi daromad rekordini o'rnatdi" — dalilsiz
//      daromad da'vosi, "20% oshdi" bilan bir sinfda.
//
// Bunday oynachalar B2B xaridorda ishonch emas, "scam signal" uyg'otadi —
// ayniqsa mahsulot yangi va noma'lum brend bo'lsa.
//
// QAYTA YOQISH: faqat HAQIQIY hodisalar bilan. Backend'da yangi mehmonxona
// ro'yxatdan o'tganda anonim hodisa yozilsin ("Buxorodagi mehmonxona ulandi",
// nom ko'rsatilmasin — mijoz roziligisiz nom chiqarish mumkin emas), va shu
// oqim ko'rsatilsin. Yo'q bo'lsa — hech narsa ko'rsatilmasin.
// ════════════════════════════════════════════════════════════════════
const notifications = [];

export function FomoNotifications() {
  // Haqiqiy hodisa oqimi yo'q ekan — hech narsa ko'rsatilmaydi.
  if (!notifications.length) return null;

  return <FomoNotificationsInner />;
}

function FomoNotificationsInner() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start the first notification after 5 seconds
    const initialTimeout = setTimeout(() => {
      showNextNotification();
    }, 5000);

    return () => clearTimeout(initialTimeout);
  }, []);

  const showNextNotification = () => {
    // Pick a random notification
    const randomIndex = Math.floor(Math.random() * notifications.length);
    setCurrentIndex(randomIndex);
    setIsVisible(true);

    // Hide it after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      // Wait another 10-20 seconds before showing the next one
      const nextDelay = Math.random() * 10000 + 10000;
      setTimeout(() => {
        showNextNotification();
      }, nextDelay);
    }, 5000);
  };

  const notification = currentIndex >= 0 ? notifications[currentIndex] : null;

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {isVisible && notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-card border shadow-2xl shadow-primary/10 rounded-2xl p-4 w-[320px] flex items-start gap-4 pointer-events-auto cursor-default backdrop-blur-md bg-opacity-95"
          >
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${notification.bg}`}>
              <notification.icon className={`w-5 h-5 ${notification.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-foreground">
                  {notification.title}
                </p>
                <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap ml-2">
                  {notification.time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
