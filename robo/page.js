"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function RoboAdvisorPage() {
  const [formData, setFormData] = useState({
    modal: 10000000, // Default 10 Juta biar keliatan seru angkanya
    jangka_waktu: "menengah", // Disesuaikan sama Python Galuh
    tujuan: "growth", // Disesuaikan sama Python Galuh
    risk_tolerance: 3,
    reaksi_rugi: 3,
    pengalaman: 3,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumberField = ["modal", "risk_tolerance", "reaksi_rugi", "pengalaman"].includes(name);
    
    setFormData((prev) => ({
      ...prev,
      [name]: isNumberField ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/robo-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Gagal terhubung ke server. Pastikan Uvicorn menyala!" });
    }

    setLoading(false);
  };

  // Fungsi buat format angka jadi Rupiah (Rp 10.000.000)
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Warna dinamis buat profil risiko
  const getProfileColor = (profile) => {
    if (profile === "Conservative") return "from-emerald-500 to-green-600";
    if (profile === "Moderate") return "from-amber-400 to-orange-500";
    if (profile === "Aggressive") return "from-rose-500 to-red-600";
    return "from-blue-500 to-indigo-600"; // Default
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Robo Advisor AI 🤖
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Jawab pertanyaan di bawah dan biarkan AI meracik portofolio investasi terbaik untukmu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* KIRI: Form Input */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Modal */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Modal Investasi (Rp)</label>
                <input
                  type="number" name="modal" value={formData.modal} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              {/* Jangka Waktu */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Jangka Waktu</label>
                <select name="jangka_waktu" value={formData.jangka_waktu} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
                  <option value="pendek">Kurang dari 1 Tahun (Pendek)</option>
                  <option value="menengah">1 - 3 Tahun (Menengah)</option>
                  <option value="panjang">Lebih dari 3 Tahun (Panjang)</option>
                </select>
              </div>

              {/* Tujuan */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tujuan Investasi</label>
                <select name="tujuan" value={formData.tujuan} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
                  <option value="safety">Dana Darurat / Keamanan</option>
                  <option value="growth">Pertumbuhan Aset (Growth)</option>
                </select>
              </div>

              {/* Slider 1: Risiko */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Toleransi Risiko: {formData.risk_tolerance}/5
                </label>
                <input type="range" name="risk_tolerance" min="1" max="5" value={formData.risk_tolerance} onChange={handleChange} className="w-full accent-blue-600" />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>Sangat Aman</span><span>Sangat Berani</span></div>
              </div>

              {/* Slider 2: Reaksi Rugi */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Reaksi jika Portofolio Minus: {formData.reaksi_rugi}/5
                </label>
                <input type="range" name="reaksi_rugi" min="1" max="5" value={formData.reaksi_rugi} onChange={handleChange} className="w-full accent-blue-600" />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>Panik Jual</span><span>Beli Lagi (Avg Down)</span></div>
              </div>

              {/* Slider 3: Pengalaman */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Pengalaman Trading: {formData.pengalaman}/5
                </label>
                <input type="range" name="pengalaman" min="1" max="5" value={formData.pengalaman} onChange={handleChange} className="w-full accent-blue-600" />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>Pemula</span><span>Pro Trader</span></div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-md mt-4 flex justify-center items-center"
              >
                {loading ? "AI Sedang Meracik..." : "Dapatkan Rekomendasi"}
              </button>
            </form>
          </motion.div>

          {/* KANAN: Hasil Analisis */}
          <div className="flex flex-col gap-6">
            {!result && !loading && (
              <div className="flex-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center p-8 text-center min-h-[400px]">
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Isi form di samping untuk melihat hasil analisis dan alokasi Robo Advisor.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300 font-semibold animate-pulse">Menghitung probabilitas & alokasi aset...</p>
              </div>
            )}

            {result && !result.error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                {/* Header Profil */}
                <div className={`bg-gradient-to-r ${getProfileColor(result.profile)} p-6 text-white text-center relative`}>
                  <h3 className="text-sm font-semibold opacity-90 uppercase tracking-widest mb-1">Profil Investor Anda</h3>
                  <div className="text-4xl font-black tracking-wide">{result.profile}</div>
                  <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                    Score: {result.score}
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                    Rekomendasi Alokasi Dana
                  </h4>
                  
                  {/* List Saham Dinamis */}
                  <div className="space-y-4 mb-6">
                    {result.rekomendasi.alokasi.map((item, index) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-black text-slate-800 dark:text-white">{item.saham}</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatRupiah(item.nominal)}</span>
                        </div>
                        
                        {/* Progress Bar Persentase */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden flex items-center shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.persen}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${
                              index === 0 ? "bg-blue-500" : index === 1 ? "bg-indigo-500" : "bg-cyan-500"
                            }`}
                          ></motion.div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 text-right">{item.persen}% dari modal</p>
                      </div>
                    ))}
                  </div>

                  {/* Total Modal */}
                  <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-bold">
                    <span className="text-slate-600 dark:text-slate-300">Total Modal Diinvestasikan:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg">
                      {formatRupiah(formData.modal)}
                    </span>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 italic leading-relaxed text-justify">
                      *Disclaimer: Alokasi portofolio di atas dihasilkan secara otomatis oleh sistem Robo Advisor berdasarkan profil risiko Anda. Keputusan jual-beli saham sepenuhnya berada di tangan Anda.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}