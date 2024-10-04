import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./RegistrationForm.css"

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    registrationType: '',
    registrationOption: '',
    accommodation: '',
    paymentMethod: '',
  });

  const navigate = useNavigate();

  const prices = {
    student: {
      earlyBird: 100,
      midTerm: 150,
      final: 200,
    },
    industryExpert: {
      earlyBird: 200,
      midTerm: 250,
      final: 300,
    },
    accommodation: {
      oneNight: 50,
      twoNights: 100,
    },
  };

  const calculateTotal = () => {
    let total = 0;

    if (formData.registrationType && formData.registrationOption) {
      total += prices[formData.registrationType][formData.registrationOption];
    }

    if (formData.accommodation) {
      total += prices.accommodation[formData.accommodation];
    }

    return total;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalAmount = calculateTotal(); // Get the total amount

    if (formData.paymentMethod === "paypal") {
      // Redirect to payment service page with total amount
      navigate("/payment-service", { state: { total: totalAmount } });
    } else if (formData.paymentMethod === "stripe") {
      console.log("Proceeding with Stripe payment...");
      // Implement your Stripe payment logic here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Personal Details Section */}
      <h2>Personal Details</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </label>
      <br />
      <label>
        Phone Number:
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </label>
      <br />
      <label>
        Address:
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
      </label>

      {/* Registration Section */}
      <h2>Registration</h2>
      <label>
        Registration Type:
        <br />
        <input
          type="radio"
          name="registrationType"
          value="student"
          checked={formData.registrationType === 'student'}
          onChange={handleInputChange}
        />
        Student
        <br />
        <input
          type="radio"
          name="registrationType"
          value="industryExpert"
          checked={formData.registrationType === 'industryExpert'}
          onChange={handleInputChange}
        />
        Industry Expert
      </label>
      <br />
      {formData.registrationType && (
        <label>
          Choose Registration Option:
          <br />
          <input
            type="radio"
            name="registrationOption"
            value="earlyBird"
            checked={formData.registrationOption === 'earlyBird'}
            onChange={handleInputChange}
          />
          Early Bird (${prices[formData.registrationType].earlyBird})
          <br />
          <input
            type="radio"
            name="registrationOption"
            value="midTerm"
            checked={formData.registrationOption === 'midTerm'}
            onChange={handleInputChange}
          />
          Mid Term (${prices[formData.registrationType].midTerm})
          <br />
          <input
            type="radio"
            name="registrationOption"
            value="final"
            checked={formData.registrationOption === 'final'}
            onChange={handleInputChange}
          />
          Final (${prices[formData.registrationType].final})
        </label>
      )}

      {/* Accommodation Section */}
      <h2>Accommodation</h2>
      <label>
        <input
          type="radio"
          name="accommodation"
          value="oneNight"
          checked={formData.accommodation === 'oneNight'}
          onChange={handleInputChange}
        />
        1 Night ($50)
        <br />
        <input
          type="radio"
          name="accommodation"
          value="twoNights"
          checked={formData.accommodation === 'twoNights'}
          onChange={handleInputChange}
        />
        2 Nights ($100)
      </label>

      {/* Payment Section */}
      <h2>Payment Method</h2>
      <label>
        <input
          type="radio"
          name="paymentMethod"
          value="paypal"
          checked={formData.paymentMethod === 'paypal'}
          onChange={handleInputChange}
        />
        PayPal
        <br />
        <input
          type="radio"
          name="paymentMethod"
          value="stripe"
          checked={formData.paymentMethod === 'stripe'}
          onChange={handleInputChange}
        />
        Stripe
      </label>

      {/* Total Section */}
      <h2>Total Amount: ${calculateTotal()}</h2>

      {/* Submit Button */}
      <button type="submit">Proceed to Payment</button>
    </form>
  );
};

export default RegistrationForm;
