-- Enforces upload limits at the Storage API level (not just client-side
-- UI hints) so an admin account can't upload arbitrarily large or
-- arbitrary-type files to the listing-media bucket.

update storage.buckets
set
  file_size_limit = 104857600, -- 100 MB, generous enough for a short property video
  allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
where id = 'listing-media';
