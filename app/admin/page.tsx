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
const COLLECTION = "usuarios";

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u || u.email !== ADMIN_EMAIL) {
        router.push("/");
      } else {
        cargarUsuarios();
      }
    });

    return () => unsub();
  }, []);

  const cargarUsuarios = async () => {
    const snapshot = await getDocs(collection(db, COLLECTION));

    const data: any[] = [];

    snapshot.forEach((docItem) => {
      data.push({
        id: docItem.id,
        ...docItem.data(),
      });
    });

    setUsuarios(data);
    setLoading(false);
  };

  const togglePro = async (id: string, actual: boolean) => {
    await updateDoc(doc(db, COLLECTION, id), {
      pro: !actual,
    });

    cargarUsuarios();
  };

  if (loading) return <p style={{ color: "white" }}>Cargando...</p>;

  return (
    <main style={styles.container}>
      <h1>🧠 Panel Admin</h1>

      <button onClick={() => signOut(auth)} style={styles.logout}>
        Cerrar sesión
      </button>

      {usuarios.length === 0 && <p>No hay usuarios aún</p>}

      {usuarios.map((u) => (
        <div key={u.id} style={styles.card}>
          <p>Email: {u.email}</p>
          <p>Peso: {u.peso}</p>
          <p>Meta: {u.meta}</p>
          <p>Racha: {u.racha}</p>

          <p>
            PRO:{" "}
            <span style={{ color: u.pro ? "green" : "red" }}>
              {u.pro ? "Activo" : "No"}
            </span>
          </p>

          <button onClick={() => togglePro(u.id, u.pro)}>
            Toggle PRO
          </button>
        </div>
      ))}
    </main>
  );
}

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
  logout: {
    background: "red",
    padding: "8px",
    border: "none",
    color: "white",
    marginBottom: "20px",
  },
};