type ParsedClipping = {
  clipping: string;
  addedAt: string;
};

type ParsedBook = {
  title: string;
  author: string;
  clippings: ParsedClipping[];
};

export function parseClippings(fileText: string): ParsedBook[] {
  const delimiter = "==========";
  const clippingsArray = fileText
    .split(delimiter)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0);

  // Use a map to group clippings by book+author
  const bookMap = new Map<string, ParsedBook>();

  for (const chunk of clippingsArray) {
    const lines = chunk
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length < 3) continue; // skip malformed

    // 1. Title and author
    const titleLine = lines[0];
    const lastParenIdx = titleLine.lastIndexOf("(");
    const lastParenEndIdx = titleLine.lastIndexOf(")");
    if (lastParenIdx === -1 || lastParenEndIdx === -1) continue;
    const title = titleLine.slice(0, lastParenIdx).trim();
    const author = titleLine.slice(lastParenIdx + 1, lastParenEndIdx).trim();

    // 2. Metadata line (find "Added on")
    const metaLine = lines[1];
    const addedOnIdx = metaLine.indexOf("Added on ");
    if (addedOnIdx === -1) continue;
    const addedAt = metaLine.slice(addedOnIdx + "Added on ".length).trim();

    // 3. Clipping text (usually line 3, but could be multi-line)
    const clipping = lines.slice(2).join(" ");

    // 4. Group by book+author
    const key = `${title}|||${author}`;
    if (!bookMap.has(key)) {
      bookMap.set(key, { title, author, clippings: [] });
    }
    bookMap.get(key)!.clippings.push({ clipping, addedAt });
  }

  return Array.from(bookMap.values());
}