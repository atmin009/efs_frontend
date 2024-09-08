import React from 'react';
import './MiddleSite.css';

const MiddleSite = () => {
  return (
    <div className="middle-site-container">
      <Card text="เอกสารเผยแพร่" />
      <Card text="เกี่ยวกับระบบ" />
      <Card text="คู่มือการใช้งาน" />
    </div>
  );
};

const Card = ({ text }) => {
  return (
    <div className="card">
      {text}
    </div>
  );
};

export default MiddleSite;
