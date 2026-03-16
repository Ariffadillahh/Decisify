import React from "react";
import { FiBarChart2, FiCreditCard, FiLayers, FiRefreshCw, FiShield, FiZap } from "react-icons/fi";

const Features = () => {
  const features = [
    {
      icon: <FiBarChart2 />,
      title: "Rekomendasi Tugas Cerdas",
      desc: "Sistem secara otomatis menyusun prioritas tugas berdasarkan deadline, tingkat kesulitan, dan estimasi waktu pengerjaan.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FiZap />,
      title: "Prioritas Otomatis",
      desc: "AI membantu menentukan prioritas dengan Eisenhower Matrix, sekaligus menyediakan rangkuman materi dan quiz interaktif untuk memperkuat pemahaman.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FiRefreshCw />,
      title: "Respons Instan",
      desc: "Menggunakan penyimpanan browser sehingga setiap perubahan data langsung diperbarui tanpa proses loading dari server.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <FiShield />,
      title: "Privasi Lokal",
      desc: "Semua data disimpan langsung di browser Anda sehingga tetap privat. Pastikan menggunakan browser yang sama agar data tidak hilang atau berubah.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <FiLayers />,
      title: "Dense Information UI",
      desc: "Antarmuka yang dirancang untuk kecepatan. Minim klik, maksimal informasi. Lihat semua yang Anda butuhkan dalam satu layar cerdas.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <FiCreditCard />,
      title: "100% Gratis",
      desc: "Tanpa biaya langganan, tanpa iklan yang mengganggu. Decisify dibangun sebagai alat bantu produktivitas murni untuk semua orang.",
      color: "bg-blue-100 text-blue-600",
    },
  ];
  return (
    <section id="features" className="bg-white pt-24 pb-16">
      <div className=" mx-auto px-5 md:px-20">
        <p className="uppercase font-bold text-[16px] text-[#007BFF]">
          Kenapa Decisify?
        </p>
        <p className="text-[36px] text-black font-black leading-10 pt-[16px]">
          Platform Modern untuk Profesional <br />
          yang Menghargai Waktu.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition"
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-xl ${item.color}`}
              >
                {item.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
