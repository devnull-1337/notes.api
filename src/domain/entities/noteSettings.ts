/**
 * Invitation hash. It's used to invite users to team
 */
export type InvitationHash = string;

/**
 * Notes settings entity
 */
export default interface NoteSettings {
  /**
   * Just unique property identifier
   */
  id: number;

  /**
   * Related note id
   */
  noteId: number;

  /**
   * Custom hostname
   */
  customHostname?: string;

  /**
   * Is note public for everyone or only for collaborators
   */
  isPublic: boolean;

  /**
   * Invitation hash
   */
  invitationHash: InvitationHash;
}

/**
 * Notes settings creation attributes, omitting id, because it's generated by database
 */
type NoteSettingsCreationAttributes = Omit<NoteSettings, 'id'>;

export type {
  NoteSettingsCreationAttributes
};
