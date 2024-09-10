import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Form,
  Row, 
  Col,
  Badge,
} from "react-bootstrap";
import PredictionSummaryBoxes from "./PredictionSummaryBoxes";
import DrillDownChart from "./DrillDownChart";
import ComparisonChart from "./ComparisonChart";
import DrillDownIdBuilding from "./DrillDownIdBuilding";
import "./Table.css";

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

const ForecastComponentEmp = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  return (
    <Container>
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
      <div className="hhh">
        <PredictionSummaryBoxes />
        <div className="box-component">
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
    </Container>
  );
};

export default ForecastComponentEmp;
