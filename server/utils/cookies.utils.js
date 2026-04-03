export const generateCookie = (res, cookieName, cookieValue) => {
  const cookieOptions = {
    maxAge:
      cookieName === "accessToken" ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  };
  res.cookie(cookieName, cookieValue, cookieOptions);
};

export const removeCookie = (res, cookieName) => {
  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  };
  res.clearCookie(cookieName, cookieOptions);
};
