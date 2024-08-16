import React, { useState, useMemo } from "react";
import axios from "axios";
import { useTable, useSortBy, usePagination } from "react-table";
import { Container, Form, Button, Table, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { InfinitySpin } from "react-loader-spinner";
import "./Table.css";

const ForecastComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [modelName, setModelName] = useState("");

  const handleForecast = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/predict", {
        year,
        month,
        modelName,
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
        Header: "Unit",
        accessor: "unit",
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
              <Form.Control
                as="select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i + 543}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="monthSelect">
              <Form.Label>เดือน:</Form.Label>
              <Form.Control
                as="select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {[
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
                ].map((monthName, index) => (
                  <option key={index} value={index + 1}>
                    {monthName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="modelNameInput">
              <Form.Label>ชื่อโมเดล:</Form.Label>
              <Form.Control
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="ใส่ชื่อโมเดล เช่น T1, T2, หรือ All"
              />
            </Form.Group>
          </Col>

          <Col xs="auto">
            <Button
              variant="primary"
              onClick={handleForecast}
              disabled={loading}
              className="mt-4"
              style={{backgroundColor:'#390042', border:'#390042'}}
            >
              เริ่มการพยากรณ์
            </Button>
          </Col>
        </Row>
      </Form>

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
    </Container>
  );
};

export default ForecastComponent;
