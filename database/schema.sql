-- LaunchKit AI Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  plan_status text check (plan_status in ('free', 'paid_oneoff', 'paid_subscription')) default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create kits table with intake form fields
create table public.kits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  has_access boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Intake form fields (required essentials)
  one_liner text,
  category text check (category in ('service', 'product', 'local', 'content', 'e-com', 'saas')),
  target_audience text,
  primary_goal text check (primary_goal in ('launch', 'first_sales', 'validate', 'brand')),
  budget_band text check (budget_band in ('none', '<100', '100-500', '500-2000', '>2000')),
  time_horizon text check (time_horizon in ('2w', '30d', '60d')),
  challenges text, -- JSON stringified array of 3 challenges
  geography text check (geography in ('UK', 'EU', 'US', 'global')),
  brand_vibe text check (brand_vibe in ('luxury', 'accessible', 'edgy', 'minimal')),
  sales_channel_focus text check (sales_channel_focus in ('IG', 'TikTok', 'X', 'YouTube', 'Etsy', 'Shopify', 'Offline', 'Mixed')),
  
  -- Optional helpful fields
  business_model text check (business_model in ('one_off', 'subscription', 'services', 'affiliate', 'ads')),
  fulfilment text check (fulfilment in ('digital', 'physical', 'service', 'mixed')),
  pricing_idea text,
  competitor_links text, -- JSON array of URLs
  inspiration_links text, -- JSON array of URLs
  content_strengths text, -- JSON array
  constraints text,
  
  -- Optional future fields
  revenue_target_30d integer check (revenue_target_30d >= 0),
  
  -- Profiling data fields
  selected_options text, -- JSON stringified object of selected options
  profiling_data text -- JSON stringified object of profiling data
);

-- Create outputs table for generated content
create table public.outputs (
  id uuid default uuid_generate_v4() primary key,
  kit_id uuid references public.kits(id) on delete cascade not null,
  type text check (type in ('business_case', 'content_strategy')) not null,
  content text not null, -- JSON content
  regen_count integer default 0 check (regen_count >= 0 and regen_count <= 3),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table for payment tracking
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  kit_id uuid references public.kits(id) on delete cascade not null,
  stripe_session_id text not null,
  amount integer not null, -- in pence/cents
  currency text default 'gbp' not null,
  status text check (status in ('pending', 'completed', 'failed')) default 'pending',
  price_id text, -- Stripe price ID
  subscription_id text, -- Stripe subscription ID for daily plan
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.kits enable row level security;
alter table public.outputs enable row level security;
alter table public.orders enable row level security;

-- Create RLS policies

-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Kits policies
create policy "Kits are viewable by owner or anonymous" on public.kits
  for select using (auth.uid() = user_id OR user_id IS NULL);

create policy "Users can insert their own kits or anonymous kits" on public.kits
  for insert with check (auth.uid() = user_id OR user_id IS NULL);

create policy "Users can update their own kits or anonymous kits" on public.kits
  for update using (auth.uid() = user_id OR user_id IS NULL);

-- Outputs policies
create policy "Outputs are viewable by kit owner or anonymous" on public.outputs
  for select using (
    exists (
      select 1 from public.kits
      where kits.id = outputs.kit_id
      and (kits.user_id = auth.uid() OR kits.user_id IS NULL)
    )
  );

create policy "Service role can manage outputs" on public.outputs
  for all using (current_setting('role') = 'service_role');

-- Orders policies
create policy "Orders are viewable by owner or anonymous" on public.orders
  for select using (auth.uid() = user_id OR user_id IS NULL);

create policy "Service role can manage orders" on public.orders
  for all using (current_setting('role') = 'service_role');

-- Create functions for updated_at triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger on_auth_user_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_kits_updated
  before update on public.kits
  for each row execute procedure public.handle_updated_at();

create trigger on_outputs_updated
  before update on public.outputs
  for each row execute procedure public.handle_updated_at();

create trigger on_orders_updated
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

-- Create function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
