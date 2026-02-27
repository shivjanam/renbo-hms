package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PaymentMode {
    CASH("Cash", "Cash payment at counter"),
    UPI("UPI", "UPI payment (PhonePe, GPay, Paytm, etc.)"),
    DEBIT_CARD("Debit Card", "Debit card payment"),
    CREDIT_CARD("Credit Card", "Credit card payment"),
    NET_BANKING("Net Banking", "Internet banking transfer"),
    NEFT("NEFT", "NEFT bank transfer"),
    RTGS("RTGS", "RTGS bank transfer"),
    IMPS("IMPS", "IMPS instant transfer"),
    CHEQUE("Cheque", "Cheque payment"),
    DD("Demand Draft", "Demand draft payment"),
    WALLET("Wallet", "Digital wallet payment"),
    INSURANCE("Insurance", "Covered by insurance"),
    CREDIT("Credit", "On credit/to be paid later"),
    RAZORPAY("Razorpay", "Razorpay payment gateway"),
    PAYTM("Paytm", "Paytm payment gateway"),
    PHONEPE("PhonePe", "PhonePe payment gateway");

    private final String displayName;
    private final String description;

    public boolean isOnline() {
        return this != CASH && this != CHEQUE && this != DD && this != CREDIT;
    }

    public boolean requiresVerification() {
        return this == CHEQUE || this == DD || this == NEFT || this == RTGS;
    }
}
