import React from "react";

export default function AttachmentPreview({ data }: any) {
  const media = data?.attachment;

  if (!media) {
    return <p style={{ opacity: 0.6 }}>Nenhum anexo enviado</p>;
  }

  const url = typeof media === "object" ? media.url : null;
  const filename =
    typeof media === "object" ? media.filename : `Media ID: ${media}`;

  if (!url) {
    return <p style={{ opacity: 0.6 }}>📎 {filename} (ver em Media)</p>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2563eb",
        textDecoration: "underline",
        fontWeight: 500,
      }}
    >
      📎 Abrir anexo ({filename})
    </a>
  );
}
