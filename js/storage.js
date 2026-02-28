// データ永続化モジュール（localStorage使用）

const STORAGE_KEY = 'weightTrackerData';

/**
 * すべてのデータを取得
 * @returns {Object} 日付をキーとしたデータオブジェクト
 */
function getAllData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('データ取得エラー:', error);
        return {};
    }
}

/**
 * 特定の日付のデータを取得
 * @param {string} date - 日付文字列（YYYY-MM-DD形式）
 * @returns {Object|null} データオブジェクト、または存在しない場合はnull
 */
function getData(date) {
    const allData = getAllData();
    return allData[date] || null;
}

/**
 * データを保存
 * @param {string} date - 日付文字列（YYYY-MM-DD形式）
 * @param {number} weight - 体重（kg）
 * @param {number} bodyFat - 体脂肪率（%）
 * @returns {boolean} 保存成功の可否
 */
function saveData(date, weight, bodyFat) {
    try {
        const allData = getAllData();
        allData[date] = {
            weight: parseFloat(weight),
            bodyFat: parseFloat(bodyFat),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
        return true;
    } catch (error) {
        console.error('データ保存エラー:', error);
        return false;
    }
}

/**
 * データを削除
 * @param {string} date - 日付文字列（YYYY-MM-DD形式）
 * @returns {boolean} 削除成功の可否
 */
function deleteData(date) {
    try {
        const allData = getAllData();
        if (allData[date]) {
            delete allData[date];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
            return true;
        }
        return false;
    } catch (error) {
        console.error('データ削除エラー:', error);
        return false;
    }
}

/**
 * 日付範囲のデータを取得（グラフ用）
 * @param {number} days - 過去何日分のデータを取得するか
 * @returns {Array} [{date, weight, bodyFat}, ...] の配列（日付昇順）
 */
function getDataRange(days = 30) {
    const allData = getAllData();
    const today = new Date();
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);

        if (allData[dateStr]) {
            result.push({
                date: dateStr,
                weight: allData[dateStr].weight,
                bodyFat: allData[dateStr].bodyFat
            });
        }
    }

    return result;
}

/**
 * Dateオブジェクトを YYYY-MM-DD 形式の文字列に変換
 * @param {Date} date - Dateオブジェクト
 * @returns {string} YYYY-MM-DD形式の文字列
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
