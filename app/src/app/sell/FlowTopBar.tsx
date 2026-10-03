/**
 * Location-aware wrapper around the reusable FlowTopBar component.
 * Auto-derives step/name/backPath from the current route pathname.
 */
import { useLocation, useNavigate } from "react-router";
import { FlowTopBar as FlowTopBarBase } from "./components/FlowTopBar";
import { useSell } from "./SellContext";

interface StepConfig {
  step: number;
  name: string;
  backPath: string | null;
  hideStepCount?: boolean;
}

const STEP_CONFIG: Record<string, StepConfig> = {
  "/sell/vehicle":          { step: 1, name: "Your car",                        backPath: "/sell" },
  "/sell/questions":        { step: 1, name: "Your car",                        backPath: "/sell/vehicle" },
  "/sell/walkaround-intro": { step: 2, name: "Walkaround & condition",          backPath: "/sell/questions" },
  "/sell/walkaround":       { step: 2, name: "Walkaround & condition",          backPath: "/sell/walkaround-intro" },
  "/sell/closeups":         { step: 2, name: "Walkaround & condition",          backPath: "/sell/walkaround" },
  "/sell/confirm":          { step: 2, name: "Walkaround & condition",          backPath: "/sell/closeups" },
  "/sell/pricing":          { step: 3, name: "Your offer",                      backPath: "/sell/confirm" },
  "/sell/offer":            { step: 3, name: "Your offer",                      backPath: "/sell/confirm" },
  "/sell/payout":           { step: 3, name: "Almost done · Payment & pickup",  backPath: "/sell/offer", hideStepCount: true },
  "/sell/done":             { step: 3, name: "Sale confirmed",                   backPath: null, hideStepCount: true },
};

export function FlowTopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setNavDirection } = useSell();

  const config = STEP_CONFIG[pathname];
  if (!config) return null;

  const { step, name, backPath, hideStepCount } = config;

  const handleBack = backPath
    ? () => {
        setNavDirection("back");
        navigate(backPath);
      }
    : null;

  return (
    <FlowTopBarBase
      step={step}
      stepName={name}
      onBack={handleBack}
      onExit={() => navigate("/")}
      hideStepCount={hideStepCount}
    />
  );
}
