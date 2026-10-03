import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SellProvider, useSell } from "./SellContext";

function AnimatedOutlet() {
  const location = useLocation();
  const { navDirection } = useSell();
  const reduced = useReducedMotion();

  const variants = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit:    { opacity: 0 },
      }
    : {
        initial: { opacity: 0, x: navDirection === "forward" ? 40 : -40 },
        animate: { opacity: 1, x: 0 },
        exit:    { opacity: 0, x: navDirection === "forward" ? -20 : 20 },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

export function SellRoot() {
  return (
    <SellProvider>
      <AnimatedOutlet />
    </SellProvider>
  );
}
