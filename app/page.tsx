"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar progreso guardado
  useEffect(() => {
    const savedPeso = localStorage.getItem("peso");
    const savedMeta = localStorage.getItem("meta");

    if (savedPeso) setPeso(savedPeso);
    if (savedMeta) setMeta(savedMeta);
  }, []);

  // 🔹 Guardar progreso
  const guardar = () => {
    localStorage.setItem("peso", peso);
    localStorage.setItem("meta", meta);
    alert("Progreso guardado ✅");
  };

  // 🔥 BOTÓN PAYPAL CORREGIDO
  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
      });

      const data = await res.json();

      console.log("PAYPAL RESPONSE:", data);

      // 🔴 Validación fuerte
      if (!data || !data.links) {
        alert("Error: PayPal no respondió correctamente");
        return;
      }

      const approveLink = data.links.find(
        (link: any) => link.rel === "approve"
      );

      if (!approveLink) {
        alert("Error: no se encontró enlace de pago");
        return;
      }

      // 🚀 REDIRECCIÓN REAL
      window.location.href = approveLink.href;

    } catch (error) {
      console.error("ERROR REAL:", error);
      alert("Error al iniciar suscripción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>💪 FitStartPro</h1>

      {/* 🔥 BOTÓN PREMIUM */}
      <h2>🔥 Desbloquea PRO</h2>

      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? "Cargando..." : "💳 Empieza GRATIS 3 días"}
      </button>

      <br /><br />

      {/* 📊 PROGRESO */}
      <input
        placeholder="peso"
        value={peso}
        onChange={(e) => setPeso(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="meta"
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={guardar}>Guardar</button>
    </main>
  );
}