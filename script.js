// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Heart Trail Effect (Runs on all pages) ---
    let lastHeartTime = 0;
    const heartCooldown = 50; // Milliseconds between hearts

    function createHeart(x, y) {
        const now = Date.now();
        if (now - lastHeartTime < heartCooldown) return; // Throttle
        lastHeartTime = now;

        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️'; // You can use other heart emojis like 💕💖💗💓💞

        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        heart.style.left = `${x + offsetX}px`;
        heart.style.top = `${y + offsetY}px`;
        heart.style.animationDuration = `${0.8 + Math.random() * 0.4}s`;
        heart.style.transform = `scale(${0.8 + Math.random() * 0.4})`;

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1200);
    }

    document.addEventListener('mousemove', (e) => {
        createHeart(e.clientX, e.clientY);
    });

    // --- Page Specific Logic ---

    // Check if we are on Page 1
    const page1 = document.getElementById('page1');
    if (page1) {
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        const container = noBtn.parentElement; // Button container
        
        yesBtn.addEventListener('click', () => {
            window.location.href = 'page2.html'; // Navigate to page 2
        });

        noBtn.addEventListener('mouseover', dodgeCursor);
        noBtn.addEventListener('click', dodgeCursor); // Also dodge on click attempt

        function dodgeCursor() {
            const buttonRect = noBtn.getBoundingClientRect();
            const container = noBtn.parentElement; // Button container
            const containerRect = container.getBoundingClientRect();

            const maxX = containerRect.width - buttonRect.width - 10;
            const maxY = containerRect.height - buttonRect.height - 10;

            let randomX = Math.random() * maxX;
            let randomY = Math.random() * maxY;

            // Simple check to avoid overlapping the general area of yesBtn
             const yesBtnRect = yesBtn.getBoundingClientRect();
             const yesBtnCenter = yesBtnRect.left + yesBtnRect.width / 2 - containerRect.left;
             const buffer = yesBtnRect.width / 2 + buttonRect.width / 2 + 20; // safety buffer

             // If generated X is too close to Yes button's center, try again or force away
             if (Math.abs(randomX + buttonRect.width / 2 - yesBtnCenter) < buffer) {
                  // Force it to the opposite side of where it generated
                  if (randomX < yesBtnCenter) {
                      randomX = Math.min(maxX, yesBtnCenter + buffer + Math.random() * 50);
                  } else {
                      randomX = Math.max(0, yesBtnCenter - buffer - Math.random() * 50);
                  }
             }
             // Clamp values
             randomX = Math.max(0, Math.min(maxX, randomX));
             randomY = Math.max(0, Math.min(maxY, randomY));

            noBtn.style.left = `${randomX}px`;
            noBtn.style.top = `${randomY}px`;
        }

        function resetNoButtonPosition() {
            // Wait slightly for layout calculation
            requestAnimationFrame(() => {
                const container = noBtn.parentElement;
                const containerRect = container.getBoundingClientRect();
                const buttonRect = noBtn.getBoundingClientRect();
                if (containerRect.width > 0 && buttonRect.width > 0) {
                    noBtn.style.left = `${(containerRect.width / 2) + 40}px`; // Start slightly right of center
                    noBtn.style.top = `${(containerRect.height / 2) - (buttonRect.height / 2)}px`; // Center vertically
                } else {
                    // Fallback if dimensions aren't ready
                     noBtn.style.left = 'calc(50% + 40px)';
                     noBtn.style.top = '50%';
                     noBtn.style.transform = 'translateY(-50%)'; // Better vertical centering fallback
                }
                noBtn.style.position = 'absolute'; // Ensure it's absolute
            });
        }
        resetNoButtonPosition(); // Initial position
        window.addEventListener('resize', resetNoButtonPosition); // Reposition on resize
    }

    // Check if we are on Page 2
    const page2 = document.getElementById('page2');
    if (page2) {
        const checkBirthdayBtn = document.getElementById('checkBirthdayBtn');
        const birthdayInput = document.getElementById('birthdayInput');
        const birthdayError = document.getElementById('birthdayError');
        const correctBirthday = "2005-06-29"; // YYYY-MM-DD format

        checkBirthdayBtn.addEventListener('click', () => {
            const enteredBirthday = birthdayInput.value;
            if (enteredBirthday === correctBirthday) {
                birthdayError.textContent = '';
                window.location.href = 'page3.html'; // Navigate to page 3
            } else {
                birthdayError.textContent = 'Hmm, sepertinya salah. Coba lagi?';
                birthdayInput.focus();
                birthdayInput.style.borderColor = '#c92a2a';
                setTimeout(() => { birthdayInput.style.borderColor = '#f06595'; }, 2000);
            }
        });
    }

    // Check if we are on Page 3
    const page3 = document.getElementById('page3');
    if (page3) {
        const scheduleBtn = document.getElementById('scheduleBtn');
        const dateInput = document.getElementById('dateInput');
        const timeInput = document.getElementById('timeInput');
        const gameOptions = document.querySelectorAll('.game-option');
        const gameChoiceInput = document.getElementById('gameChoice');

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);

        gameOptions.forEach(option => {
            option.addEventListener('click', () => {
                gameOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                gameChoiceInput.value = option.getAttribute('data-game');
            });
        });

        scheduleBtn.addEventListener('click', () => {
            const selectedDate = dateInput.value;
            const selectedTime = timeInput.value;
            const selectedGame = gameChoiceInput.value;

            if (!selectedDate || !selectedTime || !selectedGame) {
                alert('Tolong pilih tanggal, waktu, dan aktivitas!');
                return;
            }

            // Encode data for URL parameters
            const urlParams = new URLSearchParams({
                date: selectedDate,
                time: selectedTime,
                game: selectedGame
            });

            // Navigate to page 4 with data in URL
            window.location.href = `page4.html?${urlParams.toString()}`;
        });
    }

    // Check if we are on Page 4
    const page4 = document.getElementById('page4');
    if (page4) {
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        const summaryGame = document.getElementById('summaryGame');

        // Get data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get('date');
        const timeParam = urlParams.get('time');
        const gameParam = urlParams.get('game');

        // Format date (optional but nicer)
        let formattedDate = 'Tidak dipilih';
        if (dateParam) {
            try {
                 const dateObj = new Date(dateParam + 'T00:00:00'); // Avoid timezone issues by setting time
                 formattedDate = dateObj.toLocaleDateString('id-ID', { // Use Indonesian locale
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                 });
            } catch (e) { console.error("Error formatting date:", e); }
        }

        // Format time (optional but nicer)
        let formattedTime = 'Tidak dipilih';
         if (timeParam) {
             try {
                 // Create a dummy date object just to use time formatting
                 const [hours, minutes] = timeParam.split(':');
                 const timeObj = new Date();
                 timeObj.setHours(hours, minutes, 0, 0);
                 formattedTime = timeObj.toLocaleTimeString('id-ID', { // Use Indonesian locale
                    hour: '2-digit', minute: '2-digit', hour12: false // Use 24-hour format standard in ID
                 }) + " WIB"; // Assume WIB, adjust if needed
             } catch (e) { console.error("Error formatting time:", e); }
         }


        summaryDate.textContent = formattedDate;
        summaryTime.textContent = formattedTime;
        summaryGame.textContent = gameParam || 'Tidak dipilih'; // Use the raw value from URL
    }

}); // End DOMContentLoaded