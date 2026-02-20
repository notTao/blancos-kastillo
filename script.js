
// Abrir la ventana modal
function openLogin() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Validar la contraseña
function checkPass() {
    const pass = document.getElementById('adminPass').value;
    const errorMsg = document.getElementById('error-msg');

    const SECRET_KEY = 'admin2026';

    if (pass === SECRET_KEY) {
        window.location.href = "dashboard.html";
    } else {
        errorMsg.style.display = 'block';
        document.getElementById('adminPass').value = '';
    }
}

// Permitir el uso de la tecla "Enter" para enviar
document.addEventListener('keypress', function (e) {
    const modal = document.getElementById('loginModal');
    if (e.key === 'Enter' && modal.style.display === 'flex') {
        checkPass();
    }
});

const form = document.getElementById('contact-form');
const responseMsg = document.getElementById('response-msg');
const submitBtn = document.getElementById('submit-btn');

if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        submitBtn.classList.add('btn-loading');
        submitBtn.innerText = "Enviando...";

        const data = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.style.display = 'none'; 
                responseMsg.style.display = 'flex';
                if (window.lucide) lucide.createIcons(); 
            } else {
                alert("Hubo un problema con el envío.");
                resetButton();
            }
        } catch (error) {
            alert("Error de conexión.");
            resetButton();
        }
    });
}

function resetButton() {
    submitBtn.classList.remove('btn-loading');
    submitBtn.innerText = "Avisarme";
}

/* Mapa Google Maps */
window.addEventListener('load', () => {
    if (window.lucide) {
        lucide.createIcons();
    }
});

/* ---------------------------------------------------------------------------- */

// * Animaciones
const textElement = document.getElementById('typing-text');
const phrase = "Estamos renovando tu descanso";
let isDeleting = false;
let charIndex = 0;

function typeEffect() {
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

/* ---------------------------------------------------------------------------- */

//* Preloader
document.addEventListener('DOMContentLoaded', typeEffect);

window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');

    setTimeout(() => {
        loader.classList.add('loader-hidden');
    }, 500);
});

/* ---------------------------------------------------------------------------- */

//* Modo Oscuro / Modo Claro
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.setAttribute('data-lucide', 'sun');
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

    lucide.createIcons();
});

/* ---------------------------------------------------------------------------- */

//* Share website
function shareSite() {
    const shareData = {
        title: 'Blancos Kastillo 🏠',
        text: '¡Hola! Mira lo nuevo que viene para el hogar en Lázaro Cárdenas. Renueva tu descanso con Blancos Kastillo. ✨🛌',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Contenido compartido con éxito'))
            .catch((error) => console.log('Error al compartir:', error));
    } else {
        // Fallback para computadoras
        navigator.clipboard.writeText(window.location.href);
        alert("¡Enlace copiado! Ya puedes pegarlo en WhatsApp para invitar a tus amigos. 😊");
    }
}

document.getElementById('year').textContent = new Date().getFullYear();
