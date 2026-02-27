package com.hospital.hms.common.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utility for encrypting/decrypting sensitive data like Aadhaar numbers.
 * Uses AES-GCM for authenticated encryption.
 */
@Slf4j
@Component
public class EncryptionUtil {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    @Value("${app.encryption.secret-key}")
    private String secretKey;

    private SecretKeySpec getKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        // Ensure key is exactly 32 bytes for AES-256
        byte[] key = new byte[32];
        System.arraycopy(keyBytes, 0, key, 0, Math.min(keyBytes.length, 32));
        return new SecretKeySpec(key, "AES");
    }

    /**
     * Encrypts a string using AES-GCM.
     * 
     * @param plainText The text to encrypt
     * @return Base64 encoded encrypted string (IV + ciphertext)
     */
    public String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return null;
        }

        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, getKey(), parameterSpec);

            byte[] encrypted = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            // Combine IV and encrypted data
            byte[] combined = new byte[iv.length + encrypted.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);

            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            log.error("Encryption failed", e);
            throw new RuntimeException("Encryption failed", e);
        }
    }

    /**
     * Decrypts a Base64 encoded encrypted string.
     * 
     * @param encryptedText Base64 encoded encrypted string
     * @return Original plain text
     */
    public String decrypt(String encryptedText) {
        if (encryptedText == null || encryptedText.isEmpty()) {
            return null;
        }

        try {
            byte[] combined = Base64.getDecoder().decode(encryptedText);

            byte[] iv = new byte[GCM_IV_LENGTH];
            byte[] encrypted = new byte[combined.length - GCM_IV_LENGTH];

            System.arraycopy(combined, 0, iv, 0, iv.length);
            System.arraycopy(combined, iv.length, encrypted, 0, encrypted.length);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, getKey(), parameterSpec);

            byte[] decrypted = cipher.doFinal(encrypted);
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Decryption failed", e);
            throw new RuntimeException("Decryption failed", e);
        }
    }

    /**
     * Masks an Aadhaar number for display (shows only last 4 digits).
     * 
     * @param aadhaar Full Aadhaar number
     * @return Masked Aadhaar (e.g., XXXX-XXXX-1234)
     */
    public String maskAadhaar(String aadhaar) {
        if (aadhaar == null || aadhaar.length() < 4) {
            return "XXXX-XXXX-XXXX";
        }
        String cleaned = aadhaar.replaceAll("[^0-9]", "");
        if (cleaned.length() >= 4) {
            return "XXXX-XXXX-" + cleaned.substring(cleaned.length() - 4);
        }
        return "XXXX-XXXX-XXXX";
    }

    /**
     * Masks a mobile number for display (shows only last 4 digits).
     * 
     * @param mobile Full mobile number
     * @return Masked mobile (e.g., XXXXXX1234)
     */
    public String maskMobile(String mobile) {
        if (mobile == null || mobile.length() < 4) {
            return "XXXXXXXXXX";
        }
        String cleaned = mobile.replaceAll("[^0-9]", "");
        if (cleaned.length() >= 4) {
            return "XXXXXX" + cleaned.substring(cleaned.length() - 4);
        }
        return "XXXXXXXXXX";
    }
}
