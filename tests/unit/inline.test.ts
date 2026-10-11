import { describe, expect, it } from "vitest";
import { parseInline } from "@/lib/inline";

describe("parseInline", () => {
  it("erkennt fett und Links", () => {
    expect(parseInline("A **B** [C](/c) D")).toEqual([
      { type: "text", value: "A " },
      { type: "bold", value: "B" },
      { type: "text", value: " " },
      { type: "link", value: "C", href: "/c" },
      { type: "text", value: " D" },
    ]);
  });
  it("lässt nur sichere Linkziele zu", () => {
    expect(parseInline("[x](javascript:alert(1))")[0]).toMatchObject({ type: "text" });
    expect(parseInline("[x](http://unsicher.de)")[0]).toMatchObject({ type: "text", value: "x" });
    expect(parseInline("[x](https://bundesnetzagentur.de)")[0]).toMatchObject({ type: "link" });
  });
});
