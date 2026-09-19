"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { trackError } from "@lib/posthog";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Component, type ReactNode } from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    trackError(error.message, {
      component_stack: errorInfo.componentStack,
      boundary: "ErrorBoundary",
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="mx-auto mt-8 max-w-md rounded-none">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>出现错误</CardTitle>
            </div>
            <CardDescription>抱歉，页面遇到了一个错误</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {this.state.error && (
              <div className="border border-border bg-muted p-3">
                <p className="font-mono text-sm text-muted-foreground">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex space-x-2">
              <DashboardActionButton onClick={this.handleReset} variant="secondary">
                <RefreshCw className="mr-2 h-4 w-4" />
                重试
              </DashboardActionButton>
              <DashboardActionButton onClick={() => window.location.reload()}>
                刷新页面
              </DashboardActionButton>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
