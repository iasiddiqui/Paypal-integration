require('dotenv').config(); // Load environment variables

const express = require("express");
const paypal = require("paypal-rest-sdk");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request body

paypal.configure({
  mode: "sandbox", // or "live" for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// Store the total amount temporarily (in production, consider using sessions or a database)
let lastTotal = null;

// Route to test server connection
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Payment route (POST)
app.post("/payment", async (req, res) => {
  try {
    const { total } = req.body; // Get total amount from request body
    lastTotal = total; // Store total amount

    let create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:8000/success",
        cancel_url: "http://localhost:8000/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Registration Fee",
                sku: "registration_fee",
                price: total.toFixed(2), // Use the dynamic total amount
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: total.toFixed(2), // Use the dynamic total amount
          },
          description: "This is the payment for registration.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.error("Error creating payment: ", error); // Log the error
        res.status(500).send("Error creating PayPal payment");
      } else {
        console.log("Create Payment Response", payment);

        const approvalUrl = payment.links.find(
          (link) => link.rel === "approval_url"
        ).href;
        res.json({ approvalUrl }); // Send the approval URL to frontend
      }
    });
  } catch (error) {
    console.error("Error during payment creation", error);
    res.status(500).send("Server error");
  }
});

// Success route
app.get("/success", async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: lastTotal ? lastTotal.toFixed(2) : "0.00", // Use stored total amount
          },
          description: "Payment for registration successful.",
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.error("Error executing payment: ", error);
          res.redirect("http://localhost:5173/failed");
        } else {
          console.log("Execute Payment Response", payment);
          res.redirect("http://localhost:5173/success"); // Redirect to frontend success page
        }
      }
    );
  } catch (error) {
    console.error("Error during payment execution", error);
    res.redirect("http://localhost:5173/failed");
  }
});

// Cancel route
app.get("/cancel", (req, res) => {
  res.redirect("http://localhost:5173/failed"); // Redirect to frontend cancel page
});

// Start server
app.listen(8000, () => {
  console.log("Server running on port 8000");
});
