import React from "react";

export default function Tabloide() {
  return (
    <div className="bg-white flex items-center justify-center w-full h-full">
      <div className="p-4">
        <div className="flex gap-4">
          <div className="relative h-32 lg:h-40 overflow-hidden rounded-lg bg-yellow-400">
            <img
              src="#"
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
          <div className="relative h-32 lg:h-40 overflow-hidden rounded-lg bg-yellow-400">
            <img
              src="#"
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
