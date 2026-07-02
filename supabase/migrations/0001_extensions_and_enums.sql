-- Extensions and enums used across later migrations.

create extension if not exists "btree_gist";
create extension if not exists "pgcrypto"; -- gen_random_uuid()

create type booking_status as enum ('pending', 'confirmed', 'cancelled');
