import type { FastifyPluginCallback } from 'fastify';
import type NoteSettingsService from '@domain/service/noteSettings.js';
import type { NotePublicId } from '@domain/entities/note.js';
import type NoteSettings from '@domain/entities/noteSettings.js';
import notEmpty from '@infrastructure/utils/notEmpty.js';

/**
 * Get note by id options
 */
interface GetNoteSettingsByNodeIdOptions {
  /**
   * Note id
   */
  id: NotePublicId;
}

/**
 * Interface for the note settings router.
 */
interface NoteSettingsRouterOptions {
  /**
   * Note Settings service instance
   */
  noteSettingsService: NoteSettingsService,
}

/**
 * Note Settings router plugin
 *
 * @param fastify - fastify instance
 * @param opts - empty options
 * @param done - callback
 */
const NoteSettingsRouter: FastifyPluginCallback<NoteSettingsRouterOptions> = (fastify, opts, done) => {
  /**
   * Get note settings service from options
   */
  const noteSettingsService = opts.noteSettingsService;

  /**
   * Get noteSettings by id
   */
  fastify.get<{
    Params: GetNoteSettingsByNodeIdOptions,
    Reply: NoteSettings
  }>('/:id', async (request, reply) => {
    const params = request.params;
    /**
     * TODO: Validate request params
     */
    const { id } = params;

    const noteSettings = await noteSettingsService.getNoteSettingsByPublicId(id);

    /**
     * Check if note does not exist
     */
    if (!notEmpty(noteSettings)) {
      return fastify.notFound(reply, 'Note settings not found');
    }

    return reply.send(noteSettings);
  });

  /**
   * Patch noteSettings by note public id
   */
  fastify.patch<{
    Body: Partial<NoteSettings>,
    Params: GetNoteSettingsByNodeIdOptions,
    Reply: NoteSettings,
  }>('/:id', {
    config: {
      policy: [
        'authRequired',
      ],
    },
  }, async (request, reply) => {
    const noteId = request.params.id;

    /**
     * TODO: check is user collaborator
     */

    const updatedNoteSettings = await noteSettingsService.patchNoteSettingsByPublicId(request.body, noteId);

    if (updatedNoteSettings === null) {
      return fastify.notFound(reply, 'Note settings not found');
    }

    return reply.send(updatedNoteSettings);
  });

  done();
};

export default NoteSettingsRouter;
