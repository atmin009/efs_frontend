import React, { useEffect, useState, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Drilldown from 'highcharts/modules/drilldown';
import BASE_URL from '../../api';
Drilldown(Highcharts);

Highcharts.setOptions({
  accessibility: {
    enabled: false
  },
  chart: {
    style: {
      fontFamily: '"Anuphan", sans-serif'
    }
  }
});

const Thai_months_to_number = {
  'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4,
  'พ.ค.': 5, 'มิ.ย.': 6, 'ก.ค.': 7, 'ส.ค.': 8,
  'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12
};

const formatNumber = (number) => {
  return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const DrillDownChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const convertBEtoAD = (beYear) => beYear - 543;

  const abbreviateYear = (year) => {
    if (year === undefined || year === null) return '';
    return year.toString().slice(-2);
  };

  const fetchBuildingData = useCallback((beYear, month) => {
    const adYear = convertBEtoAD(parseInt(beYear, 10));
    const monthNumber = Thai_months_to_number[month];
    console.log(`Fetching data for year: ${adYear} (BE: ${beYear}), month: ${monthNumber}`);
    return fetch(`${BASE_URL}/building_predictions/${adYear}/${monthNumber}`)
      .then(res => {
        if (res.status === 404) {
          return { noData: true };
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .catch(error => {
        console.error('Error fetching building data:', error);
        throw error;
      });
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/prediction_sum_by_month`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(predictionData => {
        setData(predictionData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const options = {
    chart: {
      type: 'column',
      events: {
        drilldown: function (e) {
          if (!e.seriesOptions) {
            const chart = this;
            chart.showLoading('Fetching data...');
            const [month, beYear] = e.point.name.split(' ');
            fetchBuildingData(beYear, month)
              .then(buildingData => {
                chart.hideLoading();
                if (buildingData.noData) {
                  chart.showLoading('No data available for this month');
                  setTimeout(() => chart.hideLoading(), 2000);
                } else {
                  const sortedData = buildingData
                    .sort((a, b) => a.building.localeCompare(b.building));
                  
                  chart.addSeriesAsDrilldown(e.point, {
                    name: 'อาคาร',
                    data: sortedData.map(item => ({
                      name: item.building,
                      y: item.prediction
                    }))
                  });

                  chart.xAxis[0].setCategories(sortedData.map(item => item.building));
                }
              })
              .catch(error => {
                chart.hideLoading();
                console.error('Error in drill down:', error);
                chart.showLoading(`Error: ${error.message}`);
                setTimeout(() => chart.hideLoading(), 3000);
              });
          }
        },
        drillup: function () {
          this.xAxis[0].setCategories(data.map(item => `${item.month_predict} ${item.year_predict}`));
        }
      }
    },
    title: {
      text: 'ค่าการพยากรณ์การใช้ไฟฟ้าแยกเป็นรายเดือนและรายอาคาร'
    },
    xAxis: {
      type: 'category',
      labels: {
        formatter: function() {
          if (this.value === undefined || this.value === null) return '';
          if (typeof this.value === 'string') {
            const parts = this.value.split(' ');
            if (parts.length < 2) return this.value;
            const [month, year] = parts;
            return `${month} ${abbreviateYear(year)}`;  // Removed the single quote
          }
          return this.value.toString();
        },
        style: {
          cursor: 'pointer',
          color: '#000000',
          textDecoration: 'none' // Ensure no underline on text
        }
      }
    },
    yAxis: {
      title: {
        text: 'ค่าการพยากรณ์ไฟฟ้า (Unit)'
      },
      labels: {
        formatter: function() {
          return formatNumber(this.value);
        }
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b><br/>${this.series.name}: <b>${formatNumber(this.y)}</b>`;
      }
    },
    series: [{
      name: 'เดือนที่พยากรณ์',
      data: data.map(item => ({
        name: `${item.month_predict} ${item.year_predict}`,
        y: item.prediction,
        drilldown: true
      })),
      colorByPoint: true
    }],
    colors: ['#FF5733', '#FFBD33', '#75FF33', '#33FF57', '#33FFBD', '#33D4FF', '#3375FF', '#5733FF', '#BD33FF', '#FF33D4'],
    drilldown: {
      breadcrumbs: {
        position: {
          align: 'right'
        }
      }
    },
    plotOptions: {
      series: {
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        }
      }
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default DrillDownChart;
