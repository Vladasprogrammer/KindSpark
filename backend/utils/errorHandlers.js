const error500 = (res, err) => res.status(500).json(err);
const error400 = (res, customCode = 0) => res.status(400).json({
  msg: { type: 'error', text: 'Invalid request. Code:' + customCode }
});
const error401 = (res, message) => res.status(401).json({
  msg: { type: 'error', text: message }
});

export { error500, error400, error401 };