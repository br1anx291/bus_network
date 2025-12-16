// src/services/analyticsService.js
import pb from '~/api/pocketbase';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);
dayjs.locale('vi');

export const analyticsService = {
  
  /**
   * 1. LẤY DỮ LIỆU BIỂU ĐỒ ĐƯỜNG (So sánh Tuần này vs Tuần trước)
   * Dựa trên số lượng Pickup Requests (Yêu cầu đón)
   */
getPickupTrend: async (timeRange, routeId = null) => {
    try {
      let currentStart, currentEnd, pastStart, pastEnd;
      let labels = [];
      let isWeekly = (timeRange === 'Tuần này');

      // A. CẤU HÌNH THỜI GIAN
      if (isWeekly) {
        // TUẦN: So sánh Thứ 2 - CN
        currentStart = dayjs().startOf('week').format('YYYY-MM-DD 00:00:00');
        currentEnd = dayjs().endOf('week').format('YYYY-MM-DD 23:59:59');
        
        pastStart = dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD 00:00:00');
        pastEnd = dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD 23:59:59');

        labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
      } else {
        // THÁNG: So sánh Ngày 1 - 31 (hoặc 30)
        currentStart = dayjs().startOf('month').format('YYYY-MM-DD 00:00:00');
        currentEnd = dayjs().endOf('month').format('YYYY-MM-DD 23:59:59'); // Lấy hết tháng hiện tại
        
        // Tháng trước
        pastStart = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD 00:00:00');
        pastEnd = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD 23:59:59');

        // Tạo nhãn từ 1 đến số ngày trong tháng hiện tại (ví dụ 1..31)
        const daysInMonth = dayjs().daysInMonth();
        labels = Array.from({length: daysInMonth}, (_, i) => (i + 1).toString());
      }

      let baseFilter = '';
      // if (routeId) baseFilter = ... (Logic route giữ nguyên nếu có)

      // B. GỌI API (Song song)
      const [currentRes, pastRes] = await Promise.all([
        pb.collection('pickup_requests').getFullList({
          filter: `${baseFilter} created_at >= "${currentStart}" && created_at <= "${currentEnd}"`,
          fields: 'created_at', 
        }),
        pb.collection('pickup_requests').getFullList({
          filter: `${baseFilter} created_at >= "${pastStart}" && created_at <= "${pastEnd}"`,
          fields: 'created_at',
        })
      ]);

      // C. HÀM GOM NHÓM DỮ LIỆU
      // Input: list records -> Output: Array số lượng khớp với labels
      const aggregateData = (items) => {
        // Tạo mảng đếm có độ dài bằng labels, điền sẵn số 0
        const counts = new Array(labels.length).fill(0);

        items.forEach(item => {
          const dateVal = item.created_at || item.created;
          const d = dayjs(dateVal);

          let index = -1;
          if (isWeekly) {
             // Nếu là tuần: day() trả về 0(CN) -> 6(T7). Cần map sang index 0(T2) -> 6(CN)
             // T2(1)->0, T3(2)->1... CN(0)->6
             const dayOfWeek = d.day(); 
             index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          } else {
             // Nếu là tháng: date() trả về 1->31. Map sang index 0->30
             index = d.date() - 1; 
          }

          if (index >= 0 && index < counts.length) {
            counts[index]++;
          }
        });
        return counts;
      };

      const currentCounts = aggregateData(currentRes);
      const pastCounts = aggregateData(pastRes);

      // D. KHỚP DATA VÀO FORMAT BIỂU ĐỒ
      const chartData = labels.map((label, idx) => {
        return {
          name: label,
          tuanNay: currentCounts[idx],  // Recharts sẽ vẽ dòng này
          tuanTruoc: pastCounts[idx], // Và dòng này
        };
      });

      return chartData;

    } catch (error) {
      console.error("Lỗi lấy data biểu đồ đường:", error);
      return [];
    }
  },

  /**
   * 2. LẤY TOP TRẠM ĐƯỢC YÊU CẦU NHIỀU NHẤT (Bar Chart 1)
   */
  getTopStations: async (timeRange, routeId) => {
    try {
      // Xử lý timeRange ('Tuần này' / 'Tháng này') -> Filter Date
      let dateFilter = '';
      if (timeRange === 'Tuần này') {
        const start = dayjs().startOf('week').format('YYYY-MM-DD 00:00:00');
        dateFilter = `created_at >= "${start}"`;
      } else {
        const start = dayjs().startOf('month').format('YYYY-MM-DD 00:00:00');
        dateFilter = `created_at >= "${start}"`;
      }

      // Lấy dữ liệu
      const records = await pb.collection('pickup_requests').getFullList({
        filter: dateFilter,
        expand: 'stations', // Lấy tên trạm
      });

      // Aggregation (Đếm số lần xuất hiện của mỗi trạm)
      const stationCounts = {};
      records.forEach(rec => {
        const stationName = rec.expand?.stations?.name || 'Unknown';
        stationCounts[stationName] = (stationCounts[stationName] || 0) + 1;
      });

      // Chuyển về mảng và sort
      const chartData = Object.keys(stationCounts)
        .map(name => ({ stationName: name, count: stationCounts[name] }))
        .sort((a, b) => b.count - a.count) // Cao nhất lên đầu
        .slice(0, 5); // Top 5

      return chartData;
    } catch (error) {
      console.error("Lỗi lấy top trạm:", error);
      return [];
    }
  },

  /**
   * 3. PHÂN LOẠI SỰ CỐ (Bar Chart 2)
   */
getIncidentTypes: async (timeRange) => {
    try {
      // 1. Xác định thời gian lọc
      let dateFilter = '';
      if (timeRange === 'Tuần này') {
        const start = dayjs().startOf('week').format('YYYY-MM-DD 00:00:00');
        dateFilter = `created >= "${start}"`;
      } else {
        const start = dayjs().startOf('month').format('YYYY-MM-DD 00:00:00');
        dateFilter = `created >= "${start}"`;
      }

      // 2. Query dữ liệu
      // Thay đổi: Lấy field 'category' thay vì 'type'
      const records = await pb.collection('incidents').getFullList({
        filter: dateFilter,
        fields: 'category', 
      });

      // 3. Bộ từ điển Mapping (Anh -> Việt)
      const categoryMap = {
        'technical': 'Kỹ thuật',
        'personnal': 'Nhân sự', // Giữ nguyên từ bạn đặt (dù đúng tiếng Anh là personnel)
        'personnel': 'Nhân sự', // Map thêm từ đúng để phòng hờ sau này sửa DB
        'traffic': 'Giao thông',
      };

      // 4. Aggregation (Đếm số lượng)
      const counts = {};
      
      records.forEach(rec => {
        // Lấy value thô từ DB (ví dụ: 'technical')
        const rawCategory = rec.category || 'other';
        
        // Chuyển sang tiếng Việt (ví dụ: 'Kỹ thuật')
        // Nếu không có trong map thì hiển thị 'Khác'
        const label = categoryMap[rawCategory] || 'Khác'; 

        counts[label] = (counts[label] || 0) + 1;
      });

      // 5. Format dữ liệu cho Recharts
      // Trả về dạng [{ type: 'Kỹ thuật', count: 5 }, ...]
      // Giữ key là 'type' để không phải sửa UI bên AnalyzePage
      const chartData = Object.keys(counts)
        .map(label => ({ type: label, count: counts[label] }))
        .sort((a, b) => b.count - a.count); // Sắp xếp giảm dần

      return chartData;
    } catch (error) {
      console.error("Lỗi lấy loại sự cố:", error);
      return [];
    }
  }
};