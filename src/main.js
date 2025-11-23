// Importamos los estilos (Vite los inyectará en el head)
import './style.css'

// Importamos los datos desde el JSON
import invitationData from '../data.js' // Cambiar de .json a .js

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initEnvelope();
    startCountdown();
});

function loadData() {
    // Usamos el objeto 'invitationData' importado
    
    // Sobre
    document.getElementById('card-title').innerText = invitationData.envelopeCard.title;
    document.getElementById('card-msg').innerText = invitationData.envelopeCard.message;

    // Principal
    document.getElementById('couple-names').innerText = invitationData.couple.names;
    document.getElementById('hero-photo').src = invitationData.couple.photoUrl;
    document.getElementById('quote').innerText = invitationData.couple.quote;
    document.getElementById('date-display').innerText = invitationData.event.dateDisplay;
    
    // Ubicación
    document.getElementById('ceremony-place').innerText = invitationData.event.location.ceremony.place;
    document.getElementById('ceremony-hours').innerText = invitationData.event.location.ceremony.hours;
    document.getElementById('ceremony-btn').href = invitationData.event.location.ceremony.mapUrl;
    document.getElementById('reception-place').innerText = invitationData.event.location.reception.place;
    document.getElementById('reception-hours').innerText = invitationData.event.location.reception.hours;
    document.getElementById('reception-btn').href = invitationData.event.location.reception.mapUrl;
    // Cargar datos del calendario
    loadCalendar();
}

function loadCalendar() {
    const eventDate = new Date(invitationData.event.date);
    const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    
    // Actualizar encabezado
    document.getElementById('calendar-month').innerText = months[eventDate.getMonth()];
    document.getElementById('calendar-year').innerText = eventDate.getFullYear();
    
    // Generar días del mes
    generateMonthDays(eventDate);
}

function generateMonthDays(eventDate) {
    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';
    
    const year = eventDate.getFullYear();
    const month = eventDate.getMonth();
    const eventDay = eventDate.getDate();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Domingo
    
    // Fecha actual para resaltar
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDay = isCurrentMonth ? today.getDate() : null;
    
    // Celdas vacías antes del primer día
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day-cell empty';
        calendarDays.appendChild(emptyCell);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day-cell';
        dayCell.textContent = day;
        
        // Resaltar el día del evento
        if (day === eventDay) {
            dayCell.classList.add('event-day');
        }
        
        // Resaltar el día de hoy
        if (day === todayDay) {
            dayCell.classList.add('today');
        }
        
        calendarDays.appendChild(dayCell);
    }
}

function initEnvelope() {
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const cardStack = document.getElementById('card-stack');
    const backgroundMusic = document.getElementById('background-music');
    
    // Click en el sobre para abrir
    envelopeWrapper.addEventListener('click', () => {
        envelopeWrapper.classList.add('open');
        
        // Reproducir música al abrir el sobre
        if (backgroundMusic) {
            backgroundMusic.play().catch(err => {
                console.log('No se pudo reproducir el audio:', err);
            });
        }
        
        // Mostrar la tarjeta después de un breve delay
        setTimeout(() => {
            cardStack.classList.add('visible');
        }, 500);
    });

    // Click en la tarjeta para ir a la siguiente pantalla
    cardStack.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el click llegue al sobre
        document.getElementById('screen-1').style.display = 'none';
        document.getElementById('screen-2').style.display = 'block';
        window.scrollTo(0,0);
    });
}

function startCountdown() {
    const targetDate = new Date(invitationData.event.date).getTime();

    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            const timerEl = document.getElementById('countdown');
            if(timerEl) timerEl.innerHTML = "¡Es hoy!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('d').innerText = days;
        document.getElementById('h').innerText = hours;
        document.getElementById('m').innerText = minutes;
        document.getElementById('s').innerText = seconds;
    }, 1000);
}