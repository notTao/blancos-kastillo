import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAqfV2bNgbN2xJ7-npeo8XFfmeYqNuViP8",
  authDomain: "blancos-kastillo.firebaseapp.com",
  databaseURL: "https://blancos-kastillo-default-rtdb.firebaseio.com",
  projectId: "blancos-kastillo",
  storageBucket: "blancos-kastillo.firebasestorage.app",
  messagingSenderId: "919945532090",
  appId: "1:919945532090:web:5c9c6343643f50e6aae883",
  measurementId: "G-XTHKBT9DBQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencias a la interfaz
const tableBody = document.querySelector('.admin-table tbody');
const totalCounter = document.querySelector('.stat-value');

onValue(ref(db, 'registros'), (snapshot) => {
    if (tableBody) {
        tableBody.innerHTML = ''; // Limpiar tabla antes de actualizar
        let count = 0;

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                count++;

                // Crear fila de la tabla
                const row = `
                    <tr>
                        <td>${data.fecha || 'N/A'}</td>
                        <td>${data.email}</td>
                        <td><span class="badge">Interesado</span></td>
                    </tr>
                `;
                // Insertar al inicio
                tableBody.insertAdjacentHTML('afterbegin', row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay registros aún.</td></tr>';
        }

        // Actualizar el contador
        if (totalCounter) {
            totalCounter.textContent = count;
        }
    }
}, (error) => {
    console.error("Error al leer de Firebase:", error);
});

// Función para Logout
window.logout = function() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}


// Función para exportar la tabla a CSV
window.exportTableToCSV = function() {
    const table = document.querySelector(".admin-table");
    let csv = [];
    
    // Obtener las filas de la tabla
    const rows = table.querySelectorAll("tr");
    
    for (let i = 0; i < rows.length; i++) {
        const row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (let j = 0; j < cols.length; j++) {
            // Limpiar el texto de comas
            let data = cols[j].innerText.replace(/,/g, ".");
            row.push(data);
        }
        csv.push(row.join(","));
    }

    // Crear el archivo descargable
    const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registros_blancos_kastillo.csv");
    document.body.appendChild(link);
    
    link.click(); // iniciar la descarga
    document.body.removeChild(link);
};
