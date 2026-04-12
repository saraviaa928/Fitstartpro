function RutinasScreen() {
  const rutinas = [
    {
      dia: "Día 1 - Pecho y Tríceps",
      ejercicios: [
        "Press banca - 4x10",
        "Press inclinado - 3x10",
        "Aperturas con mancuernas - 3x12",
        "Fondos - 3x10",
        "Extensión de tríceps - 3x12",
      ],
    },
    {
      dia: "Día 2 - Espalda y Bíceps",
      ejercicios: [
        "Dominadas - 4x8",
        "Remo con barra - 4x10",
        "Jalón al pecho - 3x12",
        "Curl de bíceps - 3x12",
        "Curl martillo - 3x10",
      ],
    },
    {
      dia: "Día 3 - Pierna",
      ejercicios: [
        "Sentadillas - 4x10",
        "Prensa - 4x12",
        "Peso muerto - 3x10",
        "Extensión de pierna - 3x12",
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

  return (
    <div style={{ textAlign: "left" }}>
      <h2>🏋️ Rutinas</h2>

      {rutinas.map((rutina, index) => (
        <div key={index} style={styles.rutinaCard}>
          <h3>{rutina.dia}</h3>
          <ul>
            {rutina.ejercicios.map((ejercicio, i) => (
              <li key={i}>{ejercicio}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}