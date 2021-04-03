import { ViewPlugin, MatchDecorator, Decoration } from "@codemirror/view";

/**
 * CodeMirror’s highlight specialchars plugin breaks spellchecking with
 * LanguageTool and most other decorations. This is just a very simplified
 * version, that just highlights common white-space characters in western
 * languages.
 */

const UnicodeRegexpSupport = /x/.unicode != null ? "gu" : "g"
const Invisibles = [
  "\u0020", // Space
  "\u00a0", // No-Break Space
  "\u00ad", // Soft Hyphen
  "\u200b", // Zero-width Space
  "\u0009", // Tab
];
const InvisiblesRegex = new RegExp(`[${Invisibles.join("")}]`, UnicodeRegexpSupport);

export default() => {
  const decorator = new MatchDecorator({
    regexp: InvisiblesRegex,
    decoration: (match) => {
      return Decoration.mark({
        class: "cm-invisible-char",
        attributes: { "data-code": match[0].charCodeAt(0) }
      });
    },
  });

  return [
    ViewPlugin.define(
      (view) => ({
        decorations: decorator.createDeco(view),
        update(u) {
          this.decorations = decorator.updateDeco(u, this.decorations);
        },
      }),
      {
        decorations: (v) => v.decorations,
      }
    )
  ];
};
