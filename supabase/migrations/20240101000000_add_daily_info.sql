-- Create daily_info table for health tracking
create table "public"."daily_info" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "date" date not null,
    "journal" text default '',
    "llm_analysis" text,
    "nutrition_info" jsonb,
    "food" text,
    "activity" text,
    "other" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create unique index for user_id and date combination
CREATE UNIQUE INDEX daily_info_user_date_idx ON public.daily_info USING btree (user_id, date);

-- Set primary key
alter table "public"."daily_info" add constraint "daily_info_pkey" PRIMARY KEY using index "daily_info_user_date_idx";

-- Add foreign key constraint
alter table "public"."daily_info" add constraint "daily_info_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
alter table "public"."daily_info" enable row level security;

-- Create RLS policies
create policy "Users can view their own daily info"
on "public"."daily_info"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));

create policy "Users can insert their own daily info"
on "public"."daily_info"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));

create policy "Users can update their own daily info"
on "public"."daily_info"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));

create policy "Users can delete their own daily info"
on "public"."daily_info"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_daily_info_updated_at
  before update on public.daily_info
  for each row execute procedure public.handle_updated_at();
