"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "angelsaravia.1620@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //////////////////////////////////////////
  // 🔐 VALIDAR ADMIN
  //////////////////////////////////////////
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u || u.email !== ADMIN_EMAIL) {
        setLoading(false);
        router.push("/");
      } else {
        setUser(u);
        cargarUsuarios();
      }
    });

    return () => unsub();
  }, []);

  //////////////////////////////////////////
  // 📥 CARGAR USUARIOS
  //////////////////////////////////////////
  const cargarUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, "usuarios"));

    const data: any[] = [];

    querySnapshot.forEach((docItem) => {
      data.push({
        id: docItem.id,
        ...docItem.data(),
      });
    });

    setUsuarios(data);
    setLoading(false);
  };

  //////////////////////////////////////////
  // 🔄 TOGGLE PRO
  //////////////////////////////////////////
  const togglePro = async (id: string, actual: boolean) => {
    await updateDoc(doc(db, "usuarios", id), {
      pro: !actual,
    });

    cargarUsuarios();
  };

  //////////////////////////////////////////
  if (loading) return <p style={{ color: "white" }}>Cargando...</p>;

  return (
    <main style={styles.container}>
      <h1>🧠 Panel Admin</h1>

      <button onClick={() => signOut(auth)} style={styles.logout}>
        Cerrar sesión
      </button>

      {usuarios.map((u) => (
        <div key={u.id} style={styles.card}>
          <p><strong>ID:</strong> {u.id}</p>
          <p><strong>Email:</strong> {u.email || "-"}</p>
          <p><strong>Peso:</strong> {u.peso || "-"}</p>
          <p><strong>Meta:</strong> {u.meta || "-"}</p>
          <p><strong>Racha:</strong> {u.racha || 0}</p>

          <p>
            <strong>PRO:</strong>{" "}
            <span style={{ color: u.pro ? "#22c55e" : "red" }}>
              {u.pro ? "Activo" : "No"}
            </span>
          </p>

          <button
            style={styles.button}
            onClick={() => togglePro(u.id, u.pro)}
          >
            {u.pro ? "Quitar PRO" : "Hacer PRO"}
          </button>
        </div>
      ))}
    </main>
  );
}

//////////////////////////////////////////
// 🎨 ESTILOS
//////////////////////////////////////////

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },
  card: {
    background: "#1f2937",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "10px",
  },
  button: {
    marginTop: "10px",
    padding: "8px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "white",
  },
  logout: {
    background: "red",
    padding: "8px",
    border: "none",
    color: "white",
    marginBottom: "20px",
  },
};