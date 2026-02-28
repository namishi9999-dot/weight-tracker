// カレンダー描画モジュール

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = formatDate(new Date());

const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * カレンダーを描画
 * @param {number} year - 年
 * @param {number} month - 月（0-11）
 */
function renderCalendar(year, month) {
    currentYear = year;
    currentMonth = month;

    // 月の表示を更新
    const monthDisplay = document.getElementById('currentMonth');
    monthDisplay.textContent = `${year}年 ${month + 1}月`;

    // カレンダーグリッドをクリア
    const calendarGrid = document.getElementById('calendar');
    calendarGrid.innerHTML = '';

    // 曜日ヘッダーを追加
    weekDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    // 月の最初の日と最後の日を取得
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    const todayStr = formatDate(today);

    // 月の最初の日の曜日（0=日曜日）
    const firstDayOfWeek = firstDay.getDay();

    // 前月の日付を追加（グレー表示）
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const dateStr = formatDate(new Date(year, month - 1, day));
        createDayElement(day, dateStr, true);
    }

    // 当月の日付を追加
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = formatDate(new Date(year, month, day));
        createDayElement(day, dateStr, false);
    }

    // 次月の日付を追加（グリッドを埋めるため）
    const totalCells = calendarGrid.children.length - 7; // 曜日ヘッダーを除く
    const remainingCells = 42 - totalCells; // 6週間分（42マス）
    for (let day = 1; day <= remainingCells; day++) {
        const dateStr = formatDate(new Date(year, month + 1, day));
        createDayElement(day, dateStr, true);
    }
}

/**
 * 日付要素を作成
 * @param {number} day - 日
 * @param {string} dateStr - 日付文字列（YYYY-MM-DD）
 * @param {boolean} isOtherMonth - 他の月の日付かどうか
 */
function createDayElement(day, dateStr, isOtherMonth) {
    const calendarGrid = document.getElementById('calendar');
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    dayElement.dataset.date = dateStr;

    // クラスを追加
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }

    const today = new Date();
    const todayStr = formatDate(today);

    if (dateStr === todayStr) {
        dayElement.classList.add('today');
    }

    if (dateStr === selectedDate) {
        dayElement.classList.add('selected');
    }

    // データが存在する日付をハイライト
    const data = getData(dateStr);
    if (data) {
        dayElement.classList.add('has-data');
    }

    // 未来の日付を無効化
    if (new Date(dateStr) > today) {
        dayElement.classList.add('disabled');
        dayElement.style.cursor = 'not-allowed';
    } else {
        // クリックイベント
        dayElement.addEventListener('click', () => selectDate(dateStr));
    }

    calendarGrid.appendChild(dayElement);
}

/**
 * 日付を選択
 * @param {string} dateStr - 日付文字列（YYYY-MM-DD）
 */
function selectDate(dateStr) {
    // 未来の日付は選択不可
    if (new Date(dateStr) > new Date()) {
        return;
    }

    selectedDate = dateStr;

    // 選択状態を更新
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
        if (day.dataset.date === dateStr) {
            day.classList.add('selected');
        }
    });

    // 選択日付を表示
    const date = new Date(dateStr);
    const displayText = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    document.getElementById('selectedDateDisplay').textContent = displayText;

    // フォームにデータを読み込む
    loadDataToForm(dateStr);
}

/**
 * フォームにデータを読み込む
 * @param {string} dateStr - 日付文字列（YYYY-MM-DD）
 */
function loadDataToForm(dateStr) {
    const data = getData(dateStr);
    const weightInput = document.getElementById('weight');
    const bodyFatInput = document.getElementById('bodyFat');
    const deleteBtn = document.getElementById('deleteBtn');

    if (data) {
        weightInput.value = data.weight;
        bodyFatInput.value = data.bodyFat;
        deleteBtn.style.display = 'block';
    } else {
        weightInput.value = '';
        bodyFatInput.value = '';
        deleteBtn.style.display = 'none';
    }
}

/**
 * 前月へ移動
 */
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
}

/**
 * 翌月へ移動
 */
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
}

/**
 * 今日の日付を選択
 */
function selectToday() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    selectedDate = formatDate(today);
    renderCalendar(currentYear, currentMonth);
    selectDate(selectedDate);
}
