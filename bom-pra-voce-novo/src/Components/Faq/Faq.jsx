import React from "react";
import faqData from "../../Data/FaqData.js";

export default function FaqSection() {
  return (
    <section className="w-full max-w-3xl mx-auto p-4 pb-[5%] mt-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-500">
        Perguntas Frequentes
      </h2>
      {faqData.map((item, index) => (
        <details
          key={index}
          className="mb-4 rounded-xl backdrop-blur-md bg-yellow-200/30 border border-yellow-300 shadow-lg overflow-hidden transition-all duration-300">
          <summary className="cursor-pointer select-none py-3 px-6 text-lg font-semibold text-yellow-800 relative flex items-center">
            <span className="mr-2 transition-transform duration-300 group-open:rotate-90">
              ▶
            </span>
            {item.title}
          </summary>
          <ul className="pl-10 pr-6 pb-4 text-yellow-900 list-disc">
            {item.content.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  );
}
