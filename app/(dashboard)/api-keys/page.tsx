"use client";

import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  useToggleApiKey,
} from "@app/(dashboard)/api-keys/_hooks/use-api-keys";
import { EmptyState } from "@components/common/empty-state";
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
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Skeleton } from "@components/ui/skeleton";
import { Switch } from "@components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Textarea } from "@components/ui/textarea";
import { useTimezone } from "@hooks/use-timezone";
import { copyToClipboard, formatDate } from "@utils/format";
import { Copy, Key, Plus, Search, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

function ApiKeysPageSkeleton() {
  return (
    <output className="space-y-6" aria-busy="true">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32 mt-4 sm:mt-0" />
      </div>

      {/* 搜索 */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-full max-w-sm" />
      </div>

      {/* API Keys列表 */}
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
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <span className="sr-only">Loading API keys...</span>
    </output>
  );
}

export default function ApiKeysPage() {
  const toast = useToast();
  const t = useTranslations("ApiKeys");
  const locale = useLocale();
  const { timezone } = useTimezone();

  // Hooks
  const { data: apiKeys = [], isPending } = useApiKeys();
  const createMutation = useCreateApiKey();
  const toggleMutation = useToggleApiKey();
  const revokeMutation = useRevokeApiKey();

  // UI State
  const [searchTerm, setSearchTerm] = useQueryState("search", { defaultValue: "" });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState({
    name: "",
    enabled_modules: [] as string[],
    expires_at: "",
  });
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showCreatedKey, setShowCreatedKey] = useState(false);
  const [expirationDuration, setExpirationDuration] = useState("never");
  // Delete confirmation state
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  // Toggle confirmation state
  const [isToggleAlertOpen, setIsToggleAlertOpen] = useState(false);
  const [keyToToggle, setKeyToToggle] = useState<string | null>(null);

  useEffect(() => {
    if (expirationDuration === "never") {
      setNewApiKey((prev) => ({ ...prev, expires_at: "9999-12-31T23:59:59" }));
      return;
    }

    const date = new Date();
    date.setMilliseconds(0);
    switch (expirationDuration) {
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
    setNewApiKey((prev) => ({ ...prev, expires_at: date.toISOString().split(".")[0] }));
  }, [expirationDuration]);

  const handleCreateApiKey = () => {
    createMutation.mutate(newApiKey, {
      onSuccess: (data) => {
        if (data?.api_key) {
          setCreatedKey(data.api_key);
          setShowCreatedKey(true);
          toast.success(t("createSuccess"));
          setIsCreateDialogOpen(false);
          setNewApiKey({ name: "", enabled_modules: [], expires_at: "" });
          setExpirationDuration("never");
        }
      },
      onError: (error) => {
        console.error("Failed to create API key:", error);
        toast.error(t("createFailed"));
      },
    });
  };

  const handleCopyKey = async (key: string) => {
    const success = await copyToClipboard(key);
    if (success) {
      toast.success(t("copySuccess"));
    } else {
      toast.error(t("copyFailed"));
    }
  };

  const confirmRevokeKey = (keyId: string) => {
    setKeyToDelete(keyId);
    setIsDeleteAlertOpen(true);
  };

  const handleRevokeKey = () => {
    if (!keyToDelete) return;

    revokeMutation.mutate(
      { id: keyToDelete },
      {
        onSuccess: () => {
          toast.success(t("revokeSuccess"));
          setIsDeleteAlertOpen(false);
          setKeyToDelete(null);
        },
        onError: (error) => {
          console.error("Failed to revoke API key:", error);
          toast.error(t("revokeFailed"));
        },
      }
    );
  };

  const handleToggleKey = (keyId: string) => {
    const key = apiKeys.find((k) => k.id === keyId);
    if (key?.is_active) {
      // If active, show confirmation dialog
      setKeyToToggle(keyId);
      setIsToggleAlertOpen(true);
      return;
    }

    // If not active (enabling), proceed directly
    performToggle(keyId);
  };

  const performToggle = (keyId: string) => {
    toggleMutation.mutate(
      { id: keyId },
      {
        onSuccess: () => {
          toast.success(t("toggleSuccess"));
          setIsToggleAlertOpen(false);
          setKeyToToggle(null);
        },
        onError: (error) => {
          console.error("Failed to toggle API key:", error);
          toast.error(t("toggleFailed"));
        },
      }
    );
  };

  const filteredApiKeys = apiKeys.filter(
    (key) =>
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.api_key?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isPending) {
    return <ApiKeysPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("createKey")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("createDialogTitle")}</DialogTitle>
                <DialogDescription>{t("createDialogDesc")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    placeholder={t("namePlaceholder")}
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires_at">{t("expiration")}</Label>
                  <Select value={expirationDuration} onValueChange={setExpirationDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectExpiration")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">{t("exp1d")}</SelectItem>
                      <SelectItem value="7d">{t("exp7d")}</SelectItem>
                      <SelectItem value="30d">{t("exp30d")}</SelectItem>
                      <SelectItem value="365d">{t("exp365d")}</SelectItem>
                      <SelectItem value="never">{t("expNever")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button
                    onClick={handleCreateApiKey}
                    disabled={createMutation.isPending || !newApiKey.name}
                  >
                    {createMutation.isPending ? t("creating") : t("create")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 搜索 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* API Keys列表 */}
      {filteredApiKeys.length === 0 ? (
        <EmptyState
          icon={<Key className="h-12 w-12 text-muted-foreground" />}
          title={searchTerm ? t("noKeysFound") : t("noKeys")}
          description={searchTerm ? t("noKeysFoundDesc") : t("noKeysDesc")}
          action={
            !searchTerm
              ? {
                  label: t("createKey"),
                  onClick: () => setIsCreateDialogOpen(true),
                }
              : undefined
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {t("title")} ({filteredApiKeys.length})
            </CardTitle>
            <CardDescription>{t("subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("apiKey")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("created")}</TableHead>
                  <TableHead>{t("lastUsed")}</TableHead>
                  <TableHead>{t("expiration")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{key.api_key}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={key.is_active}
                          onCheckedChange={() => handleToggleKey(key.id)}
                        />
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? t("active") : t("disabled")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate({
                        date: key.created_at,
                        format: "short",
                        locale,
                        timeZone: timezone,
                      })}
                    </TableCell>
                    <TableCell>
                      {key.last_used_at
                        ? formatDate({
                            date: key.last_used_at,
                            format: "relative",
                            locale,
                            timeZone: timezone,
                          })
                        : t("neverUsed")}
                    </TableCell>
                    <TableCell>
                      {key.expires_at && new Date(key.expires_at).getFullYear() < 9999
                        ? formatDate({
                            date: key.expires_at,
                            format: "long",
                            locale,
                            timeZone: timezone,
                          })
                        : t("neverExpires")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => confirmRevokeKey(key.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeMutation.isPending}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRevokeKey();
              }}
              disabled={revokeMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revokeMutation.isPending ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 禁用确认对话框 */}
      <AlertDialog open={isToggleAlertOpen} onOpenChange={setIsToggleAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("toggleConfirmTitle") || "确认禁用 API Key？"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("toggleConfirmDesc") ||
                "禁用后，使用此 Key 的应用将无法访问 API。您随时可以再次启用它。"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={toggleMutation.isPending}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (keyToToggle) performToggle(keyToToggle);
              }}
              disabled={toggleMutation.isPending}
            >
              {toggleMutation.isPending ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
              {t("disable")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 创建成功的对话框 */}
      <Dialog open={showCreatedKey} onOpenChange={setShowCreatedKey}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("createSuccess")}</DialogTitle>
            <DialogDescription>{t("copyAndSave")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("yourApiKey")}</Label>
              <div className="flex items-center space-x-2">
                <Textarea
                  value={createdKey || ""}
                  readOnly
                  className="font-mono text-sm"
                  rows={3}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => createdKey && handleCopyKey(createdKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="rounded-md border border-amber-300/70 bg-amber-50/80 p-3">
              <p className="text-sm text-amber-800">{t("securityWarning")}</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowCreatedKey(false)}>{t("iHaveSaved")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
