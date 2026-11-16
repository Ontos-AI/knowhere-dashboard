/**
 * 系统常量
 */

// Supported upload extensions; keep in sync with the API SUPPORTED_EXTENSIONS
export const SUPPORTED_EXTENSIONS = {
  documents: [".doc", ".docx", ".pdf", ".txt", ".md", ".html", ".htm"],
  spreadsheets: [".xls", ".xlsx", ".csv", ".tsv"],
  images: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tif", ".tiff", ".heic", ".heif"],
  presentations: [".pptx"],
  audio: [".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg", ".opus"],
  video: [".mp4", ".mov", ".webm", ".mkv"],
} as const;

// 获取所有支持的文件扩展名
export const getAllSupportedExtensions = (): string[] => {
  const allExtensions: string[] = [];
  for (const category of Object.values(SUPPORTED_EXTENSIONS)) {
    allExtensions.push(...category);
  }
  return allExtensions;
};

// 获取文件类型的显示名称
export const getFileTypeDisplayName = (extension: string): string => {
  const ext = extension.toLowerCase();

  if (
    SUPPORTED_EXTENSIONS.documents.includes(ext as (typeof SUPPORTED_EXTENSIONS.documents)[number])
  ) {
    return "文档";
  }
  if (
    SUPPORTED_EXTENSIONS.spreadsheets.includes(
      ext as (typeof SUPPORTED_EXTENSIONS.spreadsheets)[number]
    )
  ) {
    return "表格";
  }
  if (SUPPORTED_EXTENSIONS.images.includes(ext as (typeof SUPPORTED_EXTENSIONS.images)[number])) {
    return "图片";
  }
  if (
    SUPPORTED_EXTENSIONS.presentations.includes(
      ext as (typeof SUPPORTED_EXTENSIONS.presentations)[number]
    )
  ) {
    return "演示文稿";
  }
  if (SUPPORTED_EXTENSIONS.audio.includes(ext as (typeof SUPPORTED_EXTENSIONS.audio)[number])) {
    return "音频";
  }
  if (SUPPORTED_EXTENSIONS.video.includes(ext as (typeof SUPPORTED_EXTENSIONS.video)[number])) {
    return "视频";
  }

  return "未知类型";
};

// 获取文件类型的 MIME 类型
export const getFileMimeType = (extension: string): string => {
  const ext = extension.toLowerCase();

  const mimeTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls": "application/vnd.ms-excel",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".csv": "text/csv",
    ".tsv": "text/tab-separated-values",
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".html": "text/html",
    ".htm": "text/html",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".heic": "image/heic",
    ".heif": "image/heif",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".m4a": "audio/mp4",
    ".aac": "audio/aac",
    ".flac": "audio/flac",
    ".ogg": "audio/ogg",
    ".opus": "audio/opus",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
    ".mkv": "video/x-matroska",
  };

  return mimeTypes[ext] || "application/octet-stream";
};
