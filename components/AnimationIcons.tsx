export const VoiceInputAnimationIcon = ({ className }: {className?: string}) => {
  return (
    <div className={`px-8 py-1 flex items-center justify-center h-full ${className}`}>
      <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch1"></div>
      <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch2"></div>
      <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch3"></div>
      <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch4"></div>
      <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch5"></div>
      <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch6"></div>
    </div>
  );
};
