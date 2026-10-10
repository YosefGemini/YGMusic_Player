CREATE TABLE `albums` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`artist_id` text,
	`year` integer,
	`artwork_uri` text,
	`track_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `albums_title_idx` ON `albums` (`title`);--> statement-breakpoint
CREATE INDEX `albums_artist_idx` ON `albums` (`artist_id`);--> statement-breakpoint
CREATE TABLE `artists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sort_name` text DEFAULT '' NOT NULL,
	`artwork_uri` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `artists_name_idx` ON `artists` (`name`);--> statement-breakpoint
CREATE INDEX `artists_sort_idx` ON `artists` (`sort_name`);--> statement-breakpoint
CREATE TABLE `eq_presets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`is_built_in` integer DEFAULT false NOT NULL,
	`preamp_db` real DEFAULT 0 NOT NULL,
	`bands` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`uri` text NOT NULL,
	`name` text NOT NULL,
	`parent_uri` text,
	`access_mode` text DEFAULT 'saf' NOT NULL,
	`scan_enabled` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `folders_uri_idx` ON `folders` (`uri`);--> statement-breakpoint
CREATE INDEX `folders_parent_idx` ON `folders` (`parent_uri`);--> statement-breakpoint
CREATE TABLE `playlist_items` (
	`id` text PRIMARY KEY NOT NULL,
	`playlist_id` text NOT NULL,
	`track_id` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `playlist_items_playlist_idx` ON `playlist_items` (`playlist_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `playlist_items_uniq_idx` ON `playlist_items` (`playlist_id`,`track_id`);--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`cover_uri` text,
	`is_system` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `queue_items` (
	`id` text PRIMARY KEY NOT NULL,
	`track_id` text NOT NULL,
	`position` integer NOT NULL,
	`source` text DEFAULT 'all' NOT NULL,
	`source_id` text,
	FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `queue_items_position_idx` ON `queue_items` (`position`);--> statement-breakpoint
CREATE TABLE `scan_cache` (
	`uri` text PRIMARY KEY NOT NULL,
	`folder_id` text,
	`mtime` integer DEFAULT 0 NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`hash` text,
	`parsed_at` integer NOT NULL,
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `scan_cache_folder_idx` ON `scan_cache` (`folder_id`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`artist_id` text,
	`album_id` text,
	`folder_id` text,
	`uri` text NOT NULL,
	`file_name` text DEFAULT '' NOT NULL,
	`duration_ms` integer DEFAULT 0 NOT NULL,
	`track_no` integer,
	`disc_no` integer,
	`year` integer,
	`genre` text,
	`bitrate` integer,
	`sample_rate` integer,
	`size_bytes` integer DEFAULT 0 NOT NULL,
	`mime_type` text,
	`artwork_uri` text,
	`created_at` integer NOT NULL,
	`last_played` integer,
	`play_count` integer DEFAULT 0 NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tracks_uri_idx` ON `tracks` (`uri`);--> statement-breakpoint
CREATE INDEX `tracks_artist_idx` ON `tracks` (`artist_id`);--> statement-breakpoint
CREATE INDEX `tracks_album_idx` ON `tracks` (`album_id`);--> statement-breakpoint
CREATE INDEX `tracks_folder_idx` ON `tracks` (`folder_id`);