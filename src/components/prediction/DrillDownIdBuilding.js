import React, { useState, useEffect } from "react";
import axios from "axios";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import Drilldown from "highcharts/modules/drilldown";
import BASE_URL from "../../api";
// Initialize Drilldown module
Drilldown(Highcharts);

const DrillDownIdBuilding = () => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await axios.get(`${BASE_URL}/group-prediction-sum`);
        const data = response.data;

        // Step 1: Prepare the data for the first level (sum of predictions by group_name)
        const seriesData = data.map(item => ({
          name: item.group_name,  // แสดงชื่อของกลุ่มแทน idGroup
          y: item.prediction_sum,
          drilldown: `group-${item.group_name}`
        }));

        // Step 2: Prepare the drilldown data for each building in the group
        const drilldownSeries = data.map(item => ({
          id: `group-${item.group_name}`,
          data: item.buildings.map(building => [building.name, building.prediction])
        }));

        // Set chart options
        setChartOptions({
          chart: {
            type: "column"
          },
          title: {
            text: "การพยากรณ์การใช้ไฟฟ้า แยกตามกลุ่มอาคาร"
          },
          xAxis: {
            type: "category"
          },
          yAxis: {
            title: {
              text: "ค่าการพยากรณ์ไฟฟ้า (unit)"
            },
            labels: {
              formatter: function () {
                return this.value.toLocaleString(); 
              }
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: false // ปิดการแสดงตัวเลขบนแท่ง
              }
            }
          },
          tooltip: {
            formatter: function () {
              return `<b>${this.point.name}</b><br/>${this.point.y.toLocaleString()} unit`;
            }
          },
          series: [
            {
              name: "กลุ่มอาคาร",
              colorByPoint: true,
              data: seriesData
            }
          ],
          drilldown: {
            breadcrumbs: {
              position: {
                align: 'right', // จัดให้อยู่ทางด้านขวา
                x: -10 // เลื่อนตำแหน่งออกจากขอบขวาเล็กน้อย
              },
              floating: true // เปิดใช้งาน floating สำหรับ breadcrumb
            },
            series: drilldownSeries
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

export default DrillDownIdBuilding;
