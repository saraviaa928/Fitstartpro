"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "usuarios"));
      setUsers(snap.docs.map((d) => d.data()));
    };
    load();
  }, []);

  return (
    <main>
      <h1>Admin</h1>
      {users.map((u, i) => (
        <div key={i}>
          <p>{u.email}</p>
          <p>{u.premium ? "PRO" : "FREE"}</p>
        </div>
      ))}
    </main>
  );
}