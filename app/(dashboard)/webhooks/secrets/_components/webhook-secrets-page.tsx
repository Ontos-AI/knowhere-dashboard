"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
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
import { trackWebhookConfigured, trackWebhookSecretRevoked } from "@lib/posthog";
import type { WebhookSecret } from "@server/external-api/webhook-secrets";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { startTransition, useDeferredValue, useState } from "react";

type SecretStatusFilter = "all" | "active" | "revoked";

const getSecretSearchValue = (secret: WebhookSecret) =>
  `${secret.secret_masked} ${secret.endpoint ?? ""}`.trim().toLowerCase();

const WebhookSecretsPageSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-[18px] lg:gap-5" aria-busy="true">
      <div className="h-[42px] w-full animate-pulse bg-[#f4f4f5] sm:h-[22px] sm:w-[420px] lg:h-6" />
      <div className="flex items-start justify-between">
        <div className="flex gap-1.5">
          <div className="h-9 w-[190px] animate-pulse bg-[#f4f4f5] sm:h-8 sm:w-[260px]" />
          <div className="h-8 w-[72px] animate-pulse bg-[#f4f4f5]" />
        </div>
        <div className="h-9 w-10 animate-pulse bg-[#f4f4f5] sm:h-8 lg:h-9 lg:w-[150px]" />
      </div>
      <div className="h-[272px] animate-pulse border border-[#e4e4e7] bg-white sm:h-[280px] lg:h-[294px]" />
      <div className="h-[142px] animate-pulse border border-[#e4e4e7] bg-white sm:h-[142px] lg:h-[148px]" />
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
      <DashboardActionButton type="button" variant="secondary" size="page" onClick={onRetry}>
        {retryLabel}
      </DashboardActionButton>
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
      trackWebhookConfigured(endpoint ?? "");
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
      trackWebhookSecretRevoked(secretToRevoke);
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
      <div className="flex w-full flex-col gap-[18px] lg:gap-5">
        <div className="flex flex-col gap-0.5 sm:hidden">
          <h2 className="truncate text-sm font-bold leading-[22px] text-black dark:text-[#fafafa]">
            {t("title")}
          </h2>
          <p className="text-xs leading-[18px] text-black dark:text-[#d4d4d8]">{t("subtitle")}</p>
        </div>

        <p className="hidden text-[14px] leading-[22px] text-[#09090b] dark:text-[#fafafa] sm:block lg:text-base lg:leading-6">
          {t("subtitle")}
        </p>

        <div className="flex items-start justify-between">
          <div className="flex gap-1.5">
            <label className="flex h-9 w-[190px] shrink-0 items-center gap-1 border border-[#e4e4e7] bg-white py-1.5 pl-[6px] pr-3 focus-within:ring-2 focus-within:ring-[#7f22fe]/20 dark:border-[#3f3f46] dark:bg-[#18181b] sm:h-8 sm:w-[260px] lg:gap-[6px] lg:pl-2 lg:pr-[14px]">
              <span className="sr-only">{t("searchPlaceholder")}</span>
              <Image
                src="/icons/api-keys/search-box.svg"
                alt=""
                aria-hidden
                width={16}
                height={16}
                className="h-4 w-3 shrink-0 sm:w-3.5 lg:w-4"
              />
              <input
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="min-w-0 flex-1 bg-transparent text-xs leading-[14px] text-[#09090b] outline-none placeholder:text-[#9f9fa9] focus-visible:ring-0 dark:text-[#fafafa]"
              />
            </label>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as SecretStatusFilter)}
            >
              <SelectTrigger className="h-9 w-[72px] rounded-none border-[#e4e4e7] bg-white pl-2 pr-[6px] text-xs leading-[14px] text-[#27272a] shadow-none ring-offset-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[#7f22fe]/20 dark:border-[#3f3f46] dark:bg-[#18181b] dark:text-[#fafafa] sm:h-8 [&>svg]:h-4 [&>svg]:w-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none border-[#e4e4e7] dark:border-[#3f3f46]">
                <SelectItem value="all">{t("filterAll")}</SelectItem>
                <SelectItem value="active">{t("filterActive")}</SelectItem>
                <SelectItem value="revoked">{t("filterRevoked")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DashboardActionButton
            type="button"
            variant="primary"
            size="page"
            className="h-9 w-10 border-b-[3px] px-0 pb-px hover:border-b-[5px] sm:h-8 sm:w-10 sm:border-b-[3px] sm:px-0 sm:pb-px sm:hover:border-b-[5px] lg:h-9 lg:w-[150px] lg:border-b-4 lg:px-3 lg:pb-0.5 lg:hover:border-b-[6px]"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
            <span className="hidden lg:inline">{t("createSecret")}</span>
          </DashboardActionButton>
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
