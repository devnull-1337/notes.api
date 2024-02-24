import type User from '@domain/entities/user';
import { describe, test, expect, beforeAll } from 'vitest';

let accessToken = '';
let user: User;

describe('NoteList API', () => {
  beforeAll(async () => {
    /**
     * Truncate all tables, which are needed
     * Restart autoincrement sequences for data to start with id 1
     *
     * @todo get rid of restarting database data in tests (move to beforeEach)
     */
    await global.db.truncateTables();

    /** create test user */
    user = await global.db.insertUser({
      email: 'test@codexmail.com',
      name: 'CodeX',
    });

    accessToken = global.auth(user.id);
  });
  describe('GET /notes?page', () => {
    test('Returns noteList with specified length (not for last page)', async () => {
      const portionSize = 30;
      const pageNumber = 1;

      /** create test notes for created user */
      for (let i = 0; i < portionSize; i++) {
        await global.db.insertNote({
          creatorId: user.id,
          publicId: 'TJmEb89e0l',
        });
      }

      const response = await global.api?.fakeRequest({
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: `/notes?page=${pageNumber}`,
      });

      expect(response?.statusCode).toBe(200);

      expect(response?.json().items).toHaveLength(portionSize);
    });

    test('Returns noteList with specified length (for last page)', async () => {
      const portionSize = 19;
      const pageNumber = 2;

      /** create test notes for created user */
      for (let i = 0; i < portionSize; i++) {
        await global.db.insertNote({
          creatorId: user.id,
          publicId: 'TJmEb89e0l',
        });
      }

      const response = await global.api?.fakeRequest({
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: `/notes?page=${pageNumber}`,
      });

      expect(response?.statusCode).toBe(200);

      expect(response?.json().items).toHaveLength(portionSize);
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

      expect(response?.json()).toEqual( { items : [] } );
      expect(response?.json().items).toHaveLength(0);
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
