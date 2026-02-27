package com.hospital.hms.pharmacy.entity;

import com.hospital.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Medicine stock entity - inventory tracking for medicines.
 */
@Entity
@Table(name = "medicine_stock", indexes = {
        @Index(name = "idx_stock_medicine", columnList = "medicine_id"),
        @Index(name = "idx_stock_hospital", columnList = "hospital_id"),
        @Index(name = "idx_stock_batch", columnList = "batch_number"),
        @Index(name = "idx_stock_expiry", columnList = "expiry_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineStock extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "pharmacy_id")
    private Long pharmacyId; // For hospitals with multiple pharmacy counters

    @Column(name = "batch_number", nullable = false)
    private String batchNumber;

    @Column(name = "barcode")
    private String barcode;

    @Column(name = "manufacturing_date")
    private LocalDate manufacturingDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "quantity_received")
    private Integer quantityReceived;

    @Column(name = "quantity_available", nullable = false)
    private Integer quantityAvailable;

    @Column(name = "quantity_sold")
    @Builder.Default
    private Integer quantitySold = 0;

    @Column(name = "quantity_damaged")
    @Builder.Default
    private Integer quantityDamaged = 0;

    @Column(name = "quantity_returned")
    @Builder.Default
    private Integer quantityReturned = 0;

    @Column(name = "purchase_price", precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "mrp", precision = 10, scale = 2)
    private BigDecimal mrp;

    @Column(name = "selling_price", precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "purchase_order_id")
    private Long purchaseOrderId;

    @Column(name = "grn_number")
    private String grnNumber; // Goods Receipt Note

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "location")
    private String location; // Shelf/Rack location

    @Column(name = "is_expired")
    @Builder.Default
    private Boolean isExpired = false;

    @Column(name = "expiry_alert_sent")
    @Builder.Default
    private Boolean expiryAlertSent = false;

    @Column(name = "low_stock_alert_sent")
    @Builder.Default
    private Boolean lowStockAlertSent = false;

    public boolean isNearExpiry(int daysThreshold) {
        return expiryDate != null && 
               expiryDate.minusDays(daysThreshold).isBefore(LocalDate.now());
    }

    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now());
    }
}
