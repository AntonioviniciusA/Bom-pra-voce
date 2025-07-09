import React from "react";

const BouncingScroll = () => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
      <div className=" animate-[bounce_1s_infinite_alternate]">
        <svg
          className="mx-auto"
          fill="#FFFFFF"
          height="55"
          viewBox="0 0 24 24"
          width="55"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
          <path d="M0-.75h24v24H0z" fill="none" />
        </svg>
      </div>
    </div>
  );
};

export default BouncingScroll;
