import type { Part } from '../../page-objects/inscription/Part';
import { NewPartTest, PartObject } from './part-tester';
import type { Section } from '../../page-objects/inscription/Section';
import type { Select } from '../../page-objects/inscription/Select';
import type { ScriptInput } from '../../page-objects/inscription/CodeEditor';

class ProgramInterfaceError extends PartObject {
  programSection: Section;
  errorProgram: Select;

  timeoutSection: Section;
  seconds: ScriptInput;
  errorTimeout: Select;

  constructor(part: Part) {
    super(part);
    this.programSection = part.section('Error');
    this.errorProgram = this.programSection.select({});

    this.timeoutSection = part.section('Timeout');
    this.seconds = this.timeoutSection.scriptInput('Seconds');
    this.errorTimeout = this.timeoutSection.select({ label: 'Error' });
  }

  async fill() {
    await this.programSection.toggle();
    await this.errorProgram.choose('>> Ignore Exception');

    await this.timeoutSection.toggle();
    await this.seconds.fill('3');
    await this.errorTimeout.choose('>> Ignore Exception');
  }

  async assertFill() {
    await this.programSection.expectIsOpen();
    await this.errorProgram.expectValue('>> Ignore Exception');

    await this.timeoutSection.expectIsOpen();
    await this.seconds.expectValue('3');
    await this.errorTimeout.expectValue('>> Ignore Exception');
  }

  async clear() {
    await this.errorProgram.choose('ivy:error:program:exception');

    await this.seconds.clear();
    await this.errorTimeout.choose('ivy:error:program:timeout');
  }

  async assertClear() {
    await this.programSection.expectIsClosed();
    await this.timeoutSection.expectIsClosed();
  }
}

export const ProgramInterfaceErrorTest = new NewPartTest('Error', (part: Part) => new ProgramInterfaceError(part));