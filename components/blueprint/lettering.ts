import { activeRoleParagraph } from "./geometry";

/**
 * Snapshot visible source typography without allowing animation layers to
 * leak into the blueprint. The caller controls positioning using the original
 * element's line box; this module never measures or truncates glyph ink.
 */
export function createBlueprintTextSnapshot(source: HTMLElement): HTMLElement {
  const clone=source.cloneNode(true) as HTMLElement;
  if (source.matches("[data-blueprint-role]")) {
    const active=activeRoleParagraph(source);
    if(active) clone.replaceChildren(active.cloneNode(true));
  }
  const cs=getComputedStyle(source);
  const properties=["font-family","font-size","font-weight","font-style","line-height", "letter-spacing",
    "text-align","white-space","word-break","overflow-wrap","text-transform","text-wrap",
    "padding-left","padding-right","padding-top","padding-bottom","display","align-items"];
  for(const property of properties) {
    const value=cs.getPropertyValue(property);
    if(value)clone.style.setProperty(property,value);
  }
  clone.removeAttribute("id");
  // Do not clone Tailwind border/underline/background classes from structural
  // wrappers. The role container has `border-t`: reproducing it as lettering
  // created the long black rule running beneath the username.
  clone.className = "bp-text-snapshot";
  clone.removeAttribute("data-blueprint-role");
  clone.removeAttribute("data-blueprint-part");
  clone.style.setProperty("border", "0", "important");
  clone.style.setProperty("background", "transparent", "important");
  clone.style.setProperty("box-shadow", "none", "important");
  clone.style.setProperty("outline", "none", "important");
  clone.style.setProperty("width","100%","important");
  clone.style.setProperty("max-width","none","important");
  clone.style.setProperty("height","auto","important");
  clone.style.setProperty("margin","0","important");
  clone.style.setProperty("opacity","1","important");
  clone.style.setProperty("transform","none","important");
  clone.style.setProperty("animation","none","important");
  clone.style.setProperty("color","white","important");
  for(const descendant of Array.from(clone.querySelectorAll<HTMLElement>("*"))) {
    descendant.removeAttribute("id");
    descendant.style.setProperty("opacity","1","important");
    descendant.style.setProperty("transform","none","important");
    descendant.style.setProperty("animation","none","important");
    descendant.style.setProperty("transition","none","important");
    descendant.style.setProperty("color","white","important");
  }
  // A snapshot is decorative: copied links and controls must never become
  // keyboard-focus targets or duplicate content for assistive technologies.
  clone.setAttribute("aria-hidden","true");
  clone.setAttribute("inert","");
  return clone;
}
