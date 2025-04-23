import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  timestamp, 
  integer, 
  json, 
  uuid, 
  boolean 
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  password: varchar('password', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).unique(),
  fullName: varchar('full_name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Field types
export const FieldTypeEnum = z.enum([
  'TEXT', 
  'NUMBER', 
  'EMAIL', 
  'URL', 
  'DATE', 
  'TIME', 
  'DATETIME', 
  'PHONE', 
  'SINGLE_CHOICE', 
  'MULTI_CHOICE', 
  'PARAGRAPH', 
  'CHECKBOX', 
  'SIGNATURE', 
  'FILE_UPLOAD',
  'SCREEN_RECORD',
  'PHOTO',
  'IMPORT',
  'EXPORT',
  'QR_SCAN',
  'BARCODE_SCAN',
]);

export type FieldType = z.infer<typeof FieldTypeEnum>;

// Forms table
export const forms = pgTable('forms', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  userId: integer('user_id').references(() => users.id),
  workflowId: uuid('workflow_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isPublished: boolean('is_published').default(false),
});

export const formsRelations = relations(forms, ({ many }) => ({
  fields: many(fields),
  submissions: many(formSubmissions),
}));

export const insertFormSchema = createInsertSchema(forms).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Form = typeof forms.$inferSelect;
export type InsertForm = z.infer<typeof insertFormSchema>;

// Fields table
export const fields = pgTable('fields', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id').references(() => forms.id).notNull(),
  label: varchar('label', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).$type<FieldType>().notNull(),
  required: boolean('required').default(false),
  order: integer('order').default(0),
  options: json('options').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fieldsRelations = relations(fields, ({ one }) => ({
  form: one(forms, {
    fields: [fields.formId],
    references: [forms.id],
  }),
}));

export const insertFieldSchema = createInsertSchema(fields).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Field = typeof fields.$inferSelect;
export type InsertField = z.infer<typeof insertFieldSchema>;

// Form submissions table
export const formSubmissions = pgTable('form_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id').references(() => forms.id).notNull(),
  userId: integer('user_id').references(() => users.id),
  data: json('data').$type<Record<string, any>>().notNull(),
  status: varchar('status', { length: 50 }).default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const formSubmissionsRelations = relations(formSubmissions, ({ one }) => ({
  form: one(forms, {
    fields: [formSubmissions.formId],
    references: [forms.id],
  }),
  user: one(users, {
    fields: [formSubmissions.userId],
    references: [users.id],
  }),
}));

export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;