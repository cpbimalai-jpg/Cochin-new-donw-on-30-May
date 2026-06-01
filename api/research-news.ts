export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const { query } = req.body || {};
  if (!query) {
    res.status(400).json({ success: false, error: "Query is required" });
    return;
  }

  res.status(200).json({
    success: true,
    cached: true,
    text: `#### Real Estate Research Summary\n\nA deployment-safe research response was generated for: **"${query}"**.\n\n* **Builder and legal review**: Verify the builder's current K-RERA status, occupancy certificate, completion certificate, and active customer complaints before purchase.\n* **Flood and monsoon review**: Check local ward-level waterlogging reports, 2018 flood boundary proximity, road elevation, and drainage outflow before final negotiation.\n* **Site visit priority**: Inspect approach-road width, basement drainage, parking allocation, lift condition, water source, and monthly maintenance records.\n\nAdd a Gemini API key later if you want live Google-grounded research from this endpoint.`,
    sources: []
  });
}
