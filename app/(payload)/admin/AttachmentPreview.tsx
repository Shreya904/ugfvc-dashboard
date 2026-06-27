import React from "react";

type AttachmentMedia = {
  filename?: string;
  url?: string;
};

type AttachmentPreviewProps = {
  data?: {
    attachment?: AttachmentMedia | string | number | null;
  };
};

export default function AttachmentPreview({ data }: AttachmentPreviewProps) {
  const media = data?.attachment;

  if (!media) {
    return <p style={{ opacity: 0.6 }}>Nenhum anexo enviado</p>;
  }

  const url = typeof media === "object" ? media.url : null;
  const filename =
    typeof media === "object" ? media.filename : `Media ID: ${media}`;

  if (!url) {
    return <p style={{ opacity: 0.6 }}>Anexo: {filename} (ver em Media)</p>;
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
      Abrir anexo ({filename})
    </a>
  );
}
