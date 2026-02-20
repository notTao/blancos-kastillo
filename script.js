// IMPORTACIÓN DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

/* --- FUNCIONES GLOBALES (ADMIN) --- */
window.openLogin = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

window.closeLogin = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.checkPass = async function() {
    const passwordInput = document.getElementById('adminPass').value;
    const db = getDatabase();

    try {
        const snapshot = await get(ref(db, 'adminConfig/password'));
        
        if (snapshot.exists() && passwordInput === snapshot.val()) {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        } else {
            const errorMsg = document.getElementById('error-msg');
            if (errorMsg) errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
}

// Enter para el Login
document.addEventListener('keypress', (e) => {
    const modal = document.getElementById('loginModal');
    if (e.key === 'Enter' && modal && modal.style.display === 'flex') {
        window.checkPass();
    }
});

/* --- FORMULARIO Y REGISTRO (FIREBASE + FORMSPREE) --- */
const form = document.getElementById('contact-form');
const responseMsg = document.getElementById('response-msg');
const submitBtn = document.getElementById('submit-btn');

if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (submitBtn) {
            submitBtn.classList.add('btn-loading');
            submitBtn.innerText = "Enviando...";
        }

        const emailInput = document.getElementById('email-input');
        const emailValue = emailInput ? emailInput.value : '';

        try {
            // A. GUARDAR EN FIREBASE (Para el Dashboard)
            await push(ref(db, 'registros'), {
                email: emailValue,
                fecha: new Date().toLocaleString(),
                ubicacion: "Lázaro Cárdenas"
            });

            // B. ENVIAR A FORMSPREE (Para el correo)
            const data = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.style.display = 'none'; 
                if (responseMsg) responseMsg.style.display = 'flex';
                if (window.lucide) lucide.createIcons(); 
            } else {
                throw new Error("Fallo en Formspree");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un error al procesar tu solicitud.");
            resetButton();
        }
    });
}

function resetButton() {
    if (submitBtn) {
        submitBtn.classList.remove('btn-loading');
        submitBtn.innerText = "Avisarme";
    }
}

/* --- ANIMACIÓN DE TEXTO --- */
const textElement = document.getElementById('typing-text');
const phrase = "Estamos renovando tu descanso";
let isDeleting = false;
let charIndex = 0;

function typeEffect() {
    if (!textElement) return; // Seguridad si no está en la página

    const currentText = phrase.substring(0, charIndex);
    textElement.textContent = currentText;
    textElement.classList.add('typing-cursor');

    if (!isDeleting && charIndex < phrase.length) {
        charIndex++;
        setTimeout(typeEffect, 100); 
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 50);
    } else {
        isDeleting = !isDeleting;
        const delay = !isDeleting ? 1000 : 8000; 
        setTimeout(typeEffect, delay);
    }
}

/* --- PRELOADER Y CARGA --- */
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    const yearElem = document.getElementById('year');
    if (yearElem) yearElem.textContent = new Date().getFullYear();
});

window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loader-hidden');
        }, 500);
    }
    if (window.lucide) lucide.createIcons();
});

/* --- MODO OSCURO --- */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeToggle && themeIcon) {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.setAttribute('data-lucide', 'sun');
        if (window.lucide) lucide.createIcons();
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.setAttribute('data-lucide', 'moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.setAttribute('data-lucide', 'sun');
        }
        if (window.lucide) lucide.createIcons();
    });
}

/* --- COMPARTIR --- */
window.shareSite = function() {
    const shareData = {
        title: 'Blancos Kastillo 🏠',
        text: '¡Hola! Mira lo nuevo que viene para el hogar en Lázaro Cárdenas. Renueva tu descanso con Blancos Kastillo. ✨🛌',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(err => console.log(err));
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("¡Enlace copiado! Ya puedes pegarlo en WhatsApp. 😊");
    }
}
