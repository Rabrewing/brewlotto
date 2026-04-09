export function BotBadge() {
  return (
    <div className="relative h-8 w-8">
      {/* Pulse ring */}
      <div className="absolute inset-0 animate-ping rounded-full bg-[#ffc742]/30" />
      
      {/* Badge background */}
      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#1a1a1c] to-[#0f0f10] border border-[#ffc742]/30">
        {/* Inner light elements */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#ffd364]/20 to-transparent" />
        <div className="absolute h-1 w-1 rounded-full bg-[#ffc742] shadow-[0_0_6px_rgba(255,199,66,0.8)]" />
      </div>
    </div>
  );
}