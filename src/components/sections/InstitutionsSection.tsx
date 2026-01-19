import { useState } from "react";
import { Building2, Stethoscope, Heart, Leaf, MapPin, Calendar, Users, Bed } from "lucide-react";
import { hospitals, medicalCenters, clinics, medicalSpas, type Institution } from "@/data/institutions";

const tabs = [
  { id: "hospitals", label: "Hospitais", icon: Building2, data: hospitals },
  { id: "medical-centers", label: "Centros Médicos", icon: Stethoscope, data: medicalCenters },
  { id: "clinics", label: "Clínicas", icon: Heart, data: clinics },
  { id: "spas", label: "Spas Médicos", icon: Leaf, data: medicalSpas },
];

const PLACEHOLDER = "Informação institucional em atualização";

const InstitutionCard = ({ institution }: { institution: Institution }) => {
  const isPlaceholder = (value: string) => value === PLACEHOLDER || value === "N/A";

  return (
    <div className="card-institutional">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {institution.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{institution.city}, {institution.state}</span>
          </div>
        </div>
        {!isPlaceholder(institution.yearFounded) && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
            <Calendar className="w-3 h-3" />
            {institution.yearFounded}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {!isPlaceholder(institution.beds) && (
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Leitos</p>
              <p className="text-sm font-medium text-foreground">{institution.beds}</p>
            </div>
          </div>
        )}
        {!isPlaceholder(institution.employees) && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Colaboradores</p>
              <p className="text-sm font-medium text-foreground">{institution.employees}</p>
            </div>
          </div>
        )}
      </div>

      {/* Specialties */}
      {!isPlaceholder(institution.specialties) && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Especialidades</p>
          <p className="text-sm text-foreground leading-relaxed">
            {institution.specialties}
          </p>
        </div>
      )}

      {/* Technical Director */}
      {!isPlaceholder(institution.technicalDirector) && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Diretor Técnico</p>
          <p className="text-sm font-medium text-foreground">{institution.technicalDirector}</p>
        </div>
      )}

      {/* Placeholder Notice */}
      {isPlaceholder(institution.specialties) && isPlaceholder(institution.technicalDirector) && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground italic">
            {PLACEHOLDER}
          </p>
        </div>
      )}
    </div>
  );
};

const InstitutionsSection = () => {
  const [activeTab, setActiveTab] = useState("hospitals");

  const activeData = tabs.find((tab) => tab.id === activeTab)?.data || [];

  return (
    <section id="instituicoes" className="section-padding gradient-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nossas Instituições
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Instituições da Adventist Health Brasil
          </h2>
          <p className="text-lg text-muted-foreground">
            Conheça as unidades que compõem nossa rede de saúde
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {tab.data.length}
              </span>
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeData.map((institution, index) => (
            <InstitutionCard key={index} institution={institution} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstitutionsSection;
