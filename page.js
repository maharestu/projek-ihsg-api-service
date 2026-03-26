"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PredictPage() {
  const [stock, setStock] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!stock) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`http://localhost:8000/predict?stock=${stock}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Gagal terhubung ke server. Pastikan Backend Python menyala!" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Prediksi Saham AI
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Analisis potensi pergerakan saham menggunakan Machine Learning.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={stock}
              onChange={(e) => setStock(e.target.value.toUpperCase())}
              placeholder="Kode Saham (Contoh: BBCA)"
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all uppercase"
            />
            <button
              onClick={handlePredict}
              disabled={loading || !stock}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Proses
                </span>
              ) : (
                "Prediksi"
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {result && result.error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-center font-medium"
          >
            ❌ {result.error}
          </motion.div>
        )}

        {/* Result Card */}
        {result && !result.error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center"
          >
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-widest">
              {result.stock}
            </h2>
            
            <div className="inline-block px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-sm font-semibold mb-6">
              Confidence: {(result.confidence * 100).toFixed(1)}%
            </div>

            <div className="mb-8">
              <p className="text-slate-500 dark:text-slate-400 mb-2">Prediksi Pergerakan</p>
              <div className={`text-4xl font-bold ${result.prediction === "Naik" ? "text-emerald-500" : "text-rose-500"}`}>
                {result.prediction.toUpperCase()}
              </div>
            </div>

            {/* Probability Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden flex items-center shadow-inner relative">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${result.prob_naik * 100}%` }}
              ></div>
              <div className="absolute inset-0 flex justify-between px-2 items-center text-[10px] font-bold text-white mix-blend-difference">
                <span>Naik {(result.prob_naik * 100).toFixed(0)}%</span>
                <span>Turun {((1 - result.prob_naik) * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Disclaimer Posisinya di sini nih Bro! */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic leading-relaxed">
                *Disclaimer: Prediksi ini dihasilkan oleh model Machine Learning berdasarkan data historis dan tidak menjamin hasil di masa depan. Bukan merupakan saran atau rekomendasi investasi nyata. Risiko ditanggung masing-masing.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}