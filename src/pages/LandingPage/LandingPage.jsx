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

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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

  const testimonials = [
    {
      name: "Ahmad Faris",
      role: "Mahasiswa PNJ",
      quote:
        "Decisify membantu saya mengatur tugas kuliah yang sering menumpuk. Saya jadi lebih tahu mana yang harus dikerjakan lebih dulu.",
      initial: "AF",
    },
    {
      name: "Faras Iqbal Tawakal",
      role: "Mahasiswa PNJ",
      quote:
        "Aplikasinya sederhana tapi sangat membantu. Saya bisa mencatat tugas dan melihat prioritasnya dengan lebih jelas.",
      initial: "FI",
    },
    {
      name: "Raka Rammada",
      role: "Mahasiswa PNJ",
      quote:
        "Fitur prioritas otomatisnya membantu saya fokus mengerjakan tugas yang paling penting sebelum deadline.",
      initial: "RM",
    },
  ];

  return (
    <>
      <Navbar
        onOpenModal={() => setIsModalOpen(true)}
        scrollToSection={scrollToSection}
      />

      <section id="hero" className="bg-[#F5F7F8] pt-24 pb-16">
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
                  Mulai Produktif
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <GoArrowRight />
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-500 text-white flex items-center justify-center font-semibold">
                      AF
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-purple-500 text-white flex items-center justify-center font-semibold">
                      FI
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-green-500 text-white flex items-center justify-center font-semibold">
                      RM
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-snug">
                    Bergabung dengan <br />
                    <span className="font-bold">Mahasiswa produktif</span>
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

      <section id="workflow" className="bg-[#F5F7F8] pt-24 pb-16">
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

      <section className="bg-white py-20" id="testimoni">
        <div className="mx-auto px-5 md:px-20">
          <h2 className="text-3xl font-bold mb-12">
            Dipakai Mahasiswa untuk Mengatur Tugas Lebih Cerdas
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="text-yellow-400 mb-4">★★★★★</div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                    {t.initial}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-[80px] py-20 bg-[#F5F7F8]">
        <div className="max-w-6xl mx-auto rounded-[32px] px-10 py-20 text-center relative overflow-hidden bg-gradient-to-r from-[#0B1E3B] via-[#0E2A53] to-[#0B1E3B]">
          <div className="absolute -left-40 -top-40 w-[400px] h-[400px] bg-blue-500/20 blur-[120px]"></div>
          <div className="absolute -right-40 -bottom-40 w-[400px] h-[400px] bg-blue-500/20 blur-[120px]"></div>

          <h2 className="text-white font-black text-3xl md:text-5xl leading-tight max-w-3xl mx-auto">
            Siap Mengambil Kendali Penuh Atas Waktu Anda?
          </h2>

          <p className="text-slate-300 mt-6 max-w-xl mx-auto text-sm md:text-base">
            Bergabunglah dengan ribuan profesional lainnya. 100% gratis, tanpa
            kartu kredit, tanpa syarat. Mulai produktif hari ini.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 transition-all shadow-lg shadow-blue-500/30"
            >
              Mulai Atur Tugas
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-white">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center space-x-3"
            >
              <span className="text-2xl font-semibold">Decisify</span>
            </button>

            <ul className="flex flex-wrap items-center text-sm font-medium text-gray-500">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="hover:underline me-4 md:me-6"
                >
                  Fitur
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("workflow")}
                  className="hover:underline me-4 md:me-6"
                >
                  Cara Kerja
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("testimoni")}
                  className="hover:underline me-4 md:me-6"
                >
                  Testimoni
                </button>
              </li>
            </ul>
          </div>

          <hr className="my-6 border-gray-200" />

          <span className="block text-sm text-gray-500 text-center">
            © 2026 Decisify. All Rights Reserved.
          </span>
        </div>
      </footer>

      <WelcomeModal
        isOpen={isModalOpen}
        onSave={handleSaveUserData}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default LandingPage;
