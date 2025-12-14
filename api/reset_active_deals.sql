-- DANGER: This will delete existing deals!
drop table if exists active_deals;

-- Create the active_deals table
create table active_deals (
  id text primary key,
  source text not null, -- 'seatgeek' or 'amadeus'
  title text not null,
  price numeric not null,
  old_price numeric,
  panic_score int, -- 0-100
  drop_percentage numeric,
  url text not null,
  image_url text,
  description text,
  visual_tag text,
  type text not null, -- 'ticket', 'flight', 'hotel'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table active_deals enable row level security;

-- Policy: Public can READ
create policy "Public deals are viewable by everyone."
  on active_deals for select
  using ( true );
