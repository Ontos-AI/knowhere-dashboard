/**
 * 系统常量
 */

// 支持的文件格式 - 与后端 SystemConstants 保持一致
export const SUPPORTED_EXTENSIONS = {
  documents: [".doc", ".docx", ".pdf", ".txt"],
  spreadsheets: [".xls", ".xlsx", ".csv"],
  images: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".svg"],
  presentations: [".ppt", ".pptx"],
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
    ".ppt": "application/vnd.ms-powerpoint",
    ".csv": "text/csv",
    ".txt": "text/plain",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".tiff": "image/tiff",
    ".svg": "image/svg+xml",
  };

  return mimeTypes[ext] || "application/octet-stream";
};
