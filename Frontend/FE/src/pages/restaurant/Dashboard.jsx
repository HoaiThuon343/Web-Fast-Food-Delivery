import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // ... (Giữ nguyên code nội dung bên trong) ...
  const stats = [
    { title: 'Tổng đơn hàng', value: 120 },
    { title: 'Người dùng', value: 45 },
    { title: 'Doanh thu', value: '12.5M' },
    { title: 'Tổng món bán được', value: 350 },
  ];

  const data = [
    { name: 'T2', uv: 4000 }, { name: 'T3', uv: 3000 }, { name: 'T4', uv: 2000 },
    { name: 'T5', uv: 2780 }, { name: 'T6', uv: 1890 }, { name: 'T7', uv: 2390 }, { name: 'CN', uv: 3490 },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
       {/* ... Code giao diện giữ nguyên ... */}
       <h2>Dashboard Thống Kê</h2>
       {/* Ví dụ nội dung */}
    </div>
  );
};

export default Dashboard;