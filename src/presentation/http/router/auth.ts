import type { FastifyPluginCallback } from 'fastify';
import type AuthService from '@domain/service/auth.js';
import type { ErrorResponse, SuccessResponse } from '@presentation/http/types/HttpResponse.js';
import { StatusCodes } from 'http-status-codes';
import type AuthSession from '@domain/entities/authSession.js';

/**
 * Interface for auth request options. Uses for regenerate tokens and logout.
 */
interface AuthOptions {
  /**
   * Refresh token
   */
  token: string;
}

/**
 * Interface for the Auth router.
 */
interface AuthRouterOptions {

  /**
   * Auth service instance
   */
  authService: AuthService,
}

/**
 * Auth router plugin
 *
 * @param fastify - fastify instance
 * @param opts - router options
 * @param done - callback
 */
const AuthRouter: FastifyPluginCallback<AuthRouterOptions> = (fastify, opts, done) => {
  /**
   * Regenerate access end refresh tokens by refresh token
   */
  fastify.post<{
    Querystring: AuthOptions;
  }>('/', async (request, reply) => {
    const { token } = request.query;

    const userSession = await opts.authService.verifyRefreshToken(token);

    /**
     * Check if session is valid
     */
    if (!userSession) {
      const response: ErrorResponse = {
        status: StatusCodes.UNAUTHORIZED,
        message: 'Session is not valid',
      };

      reply.send(response);

      return;
    }

    const accessToken = opts.authService.signAccessToken({ id: userSession.userId });

    await opts.authService.removeSessionByRefreshToken(token);
    const refreshToken = await opts.authService.signRefreshToken(userSession.userId);

    const response: SuccessResponse<AuthSession> = {
      data: {
        accessToken,
        refreshToken,
      },
    };

    reply.send(response);
  });

  /**
   * Route for logout, removes session from database by refresh token
   */
  fastify.post<{
    Querystring: AuthOptions;
  }>('/logout', async (request, reply) => {
    await opts.authService.removeSessionByRefreshToken(request.query.token);

    const response: SuccessResponse<string> = {
      data: 'OK',
    };

    reply.status(StatusCodes.OK).send(response);
  });
  done();
};

export default AuthRouter;
