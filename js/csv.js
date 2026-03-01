// CSV エクスポート / インポート モジュール

/**
 * CSVエクスポート
 * Web Share API が使える場合はシェアシート経由、そうでない場合はダウンロード
 */
function exportCSV() {
    const allData = getAllData();
    const dates = Object.keys(allData).sort();

    if (dates.length === 0) {
        showFeedback('エクスポートするデータがありません', 'error');
        return;
    }

    // CSV文字列を生成（UTF-8 BOM付き）
    const header = '日付,体重(kg),体脂肪率(%),BMI,記録日時\n';
    const rows = dates.map((date) => {
        const d = allData[date];
        const bmi = d.bmi != null ? d.bmi.toFixed(1) : '';
        return `${date},${d.weight},${d.bodyFat},${bmi},${d.timestamp || ''}`;
    });
    const csvContent = '\uFEFF' + header + rows.join('\n');

    const today = formatDate(new Date());
    const filename = `weight-data-${today}.csv`;

    // Web Share API（iOS Safariなど）でシェアシート経由のメール送信
    if (navigator.share && navigator.canShare) {
        const file = new File([csvContent], filename, { type: 'text/csv' });
        if (navigator.canShare({ files: [file] })) {
            navigator.share({
                files: [file],
                title: '体重データ',
                text: `体重データ (${dates.length}件)`
            }).then(() => {
                showFeedback('シェアシートを開きました', 'success');
            }).catch((err) => {
                if (err.name !== 'AbortError') {
                    downloadCSV(csvContent, filename);
                }
            });
            return;
        }
    }

    // フォールバック: ファイルダウンロード
    downloadCSV(csvContent, filename);
}

/**
 * CSVファイルをダウンロード
 * @param {string} content - CSV文字列
 * @param {string} filename - ファイル名
 */
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showFeedback('CSVをダウンロードしました', 'success');
}

/**
 * CSVインポート
 * @param {File} file - 読み込むCSVファイル
 */
function importCSV(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            let text = e.target.result;

            // BOMを除去
            if (text.charCodeAt(0) === 0xFEFF) {
                text = text.slice(1);
            }

            const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');

            if (lines.length < 2) {
                showFeedback('CSVファイルにデータがありません', 'error');
                return;
            }

            // ヘッダー行をスキップ（1行目）
            let successCount = 0;
            let errorCount = 0;

            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',');
                if (cols.length < 3) {
                    errorCount++;
                    continue;
                }

                const date = cols[0].trim();
                const weight = parseFloat(cols[1]);
                const bodyFat = parseFloat(cols[2]);
                const bmi = cols[3] ? parseFloat(cols[3]) : null;

                // バリデーション
                if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                    errorCount++;
                    continue;
                }
                if (isNaN(weight) || weight <= 0 || weight > 300) {
                    errorCount++;
                    continue;
                }
                if (isNaN(bodyFat) || bodyFat < 0 || bodyFat > 100) {
                    errorCount++;
                    continue;
                }

                const saved = saveData(date, weight, bodyFat, bmi && !isNaN(bmi) ? bmi : null);
                if (saved) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            // UIを更新
            renderCalendar(currentYear, currentMonth);
            selectDate(selectedDate);
            updateChart();

            if (errorCount === 0) {
                showFeedback(`${successCount}件のデータをインポートしました`, 'success');
            } else {
                showFeedback(`${successCount}件成功 / ${errorCount}件スキップ`, 'success');
            }
        } catch (err) {
            console.error('CSVインポートエラー:', err);
            showFeedback('CSVの読み込みに失敗しました', 'error');
        }
    };

    reader.onerror = () => {
        showFeedback('ファイルの読み込みに失敗しました', 'error');
    };

    reader.readAsText(file, 'UTF-8');
}
