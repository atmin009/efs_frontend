import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BASE_URL from '../../api';
const BoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 20px;
  gap: 20px; /* เพิ่มช่องว่างระหว่าง Box */
`;

const SummaryBox = styled.div`
  background-color: ${(props) => props.bgColor || '#f8f9fa'};
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 300px; /* เพิ่มขนาดความกว้าง */
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;


const BoxTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #343a40;
`;

const BoxValue = styled.p`
  font-size: 28px;
  font-weight: bold;
  color: #007bff;
  margin: 0;

  &::after {
    content: ' unit'; /* เพิ่มคำว่า unit หลังค่า */
    font-size: 16px; /* ขนาดฟอนต์สำหรับ unit */
    color: #343a40; /* สีฟอนต์สำหรับ unit */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 18px;
`;

const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return 'N/A';
  }
  return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const PredictionSummaryBoxes = () => {
  const [summaries, setSummaries] = useState({
    oneMonth: 0,
    threeMonths: 0,
    sixMonths: 0,
    twelveMonths: 0
  });
  const [error, setError] = useState(null);

  const thaiMonthsOrder = {
    'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
    'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/prediction_sum_by_month`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        console.log('API Response:', data);

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid data format received from API');
        }

        const sortedData = data.sort((a, b) => {
          if (a.year_predict !== b.year_predict) {
            return a.year_predict - b.year_predict;
          }
          return thaiMonthsOrder[a.month_predict] - thaiMonthsOrder[b.month_predict];
        });

        console.log('Sorted Data:');
        sortedData.forEach(item => {
          console.log(`Year: ${item.year_predict}, Month: ${item.month_predict}, Prediction: ${item.prediction}`);
        });

        const oneMonth = sortedData[0]?.prediction || 0;
        const threeMonths = sortedData.slice(0, 3).reduce((sum, item) => sum + item.prediction, 0);
        const sixMonths = sortedData.slice(0, 6).reduce((sum, item) => sum + item.prediction, 0);
        const twelveMonths = sortedData.slice(0, 12).reduce((sum, item) => sum + item.prediction, 0);

        console.log('Calculated values:', { oneMonth, threeMonths, sixMonths, twelveMonths });

        setSummaries({
          oneMonth,
          threeMonths,
          sixMonths,
          twelveMonths
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching prediction data:', error);
        setError('Failed to fetch prediction data. Please try again later.');
        setSummaries({
          oneMonth: 0,
          threeMonths: 0,
          sixMonths: 0,
          twelveMonths: 0
        });
      }
    };

    fetchPredictions();
  }, []);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <BoxContainer>
      <SummaryBox bgColor="#e3f2fd">
        <BoxTitle>ค่าการพยากรณ์ราย เดือน</BoxTitle>
        <BoxValue>{formatNumber(summaries.oneMonth)}</BoxValue>
      </SummaryBox>
      <SummaryBox bgColor="#ffebee">
        <BoxTitle>ค่าการพยากรณ์ราย 3 เดือน</BoxTitle>
        <BoxValue>{formatNumber(summaries.threeMonths)}</BoxValue>
      </SummaryBox>
      <SummaryBox bgColor="#e8f5e9">
        <BoxTitle>ค่าการพยากรณ์ราย 6 เดือน</BoxTitle>
        <BoxValue>{formatNumber(summaries.sixMonths)}</BoxValue>
      </SummaryBox>
      <SummaryBox bgColor="#fff3e0">
        <BoxTitle>ค่าการพยากรณ์ราย 12 เดือน</BoxTitle>
        <BoxValue>{formatNumber(summaries.twelveMonths)}</BoxValue>
      </SummaryBox>
    </BoxContainer>
  );
};

export default PredictionSummaryBoxes;
