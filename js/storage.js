// データ永続化モジュール（localStorage使用）

const STORAGE_KEY = 'weightTrackerData';
const SETTINGS_KEY = 'weightTrackerSettings';

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
 * @param {number} bmi - BMI（オプション）
 * @returns {boolean} 保存成功の可否
 */
function saveData(date, weight, bodyFat, bmi = null) {
    try {
        const allData = getAllData();
        const dataEntry = {
            weight: parseFloat(weight),
            bodyFat: parseFloat(bodyFat),
            timestamp: new Date().toISOString()
        };
        if (bmi !== null) {
            dataEntry.bmi = parseFloat(bmi);
        }
        allData[date] = dataEntry;
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

/**
 * 設定を保存
 * @param {Object} settings - 設定オブジェクト
 * @returns {boolean} 保存成功の可否
 */
function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('設定保存エラー:', error);
        return false;
    }
}

/**
 * 設定を取得
 * @returns {Object} 設定オブジェクト
 */
function getSettings() {
    try {
        const settings = localStorage.getItem(SETTINGS_KEY);
        return settings ? JSON.parse(settings) : {};
    } catch (error) {
        console.error('設定取得エラー:', error);
        return {};
    }
}

/**
 * 身長を取得
 * @returns {number|null} 身長（cm）
 */
function getHeight() {
    const settings = getSettings();
    return settings.height || null;
}

/**
 * 身長を保存
 * @param {number} height - 身長（cm）
 * @returns {boolean} 保存成功の可否
 */
function saveHeight(height) {
    const settings = getSettings();
    settings.height = parseFloat(height);
    return saveSettings(settings);
}

/**
 * BMIを計算
 * @param {number} weight - 体重（kg）
 * @param {number} height - 身長（cm）
 * @returns {number|null} BMI
 */
function calculateBMI(weight, height) {
    if (!weight || !height || height <= 0) {
        return null;
    }
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

/**
 * BMIカテゴリーを取得
 * @param {number} bmi - BMI値
 * @returns {Object} {category: string, label: string}
 */
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return { category: 'underweight', label: '低体重' };
    } else if (bmi < 25) {
        return { category: 'normal', label: '普通体重' };
    } else if (bmi < 30) {
        return { category: 'overweight', label: '肥満（1度）' };
    } else {
        return { category: 'obese', label: '肥満（2度以上）' };
    }
}
