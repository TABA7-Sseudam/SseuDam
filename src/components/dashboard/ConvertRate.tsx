import React from "react";

interface ConvertRateProps {
  percent: number;
}

const ConvertRate: React.FC<ConvertRateProps> = ({ percent }) => {
  const circumference = 34.56;
  const offset = circumference * (1 - percent);
  const dots = 16;
  const dotAngle = +(360 / dots).toFixed(2);
  const angles = Array.from({ length: dots }, (_, i) => dotAngle * i);

  return (
    <div className="col-span-6 sm:col-span-2 lg:col-span-2 lg:row-span-2">
      <div className="bg-black dark:bg-white aspect-square rounded-full text-white dark:text-black relative m-auto max-h-64 sm:max-h-none transition-colors duration-300">
        <svg
          className="m-auto w-full h-auto rtl:-scale-x-100"
          viewBox="0 0 16 16"
          width="160px"
          height="160px"
          role="img"
          aria-label={`Ring chart showing a ${(percent * 100).toFixed(1)}% fill over a circle made of 16 dots`}
        >
          <g fill="currentColor" transform="translate(8,8)">
            {angles.map((angle, i) => (
              <circle key={i} r="0.5" transform={`rotate(${angle}) translate(0,-5.5)`} />
            ))}
            <circle
              className="stroke-red-600"
              r="5.5"
              fill="none"
              strokeLinecap="round"
              strokeWidth="1"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              transform="rotate(-90)"
            />
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col justify-center text-center">
          <div className="text-xl mb-2">{(percent * 100).toFixed(1)}%</div>
          <div className="font-thin text-xs">분리배출 성공률</div>
        </div>
      </div>
    </div>
  );
};

export default ConvertRate;
