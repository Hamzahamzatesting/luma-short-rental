-- Catalog tables: destinations, hosts, amenities, listings, reviews,
-- testimonials, faqs. Field names mirror src/lib/data/types.ts (camelCase)
-- translated to snake_case; src/lib/data/*.ts maps between the two.

create table destinations (
  id text primary key,
  slug text unique not null,
  name text not null,
  country text not null,
  image_url text not null,
  listing_count int not null default 0,
  blurb text
);

create table hosts (
  id text primary key,
  name text not null,
  avatar_url text not null,
  response_rate int not null,
  response_time text not null,
  joined_year int not null,
  bio text
);

-- Reference set for admin tooling; the marketing site still reads amenity
-- labels/icons from the static AMENITIES constant (src/lib/constants.ts).
create table amenities (
  id text primary key,
  label text not null,
  icon text not null
);

create table listings (
  id text primary key default ('listing-' || gen_random_uuid()),
  slug text unique not null,
  title text not null,
  destination_id text not null references destinations(id),
  city text not null,
  country text not null,
  neighborhood text,
  lat double precision not null,
  lng double precision not null,
  images text[] not null default '{}',
  price_amount numeric(10, 2) not null,
  price_currency text not null default 'MAD',
  weekend_price_amount numeric(10, 2),
  weekend_price_currency text,
  cleaning_fee_amount numeric(10, 2) not null,
  cleaning_fee_currency text not null default 'MAD',
  max_guests int not null,
  bedrooms int not null,
  bathrooms int not null,
  square_meters int not null,
  amenity_ids text[] not null default '{}',
  luxury_score int not null,
  is_instant_book boolean not null default false,
  is_featured boolean not null default false,
  is_pet_friendly boolean not null default false,
  has_pool boolean not null default false,
  has_wifi boolean not null default false,
  has_parking boolean not null default false,
  has_sea_view boolean not null default false,
  short_description text not null,
  description text not null,
  house_rules text[] not null default '{}',
  check_in_time text not null,
  check_out_time text not null,
  host_id text not null references hosts(id),
  rating numeric(3, 2) not null default 0,
  review_count int not null default 0,
  nearby_attractions jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index listings_destination_idx on listings (destination_id);
create index listings_amenity_ids_idx on listings using gin (amenity_ids);
create index listings_featured_idx on listings (is_featured) where is_featured;

create table reviews (
  id text primary key default ('review-' || gen_random_uuid()),
  listing_id text not null references listings(id) on delete cascade,
  author_name text not null,
  author_avatar_url text,
  rating numeric(2, 1) not null,
  comment text not null,
  date timestamptz not null default now()
);

create index reviews_listing_idx on reviews (listing_id);

create table testimonials (
  id text primary key,
  author_name text not null,
  author_location text,
  avatar_url text,
  quote text not null,
  rating int not null
);

create table faqs (
  id text primary key,
  question text not null,
  answer text not null,
  sort_order int not null default 0
);
