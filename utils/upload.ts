/**
 * 直接上传文件到 S3 预签名 URL
 * 浏览器专用工具函数，使用 XMLHttpRequest 实现上传进度追踪
 * 不依赖 signedRequest，直接与 S3 通信
 */
export async function uploadFileToS3({
  uploadUrl,
  file,
  headers,
  onProgress,
}: {
  uploadUrl: string;
  file: File | Blob;
  headers: Record<string, string>;
  onProgress?: (progress: number) => void;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed due to network error"));
    });

    xhr.addEventListener("timeout", () => {
      reject(new Error("Upload timed out"));
    });

    xhr.timeout = 5 * 60 * 1000;

    xhr.open("PUT", uploadUrl);

    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }

    xhr.send(file);
  });
}
