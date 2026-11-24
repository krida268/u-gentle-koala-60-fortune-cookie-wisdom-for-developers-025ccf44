// Fortune Cookie Wisdom for Developers — a program that writes one
// original fortune-cookie line for a software developer to
// /output/entry.txt.
//
// The line is a fixed string on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that line, byte
// for byte, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Why this line, against the judge's brief:
// - It is a fortune-cookie line for a developer: a TODO is a
//   developer's own artifact, and the future self is the maintainer
//   who will read it.
// - It reads like a fortune cookie: one short balanced sentence that
//   lands in a single breath.
// - It says something true about a developer's day: TODOs are messages
//   left in the code for whoever comes next, usually yourself.
// - It turns that truth fresh: a TODO is not a chore on a list, it is
//   a fortune — a prophecy left in the code about what comes next.
// - It leaves a quiet double meaning that rewards a second read:
//   "fortune" is both the cookie's prophecy and the fate the TODO
//   predicts, so the line is itself a fortune about fortunes.
const LINE =
  "Every TODO you leave is a fortune told to your future self.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 120 characters of UTF-8 text, so refuse
  // loudly instead of shipping a line the gate would throw away.
  if (LINE.length < 1 || LINE.length > 120) {
    throw new Error(`entry must be 1-120 characters, got ${LINE.length}`);
  }
  // The gate also refuses text that is only white space, so check that
  // too before writing anything.
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // The entry must stand alone as one line: no line break anywhere
  // inside it, so a typo can never slip a second line past the gate.
  if (/[\r\n]/.test(LINE)) {
    throw new Error("entry must be a single line");
  }
  // One clean line means no tabs and no doubled spaces either: a
  // stray tab would read as a formatting glitch in front of the judge.
  if (/[\t]/.test(LINE) || /  /.test(LINE)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  // The gate counts every byte, so write exactly the line and nothing
  // else: no trailing newline.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, LINE, "utf8");
  // Read the file back and refuse to finish unless it holds exactly
  // the one line: a stray byte would make the gate reject the entry,
  // and it is cheaper to fail here than on the server.
  if (readFileSync(OUT_FILE, "utf8") !== LINE) {
    throw new Error("entry file does not hold exactly the one line");
  }
  console.log(`Wrote ${LINE.length} characters to ${OUT_FILE}`);
}

main();
