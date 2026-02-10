"use client";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import type { WebhookSecret } from "@server/external-api/webhook-secrets";
import { formatDate } from "@utils/format";
import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type SecretsTableProps = {
  secrets: WebhookSecret[];
  onRevoke: (id: string) => void;
  timeZone?: string;
};

export function SecretsTable({ secrets, onRevoke, timeZone = "UTC" }: SecretsTableProps) {
  const t = useTranslations("Webhooks");
  const locale = useLocale();

  if (secrets.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>{t("maskedSecret")}</TableHead>
              <TableHead>{t("endpointUrl")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                {t("noSecrets")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>{t("maskedSecret")}</TableHead>
            <TableHead>{t("endpointUrl")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("createdAt")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {secrets.map((secret) => (
            <TableRow key={secret.id}>
              <TableCell>
                <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                  {secret.secret_masked}
                </code>
              </TableCell>
              <TableCell>
                {secret.endpoint ? (
                  <span className="text-sm">{secret.endpoint}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">{t("defaultEndpoint")}</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={secret.status === "active" ? "default" : "secondary"}>
                  {secret.status === "active" ? t("statusActive") : t("statusRevoked")}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate({
                  date: secret.created_at,
                  format: "short",
                  locale,
                  timeZone,
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRevoke(secret.id)}
                  disabled={secret.status === "revoked"}
                  className="h-8 w-8 p-0"
                  aria-label={t("revokeSecret")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
