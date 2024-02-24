import userSessions from '@tests/test-data/user-sessions.json';
import { describe, test, expect, beforeAll } from 'vitest';


/**
 * Access token that will be used for Auhorization header
 */
let accessToken = '';

describe('Note list API', () => {
  beforeAll(() => {
    /**
     * userId for authorization
     */
    const userId = userSessions[0]['user_id'];

    accessToken = global.auth(userId);
  });

  describe('GET /notes?page', () => {
    test('Returns noteList with specified length (not for last page)', async () => {
      const portionSize = 30;
      const pageNumber = 1;

      const response = await global.api?.fakeRequest({
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: `/notes?page=${pageNumber}`,
      });

      expect(response?.statusCode).toBe(200);

      const body = response?.json();

      expect(body.items).toHaveLength(portionSize);
    });

    test('Returns noteList with specified length (for last page)', async () => {
      const portionSize = 19;
      const pageNumber = 2;

      const response = await global.api?.fakeRequest({
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: `/notes?page=${pageNumber}`,
      });

      expect(response?.statusCode).toBe(200);

      const body = response?.json();

      expect(body.items).toHaveLength(portionSize);
    });

    test('Returns noteList with no items if it has no notes', async () => {
      const pageNumber = 3;

      const response = await global.api?.fakeRequest({
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: `/notes?page=${pageNumber}`,
      });

      expect(response?.statusCode).toBe(200);

      const body = response?.json();

      expect(body).toEqual( { items : [] } );
      expect(body.items).toHaveLength(0);
    });

    test('Returns 400 when page < 0', async () => {
      const pageNumber = 0;

      const response = await global.api?.fakeRequest({
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: `/notes?page=${pageNumber}`,
      });

      expect(response?.statusCode).toBe(400);
    });

    test('Returns 400 when page is too large (maximum page numbrer is 30 by default)', async () => {
      const pageNumber = 31;

      const response = await global.api?.fakeRequest({
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: `/notes?page=${pageNumber}`,
      });

      expect(response?.statusCode).toBe(400);
    });
  });
});
