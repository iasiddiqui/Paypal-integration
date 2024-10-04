const express = require("express");
const paypal = require("paypal-rest-sdk");
const cors = require("cors");

const app = express();
app.use(cors());

paypal.configure({
  mode: "sandbox",
  client_id:
    "ATwB-U5nwdyqs22SMcoQrm68HBbRjYVLrhzmtiSuil_B989gbhAZOiTY7yhzlal7_9ZG7l-Vu4ugD6I0",
  client_secret:
    "EIsoXnZwBGC-zTzlLthsJk2aXNrxaxdAk910oiuJYxLirLkUKYN-Di6HCXbCY4kjiZE7VsOencovECHG",
});

// Route to test server connection
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Payment route (POST)
app.post("/payment", async (req, res) => {
  try {
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
                name: "item",
                sku: "item",
                price: "1.00",
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "1.00",
          },
          description: "This is the payment description.",
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
            total: "1.00",
          },
          description: "This is the payment description.",
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
