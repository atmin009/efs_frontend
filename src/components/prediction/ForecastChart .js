import React, { useEffect, useState } from "react";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import highchartsDrilldown from 'highcharts/modules/drilldown';

highchartsDrilldown(Highcharts);

const ForecastChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (data.length > 0) {
      const seriesData = [];
      const drilldownSeries = [];

      const monthlySums = data.reduce((acc, item) => {
        const month = item.month_predict;
        if (!acc[month]) acc[month] = 0;
        acc[month] += item.prediction;
        return acc;
      }, {});

      Object.entries(monthlySums).forEach(([month, sum]) => {
        seriesData.push({
          name: `เดือน ${month}`,
          y: sum,
          drilldown: `month${month}`
        });

        const buildingData = data
          .filter(item => item.month_predict === parseInt(month))
          .map(item => [item.building, item.prediction]);

        drilldownSeries.push({
          name: `เดือน ${month}`,
          id: `month${month}`,
          data: buildingData
        });
      });

      setChartOptions({
        chart: {
          type: 'column'
        },
        title: {
          text: 'ผลการพยากรณ์การใช้ไฟฟ้า'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: 'ค่าพยากรณ์ (หน่วย)'
          }
        },
        series: [{
          name: 'เดือน',
          colorByPoint: true,
          data: seriesData
        }],
        drilldown: {
          series: drilldownSeries
        }
      });
    }
  }, [data]);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
};

export default ForecastChart;
