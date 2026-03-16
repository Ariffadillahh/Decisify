import React from "react";

const Testimoni = () => {
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
  );
};

export default Testimoni;
