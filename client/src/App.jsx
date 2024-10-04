import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Switch replaced with Routes
import PaymentService from './Paypal/paymentService';
import Success from './Success/Success';
import Failed from './Failed/failed';

function App() {
  return (
    <Router>
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<PaymentService />} /> {/* Use 'element' to render a component */}
        <Route path="/success" element={<Success />} />
        <Route path="/failed" element={<Failed />} />
      </Routes>
    </Router>
  );
}

export default App;
