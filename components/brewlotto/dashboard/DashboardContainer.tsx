export function DashboardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[490px] px-4 pb-3 pt-2 sm:max-w-[490px] sm:px-4 sm:pb-4 sm:pt-3 lg:max-w-[490px] lg:px-4 xl:max-w-[490px] xl:px-4">
      {/* Outer golden aura */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,199,66,0.3),transparent_58%)] blur-2xl" />
        <div className="absolute inset-x-8 top-5 h-20 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,211,100,0.26),transparent_72%)] blur-2xl" />
        <div className="absolute inset-x-8 bottom-4 h-16 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,190,55,0.22),transparent_74%)] blur-2xl" />
      </div>
      
      {/* Device shell with gradient background */}
      <div className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-[#120e0e]/96 to-[#08080a]/96 ring-1 ring-[#ffd36f]/42 shadow-[0_0_30px_rgba(255,199,66,0.22),0_0_64px_rgba(255,174,42,0.08),inset_0_0_28px_rgba(255,179,0,0.14),inset_0_0_62px_rgba(255,140,0,0.1)]">
        {/* Floating orbs (decorative) */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ffd364]/14 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-20 h-48 w-48 rounded-full bg-[#ffc742]/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-6 top-[2px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#ffe08a] to-transparent shadow-[0_0_14px_rgba(255,224,138,0.8)]" />
        <div className="pointer-events-none absolute inset-x-10 bottom-[2px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#ffc742] to-transparent shadow-[0_0_16px_rgba(255,199,66,0.75)]" />
        
        <div className="relative px-4 py-3 sm:px-5 sm:py-4 lg:px-5 lg:py-4 xl:px-6 xl:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
