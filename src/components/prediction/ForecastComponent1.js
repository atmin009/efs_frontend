import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useTable, useSortBy, usePagination } from "react-table";
import {
  Container,
  Form,
  Button,
  Row, 
  Col,
  Badge,
  Modal
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { RotateLoader } from "react-spinners"; // Import RotateLoader
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highchartsDrilldown from "highcharts/modules/drilldown";
import ChartAandP from "./chartAandP";
import DrillDownChart from "./DrillDownChart";
import PredictionSummaryBoxes from "./PredictionSummaryBoxes";
import "./Table.css";
import ComparisonChart from "./ComparisonChart";
import DrillDownIdBuilding from "./DrillDownIdBuilding";
import BASE_URL from "../../api";
highchartsDrilldown(Highcharts);

const ThaiMonthBadge = ({ month }) => {
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  return (
    <Badge
      pill
      variant="light"
      style={{
        backgroundColor: "#f3e5f5",
        padding: "10px 20px",
        fontSize: "16px",
      }}
    >
      {thaiMonths[month - 1]}
    </Badge>
  );
};

const YearBadge = ({ year }) => {
  return (
    <Badge
      pill
      variant="light"
      style={{
        backgroundColor: "#f3e5f5",
        padding: "10px 20px",
        fontSize: "16px",
      }}
    >
      {year + 543}
    </Badge>
  );
};

const ForecastComponent1 = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [showForecastButton, setShowForecastButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [chartOptions, setChartOptions] = useState({});
  const [totalForecast, setTotalForecast] = useState(0);

  useEffect(() => {
    const fetchCurrentMonth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/current-month`);
        const { year, month } = response.data;
        setYear(year);
        setMonth(month);
        setCurrentMonth(month);

        const checkResponse = await axios.get(
          `${BASE_URL}/check-predictions?year=${year}&month=${month}`
        );

        if (checkResponse.data.length > 0) {
          setData(checkResponse.data);
          setShowForecastButton(false);
        } else {
          setShowForecastButton(true);
          setShowModal(true); // แสดง Modal เมื่อเงื่อนไขตรงกับ showForecastButton
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCurrentMonth();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      // Calculate total forecast
      const total = data.reduce((sum, item) => sum + item.prediction, 0);
      setTotalForecast(total);

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
          drilldown: `month${month}`,
        });

        const buildingData = data
          .filter((item) => item.month_predict === parseInt(month))
          .map((item) => [item.building, item.prediction]);

        drilldownSeries.push({
          name: `เดือน ${month}`,
          id: `month${month}`,
          data: buildingData,
        });
      });

      setChartOptions({
        chart: {
          type: "column",
        },
        title: {
          text: "ผลการพยากรณ์การใช้ไฟฟ้า",
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          title: {
            text: "ค่าพยากรณ์ (หน่วย)",
          },
        },
        series: [
          {
            name: "เดือน",
            colorByPoint: true,
            data: seriesData,
          },
        ],
        drilldown: {
          series: drilldownSeries,
        },
      });
    }
  }, [data]);

  const handleForecast = async () => {
    setLoading(true);
    setError(null);
    setShowModal(false); // Close the modal immediately after starting the forecast
  
    try {
      const response = await axios.post(`${BASE_URL}/predict-or-fetch`, {
        year,
        month,
        modelName: "All",
      });
  
      const { predictions, log } = response.data;
      setData(predictions);
      setShowForecastButton(false);
  
      // Wait 1.5 seconds, then refresh the page
      setTimeout(() => {
        setLoading(false); // Stop showing the RotateLoader
        toast.success(log); // Display a toast notification with the log message from the API
        window.location.reload(); // Reload the page after showing the toast notification
      }, 1500); // Wait 1.5 seconds to let the RotateLoader spin before showing the toast
    } catch (err) {
      console.error("Error during forecast:", err);
      setError(err.message);
      setLoading(false); // Stop showing the RotateLoader if there's an error
    }
  };
  
  
  const columns = useMemo(
    () => [
      {
        Header: "Building",
        accessor: "building",
      },
      {
        Header: "Prediction",
        accessor: "prediction",
      },
      {
        Header: "Model Name",
        accessor: "modelName",
      },
      {
        Header: "Month Current",
        accessor: "month_current",
      },
      {
        Header: "Year Current",
        accessor: "year_current",
      },
      {
        Header: "Month Predict",
        accessor: "month_predict",
      },
      {
        Header: "Year Predict",
        accessor: "year_predict",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <Container>
      {/* Overlay แสดง RotateLoader */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <RotateLoader color="#FFFFFF" />
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>เริ่มการพยากรณ์</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-warning">กรุณากดเพื่อเริ่มการพยากรณ์</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleForecast}
            style={{ backgroundColor: "#390042", border: "#390042" }}
          >
            เริ่มการพยากรณ์
          </Button>
        </Modal.Footer>
      </Modal>

      <Form
        className="mb-4"
        style={{
          fontFamily: "Anuphan",
        }}
      >
        <Row
          className="align-items-center justify-content-end"
          style={{ gap: "5px" }}
        >
          <Col xs="auto" style={{ paddingRight: "0px" }}>
            <Form.Label>เดือนของการพยากรณ์</Form.Label>
          </Col>
          <Col xs="auto" style={{ paddingRight: "0px" }}>
            <ThaiMonthBadge month={month} />
          </Col>
          <Col xs="auto" style={{ paddingRight: "0px" }}>
            <Form.Label>พ.ศ.</Form.Label>
          </Col>
          <Col xs="auto">
            <YearBadge year={year} />
          </Col>
        </Row>
      </Form>
      {data.length > 0 && (
        <div className="hhh">
          <PredictionSummaryBoxes />
          <div className="box-component">
            <ChartAandP />
          </div>
          <div className="box-component">
            <DrillDownChart />
          </div>
          <div className="box-component">
            <ComparisonChart />
          </div>
          <div className="box-component">
            <DrillDownIdBuilding />
          </div>
        </div>
      )}
      <ToastContainer /> {/* Container สำหรับการแสดงการแจ้งเตือน */}
    </Container>
  );
};

export default ForecastComponent1;
