import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calculator,
  CalendarClock,
  ChartLine,
  Check,
  CircleCheck,
  ClipboardCheck,
  Clock,
  Euro,
  Factory,
  FileSearch,
  FileText,
  Flame,
  Gauge,
  Handshake,
  House,
  Info,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Route,
  Scale,
  Search,
  ShieldCheck,
  Stethoscope,
  Store,
  Timer,
  Upload,
  UserRound,
  UtensilsCrossed,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Zentrales Icon-Register. Inhalte referenzieren Icons per Name, damit
 * Content-Dateien keine React-Komponenten importieren müssen.
 */
const registry = {
  arrow: ArrowRight,
  badge: BadgeCheck,
  bed: BedDouble,
  book: BookOpen,
  briefcase: Briefcase,
  building: Building2,
  buildings: Building,
  calculator: Calculator,
  calendar: CalendarClock,
  chart: ChartLine,
  check: Check,
  checkCircle: CircleCheck,
  clipboard: ClipboardCheck,
  clock: Clock,
  euro: Euro,
  factory: Factory,
  fileSearch: FileSearch,
  file: FileText,
  flame: Flame,
  gauge: Gauge,
  handshake: Handshake,
  home: House,
  info: Info,
  lightbulb: Lightbulb,
  lock: Lock,
  mail: Mail,
  mapPin: MapPin,
  phone: Phone,
  receipt: Receipt,
  route: Route,
  scale: Scale,
  search: Search,
  shield: ShieldCheck,
  stethoscope: Stethoscope,
  store: Store,
  timer: Timer,
  upload: Upload,
  user: UserRound,
  utensils: UtensilsCrossed,
  wrench: Wrench,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof registry;

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, className, strokeWidth = 1.75 }: IconProps) {
  const Component = registry[name];
  return <Component aria-hidden="true" focusable="false" className={className} strokeWidth={strokeWidth} />;
}
