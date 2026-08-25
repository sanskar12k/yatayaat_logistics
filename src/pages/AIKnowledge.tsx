import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CONTENT: Record<string, { title: string; sections: { h: string; p: string[] }[]; description: string }> = {
  "cost-reduction-strategies": {
    title: "Cost Reduction Strategies in Logistics",
    description: "Actionable ways to cut logistics costs: routes, fuel, consolidation, vendor terms.",
    sections: [
      { h: "Executive Summary", p: [
        "Reduce 15–35% by optimizing routes, improving fuel economy, consolidating loads, and renegotiating vendor terms.",
      ] },
      { h: "1) Route & Network Optimization", p: [
        "Use multi-stop routing, avoid empty miles, and build premium corridors for predictable flow.",
        "Leverage part-load consolidation and milk-runs for frequent, nearby shipments.",
      ] },
      { h: "2) Fuel & Vehicle Management", p: [
        "Driver coaching, idle time control, preventive maintenance, and tire management affect 10–20% of costs.",
      ] },
      { h: "3) Contracting & Vendor Terms", p: [
        "Benchmark rates lane-wise, include SLA-based incentives, and audit invoices/toll slips.",
      ] },
    ]
  },
  "warehouse-management": {
    title: "Warehouse Management Best Practices",
    description: "Layout, inventory accuracy, safety, and WMS-driven productivity.",
    sections: [
      { h: "Executive Summary", p: ["Design for fast movers, enforce bin discipline, and track KPIs: fill rate, picks/hr, accuracy."] },
      { h: "Layout & Flow", p: ["Golden zone for fast movers, one-way flow, staging near docks, 5S."] },
      { h: "Systems & Controls", p: ["Cycle counts, ABC analysis, ASN/GRN discipline, digital timestamps."] },
      { h: "Safety", p: ["Aisle width compliance, PPE, MHE training, signage, near-miss reporting."] },
    ]
  },
  "supply-chain-disruptions": {
    title: "Managing Supply Chain Disruptions",
    description: "Risk mapping, buffers, alternate lanes, and supplier diversification.",
    sections: [
      { h: "Playbook", p: ["Map critical SKUs and lanes, set safety stocks, define Tier-2 alternatives and emergency couriers."] },
      { h: "Monitoring", p: ["Track weather, strikes, and corridor closures. Pre-approve fallback routes."] },
    ]
  },
  "technology-trends": {
    title: "Technology Trends in Logistics",
    description: "AI, IoT, visibility platforms, and automation for Indian operations.",
    sections: [
      { h: "AI & Analytics", p: ["Forecasting, dynamic routing, anomaly detection, and fraud reduction."] },
      { h: "IoT & Telematics", p: ["Temperature, door sensors, fuel sensors with driver behavior scoring."] },
    ]
  },
  "international-shipping": {
    title: "International Shipping Essentials",
    description: "Docs, Incoterms, customs, and duty optimization.",
    sections: [
      { h: "Documents", p: ["Invoice, packing list, HSN, COO, insurance, and licenses."] },
      { h: "Incoterms", p: ["Choose terms matching buyer power and risk appetite; beware hidden costs."] },
    ]
  },
  "speed-optimization": {
    title: "Speed Optimization of Deliveries",
    description: "Network design, premium corridors, and SLA engineering.",
    sections: [
      { h: "Network Design", p: ["Hub-spoke vs. point-to-point, cross-docking, and priority handling lanes."] },
    ]
  },
  "full-packers-and-movers-guide": {
    title: "Full Packers & Movers Guide",
    description: "From survey to delivery: packing standards, insurance, and claims.",
    sections: [
      { h: "Checklist", p: ["Pre-move survey, packing bill of materials, labeling, high-value declaration, transit insurance."] },
      { h: "Claims Prevention", p: ["Protective packing, load plan, photos, and seal tracking."] },
    ]
  },
};

export default function AIKnowledge() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const data = CONTENT[slug];

  useEffect(() => {
    const title = data ? `${data.title} | Yatayaat Logistics` : 'AI Knowledge | Yatayaat Logistics';
    document.title = title;
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', data?.description || 'Expert logistics knowledge base.');
    document.head.appendChild(meta);
    const link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.href);
    document.head.appendChild(link);
  }, [data]);

  const content = useMemo(() => data, [data]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {!content ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="mb-4">Topic not found.</p>
              <Button onClick={() => navigate('/')}>Go Home</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{content.title}</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                <Button onClick={() => navigate('/ai-assistant')}>Open in AI Assistant</Button>
              </div>
            </div>
            {content.sections.map((s, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold">{s.h}</h2>
                  {s.p.map((p, j) => (
                    <p key={j} className="text-muted-foreground">{p}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
