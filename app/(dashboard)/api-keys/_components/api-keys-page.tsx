"use client";

import { ApiKeyCreatedDialog } from "@app/(dashboard)/api-keys/_components/api-key-created-dialog";
import { ApiKeysEmptyState } from "@app/(dashboard)/api-keys/_components/api-keys-empty-state";
import { ApiKeysTable } from "@app/(dashboard)/api-keys/_components/api-keys-table";
import { CreateApiKeyDialog } from "@app/(dashboard)/api-keys/_components/create-api-key-dialog";
import { DeleteApiKeyDialog } from "@app/(dashboard)/api-keys/_components/delete-api-key-dialog";
import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  useToggleApiKey,
} from "@app/(dashboard)/api-keys/_hooks/use-api-keys";
import { LoadingSpinner } from "@components/common/loading-spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { useTimezone } from "@hooks/use-timezone";
import { useToast } from "@hooks/use-toast";
import { cn } from "@lib/utils";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { startTransition, useDeferredValue, useState } from "react";

type ExpirationDuration = "1d" | "7d" | "30d" | "365d" | "never";

type CreateFormState = {
  expirationDuration: ExpirationDuration;
  name: string;
};

const NEVER_EXPIRES_AT = "9999-12-31T23:59:59";

const DEFAULT_CREATE_FORM: CreateFormState = {
  expirationDuration: "never",
  name: "",
};

const EXPIRATION_OPTIONS: Array<{ labelKey: string; value: ExpirationDuration }> = [
  { labelKey: "exp1d", value: "1d" },
  { labelKey: "exp7d", value: "7d" },
  { labelKey: "exp30d", value: "30d" },
  { labelKey: "exp365d", value: "365d" },
  { labelKey: "expNever", value: "never" },
];

const primaryButtonClassName =
  "inline-flex h-9 items-center justify-center gap-1 border border-[#7008e7] border-b-4 bg-[#7f22fe] px-3 pb-0.5 font-mono-display text-xs font-medium leading-5 text-[#f5f3ff] transition-[transform,border-width,background-color] hover:border-b-[6px] hover:bg-[#7008e7] active:translate-y-[2px] active:border-b-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 disabled:cursor-not-allowed disabled:border-[#d6d3d1] disabled:bg-[#d6d3d1] disabled:text-[#a8a29e]";

const secondaryButtonClassName =
  "inline-flex h-9 items-center justify-center gap-1 border border-[#f4f4f5] border-b-4 bg-white px-3 pb-0.5 font-mono-display text-xs font-medium leading-5 text-[#27272a] transition-[transform,border-width,background-color] hover:border-b-[6px] hover:bg-[#fafafa] active:translate-y-[2px] active:border-b-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 disabled:cursor-not-allowed disabled:border-[#e7e5e4] disabled:bg-[#f4f4f5] disabled:text-[#a1a1a1]";

const isExpirationDuration = (value: string): value is ExpirationDuration =>
  EXPIRATION_OPTIONS.some((option) => option.value === value);

const getExpiresAtByDuration = (duration: ExpirationDuration) => {
  if (duration === "never") {
    return NEVER_EXPIRES_AT;
  }

  const date = new Date();
  date.setMilliseconds(0);

  switch (duration) {
    case "1d":
      date.setDate(date.getDate() + 1);
      break;
    case "7d":
      date.setDate(date.getDate() + 7);
      break;
    case "30d":
      date.setMonth(date.getMonth() + 1);
      break;
    case "365d":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date.toISOString().split(".")[0];
};

const getApiKeySearchValue = ({
  api_key,
  key_prefix,
  name,
}: {
  api_key?: string;
  key_prefix: string;
  name: string;
}) => {
  return `${name} ${api_key ?? ""} ${key_prefix}`.trim().toLowerCase();
};

const ApiKeysPageSkeleton = () => {
  return (
    <div className="w-full space-y-5 sm:space-y-[18px] lg:space-y-5" aria-busy="true">
      <div className="h-6 w-[240px] animate-pulse bg-[#f4f4f5]" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-9 w-full max-w-[240px] animate-pulse bg-[#f4f4f5]" />
        <div className="h-9 w-full max-w-[150px] animate-pulse bg-[#f4f4f5] sm:max-w-10 lg:max-w-[150px]" />
      </div>
      <div className="h-[294px] animate-pulse border border-[#e4e4e7] bg-white sm:h-[280px] lg:h-[294px]" />
      <div className="h-[156px] animate-pulse border border-[#e4e4e7] bg-white sm:h-[150px] lg:h-[156px]" />
      <span className="sr-only">Loading API keys</span>
    </div>
  );
};

const ApiKeysErrorState = ({
  onRetry,
  retryLabel,
  title,
}: {
  onRetry: () => void;
  retryLabel: string;
  title: string;
}) => {
  return (
    <section className="flex min-h-[220px] w-full flex-col items-center justify-center gap-5 border border-[#e4e4e7] bg-white px-6 py-12 text-center">
      <div className="space-y-2">
        <h2 className="text-base font-semibold leading-6 text-[#09090b]">{title}</h2>
      </div>
      <button type="button" className={secondaryButtonClassName} onClick={onRetry}>
        {retryLabel}
      </button>
    </section>
  );
};

export const ApiKeysPage = () => {
  const toast = useToast();
  const t = useTranslations("ApiKeys");
  const locale = useLocale();
  const { timezone } = useTimezone();

  const { data: apiKeys = [], error, isPending, refetch } = useApiKeys();
  const createMutation = useCreateApiKey();
  const toggleMutation = useToggleApiKey();
  const revokeMutation = useRevokeApiKey();

  const [searchTerm, setSearchTerm] = useQueryState("search", { defaultValue: "" });
  const deferredSearchTerm = useDeferredValue(searchTerm.trim().toLowerCase());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>(DEFAULT_CREATE_FORM);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [keyToToggle, setKeyToToggle] = useState<string | null>(null);

  const filteredApiKeys = apiKeys.filter((key) =>
    getApiKeySearchValue(key).includes(deferredSearchTerm)
  );

  const resetCreateForm = () => {
    setCreateForm({ ...DEFAULT_CREATE_FORM });
  };

  const handleCreateDialogOpenChange = (open: boolean) => {
    setIsCreateDialogOpen(open);

    if (!open) {
      resetCreateForm();
    }
  };

  const handleCreateApiKey = () => {
    const payload = {
      enabled_modules: [] as string[],
      expires_at: getExpiresAtByDuration(createForm.expirationDuration),
      name: createForm.name.trim(),
    };

    if (!payload.name) {
      return;
    }

    resetCreateForm();

    createMutation.mutate(payload, {
      onSuccess: (data) => {
        if (data?.api_key) {
          setCreatedKey(data.api_key);
        }

        toast.success(t("createSuccess"));
        handleCreateDialogOpenChange(false);
      },
      onError: (mutationError) => {
        console.error("Failed to create API key:", mutationError);
        toast.error(t("createFailed"));
      },
    });
  };

  const handleExpirationDurationChange = (value: string) => {
    if (!isExpirationDuration(value)) {
      return;
    }

    setCreateForm((currentForm) => ({ ...currentForm, expirationDuration: value }));
  };

  const handleSearchChange = (nextValue: string) => {
    startTransition(() => {
      void setSearchTerm(nextValue);
    });
  };

  const closeDeleteConfirm = () => {
    setKeyToDelete(null);
  };

  const handleRevokeKey = () => {
    if (!keyToDelete) {
      return;
    }

    revokeMutation.mutate(
      { id: keyToDelete },
      {
        onSuccess: () => {
          toast.success(t("revokeSuccess"));
          closeDeleteConfirm();
        },
        onError: (mutationError) => {
          console.error("Failed to revoke API key:", mutationError);
          toast.error(t("revokeFailed"));
        },
      }
    );
  };

  const performToggle = (keyId: string) => {
    toggleMutation.mutate(
      { id: keyId },
      {
        onSuccess: () => {
          toast.success(t("toggleSuccess"));
          setKeyToToggle(null);
        },
        onError: (mutationError) => {
          console.error("Failed to toggle API key:", mutationError);
          toast.error(t("toggleFailed"));
        },
      }
    );
  };

  const handleToggleKey = (keyId: string) => {
    const key = apiKeys.find((item) => item.id === keyId);

    if (!key) {
      return;
    }

    if (key.is_active) {
      setKeyToToggle(keyId);
      return;
    }

    performToggle(keyId);
  };

  if (isPending) {
    return <ApiKeysPageSkeleton />;
  }

  if (error) {
    return (
      <ApiKeysErrorState
        title={t("loadFailed")}
        retryLabel={t("retry")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <>
      <div className="flex w-full flex-col gap-3.5 sm:gap-[18px] lg:gap-5">
        <div className="flex flex-col gap-0.5 sm:hidden">
          <h2 className="truncate text-sm font-bold leading-[22px] text-black dark:text-[#fafafa]">
            {t("title")}
          </h2>
          <p className="text-xs leading-[18px] text-[#52525c] dark:text-[#d4d4d8]">
            {t("subtitle")}
          </p>
        </div>

        <p className="hidden text-base leading-6 text-[#09090b] dark:text-[#fafafa] sm:block sm:text-[14px] sm:leading-[22px] lg:text-base lg:leading-6">
          {t("subtitle")}
        </p>

        <div className="flex items-start justify-between">
          <label className="flex h-9 w-[240px] shrink-0 items-center gap-1 border border-[#e4e4e7] bg-white py-1.5 pl-[6px] pr-3 focus-within:ring-2 focus-within:ring-[#7f22fe]/20 dark:border-[#3f3f46] dark:bg-[#18181b] sm:gap-1 sm:pl-[6px] sm:pr-3 lg:gap-[6px] lg:pl-2 lg:pr-[14px]">
            <span className="sr-only">{t("searchPlaceholder")}</span>
            <Image
              src="/icons/api-keys/search-box.svg"
              alt=""
              aria-hidden
              width={16}
              height={16}
              className="h-4 w-3.5 shrink-0 lg:w-4"
            />
            <input
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-xs leading-[14px] text-[#09090b] outline-none placeholder:text-[#9f9fa9] focus-visible:ring-0 dark:text-[#fafafa] sm:leading-[14px] lg:leading-4"
            />
          </label>

          <button
            type="button"
            aria-label={t("createKey")}
            className={cn(
              primaryButtonClassName,
              "h-9 w-10 border-b-[3px] px-0 pb-px hover:border-b-[5px] sm:h-9 sm:w-10 sm:border-b-[3px] sm:px-0 sm:pb-px sm:hover:border-b-[5px] lg:h-9 lg:w-[150px] lg:border-b-4 lg:px-3 lg:pb-0.5 lg:hover:border-b-[6px]"
            )}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
            <span className="hidden lg:inline">{t("createKey")}</span>
          </button>
        </div>

        {filteredApiKeys.length === 0 ? (
          <ApiKeysEmptyState
            title={searchTerm ? t("noKeysFound") : t("noKeys")}
            description={searchTerm ? t("noKeysFoundDesc") : t("noKeysDesc")}
            actionLabel={searchTerm ? undefined : t("createKey")}
            onAction={searchTerm ? undefined : () => setIsCreateDialogOpen(true)}
          />
        ) : null}

        {filteredApiKeys.length > 0 ? (
          <ApiKeysTable
            apiKeys={filteredApiKeys}
            locale={locale}
            timeZone={timezone}
            onDelete={setKeyToDelete}
            onToggle={handleToggleKey}
          />
        ) : null}
      </div>

      <CreateApiKeyDialog
        open={isCreateDialogOpen}
        onOpenChange={handleCreateDialogOpenChange}
        name={createForm.name}
        expirationDuration={createForm.expirationDuration}
        expirationOptions={EXPIRATION_OPTIONS.map((option) => ({
          value: option.value,
          label: t(option.labelKey),
        }))}
        onNameChange={(name) => {
          setCreateForm((currentForm) => ({ ...currentForm, name }));
        }}
        onExpirationChange={handleExpirationDurationChange}
        onSubmit={handleCreateApiKey}
        isPending={createMutation.isPending}
      />

      <DeleteApiKeyDialog
        open={Boolean(keyToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteConfirm();
          }
        }}
        onConfirm={handleRevokeKey}
        isPending={revokeMutation.isPending}
      />

      <AlertDialog
        open={Boolean(keyToToggle)}
        onOpenChange={(open) => {
          if (!open) {
            setKeyToToggle(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-[440px] rounded-none border-[#e4e4e7] bg-white p-6">
          <AlertDialogHeader className="space-y-2 text-left">
            <AlertDialogTitle className="text-lg font-semibold leading-7 text-[#09090b]">
              {t("toggleConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-5 text-[#71717b]">
              {t("toggleConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-3 sm:flex-row sm:justify-end sm:space-x-0">
            <AlertDialogCancel
              className={cn(secondaryButtonClassName, "mt-0 w-full rounded-none sm:w-auto")}
              disabled={toggleMutation.isPending}
            >
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(primaryButtonClassName, "w-full rounded-none sm:w-auto")}
              onClick={(event) => {
                event.preventDefault();

                if (keyToToggle) {
                  performToggle(keyToToggle);
                }
              }}
              disabled={toggleMutation.isPending}
            >
              {toggleMutation.isPending ? <LoadingSpinner className="h-4 w-4" /> : null}
              <span>{t("confirmDisable")}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ApiKeyCreatedDialog
        apiKey={createdKey}
        onOpenChange={(open) => {
          if (!open) {
            setCreatedKey(null);
          }
        }}
      />
    </>
  );
};
