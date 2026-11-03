import { PrismaService } from '../prisma/prisma.service';
import { MisQueryDto, ReconcileRiderCashDto } from './dto/mis-query.dto';
export declare class MisService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private resolveDateRange;
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
    private aggregateFinancialSnapshot;
    private generateDailySeries;
    private getFallbackDynamicAnalytics;
    reconcileRiderCash(dto: ReconcileRiderCashDto): Promise<{
        success: boolean;
        ordersReconciled: number;
        amountSettled: number;
        message: string;
    }>;
}
