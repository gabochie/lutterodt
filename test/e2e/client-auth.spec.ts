import { test, expect } from "@playwright/test";
import { execSync } from "node:child_process";

// Exercises the real client login flow (plaintext → hash upgrade):
// seeds a legacy plaintext-code client straight into the local D1,
// logs in, proves the row was upgraded, logs in again via the hash path.
function d1(sql: string): string {
  return execSync(
    `npx wrangler d1 execute lutterodt-db --local --json --command ${JSON.stringify(sql)}`,
    { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }
  );
}

test("legacy access codes upgrade to hashes on login", async ({ request }) => {
  const email = `legacy-${Date.now()}@lutterodt.org`;
  const code = "LEGACY-CODE-1";
  d1(
    `INSERT INTO clients (name, email, access_code, status) VALUES ('Legacy', '${email}', '${code}', 'active')`
  );

  const first = await request.post("/api/clients/login", {
    data: { email, access_code: code },
  });
  expect(first.status(), "legacy login").toBe(200);

  const after = JSON.parse(d1(`SELECT access_code, access_code_hash FROM clients WHERE email='${email}'`));
  const row = after[0]?.results?.[0] as { access_code: string; access_code_hash: string } | undefined;
  expect(row?.access_code_hash, "hash stored").toMatch(/^[0-9a-f]{64}$/);
  expect(row?.access_code, "plaintext blanked").toBe("");

  const second = await request.post("/api/clients/login", {
    data: { email, access_code: code },
  });
  expect(second.status(), "hash-path login").toBe(200);

  const wrong = await request.post("/api/clients/login", {
    data: { email, access_code: "WRONG-CODE" },
  });
  expect(wrong.status(), "wrong code").toBe(401);

  d1(`DELETE FROM clients WHERE email='${email}'`);
});
