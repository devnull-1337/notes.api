import Note from '@domain/entities/note.js';
import NotesSettings from '@domain/entities/notesSettings.js';
import type NoteStorage from './storage/note.storage.js';

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
   * @param note - note to add
   * @returns { Promise<Note> } added note
   */
  public async addNote({ title, content }: Note): Promise<Note> {
    const insertedNote = await this.storage.insertNote(title, content);

    return new Note(insertedNote.title, insertedNote.content, insertedNote.id);
  }

  /**
   * Gets note by id
   *
   * @param id - note id
   * @returns { Promise<Note | null> } found note
   */
  public async getNoteById(id: number): Promise<Note | null> {
    const noteData = await this.storage.getNoteById(id);

    if (!noteData) {
      return null;
    }

    return new Note(
      noteData.title,
      noteData.content,
      noteData.id
    );
  }

  /**
   * Gets note settings by id
   *
   * @param id - note id
   * @returns { Promise<NoteSettings | null> } found note
   */
  public async getNoteSettingsById(id: number): Promise<NotesSettings | null> {
    const noteData = await this.storage.getNoteSettingsById(id);

    if (!noteData) {
      return null;
    }

    return new NotesSettings(
      noteData.custom_hostname,
      noteData.note_id,
      noteData.id,
    );
  }

  /**
   * Gets note by hostname
   *
   * @param hostname - custom hostname
   * @returns { Promise<Note | null> } found note
   */
  public async getNoteByHostname(hostname: string): Promise<Note | null> {
    const noteData = await this.storage.getNoteByHostname(hostname);

    if (!noteData) {
      return null;
    }

    return new Note(
      noteData.title,
      noteData.content,
      noteData.id
    );
  }
}
