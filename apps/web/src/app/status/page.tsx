export default function StatusPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl uppercase text-foreground">
        System status
      </h1>
      <p className="mt-4 text-muted-foreground">
        Public status page — coming when we wire uptime checks. For now, check{" "}
        <a
          href="https://github.com/openestatesales/core"
          className="font-medium text-accent hover:underline"
        >
          GitHub
        </a>{" "}
        for incidents.
      </p>
    </main>
  );
}
