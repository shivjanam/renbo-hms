package com.hospital.hms.billing;

import com.hospital.hms.common.enums.PaymentMode;
import com.hospital.hms.common.enums.PaymentStatus;
import com.hospital.hms.factory.MockPaymentGateway;
import com.hospital.hms.factory.MockPaymentGateway.*;
import org.junit.jupiter.api.*;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Mock Payment Gateway Tests")
class MockPaymentGatewayTest {

    @BeforeEach
    void setUp() {
        MockPaymentGateway.reset();
    }

    @Nested
    @DisplayName("Order Creation Tests")
    class OrderCreationTests {

        @Test
        @DisplayName("Should create order successfully")
        void shouldCreateOrderSuccessfully() throws PaymentException {
            CreateOrderRequest request = new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            );

            PaymentOrder order = MockPaymentGateway.createOrder(request);

            assertThat(order).isNotNull();
            assertThat(order.orderId()).startsWith("order_");
            assertThat(order.amount()).isEqualByComparingTo(new BigDecimal("500.00"));
            assertThat(order.status()).isEqualTo("created");
        }

        @Test
        @DisplayName("Should return same order for duplicate idempotency key")
        void shouldReturnSameOrderForDuplicateKey() throws PaymentException {
            String idempotencyKey = UUID.randomUUID().toString();
            
            CreateOrderRequest request = new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    idempotencyKey
            );

            PaymentOrder order1 = MockPaymentGateway.createOrder(request);
            PaymentOrder order2 = MockPaymentGateway.createOrder(request);

            assertThat(order1.orderId()).isEqualTo(order2.orderId());
        }

        @Test
        @DisplayName("Should fail on network error simulation")
        void shouldFailOnNetworkError() {
            MockPaymentGateway.setSimulateNetworkFailure(true);
            
            CreateOrderRequest request = new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            );

            assertThatThrownBy(() -> MockPaymentGateway.createOrder(request))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Network error");
        }
    }

    @Nested
    @DisplayName("Payment Processing Tests")
    class PaymentProcessingTests {

        @Test
        @DisplayName("Should process UPI payment successfully")
        void shouldProcessUpiPaymentSuccessfully() throws PaymentException {
            // Create order first
            PaymentOrder order = MockPaymentGateway.createOrder(new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            ));

            // Process payment
            ProcessPaymentRequest paymentRequest = new ProcessPaymentRequest(
                    order.orderId(),
                    new BigDecimal("500.00"),
                    PaymentMode.UPI,
                    "patient@upi",
                    null
            );

            PaymentResult result = MockPaymentGateway.processPayment(paymentRequest);

            assertThat(result.status()).isEqualTo(PaymentStatus.SUCCESS);
            assertThat(result.paymentId()).startsWith("pay_");
        }

        @Test
        @DisplayName("Should fail for invalid UPI ID")
        void shouldFailForInvalidUpiId() throws PaymentException {
            PaymentOrder order = MockPaymentGateway.createOrder(new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            ));

            ProcessPaymentRequest paymentRequest = new ProcessPaymentRequest(
                    order.orderId(),
                    new BigDecimal("500.00"),
                    PaymentMode.UPI,
                    "invalid-upi", // Invalid format
                    null
            );

            PaymentResult result = MockPaymentGateway.processPayment(paymentRequest);

            assertThat(result.status()).isEqualTo(PaymentStatus.FAILED);
            assertThat(result.errorCode()).isEqualTo("INVALID_UPI");
        }

        @Test
        @DisplayName("Should prevent duplicate payment on same order")
        void shouldPreventDuplicatePayment() throws PaymentException {
            PaymentOrder order = MockPaymentGateway.createOrder(new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            ));

            ProcessPaymentRequest paymentRequest = new ProcessPaymentRequest(
                    order.orderId(),
                    new BigDecimal("500.00"),
                    PaymentMode.UPI,
                    "patient@upi",
                    null
            );

            // First payment succeeds
            MockPaymentGateway.processPayment(paymentRequest);

            // Second payment should fail
            assertThatThrownBy(() -> MockPaymentGateway.processPayment(paymentRequest))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("already paid");
        }

        @Test
        @DisplayName("Should fail for non-existent order")
        void shouldFailForNonExistentOrder() {
            ProcessPaymentRequest paymentRequest = new ProcessPaymentRequest(
                    "order_nonexistent",
                    new BigDecimal("500.00"),
                    PaymentMode.UPI,
                    "patient@upi",
                    null
            );

            assertThatThrownBy(() -> MockPaymentGateway.processPayment(paymentRequest))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("not found");
        }

        @Test
        @DisplayName("Should simulate payment failures based on failure rate")
        void shouldSimulatePaymentFailures() throws PaymentException {
            MockPaymentGateway.setFailureRate(1.0); // 100% failure rate

            PaymentOrder order = MockPaymentGateway.createOrder(new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            ));

            ProcessPaymentRequest paymentRequest = new ProcessPaymentRequest(
                    order.orderId(),
                    new BigDecimal("500.00"),
                    PaymentMode.UPI,
                    "patient@upi",
                    null
            );

            PaymentResult result = MockPaymentGateway.processPayment(paymentRequest);

            assertThat(result.status()).isEqualTo(PaymentStatus.FAILED);
            assertThat(result.errorCode()).isEqualTo("PAYMENT_DECLINED");
        }
    }

    @Nested
    @DisplayName("Payment Verification Tests")
    class PaymentVerificationTests {

        @Test
        @DisplayName("Should verify successful payment")
        void shouldVerifySuccessfulPayment() throws PaymentException {
            PaymentOrder order = MockPaymentGateway.createOrder(new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            ));

            PaymentResult result = MockPaymentGateway.processPayment(new ProcessPaymentRequest(
                    order.orderId(),
                    new BigDecimal("500.00"),
                    PaymentMode.UPI,
                    "patient@upi",
                    null
            ));

            PaymentStatus status = MockPaymentGateway.verifyPayment(result.paymentId());

            assertThat(status).isEqualTo(PaymentStatus.SUCCESS);
        }

        @Test
        @DisplayName("Should return PENDING for non-existent payment")
        void shouldReturnPendingForNonExistent() {
            PaymentStatus status = MockPaymentGateway.verifyPayment("pay_nonexistent");

            assertThat(status).isEqualTo(PaymentStatus.PENDING);
        }
    }

    @Nested
    @DisplayName("Refund Tests")
    class RefundTests {

        @Test
        @DisplayName("Should process full refund")
        void shouldProcessFullRefund() throws PaymentException {
            // Create and complete payment
            PaymentOrder order = MockPaymentGateway.createOrder(new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            ));

            PaymentResult paymentResult = MockPaymentGateway.processPayment(new ProcessPaymentRequest(
                    order.orderId(),
                    new BigDecimal("500.00"),
                    PaymentMode.UPI,
                    "patient@upi",
                    null
            ));

            // Process refund
            RefundResult refundResult = MockPaymentGateway.processRefund(
                    paymentResult.paymentId(),
                    new BigDecimal("500.00"),
                    "Customer requested cancellation"
            );

            assertThat(refundResult.refundId()).startsWith("rfnd_");
            assertThat(refundResult.status()).isEqualTo("processed");
            assertThat(refundResult.amount()).isEqualByComparingTo(new BigDecimal("500.00"));
        }

        @Test
        @DisplayName("Should process partial refund")
        void shouldProcessPartialRefund() throws PaymentException {
            PaymentOrder order = MockPaymentGateway.createOrder(new CreateOrderRequest(
                    new BigDecimal("1000.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            ));

            PaymentResult paymentResult = MockPaymentGateway.processPayment(new ProcessPaymentRequest(
                    order.orderId(),
                    new BigDecimal("1000.00"),
                    PaymentMode.UPI,
                    "patient@upi",
                    null
            ));

            RefundResult refundResult = MockPaymentGateway.processRefund(
                    paymentResult.paymentId(),
                    new BigDecimal("500.00"), // Partial refund
                    "Partial service cancellation"
            );

            assertThat(refundResult.amount()).isEqualByComparingTo(new BigDecimal("500.00"));
        }

        @Test
        @DisplayName("Should fail refund exceeding payment amount")
        void shouldFailRefundExceedingAmount() throws PaymentException {
            PaymentOrder order = MockPaymentGateway.createOrder(new CreateOrderRequest(
                    new BigDecimal("500.00"),
                    "INR",
                    "APT001",
                    UUID.randomUUID().toString()
            ));

            PaymentResult paymentResult = MockPaymentGateway.processPayment(new ProcessPaymentRequest(
                    order.orderId(),
                    new BigDecimal("500.00"),
                    PaymentMode.UPI,
                    "patient@upi",
                    null
            ));

            assertThatThrownBy(() -> MockPaymentGateway.processRefund(
                    paymentResult.paymentId(),
                    new BigDecimal("600.00"), // Exceeds original
                    "Invalid refund"
            ))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("exceeds");
        }

        @Test
        @DisplayName("Should fail refund for non-existent payment")
        void shouldFailRefundForNonExistent() {
            assertThatThrownBy(() -> MockPaymentGateway.processRefund(
                    "pay_nonexistent",
                    new BigDecimal("100.00"),
                    "Test refund"
            ))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("not found");
        }
    }
}
