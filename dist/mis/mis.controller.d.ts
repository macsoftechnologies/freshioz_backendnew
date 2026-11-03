import { MisService } from './mis.service';
import { MisQueryDto, ReconcileRiderCashDto } from './dto/mis-query.dto';
export declare class MisController {
    private readonly misService;
    constructor(misService: MisService);
    getExecutiveSummary(query: MisQueryDto): Promise<{
        period: {
            label: string;
            startDate: string;
            endDate: string;
        };
        kpis: {
            totalGrossInflow: number;
            grossBillingValue: number;
            bulkDiscountSavings: number;
            deliveryFeesCollected: number;
            totalOrdersCount: number;
            totalProduceDispatchedKg: number;
            totalMandiOutflow: number;
            produceProcuredAmount: number;
            freightLogisticsAmount: number;
            procurementBillsCount: number;
            societyCommissionsEarned: number;
            societyPayoutsDisbursed: number;
            grossMarginSpread: number;
            netOperatingProfit: number;
            grossMarginPercent: number;
            netProfitPercent: number;
            doorstepCashCollected: number;
            cashSettledToHubVault: number;
            cashInTransitWithRiders: number;
        };
        warehouseBreakdown: any[];
        monthlySeries: any[];
        charts: {
            paymentChannels: any[];
            categoryAggregates: any[];
            topSocieties: any[];
            dailySeries: {
                day: string;
                inflow: number;
                outflow: number;
            }[];
            topProduceSpreads: any[];
        };
        productEconomics: any[];
        riderCashLedger: any[];
    }>;
    reconcileRiderCash(dto: ReconcileRiderCashDto): Promise<{
        success: boolean;
        ordersReconciled: number;
        amountSettled: number;
        message: string;
    }>;
}
