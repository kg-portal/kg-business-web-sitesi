import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Klassen zusammenführen; widersprüchliche Tailwind-Klassen werden aufgelöst (letzte gewinnt). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
