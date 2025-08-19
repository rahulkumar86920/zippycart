const auth = (request, response, next) => {
  try {
    const token =
      request.cookies?.accessToken || // <-- from cookies
      request.headers?.authorization?.split(" ")[1]; // <-- from bearer token

    console.log("token:", token);

    if (!token) {
      return response.status(401).json({
        message: "Unauthorized: No token provided",
        error: true,
        success: false,
      });
    }

    // If everything is good, move to next middleware
    next();
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default auth;
