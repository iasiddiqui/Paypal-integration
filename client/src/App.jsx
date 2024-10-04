import axios from 'axios';

function App() {
  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/payment'); // Use POST instead of GET

      if (res && res.data) {
        const approvalUrl = res.data.approvalUrl; // Adjust based on the backend response
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

export default App;
