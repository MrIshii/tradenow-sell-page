import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router";
import { Home, Search, DollarSign, CreditCard, User, MapPin, Heart, ChevronDown, Menu } from "lucide-react";
import { Logo } from "./Logo";

const tabs = [
  { id: "home",    label: "Home",    icon: Home,       to: "/" },
  { id: "browse",  label: "Browse",  icon: Search,     to: null },
  { id: "sell",    label: "Sell",    icon: DollarSign, to: "/sell" },
  { id: "finance", label: "Finance", icon: CreditCard, to: null },
  { id: "account", label: "Account", icon: User,       to: null },
];

const navLinks: { label: string; to?: string }[] = [
  { label: "Buy" },
  { label: "Sell your car", to: "/sell" },
  { label: "Finance" },
  { label: "Research" },
  { label: "Dealers" },
];

interface HeaderProps {
  /** @deprecated replaced by react-router navigation */
  onNavigate?: (page: string) => void;
  /** @deprecated replaced by useLocation */
  activePage?: string;
}

const menuItems: { label: string; to?: string }[] = [
  { label: "Home", to: "/" },
  { label: "Buy" },
  { label: "Sell", to: "/sell" },
  { label: "Finance" },
  { label: "Research" },
  { label: "Dealers" },
];

export function Header({ onNavigate: _onNavigate, activePage: _activePage }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTabId = location.pathname.startsWith("/sell") ? "sell" : "home";
  const [activeTab, setActiveTab] = useState(activeTabId);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────── */}
      <div className="md:hidden">
        {/* Spacer for fixed SystemBar (59px) rendered globally in App.tsx */}
        <div className="h-[59px]" />
        {/* Logo bar — scrolls with page, iOS glass */}
        <div
          className="border-b border-white/20"
          style={{
            background: "transparent",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
          }}
        >
          <div className="flex items-center h-[52px] px-4">
            {/* Left — menu */}
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/[0.05] transition-colors shrink-0"
            >
              <Menu className="w-5 h-5 text-[#101820]" strokeWidth={2} />
            </button>
            {/* Center — logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/">
                <Logo height={22} />
              </Link>
            </div>
            {/* Right — account */}
            <button
              aria-label="Account"
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/[0.05] transition-colors shrink-0"
            >
              <User className="w-5 h-5 text-[#101820]" />
            </button>
          </div>
        </div>
        {/* Slide-out menu drawer */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-[19998] bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => setMenuOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                className="fixed top-0 left-0 bottom-0 z-[19999] w-72 bg-white flex flex-col shadow-2xl"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.32, 0, 0.16, 1] }}
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b border-black/[0.07]">
                  <Logo height={20} />
                  <button
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/[0.05] transition-colors text-[#101820] text-xl font-light"
                  >
                    ✕
                  </button>
                </div>
                {/* Nav items */}
                <nav className="flex flex-col px-3 py-4 gap-1">
                  {menuItems.map(({ label, to }, i) => (
                    <motion.button
                      key={label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22, delay: 0.08 + i * 0.04, ease: "easeOut" }}
                      onClick={() => {
                        setMenuOpen(false);
                        if (to) navigate(to);
                      }}
                      className="text-left px-4 py-3.5 rounded-xl text-[16px] font-semibold text-[#101820] hover:bg-black/[0.04] transition-colors"
                    >
                      {label}
                    </motion.button>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* Floating bottom tab bar — fixed */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
        </nav>
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────── */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/80 border-b border-black/[0.07]"
        style={{ backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }}>
        <div className="w-full px-10 lg:px-16 flex items-center justify-between h-14">

          <div className="shrink-0">
            <Link to="/">
              <Logo height={28} />
            </Link>
          </div>

          <nav className="flex items-center gap-0.5 bg-black/[0.04] rounded-2xl px-1.5 py-1.5">
            {navLinks.map(({ label, to }) =>
              to ? (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-0.5 px-4 py-1.5 text-[13px] font-semibold text-[#101820] hover:bg-white hover:shadow-sm rounded-[10px] transition-all no-underline"
                >
                  {label}
                </Link>
              ) : (
                <button
                  key={label}
                  className="flex items-center gap-0.5 px-4 py-1.5 text-[13px] font-semibold text-[#101820] hover:bg-white hover:shadow-sm rounded-[10px] transition-all"
                >
                  {label}
                  <ChevronDown className="w-3 h-3 opacity-40" />
                </button>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-black/[0.04] transition-colors cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-[#667481] shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-[#667481]">Your store</span>
                <span className="text-[13px] font-semibold text-[#101820]">South Jordan</span>
              </div>
            </div>
            <button className="w-9 h-9 rounded-xl hover:bg-black/[0.05] flex items-center justify-center transition-colors" aria-label="Favorites">
              <Heart className="w-[18px] h-[18px] text-[#101820]" />
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-black/[0.05] flex items-center justify-center transition-colors" aria-label="Account">
              <User className="w-[18px] h-[18px] text-[#101820]" />
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
