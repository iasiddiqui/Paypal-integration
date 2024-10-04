import axios from 'axios';
import { useLocation } from 'react-router-dom'; 

function PaymentService() {
  const location = useLocation(); 
  const total = location.state?.total; // Get the total amount from the state

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/payment', { total });

      if (res && res.data) {
        const approvalUrl = res.data.approvalUrl;
        window.location.href = approvalUrl; // Redirect to PayPal
      }
    } catch (error) {
      console.error('Error during the payment request', error);
    }
  };

  return (
    <>
      <h2>Total Amount: ${total}</h2>
      <button onClick={handlePayment}>Proceed to Payment</button>
    </>
  );
}

export default PaymentService;
