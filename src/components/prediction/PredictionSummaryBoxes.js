import React, { useState, useEffect } from 'react';
import './PredictionSummaryBoxes.css'; // นำเข้าไฟล์ CSS
import BASE_URL from '../../api';

const PredictionSummaryBoxes = () => {
  const [summaries, setSummaries] = useState({
    oneMonth: { prediction: 0, start: null, end: null },
    threeMonths: { prediction: 0, start: null, end: null },
    sixMonths: { prediction: 0, start: null, end: null },
    twelveMonths: { prediction: 0, start: null, end: null }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/prediction_sum_by_month`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // จัดเรียงข้อมูลตามเดือนและปี
        const sortedData = data.sort((a, b) => {
          const monthOrder = { 'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
                               'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12 };
          if (a.year_predict !== b.year_predict) {
            return a.year_predict - b.year_predict;
          }
          return monthOrder[a.month_predict] - monthOrder[b.month_predict];
        });

        const oneMonth = sortedData[0];
        const threeMonths = sortedData.slice(0, 3);
        const sixMonths = sortedData.slice(0, 6);
        const twelveMonths = sortedData.slice(0, 12);

        setSummaries({
          oneMonth: {
            prediction: oneMonth.prediction,
            start: oneMonth,
            end: oneMonth
          },
          threeMonths: {
            prediction: threeMonths.reduce((sum, item) => sum + item.prediction, 0),
            start: threeMonths[0],
            end: threeMonths[2]
          },
          sixMonths: {
            prediction: sixMonths.reduce((sum, item) => sum + item.prediction, 0),
            start: sixMonths[0],
            end: sixMonths[5]
          },
          twelveMonths: {
            prediction: twelveMonths.reduce((sum, item) => sum + item.prediction, 0),
            start: twelveMonths[0],
            end: twelveMonths[11]
          }
        });
        setError(null);
      } catch (error) {
        setError('Failed to fetch prediction data.');
      }
    };

    fetchPredictions();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // ปรับการแสดงผลปีให้เหลือแค่ 2 หลัก
  const formatSubtitle = (start, end) => {
    if (!start || !end) return '';
    if (start.month_predict === end.month_predict && start.year_predict === end.year_predict) {
      return `${start.month_predict} ${start.year_predict.toString().slice(-2)}`;
    }
    return `${start.month_predict} ${start.year_predict.toString().slice(-2)} - ${end.month_predict} ${end.year_predict.toString().slice(-2)}`;
  };

  const formatNumber = (number) => {
    if (number === null || number === undefined || isNaN(number)) {
      return 'N/A';
    }
    return Math.round(number).toLocaleString(); // แปลงเป็นจำนวนเต็ม
  };

  return (
    <div>
      <h5 style={{ textAlign: 'center', marginBottom: '50px' ,fontWeight: 'bold'}}>ค่าพยากรณ์ปริมาณการใช้ไฟฟ้ารวม</h5>
      
      <div className="box-container">
        <div className="summary-box box-bg-blue">
          <div className="time-label time-label-blue">1 เดือน</div>
          <div className="box-subtitle box-subtitle-blue">{formatSubtitle(summaries.oneMonth.start, summaries.oneMonth.end)}</div>
          <p className="box-value">{formatNumber(summaries.oneMonth.prediction)}</p>
        </div>
        <div className="summary-box box-bg-red">
          <div className="time-label time-label-red">3 เดือน</div>
          <div className="box-subtitle box-subtitle-red">{formatSubtitle(summaries.threeMonths.start, summaries.threeMonths.end)}</div>
          <p className="box-value">{formatNumber(summaries.threeMonths.prediction)}</p>
        </div>
        <div className="summary-box box-bg-green">
          <div className="time-label time-label-green">6 เดือน</div>
          <div className="box-subtitle box-subtitle-green">{formatSubtitle(summaries.sixMonths.start, summaries.sixMonths.end)}</div>
          <p className="box-value">{formatNumber(summaries.sixMonths.prediction)}</p>
        </div>
        <div className="summary-box box-bg-orange">
          <div className="time-label time-label-orange">12 เดือน</div>
          <div className="box-subtitle box-subtitle-orange">{formatSubtitle(summaries.twelveMonths.start, summaries.twelveMonths.end)}</div>
          <p className="box-value">{formatNumber(summaries.twelveMonths.prediction)}</p>
        </div>
      </div>
    </div>
  );
  
};

export default PredictionSummaryBoxes;
