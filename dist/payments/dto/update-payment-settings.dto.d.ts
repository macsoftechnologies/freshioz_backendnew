export declare class UpdatePaymentSettingsDto {
    razorpayEnabled?: boolean;
    activeMode?: 'TEST' | 'LIVE';
    testKeyId?: string;
    testKeySecret?: string;
    liveKeyId?: string;
    liveKeySecret?: string;
    webhookSecret?: string;
}
