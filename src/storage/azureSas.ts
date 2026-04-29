import {
  BlobServiceClient,
  AnonymousCredential,
  newPipeline,
} from "@azure/storage-blob";

const baseUrl = process.env.AZURE_BLOB_BASE_URL!;
const sasToken = process.env.AZURE_SAS_TOKEN!;
const containerName = process.env.AZURE_CONTAINER_NAME!;

// Build SAS-authenticated service client
const serviceClient = new BlobServiceClient(
  `${baseUrl}?${sasToken}`,
  newPipeline(new AnonymousCredential()),
);

const containerClient = serviceClient.getContainerClient(containerName);

export async function uploadToAzureSAS(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
) {
  const blobName = `${Date.now()}-${fileName}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return {
    url: blockBlobClient.url, // public blob URL
    filename: blobName,
  };
}
