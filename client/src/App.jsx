import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import PaymentService from './Paypal/paymentService';
import Success from './Success/Success';
import Failed from './Failed/failed';

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<PaymentService />} /> 
        <Route path="/success" element={<Success />} />
        <Route path="/failed" element={<Failed />} />
      </Routes>
    </Router>
  );
}

export default App;
