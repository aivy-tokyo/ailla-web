import Image from "next/image";

interface ButtonTalkModeProps { 
  title: string;
  englishTitle: string,
  onClick: () => void,  
}

export const ButtonTalkMode = ({ item }: { item: ButtonTalkModeProps }) => {
  return (
    <div
      className="flex justify-between items-center bg-white bg-opacity-80 h-[4rem] w-[24rem] text-xs rounded-[7.1rem]"
      onClick={item.onClick}
    >
      <div className="flex justify-start ml-6">
        <div className="flex flex-col justify-center items-start gap-1">
          <span className="text-[#47556D] text-[1.1rem] font-[700]">
            {item.title}
          </span>
          <span
            className="
                  bg-gradient-to-r
                  from-primary to-danger
                  bg-clip-text text-transparent
                  text-[.8rem]
                  from-[#F4A26E]
                  via-[#EF858C] via-33%
                  via-[#BA79B1] via-66%
                  to-[#9070AF] to-100%
                  "
          >
            {item.englishTitle}
          </span>
        </div>
      </div>
      <button className="relative mr-6" onClick={item.onClick}>
        <div className="absolute font-[100] inset-0 flex items-center justify-center cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M10 17L15 12L10 7"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <Image
          src="/start_sphere.svg"
          alt="start sphere"
          width={42}
          height={42}
        />
      </button>
    </div>
  )
}