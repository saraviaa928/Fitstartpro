"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tab, setTab] = useState("home");

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <HomeScreen />}
        {tab === "rutinas" && <RutinasScreen />}
        {tab === "nutricion" && <NutricionScreen />}
        {tab === "perfil" && <PerfilScreen />}
      </div>

      <nav style={styles.nav}>
        <button
          onClick={() => setTab("home")}
          style={{ ...styles.navItem, color: tab === "home" ? "#22c55e" : "white" }}
        >
          🏠
        </button>

        <button
          onClick={() => setTab("rutinas")}
          style={{ ...styles.navItem, color: tab === "rutinas" ? "#22c55e" : "white" }}
        >
          🏋️
        </button>

        <button
          onClick={() => setTab("nutricion")}
          style={{ ...styles.navItem, color: tab === "nutricion" ? "#22c55e" : "white" }}
        >
          🍎
        </button>

        <button
          onClick={() => setTab("perfil")}
          style={{ ...styles.navItem, color: tab === "perfil" ? "#22c55e" : "white" }}
        >
          👤
        </button>
      </nav>
    </main>
  );
}

// 🏠 HOME
function HomeScreen() {
  return (
    <>
      <h1>💪 FitStartPro</h1>
      <p>Bienvenido a tu app fitness</p>

      <button style={styles.proButton}>
        🚀 Obtener versión PRO
      </button>
    </>
  );
}

// 🏋️ RUTINAS
function RutinasScreen() {
  const [completados, setCompletados] = useState<string[]>([]);
  const [racha, setRacha] = useState(0);

  // 🔥 Cargar datos
  useEffect(() => {
    const data = localStorage.getItem("progreso");
    if (data) setCompletados(JSON.parse(data));

    const r = localStorage.getItem("racha");
    if (r) setRacha(parseInt(r));
  }, []);

  // 🔥 Guardar progreso + racha
  useEffect(() => {
    localStorage.setItem("progreso", JSON.stringify(completados));

    const hoy = new Date().toDateString();
    const ultimaFecha = localStorage.getItem("ultima_fecha");

    if (ultimaFecha !== hoy && completados.length > 0) {
      const nuevaRacha = racha + 1;
      setRacha(nuevaRacha);
      localStorage.setItem("racha", nuevaRacha.toString());
      localStorage.setItem("ultima_fecha", hoy);
    }
  }, [completados]);

  const rutinas = [
    {
      dia: "Día 1 - Pecho y Tríceps",
      ejercicios: [
        "Press banca - 4x10",
        "Press inclinado - 3x10",
        "Aperturas - 3x12",
        "Fondos - 3x10",
        "Extensión tríceps - 3x12",
      ],
    },
    {
      dia: "Día 2 - Espalda y Bíceps",
      ejercicios: [
        "Dominadas - 4x8",
        "Remo con barra - 4x10",
        "Jalón al pecho - 3x12",
        "Curl bíceps - 3x12",
        "Curl martillo - 3x10",
      ],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: [
        "Sentadillas - 4x10",
        "Prensa - 4x12",
        "Peso muerto - 3x10",
        "Extensión pierna - 3x12",
        "Pantorrillas - 4x15",
      ],
    },
    {
      dia: "Día 4 - Hombro",
      ejercicios: [
        "Press militar - 4x10",
        "Elevaciones laterales - 3x12",
        "Elevaciones frontales - 3x12",
        "Pájaros - 3x12",
        "Encogimientos - 3x15",
      ],
    },
  ];

  // 🔥 PROGRESO GLOBAL
  const totalEjercicios = rutinas.reduce(
    (acc, r) => acc + r.ejercicios.length,
    0
  );

  const totalCompletados = completados.length;

  const progresoGlobal = Math.round(
    (totalCompletados / totalEjercicios) * 100
  );

  const toggleEjercicio = (ejercicio: string) => {
    if (completados.includes(ejercicio)) {
      setCompletados(completados.filter((e) => e !== ejercicio));
    } else {
      setCompletados([...completados, ejercicio]);
    }
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h2>🏋️ Rutinas</h2>

      {/* 🔥 PROGRESO GLOBAL */}
      <div style={styles.globalCard}>
        <p>Progreso total</p>

        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progresoGlobal}%`,
            }}
          />
        </div>

        <p>{progresoGlobal}% completado</p>
        <p style={{ color: "#facc15" }}>🔥 Racha: {racha} días</p>
      </div>

      {rutinas.map((rutina, index) => {
        const completadosDia = rutina.ejercicios.filter((e) =>
          completados.includes(e)
        ).length;

        const total = rutina.ejercicios.length;
        const porcentaje = Math.round((completadosDia / total) * 100);

        return (
          <div key={index} style={styles.rutinaCard}>
            <h3>{rutina.dia}</h3>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${porcentaje}%`,
                }}
              />
            </div>

            <p style={{ fontSize: "12px" }}>
              {porcentaje}% completado
            </p>

            <ul>
              {rutina.ejercicios.map((ejercicio, i) => {
                const isDone = completados.includes(ejercicio);

                return (
                  <li
                    key={i}
                    onClick={() => toggleEjercicio(ejercicio)}
                    style={{
                      cursor: "pointer",
                      textDecoration: isDone ? "line-through" : "none",
                      color: isDone ? "#22c55e" : "white",
                    }}
                  >
                    {isDone ? "✅ " : ""}{ejercicio}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// 🍎 NUTRICIÓN
function NutricionScreen() {
  return (
    <>
      <h2>🍎 Nutrición</h2>
      <p>Planes próximamente</p>
    </>
  );
}

// 👤 PERFIL REAL
function PerfilScreen() {
  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");

  useEffect(() => {
    const p = localStorage.getItem("peso");
    const m = localStorage.getItem("meta");

    if (p) setPeso(p);
    if (m) setMeta(m);
  }, []);

  useEffect(() => {
    localStorage.setItem("peso", peso);
    localStorage.setItem("meta", meta);
  }, [peso, meta]);

  return (
    <div>
      <h2>👤 Perfil</h2>

      <input
        placeholder="Peso actual (kg)"
        value={peso}
        onChange={(e) => setPeso(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Meta (ej: 70kg)"
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

// 🎨 ESTILOS
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  card: {
    padding: "20px",
    color: "white",
    textAlign: "center",
  },

  nav: {
    display: "flex",
    justifyContent: "space-around",
    background: "#111827",
    padding: "10px 0",
  },

  navItem: {
    background: "none",
    border: "none",
    fontSize: "20px",
  },

  rutinaCard: {
    backgroundColor: "#1f2937",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
  },

  globalCard: {
    backgroundColor: "#111827",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
  },

  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#374151",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "5px",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
  },

  proButton: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#22c55e",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
  },
};