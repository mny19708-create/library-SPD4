import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

const envPath = fileURLToPath(new URL('./.env', import.meta.url));

async function readHidden(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('Run npm run admin:password in an interactive terminal.');
  }

  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve, reject) => {
    let value = '';
    const finish = (error) => {
      process.stdin.removeListener('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') return finish(new Error('Password reset cancelled.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
        } else if (character >= ' ') {
          value += character;
        }
      }
    };

    process.stdin.on('data', onData);
  });
}

async function main() {
  let contents;
  try {
    contents = await readFile(envPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('backend/.env does not exist. Create it from backend/.env.example first.');
    }
    throw error;
  }

  const config = dotenv.parse(contents);
  if (!config.ADMIN_USERNAME && !config.ADMIN_EMAIL) {
    throw new Error('Set ADMIN_USERNAME in backend/.env before resetting the password.');
  }

  let password;
  while (true) {
    password = await readHidden('New Admin password (input hidden, at least 12 characters): ');
    if (password.length < 12) {
      console.error(`Password is too short (${password.length} characters). Enter at least 12 characters; the current password has not changed.`);
      continue;
    }

    const confirmation = await readHidden('Re-enter Admin password (input hidden): ');
    if (password !== confirmation) {
      console.error('Passwords do not match. The current password has not changed. Try again.');
      continue;
    }
    break;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const updated = /^ADMIN_PASSWORD_HASH=.*$/m.test(contents)
    ? contents.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${passwordHash}`)
    : `${contents.trimEnd()}\nADMIN_PASSWORD_HASH=${passwordHash}\n`;
  await writeFile(envPath, updated, 'utf8');
  console.log('Admin password updated in the ignored backend/.env file.');
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
