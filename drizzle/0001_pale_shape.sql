CREATE TABLE `mentor_settings` (
	`id` int NOT NULL,
	`provider` varchar(64) NOT NULL DEFAULT 'Google Gemini',
	`model` varchar(128) NOT NULL DEFAULT 'gemini-2.5-flash-lite',
	`apiKeyCiphertext` text NOT NULL,
	`encryptionIv` varchar(64) NOT NULL,
	`encryptionAuthTag` varchar(64) NOT NULL,
	`keySuffix` varchar(12) NOT NULL,
	`status` enum('unknown','valid','quota','invalid','unavailable') NOT NULL DEFAULT 'unknown',
	`lastCheckedAt` timestamp,
	`updatedBy` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mentor_settings_id` PRIMARY KEY(`id`)
);
