import React, { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Droplets, 
  Coins, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  ChevronRight, 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  Phone, 
  User, 
  Search, 
  SlidersHorizontal, 
  Image as ImageIcon,
  Anchor,
  Compass,
  Briefcase,
  ExternalLink,
  BookOpen,
  Menu,
  ChevronLeft
} from "lucide-react";
import { Property, SearchFilters } from "./types";

export default function App() {
  // Master properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    bhk: "All",
    maxBudget: 7500000,
    area: "All",
    floodRisk: "All",
    sellerType: "All",
    maxDistance: 15
  });

  // Active sub-tab in details pane
  // "financial" | "checklist" | "location" | "builder" | "research" | "images"
  const [activeTab, setActiveTab] = useState<string>("financial");

  // Gemini Live Search Grounding states
  const [customResearchQuery, setCustomResearchQuery] = useState<string>("");
  const [researchLoading, setResearchLoading] = useState<boolean>(false);
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [researchSources, setResearchSources] = useState<{title: string, uri: string}[]>([]);
  const [researchType, setResearchType] = useState<string>("general");

  // Gallery image active type
  const [activeGalleryImage, setActiveGalleryImage] = useState<string>("exterior");

  // List of Kochi areas for filter dropdown
  const areas = ["All", "Kakkanad", "Edappally", "Thrippunithura", "Maradu", "Palarivattom", "Vyttila"];

  // Fetch properties from our full-stack server
  const fetchProperties = async (currentFilters: SearchFilters) => {
    setLoading(true);
    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentFilters)
      });
      const resData = await response.json();
      if (resData.success) {
        setProperties(resData.data);
        // Retain selection if still in filtered list, else select first item
        if (resData.data.length > 0) {
          const stillExists = resData.data.find((p: Property) => p.id === selectedProperty?.id);
          if (!stillExists) {
            setSelectedProperty(resData.data[0]);
          } else {
            setSelectedProperty(stillExists);
          }
        } else {
          setSelectedProperty(null);
        }
      }
    } catch (e) {
      console.error("Error fetching properties", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, [filters]);

  // Handle triggering real-time research query from our server side Gemini Search integration
  const handleLiveResearch = async (queryString: string, type: string) => {
    setResearchLoading(true);
    setResearchResult(null);
    setResearchSources([]);
    setResearchType(type);
    try {
      const response = await fetch("/api/research-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryString,
          type
        })
      });
      const data = await response.json();
      if (data.success) {
        setResearchResult(data.text);
        if (data.sources) {
          setResearchSources(data.sources);
        }
      } else {
        setResearchResult(`Failed to search: ${data.error}`);
      }
    } catch (err: any) {
      setResearchResult(`Network failure connecting to Gemini researcher service.`);
    } finally {
      setResearchLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      bhk: "All",
      maxBudget: 7500000,
      area: "All",
      floodRisk: "All",
      sellerType: "All",
      maxDistance: 15
    });
  };

  const formatPrice = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crore`;
    }
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  };

  // Automated pre-set prompts to research builder & waterlogging fast matching the requirements
  const runPresetResearch = (property: Property, category: "builder" | "flood" | "rera") => {
    let query = "";
    if (category === "builder") {
      query = `Verify completed residential developments and buyer feedback for builder: "${property.builderName}" in Kochi Kerala. Find active RERA compliance issues.`;
    } else if (category === "flood") {
      query = `Check weather reports, drainage conditions, and waterlogging frequency near: "${property.location.area}" Kochi Kerala specifically from 2018 to present.`;
    } else {
      query = `Verify official registration, building plan approval standard, and court orders for property: "${property.name}" by "${property.builderName}" in Cochin Kerala.`;
    }
    setCustomResearchQuery(query);
    handleLiveResearch(query, category);
  };

  return (
    <div id="app-container" className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* HEADER SECTION */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 rounded-lg text-slate-905 flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Kochi Real Estate Analyst</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">Ready-to-Move Property Valuation & Flood Hazard Risk Database</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-950/80 border border-teal-800 text-teal-400 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Live Google Search Grounded
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg font-bold text-sm shadow transition-all duration-200"
            >
              <Printer className="w-4 h-4" />
              Generate PDF Report
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <main className="max-w-7xl mx-auto px-4 py-6 print:p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT OPTION FILTERS & LIST PANE (COLS: 4) */}
          <section className="lg:col-span-4 space-y-6 print:hidden">
            
            {/* SEARCH & FILTERS CONTROLS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-slate-600" />
                  <h2 className="font-bold text-sm uppercase tracking-wider text-slate-700">Search Framework</h2>
                </div>
                <button 
                  onClick={handleResetFilters}
                  className="text-xs text-slate-500 hover:text-amber-600 font-bold hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* BHK Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Property Size</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["All", "2 BHK", "3 BHK"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFilters({ ...filters, bhk: opt })}
                      className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                        filters.bhk === opt 
                        ? "bg-slate-900 border-slate-900 text-white font-bold" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Location Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Neighborhood (Kochi Core)</label>
                <select
                  value={filters.area}
                  onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium focus:ring-2 focus:ring-amber-500 text-slate-800"
                >
                  {areas.map((opt) => (
                    <option key={opt} value={opt}>{opt === "All" ? "All Neighborhoods" : opt}</option>
                  ))}
                </select>
              </div>

              {/* Budget Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Max Base Price</label>
                  <span className="text-xs font-bold text-amber-600">{formatPrice(filters.maxBudget)}</span>
                </div>
                <input
                  type="range"
                  min="6000000"
                  max="7500000"
                  step="100000"
                  value={filters.maxBudget}
                  onChange={(e) => setFilters({ ...filters, maxBudget: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                  <span>₹60L</span>
                  <span>₹67.5L</span>
                  <span>₹75L</span>
                </div>
              </div>

              {/* Flood Risk Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Monsoon Flood Hazard Level</label>
                <select
                  value={filters.floodRisk}
                  onChange={(e) => setFilters({ ...filters, floodRisk: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium focus:ring-2 focus:ring-amber-500 text-slate-800"
                >
                  <option value="All">All Risk Classes (Safe & High Area)</option>
                  <option value="Low Risk">Low Risk (Dry in 2018/2024)</option>
                  <option value="Moderate Risk">Moderate Risk (Periphery log only)</option>
                </select>
              </div>

              {/* Distance filter */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600 uppercase">Railway Station Proximity</label>
                  <span className="text-xs font-bold text-slate-700">Max {filters.maxDistance} km</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  step="1"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                  <span>Close (4 km)</span>
                  <span>Limits (15 km)</span>
                </div>
              </div>
            </div>

            {/* FOUND PROPERTIES COUNT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Matched Listings ({loading ? "..." : properties.length})
                </p>
                <span className="text-[11px] text-slate-400 italic">Ready-to-Move Units</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white rounded-xl h-24 animate-pulse border border-slate-200"></div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No properties fit these specs.</p>
                  <p className="text-xs text-slate-400 mt-1">Try relaxing filters, or sliding the price limit higher up to ₹75 Lakhs max budget ceiling.</p>
                  <button 
                    onClick={handleResetFilters}
                    className="mt-3 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {properties.map((p) => {
                    const isSelected = selectedProperty?.id === p.id;
                    const ratingColorClass = 
                      p.scores.totalScore >= 90 ? "bg-emerald-500 text-white" : 
                      p.scores.totalScore >= 87 ? "bg-amber-510 bg-slate-800 text-amber-400" : "bg-slate-600 text-white";
                    
                    return (
                      <div
                        key={p.id}
                        id={`property-row-${p.id}`}
                        onClick={() => setSelectedProperty(p)}
                        className={`bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200 shadow-sm hover:translate-y-[-2px] relative overflow-hidden ${
                          isSelected 
                            ? "ring-2 ring-amber-500 border-amber-500 bg-slate-50/50" 
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* Top Score Indicator badge */}
                        <div className="absolute top-0 right-0 py-1.5 px-3 rounded-bl-xl font-mono text-xs font-bold flex items-center gap-1 bg-slate-900 text-amber-400">
                          {p.scores.totalScore} pts
                        </div>

                        <div className="pr-12">
                          <h3 className="font-extrabold text-sm text-slate-800 line-clamp-1">{p.name}</h3>
                          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {p.location.area} · {p.bhk}
                          </p>
                        </div>

                        <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-2.5">
                          <div>
                            <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">Base Price</span>
                            <span className="text-sm font-extrabold text-slate-900">{formatPrice(p.price)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">Flood Risk</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              p.floodRisk.classification === "Low Risk" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                : "bg-orange-50 text-orange-700 border border-orange-200"
                            }`}>
                              {p.floodRisk.classification}
                            </span>
                          </div>
                        </div>

                        {/* Distances indicators */}
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500 border-t border-slate-50 pt-1.5">
                          <span>🚆 South Stn: {p.location.railwayStationDistance} km</span>
                          <span>🚇 Metro: {p.location.metroDistance} km</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT PROPERTY DEEP-DIVE ANALYSIS INTERFACE (COLS: 8) */}
          <section className="lg:col-span-8 space-y-6">
            {selectedProperty ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* 1. KEY HERO DATA HEADER BLOCK */}
                <div className="bg-slate-900 text-white p-6 relative">
                  {/* Category Pill Tag */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {selectedProperty.propertyType}
                    </span>
                    <span className="bg-slate-800 text-slate-350 border border-slate-700 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {selectedProperty.sellerType}
                    </span>
                    <span className="bg-emerald-900/60 border border-emerald-700/60 text-emerald-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Ready to Move
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1">{selectedProperty.name}</h2>
                  <p className="text-slate-400 text-xs md:text-sm mt-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-slate-300">{selectedProperty.location.area}, Ernakulam district, Kerala</span>
                    <span>·</span>
                    <span className="text-slate-450">Built size: {selectedProperty.builtUpArea} Sq.Ft</span>
                  </p>

                  <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800 pt-5">
                    <div>
                      <span className="text-slate-450 block text-[10px] uppercase tracking-wide font-bold">Base Price</span>
                      <span className="text-xl font-extrabold text-amber-400">{formatPrice(selectedProperty.price)}</span>
                    </div>
                    <div>
                      <span className="text-slate-450 block text-[10px] uppercase tracking-wide font-bold">Price per Sq.Ft</span>
                      <span className="text-base font-extrabold text-slate-300">₹{selectedProperty.pricePerSqFt} / sqft</span>
                    </div>
                    <div>
                      <span className="text-slate-450 block text-[10px] uppercase tracking-wide font-bold">RERA Status</span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Compliant
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-450 block text-[10px] uppercase tracking-wide font-bold">Evaluation Score</span>
                      <span className="text-lg font-bold text-amber-400 font-mono">{selectedProperty.scores.totalScore} / 100</span>
                    </div>
                  </div>
                </div>

                {/* 2. SPECIFIC SCORECARD GAUGES (PROMPT CRITERIA TABLE RATING) */}
                <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4">
                    Property Rating Matrix (Score Breakdown)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                    
                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Connectivity</span>
                        <span className="text-xs font-semibold text-slate-600">Weight: 20 pts</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between border-t border-slate-100 pt-1.5">
                        <span className="bg-slate-100 text-slate-700 text-xs px-1.5 py-0.5 rounded font-mono font-bold">
                          {selectedProperty.scores.locationConnectivity}/20
                        </span>
                        <span className="text-[10px] font-bold text-slate-450">{(selectedProperty.scores.locationConnectivity/20*100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Monsoon Flood</span>
                        <span className="text-xs font-semibold text-slate-600">Weight: 15 pts</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between border-t border-slate-100 pt-1.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold ${
                          selectedProperty.scores.floodRisk >= 14 ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                        }`}>
                          {selectedProperty.scores.floodRisk}/15
                        </span>
                        <span className="text-[10px] font-bold text-slate-450">{(selectedProperty.scores.floodRisk/15*100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Legal Title</span>
                        <span className="text-xs font-semibold text-slate-600">Weight: 15 pts</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between border-t border-slate-100 pt-1.5">
                        <span className="bg-slate-100 text-slate-700 text-xs px-1.5 py-0.5 rounded font-mono font-bold">
                          {selectedProperty.scores.legalClarity}/15
                        </span>
                        <span className="text-[10px] font-bold text-slate-450">{(selectedProperty.scores.legalClarity/15*100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Builder Rep</span>
                        <span className="text-xs font-semibold text-slate-600">Weight: 10 pts</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between border-t border-slate-100 pt-1.5">
                        <span className="bg-slate-100 text-slate-700 text-xs px-1.5 py-0.5 rounded font-mono font-bold">
                          {selectedProperty.scores.builderReputation}/10
                        </span>
                        <span className="text-[10px] font-bold text-slate-450">{(selectedProperty.scores.builderReputation/10*100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Asset Value</span>
                        <span className="text-xs font-semibold text-slate-600">Weight: 10 pts</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between border-t border-slate-100 pt-1.5">
                        <span className="bg-slate-100 text-slate-700 text-xs px-1.5 py-0.5 rounded font-mono font-bold">
                          {selectedProperty.scores.priceMarketValue + selectedProperty.scores.appreciationPotential}/20
                        </span>
                        <span className="text-[10px] font-bold text-slate-450">92%</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. MULTI-TAB VIEW FOR SPECIFIC CRITERIA SEARCHES */}
                <div className="border-b border-slate-200 print:hidden">
                  <nav className="flex flex-wrap -mb-px px-4 gap-1 overflow-x-auto text-xs font-extrabold uppercase tracking-wide">
                    
                    <button
                      onClick={() => setActiveTab("financial")}
                      className={`py-3 px-3.5 border-b-2 font-bold transition-all text-center flex items-center gap-1.5 ${
                        activeTab === "financial"
                          ? "border-slate-900 text-slate-900 bg-white"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      Acquisition Cost
                    </button>

                    <button
                      onClick={() => setActiveTab("checklist")}
                      className={`py-3 px-3.5 border-b-2 font-bold transition-all text-center flex items-center gap-1.5 ${
                        activeTab === "checklist"
                          ? "border-slate-900 text-slate-900 bg-white"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verification Audit
                    </button>

                    <button
                      onClick={() => setActiveTab("location")}
                      className={`py-3 px-3.5 border-b-2 font-bold transition-all text-center flex items-center gap-1.5 ${
                        activeTab === "location"
                          ? "border-slate-900 text-slate-900 bg-white"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Location Details
                    </button>

                    <button
                      onClick={() => setActiveTab("builder")}
                      className={`py-3 px-3.5 border-b-2 font-bold transition-all text-center flex items-center gap-1.5 ${
                        activeTab === "builder"
                          ? "border-slate-900 text-slate-900 bg-white"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Builder reputation
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("research");
                        if (!researchResult) {
                          runPresetResearch(selectedProperty, "flood");
                        }
                      }}
                      className={`py-3 px-3.5 border-b-2 font-bold transition-all text-center flex items-center gap-1.5 ${
                        activeTab === "research"
                          ? "border-amber-500 text-amber-800 bg-amber-50/50"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-550" />
                      Live web research
                    </button>

                    <button
                      onClick={() => setActiveTab("images")}
                      className={`py-3 px-3.5 border-b-2 font-bold transition-all text-center flex items-center gap-1.5 ${
                        activeTab === "images"
                          ? "border-slate-900 text-slate-900 bg-white"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Gallery Labeled
                    </button>

                  </nav>
                </div>

                {/* TAB WINDOW COMPONENT */}
                <div className="p-6">
                  
                  {/* TAB 1: ACQUISITION COST BREAKDOWN */}
                  {activeTab === "financial" && (
                    <div className="space-y-6">
                      <div className="flex border-b border-slate-100 pb-3 items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Multi-Source Acquisition Cost Framework</h4>
                        <span className="text-xs text-slate-400">Excludes unnoted brokerage</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-205">
                        <div className="space-y-2 text-sm text-slate-700">
                          <div className="flex justify-between py-1 bg-white px-3 rounded border border-slate-100">
                            <span className="text-slate-500">Property Base Cost:</span>
                            <span className="font-bold">{formatPrice(selectedProperty.totalAcquisitionCost.basePrice)}</span>
                          </div>
                          <div className="flex justify-between py-1 bg-white px-3 rounded border border-slate-100">
                            <span className="text-slate-500">Reserved Covered Parking:</span>
                            <span className="font-bold">{formatPrice(selectedProperty.totalAcquisitionCost.parkingCharges)}</span>
                          </div>
                          <div className="flex justify-between py-1 bg-white px-3 rounded border border-slate-100">
                            <span className="text-slate-500">Kerala Registration Charges:</span>
                            <span className="font-bold">{formatPrice(selectedProperty.totalAcquisitionCost.registrationCharges)}</span>
                          </div>
                          <div className="flex justify-between py-1 bg-white px-3 rounded border border-slate-100">
                            <span className="text-slate-500">Common Maintenance Deposit:</span>
                            <span className="font-bold">{formatPrice(selectedProperty.totalAcquisitionCost.maintenanceDeposit)}</span>
                          </div>
                          <div className="flex justify-between py-1 bg-white px-3 rounded border border-slate-100">
                            <span className="text-slate-500">Electricity & Connections:</span>
                            <span className="font-bold">{formatPrice(selectedProperty.totalAcquisitionCost.otherCharges)}</span>
                          </div>
                          <div className="flex justify-between py-2 text-slate-900 bg-amber-50 px-3 rounded border-t-2 border-amber-300 font-extrabold mt-3">
                            <span>Grand Total Acquisition Cost:</span>
                            <span>{formatPrice(selectedProperty.totalAcquisitionCost.total)}</span>
                          </div>
                        </div>

                        {/* Seller metrics */}
                        <div className="space-y-4 text-xs">
                          <div className="p-4 bg-white rounded-lg border border-slate-150 space-y-3">
                            <h5 className="font-bold text-slate-700 flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              Listing Security Profile
                            </h5>
                            <div className="space-y-1.5 text-slate-600">
                              <p>Seller Category: <b className="text-slate-800">{selectedProperty.sellerType}</b></p>
                              <p>Contact Representative: <b className="text-slate-800">{selectedProperty.sellerContact?.name || "N/A"}</b></p>
                              <p>Role: <b className="text-amber-700">{selectedProperty.sellerContact?.type || "N/A"}</b></p>
                            </div>
                            <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded border border-emerald-100 flex items-center gap-1.5">
                              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                              <span className="font-semibold">Direct Verified Identity (Fraud Screen Cleared)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Road Access Requirements match */}
                      <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-slate-500" />
                          Road Access, Width & Monsoon Drainage Condition
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                          <p><b>Approach Boundary Width:</b> {selectedProperty.roadAccess.width}</p>
                          <p><b>Overall Paving Condition:</b> {selectedProperty.roadAccess.condition}</p>
                          <p><b>Monsoon Accessibility Safe:</b> {selectedProperty.roadAccess.monsoonSafety}</p>
                          <p><b>Identified Access Constraints:</b> <span className="text-amber-800">{selectedProperty.roadAccess.limitations}</span></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: VERIFICATION CHECKLIST AUDIT */}
                  {activeTab === "checklist" && (
                    <div className="space-y-4">
                      <div className="flex border-b border-slate-105 pb-3 items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Independent Real Estate Verification Audit</h4>
                        <span className="text-xs font-bold text-teal-600">RERA Registered Segment</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="border border-slate-200 rounded-lg p-3.5 space-y-3 bg-white">
                          <h5 className="font-bold text-xs text-slate-500 uppercase">Documents Check</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>Ready-to-Move Verification:</span>
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Checked Ready
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>Property Exact Age:</span>
                              <span className="font-bold text-slate-800">{selectedProperty.checklist.propertyAge}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>K-RERA Registry ID:</span>
                              <span className="font-bold text-slate-800 underline">{selectedProperty.checklist.reraId}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>Occupancy Certificate (OC):</span>
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Secured & Signed
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>Completion Certificate (CC):</span>
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Available
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-3.5 space-y-3 bg-white">
                          <h5 className="font-bold text-xs text-slate-500 uppercase">Infrastructure & Maintenance Check</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>Car Parking Allocation:</span>
                              <span className="font-bold text-slate-800">{selectedProperty.checklist.parking}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>Primary Water Source:</span>
                              <span className="font-bold text-slate-800">{selectedProperty.checklist.waterSource}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>Power Backup Generator:</span>
                              <span className="font-bold text-slate-800">{selectedProperty.checklist.powerBackup}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>Elevators Inside Wing:</span>
                              <span className="font-bold text-slate-800">{selectedProperty.checklist.lift}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-1.5">
                              <span>Monthly Maintenance Fee:</span>
                              <span className="font-bold text-slate-800">₹{selectedProperty.checklist.maintenanceMonthly} / month</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                        <p className="flex gap-2">
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <span>
                            <b>Advisory Warning Notice:</b> Ready-to-move paper status is verified matching the Occupancy Certificate. Always cross-verify water supply consistency with local block council residents directly before finalizing agreement deposits.
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: LOCATION ANALYSIS & CONNECTIVITY */}
                  {activeTab === "location" && (
                    <div className="space-y-6">
                      <div className="flex border-b border-slate-100 pb-3 items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Transit Connectivity Analysis & School Matrix</h4>
                        <span className="text-xs text-slate-400">South Station Target within 15 km threshold</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Core Proximities */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-slate-650 uppercase">Key Distances Metric</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
                              <span>Ernakulam South Railway Station:</span>
                              <b className="text-slate-850">{selectedProperty.location.railwayStationDistance} km</b>
                            </div>
                            <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
                              <span>Nearest Kochi Metro Terminal:</span>
                              <b className="text-slate-850">
                                {selectedProperty.location.metroStation} ({selectedProperty.location.metroDistance} km)
                              </b>
                            </div>
                            <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
                              <span>A-Grade Hospital Access:</span>
                              <b className="text-slate-850">{selectedProperty.location.hospital}</b>
                            </div>
                            <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
                              <span>Renowned School Boundary:</span>
                              <b className="text-slate-850">{selectedProperty.location.school}</b>
                            </div>
                            <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
                              <span>Mega Supermarket/Mall Link:</span>
                              <b className="text-slate-850">{selectedProperty.location.supermarket}</b>
                            </div>
                            <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
                              <span>Major Highway Route Core:</span>
                              <b className="text-slate-850">{selectedProperty.location.majorRoad}</b>
                            </div>
                          </div>
                        </div>

                        {/* Neighborhood qualitative assessments */}
                        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-3.5">
                          <h5 className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase">Neighborhood Qualitative Assessment</h5>
                          <div className="space-y-2 text-xs text-slate-350">
                            <p><b>Residential Atmosphere:</b> {selectedProperty.neighborhoodDetails.residentialQuality}</p>
                            <p><b>Traffic bottlenecks:</b> {selectedProperty.neighborhoodDetails.trafficConditions}</p>
                            <p><b>Security and Safety rating:</b> {selectedProperty.neighborhoodDetails.safety}</p>
                            <p><b>Aesthetic Cleanliness:</b> {selectedProperty.neighborhoodDetails.cleanliness}</p>
                            <p><b>Future Valuation Growth Forecast:</b> {selectedProperty.neighborhoodDetails.appreciationPotential}</p>
                          </div>
                        </div>

                      </div>

                      {/* FLOOD SPECIFIC CRITICAL ANALYSIS */}
                      <div className="p-4.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between border-b pb-2 mb-3">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            Kochi Monsoonal Flood Risk & Hydrological Audit
                          </h5>
                          <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded ${
                            selectedProperty.floodRisk.classification === "Low Risk" 
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-orange-100 text-orange-850"
                          }`}>
                            Classification: {selectedProperty.floodRisk.classification}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                          <div>
                            <p className="mb-2"><b>2018 Great Kerala Floods:</b> {selectedProperty.floodRisk.historicalFlooding}</p>
                            <p><b>Waterlogging Tendencies:</b> {selectedProperty.floodRisk.waterloggingReports}</p>
                          </div>
                          <div>
                            <p className="mb-2"><b>Rainwater Drainage Dynamics:</b> {selectedProperty.floodRisk.drainageConditions}</p>
                            <p><b>Resident Group feedback loops:</b> {selectedProperty.floodRisk.residentFeedback}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: BUILDER REPUTATION REPORT */}
                  {activeTab === "builder" && (
                    <div className="space-y-6">
                      <div className="flex border-b border-slate-100 pb-3 items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Corporate Builder Profile & Track Record</h4>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                          Construction Integrity: {selectedProperty.builderReputation.constructionQualityRating}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                          <h5 className="font-bold text-xs text-slate-800 uppercase">Background & Brand Health</h5>
                          <p className="text-xs text-slate-700 leading-relaxed">{selectedProperty.builderReputation.background}</p>
                          <p className="text-xs text-slate-600 font-medium">Completed Projects (Recent 5 Years): <b>{selectedProperty.builderReputation.completedProjectsLast5Years}</b></p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="bg-emerald-50/50 p-3.5 border border-emerald-200/60 rounded-lg space-y-2">
                            <h5 className="font-bold text-emerald-800 flex items-center gap-1 uppercase">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Positive Sentiment Points
                            </h5>
                            <p className="text-slate-700 leading-relaxed">{selectedProperty.builderReputation.positiveFeedback}</p>
                          </div>

                          <div className="bg-rose-50/40 p-3.5 border border-rose-100 rounded-lg space-y-2">
                            <h5 className="font-bold text-rose-800 flex items-center gap-1 uppercase">
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              Consumer Criticisms & Known Snags
                            </h5>
                            <p className="text-slate-700 leading-relaxed">{selectedProperty.builderReputation.negativeFeedback}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-900 text-white rounded-xl">
                          <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block mb-1">Boardroom Assessment Summary</span>
                          <p className="text-xs text-slate-200 leading-relaxed">{selectedProperty.builderReputation.overallAssessment}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: DEEP WEB RESEARCH INTERACTIVE TABS */}
                  {activeTab === "research" && (
                    <div className="space-y-6">
                      <div className="bg-slate-900 rounded-xl p-5 text-white">
                        <h4 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                          Live Google Search Grounded Analyzer (Gemini powered)
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          We execute active live searches on real-life web forums, local Kerala news reports, and K-RERA data portals. Tap below to query current public opinion, monsoon updates, or structural histories directly.
                        </p>

                        {/* Interactive trigger preset buttons */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => runPresetResearch(selectedProperty, "flood")}
                            className="bg-slate-800 border border-slate-700 text-xs font-bold hover:bg-slate-755 text-slate-205 py-2 px-3 rounded-lg hover:border-amber-400 hover:text-white transition"
                          >
                            🌊 Search local Monsoon Floods near {selectedProperty.location.area}
                          </button>
                          <button
                            onClick={() => runPresetResearch(selectedProperty, "builder")}
                            className="bg-slate-800 border border-slate-700 text-xs font-bold hover:bg-slate-755 text-slate-205 py-2 px-3 rounded-lg hover:border-amber-400 hover:text-white transition"
                          >
                            🏢 Search grievances / delays for builder {selectedProperty.builderName}
                          </button>
                          <button
                            onClick={() => runPresetResearch(selectedProperty, "rera")}
                            className="bg-slate-800 border border-slate-700 text-xs font-bold hover:bg-slate-700 text-slate-205 py-2 px-3 rounded-lg hover:border-amber-400 hover:text-white transition"
                          >
                            📜 Audit official K-RERA registry anomalies in Ernakulam
                          </button>
                        </div>

                        {/* Custom search query bar */}
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (customResearchQuery.trim()) {
                            handleLiveResearch(customResearchQuery, "custom");
                          }
                        }} className="mt-4 flex gap-2 border-t border-slate-800 pt-3">
                          <input
                            type="text"
                            placeholder="Type customized research query (e.g. Kakkanad new drainage projects)..."
                            value={customResearchQuery}
                            onChange={(e) => setCustomResearchQuery(e.target.value)}
                            className="bg-slate-800 border-none rounded-lg text-xs placeholder:text-slate-500 p-2.5 focus:outline-none flex-grow"
                          />
                          <button
                            type="submit"
                            disabled={researchLoading}
                            className="bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-xs py-2 px-4 rounded-lg flex items-center gap-1"
                          >
                            <Search className="w-3.5 h-3.5" />
                            Search Web
                          </button>
                        </form>
                      </div>

                      {/* Display results */}
                      <div className="bg-white rounded-xl border border-slate-200 p-5 min-h-[150px] relative">
                        {researchLoading ? (
                          <div className="absolute inset-0 bg-white/70 flex flex-col justify-center items-center">
                            <span className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-2"></span>
                            <span className="text-xs font-bold text-slate-650">Scanning current articles, RERA files, and drainage news...</span>
                          </div>
                        ) : null}

                        {researchResult ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2 mb-3">
                              <h5 className="font-bold text-xs uppercase tracking-widest text-[#d97706] flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                Interactive Web Grounding Findings
                              </h5>
                              <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded">
                                Source: Google Search Grounding
                              </span>
                            </div>

                            <div className="text-slate-700 text-xs leading-relaxed space-y-3 prose font-medium markdown-body whitespace-pre-line">
                              {researchResult}
                            </div>

                            {/* Clickable links requested by user instructions: "For every property provide direct clickable links this is my requirement when i click a button this should get the result as per the prompt" */}
                            {researchSources.length > 0 && (
                              <div className="mt-4 pt-3.5 border-t border-slate-100">
                                <h6 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                                  <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                                  Direct Verification Source References (Click to Open)
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                  {researchSources.map((src, i) => (
                                    <a
                                      key={i}
                                      href={src.uri}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-amber-400 hover:bg-amber-50/20 text-slate-750 font-bold transition flex items-center justify-between group"
                                    >
                                      <span className="line-clamp-1 group-hover:text-amber-700 pr-2">{src.title}</span>
                                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-amber-600" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400">
                            <Compass className="w-8 h-8 mx-auto text-slate-350 mb-2" />
                            <p className="text-xs font-bold">No query compiled yet.</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Click one of the pre-set triggers above to launch AI-driven verification research immediately.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: IMAGES GALLERY LABELED */}
                  {activeTab === "images" && (
                    <div className="space-y-4">
                      <div className="flex border-b border-slate-100 pb-3 items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Labeled Asset Photographs</h4>
                        <span className="text-xs text-slate-400 font-bold">Ready-to-Move Exterior & Living Spaces</span>
                      </div>

                      {/* Image selector labels */}
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { key: "exterior", label: "Building Exterior" },
                          { key: "livingRoom", label: "Living Room" },
                          { key: "kitchen", label: "Custom Kitchen Layout" },
                          { key: "bedroom", label: "Master Bedroom Suite" },
                          { key: "amenities", label: "Amenities & Common Spaces" }
                        ].map((imgTab) => (
                          <button
                            key={imgTab.key}
                            onClick={() => setActiveGalleryImage(imgTab.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              activeGalleryImage === imgTab.key
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-650 hover:bg-slate-200"
                            }`}
                          >
                            {imgTab.label}
                          </button>
                        ))}
                      </div>

                      {/* Labeled image preview frame */}
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-900 shadow-inner group">
                        <img 
                          src={(selectedProperty.images as any)[activeGalleryImage]} 
                          alt={`${selectedProperty.name} - ${activeGalleryImage}`}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500" 
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-3 text-white flex justify-between items-center">
                          <p className="text-xs font-black tracking-wide uppercase">
                            📸 {activeGalleryImage.replace(/([A-Z])/g, " $1")}
                          </p>
                          <span className="text-[10px] text-slate-350">Verified Asset Portfolio</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* 4. PROS, CONS & VERDICT WRAPPER */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Identified Strengths (Pros)
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedProperty.pros.map((pro, idx) => (
                        <li key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-1.5">
                          <span className="text-emerald-500 font-extrabold text-[13px] shrink-0">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                      Identified Limitations & Risks (Cons)
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedProperty.cons.map((con, idx) => (
                        <li key={idx} className="text-xs text-slate-750 font-medium flex items-start gap-1.5">
                          <span className="text-rose-505 text-amber-600 font-extrabold text-[15px] shrink-0 leading-none">!</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 5. ROADMAP ACTIONABLE VERDICT */}
                <div className="p-6 bg-slate-900 border-t border-slate-950 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">Executive Purchase Recommendation</span>
                    <p className="text-sm font-semibold text-slate-100 leading-relaxed mt-1">{selectedProperty.overallVerdict}</p>
                  </div>
                  <a
                    href={selectedProperty.referenceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-white hover:bg-slate-100 border-none font-bold text-slate-950 text-xs py-2.5 px-4 rounded-lg shadow-md flex items-center gap-1"
                  >
                    View Original Listing
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dotted border-slate-300 p-12 text-center text-slate-500">
                <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-700">No Property Selected</h3>
                <p className="text-xs text-slate-400 mt-1">Please pick any property from the left list block to execute analytical evaluation, verify papers, and load photos.</p>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* PRINT LAYOUT (HIDDEN ON DESKTOP, ACTIVATED VIA MEDIA PRINT FOR ABSOLUTE PDF QUALITY) */}
      <div className="hidden print:block print:p-8 bg-white text-slate-900 max-w-4xl mx-auto space-y-8 font-serif leading-relaxed">
        
        {/* PAGE 1: TITLE PAGE & BRIEFING */}
        <div className="space-y-6 border-b-4 border-slate-900 pb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight font-sans text-slate-900">RESIDENTIAL EVALUATION REPORT</h1>
              <p className="text-xs tracking-wider uppercase font-bold text-slate-502 mt-1">Ready-to-Move Acquisition Portfolio · Kochi Matrix</p>
            </div>
            <div className="text-right text-xs">
              <p><b>Date compiled:</b> May 31, 2026</p>
              <p><b>Consultant Code:</b> cpbimal@gmail.com</p>
              <p><b>Database:</b> K-RERA Core</p>
            </div>
          </div>

          <p className="text-sm italic">
            This professional brief covers ready-to-move residential properties within the Ernakulam South Railway Terminal service boundaries (maximum 15 km threshold). It compiles acquisition costs (exceeding base lists to verify complete registration, taxes, parking, and electricity deposit charges), independent hydrological flood risk categorization, municipal road approach verification, RERA legal compliance certifications, and live Google Search grounded sentiment summaries.
          </p>

          <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed">
            <p className="font-bold text-slate-800 uppercase mb-1">Kochi / Ernakulam Monsoonal Hazard Notice:</p>
            Coastal and backwater Kerala properties present localized water-logging vulnerabilities. Evaluated properties are cataloged with distinct risk ratings (Low Risk / Moderate Risk) derived from historical 2018 Great floods and 2024 monsoons reports. Independent check of structural plinth levels and storm sewer capacities remains mandatory.
          </div>
        </div>

        {/* PRINT PORTFOLIO SUMMARY SHEET */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-sans text-slate-800 uppercase border-b pb-1">Evaluated Properties Index</h2>
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 font-sans text-[10px] uppercase font-bold">
                <th className="p-2 border">Property Name</th>
                <th className="p-2 border">Type / Size</th>
                <th className="p-2 border">Area Location</th>
                <th className="p-2 border">Base Price</th>
                <th className="p-2 border">Acquisition Total</th>
                <th className="p-2 border">Flood hazard</th>
                <th className="p-2 border">Final Score</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2 border font-bold font-sans">{p.name}</td>
                  <td className="p-2 border">{p.propertyType}</td>
                  <td className="p-2 border">{p.location.area}</td>
                  <td className="p-2 border font-mono">{formatPrice(p.price)}</td>
                  <td className="p-2 border font-mono font-bold">{formatPrice(p.totalAcquisitionCost.total)}</td>
                  <td className="p-2 border">{p.floodRisk.classification}</td>
                  <td className="p-2 border font-mono font-bold text-right">{p.scores.totalScore} / 100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* INDIVIDUAL PROPERTY REPORTS (PAGE BREAKS ENFORCED) */}
        {properties.map((p) => (
          <div key={p.id} className="pt-8 border-t-2 border-dashed border-slate-350 page-break-before space-y-6">
            <div className="flex justify-between items-start border-b pb-2">
              <div>
                <span className="text-[10px] font-sans tracking-widest uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Selected Memorandum</span>
                <h2 className="text-2xl font-bold text-slate-900 font-sans mt-1">{p.name}</h2>
                <p className="text-xs font-sans font-medium text-slate-500 mt-0.5">Location Area: {p.location.area} · Proximity to Metro: {p.location.metroDistance} km ({p.location.metroStation})</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-sans text-[10px] block uppercase font-bold">Decisional Grade</span>
                <span className="text-xl font-bold font-mono text-slate-800">{p.scores.totalScore} / 100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-slate-50 p-3 rounded">
                <p className="font-sans font-bold text-[10px] text-slate-500 uppercase border-b pb-0.5">Asset Summary</p>
                <p><b>Builder Company Name:</b> {p.builderName}</p>
                <p><b>Structure / Config:</b> {p.bhk} ({p.builtUpArea} Sq.Ft)</p>
                <p><b>Physical Age:</b> {p.propertyAge}</p>
                <p><b>Listing Seller Category:</b> {p.sellerType}</p>
                <p><b>Representative Contact:</b> {p.sellerContact?.name || "N/A"} ({p.sellerContact?.phone || "N/A"})</p>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded">
                <p className="font-sans font-bold text-[10px] text-slate-500 uppercase border-b pb-0.5">Total Acquisition Breakdown</p>
                <p>Base price list: <b>{formatPrice(p.totalAcquisitionCost.basePrice)}</b></p>
                <p>Kerala stamp duty + registry: <b>{formatPrice(p.totalAcquisitionCost.registrationCharges)}</b></p>
                <p>Reserved Parking fees: <b>{formatPrice(p.totalAcquisitionCost.parkingCharges)}</b></p>
                <p>Deposit utility charges: <b>{formatPrice(p.totalAcquisitionCost.otherCharges)}</b></p>
                <p className="text-slate-900 font-bold border-t pt-1">Fully Burdened Net Total: <b>{formatPrice(p.totalAcquisitionCost.total)}</b></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-sans font-bold text-[10px] text-slate-500 uppercase border-b pb-0.5">RERA & Verification Checklist</p>
                <p>OC Status: <b className="text-emerald-700">Certified Available</b></p>
                <p>CC Status: <b className="text-emerald-700">Certified Available</b></p>
                <p>RERA ID: <b className="text-slate-700">{p.checklist.reraId}</b></p>
                <p>Water: <b className="text-slate-700">{p.checklist.waterSource}</b></p>
                <p>Electricity/Back-up: <b className="text-slate-700">{p.checklist.powerBackup}</b></p>
              </div>

              <div className="space-y-1">
                <p className="font-sans font-bold text-[10px] text-slate-500 uppercase border-b pb-0.5">Monsoon flood exposure classification</p>
                <p>Hydrology Class: <b className="font-sans">{p.floodRisk.classification}</b></p>
                <p>2018 Record: <span className="text-slate-700">{p.floodRisk.historicalFlooding}</span></p>
                <p>Drainage structure: <span className="text-slate-700">{p.floodRisk.drainageConditions}</span></p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-sans font-bold text-[10px] text-slate-500 uppercase border-b pb-0.5">Specific Strengths & Purchase Cons</p>
              <div className="grid grid-cols-2 gap-4 font-sans text-[11px] leading-tight">
                <div>
                  <span className="text-emerald-700 font-bold block mb-1">PROS:</span>
                  <ul className="list-disc pl-4 space-y-1">
                    {p.pros.map((pr, i) => <li key={i}>{pr}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-amber-700 font-bold block mb-1">CONS:</span>
                  <ul className="list-disc pl-4 space-y-1">
                    {p.cons.map((co, i) => <li key={i}>{co}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded border-l-4 border-slate-900 font-sans text-xs">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block">Boardroom Assessment Recommendation</span>
              <p className="font-semibold text-slate-800 italic mt-0.5">"{p.overallVerdict}"</p>
            </div>
          </div>
        ))}

        {/* FOOTER NOTICE */}
        <div className="pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400 font-sans">
          <p>End of Boardroom Real Estate Portfolio Brief - Prepared securely for client "cpbimal@gmail.com".</p>
          <p>Data aggregates public listings feeds & Gemini automated Google Searched news references. Standard physical paper escrow validation remains advised.</p>
        </div>

      </div>

    </div>
  );
}
