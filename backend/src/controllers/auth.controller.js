import {
  getCurrentUser,
  loginUser,
  registerUser,
  updateCurrentUser
} from "../services/auth.service.js";

export const registerHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.validated.body;
    const result = await registerUser({ name, email, password });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;
    const result = await loginUser({ email, password });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const meHandler = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateMeHandler = async (req, res, next) => {
  try {
    const { name } = req.validated.body;
    const user = await updateCurrentUser(req.user.id, { name });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
