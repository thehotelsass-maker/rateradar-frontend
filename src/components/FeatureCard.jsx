import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function FeatureCard({ feature, index, featureColors }) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = feature.icon;
  const gradientClass = featureColors[index % featureColors.length];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative bg-card p-8 rounded-3xl border border-primary/10 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
      
      {/* 3D floating icon */}
      <motion.div 
        style={{ transform: "translateZ(50px)" }}
        className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} text-white flex items-center justify-center mb-6 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300`}
      >
        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icon className="h-6 w-6 relative z-10 drop-shadow-md" />
      </motion.div>

      {/* 3D floating text */}
      <motion.div style={{ transform: "translateZ(30px)" }}>
        <h3 className="font-bold text-lg mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.desc}
        </p>
      </motion.div>

      {/* Decorative border gradient that appears on hover */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" style={{ transform: "translateZ(10px)" }} />
    </motion.div>
  );
}
