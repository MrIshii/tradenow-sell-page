import { createBrowserRouter, Outlet, useLocation } from "react-router";
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

// Disable browser scroll restoration so our explicit reset is authoritative
if (typeof window !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function RootLayout() {
  const { pathname } = useLocation();

  // useLayoutEffect fires before paint — no flash of wrong scroll position
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Belt-and-suspenders: some browsers/iframes honour these instead
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return <Outlet />;
}

export const router = createBrowserRouter([
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
    ],
  },
]);
