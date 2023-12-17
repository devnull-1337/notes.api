import type { NoteInternalId } from '@domain/entities/note.js';
import type NoteSettings from '@domain/entities/noteSettings.js';
import type NoteSettingsRepository from '@repository/noteSettings.repository.js';
import type TeamRepository from '@repository/team.repository.js';
import type { MemberRole, Team, TeamMember, TeamMemberCreationAttributes } from '@domain/entities/team.js';
import type User from '@domain/entities/user.js';
import { createInvitationHash } from '@infrastructure/utils/invitationHash.js';

/**
 * Service responsible for Note Settings
 */
export default class NoteSettingsService {
  /**
   * Note Settings repository
   */
  public noteSettingsRepository: NoteSettingsRepository;

  private readonly teamRepository: TeamRepository;

  /**
   * Note Settings service constructor
   *
   * @param noteSettingsrepository - note settings repository
   * @param teamRepository - team repository
   */
  constructor(noteSettingsrepository: NoteSettingsRepository, teamRepository: TeamRepository) {
    this.noteSettingsRepository = noteSettingsrepository;
    this.teamRepository = teamRepository;
  }

  /**
   * Returns settings for a note with passed id
   *
   * @param id - note internal id
   */
  public async getNoteSettingsByNoteId(id: NoteInternalId): Promise<NoteSettings> {
    return await this.noteSettingsRepository.getNoteSettingsByNoteId(id);
  }

  /**
   * Adds note settings
   *
   * @param noteId - note id
   * @param isPublic - is note public
   * @returns added note settings
   */
  public async addNoteSettings(noteId: NoteInternalId, isPublic: boolean = true): Promise<NoteSettings> {
    return await this.noteSettingsRepository.addNoteSettings({
      noteId: noteId,
      isPublic: isPublic,
      invitationHash: createInvitationHash(),
    });
  }

  /**
   * Partially updates note settings
   *
   * @param noteId - note internal id
   * @param data - note settings data with new values
   * @returns updated note settings
   */
  public async patchNoteSettingsByNoteId(noteId: NoteInternalId, data: Partial<NoteSettings>): Promise<NoteSettings> {
    const noteSettings = await this.noteSettingsRepository.getNoteSettingsByNoteId(noteId);

    const updatedNoteSettings = await this.noteSettingsRepository.patchNoteSettingsById(noteSettings.id, data);

    if (updatedNoteSettings === null) {
      throw new Error(`Note settings with id ${noteSettings.id} was not updated`);
    }

    return updatedNoteSettings;
  }

  /**
   * Get user role in team by user id and note id
   * If user is not a member of note, return null
   *
   * @param userId - user id to check his role
   * @param noteId - note id where user should have role
   */
  public async getUserRoleByUserIdAndNoteId(userId: User['id'], noteId: NoteInternalId): Promise<MemberRole | null> {
    return await this.teamRepository.getUserRoleByUserIdAndNoteId(userId, noteId);
  }

  /**
   * Get all team members by note id
   *
   * @param noteId - note id to get all team members
   * @returns team members
   */
  public async getTeamByNoteId(noteId: NoteInternalId): Promise<Team> {
    return await this.teamRepository.getByNoteId(noteId);
  }

  /**
   * Remove team member by id
   *
   * @param id - team member id
   */
  public async removeTeamMemberById(id: TeamMember['id']): Promise<boolean> {
    return await this.teamRepository.removeMemberById(id);
  }

  /**
   * Creates team member
   *
   * @param team - data for team member creation
   * @returns created team member
   */
  public async createTeamMember(team: TeamMemberCreationAttributes): Promise<TeamMember> {
    return await this.teamRepository.create(team);
  }

  /**
   * Updates invitation hash in note settings
   *
   * @param noteId - note internal id
   * @returns updated note settings
   */
  public async regenerateInvitationHash(noteId: NoteInternalId): Promise<NoteSettings> {
    /**
     * Generates a new invitation hash
     */
    const data = { invitationHash: createInvitationHash() };

    return await this.patchNoteSettingsByNoteId(noteId, data);
  }
}
