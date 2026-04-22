"use client";

import { useState } from "react";

export default function Home() {
  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
      });

      const data = await res.json();

      console.log("PAYPAL RESPONSE:", data);

      // 🔥 SI HAY LINK → REDIRIGE
      if (data?.links) {
        const approve = data.links.find(
          (link: any) => link.rel === "approve"
        );

        if (approve) {
          window.location.href = approve.href;
          return;
        }
      }

      // ❌ ERROR REAL
      alert("Error al iniciar suscripción");
      console.error("ERROR:", data);

    } catch (error) {
      console.error("ERROR FRONT:", error);
      alert("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = () => {
    alert(`Peso: ${peso} - Meta: ${meta}`);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>💪 FitStartPro</h1>

      {/* 🔥 BOTÓN SUSCRIPCIÓN */}
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? "Cargando..." : "💳 Empieza GRATIS 3 días"}
      </button>

      <br /><br />

      {/* 🔥 PROGRESO (NO LO PERDEMOS) */}
      <input
        placeholder="peso"
        value={peso}
        onChange={(e) => setPeso(e.target.value)}
      />

      <input
        placeholder="meta"
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
      />

      <button onClick={handleGuardar}>
        Guardar
      </button>
    </main>
  );
}