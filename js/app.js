// メインアプリケーション

/**
 * アプリケーション初期化
 */
document.addEventListener('DOMContentLoaded', () => {
    // カレンダーを初期化（今日の日付で）
    const today = new Date();
    renderCalendar(today.getFullYear(), today.getMonth());
    selectDate(formatDate(today));

    // グラフを初期化
    initChart();

    // イベントリスナーを設定
    setupEventListeners();
});

/**
 * イベントリスナーを設定
 */
function setupEventListeners() {
    // フォーム送信
    const dataForm = document.getElementById('dataForm');
    dataForm.addEventListener('submit', handleFormSubmit);

    // 削除ボタン
    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.addEventListener('click', handleDelete);

    // 月送り・月戻しボタン
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    prevMonthBtn.addEventListener('click', previousMonth);
    nextMonthBtn.addEventListener('click', nextMonth);
}

/**
 * フォーム送信を処理
 * @param {Event} event - フォームイベント
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const weightInput = document.getElementById('weight');
    const bodyFatInput = document.getElementById('bodyFat');

    const weight = parseFloat(weightInput.value);
    const bodyFat = parseFloat(bodyFatInput.value);

    // バリデーション
    if (isNaN(weight) || isNaN(bodyFat)) {
        alert('有効な数値を入力してください');
        return;
    }

    if (weight <= 0 || weight > 300) {
        alert('体重は0〜300kgの範囲で入力してください');
        return;
    }

    if (bodyFat < 0 || bodyFat > 100) {
        alert('体脂肪率は0〜100%の範囲で入力してください');
        return;
    }

    // データを保存
    const success = saveData(selectedDate, weight, bodyFat);

    if (success) {
        // 保存成功のフィードバック
        showFeedback('データを保存しました', 'success');

        // カレンダーを再描画（has-dataクラスを更新）
        renderCalendar(currentYear, currentMonth);

        // 選択状態を維持
        selectDate(selectedDate);

        // グラフを更新
        updateChart();

        // 削除ボタンを表示
        document.getElementById('deleteBtn').style.display = 'block';
    } else {
        showFeedback('データの保存に失敗しました', 'error');
    }
}

/**
 * データ削除を処理
 */
function handleDelete() {
    if (!confirm('このデータを削除してもよろしいですか?')) {
        return;
    }

    const success = deleteData(selectedDate);

    if (success) {
        // 削除成功のフィードバック
        showFeedback('データを削除しました', 'success');

        // フォームをクリア
        document.getElementById('weight').value = '';
        document.getElementById('bodyFat').value = '';
        document.getElementById('deleteBtn').style.display = 'none';

        // カレンダーを再描画
        renderCalendar(currentYear, currentMonth);

        // 選択状態を維持
        selectDate(selectedDate);

        // グラフを更新
        updateChart();
    } else {
        showFeedback('データの削除に失敗しました', 'error');
    }
}

/**
 * フィードバックメッセージを表示
 * @param {string} message - メッセージ
 * @param {string} type - タイプ（'success' または 'error'）
 */
function showFeedback(message, type) {
    // 既存のフィードバックを削除
    const existingFeedback = document.querySelector('.feedback-message');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // フィードバック要素を作成
    const feedback = document.createElement('div');
    feedback.className = `feedback-message feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
    `;

    document.body.appendChild(feedback);

    // 3秒後に自動削除
    setTimeout(() => {
        feedback.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// アニメーションのCSSを追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
