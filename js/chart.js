// グラフ描画モジュール（Chart.js使用）

let weightChart = null;
let currentPeriod = 30; // デフォルトは30日

/**
 * グラフを初期化
 */
function initChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '体重 (kg)',
                    data: [],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y-weight',
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: '体脂肪率 (%)',
                    data: [],
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y-bodyFat',
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: 'BMI',
                    data: [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y-bmi',
                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y === null) {
                                return null;
                            }
                            label += context.parsed.y.toFixed(1);
                            if (context.dataset.yAxisID === 'y-weight') {
                                label += ' kg';
                            } else if (context.dataset.yAxisID === 'y-bodyFat') {
                                label += ' %';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '日付'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                'y-weight': {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '体重 (kg)',
                        color: '#2196F3'
                    },
                    ticks: {
                        color: '#2196F3'
                    },
                    grid: {
                        drawOnChartArea: true
                    }
                },
                'y-bodyFat': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '体脂肪率 (%) / BMI',
                        color: '#FF9800'
                    },
                    ticks: {
                        color: '#FF9800'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                },
                'y-bmi': {
                    type: 'linear',
                    display: false,
                    position: 'right'
                }
            }
        }
    });

    updateChart();
}

/**
 * グラフを更新
 * @param {number} days - 表示期間（日数）
 */
function updateChart(days = currentPeriod) {
    if (!weightChart) return;

    currentPeriod = days;

    // 指定期間のデータを取得
    const data = getDataRange(days);

    // ラベル（日付）とデータを準備
    const labels = [];
    const weights = [];
    const bodyFats = [];
    const bmis = [];

    const height = getHeight();

    data.forEach(item => {
        // 日付を「M/D」形式に変換
        const date = new Date(item.date);
        const label = `${date.getMonth() + 1}/${date.getDate()}`;
        labels.push(label);
        weights.push(item.weight);
        bodyFats.push(item.bodyFat);

        // BMIを計算（身長が設定されている場合）
        if (height && item.weight) {
            const bmi = calculateBMI(item.weight, height);
            bmis.push(bmi);
        } else {
            bmis.push(null);
        }
    });

    // データがない場合の処理
    if (labels.length === 0) {
        labels.push('データなし');
        weights.push(null);
        bodyFats.push(null);
        bmis.push(null);
    }

    // グラフを更新
    weightChart.data.labels = labels;
    weightChart.data.datasets[0].data = weights;
    weightChart.data.datasets[1].data = bodyFats;
    weightChart.data.datasets[2].data = bmis;

    // BMIデータセットの表示/非表示
    weightChart.data.datasets[2].hidden = !height || bmis.every(b => b === null);

    // Y軸の範囲を自動調整
    if (weights.filter(w => w !== null).length > 0) {
        const validWeights = weights.filter(w => w !== null);
        const minWeight = Math.min(...validWeights);
        const maxWeight = Math.max(...validWeights);
        const weightRange = maxWeight - minWeight || 1;

        weightChart.options.scales['y-weight'].min = Math.floor(minWeight - weightRange * 0.1);
        weightChart.options.scales['y-weight'].max = Math.ceil(maxWeight + weightRange * 0.1);
    }

    // 体脂肪率とBMIの範囲を調整
    const validBodyFats = bodyFats.filter(bf => bf !== null);
    const validBMIs = bmis.filter(b => b !== null);
    const allRightAxisValues = [...validBodyFats, ...validBMIs];

    if (allRightAxisValues.length > 0) {
        const minValue = Math.min(...allRightAxisValues);
        const maxValue = Math.max(...allRightAxisValues);
        const valueRange = maxValue - minValue || 1;

        weightChart.options.scales['y-bodyFat'].min = Math.floor(minValue - valueRange * 0.1);
        weightChart.options.scales['y-bodyFat'].max = Math.ceil(maxValue + valueRange * 0.1);
        weightChart.options.scales['y-bmi'].min = weightChart.options.scales['y-bodyFat'].min;
        weightChart.options.scales['y-bmi'].max = weightChart.options.scales['y-bodyFat'].max;
    }

    weightChart.update();
}

/**
 * 表示期間を変更
 * @param {number} days - 表示期間（日数）
 */
function changePeriod(days) {
    currentPeriod = days;
    updateChart(days);
}
