// Main portfolio data structure - centralized data store for all portfolio content
// This object serves as the single source of truth for all professional information
export const portfolioData = {
  // Personal information section - core professional identity
  personal: {
    name: "Zachary Sluss",
    title: "Principal CRM & Enterprise Platforms Solutions Architect",
    tagline: "Enterprise Technology Leader with 8+ years specializing in $3M+ CRM, ERP, and Data ecosystems for Fortune 500-scale enterprises - delivering 40%+ productivity gains and governing global multi-cloud portfolios across 20+ countries",
    bio: "Principal CRM & Enterprise Platforms Solutions Architect with 8+ years leading Salesforce-centric and enterprise platform transformations in global, highly regulated environments. Design and govern multi-cloud CRM, data, and automation capabilities that drive 40%+ productivity gains and 1,000+ hours of annual time savings.\n\nPartner with executives to shape $1M–$10M+ technology portfolios, define reference architectures and roadmaps, and build governed, highly adoptable workflows for sales, operations, and leadership teams.",
    location: "New Hampshire, USA (Remote)",
    email: "zacharyjsluss@gmail.com",
    phone: "(603) 515-6051",
  },
  // Social media and professional networking links
  social: {
    github: "",
    linkedin: "https://linkedin.com/in/zacharyjsluss",
    website: "",
    deviantart: "https://www.deviantart.com/theoryart777",
    youtube: "https://www.youtube.com/channel/UCjnD1inIRh9eKjrl4LfwLcQ",
    kuula: "https://www.kuula.co/profile/Drone_360_Aerial_Photography",
  },
  // Professional experience history - chronologically ordered positions
  // Each entry contains comprehensive role details including achievements and technologies
  experience: [
    {
      id: "exp-1", // Unique identifier for React key prop
      company: "",
      position: "Lead CRM Systems Analyst",
      startDate: "2023-07", // ISO date format for consistent parsing
      description: "Serve as enterprise CRM and platforms architect and CRM platform owner for thousands of global users across 20+ countries. Oversee a $3M+ annual CRM, analytics, and integration portfolio aligned to executive and board-level growth objectives, setting architecture standards, roadmaps, and governance for the Salesforce-centric ecosystem.",
      achievements: [ // Key accomplishments demonstrating impact and value delivered
        "Define and govern the enterprise CRM reference architecture and multi-year roadmap spanning Salesforce Multi-Cloud, ERP, and analytics, standardizing solution designs and integration patterns to ensure interoperability, data integrity, and scalable growth across all business units",
        "Architect and lead a global digital transformation program that increased sales and operational throughput by 40%, automated 1,000+ hours annually, and enforced global process standardization through API-led integration across CRM, ERP, and analytics platforms",
        "Design and implement the enterprise governance and compliance model, aligning CRM, integration, and analytics platforms to SOX controls and privacy requirements (GDPR, CCPA) and sustaining 100% audit readiness with zero regulatory breaches across all markets",
        "Architect a managed services pricing platform that integrates automation with standardized product data models, increasing deal velocity by 30% and enforcing a consistent, globally governed pricing strategy",
        "Own the CRM and data platform roadmap, aligning architecture decisions with corporate strategy, M&A integrations, and geographic expansion, and sequencing initiatives to balance risk, delivery capacity, and long-term scalability",
        "Enable executive and board-level decision-making by designing Salesforce-centered analytics and dashboards that provide real-time forecasting, pipeline visibility, and revenue insights across regions and product lines",
        "Manage a multi-vendor ecosystem ($3M+ annual portfolio; 10+ contracts) across CRM, integration, analytics, and automation, leading vendor selection, contract renewals, and multi-year ROI assessments tied to platform strategy",
        "Provide architectural oversight for a delivery portfolio of 12+ concurrent strategic programs annually, enforcing adherence to reference architectures and driving on-time delivery and measurable business outcomes",
        "Mentor analysts and regional power users and lead cross-functional working groups across sales, operations, finance, and IT so platform decisions reflect real-world workflows and sustain high adoption",
      ],
      technologies: ["Salesforce Multi-Cloud", "MuleSoft", "API Management", "Tableau", "Power BI", "Looker", "AWS", "Azure", "ServiceNow", "Jira", "Confluence", "SOX Compliance"],
    },
    {
      id: "exp-2",
      company: "",
      position: "Sr. Sales Systems Analyst",
      startDate: "2022-12",
      endDate: "2023-07",
      description: "Led enterprise-wide CRM transformation and integration initiatives, building the technical foundation for global platform standardization.",
      achievements: [
        "Spearheaded Salesforce Multi-Cloud implementation across sales and service operations, establishing integration patterns and data models that became enterprise standards",
        "Built API-led integration framework connecting Salesforce to Workday HCM and SAP ERP, enabling real-time data synchronization across enterprise systems",
        "Designed and deployed automated workflow solutions reducing manual processes and establishing foundation for 1,000+ hours of annual automation",
      ],
      technologies: ["Salesforce", "MuleSoft", "Workday HCM", "SAP ERP", "Data Migration", "Process Automation", "Azure DevOps"],
    },
    {
      id: "exp-3",
      company: "",
      position: "Sr. Sales Analyst",
      startDate: "2021-10",
      endDate: "2022-12",
      description: "Drove sales analytics strategy and executive reporting capabilities, establishing data-driven decision frameworks across global operations.",
      achievements: [
        "Developed comprehensive analytics frameworks for sales forecasting and pipeline management, establishing reporting standards across 22+ countries",
        "Designed executive dashboards in Tableau and Power BI providing leadership with visibility into global sales performance and trends",
        "Implemented data quality controls and validation rules improving CRM data integrity and establishing foundation for enterprise reporting",
      ],
      technologies: ["Salesforce Sales Cloud", "Tableau", "Power BI", "Analytics", "Reporting", "Data Quality Management"],
    },
    {
      id: "exp-4",
      company: "CIT Bank",
      position: "Funding Manager",
      startDate: "2019-09",
      endDate: "2021-10",
      description: "Led technology-enabled lending initiatives within CIT's $46M+ national syndicate business portfolio, integrating automation, compliance, and data-driven decision frameworks across loan origination and funding.",
      achievements: [
        "Co-architected cloud-based loan origination transformation, unifying analytics, compliance, and CRM platforms to reduce approval cycles by 35% and deliver real-time executive reporting",
        "Established data governance and workflow automation standards that improved data accuracy, auditability, and risk oversight across all lending operations",
        "Designed workforce enablement frameworks and training programs that cut national new-hire ramp time by 80%",
        "Partnered with executive leadership to prioritize automation and platform initiatives that improved portfolio yield, accelerated funding timelines, and strengthened compliance and audit integrity",
      ],
      technologies: ["Cloud Loan Origination", "CRM Systems", "Analytics Platforms", "Compliance Automation", "Data Governance", "Process Automation"],
    },
    {
      id: "exp-5",
      company: "EVO Payments International",
      position: "Underwriter",
      startDate: "2018-06",
      endDate: "2019-07",
      description: "Led technology-driven risk initiatives and process modernization for a $45M+ annual transaction portfolio, co-architecting automated risk analytics and compliance workflows within enterprise credit systems.",
      achievements: [
        "Modernized credit risk evaluation infrastructure by integrating SQL- and Oracle-based analytics to improve predictive insight and enable earlier fraud detection",
        "Engineered automated scoring and data-cleansing models that improved risk assessment accuracy and reduced processing time by 60%",
        "Collaborated with IT and compliance leaders to embed analytics pipelines into enterprise processing systems, aligning risk workflows with global architecture and governance standards",
      ],
      technologies: ["SQL", "Oracle", "Risk Analytics", "Automated Scoring Models", "Data Integration", "Compliance Frameworks"],
    },
    {
      id: "exp-6",
      company: "EVO Payments International",
      position: "Underwriting Support",
      startDate: "2017-06",
      endDate: "2018-06",
      description: "Provided technical and analytical support for risk evaluation processes across enterprise credit systems.",
      achievements: [
        "Supported credit risk evaluation workflows and data analysis initiatives",
        "Assisted in data quality improvements and compliance documentation",
        "Contributed to process optimization efforts within underwriting operations",
      ],
      technologies: ["SQL", "Oracle", "Data Analysis", "Risk Assessment", "Compliance Support"],
    },
    {
      id: "exp-7",
      company: "Black Flag LLC",
      position: "Founder & Managing Partner",
      startDate: "2017-03",
      description: "Found and scale multi-channel digital ventures spanning e-commerce and analytics-driven services, using them as a lab to design, deploy, and harden automation and cloud patterns later applied in enterprise platform architecture work.",
      achievements: [
        "Build and govern a cross-industry digital operations portfolio generating recurring revenue across e-commerce, creative production, and technical services",
        "Implement automation and analytics frameworks that optimize marketing performance and customer journeys across digital channels, validating patterns later reused in enterprise CRM and marketing architectures",
        "Deliver advanced aerial mapping and 3D modeling solutions as an FAA-licensed remote pilot",
      ],
      technologies: ["E-commerce Platforms", "Cloud Systems", "Automation", "Analytics", "Drone Technology", "3D Modeling", "Digital Marketing"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Global Salesforce Multi-Cloud Transformation",
      description: "Enterprise-wide CRM modernization unifying 3,000+ users across 22 countries with integrated ERP, HCM, and analytics",
      problem: "The organization operated with 22 disconnected regional CRM instances across global markets, causing data silos, inconsistent reporting, and 40% slower sales cycles. Leadership lacked real-time visibility into global pipeline, forecasting required manual consolidation from disparate sources, and M&A integrations took 6+ months due to platform fragmentation.",
      solution: "Architected comprehensive digital transformation program integrating Salesforce Multi-Cloud (Sales, Service, CPQ, Data Cloud) with Workday HCM and SAP ERP. Implemented API-led integration architecture using MuleSoft, established enterprise-wide governance framework ensuring SOX compliance, and built real-time executive dashboards for C-suite decision-making. Standardized business processes across 22 countries while maintaining regional flexibility.",
      impact: "40% increase in sales operational throughput • 1,000+ hours automated annually • $2M+ cost avoidance through platform consolidation • 100% SOX audit compliance with zero breaches • Real-time board-level visibility replacing 3-week manual reporting cycles",
      longDescription: "Led comprehensive digital transformation program integrating Salesforce Sales Cloud, Service Cloud, CPQ, and Data Cloud with Workday HCM and SAP ERP. Implemented API-led integration architecture using MuleSoft, established enterprise governance framework, and delivered real-time executive dashboards for C-suite decision-making.",
      technologies: ["Salesforce Multi-Cloud", "MuleSoft", "Workday HCM", "SAP ERP", "Tableau", "AWS", "API Management"],
      features: [
        "Global platform standardization across 22+ countries",
        "API-led integration framework with ERP and HCM systems",
        "Real-time executive dashboards for forecasting and pipeline visibility",
        "Enterprise governance model achieving 100% SOX compliance",
        "Automated 1,000+ hours annually through intelligent workflows",
        "40% increase in sales and operational throughput",
      ],
      color: "#00ff88",
    },
    {
      id: "proj-2",
      title: "Enterprise Managed Services Pricing Engine",
      description: "Intelligent pricing platform with embedded automation increasing deal velocity 30%",
      problem: "Sales teams wasted 20+ hours per deal manually calculating pricing across fragmented product catalogs with inconsistent discount approval processes. Regional pricing variations created compliance risks, and leadership lacked visibility into pricing trends and margin erosion patterns.",
      solution: "Designed and implemented global pricing platform within Salesforce CPQ, standardizing product catalog across all regions with automated discounting logic based on deal parameters, customer segments, and competitive intelligence. Integrated with ERP for real-time cost synchronization and built intelligent approval workflows routing only exception cases to leadership.",
      impact: "30% improvement in deal closure velocity • 20+ hours saved per sales cycle • Standardized pricing across 22+ countries • Real-time margin visibility for finance team • Reduced pricing errors by 95%",
      longDescription: "Designed and implemented global pricing platform within Salesforce CPQ, standardizing product catalog, pricing models, and approval workflows. Integrated with ERP for real-time cost data and built automated discounting logic based on deal parameters, customer segments, and regional considerations.",
      technologies: ["Salesforce CPQ", "ERP Integration", "Pricing Automation", "Workflow Engine", "Business Rules"],
      features: [
        "Standardized global product and pricing catalog",
        "Automated approval workflows and discounting logic",
        "Real-time ERP integration for cost synchronization",
        "Regional pricing and tax calculation engines",
        "30% improvement in deal closure velocity",
      ],
      color: "#0088ff",
    },
    {
      id: "proj-3",
      title: "Cloud-Based Loan Origination Platform",
      description: "Integrated lending platform reducing approval cycles 35% for $46M+ loan portfolio",
      problem: "CIT Bank's $46M+ syndicate lending program relied on manual credit decisioning with paper-based compliance checks, creating 10-14 day approval cycles and compliance risks. Portfolio managers lacked real-time visibility into risk exposure, and new coordinators required 6+ weeks training on fragmented legacy systems.",
      solution: "Deployed cloud-based loan origination system integrating CRM, analytics, and automated compliance engines. Built intelligent credit scoring workflows with real-time risk assessment, automated regulatory compliance checks, and executive dashboards providing portfolio-wide insights. Created standardized training frameworks reducing coordinator ramp time by 80%.",
      impact: "35% reduction in approval cycle time • 80% faster new-hire onboarding • Zero compliance incidents during tenure • Real-time portfolio risk monitoring for executive team • $46M+ managed with improved operational precision",
      longDescription: "Deployed cloud-based loan origination system integrating CRM, analytics, and compliance tools for national syndicate lending program. Built automated workflows for credit decisioning, risk assessment, and compliance checks, with executive dashboards providing real-time portfolio insights.",
      technologies: ["Cloud LOS", "CRM Integration", "Analytics Platforms", "Compliance Automation", "Risk Management"],
      features: [
        "Automated credit decisioning workflows",
        "Real-time compliance and risk monitoring",
        "Executive dashboards for portfolio management",
        "CRM integration for customer relationship tracking",
        "35% reduction in approval cycle time",
      ],
      color: "#ff006e",
    },
  ],
  skills: [
    {
      category: "Architecture, Governance & Leadership",
      skills: [
        { name: "Change & Release Management", level: "Expert" },
        { name: "Cross-functional Stakeholder Alignment", level: "Expert" },
        { name: "Data Governance & Compliance (CCPA, GDPR, SOX)", level: "Expert" },
        { name: "Data Modeling", level: "Expert" },
        { name: "Enterprise Solution & Integration Architecture", level: "Expert" },
        { name: "Executive Decision Enablement & Portfolio Optimization", level: "Expert" },
        { name: "Global CRM/Platform Ownership", level: "Expert" },
        { name: "Platform Strategy & Roadmapping", level: "Expert" },
        { name: "Security & Access Design", level: "Expert" },
      ],
    },
    {
      category: "Platforms, Data & Analytics",
      skills: [
        { name: "AWS (Certified)", level: "Expert", certified: true },
        { name: "Microsoft Entra", level: "Advanced" },
        { name: "Looker", level: "Advanced" },
        { name: "MS Power Platform", level: "Expert" },
        { name: "Oracle Cloud Apps (CRM On Demand, NetSuite)", level: "Advanced" },
        { name: "Power BI", level: "Expert" },
        { name: "Salesforce Multi-Cloud (Certified)", level: "Expert", certified: true },
        { name: "Salesforce CPQ", level: "Expert" },
        { name: "Salesforce Data Cloud", level: "Expert" },
        { name: "Salesforce Experience Cloud", level: "Expert" },
        { name: "Salesforce Sales Cloud", level: "Expert" },
        { name: "Salesforce Service Cloud", level: "Expert" },
        { name: "SAP ERP", level: "Advanced" },
        { name: "Snowflake", level: "Advanced" },
        { name: "SQL", level: "Expert" },
        { name: "Tableau (Certified)", level: "Expert", certified: true },
        { name: "Workday HCM", level: "Advanced" },
      ],
    },
    {
      category: "Integration, Security & Automation",
      skills: [
        { name: "API Integration & Management (MuleSoft)", level: "Expert" },
        { name: "Automation & Orchestration (Blue Prism, Power Automate, UiPath)", level: "Advanced" },
        { name: "Collaboration & Delivery (Azure DevOps, Confluence, Jira, Microsoft Teams, Slack)", level: "Expert" },
        { name: "Containerization & IaC (CloudFormation, Docker, Kubernetes)", level: "Intermediate" },
        { name: "End-to-end Workflow Modernization", level: "Expert" },
        { name: "Marketing & GTM Tools (HubSpot, Marketo, Pardot)", level: "Advanced" },
        { name: "Salesforce Flow", level: "Expert" },
      ],
    },
  ],
  education: [
    {
      institution: "University of New Hampshire",
      degree: "Bachelor of Science",
      field: "Environmental and Resource Economics",
      startDate: "2012-09",
      endDate: "2016-12",
      achievements: [
        "Minor in Community and Environmental Planning",
        "Coursework in business management, analytics, finance, computer science, marketing, and natural sciences",
        "Developed strong analytical and strategic thinking foundations",
      ],
    },
  ],
  additionalLinks: [
    // Aerial Photography (alphabetically sorted)
    {
      id: "link-5",
      title: "360° Immersive Photography",
      description: "Interactive 360-degree aerial photography experiences",
      url: "https://www.kuula.co/profile/Drone_360_Aerial_Photography",
      category: "Aerial Photography",
      image: "portfolio-images/360Photo.webp",
    },
    {
      id: "link-6",
      title: "Aerial Photography Portfolio",
      description: "Professional drone photography collection",
      url: "https://drive.google.com/drive/folders/1aJG3T-TVUoJ-Xc6CdCvK2HZTf-PCBpDW?usp=sharing",
      category: "Aerial Photography",
      image: "portfolio-images/DronePhoto.webp",
    },
    {
      id: "link-7",
      title: "Aerial Videography",
      description: "Cinematic drone video productions",
      url: "https://www.youtube.com/channel/UCjnD1inIRh9eKjrl4LfwLcQ",
      category: "Aerial Photography",
      image: "portfolio-images/Video.webp",
    },
    // Certifications (alphabetically sorted)
    {
      id: "link-14",
      title: "Salesforce Trailblazer Profile",
      description: "Professional certifications and continuous learning achievements in Salesforce and enterprise technologies",
      url: "https://www.salesforce.com/trailblazer/zacharyjsluss",
      category: "Certifications",
      image: "portfolio-images/certificationpicture.png",
    },
    // Creative Arts (alphabetically sorted)
    {
      id: "link-2",
      title: "Digital Art Portfolio",
      description: "Creative artwork and digital illustrations",
      url: "https://www.deviantart.com/theoryart777",
      category: "Creative Arts",
      image: "portfolio-images/images.webp",
    },
    {
      id: "link-4",
      title: "Digital Design Work",
      description: "Graphic design and visual branding projects",
      url: "https://drive.google.com/drive/folders/1giTNNrjznLS9RILHq9C9vCQQjWxCYgxD?usp=sharing",
      category: "Creative Arts",
      image: "portfolio-images/digitaldesign.webp",
    },
    {
      id: "link-3",
      title: "Music Production",
      description: "Original music compositions and productions",
      url: "https://drive.google.com/drive/folders/1ET30TX7_lST5Cp3EsNp7ak-S4WcLffar?usp=drive_link",
      category: "Creative Arts",
      image: "portfolio-images/music.webp",
    },
    // Personal Projects (alphabetically sorted)
    {
      id: "link-10",
      title: "ASCII 3D Animator",
      description: "A fun, interactive web tool that transforms 3D animated models into live ASCII art using just text characters",
      url: "#",
      category: "Personal Projects",
      image: "portfolio-images/asciipicture.png",
    },
    {
      id: "link-11",
      title: "Crystal Blitz",
      description: "Crystal Blitz is an intense arena shooter where you face endless waves of intelligent enemies",
      url: "#",
      category: "Personal Projects",
      image: "portfolio-images/crystalblitzpicture.png",
    },
    {
      id: "link-12",
      title: "DATAPHREAK",
      description: "DATAPHREAK transforms impossible data challenges into 30-second solutions for analyzing CSV files and detecting patterns",
      url: "#",
      category: "Personal Projects",
      image: "portfolio-images/dataphreakpicture.png",
    },
    {
      id: "link-15",
      title: "GitHub Profile",
      description: "Open source projects, code repositories, and software development work",
      url: "#",
      category: "Personal Projects",
      image: "portfolio-images/github.png",
    },
    {
      id: "link-9",
      title: "Particle Physics Simulator",
      description: "An interactive particle physics simulation that brings real science to life through stunning visual effects",
      url: "#",
      category: "Personal Projects",
      image: "portfolio-images/particlepicture.png",
    },
    {
      id: "link-13",
      title: "Portfolio Zarvis",
      description: "A fun Conversation AI enabled portfolio with interactive chat capabilities",
      url: "#",
      category: "Personal Projects",
      image: "portfolio-images/portfoliopicture.png",
    },
  ],
};

// Helper functions
export const formatDate = (dateString) => {
  if (!dateString) return "Present";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years}y ${remainingMonths}m`;
  } else if (years > 0) {
    return `${years}y`;
  } else {
    return `${remainingMonths}m`;
  }
};

// Calculate skill level based on years of experience
// 5+ years = Expert, 3-4 years = Advanced, 1-2 years = Intermediate, <1 year = Beginner
export const calculateSkillLevel = (years) => {
  if (years >= 5) return 'Expert';
  if (years >= 3) return 'Advanced';
  if (years >= 1) return 'Intermediate';
  return 'Beginner';
};

// Validate portfolio data structure in development mode
if (import.meta.env.DEV) {
  import('./schema').then(({ validatePortfolioData }) => {
    try {
      validatePortfolioData(portfolioData)
      console.log('✅ Portfolio data validation passed')
    } catch (error) {
      console.error('❌ Portfolio data validation failed:', error.message)
      throw error
    }
  })
}
