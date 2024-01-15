import type { NoteInternalId } from './note.js';
import type User from './user.js';

export type MemberRoleKeys = 'read' | 'write';

export enum MemberRole {
  /**
   * Team member can only read notes
   */
  read = 0,

  /**
   * Team member can read and write notes
   */
  write = 1,
}

/**
 * Class representing a team entity
 * Team is a relation between note and user, which shows what user can do with note
 */
export interface TeamMember {
  /**
   * Team relation id
   */
  id: number;

  /**
   * Note ID
   */
  noteId: NoteInternalId;

  /**
   * Team member user id
   */
  userId: User['id'];

  /**
   * Team member role, show what user can do with note
   */
  role: MemberRole;
}

export type Team = TeamMember[];

export type TeamMemberCreationAttributes = Omit<TeamMember, 'id'>;
