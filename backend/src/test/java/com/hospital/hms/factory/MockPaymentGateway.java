package com.hospital.hms.factory;

import com.hospital.hms.common.enums.PaymentMode;
import com.hospital.hms.common.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Mock Payment Gateway for testing payment flows.
 * Simulates Razorpay/Paytm/UPI payment gateway behavior.
 */
public class MockPaymentGateway {

    private static final Map<String, PaymentOrder> orders = new ConcurrentHashMap<>();
    private static final Map<String, PaymentTransaction> transactions = new ConcurrentHashMap<>();
    private static final Set<String> processedIdempotencyKeys = ConcurrentHashMap.newKeySet();

    // Configurable failure scenarios
    private static boolean simulateNetworkFailure = false;
    private static boolean simulateTimeout = false;
    private static double failureRate = 0.0; // 0-1

    /**
     * Create a new payment order (like Razorpay Order).
     */
    public static PaymentOrder createOrder(CreateOrderRequest request) throws PaymentException {
        // Check idempotency
        if (processedIdempotencyKeys.contains(request.idempotencyKey)) {
            // Return existing order for duplicate request
            return orders.values().stream()
                    .filter(o -> o.idempotencyKey.equals(request.idempotencyKey))
                    .findFirst()
                    .orElseThrow(() -> new PaymentException("Order not found for idempotency key"));
        }

        if (simulateNetworkFailure) {
            throw new PaymentException("Network error: Unable to connect to payment gateway");
        }

        if (simulateTimeout) {
            try {
                Thread.sleep(35000); // Simulate timeout
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            throw new PaymentException("Request timeout");
        }

        // Create order
        String orderId = "order_" + UUID.randomUUID().toString().substring(0, 14);
        PaymentOrder order = new PaymentOrder(
                orderId,
                request.amount,
                request.currency,
                request.referenceId,
                request.idempotencyKey,
                "created",
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(30) // 30 min validity
        );

        orders.put(orderId, order);
        processedIdempotencyKeys.add(request.idempotencyKey);

        return order;
    }

    /**
     * Process payment (simulates actual payment).
     */
    public static PaymentResult processPayment(ProcessPaymentRequest request) throws PaymentException {
        PaymentOrder order = orders.get(request.orderId);
        if (order == null) {
            throw new PaymentException("Order not found: " + request.orderId);
        }

        if (order.expiresAt.isBefore(LocalDateTime.now())) {
            throw new PaymentException("Order expired");
        }

        if (order.status().equals("paid")) {
            throw new PaymentException("Order already paid");
        }

        // Simulate random failures based on failure rate
        if (Math.random() < failureRate) {
            return new PaymentResult(
                    null,
                    order.orderId,
                    request.amount,
                    PaymentStatus.FAILED,
                    "PAYMENT_DECLINED",
                    "Payment was declined by the bank"
            );
        }

        // Validate payment method
        if (request.paymentMode == PaymentMode.UPI) {
            if (!isValidUpi(request.upiId)) {
                return new PaymentResult(
                        null,
                        order.orderId,
                        request.amount,
                        PaymentStatus.FAILED,
                        "INVALID_UPI",
                        "Invalid UPI ID format"
                );
            }
        }

        // Simulate successful payment
        String paymentId = "pay_" + UUID.randomUUID().toString().substring(0, 14);
        // Update order status by replacing in map
        PaymentOrder paidOrder = new PaymentOrder(
                order.orderId(), order.amount(), order.currency(), order.referenceId(),
                order.idempotencyKey(), "paid", order.createdAt(), order.expiresAt()
        );
        orders.put(order.orderId(), paidOrder);

        PaymentTransaction txn = new PaymentTransaction(
                paymentId,
                order.orderId,
                request.amount,
                request.paymentMode,
                PaymentStatus.SUCCESS,
                LocalDateTime.now(),
                request.upiId,
                request.cardLast4
        );
        transactions.put(paymentId, txn);

        return new PaymentResult(
                paymentId,
                order.orderId,
                request.amount,
                PaymentStatus.SUCCESS,
                null,
                "Payment successful"
        );
    }

    /**
     * Verify payment status.
     */
    public static PaymentStatus verifyPayment(String paymentId) {
        PaymentTransaction txn = transactions.get(paymentId);
        if (txn == null) {
            return PaymentStatus.PENDING;
        }
        return txn.status;
    }

    /**
     * Process refund.
     */
    public static RefundResult processRefund(String paymentId, BigDecimal amount, String reason) 
            throws PaymentException {
        PaymentTransaction originalTxn = transactions.get(paymentId);
        if (originalTxn == null) {
            throw new PaymentException("Payment not found: " + paymentId);
        }

        if (originalTxn.status != PaymentStatus.SUCCESS) {
            throw new PaymentException("Cannot refund: Payment was not successful");
        }

        if (amount.compareTo(originalTxn.amount) > 0) {
            throw new PaymentException("Refund amount exceeds original payment");
        }

        String refundId = "rfnd_" + UUID.randomUUID().toString().substring(0, 14);

        return new RefundResult(
                refundId,
                paymentId,
                amount,
                "processed",
                reason,
                LocalDateTime.now()
        );
    }

    /**
     * Get transaction history.
     */
    public static List<PaymentTransaction> getTransactionHistory(String orderId) {
        return transactions.values().stream()
                .filter(t -> t.orderId.equals(orderId))
                .toList();
    }

    // Test helpers
    public static void reset() {
        orders.clear();
        transactions.clear();
        processedIdempotencyKeys.clear();
        simulateNetworkFailure = false;
        simulateTimeout = false;
        failureRate = 0.0;
    }

    public static void setSimulateNetworkFailure(boolean value) {
        simulateNetworkFailure = value;
    }

    public static void setSimulateTimeout(boolean value) {
        simulateTimeout = value;
    }

    public static void setFailureRate(double rate) {
        failureRate = Math.max(0, Math.min(1, rate));
    }

    private static boolean isValidUpi(String upiId) {
        if (upiId == null || upiId.isEmpty()) return false;
        return upiId.matches("^[a-zA-Z0-9.]+@[a-zA-Z]+$");
    }

    // DTOs
    public record CreateOrderRequest(
            BigDecimal amount,
            String currency,
            String referenceId,
            String idempotencyKey
    ) {}

    public record PaymentOrder(
            String orderId,
            BigDecimal amount,
            String currency,
            String referenceId,
            String idempotencyKey,
            String status,
            LocalDateTime createdAt,
            LocalDateTime expiresAt
    ) {}

    public record ProcessPaymentRequest(
            String orderId,
            BigDecimal amount,
            PaymentMode paymentMode,
            String upiId,
            String cardLast4
    ) {}

    public record PaymentResult(
            String paymentId,
            String orderId,
            BigDecimal amount,
            PaymentStatus status,
            String errorCode,
            String message
    ) {}

    public record PaymentTransaction(
            String paymentId,
            String orderId,
            BigDecimal amount,
            PaymentMode paymentMode,
            PaymentStatus status,
            LocalDateTime timestamp,
            String upiId,
            String cardLast4
    ) {}

    public record RefundResult(
            String refundId,
            String paymentId,
            BigDecimal amount,
            String status,
            String reason,
            LocalDateTime processedAt
    ) {}

    public static class PaymentException extends Exception {
        public PaymentException(String message) {
            super(message);
        }
    }
}
