-- Database
create database test;

use test;

-- User Table
create table `user` (
    `id` bigint(10) not null auto_increment,
    `uuid` varchar(32) not null collate 'utf8mb4_unicode_520_ci',
    `username` varchar(20) not null collate 'utf8mb4_unicode_520_ci',
    `password` varchar(60) not null collate 'utf8mb4_unicode_520_ci',
    `last_logined_at` datetime null,
    `operator` varchar(20) null collate 'utf8mb4_unicode_520_ci',
    `created_at` datetime not null default current_timestamp,
    `updated_at` datetime not null default current_timestamp on update current_timestamp,
    primary key(`id`)
);

create unique index idx_unique_user_uuid on user(uuid);
create unique index idx_unique_user_username on user(username);

-- User 
select * from user;

-- User Detail Table
create table `user_detail` (
    `user_id` bigint(10) not null,
    `key` varchar(128) not null collate 'utf8mb4_unicode_520_ci',
    `value` varchar(128) not null collate 'utf8mb4_unicode_520_ci',
    `operator` varchar(20) null collate 'utf8mb4_unicode_520_ci',
    `created_at` datetime not null default current_timestamp,
    `updated_at` datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY (user_id) REFERENCES user (id)
    on delete cascade
    on update cascade
);

create unique index idx_unique_user_detail_user_id_key on user_detail(user_id, `key`);

-- User Vacation Table
create table `vacation` (
    `id` bigint(10) not null auto_increment,
    `uuid` varchar(32) not null collate 'utf8mb4_unicode_520_ci',
    `user_id` bigint(10) not null,
    `year` varchar(4) not null collate 'utf8mb4_unicode_520_ci',
    `start_dt` date not null ,
    `end_dt` date not null ,
    `days` float(5) not null,
    `comment` varchar(128) null collate 'utf8mb4_unicode_520_ci',
    `operator` varchar(20) null collate 'utf8mb4_unicode_520_ci',
    `created_at` datetime not null default current_timestamp,
    `updated_at` datetime not null default current_timestamp on update current_timestamp,
    primary key(`id`),
    FOREIGN KEY (user_id) REFERENCES user (id)
    on delete cascade
    on update cascade
);

create index idx_vacation_user_id_year on vacation(user_id, `year`);