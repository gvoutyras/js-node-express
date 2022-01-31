const testEndpoint = (req, res) => {
  res.status(200).json({method: "GET", params: req.query})
};

module.exports = testEndpoint;
