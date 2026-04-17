import { createOesClient } from "@oes/sdk";
import { Button } from "@oes/ui";

export default function DeveloperHomePage() {
  const client = createOesClient({
    baseUrl: "https://openestatesales.com",
  });

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "48px 20px",
      }}
    >
      <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
        developer.openestatesales.com
      </p>
      <h1 style={{ margin: "8px 0 0", fontSize: 40, letterSpacing: -0.5 }}>
        Open Estate Sales Developer Portal
      </h1>
      <p style={{ marginTop: 12, fontSize: 16, maxWidth: 720, opacity: 0.9 }}>
        This app is the starting point for docs, API references, and SDK
        examples. We’ll evolve it as `packages/sdk` matures.
      </p>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 10px" }}>Next steps</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Docs / guides</li>
          <li>API reference</li>
          <li>SDK examples</li>
          <li>Status / changelog</li>
        </ul>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 10px" }}>SDK sanity check</h2>
        <p style={{ margin: "0 0 10px", opacity: 0.9 }}>
          Client base URL: <code>{client.baseUrl}</code>
        </p>
        <Button type="button" onClick={() => alert("Hello from @oes/ui")}>
          UI button
        </Button>
      </section>
    </main>
  );
}

