import jwt from "jsonwebtoken";
const auth = async (request, response, next) => {
  try {
    const token =
      request.cookies?.accessToken || // <-- from cookies
      request.headers?.authorization?.split(" ")[1]; // <-- from bearer token

    //  console.log("token:", token);

    if (!token) {
      return response.status(401).json({
        message: "Unauthorized: No token provided",
        error: true,
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decode) {
      return response.status(401).json({
        message: "Unauthorized access",
        error: true,
        succcess: false,
      });
    }

    request.userId = decode.id;
    next();
    //
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default auth;
