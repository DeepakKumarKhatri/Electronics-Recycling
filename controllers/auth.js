const register = async(req,res) => {
    return res
      .status(200)
      .json({ message: "Working Fine" });
}

module.exports = {
    register,
}