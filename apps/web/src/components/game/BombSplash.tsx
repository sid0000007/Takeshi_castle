import { AnimatePresence, motion } from "framer-motion";

type BombSplashProps = {
  active: boolean;
};

const sparkOffsets = [
  { x: 0, y: -30, delay: 0 },
  { x: 22, y: -22, delay: 0.03 },
  { x: 30, y: 0, delay: 0.06 },
  { x: 22, y: 22, delay: 0.09 },
  { x: 0, y: 30, delay: 0.12 },
  { x: -22, y: 22, delay: 0.15 },
  { x: -30, y: 0, delay: 0.18 },
  { x: -22, y: -22, delay: 0.21 }
];

export function BombSplash({ active }: BombSplashProps) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.span
          key="bomb-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <motion.span
            initial={{ scale: 0.2, opacity: 0.95 }}
            animate={{ scale: 1.85, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute h-10 w-10 rounded-full border-4 border-amber-300/80"
          />

          <motion.span
            initial={{ scale: 0.15, opacity: 1 }}
            animate={{ scale: 1.15, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute h-6 w-6 rounded-full bg-amber-300 shadow-[0_0_22px_rgba(251,191,36,0.95)]"
          />

          <motion.span
            initial={{ scale: 0.3, opacity: 0.8 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.35)_0%,rgba(251,146,60,0.18)_45%,transparent_72%)]"
          />

          {sparkOffsets.map((spark, index) => (
            <motion.span
              key={`${spark.x}-${spark.y}`}
              initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: index * 35 }}
              animate={{
                x: spark.x,
                y: spark.y,
                scale: [0.2, 1, 0.35],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 0.36,
                delay: spark.delay,
                ease: "easeOut"
              }}
              className="absolute h-2 w-7 rounded-full bg-gradient-to-r from-amber-200 via-orange-400 to-transparent"
            />
          ))}

          <motion.span
            initial={{ scale: 0.5, opacity: 0.7 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute h-full w-full rounded-[inherit] bg-[radial-gradient(circle,rgba(251,191,36,0.22)_0%,transparent_55%)]"
          />
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}
