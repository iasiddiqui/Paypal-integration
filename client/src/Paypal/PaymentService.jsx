import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate

function PaymentService() {
  const navigate = useNavigate(); // Use navigate instead of history

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/payment');

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
      <button onClick={handlePayment}>Proceed to Payment</button>
    </>
  );
}

export default PaymentService;
