import { Situation } from "@/utils/types";
import { isTranslatedAtom } from "@/utils/atoms";
import { useAtom } from "jotai";

const TranslateToggleSwitch = ({
  isSituationSelection,
}: {
    isSituationSelection?: boolean;
}) => {
  const [isTranslated, setIsTranslated] = useAtom(isTranslatedAtom);
  const handleTranslate = () => {
    setIsTranslated((prev) => !prev);
  };

  console.log("isSituationSelection", isSituationSelection)

  return (
    <div className="ml-4 flex justify-start w-[40%]">
      <span className={isSituationSelection ? "text-[#7B8392] mr-2" : "text-white mr-2"}>
        日本語で入力
      </span>
      <button onClick={handleTranslate}>
        {!isTranslated ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="25"
            viewBox="0 0 44 25"
            fill="none"
          >
            <rect
              width="44"
              height="24"
              rx="12"
              fill="#47556D"
              fill-opacity="0.5"
            />
            <rect
              x="0.5"
              y="0.5"
              width="43"
              height="23"
              rx="11.5"
              stroke="white"
              stroke-opacity="0.1"
            />
            <g filter="url(#filter0_d_179_31)">
              <circle cx="12" cy="12" r="7" fill="url(#paint0_linear_179_31)" />
            </g>
            <defs>
              <filter
                id="filter0_d_179_31"
                x="1"
                y="3"
                width="22"
                height="22"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_179_31"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_179_31"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_179_31"
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FAF9FB" />
                <stop offset="1" stop-color="#E3DDE8" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="25"
            viewBox="0 0 44 25"
            fill="none"
          >
            <rect
              width="44"
              height="24"
              rx="12"
              fill="url(#paint0_linear_179_150)"
            />
            <g filter="url(#filter0_d_179_150)">
              <circle
                cx="32"
                cy="12"
                r="7"
                fill="url(#paint1_linear_179_150)"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_179_150"
                x="21"
                y="3"
                width="22"
                height="22"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_179_150"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_179_150"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_179_150"
                x1="0"
                y1="12"
                x2="44"
                y2="12"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#A4D6C1" />
                <stop offset="1" stop-color="#00B9EF" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_179_150"
                x1="32"
                y1="5"
                x2="32"
                y2="19"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FAF9FB" />
                <stop offset="1" stop-color="#E3DDE8" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </button>
    </div>
  );
};

export default TranslateToggleSwitch;
