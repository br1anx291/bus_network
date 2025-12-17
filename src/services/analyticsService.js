import pb from '~/api/pocketbase';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);
dayjs.locale('vi');

export const analyticsService = {
  getPickupTrend: async (timeRange, routeId = null) => {
      try {
        let currentStart, currentEnd, pastStart, pastEnd;
        let labels = [];
        let isWeekly = (timeRange === 'Tuần này');

        if (isWeekly) {
          currentStart = dayjs().startOf('week').format('YYYY-MM-DD 00:00:00');
          currentEnd = dayjs().endOf('week').format('YYYY-MM-DD 23:59:59');
          
          pastStart = dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD 00:00:00');
          pastEnd = dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD 23:59:59');

          labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        } else {
          currentStart = dayjs().startOf('month').format('YYYY-MM-DD 00:00:00');
          currentEnd = dayjs().endOf('month').format('YYYY-MM-DD 23:59:59');
          
          pastStart = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD 00:00:00');
          pastEnd = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD 23:59:59');

          const daysInMonth = dayjs().daysInMonth();
          labels = Array.from({length: daysInMonth}, (_, i) => (i + 1).toString());
        }

        let baseFilter = '';

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

        const aggregateData = (items) => {
          const counts = new Array(labels.length).fill(0);

          items.forEach(item => {
            const dateVal = item.created_at || item.created;
            const d = dayjs(dateVal);
            let index = -1;
            if (isWeekly) {
              const dayOfWeek = d.day(); 
              index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            } else {
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

        const chartData = labels.map((label, idx) => {
          return {
            name: label,
            tuanNay: currentCounts[idx], 
            tuanTruoc: pastCounts[idx], 
          };
        });
        return chartData;
      } catch (error) {
        console.error("Lỗi lấy data biểu đồ đường:", error);
        return [];
      }
  },

  getTopStations: async (timeRange, routeId) => {
    try {
      let dateFilter = '';
      if (timeRange === 'Tuần này') {
        const start = dayjs().startOf('week').format('YYYY-MM-DD 00:00:00');
        dateFilter = `created_at >= "${start}"`;
      } else {
        const start = dayjs().startOf('month').format('YYYY-MM-DD 00:00:00');
        dateFilter = `created_at >= "${start}"`;
      }

      const records = await pb.collection('pickup_requests').getFullList({
        filter: dateFilter,
        expand: 'stations',
      });

      const stationCounts = {};
      records.forEach(rec => {
        const stationName = rec.expand?.stations?.name || 'Unknown';
        stationCounts[stationName] = (stationCounts[stationName] || 0) + 1;
      });


      const chartData = Object.keys(stationCounts)
        .map(name => ({ stationName: name, count: stationCounts[name] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return chartData;
    } catch (error) {
      console.error("Lỗi lấy top trạm:", error);
      return [];
    }
  },


getIncidentTypes: async (timeRange) => {
    try {
      let dateFilter = '';
      if (timeRange === 'Tuần này') {
        const start = dayjs().startOf('week').format('YYYY-MM-DD 00:00:00');
        dateFilter = `created >= "${start}"`;
      } else {
        const start = dayjs().startOf('month').format('YYYY-MM-DD 00:00:00');
        dateFilter = `created >= "${start}"`;
      }

      const records = await pb.collection('incidents').getFullList({
        filter: dateFilter,
        fields: 'category', 
      });

      const categoryMap = {
        'technical': 'Kỹ thuật',
        'personnal': 'Nhân sự', 
        'personnel': 'Nhân sự',
        'traffic': 'Giao thông',
      };

      const counts = {};
      
      records.forEach(rec => {
        const rawCategory = rec.category || 'other';
        const label = categoryMap[rawCategory] || 'Khác'; 
        counts[label] = (counts[label] || 0) + 1;
      });

      const chartData = Object.keys(counts)
        .map(label => ({ type: label, count: counts[label] }))
        .sort((a, b) => b.count - a.count); 

      return chartData;
    } catch (error) {
      console.error("Lỗi lấy loại sự cố:", error);
      return [];
    }
  }
};