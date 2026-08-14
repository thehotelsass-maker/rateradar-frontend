import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/**
 * Raqamni eski qiymatdan yangisiga silliq sanab chiqadi (count-up).
 * Birinchi marta ko'rinishga kelganda 0 dan boshlaydi; keyin qiymat
 * o'zgarsa, oldingi qiymatdan yangisiga animatsiya qiladi.
 *
 * @param value      yakuniy raqam
 * @param format     (n:number)=>string — ko'rsatish formati (masalan formatPrice)
 * @param duration   sekundlarda (default 1.1)
 * @param prefix/suffix  atrofidagi matn
 */
export default function CountUp({
  value = 0,
  format = (n) => Math.round(n).toLocaleString(),
  duration = 1.1,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const to = Number(value) || 0;
    if (reduce) { setDisplay(to); fromRef.current = to; return; }

    // ⚠️ Ilgari bu yerda shunchaki `if (!inView) return;` turardi. Agar
    // IntersectionObserver ishga tushmasa (bot/skreyper, eski brauzer, element
    // hech qachon "ko'rindi" deb belgilanmasa), `display` boshlang'ich 0 da
    // ABADIY qotib qolardi — landing'dagi "0+ OTA", "0m radius", "0 til" aynan
    // shundan. Endi zaxira taymer bor: kuzatuvchi ishlamasa ham HAQIQIY raqam
    // chiqadi. Animatsiya — bezak, raqamning ko'rinishi esa majburiy.
    if (!inView) {
      const fallback = setTimeout(() => {
        setDisplay(to);
        fromRef.current = to;
      }, 1200);
      return () => clearTimeout(fallback);
    }

    const controls = animate(fromRef.current, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
      onComplete: () => { fromRef.current = to; },
    });
    return () => controls.stop();
  }, [value, inView, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{format(display)}{suffix}
    </span>
  );
}
