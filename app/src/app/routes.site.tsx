// LOCAL-ONLY (standalone website build): the same pages as Figma Make, the
// TradeNow home page and the sell flow, for hosting as one static page.
// Swapped in for ./routes by vite.sell-site.config.ts; do not copy into Make.
//
// Hash routing (…/#/sell/vehicle) so every screen survives a refresh on any
// host. The page opens on the sell flow; Exit and the menu's Home go to the
// home page (#/), as in Make.
import { createHashRouter, Navigate, Outlet, useLocation } from "react-router";
import { useLayoutEffect } from "react";
import { HomePage } from "./pages/HomePage";
import { SellRoot } from "./sell/SellRoot";
import { LandingScreen } from "./sell/screens/LandingScreen";
import { VehicleScreen } from "./sell/screens/VehicleScreen";
import { QuestionsScreen } from "./sell/screens/QuestionsScreen";
import { WalkaroundIntroScreen } from "./sell/screens/WalkaroundIntroScreen";
import { WalkaroundScreen } from "./sell/screens/WalkaroundScreen";
import { CloseUpsScreen } from "./sell/screens/CloseUpsScreen";
import { ConfirmScreen } from "./sell/screens/ConfirmScreen";
import { PricingScreen } from "./sell/screens/PricingScreen";
import { OfferScreen } from "./sell/screens/OfferScreen";
import { PayoutScreen } from "./sell/screens/PayoutScreen";
import { DoneScreen } from "./sell/screens/DoneScreen";

if (typeof window !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Opening the page with no step in the address starts the sell flow.
if (typeof window !== "undefined" && !window.location.hash) {
  history.replaceState(null, "", "#/sell");
}

function RootLayout() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return <Outlet />;
}

export const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/sell",
        element: <SellRoot />,
        children: [
          { index: true,              element: <LandingScreen /> },
          { path: "vehicle",          element: <VehicleScreen /> },
          { path: "questions",        element: <QuestionsScreen /> },
          { path: "walkaround-intro", element: <WalkaroundIntroScreen /> },
          { path: "walkaround",       element: <WalkaroundScreen /> },
          { path: "closeups",         element: <CloseUpsScreen /> },
          { path: "confirm",          element: <ConfirmScreen /> },
          { path: "pricing",          element: <PricingScreen /> },
          { path: "offer",            element: <OfferScreen /> },
          { path: "payout",           element: <PayoutScreen /> },
          { path: "done",             element: <DoneScreen /> },
        ],
      },
      { path: "*", element: <Navigate to="/sell" replace /> },
    ],
  },
]);
