import { getProfileSnapshot } from "../services/profile.service.js";

export const myProfileHandler = async (req, res, next) => {
  try {
    const snapshot = await getProfileSnapshot(req.user.id);

    res.json({
      success: true,
      data: snapshot
    });
  } catch (error) {
    next(error);
  }
};
