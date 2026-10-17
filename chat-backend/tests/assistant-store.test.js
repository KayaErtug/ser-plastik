import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { customerTransaction, newConversation, getConversation, cleanDraft, draftRevision, saveConfirmedRequest, dataDirectory } from '../assistant-store.js';

test('visitor isolation, retention, restart persistence, confirmation and idempotence', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'lina-test-'));
  process.env.LINA_DATA_DIR = directory;
  const a = 'a'.repeat(64), b = 'b'.repeat(64);
  try {
    await assert.rejects(customerTransaction('../escape', () => {}), /INVALID_VISITOR/);
    let conversationId;
    await customerTransaction(a, customer => {
      for (let i = 0; i < 55; i++) {
        const c = newConversation(customer, 'tr');
        c.messages = Array.from({length: 70}, (_, j) => ({role: j % 2 ? 'assistant' : 'user', content: String(j)}));
        conversationId = c.id;
      }
    });
    await customerTransaction(a, customer => {
      assert.equal(customer.conversations.length, 50);
      assert.equal(customer.conversations[0].messages.length, 50);
      assert.equal(customer.conversations[0].messages[0].content, '20');
    });
    await customerTransaction(b, customer => {
      assert.equal(customer.conversations.length, 0);
      assert.throws(() => getConversation(customer, conversationId), /CONVERSATION_NOT_FOUND/);
    });
    await Promise.all(Array.from({length: 4}, () => customerTransaction(a, async customer => { const previous = customer.counter || 0; await new Promise(resolve => setTimeout(resolve, 5)); customer.counter = previous + 1; })));
    let id;
    await customerTransaction(a, async (customer, owner) => {
      assert.equal(customer.counter, 4);
      const c = getConversation(customer, conversationId);
      await assert.rejects(saveConfirmedRequest(customer, owner, c, draftRevision(c.draft)), /INCOMPLETE_DRAFT/);
      c.draft = cleanDraft({name:'Test Customer',email:'fixture@example.com',product:'Courier bags',quantity:'1000'});
      await assert.rejects(saveConfirmedRequest(customer, owner, c, 'stale'), /DRAFT_CHANGED/);
      const first = await saveConfirmedRequest(customer, owner, c, draftRevision(c.draft));
      const second = await saveConfirmedRequest(customer, owner, c, draftRevision(c.draft));
      assert.equal(first.duplicated, false); assert.equal(second.duplicated, true); assert.equal(first.id, second.id); id = first.id;
    });
    const customerFiles = await fs.readdir(path.join(dataDirectory(), 'customers'));
    const persisted = await Promise.all(customerFiles.map(file => fs.readFile(path.join(dataDirectory(), 'customers', file), 'utf8')));
    assert(persisted.some(text => JSON.parse(text).conversations.some(c => c.requestId === id)));
    assert.equal((await fs.readdir(path.join(directory,'requests'))).length, 1);
    await customerTransaction(a, customer => { customer.conversations = []; });
    assert.equal(JSON.parse(await fs.readFile(path.join(directory,'requests',`${id}.json`),'utf8')).notification.status, 'pending');
    await fs.writeFile(path.join(directory,'customers',customerFiles[0]), '{corrupt');
    const corruptToken = persisted[0].includes(conversationId) ? a : b;
    await assert.rejects(customerTransaction(corruptToken, () => {}));
  } finally { await fs.rm(directory, {recursive:true,force:true}); delete process.env.LINA_DATA_DIR; }
});
