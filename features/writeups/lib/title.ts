const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/;

export function parseWriteupTitle(rawTitle: string) {
  const title = rawTitle.trim();
  const pipeParts = title.includes("|")
    ? title.split("|").map((part) => part.trim())
    : [title];

  const linkMatch = title.match(markdownLinkPattern);

  if (!linkMatch) {
    return {
      left: pipeParts[0] ?? title,
      right: pipeParts[1] ?? "",
      href: undefined as string | undefined,
    };
  }

  const linkText = linkMatch[1].trim();
  const href = linkMatch[2].trim();
  const left = pipeParts[0] ?? title.replace(linkMatch[0], "").trim();

  return {
    left,
    right: linkText,
    href,
  };
}
