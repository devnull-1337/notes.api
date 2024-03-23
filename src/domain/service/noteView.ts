import type { NoteInternalId } from '@domain/entities/note';
import type User from '@domain/entities/user.js';
import type NoteView from '@domain/entities/noteView.js';
import type NoteViewsRepository from '@repository/noteView.repository';

/**
 * Note views service, which will store latest note visit
 * it is used to display recent notes for each user
 */
export default class NoteViewsService {
  /**
   * Note views repository
   */
  public noteViewsRepository: NoteViewsRepository;

  /**
   * NoteVeiws service constructor
   *
   * @param noteViewRepository - note views repository
   */
  constructor(noteViewRepository: NoteViewsRepository) {
    this.noteViewsRepository = noteViewRepository;
  }

  /**
   * Updates existing noteView's vizitedAt or creates new record if user opens note for the first time
   *
   * @param noteId - note internal id
   * @param userId - id of the user
   */
  public async saveVisit(noteId: NoteInternalId, userId: User['id']): Promise<NoteView> {
    return await this.noteViewsRepository.saveVisit(noteId, userId);
  };
}