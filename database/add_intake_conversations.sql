-- Add intake_conversations table for storing conversational intake data
create table public.intake_conversations (
  id uuid default uuid_generate_v4() primary key,
  conversation_id text unique not null,
  gathered_data jsonb default '{}'::jsonb,
  completed_steps text[] default '{}',
  is_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.intake_conversations enable row level security;

-- Create policies for intake_conversations
create policy "Intake conversations are publicly accessible" on public.intake_conversations
  for all using (true);

-- Add index for performance
create index idx_intake_conversations_conversation_id on public.intake_conversations(conversation_id);
create index idx_intake_conversations_created_at on public.intake_conversations(created_at);

-- Add trigger for updated_at
create trigger on_intake_conversations_updated
  before update on public.intake_conversations
  for each row execute procedure public.handle_updated_at();

-- Add function to clean up old conversations (older than 24 hours)
create or replace function public.cleanup_old_intake_conversations()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.intake_conversations
  where created_at < now() - interval '24 hours';
end;
$$;

-- Optional: Set up a cron job to clean up old conversations
-- This would need to be set up in your hosting environment
-- SELECT cron.schedule('cleanup-intake-conversations', '0 */6 * * *', 'SELECT public.cleanup_old_intake_conversations();');
