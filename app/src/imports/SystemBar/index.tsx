import svgPaths from "./svg-nql77wpwbz";
type SystemBarProps = {
  className?: string;
  device?: "Dynamic Island";
};

function SystemBar({ className, device = "Dynamic Island" }: SystemBarProps) {
  return (
    <div className={className || "h-[59px] relative w-[502px]"}>
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[154px] items-center justify-center pb-[18px] pt-[19px] px-[24px] relative size-full">
          <div className="content-stretch flex flex-[1_0_0] h-[22px] items-center justify-center min-w-px pt-[1.5px] relative" data-name="Time">
            <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-black text-center tracking-[-0.43px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              9:41
            </p>
          </div>
          <div className="flex-[1_0_0] h-[22px] min-w-px relative" data-name="Levels">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex gap-[7px] items-center justify-center pr-px pt-px relative size-full">
                <div className="h-[12.226px] relative shrink-0 w-[19.2px]" data-name="Cellular Connection">
                  <svg className="absolute block inset-0 size-full" fill="none" height="12.2264" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264" width="19.2">
                    <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="black" fillRule="evenodd" id="Cellular Connection" />
                  </svg>
                </div>
                <div className="h-[12.328px] relative shrink-0 w-[17.142px]" data-name="Wifi">
                  <svg className="absolute block inset-0 size-full" fill="none" height="12.3283" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283" width="17.1417">
                    <path clipRule="evenodd" d={svgPaths.p18b35300} fill="black" fillRule="evenodd" id="Wifi" />
                  </svg>
                </div>
                <div className="h-[13px] relative shrink-0 w-[27.328px]" data-name="Battery">
                  <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 27.328 13" width="27.328">
                    <g id="Battery">
                      <rect height="12" id="Border" opacity="0.35" rx="3.8" stroke="black" width="24" x="0.5" y="0.5" />
                      <path d={svgPaths.p7a14d80} fill="black" id="Cap" opacity="0.4" />
                      <rect fill="black" height="9" id="Capacity" rx="2.5" width="21" x="2" y="2" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-black h-[36px] left-1/2 rounded-[18px] top-[calc(50%+0.5px)] w-[124px]" data-name="Dynamic Island" />
        </div>
      </div>
    </div>
  );
}

export default function SystemBar1() {
  return <SystemBar className="relative size-full" />;
}