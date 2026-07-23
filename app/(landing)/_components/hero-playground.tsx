"use client";

import {
  LandingTrackedLink,
  trackLandingInteraction,
} from "@app/(landing)/_components/landing-tracked-link";
import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog";
import { trackAnalyticsEvent } from "@lib/analytics";
import { cn } from "@lib/utils";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import {
  ChevronRight,
  FileCode2,
  FileImage,
  FileJson2,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  Loader2,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Highlight, themes } from "prism-react-renderer";
import {
  type CSSProperties,
  Fragment,
  type RefObject,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const monoReadableClassName = "font-[family-name:var(--font-mono-readable)]";
const englishHandwritingClassName = "font-[family-name:var(--font-handwriting-en)]";
const epsteinChunksPreview = `{
  "dataset": "EPSTEIN FLIGHT LOGS UNREDACTED",
  "summary": {
    "pagesWithTables": 116,
    "totalRecords": 6857,
    "tableChunks": 116
  },
  "files": [
    "chunks.json",
    "doc_nav.json",
    "full.md",
    "manifest.json",
    "tables/*.html"
  ]
}`;
const tslaChunksPreview = `{
  "project": "Luma App",
  "version": "1.0.0",
  "files": [
    {
      "name": "index.html",
      "type": "html",
      "size": 12,
      "lastModified": "2026-04-22"
    },
    {
      "name": "config.json",
      "type": "json",
      "size": 2
    },
    {
      "name": "readme.md",
      "type": "markdown",
      "isReadonly": true
    },
    {
      "name": "data_report.csv",
      "type": "csv",
      "rows": 1500
    },
    {
      "name": "banner.jpg",
      "type": "image",
      "dimensions": "1920x1080"
    }
  ]
}`;

type PlaygroundSampleId = "atlas" | "epstein" | "tsla";
type PlaygroundStage = "default" | "target" | "parsing" | "parsed";
type PreviewLanguage = "json" | "markdown" | "markup" | "text";
type ResultFileKind = "csv" | "directory" | "html" | "image" | "json" | "markdown" | "unknown";

type PlaygroundSample = {
  cardLabel: string;
  extension: string;
  id: PlaygroundSampleId;
  modalLabel: string;
  pdfPath: string;
  previewOverrides?: Partial<Record<string, { content: string; language: PreviewLanguage }>>;
  resultRoot: string;
  rootEntries: readonly string[];
  style: CSSProperties;
  tone: { background: string; text: string };
};

type PlaygroundImageMetadata = {
  file_path: string;
  format?: string;
  height?: number;
  size_bytes?: number;
  width?: number;
};

type PlaygroundManifest = {
  files?: {
    images?: PlaygroundImageMetadata[];
  };
  statistics?: {
    image_chunks?: number;
    table_chunks?: number;
  };
};

type PlaygroundChunk = {
  metadata?: {
    file_path?: string;
  };
  path?: string;
};

type PlaygroundChunkPackage = {
  chunks?: PlaygroundChunk[];
};

type ResultTreeNode = {
  children: ResultTreeNode[];
  depth: number;
  displayName: string;
  fileKind: ResultFileKind;
  kind: "directory" | "file";
  name: string;
  path: string;
};

type DirectoryCounts = {
  images: number;
  tables: number;
};

type PreviewState =
  | {
      entries: ResultTreeNode[];
      entry: ResultTreeNode;
      status: "directory";
    }
  | {
      entry: ResultTreeNode;
      message: string;
      status: "error";
    }
  | {
      entry: ResultTreeNode;
      status: "image";
      src: string;
    }
  | {
      entry: ResultTreeNode;
      status: "loading";
    }
  | {
      content: string;
      entry: ResultTreeNode;
      language: PreviewLanguage;
      status: "text";
    };

type HeroDemoFile = {
  extension: string;
  fileId: string;
  fileName: string;
  interactive: boolean;
  sampleId?: PlaygroundSampleId;
  style: CSSProperties;
  tone: { background: string; text: string };
};

const playgroundSamples: Record<PlaygroundSampleId, PlaygroundSample> = {
  atlas: {
    cardLabel: "EN Atlas Technical Handbook Rev Aug 2013.pdf",
    extension: ".pdf",
    id: "atlas",
    modalLabel: "EN Atlas Technical Handbook Rev Aug 2013.pdf",
    pdfPath: "/playground-files/atlas/EN_Atlas_Technical_Handbook_rev_Aug_2013.pdf",
    resultRoot: "/playground-files/atlas/parse-result-EN_Atlas_Technical_Handbook_rev_Aug_2013",
    rootEntries: ["chunks.json", "hierarchy.json", "hierarchy_slim.json", "images", "tables"],
    style: {
      left: "calc(50% - clamp(59px, 7vw, 71px))",
      top: "calc(50% + clamp(26px, 3.5vh, 38px))",
    },
    tone: { background: "#fb2c36", text: "#fef2f2" },
  },
  epstein: {
    cardLabel: "Epstein Flight Logs.pdf",
    extension: ".pdf",
    id: "epstein",
    modalLabel: "Epstein Flight Logs.pdf",
    pdfPath: "/playground-files/epstein/Epstein_Flight_Logs.pdf",
    previewOverrides: {
      "chunks.json": {
        content: epsteinChunksPreview,
        language: "json",
      },
    },
    resultRoot: "/playground-files/epstein/parse-result-Epstein_Flight_Logs",
    rootEntries: ["chunks.json", "doc_nav.json", "full.md", "manifest.json", "tables"],
    style: {
      left: "calc(50% + clamp(59px, 7vw, 71px))",
      top: "calc(50% + clamp(25px, 3.5vh, 37px))",
    },
    tone: { background: "#00b8db", text: "#ecfeff" },
  },
  tsla: {
    cardLabel: "Tesla Q4 2025 Update.pdf",
    extension: ".pdf",
    id: "tsla",
    modalLabel: "Tesla Q4 2025 Update.pdf",
    pdfPath: "/playground-files/tsla/Tesla-Q4-2025-Update.pdf",
    previewOverrides: {
      "chunks.json": {
        content: tslaChunksPreview,
        language: "json",
      },
    },
    resultRoot: "/playground-files/tsla/parse-result-tsla-q4-2025",
    rootEntries: [
      "chunks.json",
      "full.md",
      "hierarchy_view.html",
      "hierarchy.json",
      "images",
      "kb.csv",
      "manifest.json",
      "tables",
    ],
    style: {
      left: "50%",
      top: "calc(50% - clamp(36px, 4.5vh, 48px))",
    },
    tone: { background: "#fb2c36", text: "#fef2f2" },
  },
};

const heroFieldPatternStyle: CSSProperties = {
  backgroundImage: "radial-gradient(rgba(228,228,231,0.9) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
};

const dragFieldStripeStyle: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 7px)",
};

const heroDemoFiles: readonly HeroDemoFile[] = [
  {
    extension: playgroundSamples.atlas.extension,
    fileId: playgroundSamples.atlas.id,
    fileName: playgroundSamples.atlas.cardLabel,
    interactive: true,
    sampleId: playgroundSamples.atlas.id,
    style: playgroundSamples.atlas.style,
    tone: playgroundSamples.atlas.tone,
  },
  {
    extension: playgroundSamples.epstein.extension,
    fileId: playgroundSamples.epstein.id,
    fileName: playgroundSamples.epstein.cardLabel,
    interactive: true,
    sampleId: playgroundSamples.epstein.id,
    style: playgroundSamples.epstein.style,
    tone: playgroundSamples.epstein.tone,
  },
  {
    extension: playgroundSamples.tsla.extension,
    fileId: playgroundSamples.tsla.id,
    fileName: playgroundSamples.tsla.cardLabel,
    interactive: true,
    sampleId: playgroundSamples.tsla.id,
    style: playgroundSamples.tsla.style,
    tone: playgroundSamples.tsla.tone,
  },
] as const;

const formatBytes = (value: number) => {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

const sortFilePaths = (left: string, right: string) =>
  left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });

const encodeResultPath = (sample: PlaygroundSample, relativePath: string) =>
  `${sample.resultRoot}/${relativePath.split("/").map(encodeURIComponent).join("/")}`;

const getFileKind = (name: string, kind: ResultTreeNode["kind"]): ResultFileKind => {
  if (kind === "directory") {
    return "directory";
  }

  if (name.endsWith(".json")) {
    return "json";
  }

  if (name.endsWith(".md")) {
    return "markdown";
  }

  if (name.endsWith(".html")) {
    return "html";
  }

  if (name.endsWith(".csv")) {
    return "csv";
  }

  if (/\.(jpg|jpeg|png|webp)$/i.test(name)) {
    return "image";
  }

  return "unknown";
};

const getPreviewLanguage = (fileKind: ResultFileKind): PreviewLanguage => {
  if (fileKind === "json") {
    return "json";
  }

  if (fileKind === "markdown") {
    return "markdown";
  }

  if (fileKind === "html") {
    return "markup";
  }

  return "text";
};

const humanReadableLabels: Record<string, string> = {
  "chunks.json": "Document Data",
  "doc_nav.json": "Navigation",
  "full.md": "Full Text",
  "hierarchy.json": "Structure",
  "hierarchy_slim.json": "Structure (Slim)",
  "hierarchy_view.html": "Document Outline",
  "kb.csv": "Knowledge Base",
  "manifest.json": "Manifest",
};

const createNode = ({
  children = [],
  depth,
  kind,
  name,
  path,
}: {
  children?: ResultTreeNode[];
  depth: number;
  kind: "directory" | "file";
  name: string;
  path: string;
}): ResultTreeNode => ({
  children,
  depth,
  displayName: humanReadableLabels[name] ?? name,
  fileKind: getFileKind(name, kind),
  kind,
  name,
  path,
});

const getDirectoryFilePaths = (
  chunksPackage: PlaygroundChunkPackage | null,
  directoryName: string
) => {
  const paths = new Set<string>();

  for (const chunk of chunksPackage?.chunks ?? []) {
    const filePath = chunk.metadata?.file_path ?? chunk.path;

    if (!filePath?.startsWith(`${directoryName}/`)) {
      continue;
    }

    paths.add(filePath);
  }

  return Array.from(paths).sort(sortFilePaths);
};

const buildResultTree = (
  sample: PlaygroundSample,
  chunksPackage: PlaygroundChunkPackage | null
): ResultTreeNode[] => {
  return sample.rootEntries.map((entry) => {
    if (!entry.includes(".")) {
      const childNodes = getDirectoryFilePaths(chunksPackage, entry).map((filePath) =>
        createNode({
          depth: 1,
          kind: "file",
          name: filePath.split("/").pop() ?? filePath,
          path: filePath,
        })
      );

      return createNode({
        children: childNodes,
        depth: 0,
        kind: "directory",
        name: entry,
        path: entry,
      });
    }

    return createNode({
      depth: 0,
      kind: "file",
      name: entry,
      path: entry,
    });
  });
};

const flattenNodes = (nodes: ResultTreeNode[]): ResultTreeNode[] =>
  nodes.flatMap((node) => [node, ...flattenNodes(node.children)]);

const useHeroPlaygroundExplorer = (sample: PlaygroundSample) => {
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({
    images: true,
    tables: false,
  });
  const [chunksPackage, setChunksPackage] = useState<PlaygroundChunkPackage | null>(null);
  const [manifest, setManifest] = useState<PlaygroundManifest | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [selectedPath, setSelectedPath] = useState(sample.rootEntries[0] ?? "chunks.json");
  const textCacheRef = useRef(new Map<string, string>());
  const tree = useMemo(() => buildResultTree(sample, chunksPackage), [chunksPackage, sample]);
  const nodesByPath = useMemo(
    () => new Map(flattenNodes(tree).map((node) => [node.path, node])),
    [tree]
  );
  const imageMetadataByPath = useMemo(
    () => new Map((manifest?.files?.images ?? []).map((image) => [image.file_path, image])),
    [manifest]
  );
  const directoryCounts = useMemo<DirectoryCounts>(
    () => ({
      images: tree.find((node) => node.path === "images")?.children.length ?? 0,
      tables: tree.find((node) => node.path === "tables")?.children.length ?? 0,
    }),
    [tree]
  );

  useEffect(() => {
    textCacheRef.current = new Map();
    setChunksPackage(null);
    setExpandedPaths({ images: true, tables: false });
    setManifest(null);
    setPreview(null);
    startTransition(() => {
      setSelectedPath(sample.rootEntries[0] ?? "chunks.json");
    });
  }, [sample]);

  useEffect(() => {
    let cancelled = false;

    const loadTree = async () => {
      try {
        const manifestPromise = sample.rootEntries.includes("manifest.json")
          ? fetch(encodeResultPath(sample, "manifest.json")).catch(() => null)
          : Promise.resolve(null);
        const [chunksResponse, manifestResponse] = await Promise.all([
          fetch(encodeResultPath(sample, "chunks.json")),
          manifestPromise,
        ]);

        if (!chunksResponse.ok) {
          throw new Error("Unable to load the sample parse package.");
        }

        const chunksData = (await chunksResponse.json()) as PlaygroundChunkPackage;
        const manifestData =
          manifestResponse?.ok === true
            ? ((await manifestResponse.json()) as PlaygroundManifest)
            : null;

        if (cancelled) {
          return;
        }

        setChunksPackage(chunksData);
        setManifest(manifestData);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unable to load the sample parse package.";
        const fallbackEntry = createNode({
          depth: 0,
          kind: "file",
          name: sample.rootEntries[0] ?? "chunks.json",
          path: sample.rootEntries[0] ?? "chunks.json",
        });

        setPreview({
          entry: fallbackEntry,
          message,
          status: "error",
        });
      }
    };

    void loadTree();

    return () => {
      cancelled = true;
    };
  }, [sample]);

  useEffect(() => {
    if (!tree.length || nodesByPath.has(selectedPath)) {
      return;
    }

    startTransition(() => {
      setSelectedPath(tree[0]?.path ?? sample.rootEntries[0] ?? "chunks.json");
    });
  }, [nodesByPath, sample.rootEntries, selectedPath, tree]);

  useEffect(() => {
    const selectedNode = nodesByPath.get(selectedPath);

    if (!selectedNode) {
      return;
    }

    if (selectedNode.kind === "directory") {
      setPreview({
        entries: selectedNode.children,
        entry: selectedNode,
        status: "directory",
      });
      return;
    }

    if (selectedNode.fileKind === "image") {
      setPreview({
        entry: selectedNode,
        src: encodeResultPath(sample, selectedNode.path),
        status: "image",
      });
      return;
    }

    const previewOverride = sample.previewOverrides?.[selectedNode.path];

    if (previewOverride) {
      setPreview({
        content: previewOverride.content,
        entry: selectedNode,
        language: previewOverride.language,
        status: "text",
      });
      return;
    }

    const cachedContent = textCacheRef.current.get(selectedNode.path);

    if (cachedContent) {
      setPreview({
        content: cachedContent,
        entry: selectedNode,
        language: getPreviewLanguage(selectedNode.fileKind),
        status: "text",
      });
      return;
    }

    let cancelled = false;

    setPreview({
      entry: selectedNode,
      status: "loading",
    });

    const loadContent = async () => {
      try {
        const response = await fetch(encodeResultPath(sample, selectedNode.path));

        if (!response.ok) {
          throw new Error(`Unable to open ${selectedNode.name}.`);
        }

        const text = await response.text();

        if (cancelled) {
          return;
        }

        textCacheRef.current.set(selectedNode.path, text);
        setPreview({
          content: text,
          entry: selectedNode,
          language: getPreviewLanguage(selectedNode.fileKind),
          status: "text",
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : `Unable to open ${selectedNode.name}.`;
        setPreview({
          entry: selectedNode,
          message,
          status: "error",
        });
      }
    };

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [nodesByPath, sample, selectedPath]);

  const handleNodeClick = (node: ResultTreeNode) => {
    if (node.kind === "directory") {
      setExpandedPaths((current) => ({
        ...current,
        [node.path]: !current[node.path],
      }));
    }

    startTransition(() => {
      setSelectedPath(node.path);
    });
  };

  return {
    directoryCounts,
    expandedPaths,
    handleNodeClick,
    imageMetadataByPath,
    preview,
    selectedPath,
    tree,
  };
};

const HeroFileCard = ({
  active,
  fileName,
  extension,
  interactive,
  onActivate,
  onPreview,
  onSampleDragEnd,
  onSampleDragMove,
  onSampleDragStart,
  dragEndSignal,
  sampleDragging,
  style,
  tone,
}: {
  active: boolean;
  extension: string;
  fileName: string;
  interactive: boolean;
  onActivate: () => void;
  onPreview: () => void;
  onSampleDragEnd: (position: { x: number; y: number }) => void;
  onSampleDragMove: (position: { x: number; y: number }) => void;
  onSampleDragStart: (position: { x: number; y: number }) => void;
  dragEndSignal: number;
  sampleDragging: boolean;
  style: CSSProperties;
  tone: { background: string; text: string };
}) => {
  const t = useTranslations("Landing.playground");
  const pointerStartRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const pointerLastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    if (dragEndSignal === 0) {
      return;
    }
    pointerStartRef.current = null;
    pointerLastPositionRef.current = null;
    setIsDragging(false);
  }, [dragEndSignal]);

  useEffect(() => {
    if (sampleDragging || !isDragging) {
      return;
    }
    pointerStartRef.current = null;
    pointerLastPositionRef.current = null;
    setIsDragging(false);
  }, [isDragging, sampleDragging]);

  const triggerActivation = () => {
    if (!interactive) {
      return;
    }
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    trackLandingInteraction("playground_sample", "playground", locale, { file_name: fileName });
    onActivate();
  };

  const triggerPreview = () => {
    onPreview();
  };

  const cardState: "dragging" | "hover" | "normal" | "selected" = isDragging
    ? "dragging"
    : active
      ? "selected"
      : isHovering
        ? "hover"
        : "normal";
  const iconStrokeColor =
    cardState === "selected"
      ? "#f87171"
      : cardState === "hover" || cardState === "dragging"
        ? "#71717a"
        : "#a1a1aa";
  const iconStrokeWidth =
    cardState === "selected" ? 2 : cardState === "hover" || cardState === "dragging" ? 1.5 : 1;

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
      {interactive ? (
        <button
          aria-label={t("fileActionAria", { fileName })}
          className={cn(
            "group relative flex flex-col items-center justify-center gap-1 border-none bg-transparent px-[10px] py-[8px] text-left transition-all duration-200 ease-out",
            "focus-visible:outline-none",
            isDragging && "cursor-grabbing opacity-60",
            !isDragging && "cursor-grab",
            cardState !== "dragging" && "hover:-translate-y-0.5"
          )}
          onBlur={() => setIsHovering(false)}
          onClick={triggerActivation}
          onDoubleClick={triggerPreview}
          onPointerDown={(event) => {
            if (!interactive || event.button !== 0) {
              return;
            }
            event.currentTarget.setPointerCapture(event.pointerId);
            pointerStartRef.current = {
              pointerId: event.pointerId,
              x: event.clientX,
              y: event.clientY,
            };
            pointerLastPositionRef.current = {
              x: event.clientX,
              y: event.clientY,
            };
          }}
          onPointerMove={(event) => {
            const pointerStart = pointerStartRef.current;
            if (!pointerStart || pointerStart.pointerId !== event.pointerId) {
              return;
            }
            pointerLastPositionRef.current = {
              x: event.clientX,
              y: event.clientY,
            };

            const dx = event.clientX - pointerStart.x;
            const dy = event.clientY - pointerStart.y;
            const travel = Math.hypot(dx, dy);

            if (!isDragging && travel > 6) {
              setIsDragging(true);
              suppressClickRef.current = true;
              onSampleDragStart({ x: event.clientX, y: event.clientY });
            }

            if (isDragging || travel > 6) {
              onSampleDragMove({ x: event.clientX, y: event.clientY });
            }
          }}
          onPointerUp={(event) => {
            const pointerStart = pointerStartRef.current;
            if (!pointerStart || pointerStart.pointerId !== event.pointerId) {
              return;
            }

            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            pointerStartRef.current = null;
            pointerLastPositionRef.current = null;
            if (isDragging) {
              setIsDragging(false);
              onSampleDragEnd({ x: event.clientX, y: event.clientY });
            }
          }}
          onPointerCancel={() => {
            const pointerLastPosition = pointerLastPositionRef.current;
            pointerStartRef.current = null;
            pointerLastPositionRef.current = null;
            if (isDragging) {
              setIsDragging(false);
              onSampleDragEnd({
                x: pointerLastPosition?.x ?? 0,
                y: pointerLastPosition?.y ?? 0,
              });
            }
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          title={t("fileActionTitle")}
          type="button"
        >
          <div className="relative h-16 w-[65px]">
            <svg
              aria-hidden="true"
              className="absolute left-[7px] top-0 h-16 w-[50px]"
              fill="none"
              viewBox="0 0 51 66"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M1 65H49.8274V15.4H35.4531V1H1V65Z"
                fill="#FAFAFA"
                fillRule="evenodd"
              />
              <path
                d="M49.8274 15.4L35.4531 1V15.4H49.8274Z"
                fill={iconStrokeColor}
                className="transition-colors duration-200 ease-out"
              />
              <path
                d="M50.3271 65.5H0.5V0.5H35.6602L35.8066 0.646484L50.1816 15.0469L50.3271 15.1934V65.5Z"
                stroke={iconStrokeColor}
                strokeWidth={iconStrokeWidth}
                className="transition-all duration-200 ease-out"
              />
            </svg>
            <span
              className={cn(
                "absolute bottom-2 right-[5px] inline-flex h-5 w-10 items-center justify-center text-xs leading-4",
                monoDisplayClassName
              )}
              style={{ backgroundColor: tone.background, color: tone.text }}
            >
              {extension}
            </span>
          </div>
          <span className="max-w-[96px] text-center text-xs leading-4 font-sans text-zinc-500 transition-colors">
            {fileName}
          </span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-1 rounded-xl px-2 py-1">
          <div className="relative h-16 w-[65px]">
            <svg
              aria-hidden="true"
              className="absolute left-[7px] top-0 h-16 w-[50px]"
              fill="none"
              viewBox="0 0 51 66"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M1 65H49.8274V15.4H35.4531V1H1V65Z"
                fill="#FAFAFA"
                fillRule="evenodd"
              />
              <path
                d="M49.8274 15.4L35.4531 1V15.4H49.8274Z"
                fill={active ? "#f87171" : "#a1a1aa"}
              />
              <path
                d="M50.3271 65.5H0.5V0.5H35.6602L35.8066 0.646484L50.1816 15.0469L50.3271 15.1934V65.5Z"
                stroke={active ? "#f87171" : "#a1a1aa"}
                strokeWidth={active ? 2 : 1}
              />
            </svg>
            <span
              className={cn(
                "absolute bottom-2 right-[5px] inline-flex h-5 w-10 items-center justify-center text-xs leading-4",
                monoDisplayClassName
              )}
              style={{ backgroundColor: tone.background, color: tone.text }}
            >
              {extension}
            </span>
          </div>
          <span
            className={cn("max-w-[96px] text-center text-xs leading-4 text-zinc-900 font-sans")}
          >
            {fileName}
          </span>
        </div>
      )}
    </div>
  );
};

const DragFieldIllustration = () => {
  return (
    <div className="relative h-[72px] w-[60px]">
      <svg
        aria-hidden="true"
        className="h-[72px] w-[56px]"
        fill="none"
        viewBox="0 0 51 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M1 65H49.8274V15.4H35.4531V1H1V65Z"
          fill="#3f3f46"
          fillRule="evenodd"
        />
        <path d="M49.8274 15.4L35.4531 1V15.4H49.8274Z" fill="#52525c" />
        <path
          d="M50.3271 65.5H0.5V0.5H35.6602L35.8066 0.646484L50.1816 15.0469L50.3271 15.1934V65.5Z"
          stroke="#52525c"
        />
      </svg>
      <span className="absolute bottom-0 left-[-8px] flex size-[28px] items-center justify-center rounded-full border border-[#52525c] bg-[#27272a] text-[#9f9fa9]">
        <Plus className="size-[14px]" />
      </span>
    </div>
  );
};

const LoadingDocument = ({ fileName }: { fileName: string }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-16 w-[65px]">
        <svg
          aria-hidden="true"
          className="absolute left-[7px] top-0 h-16 w-[50px]"
          fill="none"
          viewBox="0 0 51 66"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M1 65H49.8274V15.4H35.4531V1H1V65Z"
            fill="#FAFAFA"
            fillRule="evenodd"
          />
          <path d="M49.8274 15.4L35.4531 1V15.4H49.8274Z" fill="#a1a1aa" />
          <path
            d="M50.3271 65.5H0.5V0.5H35.6602L35.8066 0.646484L50.1816 15.0469L50.3271 15.1934V65.5Z"
            stroke="#a1a1aa"
          />
        </svg>
        <span
          className={cn(
            "absolute bottom-2 right-[5px] inline-flex h-5 w-10 items-center justify-center bg-[#fb2c36] text-xs leading-4 text-[#fef2f2]",
            monoDisplayClassName
          )}
        >
          .pdf
        </span>
      </div>
      <span className={cn("text-xs leading-4 text-zinc-50", monoDisplayClassName)}>{fileName}</span>
    </div>
  );
};

const LoadingProgress = () => {
  const t = useTranslations("Landing.playground");

  return (
    <div className="flex w-full flex-col items-center gap-[10px] px-12">
      <div className="h-2 w-full max-w-[360px] overflow-hidden border border-[#a684ff] bg-[#7008e7]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #8e51ff 0 4px, transparent 4px 10px)",
            backgroundSize: "28px 8px",
            animation: "hero-progress-stripes 700ms linear infinite",
          }}
        />
      </div>
      <p className={cn("w-full text-center text-xs leading-4 text-zinc-200", monoDisplayClassName)}>
        {t("loading")}
      </p>
    </div>
  );
};

const PlaygroundBottomCta = () => {
  const t = useTranslations("Landing.playground");

  return (
    <div className="border-t border-[#3f3f46] px-10 py-6 min-[768px]:px-12">
      <div className="flex justify-center">
        <LandingTrackedLink
          className={cn(
            "group inline-flex h-12 items-center justify-center rounded-full border border-b-[6px] border-[#7f22fe] bg-[#8e51ff] px-6 text-sm font-medium text-[#f5f3ff] [--btn-bottom:6px] transition-[background-color,border-color,border-bottom-width] hover:border-[#7008e7] hover:bg-[#7f22fe] hover:border-b-[8px] hover:[--btn-bottom:8px] active:border-[#7008e7] active:bg-[#7008e7] active:border-b-[6px] active:[--btn-bottom:6px] font-sans"
          )}
          ctaId="playground_get_credits"
          href="/login"
          sourceSection="playground"
        >
          <span className="inline-flex h-full translate-y-1 items-center pb-[var(--btn-bottom)] transition-[padding-bottom,transform] duration-150 ease-out">
            {t("bottomCta")}
          </span>
        </LandingTrackedLink>
      </div>
    </div>
  );
};

const DefaultDragContent = () => {
  const t = useTranslations("Landing.playground");
  const steps = [
    { label: t("defaultSteps.document.label"), sub: t("defaultSteps.document.sub") },
    { label: t("defaultSteps.processing.label"), sub: t("defaultSteps.processing.sub") },
    { label: t("defaultSteps.output.label"), sub: t("defaultSteps.output.sub") },
  ] as const;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-10 py-8 text-center min-[768px]:px-12">
      <p className="w-full px-12 text-xs leading-4 text-zinc-200 font-sans overflow-hidden text-ellipsis whitespace-nowrap">
        {t("dropPrompt")}
      </p>
      <div className="flex items-center gap-0">
        {steps.map((item, index) => (
          <Fragment key={item.label}>
            <div className="min-w-[88px] overflow-hidden rounded-lg border border-[#52525c] bg-[#27272a] min-[768px]:min-w-[96px]">
              <div className="whitespace-nowrap bg-[#3f3f46] px-2 py-2 text-[11px] leading-4 text-[#9f9fa9] min-[768px]:px-3 min-[768px]:text-xs">
                {item.label}
              </div>
              <div className="px-3 py-1.5 text-xs leading-4 text-[#71717b]">{item.sub}</div>
            </div>
            {index < 2 ? <div className="-mx-[2px] h-px w-3 bg-[#52525c]" /> : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const TargetDragContent = () => {
  const t = useTranslations("Landing.playground");

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-10 py-8 text-center min-[768px]:px-12">
      <DragFieldIllustration />
      <p className="w-full px-12 text-xs leading-4 text-zinc-200 font-sans overflow-hidden text-ellipsis whitespace-nowrap">
        {t("dropPrompt")}
      </p>
    </div>
  );
};

const DragToParseHint = () => {
  const hintClassName: string = englishHandwritingClassName;
  const t = useTranslations("Landing.playground");

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden text-zinc-500"
    >
      <div className="absolute left-1/2 top-[13px] flex -translate-x-1/2 -rotate-[1.5deg] flex-col items-center text-center min-[768px]:left-[28%] min-[768px]:translate-x-0 min-[1024px]:left-[30%] min-[1024px]:top-[18px]">
        <div className="relative inline-block">
          <p
            className={cn(
              "text-[29px] font-normal leading-none tracking-normal text-current opacity-90 min-[768px]:text-[32px] min-[1024px]:text-[36px]",
              hintClassName
            )}
          >
            {t("dragToParse")}
          </p>
          <svg
            aria-hidden="true"
            className="absolute left-full top-[0.6em] h-12 w-16 translate-x-2 overflow-visible text-current opacity-75 min-[768px]:h-14 min-[768px]:w-[74px] min-[768px]:translate-x-3 min-[1024px]:h-16 min-[1024px]:w-20 min-[1024px]:translate-x-4"
            fill="none"
            viewBox="0 0 80 64"
          >
            <title>Drag direction arrow</title>
            <path
              d="M4 12C29 10 49 26 52 48"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M45 42C49 44 52 48 55 54C58 48 61 44 65 42"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const TreeNodeIcon = ({ fileKind, open }: { fileKind: ResultFileKind; open?: boolean }) => {
  if (fileKind === "directory") {
    const DirectoryIcon = open ? FolderOpen : Folder;
    return <DirectoryIcon className="size-4 text-[#a78bfa]" strokeWidth={1.8} />;
  }

  if (fileKind === "json") {
    return <FileJson2 className="size-4 text-[#60a5fa]" strokeWidth={1.8} />;
  }

  if (fileKind === "markdown") {
    return <FileText className="size-4 text-[#c4b4ff]" strokeWidth={1.8} />;
  }

  if (fileKind === "html") {
    return <FileCode2 className="size-4 text-[#f59e0b]" strokeWidth={1.8} />;
  }

  if (fileKind === "csv") {
    return <FileSpreadsheet className="size-4 text-[#84cc16]" strokeWidth={1.8} />;
  }

  if (fileKind === "image") {
    return <FileImage className="size-4 text-[#22d3ee]" strokeWidth={1.8} />;
  }

  return <FileText className="size-4 text-[#d4d4d8]" strokeWidth={1.8} />;
};

const ResultTree = ({
  expandedPaths,
  onNodeClick,
  selectedPath,
  tree,
}: {
  expandedPaths: Record<string, boolean>;
  onNodeClick: (node: ResultTreeNode) => void;
  selectedPath: string;
  tree: ResultTreeNode[];
}) => {
  const renderNode = (node: ResultTreeNode) => {
    const isDirectory = node.kind === "directory";
    const isExpanded = Boolean(expandedPaths[node.path]);
    const isSelected = selectedPath === node.path;

    return (
      <Fragment key={node.path}>
        <button
          className={cn(
            "group flex h-9 w-full items-center gap-1.5 overflow-hidden rounded-r-md border-l-2 px-2 py-0.5 text-left transition-all duration-150 hover:bg-[#3f3f46]",
            isSelected
              ? "border-l-[#a78bfa] bg-[#3f3f46]/80 text-zinc-100"
              : "border-l-transparent hover:border-l-zinc-600"
          )}
          onClick={() => onNodeClick(node)}
          type="button"
        >
          <div
            className="flex min-w-0 flex-1 items-center gap-1 cursor-pointer select-none"
            style={{ paddingLeft: `${node.depth * 28}px` }}
          >
            <TreeNodeIcon fileKind={node.fileKind} open={isExpanded} />
            <span
              className={cn(
                "min-w-0 truncate text-xs leading-4 transition-colors duration-150",
                isSelected ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-200"
              )}
            >
              {node.displayName}
            </span>
          </div>
          {isDirectory ? (
            <ChevronRight
              className={cn(
                "size-3.5 shrink-0 text-[#a1a1aa] transition-transform",
                isExpanded && "rotate-90"
              )}
              strokeWidth={2}
            />
          ) : null}
        </button>
        {isDirectory && isExpanded ? node.children.map(renderNode) : null}
      </Fragment>
    );
  };

  return <>{tree.map(renderNode)}</>;
};

const DirectoryPreview = ({
  directoryCounts,
  entry,
}: {
  directoryCounts: DirectoryCounts;
  entry: ResultTreeNode;
}) => {
  const t = useTranslations("Landing.playground");
  const itemCount = entry.children.length;
  const helperText =
    entry.path === "images"
      ? t("directoryPreview.imagesHelper")
      : entry.path === "tables"
        ? t("directoryPreview.tablesHelper")
        : t("directoryPreview.defaultHelper");

  return (
    <div className="min-w-max p-5 text-zinc-100">
      <div className="flex flex-col gap-2">
        <span
          className={cn(
            "text-[11px] uppercase tracking-[0.16em] text-[#8e51ff]",
            monoDisplayClassName
          )}
        >
          {t("directoryPreview.folder")}
        </span>
        <h3 className={cn("text-lg leading-6 text-white", monoDisplayClassName)}>{entry.name}</h3>
        <p className="max-w-[420px] text-sm leading-6 text-zinc-400">{helperText}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs leading-5 text-zinc-300">
          {t("directoryPreview.files", { count: itemCount })}
        </span>
        {entry.path === "images" ? (
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs leading-5 text-zinc-300">
            {t("directoryPreview.extractedImages", { count: directoryCounts.images })}
          </span>
        ) : null}
        {entry.path === "tables" ? (
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs leading-5 text-zinc-300">
            {t("directoryPreview.renderedTables", { count: directoryCounts.tables })}
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid min-w-[380px] gap-2">
        {entry.children.map((child) => (
          <div
            key={child.path}
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2"
          >
            <TreeNodeIcon fileKind={child.fileKind} />
            <span className="truncate text-sm leading-5 text-zinc-300">{child.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TextPreview = ({ content, language }: { content: string; language: PreviewLanguage }) => {
  if (language === "text") {
    return (
      <pre
        className={cn("min-w-max p-4 text-[13px] leading-5 text-zinc-100", monoReadableClassName)}
      >
        {content}
      </pre>
    );
  }

  return (
    <Highlight code={content} language={language} theme={themes.vsDark}>
      {({ className, getLineProps, getTokenProps, tokens }) => (
        <pre
          className={cn(
            className,
            "min-w-max bg-transparent p-4 text-[12px] leading-4",
            monoDisplayClassName
          )}
        >
          {tokens.map((line, lineIndex) => (
            <div key={`line-${lineIndex + 1}`} {...getLineProps({ line })}>
              {line.map((token, tokenIndex) => (
                <span
                  key={`token-${lineIndex + 1}-${tokenIndex + 1}`}
                  {...getTokenProps({ token })}
                />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

const ResultPreview = ({
  directoryCounts,
  imageMetadataByPath,
  preview,
}: {
  directoryCounts: DirectoryCounts;
  imageMetadataByPath: Map<string, PlaygroundImageMetadata>;
  preview: PreviewState | null;
}) => {
  const t = useTranslations("Landing.playground");

  if (!preview) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-zinc-500">
        {t("preview.preparing")}
      </div>
    );
  }

  if (preview.status === "loading") {
    return (
      <div className="flex h-full items-center justify-center gap-3 px-6 text-sm leading-6 text-zinc-400">
        <Loader2 className="size-4 animate-spin" />
        {t("preview.opening", { fileName: preview.entry.name })}
      </div>
    );
  }

  if (preview.status === "error") {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="max-w-[360px] rounded-xl border border-[#7f1d1d] bg-[#2b0d12] p-4 text-left">
          <p className={cn("text-sm leading-5 text-[#fda4af]", monoDisplayClassName)}>
            {t("preview.errorTitle")}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#fecdd3]">{preview.message}</p>
        </div>
      </div>
    );
  }

  if (preview.status === "directory") {
    return <DirectoryPreview directoryCounts={directoryCounts} entry={preview.entry} />;
  }

  if (preview.status === "image") {
    const metadata = imageMetadataByPath.get(preview.entry.path);
    const imageWidth = metadata?.width;
    const imageHeight = metadata?.height;
    const imageSizeBytes = metadata?.size_bytes;
    const hasDimensions = typeof imageWidth === "number" && typeof imageHeight === "number";
    const hasFileSize = typeof imageSizeBytes === "number";

    return (
      <div className="flex h-full w-full flex-col p-4">
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          <Image
            alt={preview.entry.name}
            className="block h-auto max-h-full w-auto max-w-full"
            height={metadata?.height ?? 900}
            src={preview.src}
            unoptimized
            width={metadata?.width ?? 1600}
          />
        </div>
        {hasDimensions || hasFileSize ? (
          <div className="mt-auto flex flex-wrap gap-3 pt-4">
            {hasDimensions ? (
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs leading-5 text-zinc-300">
                {imageWidth} x {imageHeight}
              </span>
            ) : null}
            {hasFileSize ? (
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs leading-5 text-zinc-300">
                {formatBytes(imageSizeBytes)}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return <TextPreview content={preview.content} language={preview.language} />;
};

const ResultState = ({
  directoryCounts,
  expandedPaths,
  handleNodeClick,
  imageMetadataByPath,
  preview,
  selectedPath,
  sourceLabel,
  tree,
}: {
  directoryCounts: DirectoryCounts;
  expandedPaths: Record<string, boolean>;
  handleNodeClick: (node: ResultTreeNode) => void;
  imageMetadataByPath: Map<string, PlaygroundImageMetadata>;
  preview: PreviewState | null;
  selectedPath: string;
  sourceLabel: string;
  tree: ResultTreeNode[];
}) => {
  const t = useTranslations("Landing.playground");
  const treeViewportRef = useRef<HTMLDivElement | null>(null);
  const [hasTreeScrollbar, setHasTreeScrollbar] = useState(false);

  useEffect(() => {
    const viewport = treeViewportRef.current;
    if (!viewport) {
      return;
    }

    const updateTreeScrollbarState = () => {
      setHasTreeScrollbar(viewport.scrollHeight > viewport.clientHeight + 1);
    };

    updateTreeScrollbarState();

    const resizeObserver = new ResizeObserver(updateTreeScrollbarState);
    resizeObserver.observe(viewport);

    const mutationObserver = new MutationObserver(updateTreeScrollbarState);
    mutationObserver.observe(viewport, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("resize", updateTreeScrollbarState);
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", updateTreeScrollbarState);
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 items-stretch overflow-hidden bg-[#18181b]">
      <aside className="flex h-full min-h-0 w-[160px] shrink-0 flex-col border-r border-[#3f3f46] bg-[#27272a]">
        <div className="shrink-0 border-b border-[#3f3f46] px-2 py-1.5">
          <span className="block truncate text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            {t("resultSource")}
          </span>
          <span className="block truncate text-xs text-zinc-200" title={sourceLabel}>
            {sourceLabel}
          </span>
        </div>
        <ScrollAreaPrimitive.Root
          type="auto"
          className="relative min-h-0 flex-1 w-full overflow-hidden"
        >
          <ScrollAreaPrimitive.Viewport
            className={cn("h-full w-full", hasTreeScrollbar && "pr-2")}
            ref={treeViewportRef}
          >
            <ResultTree
              expandedPaths={expandedPaths}
              onNodeClick={handleNodeClick}
              selectedPath={selectedPath}
              tree={tree}
            />
          </ScrollAreaPrimitive.Viewport>
          <ScrollAreaPrimitive.ScrollAreaScrollbar
            orientation="vertical"
            className="z-30 flex w-2 touch-none select-none border-l border-[#3f3f46] bg-[#27272a]"
          >
            <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-[#52525b] transition-colors hover:bg-[#71717a] active:bg-[rgb(113_113_122_/_60%)]" />
          </ScrollAreaPrimitive.ScrollAreaScrollbar>
          <ScrollAreaPrimitive.Corner className="bg-[#27272a]" />
        </ScrollAreaPrimitive.Root>
      </aside>
      <div className="h-full min-h-0 min-w-0 flex-1 bg-[#18181b]">
        <ScrollAreaPrimitive.Root type="auto" className="relative h-full w-full overflow-hidden">
          <ScrollAreaPrimitive.Viewport className="h-full w-full">
            <ResultPreview
              directoryCounts={directoryCounts}
              imageMetadataByPath={imageMetadataByPath}
              preview={preview}
            />
          </ScrollAreaPrimitive.Viewport>
          <ScrollAreaPrimitive.ScrollAreaScrollbar
            orientation="vertical"
            className="z-30 flex w-2 touch-none select-none border-l border-[#3f3f46] bg-[#18181b]"
          >
            <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-[#52525b] transition-colors hover:bg-[#71717a] active:bg-[rgb(113_113_122_/_60%)]" />
          </ScrollAreaPrimitive.ScrollAreaScrollbar>
          <ScrollAreaPrimitive.ScrollAreaScrollbar
            orientation="horizontal"
            className="z-30 flex h-2 touch-none select-none border-t border-[#3f3f46] bg-[#18181b]"
          >
            <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-[#52525b] transition-colors hover:bg-[#71717a] active:bg-[rgb(113_113_122_/_60%)]" />
          </ScrollAreaPrimitive.ScrollAreaScrollbar>
          <ScrollAreaPrimitive.Corner className="bg-[#18181b]" />
        </ScrollAreaPrimitive.Root>
      </div>
    </div>
  );
};

const DragGhost = ({
  extension,
  fileName,
  ghostRef,
  isDropTarget,
  tone,
}: {
  extension: string;
  fileName: string;
  ghostRef: RefObject<HTMLDivElement | null>;
  isDropTarget: boolean;
  tone: { background: string; text: string };
}) => {
  return (
    <div
      ref={ghostRef}
      className="pointer-events-none fixed left-0 top-0 z-[120] -translate-x-1/2 -translate-y-1/2 opacity-80"
      style={{ transform: "translate(-9999px, -9999px) translate(-50%, -50%)" }}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-1 transition-transform duration-150 ease-out",
          isDropTarget ? "rotate-[-15deg]" : "rotate-0"
        )}
      >
        <div className="relative h-16 w-[65px] [filter:drop-shadow(0_20px_25px_rgba(0,0,0,0.18))_drop-shadow(0_10px_10px_rgba(0,0,0,0.1))]">
          <svg
            aria-hidden="true"
            className="absolute left-[7px] top-0 h-16 w-[50px]"
            fill="none"
            viewBox="0 0 51 66"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M1 65H49.8274V15.4H35.4531V1H1V65Z"
              fill="#FAFAFA"
              fillRule="evenodd"
            />
            <path d="M49.8274 15.4L35.4531 1V15.4H49.8274Z" fill="#71717a" />
            <path
              d="M50.3271 65.5H0.5V0.5H35.6602L35.8066 0.646484L50.1816 15.0469L50.3271 15.1934V65.5Z"
              stroke="#71717a"
              strokeWidth="1.5"
            />
          </svg>
          <span
            className={cn(
              "absolute bottom-2 right-[5px] inline-flex h-5 w-10 items-center justify-center text-xs leading-4",
              monoDisplayClassName
            )}
            style={{ backgroundColor: tone.background, color: tone.text }}
          >
            {extension}
          </span>
        </div>
        <span
          className={cn(
            "max-w-[96px] text-center text-xs leading-4 font-sans transition-colors",
            isDropTarget ? "text-zinc-500" : "text-zinc-900"
          )}
        >
          {fileName}
        </span>
      </div>
    </div>
  );
};

export const HeroPlayground = () => {
  const t = useTranslations("Landing.playground");
  const locale = useLocale();
  const [activeSampleId, setActiveSampleId] = useState<PlaygroundSampleId | null>(null);
  const [parsedSampleId, setParsedSampleId] = useState<PlaygroundSampleId>("tsla");
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [isSampleDragging, setIsSampleDragging] = useState(false);
  const [dragPreviewSampleId, setDragPreviewSampleId] = useState<PlaygroundSampleId | null>(null);
  const [panelStage, setPanelStage] = useState<PlaygroundStage>("default");
  const [previewSampleId, setPreviewSampleId] = useState<PlaygroundSampleId | null>(null);
  const [dragEndSignal, setDragEndSignal] = useState(0);
  const dropZoneRef = useRef<HTMLElement | null>(null);
  const dragGhostRef = useRef<HTMLDivElement | null>(null);
  const dragEndHandledRef = useRef(false);
  const stageBeforeTargetRef = useRef<PlaygroundStage>("default");
  const stageTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const currentSample = playgroundSamples[parsedSampleId];
  const previewSample = previewSampleId ? playgroundSamples[previewSampleId] : null;
  const {
    directoryCounts,
    expandedPaths,
    handleNodeClick,
    imageMetadataByPath,
    preview,
    selectedPath,
    tree,
  } = useHeroPlaygroundExplorer(currentSample);

  useEffect(() => {
    return () => {
      stageTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const resetStageTimers = useCallback(() => {
    stageTimeoutsRef.current.forEach(clearTimeout);
    stageTimeoutsRef.current = [];
  }, []);

  const restoreStageBeforeTarget = useCallback(() => {
    setIsDropTarget(false);
    setPanelStage((previous) => (previous === "target" ? stageBeforeTargetRef.current : previous));
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      restoreStageBeforeTarget();

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [restoreStageBeforeTarget]);

  const parseSampleFromDrop = useCallback(
    (sampleId: PlaygroundSampleId) => {
      const sample = playgroundSamples[sampleId];
      trackLandingInteraction("playground_parse_started", "playground", locale, {
        file_name: sample.cardLabel,
        sample_id: sampleId,
      });
      trackAnalyticsEvent({
        fileName: sample.cardLabel,
        name: "playground.parse_started",
        timestamp: new Date().toISOString(),
      });

      setActiveSampleId(sampleId);
      setParsedSampleId(sampleId);
      setIsDropTarget(false);
      setDragPreviewSampleId(null);
      resetStageTimers();
      setPanelStage("parsing");

      stageTimeoutsRef.current.push(
        setTimeout(() => {
          setPanelStage("parsed");
        }, 1800)
      );
    },
    [locale, resetStageTimers]
  );

  const applyGhostPosition = useCallback((x: number, y: number) => {
    if (dragGhostRef.current) {
      dragGhostRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }
  }, []);

  const hideGhostImmediately = useCallback(() => {
    if (dragGhostRef.current) {
      dragGhostRef.current.style.transform = "translate(-9999px, -9999px) translate(-50%, -50%)";
    }
    flushSync(() => {
      setDragPreviewSampleId(null);
    });
  }, []);

  const isInsideDropZone = useCallback((x: number, y: number) => {
    const zone = dropZoneRef.current;
    if (!zone) {
      return false;
    }
    const rect = zone.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }, []);

  const handleSampleDragStart = (
    position: { x: number; y: number },
    sampleId: PlaygroundSampleId
  ) => {
    dragEndHandledRef.current = false;
    setIsSampleDragging(true);
    setDragPreviewSampleId(sampleId);
    applyGhostPosition(position.x, position.y);
  };

  const handleSampleDragMove = useCallback(
    (position: { x: number; y: number }) => {
      if (!isSampleDragging) {
        return;
      }
      applyGhostPosition(position.x, position.y);
      const isInside = isInsideDropZone(position.x, position.y);
      if (isInside) {
        setIsDropTarget(true);
        setPanelStage((previous) => {
          if (previous !== "target") {
            stageBeforeTargetRef.current = previous;
            return "target";
          }
          return previous;
        });
      } else {
        restoreStageBeforeTarget();
      }
    },
    [applyGhostPosition, isInsideDropZone, isSampleDragging, restoreStageBeforeTarget]
  );

  const handleSampleDragEnd = useCallback(
    (position: { x: number; y: number }) => {
      if (dragEndHandledRef.current) {
        return;
      }
      dragEndHandledRef.current = true;
      setDragEndSignal((signal) => signal + 1);
      const droppedSampleId = dragPreviewSampleId;
      setIsSampleDragging(false);
      hideGhostImmediately();

      if (droppedSampleId && isInsideDropZone(position.x, position.y)) {
        parseSampleFromDrop(droppedSampleId);
        return;
      }

      restoreStageBeforeTarget();
    },
    [
      dragPreviewSampleId,
      hideGhostImmediately,
      isInsideDropZone,
      parseSampleFromDrop,
      restoreStageBeforeTarget,
    ]
  );

  useEffect(() => {
    if (!dragPreviewSampleId) {
      return;
    }

    const handleWindowPointerMove = (event: PointerEvent) => {
      handleSampleDragMove({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
    };
  }, [dragPreviewSampleId, handleSampleDragMove]);

  useEffect(() => {
    if (!isSampleDragging) {
      return;
    }

    const handleEscapeCancel = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      setIsSampleDragging(false);
      hideGhostImmediately();
      restoreStageBeforeTarget();
    };

    window.addEventListener("keydown", handleEscapeCancel);
    return () => {
      window.removeEventListener("keydown", handleEscapeCancel);
    };
  }, [hideGhostImmediately, isSampleDragging, restoreStageBeforeTarget]);

  useEffect(() => {
    if (!isSampleDragging) {
      return;
    }

    const handleWindowPointerEnd = (event: PointerEvent) => {
      handleSampleDragEnd({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointerup", handleWindowPointerEnd);
    window.addEventListener("pointercancel", handleWindowPointerEnd);
    return () => {
      window.removeEventListener("pointerup", handleWindowPointerEnd);
      window.removeEventListener("pointercancel", handleWindowPointerEnd);
    };
  }, [handleSampleDragEnd, isSampleDragging]);

  return (
    <>
      <div className="grid grid-cols-2 max-[767px]:grid-cols-1">
        <div
          className="relative h-[320px] border-r border-t border-zinc-200 bg-white min-[768px]:h-[420px] max-[767px]:border-b max-[767px]:border-r-0"
          style={heroFieldPatternStyle}
        >
          <DragToParseHint />
          <div className="relative h-full">
            {heroDemoFiles.map((file) => (
              <HeroFileCard
                key={file.fileId}
                active={file.sampleId === activeSampleId}
                extension={file.extension}
                fileName={file.fileName}
                interactive={file.interactive}
                onActivate={() => {
                  if (file.sampleId) {
                    setActiveSampleId(file.sampleId);
                    if (panelStage !== "parsed") {
                      setParsedSampleId(file.sampleId);
                    }
                  }
                }}
                onPreview={() => {
                  if (file.sampleId) {
                    setPreviewSampleId(file.sampleId);
                  }
                }}
                onSampleDragEnd={(position) => {
                  handleSampleDragEnd(position);
                }}
                onSampleDragMove={(position) => {
                  handleSampleDragMove(position);
                }}
                onSampleDragStart={(position) => {
                  if (file.sampleId) {
                    handleSampleDragStart(position, file.sampleId);
                  }
                }}
                dragEndSignal={dragEndSignal}
                sampleDragging={isSampleDragging}
                style={file.style}
                tone={file.tone}
              />
            ))}
          </div>
        </div>

        <section
          aria-label={t("ariaLabel")}
          className={cn(
            "relative h-[320px] border-t border-zinc-200 bg-[#27272a] min-[768px]:h-[420px] min-[768px]:border-l-0 max-[767px]:border-t-0 transition-colors duration-500"
          )}
          ref={dropZoneRef}
        >
          <div className="relative flex h-full flex-col">
            <div
              className={cn(
                "relative min-h-0 flex-1 transition-[box-shadow,background-color] duration-400",
                panelStage === "target" && "shadow-[inset_0_0_0_1px_rgba(166,132,255,0.35)]",
                panelStage === "parsing" && "bg-[#202227]"
              )}
              style={dragFieldStripeStyle}
            >
              {panelStage === "default" ? (
                <div className="absolute inset-0 animate-[hero-stage-fade_300ms_cubic-bezier(0.22,1,0.36,1)]">
                  <DefaultDragContent />
                </div>
              ) : null}
              {panelStage === "target" ? (
                <div className="absolute inset-0 animate-[hero-stage-fade_240ms_cubic-bezier(0.22,1,0.36,1)]">
                  <TargetDragContent />
                </div>
              ) : null}
              {panelStage === "parsing" ? (
                <div className="absolute inset-0 flex animate-[hero-stage-fade_320ms_cubic-bezier(0.22,1,0.36,1)] flex-col items-center justify-center gap-6 px-10 py-8 min-[768px]:px-12">
                  <LoadingDocument fileName={currentSample.cardLabel} />
                  <LoadingProgress />
                </div>
              ) : null}
              {panelStage === "parsed" ? (
                <div className="absolute inset-0 animate-[hero-stage-fade_360ms_cubic-bezier(0.22,1,0.36,1)]">
                  <ResultState
                    directoryCounts={directoryCounts}
                    expandedPaths={expandedPaths}
                    handleNodeClick={handleNodeClick}
                    imageMetadataByPath={imageMetadataByPath}
                    preview={preview}
                    selectedPath={selectedPath}
                    sourceLabel={currentSample.cardLabel}
                    tree={tree}
                  />
                </div>
              ) : null}
            </div>
            <PlaygroundBottomCta />
          </div>

          {panelStage === "parsed" && isDropTarget ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center border-4 border-[#a684ff] bg-[#18181b]/82">
              <div className="rounded-full border border-[#a684ff] bg-[#27272a] px-4 py-2">
                <span className={cn("text-xs leading-4 text-[#f5f3ff]", monoDisplayClassName)}>
                  {t("replayDrop")}
                </span>
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              "pointer-events-none absolute inset-0 border-4 border-[#a684ff] transition-opacity duration-300",
              panelStage === "target"
                ? "animate-[hero-target-glow_1600ms_ease-in-out_infinite] opacity-100"
                : "opacity-0"
            )}
          />
        </section>
      </div>
      {dragPreviewSampleId ? (
        <DragGhost
          extension={playgroundSamples[dragPreviewSampleId].extension}
          fileName={playgroundSamples[dragPreviewSampleId].cardLabel}
          ghostRef={dragGhostRef}
          isDropTarget={isDropTarget}
          tone={playgroundSamples[dragPreviewSampleId].tone}
        />
      ) : null}

      <style jsx>{`
        @keyframes hero-stage-fade {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.996);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes hero-target-glow {
          0%,
          100% {
            box-shadow: inset 0 0 0 0 rgba(166, 132, 255, 0.15);
          }
          50% {
            box-shadow: inset 0 0 0 8px rgba(166, 132, 255, 0.06);
          }
        }

        @keyframes hero-progress-stripes {
          from {
            background-position-x: 0;
          }
          to {
            background-position-x: 28px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }

      `}</style>

      <Dialog
        open={previewSample !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewSampleId(null);
          }
        }}
      >
        <DialogContent className="flex h-[90vh] w-[96vw] max-w-[1100px] flex-col gap-0 overflow-hidden border-[#27272a] bg-[#18181b] p-0 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] [&>button]:text-zinc-400 [&>button]:hover:bg-zinc-800 [&>button]:hover:text-zinc-100">
          <DialogTitle className="sr-only">
            {previewSample?.modalLabel ?? currentSample.modalLabel}
          </DialogTitle>
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-5 py-4 pr-12">
            <div className="min-w-0">
              <p
                className={cn(
                  "text-[11px] uppercase tracking-[0.16em] text-[#a684ff]",
                  monoDisplayClassName
                )}
              >
                {t("samplePdf")}
              </p>
              <p className="mt-1 truncate text-sm leading-5 text-zinc-100">
                {previewSample?.modalLabel ?? currentSample.modalLabel}
              </p>
            </div>
            <LandingTrackedLink
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-4 text-xs text-zinc-200 transition-colors hover:bg-zinc-800",
                monoDisplayClassName
              )}
              ctaId="playground_open_pdf"
              external
              href={previewSample?.pdfPath ?? currentSample.pdfPath}
              sourceSection="playground"
            >
              {t("openRawPdf")}
            </LandingTrackedLink>
          </div>
          <div className="min-h-0 flex-1 bg-zinc-950">
            <iframe
              className="h-full w-full"
              src={previewSample?.pdfPath ?? currentSample.pdfPath}
              title={previewSample?.modalLabel ?? currentSample.modalLabel}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
