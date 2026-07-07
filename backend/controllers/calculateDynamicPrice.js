// dynamicPricing.js
function calculateDynamicPrice(roomType, basePrice, season, demand, competitorPrice, temperature, localEvent, isWeekend) {
    let price = basePrice;

    // Season adjustment
    let seasonMultiplier = 1;
    if (season === 'High') {
        seasonMultiplier = 1.25; // 25% increase in high season
    } else if (season === 'Low') {
        seasonMultiplier = 0.85; // 15% decrease in low season
    }
    price *= seasonMultiplier;

    // Demand-based price adjustment
    // Demand factor ranges from 0.8 (low demand) to 1.2 (high demand)
    const demandFactor = 1 + (demand - 50) * 0.01; // Demand between 0-100 (0.5 to 1.5)
    price *= demandFactor;

    // Competitor price comparison (e.g., higher competitor price, higher our price)
    const competitorImpact = competitorPrice > basePrice ? 0.95 : 1.05; // 5% lower or higher
    price *= competitorImpact;

    // Temperature-based adjustment (ideal between 20°C and 30°C)
    if (temperature < 15) {
        price *= 0.9; // 10% decrease for cold temperatures
    } else if (temperature > 35) {
        price *= 0.85; // 15% decrease for very hot temperatures
    }

    // Local event adjustment (15% increase if there’s a local event)
    if (localEvent) {
        price *= 1.15;
    }

    // Weekend pricing (10% increase on weekends)
    if (isWeekend) {
        price *= 1.1;
    }

    // Ensure price is within a reasonable range (not lower than 50% of the base price or higher than 3x base price)
    price = Math.max(price, basePrice * 0.5); // Don't go below 50% of the base price
    price = Math.min(price, basePrice * 3);   // Don't go above 3 times the base price

    // Round the price to 2 decimal places for consistency
    price = Math.floor(price);

    console.log(`Calculated price for ${roomType}: ${price}`);
    return price;
}

module.exports = calculateDynamicPrice;
