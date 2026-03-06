import { useState } from "react";
import { MapPin, Calendar, Users, Bed, Briefcase, ChevronDown, Stethoscope } from "lucide-react";
import { type Institution } from "@/data/institutions";
import { institutionImages } from "@/data/institutionImages";

const PLACEHOLDER = "Informação institucional em atualização";

const isPlaceholder = (value: string) => value === PLACEHOLDER || value === "N/A";

const parseList = (value: string): string[] =>
  value.split(",").map((s) => s.trim()).filter(Boolean);

const InstitutionCard = ({ institution }: { institution: Institution }) => {
  const [expanded, setExpanded] = useState(false);
  const image = institutionImages[institution.name];

  const specialtiesList = !isPlaceholder(institution.specialties)
    ? parseList(institution.specialties)
    : [];

  const servicesList =
    institution.services && !isPlaceholder(institution.services)
      ? parseList(institution.services)
      : [];

  const VISIBLE_TAGS = 6;

  return (
    <div className="card-institutional overflow-hidden flex-shrink-0 w-full">
      {/* Image */}
      {image && (
        <div className="-mx-5 -mt-5 mb-4 md:-mx-8 md:-mt-8">
          <img
            src={image}
            alt={institution.name}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

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

      {/* Specialties preview (always visible) */}
      {specialtiesList.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Especialidades</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {specialtiesList.slice(0, expanded ? undefined : VISIBLE_TAGS).map((s, i) => (
              <span
                key={i}
                className="inline-block px-2.5 py-1 rounded-full bg-primary/8 text-primary text-xs font-medium border border-primary/15"
              >
                {s}
              </span>
            ))}
            {!expanded && specialtiesList.length > VISIBLE_TAGS && (
              <span className="inline-block px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                +{specialtiesList.length - VISIBLE_TAGS}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expandable content */}
      {expanded && (
        <>
          {/* Services */}
          {servicesList.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">Serviços</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {servicesList.map((s, i) => (
                  <span
                    key={i}
                    className="inline-block px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-border"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technical Director */}
          {!isPlaceholder(institution.technicalMedicalDirector) && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">Diretor Técnico-Médico</p>
              <p className="text-sm font-medium text-foreground">{institution.technicalMedicalDirector}</p>
              {institution.crm && (
                <p className="text-xs text-muted-foreground mt-0.5">{institution.crm}</p>
              )}
            </div>
          )}

          {/* Placeholder Notice */}
          {isPlaceholder(institution.specialties) && isPlaceholder(institution.technicalMedicalDirector) && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                {PLACEHOLDER}
              </p>
            </div>
          )}
        </>
      )}

      {/* "Ver mais" button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {expanded ? "Ver menos" : "Ver mais"}
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
};

export default InstitutionCard;
