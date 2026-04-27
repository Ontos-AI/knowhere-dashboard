"use client";

import { CreateSecretDialog } from "@app/(dashboard)/webhooks/secrets/_components/create-secret-dialog";
import { RevokeSecretDialog } from "@app/(dashboard)/webhooks/secrets/_components/revoke-secret-dialog";
import { SecretCreatedDialog } from "@app/(dashboard)/webhooks/secrets/_components/secret-created-dialog";
import { WebhookSecretsTable } from "@app/(dashboard)/webhooks/secrets/_components/secrets-table";
import { WebhookSecretsEmptyState } from "@app/(dashboard)/webhooks/secrets/_components/webhook-secrets-empty-state";
import {
  useCreateWebhookSecret,
  useRevokeWebhookSecret,
  useWebhookSecrets,
} from "@app/(dashboard)/webhooks/secrets/_hooks/use-webhook-secrets";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { useTimezone } from "@hooks/use-timezone";
import { useToast } from "@hooks/use-toast";
import { cn } from "@lib/utils";
import type { WebhookSecret } from "@server/external-api/webhook-secrets";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { startTransition, useDeferredValue, useState } from "react";

type SecretStatusFilter = "all" | "active" | "revoked";

const primaryButtonClassName =
  "inline-flex h-9 items-center justify-center gap-1 border border-[#7008e7] border-b-4 bg-[#7f22fe] px-3 pb-0.5 font-mono-display text-xs font-medium leading-5 text-[#f5f3ff] transition-[transform,border-width,background-color] hover:border-b-[6px] hover:bg-[#7008e7] active:translate-y-[2px] active:border-b-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 disabled:cursor-not-allowed disabled:border-[#d6d3d1] disabled:bg-[#d6d3d1] disabled:text-[#a8a29e]";

const secondaryButtonClassName =
  "inline-flex h-9 items-center justify-center gap-1 border border-[#f4f4f5] border-b-4 bg-white px-3 pb-0.5 font-mono-display text-xs font-medium leading-5 text-[#27272a] transition-[transform,border-width,background-color] hover:border-b-[6px] hover:bg-[#fafafa] active:translate-y-[2px] active:border-b-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25";

const getSecretSearchValue = (secret: WebhookSecret) =>
  `${secret.secret_masked} ${secret.endpoint ?? ""}`.trim().toLowerCase();

const WebhookSecretsPageSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-5" aria-busy="true">
      <div className="h-6 w-[420px] animate-pulse bg-[#f4f4f5]" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="h-8 w-full animate-pulse bg-[#f4f4f5] sm:w-[260px]" />
          <div className="h-8 w-[72px] animate-pulse bg-[#f4f4f5]" />
        </div>
        <div className="h-9 w-full animate-pulse bg-[#f4f4f5] lg:w-[150px]" />
      </div>
      <div className="h-[294px] animate-pulse border border-[#e4e4e7] bg-white" />
      <div className="h-[148px] animate-pulse border border-[#e4e4e7] bg-white" />
      <span className="sr-only">Loading webhook secrets</span>
    </div>
  );
};

const WebhookSecretsErrorState = ({
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
      <h2 className="text-base font-semibold leading-6 text-[#09090b]">{title}</h2>
      <button type="button" className={secondaryButtonClassName} onClick={onRetry}>
        {retryLabel}
      </button>
    </section>
  );
};

export const WebhookSecretsPage = () => {
  const t = useTranslations("Webhooks");
  const locale = useLocale();
  const { timezone } = useTimezone();
  const toast = useToast();

  const { data, error, isPending, refetch } = useWebhookSecrets();
  const createMutation = useCreateWebhookSecret();
  const revokeMutation = useRevokeWebhookSecret();

  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm.trim().toLowerCase());
  const [statusFilter, setStatusFilter] = useState<SecretStatusFilter>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [isCreatedDialogOpen, setIsCreatedDialogOpen] = useState(false);
  const [secretToRevoke, setSecretToRevoke] = useState<string | null>(null);

  const secrets = data?.secrets ?? [];
  const filteredSecrets = secrets.filter((secret) => {
    const matchesSearch =
      deferredSearchTerm.length === 0 || getSecretSearchValue(secret).includes(deferredSearchTerm);
    const matchesStatus = statusFilter === "all" || secret.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isFiltering = deferredSearchTerm.length > 0 || statusFilter !== "all";

  const handleSearchChange = (nextValue: string) => {
    startTransition(() => {
      setSearchTerm(nextValue);
    });
  };

  const handleCreateSecret = async (endpoint?: string | null) => {
    try {
      const result = await createMutation.mutateAsync({ endpoint });
      setCreatedSecret(result.secret);
      setIsCreatedDialogOpen(true);
      setIsCreateDialogOpen(false);
    } catch (error: unknown) {
      console.error("Create secret error:", error);

      if (error && typeof error === "object" && "message" in error) {
        const errorMessage = String(error.message);

        if (errorMessage.includes("duplicate") || errorMessage.includes("already exists")) {
          toast.error(t("duplicateEndpointError"));
          return;
        }
      }

      toast.error(t("createFailed"));
    }
  };

  const handleConfirmRevoke = async () => {
    if (!secretToRevoke) {
      return;
    }

    try {
      await revokeMutation.mutateAsync({ id: secretToRevoke });
      setSecretToRevoke(null);
      toast.success(t("revokeSuccess"));
    } catch (error) {
      console.error("Revoke secret error:", error);
      toast.error(t("revokeFailed"));
    }
  };

  if (isPending) {
    return <WebhookSecretsPageSkeleton />;
  }

  if (error) {
    return (
      <WebhookSecretsErrorState
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
      <div className="flex w-full flex-col gap-5">
        <p className="text-base leading-6 text-[#09090b]">{t("subtitle")}</p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex h-8 w-full items-center gap-[6px] border border-[#e4e4e7] bg-white py-1.5 pl-2 pr-[14px] focus-within:ring-2 focus-within:ring-[#7f22fe]/20 sm:w-[260px]">
              <span className="sr-only">{t("searchPlaceholder")}</span>
              <Image
                src="/icons/api-keys/search-box.svg"
                alt=""
                aria-hidden
                width={16}
                height={16}
                className="h-4 w-4 shrink-0"
              />
              <input
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="min-w-0 flex-1 bg-transparent text-xs leading-4 text-[#09090b] outline-none placeholder:text-[#9f9fa9]"
              />
            </label>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as SecretStatusFilter)}
            >
              <SelectTrigger className="h-8 w-[72px] rounded-none border-[#e4e4e7] bg-white px-[10px] pr-2 text-xs leading-4 text-[#27272a] shadow-none ring-offset-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[#7f22fe]/20 [&>svg]:h-4 [&>svg]:w-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none border-[#e4e4e7]">
                <SelectItem value="all">{t("filterAll")}</SelectItem>
                <SelectItem value="active">{t("filterActive")}</SelectItem>
                <SelectItem value="revoked">{t("filterRevoked")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            className={cn(primaryButtonClassName, "w-full lg:w-[150px]")}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
            <span>{t("createSecret")}</span>
          </button>
        </div>

        {filteredSecrets.length === 0 ? (
          <WebhookSecretsEmptyState
            title={isFiltering ? t("noSecretsFound") : t("noSecrets")}
            description={isFiltering ? t("noSecretsFoundDescription") : t("noSecretsDescription")}
            actionLabel={isFiltering ? undefined : t("createSecret")}
            onAction={isFiltering ? undefined : () => setIsCreateDialogOpen(true)}
          />
        ) : (
          <WebhookSecretsTable
            locale={locale}
            onRevoke={setSecretToRevoke}
            secrets={filteredSecrets}
            timeZone={timezone ?? "UTC"}
          />
        )}
      </div>

      <CreateSecretDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateSecret={handleCreateSecret}
        isPending={createMutation.isPending}
      />

      <SecretCreatedDialog
        open={isCreatedDialogOpen}
        onOpenChange={(open) => {
          setIsCreatedDialogOpen(open);

          if (!open) {
            setCreatedSecret(null);
          }
        }}
        secret={createdSecret}
      />

      <RevokeSecretDialog
        open={secretToRevoke !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSecretToRevoke(null);
          }
        }}
        onConfirm={handleConfirmRevoke}
        isPending={revokeMutation.isPending}
      />
    </>
  );
};
