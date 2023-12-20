{{data}}.map(({ id, status, user_id, begin_timestamp, end_timestamp }) => ({
  id,
  status,
  user_id,
  duration: dateDiff(end_timestamp, begin_timestamp)('year'),
}));