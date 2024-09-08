import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useTable, useSortBy, usePagination } from "react-table";
import { Container, Form, Button, Table, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { InfinitySpin } from "react-loader-spinner";
import "./Table.css";
import { ResponsiveBar } from "@nivo/bar";
import BASE_URL from "../../api";
const MonthlySumsTable = ({ data }) => {
  const monthlySums = useMemo(() => {
    const sums = {};
    data.forEach(item => {
      const month = item.modelName.replace('T', '');
      if (!sums[month]) sums[month] = 0;
      sums[month] += item.prediction;
    });
    return sums;
  }, [data]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>เดือน</th>
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

const ForecastComponent2 = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [modelName, setModelName] = useState("");
  const [currentMonth, setCurrentMonth] = useState(null);

  // Function to fetch and check if predictions exist
  const fetchDataAndCheckPredictions = async (year, month) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/check-predictions?year=${year}&month=${month}`
      );
      if (response.data.length === 0) {
        await handleForecast(); // Forecast if no data found
      } else {
        setData(response.data); // Set data if predictions exist
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchCurrentMonth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/current-month`);
        const { year, month } = response.data;
        setYear(year);
        setMonth(month);
        setCurrentMonth(month);

        // Check if predictions exist
        await fetchDataAndCheckPredictions(year, month);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCurrentMonth();
  }, []);

  const handleForecast = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("${BASE_URL}/predict", {
        year,
        month,
        modelName: "All", // Assuming default model name for automatic prediction
      });

      setData(response.data);
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

  const processedData = useMemo(() => {
    const monthlySums = {};
    
    data.forEach(item => {
      const month = item.modelName.replace('T', '');
      if (!monthlySums[month]) {
        monthlySums[month] = 0;
      }
      monthlySums[month] += item.prediction;
    });

    return Object.entries(monthlySums)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([month, sum]) => ({
        month: `เดือน ${month}`,
        sum: sum,
      }));
  }, [data]);

  return (
    <Container>
      {loading && (
        <div className="d-flex justify-content-center">
          <InfinitySpin width="200" color="#390042" />
        </div>
      )}

      {error && <div className="alert alert-danger">Error: {error}</div>}

      {!loading && data.length > 0 && (
        <div>
          <Table striped bordered hover {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " ▼"
                            : " ▲"
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
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="mt-5">
          <h2>Dashboard</h2>
          <div style={{ height: "400px" }}>
            <ResponsiveBar
              data={processedData}
              keys={["sum"]}
              indexBy="month"
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "เดือน",
                legendPosition: "middle",
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "ค่าพยากรณ์",
                legendPosition: "middle",
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
            />
          </div>
          <MonthlySumsTable data={data} />
        </div>
      )}
    </Container>
  );
};

export default ForecastComponent2;
