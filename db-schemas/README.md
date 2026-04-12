# Database schema notes

Authoritative SQL migrations live in **`../supabase/migrations/`** (Supabase CLI).

## Waitlist

The `waitlist` table stores emails for the landing-page launch list. Rows are inserted only by the **`waitlist`** Edge Function using the service role; Row Level Security is enabled with no public policies, so the table is not writable from the browser.

See migration `supabase/migrations/20260412184312_waitlist.sql`.

### Apply to a hosted project

From the repo root:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### Deploy the Edge Function

```bash
supabase functions deploy waitlist
```

Ensure the function has access to `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (injected automatically when deployed on Supabase).
