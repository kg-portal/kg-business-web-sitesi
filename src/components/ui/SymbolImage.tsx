import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

/**
 * Bild mit optionalem „Symbolbild“-Hinweis. Personenbilder zeigen keine
 * Mitarbeitenden von KG Business und werden deshalb gekennzeichnet.
 */
export function SymbolImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  symbol = true,
}: {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  symbol?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {symbol ? (
        <span className="absolute right-3 top-3 rounded-md bg-navy-950/70 px-2 py-0.5 text-[0.68rem] font-medium tracking-wide text-white/90 backdrop-blur">
          Symbolbild
        </span>
      ) : null}
    </div>
  );
}
