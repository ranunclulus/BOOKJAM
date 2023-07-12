SELECT r.record_id, r.created_at, r.comment_count, r.like_count, ri.image_url
FROM records AS r LEFT JOIN record_images AS ri ON ri.record_id = r.record_id AND r.author = 1
GROUP BY r.record_id;