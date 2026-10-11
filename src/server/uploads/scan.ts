/**
 * Virenscan über ClamAV (clamd, INSTREAM-Protokoll über TCP).
 * Ohne CLAMAV_HOST: Status "not_scanned" – Dateien bleiben gesperrt und werden
 * nicht an das CRM übertragen, bis sie manuell bzw. nachträglich geprüft sind.
 */
import net from "node:net";

export type ScanResult = { status: "clean" } | { status: "infected"; signature: string } | { status: "not_scanned" } | { status: "error"; reason: string };

export async function scanBuffer(buf: Buffer, opts: { host?: string; port: number; timeoutMs: number }): Promise<ScanResult> {
  if (!opts.host) return { status: "not_scanned" };
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: opts.host, port: opts.port });
    let response = "";
    let settled = false;
    const finish = (r: ScanResult) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(r);
    };
    socket.setTimeout(opts.timeoutMs, () => finish({ status: "error", reason: "timeout" }));
    socket.on("error", (e) => finish({ status: "error", reason: (e as NodeJS.ErrnoException).code ?? "socket" }));
    socket.on("data", (d) => {
      response += d.toString("utf8");
    });
    socket.on("end", () => {
      const r = response.replace(/\0/g, "").trim();
      if (/:\s*OK$/.test(r)) finish({ status: "clean" });
      else if (/FOUND$/.test(r)) finish({ status: "infected", signature: r.replace(/^.*?:\s*/, "").replace(/\s*FOUND$/, "") });
      else finish({ status: "error", reason: "unexpected_response" });
    });
    socket.on("connect", () => {
      socket.write("zINSTREAM\0");
      const chunk = 64 * 1024;
      for (let i = 0; i < buf.length; i += chunk) {
        const part = buf.subarray(i, i + chunk);
        const len = Buffer.alloc(4);
        len.writeUInt32BE(part.length);
        socket.write(len);
        socket.write(part);
      }
      socket.write(Buffer.alloc(4));
    });
  });
}
