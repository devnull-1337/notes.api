import type Note from '@domain/entities/note.js';
import type { NoteCreationAttributes } from '@domain/entities/note.js';
import type NotesSettings from '@domain/entities/notesSettings.js';
import type NoteStorage from '@repository/storage/note.storage.js';
import type { NotesSettingsCreationAttributes } from '@domain/entities/notesSettings.js';

/**
 * Repository allows accessing data from business-logic (domain) level
 */
export default class NoteRepository {
  /**
   * Note storage instance
   */
  public storage: NoteStorage;

  /**
   * Note repository constructor
   *
   * @param storage - storage for note
   */
  constructor(storage: NoteStorage) {
    this.storage = storage;
  }

  /**
   * Add note
   *
   * @param options - note adding options
   * @returns { Promise<Note> } added note
   */
  public async addNote(options: NoteCreationAttributes): Promise<Note> {
    return await this.storage.createNote(options);
  }

  /**
   * Gets note by id
   *
   * @param id - note id
   * @returns { Promise<Note | null> } found note
   */
  public async getNoteById(id: Note['id']): Promise<Note | null> {
    return await this.storage.getNoteById(id);
  }

  /**
   * Gets note settings by id
   *
   * @param id - note id
   * @returns { Promise<NotesSettings | null> } - found note
   */
  public async getNoteSettingsById(id: NotesSettings['id']): Promise<NotesSettings | null> {
    return await this.storage.getNoteSettingsById(id);
  }

  /**
   * Gets note by hostname
   *
   * @param hostname - custom hostname
   * @returns { Promise<Note | null> } found note
   */
  public async getNoteByHostname(hostname: string): Promise<Note | null> {
    return await this.storage.getNoteByHostname(hostname);
  }

  /**
   * Get note by public id
   *
   * @param publicId - public id
   * @returns { Promise<Note | null> } found note
   */
  public async getNoteByPublicId(publicId: NotesSettings['publicId']): Promise<Note | null> {
    return await this.storage.getNoteByPublicId(publicId);
  }

  /**
   * Get note settings by note id
   *
   * @param id - note public id
   * @returns { Promise<NotesSettings | null> } found note settings
   */
  public async getNoteSettingsByPublicId(id: NotesSettings['publicId']): Promise<NotesSettings> {
    return await this.storage.getNoteSettingsByPublicId(id);
  }

  /**
   * Get note settings by note id
   *
   * @param id - note id
   * @returns { Promise<NotesSettings | null> } found note settings
   */
  public async getNoteSettingsByNoteId(id: Note['id']): Promise<NotesSettings> {
    return await this.storage.getNoteSettingsByNoteId(id);
  }

  /**
   * Add note settings
   *
   * @param settings - note settings
   */
  public async addNoteSettings(settings: NotesSettingsCreationAttributes): Promise<NotesSettings> {
    return await this.storage.insertNoteSettings(settings);
  }
}
