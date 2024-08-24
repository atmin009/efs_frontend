import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useTable, useSortBy, usePagination } from "react-table";
import { Container, Form, Button, Table, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { InfinitySpin } from "react-loader-spinner";
import "./Table.css";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import highchartsDrilldown from 'highcharts/modules/drilldown';
import ChartAandP from "./chartAandP";

highchartsDrilldown(Highcharts);
const getThaiMonthName = (monthNumber) => {
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", 
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", 
    "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  return thaiMonths[monthNumber - 1];  // Adjust index for 0-based array
};

const MonthlySumsTable = ({ data }) => {
  const monthlySums = useMemo(() => {
    const sums = {};
    data.forEach((item) => {
      const month = item.month_predict;
      if (!sums[month]) sums[month] = 0;
      sums[month] += item.prediction;
    });
    return sums;
  }, [data]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>เดือนที่พยากรณ์</th>
          <th>ผลรวมค่าพยากรณ์</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(monthlySums)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([month, sum]) => (
            <tr key={month}>
              <td>เดือน {month}</td>
              <td>{sum.toFixed(2)}</td>
            </tr>
          ))}
      </tbody>
    </Table>
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
  const [chartOptions, setChartOptions] = useState({});
  const [totalForecast, setTotalForecast] = useState(0);

  useEffect(() => {
    const fetchCurrentMonth = async () => {
      try {
        const response = await axios.get("http://localhost:8000/current-month");
        const { year, month } = response.data;
        setYear(year);
        setMonth(month);
        setCurrentMonth(month);

        const checkResponse = await axios.get(`http://localhost:8000/check-predictions?year=${year}&month=${month}`);

        if (checkResponse.data.length > 0) {
          setData(checkResponse.data);
          setShowForecastButton(false);
        } else {
          setShowForecastButton(true);
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

  const handleForecast = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/predict-or-fetch", {
        year,
        month,
        modelName: "All",
      });

      setData(response.data);
      setShowForecastButton(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      <Form
        className="mb-4"
        style={{
          fontFamily: "Anuphan",
        }}
      >
        <Row className="align-items-center">
          <Col>
            <Form.Group controlId="yearSelect">
              <Form.Label>ปี:</Form.Label>
              <Form.Control as="select" value={year} disabled>
                <option value={year}>{year + 543}</option>
              </Form.Control>
            </Form.Group>
          </Col>


<ChartAandP/>
          <Col>
            <Form.Group controlId="monthSelect">
              <Form.Label>ข้อมูลปัจจุบันเดือน:</Form.Label>
              <Form.Control as="select" value={month} disabled>
                <option value={month}>
                  {currentMonth
                    ? `ข้อมูลปัจจุบันเดือน ${currentMonth}`
                    : "กำลังโหลด..."}
                </option>
              </Form.Control>
            </Form.Group>
          </Col>

          {showForecastButton && (
            <Col xs="auto">
              <Button
                variant="primary"
                onClick={handleForecast}
                disabled={loading}
                className="mt-4"
                style={{ backgroundColor: "#390042", border: "#390042" }}
              >
                เริ่มการพยากรณ์
              </Button>
              <p className="mt-2 text-warning">กรุณากดเพื่อเริ่มการพยากรณ์</p>
            </Col>
          )}
        </Row>
      </Form>

      <Row className="mb-4">
        <Col xs={12} md={6}>
          <div className="blue-box info-box">
            <div className="info-box-title">หน่วยการใช้ไฟฟ้ารวมเดือนล่าสุด</div>
            <div>จำนวน ..... <span className="unit">Unit</span></div>
          </div>
        </Col>

        <Col xs={12} md={6}>
          <div className="orange-box info-box">
<div className="info-box-title">
  ค่าพยากรณ์ไฟฟ้าประจำเดือน {currentMonth ? `เดือน ${getThaiMonthName(currentMonth)}` : '...'}
</div>            <div>จำนวน {totalForecast.toLocaleString('th-TH', { maximumFractionDigits: 2 })} <span className="unit">Unit</span></div>
          </div>
        </Col>
      </Row>

      {loading && (
        <div className="d-flex justify-content-center">
          <InfinitySpin width="200" color="#390042" />
        </div>
      )}

      {error && <div className="alert alert-danger">Error: {error}</div>}

      {!loading && data.length > 0 && (
        <div>
          <div className="mt-5">
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
            />
          </div>

          <Table striped bordered hover {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td key={cell.column.id} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <ReactPaginate
            previousLabel={"ก่อนหน้า"}
            nextLabel={"ถัดไป"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={({ selected }) => gotoPage(selected)}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />

          <MonthlySumsTable data={data} />
        </div>
      )}
    </Container>
  );
};

export default ForecastComponent1;
