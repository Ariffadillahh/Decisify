import React from "react";
import { FiTrendingUp } from "react-icons/fi";

const Steps = () => {
  const steps = [
    {
      number: 1,
      title: "Input Tugas",
      desc: "Masukkan semua tugas beserta deadline, tingkat kesulitan, dan estimasi waktu pengerjaan.",
      content: (
        <div className="mt-6 bg-gray-100 rounded-xl p-4 space-y-2">
          <div className="h-2 bg-gray-300 rounded w-3/4"></div>
          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
          <div className="h-2 bg-blue-300 rounded w-2/3"></div>
        </div>
      ),
    },
    {
      number: 2,
      title: "Prioritas Otomatis",
      desc: "Sistem menyusun prioritas tugas secara otomatis berdasarkan deadline, tingkat kesulitan, dan estimasi waktu pengerjaan.",
      content: (
        <div className="flex gap-3 mt-6">
          <div className="w-full h-10 rounded-xl bg-blue-100"></div>
          <div className="w-full h-10 rounded-xl bg-blue-300"></div>
          <div className="w-full h-10 rounded-xl bg-blue-600"></div>
        </div>
      ),
    },
    {
      number: 3,
      title: "Fokus & Selesaikan",
      desc: "Ikuti prioritas tugas, buat catatan, dan gunakan rangkuman serta quiz untuk belajar lebih efektif.",
      content: (
        <div className="mt-6 bg-green-100 text-green-700 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium w-full">
          <FiTrendingUp />
          Fokus pada tugas paling prioritas
        </div>
      ),
    },
  ];

  return (
    <section id="workflow" className="bg-[#F5F7F8] pt-24 pb-16">
      <div className=" mx-auto px-5 md:px-20 text-center">
        <h1 className="text-[36px] text-black font-black leading-10 pt-[16px]">
          Cara Kerja Decisify
        </h1>
        <p className="text-[16px] text-[#64748B] pt-[16px]">
          Tiga langkah sederhana untuk mentransformasi workflow Anda dari <br />
          berantakan menjadi sistematis.
        </p>
        <div className="grid md:grid-cols-3 gap-8 relative my-10">
          <div className="hidden md:block absolute top-35 left-0 right-0 h-[2px] bg-gray-200"></div>

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {step.title}
              </h3>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                {step.desc}
              </p>
              {step.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
