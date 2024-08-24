import React, { useState, useEffect } from "react";
import axios from "axios";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const chartAandP = () => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/forecast-data");
        const data = response.data;

        // Extract the formatted month names (Thai month + year)
        const categories = data.map(item => item.month);
        const forecastData = data.map(item => item.forecast);
        const actualData = data.map(item => item.actual);

        setChartOptions({
          title: {
            text: 'ปริมาณการใช้งานไฟฟ้า (รายเดือน)'
          },
          xAxis: {
            categories: categories
          },
          yAxis: {
            title: {
              text: 'ปริมาณการใช้งาน (Unit)'
            }
          },
          series: [
            {
              name: 'ปริมาณการใช้ไฟฟ้าย้อนหลัง',
              data: actualData,
              type: 'line',
              color: 'blue'
            },
            {
              name: 'ปริมาณการใช้ไฟฟ้าในอนาคต',
              data: forecastData,
              type: 'line',
              dashStyle: 'ShortDash',
              color: 'red'
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
};

export default chartAandP;
