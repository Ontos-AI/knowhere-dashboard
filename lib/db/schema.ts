// ============================================================================
// Application-specific tables
// ============================================================================
// This file is for business logic tables that are not managed by Better Auth.
// Auth-related tables (user, session, account, verification) are in auth-schema.ts

// Example: Job-related tables, payment tables, etc.
// When you add tables here, make sure to export them so they can be merged in db/index.ts

// export const yourTable = pgTable('your_table', {
//   id: text('id').primaryKey().$defaultFn(() => createId()),
//   ...
// });

// Export an empty object to make this a valid ES module
export {};
