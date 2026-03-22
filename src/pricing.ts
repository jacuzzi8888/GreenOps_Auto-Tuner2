import axios from 'axios';
import { PricingResult } from './types';

// Task G10: Graceful Fallbacks (Mock map for offline / testing, now for GCP)
const MOCK_GCP_PRICING: Record<string, number> = {
  'e2-micro': 0.006,
  'e2-medium': 0.024,
  'e2-standard-2': 0.067,
  'n2-standard-4': 0.208,
  'n2-standard-8': 0.416,
};

function fallbackPrice(instanceType: string): number {
    return MOCK_GCP_PRICING[instanceType] ?? 0.10; // Default flat fallback
}

/**
 * Queries the Google Cloud Billing Catalog API for Compute Engine pricing.
 */
export async function getLiveGcpPrice(instanceType: string, region: string = 'us-central1'): Promise<PricingResult> {
    const apiKey = process.env.GCP_API_KEY;

    if (!apiKey) {
        console.warn('⚠️ No GCP_API_KEY provided. Falling back to local GCP mock pricing.');
        const price = fallbackPrice(instanceType);
        return { 
            found: true, 
            needsReview: true,
            entry: { sku: instanceType, region, pricePerHour: price, pricePerMonth: price * 730, currency: 'USD', source: 'Mock Fallback' } 
        };
    }

    try {
        // Service ID for Compute Engine: 6F81-5844-456A
        const serviceId = '6F81-5844-456A'; 
        const url = `https://cloudbilling.googleapis.com/v1/services/${serviceId}/skus?key=${apiKey}`;
        
        const response = await axios.get(url);
        const skus = response.data.skus || [];

        // Simple heuristic search for the hackathon
        const match = skus.find((s: any) => 
            s.description.toLowerCase().includes(instanceType.toLowerCase()) && 
            s.description.includes(region)
        );

        if (match && match.pricingInfo && match.pricingInfo.length > 0) {
           const tier = match.pricingInfo[0].pricingExpression.tieredRates[0];
           const nanos = tier.unitPrice.nanos || 0;
           const units = tier.unitPrice.units || 0;
           const hourly = parseFloat(units) + (nanos / 1e9);
           return {
               found: true,
               needsReview: false,
               entry: { sku: instanceType, region, pricePerHour: hourly, pricePerMonth: hourly * 730, currency: 'USD', source: 'GCP Billing Catalog' }
           };
        }

        console.warn(`⚠️ Exact GCP SKU not found for ${instanceType}. Using fallback.`);
        const price = fallbackPrice(instanceType);
        return { 
            found: true, 
            needsReview: true,
            entry: { sku: instanceType, region, pricePerHour: price, pricePerMonth: price * 730, currency: 'USD', source: 'Mock Fallback' } 
        };
    } catch (error: any) {
        console.error('Error fetching GCP live pricing:', error.message);
        return { found: false, needsReview: true, reason: error.message };
    }
}
