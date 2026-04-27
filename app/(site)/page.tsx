import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 680 }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Uniao de Freguesias CMS</h1>
        <p style={{ marginBottom: "1rem" }}>
          Initial Payload setup with collections for news, documents, media, and contact submissions.
        </p>
        <Link href="/admin">Open admin panel</Link>
      </div>
    </main>
  );
}
