import React, { useState, useEffect } from "react";
import axios from "axios";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import BASE_URL from "../../api";
const ComparisonChart = () => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/yearly-comparison`);
        const data = response.data;

        // ปรับให้แสดงปี พ.ศ. แค่ 2 หลักสุดท้าย
        const months = data.map(item => {
          const year = item.month.slice(-4);  // ดึงปี 4 หลักจากข้อมูล
          const shortYear = year.slice(-2);  // ตัดให้เหลือ 2 หลักสุดท้าย
          return item.month.replace(year, shortYear);
        });
        
        const forecastData = data.map(item => item.forecast);
        const actualData = data.map(item => item.actual);
        const actualYearMonths = data.map(item => {
          const year = item.actual_year_month.slice(-4);  // ดึงปี 4 หลักจากข้อมูล
          const shortYear = year.slice(-2);  // ตัดให้เหลือ 2 หลักสุดท้าย
          return item.actual_year_month.replace(year, shortYear);
        });  // ข้อมูล actual_year_month

        setChartOptions({
          title: {
            text: 'เปรียบเทียบปริมาณการใช้ไฟฟ้าในอดีตและอนาคต',
            style: {
              fontSize: '18px',
              fontWeight: 'bold',
            }
          },
          xAxis: {
            categories: months,
            labels: {
              style: {
                fontSize: '14px',
              }
            }
          },
          yAxis: {
            title: {
              text: 'ปริมาณการใช้งาน (Unit)',  // เอาคำว่า (หน่วย) ออก
              style: {
                fontSize: '14px',
              }
            },
            labels: {
              formatter: function () {
                return this.value.toLocaleString();  // เอาคำว่า (หน่วย) ออก
              },
              style: {
                fontSize: '14px',
              }
            }
          },
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            itemStyle: {
              fontSize: '14px',
            }
          },
          tooltip: {
            formatter: function () {
              // เพิ่ม actual_year_month เข้าไปใน tooltip ของปริมาณการใช้ไฟฟ้าย้อนหลัง
              if (this.series.name === 'ปริมาณการใช้ไฟฟ้าย้อนหลัง') {
                return `<b>${this.series.name}</b><br/>เดือน: ${actualYearMonths[this.point.index]}<br/>ปริมาณการใช้: ${this.y.toLocaleString()} unit`;
              } else {
                return `<b>${this.series.name}</b><br/>เดือน: ${this.x}<br/>ปริมาณการใช้: ${this.y.toLocaleString()} unit`;
              }
            }
          },
          series: [
            {
              name: 'ปริมาณการใช้ไฟฟ้าย้อนหลัง',
              data: actualData,
              type: 'line',
              color: 'blue',
              lineWidth: 2,
              marker: {
                enabled: true,
                fillColor: 'blue',
                lineWidth: 2,
                lineColor: 'blue'
              }
            },
            {
              name: 'ปริมาณการใช้ไฟฟ้าในอนาคต',
              data: forecastData,
              type: 'line',
              color: 'red',
              dashStyle: 'ShortDash',
              lineWidth: 2,
              marker: {
                enabled: true,
                fillColor: 'red',
                lineWidth: 2,
                lineColor: 'red'
              }
            }
          ],
          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
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

export default ComparisonChart;
