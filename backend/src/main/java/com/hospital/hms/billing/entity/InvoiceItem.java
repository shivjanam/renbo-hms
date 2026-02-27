package com.hospital.hms.billing.entity;

import com.hospital.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Invoice item - line item in an invoice.
 */
@Entity
@Table(name = "invoice_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(name = "item_type")
    private String itemType; // CONSULTATION, MEDICINE, LAB_TEST, PROCEDURE, BED, etc.

    @Column(name = "reference_id")
    private Long referenceId; // ID of the actual item

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "hsn_sac_code")
    private String hsnSacCode; // HSN/SAC code for GST

    @Column(name = "quantity", nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "unit")
    private String unit;

    @Column(name = "unit_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "gross_amount", precision = 10, scale = 2)
    private BigDecimal grossAmount;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "discount_percentage")
    private Double discountPercentage;

    @Column(name = "taxable_amount", precision = 10, scale = 2)
    private BigDecimal taxableAmount;

    // GST
    @Column(name = "cgst_rate")
    private Double cgstRate;

    @Column(name = "cgst_amount", precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal cgstAmount = BigDecimal.ZERO;

    @Column(name = "sgst_rate")
    private Double sgstRate;

    @Column(name = "sgst_amount", precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal sgstAmount = BigDecimal.ZERO;

    @Column(name = "igst_rate")
    private Double igstRate;

    @Column(name = "igst_amount", precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal igstAmount = BigDecimal.ZERO;

    @Column(name = "total_tax", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalTax = BigDecimal.ZERO;

    @Column(name = "net_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal netAmount;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "notes")
    private String notes;

    @PrePersist
    @PreUpdate
    private void calculateAmounts() {
        if (unitPrice != null && quantity != null) {
            grossAmount = unitPrice.multiply(BigDecimal.valueOf(quantity));
            
            if (discountAmount == null) {
                discountAmount = BigDecimal.ZERO;
            }
            
            taxableAmount = grossAmount.subtract(discountAmount);
            
            if (cgstAmount == null) cgstAmount = BigDecimal.ZERO;
            if (sgstAmount == null) sgstAmount = BigDecimal.ZERO;
            if (igstAmount == null) igstAmount = BigDecimal.ZERO;
            
            totalTax = cgstAmount.add(sgstAmount).add(igstAmount);
            netAmount = taxableAmount.add(totalTax);
        }
    }
}
