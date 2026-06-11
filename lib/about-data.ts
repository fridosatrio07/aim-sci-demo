export type AboutIconKey =
  | "Building2"
  | "ShieldCheck"
  | "Globe2"
  | "Award"
  | "Users"
  | "Settings"
  | "BarChart3"
  | "Search"
  | "RefreshCcw"
  | "FileCheck2"
  | "Leaf"
  | "MapPin"
  | "Phone"
  | "Mail"
  | "ExternalLink";

export interface AboutMetric {
  id: string;
  icon: AboutIconKey;
  value: string;
  label: string;
}

export interface AboutPanel {
  id: string;
  title: string;
  icon: AboutIconKey;
  body: string;
  items?: string[];
  visible: boolean;
}

export interface AboutHeroConfig {
  title: string;
  subtitle: string;
  description: string;
  heroImageUrl: string;
}

export interface AboutBrochureConfig {
  brochurePdfUrl: string;
}

export interface AboutPageConfig {
  hero: AboutHeroConfig;
  metrics: AboutMetric[];
  panels: AboutPanel[];
  brochure: AboutBrochureConfig;
}

export interface AboutContactConfig {
  officeLabel: string;
  officeName: string;
  address: string;
  phoneNumbers: string[];
  email: string;
  website: string;
  contactPerson?: string;
  branchCity?: string;
  notes?: string;
}

export const DEFAULT_ABOUT_PAGE_CONFIG: AboutPageConfig = {
  hero: {
    title: "About SUCOFINDO",
    subtitle: "SBU Aset dan Energi Baru Terbarukan\n(Asset & Renewable Energy)",
    description:
      "SUCOFINDO - SBU Aset dan Energi Baru Terbarukan (Asset & Renewable Energy) provides independent inspection, testing, certification, and asset integrity services for the Oil & Gas, Geothermal, and Energy industries in Indonesia and globally.",
    heroImageUrl: ""
  },
  metrics: [
    { id: "experience", icon: "Users", value: "50+", label: "Years of Experience" },
    { id: "assurance", icon: "ShieldCheck", value: "Independent", label: "Assurance" },
    { id: "global", icon: "Globe2", value: "Serving Indonesia", label: "& Global Clients" },
    { id: "accredited", icon: "Award", value: "Accredited", label: "& Internationally Recognized" }
  ],
  panels: [
    {
      id: "sbu-profile",
      title: "SBU Aset dan Energi Baru Terbarukan Profile",
      icon: "Building2",
      body:
        "We are a strategic business unit of SUCOFINDO focused on Asset Integrity and Energy Assurance. With a team of experienced professionals and advanced technology, we deliver value-driven solutions to help clients enhance asset reliability, optimize performance, and ensure compliance.",
      visible: true
    },
    {
      id: "tic-scope",
      title: "TIC Service Scope",
      icon: "ShieldCheck",
      body:
        "Comprehensive Testing, Inspection and Certification services across industries. Ensuring conformity, safety, regulatory compliance and operational excellence.",
      items: ["Inspection", "Testing", "Certification", "Verification"],
      visible: true
    },
    {
      id: "aim-service",
      title: "Asset Integrity Management Service",
      icon: "Settings",
      body:
        "End-to-end Asset Integrity Management solutions to help organizations manage risk, maintain integrity and extend asset life cycle through people, processes, advanced technology and data-driven decisions.",
      visible: true
    },
    {
      id: "rbi-overview",
      title: "Risk-Based Inspection Methodology Overview",
      icon: "BarChart3",
      body:
        "We implement Risk-Based Inspection (RBI) methodologies such as API 580/581 to prioritize inspection activities based on risk, optimize inspection intervals and resource allocation, and improve safety and reliability.",
      visible: true
    },
    {
      id: "ndt-capability",
      title: "Inspection and NDT Capability",
      icon: "Search",
      body:
        "Wide range of conventional and advanced inspection & NDT capabilities performed by certified personnel using state-of-the-art equipment and proven procedures.",
      items: [
        "Conventional NDT: Visual, PT, MT, UT, RT",
        "Thickness Measurement",
        "Advanced NDT: Phased Array UT, TOFD, LRUT",
        "MFL, IRIS, PEC, ECT",
        "Digital Radiography (CR/DR)",
        "Robotic Inspection & ROV"
      ],
      visible: true
    },
    {
      id: "rla-reengineering",
      title: "RLA / Reengineering Capability",
      icon: "RefreshCcw",
      body:
        "RLA (Remaining Life Assessment) and Reengineering services to evaluate fitness-for-service, extend asset life, improve reliability and support plant modification with sound engineering and analysis.",
      items: [
        "Fitness-for-Service Assessment",
        "Life Extension & Rejuvenation",
        "Engineering & Design Review",
        "Technical Due Diligence"
      ],
      visible: true
    },
    {
      id: "plo-plf",
      title: "PLO/PLF and Certification Support",
      icon: "FileCheck2",
      body:
        "We support clients in meeting PLO (Pressure Leading Organization) and PLF (Pressure Leading Function) requirements and other statutory certifications.",
      items: ["PLO & PLF Consulting", "Statutory Inspection Support", "Certification & Verification", "Regulatory Compliance Support"],
      visible: true
    },
    {
      id: "commitment",
      title: "Our Commitment",
      icon: "Leaf",
      body:
        "We are committed to deliver independent, impartial and professional services that create value, manage risk and support the sustainability of energy assets for a better future.",
      items: ["Safety & Reliability", "Integrity & Independence", "Innovation & Sustainability"],
      visible: true
    }
  ],
  brochure: {
    brochurePdfUrl: ""
  }
};

export const DEFAULT_ABOUT_CONTACT_CONFIG: AboutContactConfig = {
  officeLabel: "Head Office (HO)",
  officeName: "Graha SUCOFINDO",
  address: "Jl. Raya Pasar Minggu Kav. 34\nJakarta 12780, Indonesia",
  phoneNumbers: ["+62 21 798 3666", "+62 21 798 7011"],
  email: "customer.care@sucofindo.co.id",
  website: "www.sucofindo.co.id",
  contactPerson: "",
  branchCity: "",
  notes: ""
};
