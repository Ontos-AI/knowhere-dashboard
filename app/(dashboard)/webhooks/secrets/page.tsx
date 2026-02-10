"use client";

import { CreateSecretDialog } from "@app/(dashboard)/webhooks/secrets/_components/create-secret-dialog";
import { RevokeSecretDialog } from "@app/(dashboard)/webhooks/secrets/_components/revoke-secret-dialog";
import { SecretCreatedDialog } from "@app/(dashboard)/webhooks/secrets/_components/secret-created-dialog";
import { SecretsTable } from "@app/(dashboard)/webhooks/secrets/_components/secrets-table";
import {
  useCreateWebhookSecret,
  useRevokeWebhookSecret,
  useWebhookSecrets,
} from "@app/(dashboard)/webhooks/secrets/_hooks/use-webhook-secrets";
import { EmptyState } from "@components/common/empty-state";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Skeleton } from "@components/ui/skeleton";
import { useTimezone } from "@hooks/use-timezone";
import type { WebhookSecret } from "@server/external-api/webhook-secrets";
import { ChevronLeft, ChevronRight, Plus, Search, Webhook } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PAGE_SIZE = 10;

function WebhookSecretsPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32 mt-4 sm:mt-0" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-10 flex-1 max-w-sm" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <span className="sr-only">Loading webhook secrets...</span>
    </div>
  );
}

export default function WebhookSecretsPage() {
  const toast = useToast();
  const t = useTranslations("Webhooks");
  const { timezone } = useTimezone();

  // Data fetching
  const { data, isPending } = useWebhookSecrets();
  const createMutation = useCreateWebhookSecret();
  const revokeMutation = useRevokeWebhookSecret();

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "revoked">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [showCreatedDialog, setShowCreatedDialog] = useState(false);
  const [secretToRevoke, setSecretToRevoke] = useState<string | null>(null);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);

  // Filtering and Pagination
  const filteredSecrets = useMemo(() => {
    if (!data?.secrets) return [];

    return data.secrets.filter((secret: WebhookSecret) => {
      const matchesSearch =
        !searchTerm ||
        secret.endpoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        secret.secret_masked.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || secret.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data?.secrets, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredSecrets.length / PAGE_SIZE);
  const paginatedSecrets = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredSecrets.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredSecrets, currentPage]);

  // Reset to page 1 when filters change
  // biome-ignore lint/correctness/useExhaustiveDependencies: We need to reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Handlers
  const handleCreateSecret = async (endpoint?: string | null) => {
    try {
      const result = await createMutation.mutateAsync({ endpoint });
      setCreatedSecret(result.secret);
      setShowCreatedDialog(true);
      setIsCreateDialogOpen(false);
    } catch (error: unknown) {
      console.error("Create secret error:", error);
      if (error && typeof error === "object" && "message" in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage.includes("duplicate") || errorMessage.includes("already exists")) {
          toast.error(t("duplicateEndpointError"));
        } else {
          toast.error(t("createFailed"));
        }
      } else {
        toast.error(t("createFailed"));
      }
    }
  };

  const handleRevokeClick = (id: string) => {
    setSecretToRevoke(id);
    setIsRevokeDialogOpen(true);
  };

  const handleConfirmRevoke = async () => {
    if (!secretToRevoke) return;

    try {
      await revokeMutation.mutateAsync({ id: secretToRevoke });
      toast.success(t("revokeSuccess"));
      setIsRevokeDialogOpen(false);
      setSecretToRevoke(null);
    } catch (error) {
      console.error("Revoke secret error:", error);
      toast.error(t("revokeFailed"));
    }
  };

  if (isPending) {
    return <WebhookSecretsPageSkeleton />;
  }

  const hasSecrets = data?.secrets && data.secrets.length > 0;
  const hasFilteredResults = filteredSecrets.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("createSecret")}
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      {hasSecrets && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filterAll")}</SelectItem>
              <SelectItem value="active">{t("filterActive")}</SelectItem>
              <SelectItem value="revoked">{t("filterRevoked")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Secrets List */}
      {!hasSecrets ? (
        <EmptyState
          icon={<Webhook className="h-12 w-12 text-muted-foreground" />}
          title={t("noSecrets")}
          description={t("noSecretsDescription")}
          action={{
            label: t("createSecret"),
            onClick: () => setIsCreateDialogOpen(true),
          }}
        />
      ) : !hasFilteredResults ? (
        <EmptyState
          icon={<Search className="h-12 w-12 text-muted-foreground" />}
          title={t("noSecretsFound")}
          description={t("noSecretsFoundDescription")}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {t("secretsList")} ({filteredSecrets.length})
            </CardTitle>
            <CardDescription>{t("secretsListDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <SecretsTable
              secrets={paginatedSecrets}
              onRevoke={handleRevokeClick}
              timeZone={timezone}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  {t("page")} {currentPage} {t("of")} {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("previous")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t("next")}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateSecretDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateSecret={handleCreateSecret}
        isPending={createMutation.isPending}
      />

      <SecretCreatedDialog
        open={showCreatedDialog}
        onOpenChange={setShowCreatedDialog}
        secret={createdSecret}
      />

      <RevokeSecretDialog
        open={isRevokeDialogOpen}
        onOpenChange={setIsRevokeDialogOpen}
        onConfirm={handleConfirmRevoke}
        isPending={revokeMutation.isPending}
      />
    </div>
  );
}
