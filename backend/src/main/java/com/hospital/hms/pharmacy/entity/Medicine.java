package com.hospital.hms.pharmacy.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.MedicineType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Medicine master entity - catalog of medicines.
 */
@Entity
@Table(name = "medicines", indexes = {
        @Index(name = "idx_medicine_name", columnList = "name"),
        @Index(name = "idx_medicine_generic", columnList = "generic_name"),
        @Index(name = "idx_medicine_code", columnList = "medicine_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine extends BaseEntity {

    @Column(name = "medicine_code", unique = true)
    private String medicineCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "generic_name")
    private String genericName;

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Enumerated(EnumType.STRING)
    @Column(name = "medicine_type")
    private MedicineType medicineType;

    @Column(name = "strength")
    private String strength;

    @Column(name = "composition", length = 1000)
    private String composition;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "category")
    private String category; // Antibiotic, Analgesic, etc.

    @Column(name = "sub_category")
    private String subCategory;

    @Column(name = "schedule")
    private String schedule; // H, H1, X, etc. (Indian drug schedules)

    @Column(name = "hsn_code")
    private String hsnCode; // For GST

    @Column(name = "unit")
    private String unit; // Strip, Bottle, Vial, etc.

    @Column(name = "pack_size")
    private Integer packSize; // Tablets per strip, etc.

    // Pricing
    @Column(name = "mrp", precision = 10, scale = 2)
    private BigDecimal mrp;

    @Column(name = "purchase_price", precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "selling_price", precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "gst_percentage")
    private Double gstPercentage;

    // Stock settings
    @Column(name = "reorder_level")
    private Integer reorderLevel;

    @Column(name = "max_stock_level")
    private Integer maxStockLevel;

    // Flags
    @Column(name = "is_generic")
    @Builder.Default
    private Boolean isGeneric = false;

    @Column(name = "is_narcotic")
    @Builder.Default
    private Boolean isNarcotic = false;

    @Column(name = "requires_prescription")
    @Builder.Default
    private Boolean requiresPrescription = true;

    @Column(name = "is_refrigerated")
    @Builder.Default
    private Boolean isRefrigerated = false;

    @Column(name = "storage_instructions")
    private String storageInstructions;

    @Column(name = "side_effects", length = 1000)
    private String sideEffects;

    @Column(name = "contraindications", length = 1000)
    private String contraindications;
}
