import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "../../components/Modal/WelcomeModal";
import HeroBg from "../../assets/images/HeroBG.png";
import { GoArrowRight } from "react-icons/go";
import { createUser } from "../../services/userServices";
import logo from "../../assets/images/logo.png";
import Footer from "../../components/LandingPage/Footer";
import Testimoni from "../../components/LandingPage/Testimoni";
import Steps from "../../components/LandingPage/Steps";
import Features from "../../components/LandingPage/Features";
import Navbar from "../../components/LandingPage/Navbar";
import { gooeyToast } from "goey-toast";
import { db } from "../../services/db";

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
      if (!db.isOpen()) {
        await db.open();
      }

      const user = await createUser({ name: userData.name });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          role: userData.role,
        }),
      );

      setIsModalOpen(false);

      gooeyToast.success("Selamat datang, " + userData.name + "!");

      navigate("/dashboard");
    } catch (error) {
      console.error("Gagal membuat user:", error);

      if (error.name === "DatabaseClosedError") {
        try {
          await db.open();
          return handleSaveUserData(userData);
        } catch (retryError) {
          gooeyToast.error("Koneksi database terputus. Silakan refresh.");
        }
      } else {
        gooeyToast.error("Terjadi kesalahan: " + error.message);
      }
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

  return (
    <>
      <Navbar onOpenModal={() => setIsModalOpen(true)} scrollToSection={scrollToSection} logo={logo} />

      <section id="hero" className="bg-[#F5F7F8] pt-24 pb-16">
        <div className="px-5 md:px-[80px]">
          <div className="grid md:grid-cols-2 items-center gap-12">
            <div>
              <h1 className="md:text-[72px] text-5xl font-black tracking-tight leading-15 md:leading-18">
                Kuasai Waktu dengan <span className="text-[#007BFF]">Presisi</span> Data.
              </h1>

              <p className="text-[#475569] text-lg my-6 max-w-xl">
                Sistem manajemen kognitif yang memvisualisasikan waktu Anda dan memprioritaskan tugas secara cerdas. Efisiensi maksimal, tanpa ketergantungan server, dengan 100% privasi lokal.
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
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-500 text-white flex items-center justify-center font-semibold">AF</div>
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-purple-500 text-white flex items-center justify-center font-semibold">FI</div>
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-green-500 text-white flex items-center justify-center font-semibold">RM</div>
                  </div>

                  <p className="text-sm text-gray-600 leading-snug">
                    Bergabung dengan <br />
                    <span className="font-bold">Mahasiswa produktif</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-end ">
              <img src={HeroBg} alt="Dashboard Produktivitas" className="w-[80%]" />
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
              <p className="text-gray-400 text-sm">Privasi Aman</p>
            </div>
          </div>
        </div>
      </section>
      <Features />
      <Steps />
      <Testimoni />
      <section className="px-5 md:px-[80px] py-20 bg-[#F5F7F8]">
        <div className="max-w-6xl mx-auto rounded-[32px] px-10 py-20 text-center relative overflow-hidden bg-gradient-to-r from-[#0B1E3B] via-[#0E2A53] to-[#0B1E3B]">
          <div className="absolute -left-40 -top-40 w-[400px] h-[400px] bg-blue-500/20 blur-[120px] pointer-events-none"></div>
          <div className="absolute -right-40 -bottom-40 w-[400px] h-[400px] bg-blue-500/20 blur-[120px] pointer-events-none"></div>

          <h2 className="text-white font-black text-3xl md:text-5xl leading-tight max-w-3xl mx-auto">Sederhanakan Keputusan, Fokus pada Eksekusi.</h2>

          <p className="text-slate-300 mt-6 max-w-xl mx-auto text-sm md:text-base">Ubah kebingungan menjadi keputusan yang jelas. Akses instan tanpa pendaftaran, tanpa syarat, dan 100% privasi lokal. Mulai produktif hari ini.</p>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
            <button type="button" onClick={() => setIsModalOpen(true)} className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 transition-all shadow-lg shadow-blue-500/30">
              Mulai Atur Tugas
            </button>
          </div>
        </div>
      </section>
      <Footer logo={logo} scrollToSection={scrollToSection} />

      <WelcomeModal isOpen={isModalOpen} onSave={handleSaveUserData} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default LandingPage;
