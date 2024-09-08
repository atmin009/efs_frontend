import React, { useState, useEffect } from "react";
import "./QuarterlySummary.css";
import BASE_URL from "../../api";
const QuarterlySummary = () => {
  const [data, setData] = useState([]);
  const [latestYear, setLatestYear] = useState(null);
  const [quarterlySummary, setQuarterlySummary] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/unit/`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        findLatestYearAndCalculateSummary(data);
      });
  }, []);

  const findLatestYearAndCalculateSummary = (data) => {
    let latestYear = Math.max(...data.map((item) => item.years));
    setLatestYear(latestYear);

    const summary = {};
    const completedQuarters = new Set();

    data
      .filter((item) => item.years === latestYear)
      .forEach((item) => {
        const quarter = Math.ceil(item.month / 3);
        const quarterKey = `ไตรมาสที่ ${quarter}`;

        completedQuarters.add(quarter);

        if (!summary[quarterKey]) {
          summary[quarterKey] = 0;
        }
        summary[quarterKey] += item.amount;
      });

    // Add incomplete quarters
    for (let i = 1; i <= 4; i++) {
      const quarterKey = `ไตรมาสที่ ${i}`;
      if (!completedQuarters.has(i)) {
        summary[quarterKey] = "ยังไม่ถึงไตรมาส";
      }
    }

    setQuarterlySummary(summary);
  };

  const colors = ["#8ED6FF", "#FF8E8E", "#8EFFC5", "#FFD18E"];

  return (
    <div className="q-margin">
      <div>
        <h2
          style={{ fontFamily: "Anuphan", color: "#000", textAlign: "center" }}
        >
          สรุปจำนวนหน่วยการใช้ไฟฟ้า
          <span style={{ color: "black" }}> ปี {latestYear + 543}</span>
        </h2>
      </div>
      <div>
        <h4 style={{ fontFamily: "Anuphan", color: "#7A009F", textAlign: "center" }}>แสดงสรุปรายไตรมาส</h4>
      </div>
      <div className="container1">
        {Object.entries(quarterlySummary || {}).map(([key, amount], index) => (
          <div
            key={key}
            className={`quarter-box ${
              amount === "ยังไม่ถึงไตรมาส" ? "gray" : ""
            }`}
            style={{
              background:
                amount !== "ยังไม่ถึงไตรมาส"
                  ? colors[index % colors.length]
                  : undefined,
            }}
            title={amount !== "ยังไม่ถึงไตรมาส" ? `ยอดรวมของ ${key}` : ""}
          >
            <div className="quarter-key">{`${key}`}</div>
            {amount === "ยังไม่ถึงไตรมาส" ? (
              <div className="quarter-amount gray">{amount}</div>
            ) : (
              <div className="quarter-amount">
                จำนวนรวม: {amount.toLocaleString()} unit
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuarterlySummary;
