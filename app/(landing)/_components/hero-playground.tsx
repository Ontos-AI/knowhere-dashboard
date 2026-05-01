"use client";

import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog";
import { cn } from "@lib/utils";
import {
  Check,
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
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";
import {
  type CSSProperties,
  type DragEvent,
  Fragment,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const monoReadableClassName = "font-[family-name:var(--font-mono-readable)]";
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
type PlaygroundStage = "idle" | "loading" | "success" | "result";
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
    cardLabel: "Atlas Handbook.pdf",
    extension: ".pdf",
    id: "atlas",
    modalLabel: "EN Atlas Technical Handbook Rev Aug 2013.pdf",
    pdfPath: "/playground-files/atlas/EN_Atlas_Technical_Handbook_rev_Aug_2013.pdf",
    resultRoot: "/playground-files/atlas/parse-result-EN_Atlas_Technical_Handbook_rev_Aug_2013",
    rootEntries: ["chunks.json", "hierarchy.json", "hierarchy_slim.json", "images", "tables"],
    style: { left: "calc(50% - 67px)", top: "calc(50% + 31px)" },
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
    style: { left: "calc(50% + 84px)", top: "calc(50% + 29px)" },
    tone: { background: "#fb2c36", text: "#fef2f2" },
  },
  tsla: {
    cardLabel: "Tesla Q4 2025.pdf",
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
    style: { left: "calc(50% + 8.5px)", top: "calc(50% - 59px)" },
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

const isPlaygroundSampleId = (value: string): value is PlaygroundSampleId =>
  value === "atlas" || value === "epstein" || value === "tsla";

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

const getDisplayName = (sample: PlaygroundSample, path: string, fallbackName: string) => {
  if (sample.id === "tsla") {
    if (path === "hierarchy_view.html") {
      return "hierarc....html";
    }

    if (path.startsWith("images/")) {
      return "imag....jpg";
    }
  }

  return fallbackName;
};

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
  displayName: name,
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
          name: getDisplayName(sample, filePath, filePath.split("/").pop() ?? filePath),
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
      name: getDisplayName(sample, entry, entry),
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
  onSampleDragStart,
  style,
  tone,
}: {
  active: boolean;
  extension: string;
  fileName: string;
  interactive: boolean;
  onActivate: () => void;
  onPreview: () => void;
  onSampleDragEnd: () => void;
  onSampleDragStart: (event: DragEvent<HTMLButtonElement>) => void;
  style: CSSProperties;
  tone: { background: string; text: string };
}) => {
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const triggerActivation = () => {
    if (!interactive) {
      return;
    }

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      onActivate();
      clickTimeoutRef.current = null;
    }, 180);
  };

  const triggerPreview = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    onPreview();
  };

  const cardState: "dragging" | "hover" | "normal" | "selected" = isDragging
    ? "dragging"
    : active
      ? "selected"
      : isHovering
        ? "hover"
        : "normal";
  const showEmphasisIcon = cardState === "hover" || cardState === "selected";

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
      {interactive ? (
        <button
          aria-label={`${fileName}. Click to run the sample, drag it to the right, or double click to preview the PDF.`}
          className={cn(
            "group relative flex flex-col items-center justify-center gap-1 border-none bg-transparent px-[10px] py-[8px] text-left transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e51ff]/35",
            isDragging &&
              "cursor-grabbing opacity-80 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_10px_10px_-5px_rgba(0,0,0,0.04)]",
            !isDragging && "cursor-grab",
            cardState === "selected" && "rounded-[12px] border-2 border-[#3690ff] bg-[#bcdfff]",
            cardState === "hover" && "rounded-[10px] bg-[#f5f5f5]",
            cardState !== "dragging" && "hover:-translate-y-0.5"
          )}
          draggable
          onBlur={() => setIsHovering(false)}
          onClick={triggerActivation}
          onDoubleClick={triggerPreview}
          onDragEnd={() => {
            setIsDragging(false);
            onSampleDragEnd();
          }}
          onDragStart={(event) => {
            setIsDragging(true);
            onSampleDragStart(event);
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          title="Click to parse. Double click to preview the PDF."
          type="button"
        >
          <div className="relative h-16 w-[65px]">
            <Image
              alt=""
              aria-hidden="true"
              className="absolute left-[7px] top-0 h-16 w-[50px]"
              height={64}
              src={
                showEmphasisIcon
                  ? "/images/knowhere/hero-demo-page-active.svg"
                  : "/images/knowhere/hero-demo-page-default.svg"
              }
              width={50}
            />
            <span
              className={cn(
                "absolute bottom-2 right-[5px] inline-flex items-center justify-center px-1 py-0.5 text-[18px] leading-6",
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
              cardState === "dragging" ? "text-zinc-500" : "text-zinc-900"
            )}
          >
            {fileName}
          </span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-1 rounded-xl px-2 py-1">
          <div className="relative h-16 w-[65px]">
            <Image
              alt=""
              aria-hidden="true"
              className="absolute left-[7px] top-0 h-16 w-[50px]"
              height={64}
              src={
                active
                  ? "/images/knowhere/hero-demo-page-active.svg"
                  : "/images/knowhere/hero-demo-page-default.svg"
              }
              width={50}
            />
            <span
              className={cn(
                "absolute bottom-2 right-[5px] inline-flex items-center justify-center px-1 py-0.5 text-[18px] leading-6",
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
    <div className="relative flex h-[72px] w-[60px] items-end justify-center">
      <Image
        alt=""
        aria-hidden="true"
        className="h-[72px] w-[56px] opacity-65"
        height={72}
        src="/images/knowhere/hero-demo-page-default.svg"
        width={56}
      />
      <span className="absolute -bottom-1 left-[-13px] flex size-8 items-center justify-center rounded-full border border-zinc-600 bg-zinc-700 text-zinc-200 shadow-[0_8px_18px_-10px_rgba(0,0,0,0.65)]">
        <Plus className="size-4" />
      </span>
    </div>
  );
};

const LoadingDocument = ({ fileName }: { fileName: string }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-16 w-[65px]">
        <Image
          alt=""
          aria-hidden="true"
          className="absolute left-[7px] top-0 h-16 w-[50px]"
          height={64}
          src="/images/knowhere/hero-demo-page-default.svg"
          width={50}
        />
        <span
          className={cn(
            "absolute bottom-2 right-[5px] inline-flex items-center justify-center bg-[#fb2c36] px-1 py-0.5 text-[18px] leading-6 text-[#fef2f2]",
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
  return (
    <div className="flex w-full max-w-[163px] flex-col items-center gap-[10px]">
      <div className="h-2 w-full overflow-hidden border border-[#a684ff] bg-[#7008e7]">
        <div
          className="h-full w-full animate-pulse"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, rgba(255,255,255,0.18) 0 3px, transparent 3px 9px)",
          }}
        />
      </div>
      <p className={cn("text-center text-xs leading-4 text-zinc-200", monoDisplayClassName)}>
        Parsing your document into structured chunks...
      </p>
    </div>
  );
};

const SuccessState = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="flex size-12 items-center justify-center rounded-full bg-[#00d492] text-[#012a17] shadow-[0_18px_32px_-18px_rgba(0,212,146,0.85)]">
        <Check className="size-7 stroke-[3]" />
      </span>
      <p className={cn("text-xs leading-4 text-zinc-200", monoDisplayClassName)}>
        Parse completed!
      </p>
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
            "flex h-5 w-full items-center gap-1.5 overflow-hidden px-2 py-0.5 text-left transition-colors hover:bg-[#3f3f46]",
            isSelected && "bg-[#52525c]"
          )}
          onClick={() => onNodeClick(node)}
          type="button"
        >
          <div
            className="flex min-w-0 flex-1 items-center gap-1"
            style={{ paddingLeft: `${node.depth * 28}px` }}
          >
            <TreeNodeIcon fileKind={node.fileKind} open={isExpanded} />
            <span className="min-w-0 truncate text-xs leading-4 text-zinc-300">
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
  const itemCount = entry.children.length;
  const helperText =
    entry.path === "images"
      ? "Preview any extracted figure to inspect the raw image that Knowhere emitted."
      : entry.path === "tables"
        ? "Open a table file to inspect the HTML emitted for downstream use."
        : "Browse a node on the left to inspect the emitted assets.";

  return (
    <div className="min-w-max p-5 text-zinc-100">
      <div className="flex flex-col gap-2">
        <span
          className={cn(
            "text-[11px] uppercase tracking-[0.16em] text-[#8e51ff]",
            monoDisplayClassName
          )}
        >
          Folder
        </span>
        <h3 className={cn("text-lg leading-6 text-white", monoDisplayClassName)}>{entry.name}</h3>
        <p className="max-w-[420px] text-sm leading-6 text-zinc-400">{helperText}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs leading-5 text-zinc-300">
          {itemCount} files
        </span>
        {entry.path === "images" ? (
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs leading-5 text-zinc-300">
            {directoryCounts.images} extracted images
          </span>
        ) : null}
        {entry.path === "tables" ? (
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs leading-5 text-zinc-300">
            {directoryCounts.tables} rendered tables
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
            "min-w-max bg-transparent p-4 text-sm leading-5",
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
  if (!preview) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-zinc-500">
        Preparing parse results...
      </div>
    );
  }

  if (preview.status === "loading") {
    return (
      <div className="flex h-full items-center justify-center gap-3 px-6 text-sm leading-6 text-zinc-400">
        <Loader2 className="size-4 animate-spin" />
        Opening {preview.entry.name}...
      </div>
    );
  }

  if (preview.status === "error") {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="max-w-[360px] rounded-xl border border-[#7f1d1d] bg-[#2b0d12] p-4 text-left">
          <p className={cn("text-sm leading-5 text-[#fda4af]", monoDisplayClassName)}>
            Preview error
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
      <div className="min-w-max p-4">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          <Image
            alt={preview.entry.name}
            className="block h-auto max-w-none"
            height={metadata?.height ?? 900}
            src={preview.src}
            unoptimized
            width={metadata?.width ?? 1600}
          />
        </div>
        {hasDimensions || hasFileSize ? (
          <div className="mt-3 flex flex-wrap gap-3">
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
  tree,
}: {
  directoryCounts: DirectoryCounts;
  expandedPaths: Record<string, boolean>;
  handleNodeClick: (node: ResultTreeNode) => void;
  imageMetadataByPath: Map<string, PlaygroundImageMetadata>;
  preview: PreviewState | null;
  selectedPath: string;
  tree: ResultTreeNode[];
}) => {
  return (
    <div className="flex min-h-[260px] items-start overflow-hidden border border-zinc-200 bg-[#18181b]">
      <aside className="h-[260px] w-[160px] shrink-0 overflow-y-auto border-r border-zinc-700 bg-[#27272a] pt-2">
        <ResultTree
          expandedPaths={expandedPaths}
          onNodeClick={handleNodeClick}
          selectedPath={selectedPath}
          tree={tree}
        />
      </aside>
      <div className="h-[260px] min-w-0 flex-1 overflow-auto bg-[#18181b]">
        <ResultPreview
          directoryCounts={directoryCounts}
          imageMetadataByPath={imageMetadataByPath}
          preview={preview}
        />
      </div>
    </div>
  );
};

export const HeroPlayground = () => {
  const [activeSampleId, setActiveSampleId] = useState<PlaygroundSampleId>("tsla");
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [panelStage, setPanelStage] = useState<PlaygroundStage>("idle");
  const [previewSampleId, setPreviewSampleId] = useState<PlaygroundSampleId | null>(null);
  const dragDepthRef = useRef(0);
  const stageTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const currentSample = playgroundSamples[activeSampleId];
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

  const resetStageTimers = () => {
    stageTimeoutsRef.current.forEach(clearTimeout);
    stageTimeoutsRef.current = [];
  };

  const runSample = (sampleId: PlaygroundSampleId) => {
    setActiveSampleId(sampleId);
    dragDepthRef.current = 0;
    setIsDropTarget(false);
    resetStageTimers();
    setPanelStage("loading");

    stageTimeoutsRef.current.push(
      setTimeout(() => {
        setPanelStage("success");
        stageTimeoutsRef.current.push(
          setTimeout(() => {
            setPanelStage("result");
          }, 700)
        );
      }, 2000)
    );
  };

  const handleSampleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    sampleId: PlaygroundSampleId
  ) => {
    event.dataTransfer.setData("text/plain", sampleId);
    event.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDropTarget(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) {
      setIsDropTarget(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const draggedSampleId = event.dataTransfer.getData("text/plain");
    dragDepthRef.current = 0;
    setIsDropTarget(false);

    if (!isPlaygroundSampleId(draggedSampleId)) {
      return;
    }

    runSample(draggedSampleId);
  };

  return (
    <>
      <div className="grid grid-cols-2 max-[639px]:grid-cols-1 min-[640px]:max-[767px]:grid-cols-1">
        <div
          className="relative min-h-[260px] border-r border-t border-zinc-200 bg-white max-[639px]:border-b max-[639px]:border-r-0 min-[640px]:max-[767px]:border-b min-[640px]:max-[767px]:border-r-0"
          style={heroFieldPatternStyle}
        >
          <div className="relative min-h-[260px]">
            {heroDemoFiles.map((file) => (
              <HeroFileCard
                key={file.fileId}
                active={file.sampleId === activeSampleId}
                extension={file.extension}
                fileName={file.fileName}
                interactive={file.interactive}
                onActivate={() => {
                  if (file.sampleId) {
                    runSample(file.sampleId);
                  }
                }}
                onPreview={() => {
                  if (file.sampleId) {
                    setPreviewSampleId(file.sampleId);
                  }
                }}
                onSampleDragEnd={() => setIsDropTarget(false)}
                onSampleDragStart={(event) => {
                  if (file.sampleId) {
                    handleSampleDragStart(event, file.sampleId);
                  }
                }}
                style={file.style}
                tone={file.tone}
              />
            ))}
          </div>
        </div>

        <section
          aria-label="Interactive document playground"
          className={cn(
            "relative min-h-[260px] border-t bg-[#27272a] max-[639px]:border-t-0 min-[640px]:max-[767px]:border-t-0",
            panelStage === "idle" ? "border-4 border-[#a684ff]" : "border border-zinc-200"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {panelStage === "idle" ? (
            <div
              className={cn(
                "flex min-h-[260px] flex-col items-center justify-center gap-6 px-12 py-8 text-center",
                isDropTarget && "bg-[#2d213e]"
              )}
              style={dragFieldStripeStyle}
            >
              <DragFieldIllustration />
              <p className="text-xs leading-4 text-zinc-200 font-sans">
                Drop a file here or pick a sample on the left
              </p>
              <Link
                className={cn(
                  "group inline-flex h-12 items-center justify-center rounded-full border border-b-[6px] border-[#7f22fe] bg-[#8e51ff] px-6 text-sm font-medium text-[#f5f3ff] [--btn-bottom:6px] transition-[background-color,border-color,border-bottom-width] hover:border-[#7008e7] hover:bg-[#7f22fe] hover:border-b-[8px] hover:[--btn-bottom:8px] active:border-[#7008e7] active:bg-[#7008e7] active:border-b-[6px] active:[--btn-bottom:6px] font-sans"
                )}
                href="/login"
              >
                <span className="inline-flex h-full translate-y-1 items-center pb-[var(--btn-bottom)] transition-[padding-bottom,transform] duration-150 ease-out">
                  Get $5 free credits, no card
                </span>
              </Link>
            </div>
          ) : null}

          {panelStage === "loading" ? (
            <div
              className="flex min-h-[260px] flex-col items-center justify-center gap-6 px-12 py-8"
              style={dragFieldStripeStyle}
            >
              <LoadingDocument fileName={currentSample.cardLabel} />
              <LoadingProgress />
            </div>
          ) : null}

          {panelStage === "success" ? (
            <div
              className="flex min-h-[260px] flex-col items-center justify-center px-12 py-8"
              style={dragFieldStripeStyle}
            >
              <SuccessState />
            </div>
          ) : null}

          {panelStage === "result" ? (
            <ResultState
              directoryCounts={directoryCounts}
              expandedPaths={expandedPaths}
              handleNodeClick={handleNodeClick}
              imageMetadataByPath={imageMetadataByPath}
              preview={preview}
              selectedPath={selectedPath}
              tree={tree}
            />
          ) : null}

          {panelStage === "result" && isDropTarget ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center border-4 border-[#a684ff] bg-[#18181b]/82">
              <div className="rounded-full border border-[#a684ff] bg-[#27272a] px-4 py-2">
                <span className={cn("text-xs leading-4 text-[#f5f3ff]", monoDisplayClassName)}>
                  Drop to replay the sample parse
                </span>
              </div>
            </div>
          ) : null}
        </section>
      </div>

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
                Sample PDF
              </p>
              <p className="mt-1 truncate text-sm leading-5 text-zinc-100">
                {previewSample?.modalLabel ?? currentSample.modalLabel}
              </p>
            </div>
            <Link
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-4 text-xs text-zinc-200 transition-colors hover:bg-zinc-800",
                monoDisplayClassName
              )}
              href={previewSample?.pdfPath ?? currentSample.pdfPath}
              rel="noreferrer"
              target="_blank"
            >
              Open raw PDF
            </Link>
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
