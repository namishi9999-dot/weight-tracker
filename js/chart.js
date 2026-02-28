// グラフ描画モジュール（Chart.js使用）

let weightChart = null;

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
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: '体脂肪率 (%)',
                    data: [],
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y-bodyFat',
                    pointRadius: 4,
                    pointHoverRadius: 6
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
                            label += context.parsed.y.toFixed(1);
                            if (context.dataset.yAxisID === 'y-weight') {
                                label += ' kg';
                            } else {
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
                        text: '体脂肪率 (%)',
                        color: '#FF9800'
                    },
                    ticks: {
                        color: '#FF9800'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });

    updateChart();
}

/**
 * グラフを更新
 */
function updateChart() {
    if (!weightChart) return;

    // 直近30日のデータを取得
    const data = getDataRange(30);

    // ラベル（日付）とデータを準備
    const labels = [];
    const weights = [];
    const bodyFats = [];

    data.forEach(item => {
        // 日付を「M/D」形式に変換
        const date = new Date(item.date);
        const label = `${date.getMonth() + 1}/${date.getDate()}`;
        labels.push(label);
        weights.push(item.weight);
        bodyFats.push(item.bodyFat);
    });

    // データがない場合の処理
    if (labels.length === 0) {
        labels.push('データなし');
        weights.push(null);
        bodyFats.push(null);
    }

    // グラフを更新
    weightChart.data.labels = labels;
    weightChart.data.datasets[0].data = weights;
    weightChart.data.datasets[1].data = bodyFats;

    // Y軸の範囲を自動調整
    if (weights.filter(w => w !== null).length > 0) {
        const validWeights = weights.filter(w => w !== null);
        const minWeight = Math.min(...validWeights);
        const maxWeight = Math.max(...validWeights);
        const weightRange = maxWeight - minWeight;

        weightChart.options.scales['y-weight'].min = Math.floor(minWeight - weightRange * 0.1);
        weightChart.options.scales['y-weight'].max = Math.ceil(maxWeight + weightRange * 0.1);
    }

    if (bodyFats.filter(bf => bf !== null).length > 0) {
        const validBodyFats = bodyFats.filter(bf => bf !== null);
        const minBodyFat = Math.min(...validBodyFats);
        const maxBodyFat = Math.max(...validBodyFats);
        const bodyFatRange = maxBodyFat - minBodyFat;

        weightChart.options.scales['y-bodyFat'].min = Math.floor(minBodyFat - bodyFatRange * 0.1);
        weightChart.options.scales['y-bodyFat'].max = Math.ceil(maxBodyFat + bodyFatRange * 0.1);
    }

    weightChart.update();
}
