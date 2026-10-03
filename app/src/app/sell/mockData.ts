export const MOCK_VEHICLE = {
  year: 2022,
  make: "Mazda",
  model: "CX-50",
  trim: "2.5 Turbo Premium Plus",
  drivetrain: "AWD",
  mileage: 31_080,
  owners: 1,
  accidentsReported: 0,
  plate: "8KTR214",
  plateState: "CA",
  vin: "7MMVABEY4NN1XXXXX",
  colors: ["Deep Crystal Blue", "Rhodium White", "Machine Gray", "Jet Black"],
};

export const MOCK_ESTIMATES = {
  afterVehicle: { low: 29_800, high: 32_400 },
  afterWalkaround: { low: 30_600, high: 31_900 },
};

export const MOCK_OFFER = {
  marketValue: 31_900,
  adjustments: [
    { label: "Rear door scuff", amount: -640 },
    { label: "Bumper curb scrape", amount: -450 },
    { label: "New tires, 2 keys & records", amount: 150 },
    { label: "Local demand", amount: 390 },
  ],
  total: 31_350,
  validDays: 7,
  condition: 9.1,
};

export const LOAN_PAYOFF = 18_420;
export const PAYOUT_TO_CUSTOMER = 12_930;

export const PICKUP_DAYS = [
  "Mon, Sep 28",
  "Tue, Sep 29",
  "Wed, Sep 30",
  "Thu, Oct 1",
  "Fri, Oct 2",
];

export const TIME_WINDOWS = ["8–10 am", "10–12 pm", "1–3 pm", "3–5 pm"];

export const WALKAROUND_POSITIONS = [
  { id: "front",       label: "Front" },
  { id: "front-left",  label: "Front Left" },
  { id: "left",        label: "Left Side" },
  { id: "rear-left",   label: "Rear Left" },
  { id: "rear",        label: "Rear" },
  { id: "rear-right",  label: "Rear Right" },
  { id: "right",       label: "Right Side" },
  { id: "front-right", label: "Front Right" },
];

export const CLOSEUP_POSITIONS = [
  { id: "odometer", label: "Odometer",   hint: "Show mileage clearly" },
  { id: "vin",      label: "VIN Plate",  hint: "Dashboard, driver side" },
  { id: "interior", label: "Interior",   hint: "From driver's seat" },
  { id: "damage",   label: "Any Damage", hint: "Skip if none" },
];

export const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
