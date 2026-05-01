/**
 * Bio-as-code poetry. Each snippet is tokenized so we can colour it
 * without a full highlighter — good enough for single-language JS.
 */

export type Token = {
  text: string;
  color:
    | "default"
    | "keyword"
    | "string"
    | "number"
    | "comment"
    | "fn"
    | "prop"
    | "punct";
};

export type Snippet = {
  title: string;
  lang: string;
  tokens: Token[];
};

const k = (text: string): Token => ({ text, color: "keyword" });
const s = (text: string): Token => ({ text, color: "string" });
const n = (text: string): Token => ({ text, color: "number" });
const c = (text: string): Token => ({ text, color: "comment" });
const f = (text: string): Token => ({ text, color: "fn" });
const p = (text: string): Token => ({ text, color: "prop" });
const pu = (text: string): Token => ({ text, color: "punct" });
const t = (text: string): Token => ({ text, color: "default" });

export const snippets: Snippet[] = [
  {
    title: "about.ts",
    lang: "typescript",
    tokens: [
      c("// welcome to MicaelleOS"),
      t("\n"),
      k("const "),
      t("creative"),
      pu(" = "),
      pu("{"),
      t("\n  "),
      p("name"),
      pu(": "),
      s("\"Micaelle Lages\""),
      pu(","),
      t("\n  "),
      p("role"),
      pu(": "),
      s("\"multimedia designer\""),
      pu(","),
      t("\n  "),
      p("loves"),
      pu(": ["),
      s("\"pixels\""),
      pu(", "),
      s("\"motion\""),
      pu(", "),
      s("\"magic\""),
      pu("],"),
      t("\n  "),
      p("building"),
      pu(": "),
      s("\"this portfolio\""),
      pu(","),
      t("\n"),
      pu("};"),
    ],
  },
  {
    title: "now.ts",
    lang: "typescript",
    tokens: [
      c("// what's running right now"),
      t("\n"),
      k("while "),
      pu("("),
      t("awake"),
      pu(") {"),
      t("\n  "),
      f("sketch"),
      pu("(); "),
      f("render"),
      pu("(); "),
      f("iterate"),
      pu("();"),
      t("\n  "),
      k("if "),
      pu("("),
      t("coffee "),
      pu("< "),
      n("1"),
      pu(") "),
      f("brew"),
      pu("();"),
      t("\n"),
      pu("}"),
    ],
  },
  {
    title: "hello.ts",
    lang: "typescript",
    tokens: [
      k("export function "),
      f("hello"),
      pu("("),
      t("visitor"),
      pu(": "),
      k("string"),
      pu(") {"),
      t("\n  "),
      k("return "),
      s("`hi "),
      pu("${"),
      t("visitor"),
      pu("}"),
      s(", make yourself at home.`"),
      pu(";"),
      t("\n"),
      pu("}"),
    ],
  },
];
