import { useMemo } from "react";
import { Filter, X } from "lucide-react";
import { allInstitutions } from "@/data/institutions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLACEHOLDER = "Informação institucional em atualização";

const parseList = (value: string): string[] =>
  value.split(",").map((s) => s.trim()).filter(Boolean);

export interface Filters {
  state: string;
  specialty: string;
  service: string;
}

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeTab: string;
}

const InstitutionFilters = ({ filters, onFiltersChange, activeTab }: Props) => {
  const { states, specialties, services } = useMemo(() => {
    const statesSet = new Set<string>();
    const specialtiesSet = new Set<string>();
    const servicesSet = new Set<string>();

    allInstitutions.forEach((inst) => {
      if (inst.state && inst.state !== PLACEHOLDER) statesSet.add(inst.state);
      if (inst.specialties && inst.specialties !== PLACEHOLDER) {
        parseList(inst.specialties).forEach((s) => specialtiesSet.add(s));
      }
      if (inst.services && inst.services !== PLACEHOLDER) {
        parseList(inst.services).forEach((s) => servicesSet.add(s));
      }
    });

    return {
      states: Array.from(statesSet).sort(),
      specialties: Array.from(specialtiesSet).sort(),
      services: Array.from(servicesSet).sort(),
    };
  }, []);

  const hasActiveFilters = filters.state || filters.specialty || filters.service;

  const clearFilters = () => onFiltersChange({ state: "", specialty: "", service: "" });

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filtrar por</span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <X className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          value={filters.state}
          onValueChange={(v) => onFiltersChange({ ...filters, state: v === "all" ? "" : v })}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            {states.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.specialty}
          onValueChange={(v) => onFiltersChange({ ...filters, specialty: v === "all" ? "" : v })}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Especialidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as especialidades</SelectItem>
            {specialties.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.service}
          onValueChange={(v) => onFiltersChange({ ...filters, service: v === "all" ? "" : v })}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os serviços</SelectItem>
            {services.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InstitutionFilters;
