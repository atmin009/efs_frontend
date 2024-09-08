import React, { useState } from "react";
import axios from "axios";
import { Button, Container } from "react-bootstrap";
import { RotateLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api";
const Clickpredict = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleStartPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      // Ensure the data sent is correct
      const response = await axios.post(`${BASE_URL}/predict-or-fetch`, {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        modelName: "All",  // Ensure this matches the expected structure on the backend
      });

      console.log("Prediction completed:", response.data);

      setLoading(false);
      navigate("/forecastcomponent1");  // Navigate back after completion
    } catch (err) {
      console.error("Error during prediction:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading ? (
        <div className="d-flex justify-content-center">
          <RotateLoader color="#390042" />
        </div>
      ) : (
        <>
          <Button
            variant="primary"
            onClick={handleStartPrediction}
            style={{ backgroundColor: "#390042", border: "#390042" }}
          >
            เริ่มต้นการพยากรณ์
          </Button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </>
      )}
    </Container>
  );
};

export default Clickpredict;
