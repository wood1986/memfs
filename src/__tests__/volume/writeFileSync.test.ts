import { create } from '../util';
import { Node } from '../../node';

describe('writeFileSync(path, data[, options])', () => {
  const data = 'asdfasidofjasdf';
  it('Create a file at root (/writeFileSync.txt)', () => {
    const vol = create();
    vol.writeFileSync('/writeFileSync.txt', data);

    const node = vol.root.getChild('writeFileSync.txt').getNode();
    expect(node).toBeInstanceOf(Node);
    expect(node.getString()).toBe(data);
  });
  it('Write to file by file descriptor', () => {
    const vol = create();
    const fd = vol.openSync('/writeByFd.txt', 'w');
    vol.writeFileSync(fd, data);
    const node = vol.root.getChild('writeByFd.txt').getNode();
    expect(node).toBeInstanceOf(Node);
    expect(node.getString()).toBe(data);
  });
  it('Write to two files (second by fd)', () => {
    const vol = create();

    // 1
    vol.writeFileSync('/1.txt', '123');

    // 2, 3, 4
    const fd2 = vol.openSync('/2.txt', 'w');
    const fd3 = vol.openSync('/3.txt', 'w');
    const fd4 = vol.openSync('/4.txt', 'w');

    vol.writeFileSync(fd2, '456');

    expect(
      vol.root
        .getChild('1.txt')
        .getNode()
        .getString(),
    ).toBe('123');
    expect(
      vol.root
        .getChild('2.txt')
        .getNode()
        .getString(),
    ).toBe('456');
  });
  it('Write at relative path that does not exist throws correct error', () => {
    const vol = create();
    try {
      vol.writeFileSync('a/b', 'c');
      throw new Error('not_this');
    } catch (err) {
      expect(err.code).toBe('ENOENT');
    }
  });
});
