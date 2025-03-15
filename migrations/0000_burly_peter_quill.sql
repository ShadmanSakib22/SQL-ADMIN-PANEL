CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`registration_time` integer DEFAULT (CURRENT_TIMESTAMP),
	`last_login_time` integer,
	`last_activity_time` integer,
	`status` text DEFAULT 'active',
	CONSTRAINT "status_check" CHECK("users"."status" IN ('active', 'blocked'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);