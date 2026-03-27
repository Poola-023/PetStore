package com.example.petstore.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject; // Requires org.json dependency
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*") // Allows your React frontend to connect
public class PaymentController {

    @PostMapping("/create-order")
    public String createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
        // Replace with your actual Test Keys from Razorpay Dashboard
        RazorpayClient client = new RazorpayClient("rzp_test_XXXXXXXXXXXX", "YYYYYYYYYYYYYYYYYYYY");

        JSONObject orderRequest = new JSONObject();

        // Convert amount to Integer and then to Paise (1 INR = 100 Paise)
        int amountInPaise = Integer.parseInt(data.get("amount").toString()) * 100;

        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = client.orders.create(orderRequest);

        // Return the order details as a String (JSON) back to React
        return order.toString();
    }
}