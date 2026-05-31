export interface TotalAcquisitionCost {
  basePrice: number;
  parkingCharges: number;
  registrationCharges: number;
  maintenanceDeposit: number;
  otherCharges: number;
  total: number;
}

export interface LocationDetails {
  area: string;
  railwayStationDistance: number;
  metroStation: string;
  metroDistance: number;
  hospital: string;
  school: string;
  supermarket: string;
  majorRoad: string;
}

export interface SellerContact {
  type: string;
  name: string;
  phone: string;
  verified: boolean;
}

export interface RoadAccess {
  width: string;
  condition: string;
  monsoonSafety: string;
  limitations: string;
}

export interface VerificationChecklist {
  readyToMove: string;
  propertyAge: string;
  builderName: string;
  reraId: string;
  occupancyCertificate: string;
  completionCertificate: string;
  parking: string;
  waterSource: string;
  powerBackup: string;
  lift: string;
  security: string;
  maintenanceMonthly: number;
}

export interface BuilderReputation {
  background: string;
  completedProjectsLast5Years: string;
  constructionQualityRating: string;
  positiveFeedback: string;
  negativeFeedback: string;
  overallAssessment: string;
}

export interface NeighborhoodDetails {
  residentialQuality: string;
  trafficConditions: string;
  safety: string;
  cleanliness: string;
  appreciationPotential: string;
}

export interface FloodRiskAssessment {
  classification: "Low Risk" | "Moderate Risk" | "High Risk";
  historicalFlooding: string;
  waterloggingReports: string;
  drainageConditions: string;
  residentFeedback: string;
}

export interface PropertyScores {
  locationConnectivity: number;
  floodRisk: number;
  legalClarity: number;
  builderReputation: number;
  constructionQuality: number;
  appreciationPotential: number;
  waterAvailability: number;
  neighborhoodQuality: number;
  amenitiesMaintenance: number;
  priceMarketValue: number;
  totalScore: number;
}

export interface PropertyImages {
  exterior: string;
  livingRoom: string;
  kitchen: string;
  bedroom: string;
  amenities: string;
}

export interface Property {
  id: string;
  name: string;
  propertyType: string;
  builderName: string;
  sellerType: string;
  bhk: string;
  builtUpArea: number;
  propertyAge: string;
  price: number;
  pricePerSqFt: number;
  readyToMove: boolean;
  totalAcquisitionCost: TotalAcquisitionCost;
  location: LocationDetails;
  sellerContact: SellerContact;
  roadAccess: RoadAccess;
  checklist: VerificationChecklist;
  builderReputation: BuilderReputation;
  neighborhoodDetails: NeighborhoodDetails;
  floodRisk: FloodRiskAssessment;
  scores: PropertyScores;
  pros: string[];
  cons: string[];
  overallVerdict: string;
  images: PropertyImages;
  referenceLink: string;
}

export interface SearchFilters {
  bhk: string;
  maxBudget: number;
  area: string;
  floodRisk: string;
  sellerType: string;
  maxDistance: number;
}
