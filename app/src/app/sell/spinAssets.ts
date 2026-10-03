/**
 * spinAssets — every video and image used by the 360° vehicle stage.
 *
 * Hosted on Solid# (Trade Now media library). Local originals:
 *   ~/Downloads/handover-motion-v2/  (spin/{color}-360.mp4, spin/{color}-poster.jpg,
 *   motion/intro-zoom.mp4, motion/intro-first.jpg)
 *
 * Each spin is one 360° turn at 24 fps (keyframe every 6 frames so dragging can
 * jump to any angle instantly), looped with clean frames only, no blending.
 * The colors differ only in how many frames close the turn (white 239 frames,
 * navy 237, grey 238, black 238); SpinViewer maps angles so every color shows
 * the same pose at the same angle.
 */

/** Where the files are hosted: the Trade Now (company 78) asset store on Solid#. */
const HOST = "https://solid-tenant-assets.nyc3.digitaloceanspaces.com/company_78/uploads";

export type SpinColor = "white" | "navy" | "grey" | "black";

export interface SpinVideo {
  src: string;
  poster: string;
}

/** Solid# gives every file its own asset folder, so each URL is listed explicitly. */
const SPIN_VIDEOS: Record<SpinColor, SpinVideo> = {
  white: { src: `${HOST}/ast_ec5e18b5/autonexus-spin-white-360-v5.mp4`, poster: `${HOST}/ast_7b852177/autonexus-spin-white-poster.jpg` },
  navy:  { src: `${HOST}/ast_e21f8d2f/autonexus-spin-navy-360-v4.mp4`,  poster: `${HOST}/ast_945a1b44/autonexus-spin-navy-poster.jpg` },
  grey:  { src: `${HOST}/ast_2a2b59b0/autonexus-spin-grey-360-v4.mp4`,  poster: `${HOST}/ast_d4f4984d/autonexus-spin-grey-poster.jpg` },
  black: { src: `${HOST}/ast_943f9227/autonexus-spin-black-360-v4.mp4`, poster: `${HOST}/ast_acef0282/autonexus-spin-black-poster.jpg` },
};

export function spinVideo(color: SpinColor): SpinVideo {
  return SPIN_VIDEOS[color];
}

export const INTRO_VIDEO = {
  mp4: `${HOST}/ast_d3a7c877/autonexus-intro-zoom-v2.mp4`,
  /** Solid white — shown before the intro starts playing. */
  poster: `${HOST}/ast_4cc494bd/autonexus-intro-first.jpg`,
} as const;

/** Customer-facing paint colors → which spin video shows them. */
export const VEHICLE_COLORS = [
  { name: "Deep Crystal Blue", label: "Blue",  hex: "#1F2C55", spin: "navy"  as SpinColor, light: false },
  { name: "Rhodium White",     label: "White", hex: "#F2F2F0", spin: "white" as SpinColor, light: true  },
  { name: "Machine Gray",      label: "Gray",  hex: "#4A4F55", spin: "grey"  as SpinColor, light: false },
  { name: "Jet Black",         label: "Black", hex: "#1C1C1E", spin: "black" as SpinColor, light: false },
] as const;

export type VehicleColorName = (typeof VEHICLE_COLORS)[number]["name"];

/** Spin color for a confirmed color name (falls back to white). */
export function spinColorFor(colorName: string | null | undefined): SpinColor {
  return VEHICLE_COLORS.find((c) => c.name === colorName)?.spin ?? "white";
}
