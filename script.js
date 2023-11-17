document.addEventListener('DOMContentLoaded', function () {
    const calendarContainer = document.getElementById('calendar-container');
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearElement = document.getElementById('month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const emojiSelector = document.getElementById('emoji-selector');
    const textareaInput = document.getElementById('textarea-input');
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');

    let currentDate = new Date();
    let selectedDate = currentDate;

    renderCalendar(currentDate);

    // Initialize emoji selector
    emojiSelector.addEventListener('change', function () {
        updateSelectedDateEmoji();
    });

    // Initialize save button
    saveButton.addEventListener('click', function () {
        saveEntryToLocalStorage();
        renderCalendar(currentDate); // Refresh the calendar after saving
    });

    resetButton.addEventListener('click', function () {
        showResetConfirmation();
    });

    function showResetConfirmation() {
        const isConfirmed = window.confirm('Are you sure you want to reset all entries? This action cannot be undone.');

        if (isConfirmed) {
            resetLocalStorage();
            renderCalendar(currentDate); // Refresh the calendar after resetting
        }
    }

    function resetLocalStorage() {
        localStorage.clear();
    }

    function renderCalendar(date) {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        
        // Calculate starting day, considering Monday as the first day of the week
        let startingDay = firstDayOfMonth.getDay() - 1; // Adjust for Monday (0-indexed)
    
        if (startingDay === -1) {
            startingDay = 6; // Adjust Sunday to be the last day of the week
        }
    
        calendarGrid.innerHTML = '';
    
        // Add day headings
        const dayHeadings = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (const heading of dayHeadings) {
            const dayHeadingCell = document.createElement('div');
            dayHeadingCell.classList.add('day-heading');
            dayHeadingCell.textContent = heading;
            calendarGrid.appendChild(dayHeadingCell);
        }
    
        monthYearElement.textContent = `${getMonthName(date.getMonth())} ${date.getFullYear()}`;
    
        // Render empty cells for days before the 1st day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = createCalendarDayElement('', true);
            calendarGrid.appendChild(emptyCell);
        }
    
        // Render days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const calendarDay = createCalendarDayElement(day, false);
            const emoji = createEmojiElement(date.getFullYear(), date.getMonth(), day);
            
            // Append day and emoji to the calendar day
            calendarDay.appendChild(document.createTextNode(day));
            calendarDay.appendChild(document.createElement('br'));
            calendarDay.appendChild(emoji);
    
            if (selectedDate && date.getMonth() === selectedDate.getMonth() && day === selectedDate.getDate()) {
                calendarDay.classList.add('selected');
                renderEntrySection();
            }
    
            calendarDay.addEventListener('click', function () {
                selectedDate = new Date(date.getFullYear(), date.getMonth(), day);
                renderCalendar(date);
                renderEntrySection();
            });
    
            calendarGrid.appendChild(calendarDay);
        }
    }
    



    function createCalendarDayElement(content, isEmptyCell) {
        const calendarDay = document.createElement('div');
        calendarDay.classList.add('calendar-day');
        if (isEmptyCell) {
            calendarDay.classList.add('empty-cell');
        }
        return calendarDay;
    }

    function createEmojiElement(year, month, day) {
        const storedEntry = getEntryFromLocalStorage(year, month, day);
        const emoji = storedEntry ? storedEntry.emoji : '⚫';

        const emojiElement = document.createElement('span');
        emojiElement.textContent = emoji;
        return emojiElement;
    }

    function updateSelectedDateEmoji() {
        const selectedEmoji = emojiSelector.value;
        saveEntryToLocalStorage(selectedEmoji);
        renderCalendar(currentDate); // Refresh the calendar after updating
    }

    function renderEntrySection() {
        const storedEntry = getEntryFromLocalStorage(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        emojiSelector.value = storedEntry ? storedEntry.emoji : '⚫';
        textareaInput.value = storedEntry ? storedEntry.text : '';
    }

    function saveEntryToLocalStorage(emoji = '⚫') {
        const entry = {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth(),
            day: selectedDate.getDate(),
            emoji: emojiSelector.value,
            text: textareaInput.value,
        };

        localStorage.setItem(`entry-${entry.year}-${entry.month}-${entry.day}`, JSON.stringify(entry));
    }

    function getEntryFromLocalStorage(year, month, day) {
        const entryKey = `entry-${year}-${month}-${day}`;
        const storedEntry = localStorage.getItem(entryKey);

        return storedEntry ? JSON.parse(storedEntry) : null;
    }

    prevMonthButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    function getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }
});