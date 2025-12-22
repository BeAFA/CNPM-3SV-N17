let myChart = null; // Biến lưu trữ biểu đồ để xóa đi vẽ lại khi cần

    // Hàm gọi API lấy dữ liệu từ Python
    function loadChartData() {
        const filterType = document.getElementById('chartFilter').value;

        // Gọi AJAX lên server
        $.ajax({
            url: '/admin/api/revenue-chart', // Khớp với route trong app.py
            type: 'POST',
            data: { filter: filterType }, // Gửi loại lọc: 'month' hoặc 'doctor'
            success: function(response) {
                // Nếu thành công, gọi hàm vẽ biểu đồ
                renderChart(response.labels, response.data, response.label_text);
            },
            error: function(err) {
                console.error("Lỗi tải dữ liệu biểu đồ:", err);
                alert("Không thể tải dữ liệu biểu đồ. Vui lòng kiểm tra Console.");
            }
        });
    }

    // Hàm vẽ biểu đồ bằng Chart.js
    function renderChart(labels, data, labelText) {
        const ctx = document.getElementById('revenueChart').getContext('2d');

        // QUAN TRỌNG: Nếu đã có biểu đồ cũ thì phải xóa đi trước khi vẽ mới
        if (myChart) {
            myChart.destroy();
        }

        // Cấu hình biểu đồ
        myChart = new Chart(ctx, {
            type: 'bar', // Loại biểu đồ: Cột
            data: {
                labels: labels, // Trục ngang (Tên bác sĩ hoặc Tháng)
                datasets: [{
                    label: labelText,
                    data: data, // Trục dọc (Doanh thu)
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // Màu cột (Xanh dương nhạt)
                    borderColor: 'rgba(54, 162, 235, 1)',      // Viền cột (Xanh dương đậm)
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            // Định dạng tiền tệ (VNĐ) cho trục dọc
                            callback: function(value) {
                                return value.toLocaleString('vi-VN') + ' đ';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toLocaleString('vi-VN') + ' đ';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Tự động tải biểu đồ mặc định (theo Tháng) khi trang vừa load xong
    document.addEventListener("DOMContentLoaded", function() {
        loadChartData();
    });