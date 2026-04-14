"use client";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Detectar sesión
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error auth:", error);
      setLoading(false);
    }
  }, []);

  // 🔥 Pantalla de carga (EVITA BLANCO)
  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  // 🔐 Si NO hay usuario → Login
  if (!user) return <LoginScreen />;

  // ✅ Si hay usuario → App
  return <AppScreen user={user} />;
}

//////////////////////////
// 🔐 LOGIN
//////////////////////////

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      alert("Error al iniciar sesión");
      console.error(e);
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      alert("Error al crear cuenta");
      console.error(e);
    }
  };

  return (
    <div style={styles.containerCenter}>
      <h1>🔥 FitStartPro</h1>

      <input
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Contraseña"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        style={styles.input}
      />

      <button onClick={login} style={styles.button}>
        Login
      </button>

      <button onClick={register} style={styles.button}>
        Crear cuenta
      </button>
    </div>
  );
}

//////////////////////////
// 🏠 APP PRINCIPAL
//////////////////////////

function AppScreen({ user }: { user: User }) {
  const [tab, setTab] = useState("home");

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <HomeScreen user={user} />}
        {tab === "rutinas" && <RutinasScreen />}
        {tab === "perfil" && <PerfilScreen user={user} />}
      </div>

      <nav style={styles.nav}>
        <button onClick={() => setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={() => setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={() => setTab("perfil")} style={styles.navItem}>👤</button>
      </nav>
    </main>
  );
}

//////////////////////////
// 🏠 HOME
//////////////////////////

function HomeScreen({ user }: { user: User }) {
  return (
    <>
      <h1>💪 Bienvenido</h1>
      <p>{user.email}</p>

      <button onClick={() => signOut(auth)} style={styles.button}>
        Cerrar sesión
      </button>
    </>
  );
}

//////////////////////////
// 🏋️ RUTINAS
//////////////////////////

function RutinasScreen() {
  const [done, setDone] = useState<string[]>([]);

  const ejercicios = ["Press banca", "Dominadas", "Sentadillas"];

  const toggle = (e: string) => {
    if (done.includes(e)) {
      setDone(done.filter((x) => x !== e));
    } else {
      setDone([...done, e]);
    }
  };

  return (
    <>
      <h2>Rutinas</h2>

      {ejercicios.map((e, i) => (
        <p
          key={i}
          onClick={() => toggle(e)}
          style={{
            cursor: "pointer",
            textDecoration: done.includes(e) ? "line-through" : "none",
          }}
        >
          {e}
        </p>
      ))}
    </>
  );
}

//////////////////////////
// 👤 PERFIL
//////////////////////////

function PerfilScreen({ user }: { user: User }) {
  return (
    <>
      <h2>Perfil</h2>
      <p>{user.email}</p>
    </>
  );
}

//////////////////////////
// 🎨 ESTILOS
//////////////////////////

const styles: any = {
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
    padding: "10px",
  },

  navItem: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
  },

  containerCenter: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    background: "#0f172a",
    color: "white",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    background: "#22c55e",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};