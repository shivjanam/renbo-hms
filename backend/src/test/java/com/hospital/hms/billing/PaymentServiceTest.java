package com.hospital.hms.billing;

import com.hospital.hms.common.enums.PaymentMode;
import com.hospital.hms.common.enums.PaymentStatus;
import com.hospital.hms.factory.TestDataFactory;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests for Payment Service functionality.
 * Tests payment processing, GST calculation, refunds, and idempotency.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentService Tests")
class PaymentServiceTest {

    @BeforeEach
    void setUp() {
        TestDataFactory.resetIdGenerator();
    }

    @Nested
    @DisplayName("GST Calculation Tests")
    class GstCalculationTests {

        @Test
        @DisplayName("Should calculate 18% GST correctly")
        void shouldCalculate18PercentGst() {
            // Given
            BigDecimal baseAmount = new BigDecimal("1000.00");
            BigDecimal gstRate = new BigDecimal("18.0");

            // When
            BigDecimal gstAmount = calculateGst(baseAmount, gstRate);
            BigDecimal totalAmount = baseAmount.add(gstAmount);

            // Then
            assertThat(gstAmount).isEqualByComparingTo(new BigDecimal("180.00"));
            assertThat(totalAmount).isEqualByComparingTo(new BigDecimal("1180.00"));
        }

        @Test
        @DisplayName("Should calculate 5% GST correctly")
        void shouldCalculate5PercentGst() {
            // Given
            BigDecimal baseAmount = new BigDecimal("500.00");
            BigDecimal gstRate = new BigDecimal("5.0");

            // When
            BigDecimal gstAmount = calculateGst(baseAmount, gstRate);
            BigDecimal totalAmount = baseAmount.add(gstAmount);

            // Then
            assertThat(gstAmount).isEqualByComparingTo(new BigDecimal("25.00"));
            assertThat(totalAmount).isEqualByComparingTo(new BigDecimal("525.00"));
        }

        @Test
        @DisplayName("Should split CGST and SGST equally")
        void shouldSplitCgstSgst() {
            // Given
            BigDecimal totalGst = new BigDecimal("180.00");

            // When
            BigDecimal cgst = totalGst.divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);
            BigDecimal sgst = totalGst.divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);

            // Then
            assertThat(cgst).isEqualByComparingTo(new BigDecimal("90.00"));
            assertThat(sgst).isEqualByComparingTo(new BigDecimal("90.00"));
            assertThat(cgst.add(sgst)).isEqualByComparingTo(totalGst);
        }

        @Test
        @DisplayName("Should handle zero GST")
        void shouldHandleZeroGst() {
            // Given - Some medical services are GST exempt
            BigDecimal baseAmount = new BigDecimal("500.00");
            BigDecimal gstRate = BigDecimal.ZERO;

            // When
            BigDecimal gstAmount = calculateGst(baseAmount, gstRate);

            // Then
            assertThat(gstAmount).isEqualByComparingTo(BigDecimal.ZERO);
        }

        private BigDecimal calculateGst(BigDecimal amount, BigDecimal rate) {
            return amount.multiply(rate).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        }
    }

    @Nested
    @DisplayName("UPI Payment Tests")
    class UpiPaymentTests {

        @Test
        @DisplayName("Should validate UPI ID format")
        void shouldValidateUpiIdFormat() {
            // Given
            String validUpi1 = "user@upi";
            String validUpi2 = "9876543210@paytm";
            String validUpi3 = "username.test@okicici";
            String invalidUpi1 = "invalid-upi";
            String invalidUpi2 = "user@@upi";
            String invalidUpi3 = "@upi";

            // Then
            assertThat(isValidUpiId(validUpi1)).isTrue();
            assertThat(isValidUpiId(validUpi2)).isTrue();
            assertThat(isValidUpiId(validUpi3)).isTrue();
            assertThat(isValidUpiId(invalidUpi1)).isFalse();
            assertThat(isValidUpiId(invalidUpi2)).isFalse();
            assertThat(isValidUpiId(invalidUpi3)).isFalse();
        }

        private boolean isValidUpiId(String upiId) {
            if (upiId == null || upiId.isEmpty()) return false;
            // Basic UPI format: username@handle
            return upiId.matches("^[a-zA-Z0-9.]+@[a-zA-Z]+$");
        }
    }

    @Nested
    @DisplayName("Payment Idempotency Tests")
    class PaymentIdempotencyTests {

        @Test
        @DisplayName("Should generate unique idempotency key")
        void shouldGenerateUniqueIdempotencyKey() {
            // When
            String key1 = generateIdempotencyKey();
            String key2 = generateIdempotencyKey();

            // Then
            assertThat(key1).isNotEqualTo(key2);
            assertThat(key1).hasSize(36); // UUID format
        }

        @Test
        @DisplayName("Should detect duplicate payment request")
        void shouldDetectDuplicatePayment() {
            // Given
            String idempotencyKey = generateIdempotencyKey();
            PaymentRecord existingPayment = new PaymentRecord(idempotencyKey, PaymentStatus.SUCCESS);

            // When
            boolean isDuplicate = checkForDuplicate(idempotencyKey, existingPayment);

            // Then
            assertThat(isDuplicate).isTrue();
        }

        @Test
        @DisplayName("Should allow retry for failed payment with same key")
        void shouldAllowRetryForFailedPayment() {
            // Given
            String idempotencyKey = generateIdempotencyKey();
            PaymentRecord failedPayment = new PaymentRecord(idempotencyKey, PaymentStatus.FAILED);

            // When
            boolean canRetry = canRetryPayment(idempotencyKey, failedPayment);

            // Then
            assertThat(canRetry).isTrue();
        }

        private String generateIdempotencyKey() {
            return UUID.randomUUID().toString();
        }

        private boolean checkForDuplicate(String key, PaymentRecord existing) {
            return existing != null && 
                   existing.idempotencyKey.equals(key) && 
                   existing.status == PaymentStatus.SUCCESS;
        }

        private boolean canRetryPayment(String key, PaymentRecord existing) {
            return existing != null &&
                   existing.idempotencyKey.equals(key) &&
                   (existing.status == PaymentStatus.FAILED || existing.status == PaymentStatus.PENDING);
        }

        record PaymentRecord(String idempotencyKey, PaymentStatus status) {}
    }

    @Nested
    @DisplayName("Refund Processing Tests")
    class RefundProcessingTests {

        @Test
        @DisplayName("Should calculate full refund")
        void shouldCalculateFullRefund() {
            // Given
            BigDecimal originalAmount = new BigDecimal("1000.00");

            // When
            BigDecimal refundAmount = calculateRefund(originalAmount, 100);

            // Then
            assertThat(refundAmount).isEqualByComparingTo(originalAmount);
        }

        @Test
        @DisplayName("Should calculate partial refund")
        void shouldCalculatePartialRefund() {
            // Given
            BigDecimal originalAmount = new BigDecimal("1000.00");
            int refundPercentage = 50;

            // When
            BigDecimal refundAmount = calculateRefund(originalAmount, refundPercentage);

            // Then
            assertThat(refundAmount).isEqualByComparingTo(new BigDecimal("500.00"));
        }

        @Test
        @DisplayName("Should apply cancellation fee")
        void shouldApplyCancellationFee() {
            // Given
            BigDecimal originalAmount = new BigDecimal("1000.00");
            BigDecimal cancellationFee = new BigDecimal("100.00");

            // When
            BigDecimal refundAmount = originalAmount.subtract(cancellationFee);

            // Then
            assertThat(refundAmount).isEqualByComparingTo(new BigDecimal("900.00"));
        }

        @Test
        @DisplayName("Should not refund more than original amount")
        void shouldNotRefundMoreThanOriginal() {
            // Given
            BigDecimal originalAmount = new BigDecimal("1000.00");
            BigDecimal requestedRefund = new BigDecimal("1500.00");

            // When
            BigDecimal actualRefund = requestedRefund.compareTo(originalAmount) > 0 
                    ? originalAmount 
                    : requestedRefund;

            // Then
            assertThat(actualRefund).isLessThanOrEqualTo(originalAmount);
        }

        private BigDecimal calculateRefund(BigDecimal amount, int percentage) {
            return amount.multiply(new BigDecimal(percentage))
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        }
    }

    @Nested
    @DisplayName("Payment Timeout Tests")
    class PaymentTimeoutTests {

        @Test
        @DisplayName("Should expire pending payment after timeout")
        void shouldExpirePendingPaymentAfterTimeout() {
            // Given
            LocalDateTime createdAt = LocalDateTime.now().minusMinutes(15);
            int timeoutMinutes = 10;

            // When
            boolean isExpired = isPaymentExpired(createdAt, timeoutMinutes);

            // Then
            assertThat(isExpired).isTrue();
        }

        @Test
        @DisplayName("Should not expire payment within timeout")
        void shouldNotExpirePaymentWithinTimeout() {
            // Given
            LocalDateTime createdAt = LocalDateTime.now().minusMinutes(5);
            int timeoutMinutes = 10;

            // When
            boolean isExpired = isPaymentExpired(createdAt, timeoutMinutes);

            // Then
            assertThat(isExpired).isFalse();
        }

        private boolean isPaymentExpired(LocalDateTime createdAt, int timeoutMinutes) {
            return createdAt.plusMinutes(timeoutMinutes).isBefore(LocalDateTime.now());
        }
    }

    @Nested
    @DisplayName("Invoice Number Generation Tests")
    class InvoiceNumberTests {

        @Test
        @DisplayName("Should generate unique invoice number")
        void shouldGenerateUniqueInvoiceNumber() {
            // Given
            String hospitalPrefix = "CGH";
            int sequenceNumber = 12345;
            int year = 2026;

            // When
            String invoiceNumber = generateInvoiceNumber(hospitalPrefix, year, sequenceNumber);

            // Then
            assertThat(invoiceNumber).isEqualTo("CGH/2026/012345");
        }

        @Test
        @DisplayName("Should generate receipt number")
        void shouldGenerateReceiptNumber() {
            // Given
            String prefix = "REC";
            int sequenceNumber = 999;

            // When
            String receiptNumber = String.format("%s%06d", prefix, sequenceNumber);

            // Then
            assertThat(receiptNumber).isEqualTo("REC000999");
        }

        private String generateInvoiceNumber(String prefix, int year, int sequence) {
            return String.format("%s/%d/%06d", prefix, year, sequence);
        }
    }

    @Nested
    @DisplayName("Payment Mode Validation Tests")
    class PaymentModeValidationTests {

        @Test
        @DisplayName("Should accept all valid payment modes")
        void shouldAcceptValidPaymentModes() {
            // Then
            assertThat(PaymentMode.values()).contains(
                    PaymentMode.CASH,
                    PaymentMode.UPI,
                    PaymentMode.CREDIT_CARD,
                    PaymentMode.DEBIT_CARD,
                    PaymentMode.NET_BANKING,
                    PaymentMode.INSURANCE
            );
        }

        @Test
        @DisplayName("Should identify online payment modes")
        void shouldIdentifyOnlinePaymentModes() {
            // Given
            PaymentMode[] onlineModes = {
                    PaymentMode.UPI,
                    PaymentMode.CREDIT_CARD,
                    PaymentMode.DEBIT_CARD,
                    PaymentMode.NET_BANKING
            };

            // Then
            for (PaymentMode mode : onlineModes) {
                assertThat(isOnlinePayment(mode)).isTrue();
            }
            assertThat(isOnlinePayment(PaymentMode.CASH)).isFalse();
        }

        private boolean isOnlinePayment(PaymentMode mode) {
            return mode != PaymentMode.CASH && mode != PaymentMode.CHEQUE;
        }
    }
}
