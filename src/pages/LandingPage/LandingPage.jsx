import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import WelcomeModal from "../../components/Modal/WelcomeModal";
import HeroBg from "../../assets/HeroBG.png";
import { GoArrowRight } from "react-icons/go";
import {
  FiBarChart2,
  FiZap,
  FiRefreshCw,
  FiShield,
  FiLayers,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi";
import { createUser } from "../../services/userServices";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSaveUserData = async (userData) => {
    try {
      const user = await createUser({ name: userData.name });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          role: userData.role,
        }),
      );

      setIsModalOpen(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Gagal membuat user:", error);
    }
  };

  const features = [
    {
      icon: <FiBarChart2 />,
      title: "Analisis Cerdas AI",
      desc: "Algoritma kami mempelajari pola kerja Anda untuk memberikan rekomendasi waktu istirahat dan jam kerja paling produktif secara otomatis.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FiZap />,
      title: "Prioritas Otomatis",
      desc: "Sistem Eisenhower Matrix yang ditingkatkan AI untuk membantu Anda membedakan mana yang benar-benar penting dan mana yang sekadar mendesak.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FiRefreshCw />,
      title: "Sinkronisasi Real-time",
      desc: "Gunakan di HP, Tablet, atau Desktop. Semua data tersinkronisasi instan dengan enkripsi end-to-end yang menjamin privasi Anda.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <FiShield />,
      title: "Keamanan Militer",
      desc: "Data Anda adalah aset. Kami menggunakan standar enkripsi AES-256 untuk memastikan catatan dan strategi bisnis Anda tetap rahasia.",
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

  const steps = [
    {
      number: 1,
      title: "Input & Kategorisasi",
      desc: "Masukkan semua ide, tugas, dan janji temu. AI akan otomatis mengelompokkannya berdasarkan konteks dan urgensi.",
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
      title: "Optimasi Jadwal",
      desc: "Sistem kami menyusun jadwal 'Deep Work' untuk Anda, memastikan tugas tersulit dikerjakan saat energi Anda di puncak.",
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
      title: "Review & Iterasi",
      desc: "Dapatkan laporan mingguan mendalam tentang performa Anda. Temukan hambatan dan tingkatkan fokus Anda minggu demi minggu.",
      content: (
        <div className="mt-6 bg-green-100 text-green-700 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium w-full">
          <FiTrendingUp />
          +24% Productivity gain this week
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      <section className="bg-[#F5F7F8] pt-24 pb-16">
        <div className=" px-5 md:px-[80px]">
          <div className="grid md:grid-cols-2 items-center gap-12">
            <div>
              <h1 className="md:text-[72px] text-5xl font-black tracking-tight leading-18">
                Kuasai Waktu dengan{" "}
                <span className="text-[#007BFF]">Presisi</span> Data.
              </h1>

              <p className="text-[#475569] text-lg my-6 max-w-xl">
                Platform manajemen kognitif gratis yang mengubah cara Anda
                bekerja. Visualisasikan setiap detik, prioritaskan secara
                cerdas, dan capai efisiensi maksimal tanpa biaya.
              </p>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#007BFF] px-6 py-3 rounded-full text-white font-bold flex items-center gap-3 shadow-lg shadow-blue-500/30 w-fit group transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                >
                  Coba Sekarang
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <GoArrowRight />
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-4">
                    <img
                      className="w-12 h-12 rounded-full border-4 border-white object-cover"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQanlasPgQjfGGU6anray6qKVVH-ZlTqmuTHw&s"
                      alt="User"
                    />
                    <img
                      className="w-12 h-12 rounded-full border-4 border-white object-cover"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQanlasPgQjfGGU6anray6qKVVH-ZlTqmuTHw&s"
                      alt="User"
                    />
                    <img
                      className="w-12 h-12 rounded-full border-4 border-white object-cover"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQanlasPgQjfGGU6anray6qKVVH-ZlTqmuTHw&s"
                      alt="User"
                    />
                  </div>

                  <p className="text-sm text-gray-600 leading-snug">
                    Bergabung dengan <br />
                    <span className="font-bold">50rb+ profesional</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-end ">
              <img
                src={HeroBg}
                alt="Dashboard Produktivitas"
                className="w-[80%]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 mt-20 border-y border-gray-300 py-8">
            <div className="px-4 md:px-8">
              <h2 className="text-xl font-bold">50rb+</h2>
              <p className="text-gray-400 text-sm">Pengguna Aktif</p>
            </div>
            <div className="px-4 md:px-8 md:border-l border-gray-300">
              <h2 className="text-xl font-bold">1.2jt+</h2>
              <p className="text-gray-400 text-sm">Tugas Selesai</p>
            </div>
            <div className="px-4 md:px-8 md:border-l border-gray-300">
              <h2 className="text-xl font-bold">45%</h2>
              <p className="text-gray-400 text-sm">Kenaikan Efisiensi</p>
            </div>
            <div className="px-4 md:px-8 md:border-l border-gray-300">
              <h2 className="text-xl font-bold">100%</h2>
              <p className="text-gray-400 text-sm">Gratis Selamanya</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pt-24 pb-16">
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

      <section className="bg-[#F5F7F8] pt-24 pb-16">
        <div className=" mx-auto px-5 md:px-20 text-center">
          <h1 className="text-[36px] text-black font-black leading-10 pt-[16px]">
            Cara Kerja Decisify
          </h1>
          <p className="text-[16px] text-[#64748B] pt-[16px]">
            Tiga langkah sederhana untuk mentransformasi workflow Anda dari{" "}
            <br />
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

      <WelcomeModal isOpen={isModalOpen} onSave={handleSaveUserData} />
    </>
  );
};

export default LandingPage;
