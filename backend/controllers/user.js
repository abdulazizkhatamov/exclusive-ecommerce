exports.getUser = (req, res) => {
  return res.json(req.user);
};
