/* Public browser settings only. Safe to publish.
   This points to a SEPARATE Edge Function in the same Supabase project.
   Never put MY_TRAINING_SYNC_KEY or any secret/service-role key here. */
window.TRAINING_CLOUD_CONFIG = {
  enabled: true,
  baseUrl: 'https://gsyqyguqyworjgjkaptz.supabase.co/functions/v1/my-training-sync',
  publishableKey: 'sb_publishable_KT5nlUPFfU8Qw-J5T3VqHQ_ygomasEU'
};
