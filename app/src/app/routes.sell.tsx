// LOCAL-ONLY (live sell page build): the sell flow on its own, for hosting as a
// single page (trade-now.solidnumber.com/sell). Swapped in for ./routes by
// vite.sell.config.ts; do not copy into Figma Make.
//
// Hash routing (/sell#/sell/vehicle) so every screen survives a refresh on a
// host that serves just one page; anything outside the flow goes to /sell.
import { createHashRouter, Navigate, Outlet, useLocation } from "react-router";
import { useLayoutEffect } from "react";
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
