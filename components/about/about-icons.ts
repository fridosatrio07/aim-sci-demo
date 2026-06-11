import {
  Award,
  BarChart3,
  Building2,
  ExternalLink,
  FileCheck2,
  Globe2,
  Leaf,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";

import type { AboutIconKey } from "@/lib/about-data";

export const aboutIconMap: Record<AboutIconKey, typeof Building2> = {
  Building2,
  ShieldCheck,
  Globe2,
  Award,
  Users,
  Settings,
  BarChart3,
  Search,
  RefreshCcw,
  FileCheck2,
  Leaf,
  MapPin,
  Phone,
  Mail,
  ExternalLink
};
