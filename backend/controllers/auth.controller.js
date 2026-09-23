import authService from "../services/auth.service.js";

const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// login
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// address
const addAddress = async (req, res, next) => {
  try {
    const address = await authService.addAddress(
      req.user,
      req.body
    )

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: {
        address,
      },
    })
  } catch (error) {
    next(error)
  }
}
// getaddress
const getAddresses = async (req, res, next) => {
  try {
    const addresses = await authService.getAddresses(req.user)

    res.status(200).json({
      success: true,
      data: {
        addresses,
      },
    })
  } catch (error) {
    next(error)
  }
}
// getme
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getMe,
  addAddress,
  getAddresses
};