import Mock from 'mockjs';

import { IRawComment } from '../comment';
import { CommentsModel, IRawComments, CommentsManager } from '../comments';

function generateComments(total: number): IRawComments {
  const comments: IRawComment[] = [];
  for (let i = 0; i < total; i++) {
    const raw = {
      id: Mock.Random.word(10),
      publishedAt: Mock.Random.time('yyyy-MM-dd HH:mm:ssZ').replace(' ', 'T'),
      content: Mock.Random.sentence(10),
      body: Mock.Random.sentence(10),
      author: { name: Mock.Random.name() },
      reactionGroups: []
    };
    comments.push(raw);
  }
  return {
    totalCount: total,
    nodes: comments
  }
}

function sliceRawComments(from: number, to: number | undefined, raw: IRawComments): IRawComments {
  const totalCount = raw.totalCount;
  const nodes: ReadonlyArray<IRawComment> = raw.nodes.slice(from, to);
  return { totalCount, nodes };
}

function buildCommentsManager(minTotal: number, maxTotal: number) {
  const count = Mock.Random.natural(minTotal, maxTotal);
  const raw = generateComments(count);
  const rawFresh = sliceRawComments(0, 10, raw);
  const rawOld = sliceRawComments(-10, undefined, raw);
  const fresh = new CommentsModel();
  fresh.parseGQResponse(rawFresh);
  const old = new CommentsModel();
  old.parseGQResponse(rawOld);
  return {
    manager: new CommentsManager(fresh, old),
    raw
  }
}

describe('comment model', () => {
  it('able to parse comments', () => {
    const count = Mock.Random.natural(50, 100);
    const raw = generateComments(count);
    const comments = new CommentsModel();
    comments.parseGQResponse(raw);
    expect(comments.totalCount).toBe(count);
    comments.contents.forEach((c, idx) => {
      expect(c.content).toEqual(raw.nodes[idx].content);
      expect(c.body).toEqual(raw.nodes[idx].body);
      expect(c.id).toEqual(raw.nodes[idx].id);
      expect(c.publishedAt).toEqual(raw.nodes[idx].publishedAt);
      expect(c.author!.displayName).toEqual(raw.nodes[idx].author.name);
    });
  });

  it('able to parse fresh and old comments', () => {
    const { manager, raw } = buildCommentsManager(50, 100);
    const count = raw.totalCount;
    expect(manager.freshComments.length).toEqual(10);
    expect(manager.oldComments.length).toEqual(10);
    expect(manager.totalCount).toEqual(count);
    expect(manager.hasUnloaded).toEqual(true);
    expect(manager.numUnloaded).toEqual(count - 20);

    const rawCont = sliceRawComments(10, 20, raw);
    const cont = new CommentsModel();
    cont.parseGQResponse(rawCont);
    manager.addComments(cont.contents);
    expect(manager.freshComments.length).toEqual(20);
    expect(manager.oldComments.length).toEqual(10);
    expect(manager.numUnloaded).toEqual(count - 30);
    expect(manager.hasUnloaded).toEqual(true);
  });

  it('able to collapse fresh and old during construction', () => {
    for(let i = 0; i <= 20; i ++) {
      const { manager, raw } = buildCommentsManager(i, i);
      expect(manager.oldComments.length).toEqual(0);
      expect ({
        num: manager.numUnloaded,
        has: manager.hasUnloaded
      }).toEqual({ num: 0, has: false });
      manager.freshComments.forEach((c, idx) => {
        expect({idx, id: c.id}).toEqual({ idx, id: raw.nodes[idx].id });
      })
    }
  });

  it ('able to collapse fresh and old after addition', () => {
    const { manager, raw } = buildCommentsManager(21, 28);
    const count = raw.totalCount;
    expect(manager.hasUnloaded).toEqual(true);
    expect(manager.numUnloaded).toEqual(count - 20);

    const rawCont = sliceRawComments(10, 20, raw);
    const cont = new CommentsModel();
    cont.parseGQResponse(rawCont);
    manager.addComments(cont.contents);

    expect(manager.numUnloaded).toEqual(0);
    expect(manager.oldComments.length).toEqual(0);
    manager.freshComments.forEach((c, idx) => {
      expect(c.id).toEqual(raw.nodes[idx].id);
    })
  });
});