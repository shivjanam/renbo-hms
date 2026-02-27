package com.hospital.hms.billing.controller;

import com.hospital.hms.billing.entity.Invoice;
import com.hospital.hms.billing.repository.InvoiceRepository;
import com.hospital.hms.common.enums.PaymentStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Invoice Management", description = "Invoice and billing management endpoints")
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;

    @GetMapping
    @Operation(summary = "Get All Invoices", description = "Get all invoices with pagination and optional filters")
    public ResponseEntity<Map<String, Object>> getAllInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long hospitalId) {

        log.info("Fetching invoices - page: {}, size: {}, status: {}", page, size, status);

        Pageable pageable = PageRequest.of(page, size, Sort.by("invoiceDate").descending());

        Page<Invoice> invoicePage;
        
        PaymentStatus statusEnum = null;
        if (status != null && !status.isEmpty()) {
            try {
                statusEnum = PaymentStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status: {}", status);
            }
        }

        invoicePage = invoiceRepository.findByFilters(statusEnum, hospitalId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", invoicePage.getContent());
        response.put("totalElements", invoicePage.getTotalElements());
        response.put("totalPages", invoicePage.getTotalPages());
        response.put("currentPage", page);
        response.put("size", size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    @Operation(summary = "Get Invoices List", description = "Get simple list of invoices")
    public ResponseEntity<List<Invoice>> getInvoiceList() {
        log.info("Fetching all invoices as list");
        List<Invoice> invoices = invoiceRepository.findByIsDeletedFalse(
                PageRequest.of(0, 100, Sort.by("invoiceDate").descending())).getContent();
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Invoice by ID", description = "Get invoice details by ID")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        log.info("Fetching invoice by id: {}", id);
        return invoiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{invoiceNumber}")
    @Operation(summary = "Get Invoice by Number", description = "Get invoice by invoice number")
    public ResponseEntity<Invoice> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        log.info("Fetching invoice by number: {}", invoiceNumber);
        return invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get Patient Invoices", description = "Get all invoices for a patient")
    public ResponseEntity<List<Invoice>> getPatientInvoices(@PathVariable Long patientId) {
        log.info("Fetching invoices for patient: {}", patientId);
        List<Invoice> invoices = invoiceRepository.findByPatientId(patientId);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/patient/uhid/{uhid}")
    @Operation(summary = "Get Patient Invoices by UHID", description = "Get all invoices for a patient by UHID")
    public ResponseEntity<List<Invoice>> getPatientInvoicesByUhid(@PathVariable String uhid) {
        log.info("Fetching invoices for patient UHID: {}", uhid);
        List<Invoice> invoices = invoiceRepository.findByPatientUhid(uhid);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/summary")
    @Operation(summary = "Get Invoice Summary", description = "Get billing summary statistics")
    public ResponseEntity<Map<String, Object>> getInvoiceSummary(
            @RequestParam(required = false) Long hospitalId) {
        log.info("Getting invoice summary for hospital: {}", hospitalId);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalInvoices", invoiceRepository.count());
        
        if (hospitalId != null) {
            Double paidAmount = invoiceRepository.getTotalPaidAmountByHospital(hospitalId);
            Double pendingAmount = invoiceRepository.getTotalPendingAmountByHospital(hospitalId);
            
            summary.put("paidAmount", paidAmount != null ? paidAmount : 0);
            summary.put("pendingAmount", pendingAmount != null ? pendingAmount : 0);
            summary.put("paidCount", invoiceRepository.countByHospitalAndStatus(hospitalId, PaymentStatus.SUCCESS));
            summary.put("pendingCount", invoiceRepository.countByHospitalAndStatus(hospitalId, PaymentStatus.PENDING));
        }
        
        return ResponseEntity.ok(summary);
    }

    // ==================== PAYMENT ENDPOINTS ====================

    @PostMapping("/{id}/payments")
    @Operation(summary = "Record Payment", description = "Record a payment against an invoice")
    public ResponseEntity<Map<String, Object>> recordPayment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> paymentRequest) {
        
        log.info("Recording payment for invoice ID: {}, request: {}", id, paymentRequest);
        
        Invoice invoice = invoiceRepository.findById(id)
                .orElse(null);
        
        if (invoice == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Invoice not found");
            return ResponseEntity.notFound().build();
        }
        
        // Parse payment amount
        Double paymentAmount = 0.0;
        if (paymentRequest.get("amount") != null) {
            paymentAmount = Double.parseDouble(paymentRequest.get("amount").toString());
        }
        
        // Use grandTotal as the total amount (entity field name)
        BigDecimal totalAmount = invoice.getGrandTotal() != null ? invoice.getGrandTotal() : BigDecimal.ZERO;
        BigDecimal currentPaidAmount = invoice.getAmountPaid() != null ? invoice.getAmountPaid() : BigDecimal.ZERO;
        BigDecimal pendingAmount = totalAmount.subtract(currentPaidAmount);
        
        if (paymentAmount <= 0) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Payment amount must be greater than 0");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        if (BigDecimal.valueOf(paymentAmount).compareTo(pendingAmount) > 0) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Payment amount cannot exceed pending amount");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Update invoice - use correct field names from entity
        BigDecimal newPaidAmount = currentPaidAmount.add(BigDecimal.valueOf(paymentAmount));
        invoice.setAmountPaid(newPaidAmount);
        invoice.setBalanceAmount(totalAmount.subtract(newPaidAmount));
        
        // Update status based on payment
        if (newPaidAmount.compareTo(totalAmount) >= 0) {
            invoice.setPaymentStatus(PaymentStatus.SUCCESS);
        } else if (newPaidAmount.compareTo(BigDecimal.ZERO) > 0) {
            invoice.setPaymentStatus(PaymentStatus.PARTIALLY_PAID);
        }
        
        // Save the updated invoice
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
        log.info("Payment recorded successfully. Invoice {} - New paid amount: {}, Status: {}", 
                id, newPaidAmount, savedInvoice.getPaymentStatus());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment recorded successfully");
        response.put("invoice", savedInvoice);
        response.put("paidAmount", newPaidAmount);
        response.put("status", savedInvoice.getPaymentStatus());
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update Invoice", description = "Update invoice details including payment status")
    public ResponseEntity<Map<String, Object>> updateInvoice(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        
        log.info("Updating invoice ID: {} with: {}", id, updates);
        
        Invoice invoice = invoiceRepository.findById(id).orElse(null);
        
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update paid amount if provided (frontend sends paidAmount)
        if (updates.get("paidAmount") != null) {
            BigDecimal paidAmount = BigDecimal.valueOf(Double.parseDouble(updates.get("paidAmount").toString()));
            invoice.setAmountPaid(paidAmount);
            BigDecimal totalAmount = invoice.getGrandTotal() != null ? invoice.getGrandTotal() : BigDecimal.ZERO;
            invoice.setBalanceAmount(totalAmount.subtract(paidAmount));
        }
        
        // Update status if provided
        if (updates.get("status") != null) {
            try {
                invoice.setPaymentStatus(PaymentStatus.valueOf(updates.get("status").toString()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status: {}", updates.get("status"));
            }
        }
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        log.info("Invoice {} updated successfully", id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Invoice updated successfully");
        response.put("invoice", savedInvoice);
        
        return ResponseEntity.ok(response);
    }
}
