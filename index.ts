import express from "express";
import path from "path";

const app = express();
app.use(express.json());

const properties = [
  {
    id: "1",
    name: "Confident Leo / Cascade",
    propertyType: "3 BHK Apartment",
    builderName: "Confident Group",
    sellerType: "Builder Direct Sale",
    bhk: "3 BHK",
    builtUpArea: 1450,
    propertyAge: "Ready to Move (1.5 Years Old)",
    price: 6800000,
    pricePerSqFt: 4689,
    readyToMove: true,
    totalAcquisitionCost: { basePrice: 6800000, parkingCharges: 250000, registrationCharges: 480000, maintenanceDeposit: 100000, otherCharges: 70000, total: 7700000 },
    location: { area: "Kakkanad", railwayStationDistance: 11.8, metroStation: "Palarivattom Metro Station", metroDistance: 4.5, hospital: "Sunrise Hospital (1.5 km)", school: "Choice School / Rajagiri School of Engineering (2.0 km)", supermarket: "SmartCity Hypermarket (0.8 km)", majorRoad: "Seaport-Airport Road (1.2 km)" },
    sellerContact: { type: "Builder Representative", name: "Confident Sales Desk", phone: "+91 98460 12345", verified: true },
    roadAccess: { width: "8 Meters (26 ft)", condition: "Excellent, fully tarred municipal access", monsoonSafety: "High - no known approach-road water accumulation", limitations: "Peak-hour queue near Seaport-Airport junction" },
    checklist: { readyToMove: "Yes - verified ready", propertyAge: "1.5 years", builderName: "Confident Group", reraId: "K-RERA/PRJ/ERN/042/2022", occupancyCertificate: "Available", completionCertificate: "Available", parking: "1 covered reserved car parking space", waterSource: "KWA water connection + open well", powerBackup: "DG backup for common areas", lift: "2 passenger lifts", security: "24/7 CCTV, guard, intercom", maintenanceMonthly: 2800 },
    builderReputation: { background: "Confident Group is a large Kerala residential developer with a long operating history.", completedProjectsLast5Years: "Multiple completed residential projects across Kerala.", constructionQualityRating: "4.2 / 5.0 - solid mid-market construction quality.", positiveFeedback: "Clear documentation support and competitive locations.", negativeFeedback: "Some buyers may prefer upgraded interior fittings.", overallAssessment: "Reliable developer profile for budget-to-premium segments." },
    neighborhoodDetails: { residentialQuality: "Tech-workforce family crowd with modern suburban amenities.", trafficConditions: "Some congestion during Infopark shift hours.", safety: "Generally safe residential corridor.", cleanliness: "Good municipal coverage in active residential pockets.", appreciationPotential: "High due to Kakkanad growth and metro expansion expectations." },
    floodRisk: { classification: "Low Risk", historicalFlooding: "Elevated Kakkanad ridge location reduces flood exposure.", waterloggingReports: "No major stagnation reported for the immediate approach in this sample.", drainageConditions: "Natural slope supports runoff into municipal drains.", residentFeedback: "Residents generally report monsoon comfort in elevated pockets." },
    scores: { locationConnectivity: 16, floodRisk: 15, legalClarity: 15, builderReputation: 9, constructionQuality: 8, appreciationPotential: 9, waterAvailability: 4, neighborhoodQuality: 4, amenitiesMaintenance: 4, priceMarketValue: 4, totalScore: 88 },
    pros: ["Low flood exposure due to elevated location", "Strong appreciation potential around Kakkanad", "Clear ready-to-move documentation", "Competitive base price for a 3 BHK"],
    cons: ["Current metro access is not walkable", "Peak-hour traffic can be slow", "Interior fittings are standard rather than premium"],
    overallVerdict: "Strong Buy. Best suited for families, IT professionals, and buyers seeking lower monsoon risk in a growth corridor.",
    images: { exterior: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80", livingRoom: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", bedroom: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80", amenities: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80" },
    referenceLink: "https://www.99acres.com/search/property/buy/kochi?budget_max=7500000"
  }
];

app.post("/api/properties", (req, res) => {
  const filters = req.body || {};
  const data = properties.filter((property: any) => {
    if (filters.bhk && filters.bhk !== "All" && property.bhk !== filters.bhk) return false;
    if (filters.maxBudget && property.price > Number(filters.maxBudget)) return false;
    if (filters.area && filters.area !== "All" && property.location.area !== filters.area) return false;
    if (filters.floodRisk && filters.floodRisk !== "All" && property.floodRisk.classification !== filters.floodRisk) return false;
    if (filters.sellerType && filters.sellerType !== "All" && !property.sellerType.toLowerCase().includes(String(filters.sellerType).toLowerCase())) return false;
    if (filters.maxDistance && property.location.railwayStationDistance > Number(filters.maxDistance)) return false;
    return true;
  });
  res.json({ success: true, count: data.length, data });
});

app.post("/api/research-news", (req, res) => {
  const { query } = req.body || {};
  if (!query) {
    res.status(400).json({ success: false, error: "Query is required" });
    return;
  }

  res.json({
    success: true,
    cached: true,
    text: `#### Real Estate Research Summary\n\nA deployment-safe research response was generated for: **"${query}"**.\n\n* **Builder and legal review**: Verify the builder's current K-RERA status, occupancy certificate, completion certificate, and active customer complaints before purchase.\n* **Flood and monsoon review**: Check local ward-level waterlogging reports, 2018 flood boundary proximity, road elevation, and drainage outflow before final negotiation.\n* **Site visit priority**: Inspect approach-road width, basement drainage, parking allocation, lift condition, water source, and monthly maintenance records.`,
    sources: []
  });
});

const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

export default app;
