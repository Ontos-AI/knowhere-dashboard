import { confirmUpload, createJob, getJobStatus, listJobs } from "@server/external-api/jobs";
import { protectedProcedure } from "@server/orpc";
import { z } from "zod";

// Jobs router — manages parsing job lifecycle (create, upload, confirm, status, list)
export const jobsRouter = protectedProcedure.router({
  // Create a new parsing job
  create: protectedProcedure
    .input(
      z.object({
        source_type: z.string(),
        file_name: z.string().optional(),
        url: z.string().optional(),
        text: z.string().optional(),
        data_id: z.string().optional(),
        parsing_params: z.record(z.string(), z.any()).optional(),
        webhook: z.object({ url: z.string(), secret: z.string() }).optional(),
        webhook_url: z.string().optional(),
        result_mode: z.enum(["auto", "inline", "url"]).optional(),
        options: z.record(z.string(), z.any()).optional(),
      })
    )
    .handler(async ({ input, context }) => {
      return createJob({ userId: context.user.id, data: input });
    }),

  // Confirm that file upload to S3 is complete
  confirmUpload: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .handler(async ({ input, context }) => {
      return confirmUpload({ userId: context.user.id, jobId: input.jobId });
    }),

  // Get current status of a job
  getStatus: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .handler(async ({ input, context }) => {
      return getJobStatus({ userId: context.user.id, jobId: input.jobId });
    }),

  // List jobs with optional filters
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().optional(),
        page_size: z.number().optional(),
        status: z.string().optional(),
        // recent_days accepts 1, 7, or 30 — use literal union for Zod v4 compatibility
        recent_days: z.literal(1).or(z.literal(7)).or(z.literal(30)).optional(),
        start_time: z.string().optional(),
        end_time: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      return listJobs({ userId: context.user.id, params: input });
    }),
});
