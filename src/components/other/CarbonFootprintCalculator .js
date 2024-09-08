import React, { useEffect, useState } from "react";
import "./CarbonFootprintCalculator.css";
import BASE_URL from "../../api";
// ฟังก์ชันแปลงเดือนเป็นภาษาไทย
const getThaiMonth = (month) => {
  const months = [
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
  return months[month - 1];
};

const CarbonFootprintCalculator = () => {
  const [data, setData] = useState([]);
  const [footprint, setFootprint] = useState({});
  const [latestYear, setLatestYear] = useState(null);

  const TREE_CO2_ABSORPTION = 10; // kg CO2e per tree per year

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/unit/`);
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Determine the latest year in the data
    if (data.length) {
      const years = data.map((item) => item.years);
      const maxYear = Math.max(...years);
      setLatestYear(maxYear);
    }
  }, [data]);

  useEffect(() => {
    // Aggregate data and calculate carbon footprint
    const calculateFootprint = () => {
      const monthlyData = {};

      data.forEach((item) => {
        const { years, month, amount } = item;
        if (years === latestYear) {
          // Filter data for the latest year
          const key = `${month}`;
          if (!monthlyData[key]) {
            monthlyData[key] = { total: 0, footprint: 0 };
          }
          monthlyData[key].total += amount;
          monthlyData[key].footprint = monthlyData[key].total * 0.5; // 0.5 kg CO2e/kWh
        }
      });

      setFootprint(monthlyData);
    };

    if (data.length && latestYear !== null) {
      calculateFootprint();
    }
  }, [data, latestYear]);

  return (
    <div >
      <div className="my-component">
        <h1 style={{ fontFamily: "Anuphan", color: "#ff6347" }}>
          Carbon Footprint <span style={{ color: "black" }}>และ</span>{" "}
          <span style={{ color: "#228B22" }}>การปลูกต้นไม้ทดแทน</span>
          <span style={{ color: "black" }}> ปี {latestYear + 543}</span>{" "}
        </h1>
        <br />
        <div className="cloud-container content">
          {Object.keys(footprint).map((month) => (
            <div className="cloud-wrapper" key={month}>
              <div className="month-number">{month}</div>
              <div className="cloud">
                <div>{getThaiMonth(month)}</div>

                <div className="icon-container">
                  <div className="unit-text">
                    <img
                      src="lightning.png"
                      style={{ width: "25px" }}
                      alt="Plant"
                      className="icon"
                      title="จำนวน unit ที่ใช้"
                    />
                    {footprint[month].total.toLocaleString()}Unit{" "}
                  </div>
                </div>

                <div className="icon-container">
                  <div className="trees-text">
                    <img
                      src="plant.png"
                      style={{ width: "25px" }}
                      alt="Plant"
                      className="icon"
                      title="ต้องปลูกต้นไม้"
                    />
                    {Math.ceil(
                      footprint[month].footprint / TREE_CO2_ABSORPTION
                    ).toLocaleString()}{" "}
                    ต้น
                  </div>
                </div>
                <div className="icon-container">
                  <div className="highlight">
                    <img
                      src="carbon-footprint.png"
                      style={{ width: "25px" }}
                      alt="Carbon Footprint"
                      className="icon"
                      title="คาร์บอนฟุตพริ้นท์"
                    />
                    {Math.round(footprint[month].footprint).toLocaleString()} kg
                    CO2e
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintCalculator;
