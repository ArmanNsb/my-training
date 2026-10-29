# Put My Training beside the existing Training site

Yes — both sites can use the same GitHub Pages account and the same Supabase project without mixing data.

## Recommended URLs
- Existing site: `https://armannsb.github.io/training/`
- Your site: `https://armannsb.github.io/my-training/`

Create a **new GitHub repository** named `my-training` and upload the contents of this folder to that repository. GitHub Pages can host both repositories at the same time.

## Important: the browser data is separated
This build uses only `mytraining.*` local-storage keys. It does **not** read the friend's `gp.*` workout data or timer. Its PWA cache names are also separate.

## Cloud sync on the SAME Supabase project
The public Supabase project URL/key are already in `cloud-config.js`. Your site uses a separate function and a separate table:

- Friend: `training-sync` → `training_owner_records`
- You: `my-training-sync` → `my_training_owner_records`

### 1. Create your separate table
Open Supabase SQL Editor in the existing project and run:

`my-training-owner-schema.sql`

### 2. Deploy your separate Edge Function
Deploy the folder:

`supabase/functions/my-training-sync/`

The function name must be exactly `my-training-sync` and JWT verification must be disabled, matching `supabase/config.toml`.

### 3. Add your private sync code
In the Supabase project Edge Function secrets, add:

`MY_TRAINING_SYNC_KEY`

Give it a long random value (at least 32 characters). **Do not put this code in GitHub or in `cloud-config.js`.**

The project can keep using the already-existing `ALLOWED_ORIGIN=https://armannsb.github.io` and the existing server-side `training_sync` secret API key.

### 4. Connect your devices
After the function is deployed, open your site → Settings → Cloud sync. Enter `MY_TRAINING_SYNC_KEY` on each of your own devices.

Your sync data and your friend's sync data will remain in different tables and use different private codes.

## One note about the friend's old service worker
This build only deletes caches beginning with `mytraining-`, so it will not delete the friend's cache. The friend's current service worker appears to delete all other caches on the origin when it activates. That does not mix workout data, but a future deployment of the friend's site could temporarily remove your offline cache. The clean fix is to change the friend's service-worker cleanup so it only deletes cache names beginning with its own `gp-` prefix.
