import { NextResponse } from "next/server";

const LENGTH_MAP: Record<string, number> = {
  short: 8,
  medium: 12,
  long: 16,
};

const invocations = [
  "ସ୍ନେହର ଲହରୀରେ",
  "ଚନ୍ଦନୀ ଆଲୋକରେ",
  "ପବନର ଶିତଳ ସ୍ପର୍ଶରେ",
  "ଗୋଧୂଳି ରଙ୍ଗରେ",
  "ବର୍ଷା ତାଳରେ",
  "ପ୍ରଭାତୀ କହକହରେ",
];

const actions = ["ଝରେ", "ଝୁମେ", "ଗାଉଛି", "ମିଶେ", "ଜାଗେ", "ନାଚେ"];

const destinations = [
  "ମୋର ହୃଦୟରେ",
  "ତୁମ ଆଖିରେ",
  "ସାଗର ତୀରେ",
  "ପ୍ରତିଧ୍ଵନି ଭିତରେ",
  "ରଙ୍ଗିନ ଆକାଶତଳେ",
  "ଶାନ୍ତ ସନ୍ଧ୍ୟାରେ",
];

const imagery = [
  "ବାଂଶୀର ମନ୍ଥର ଧ୍ୱନି",
  "ଜହ୍ନରୀ ଆଲୋକ",
  "ଚୁଆଣିଅଛି ଦିଆରା ପବନ",
  "ମାତାଳିଥିବା ଜୟଦେବ ରାଗ",
  "ପଦ୍ମ ପତ୍ରର ଗନ୍ଧ",
  "ନିଳାକାଶ ଭିତରେ ଶୁଭ୍ର ମେଘ",
];

const textures = [
  "ସ୍ନିଗ୍ଧ ସ୍ପର୍ଶ",
  "ଧଡ଼କନ",
  "ଭାବନା",
  "ମାୟା",
  "ପ୍ରେମର ଆଲୋକ",
  "ସ୍ଵପ୍ନ ତରଙ୍ଗ",
];

const pulses = [
  "ସରଗମ ତାଳ",
  "ମୃଦୁଙ୍ଗର ଘୋଷ",
  "ଢୋଲର ରିଦମ୍",
  "ଘୁଞ୍ଚିଘୁଞ୍ଚି ନାଚୁଥିବା ସୁର",
  "ତାବଲା ଚାପର",
  "ଗିଟାରର ମିଷ୍ଟି ରିଫ",
];

const whispers = [
  "ମିଷ୍ଟି କଥା କହେ",
  "ଆଶାର ଗଳ୍ପ ଗାଏ",
  "ଆଲୋକର ଚାୟା ବୁନେ",
  "ସ୍ପନ୍ଦନର ନାଁ ଦିଏ",
  "ଦୂର ଚିନ୍ତାକୁ ନିଆଁ ଦିଏ",
  "ପ୍ରେମର ପ୍ରସ୍ଥାନ ଲେଖେ",
];

type LineTemplate = (topic: string, possessive: string) => string;

const refrains: LineTemplate[] = [
  (_topic, possessive) => `${possessive} ସ୍ପନ୍ଦନ, ମୋ ସୁର, ତୁମ ସ୍ଵପ୍ନର ସାଙ୍ଗେ`,
  (topic, possessive) => `ହେ ${topic}, ${possessive} ସ୍ପନ୍ଦନେ ରହ ତୁମେ`,
  (_topic, possessive) => `${possessive} ମେଳରେ ମିଳିଲା ମୋର ନୂତନ ପଥ`,
];

const templates: LineTemplate[] = [
  (_topic, possessive) =>
    `${randomOf(invocations)} ${possessive} ସ୍ପନ୍ଦନ ${randomOf(actions)} ${randomOf(destinations)}`,
  (_topic, possessive) =>
    `${randomOf(imagery)} ${randomOf(whispers)} ${possessive} କଥା`,
  (topic, possessive) => `${topic} ସୁରରେ ${possessive} ${randomOf(textures)} ଲୁଚିଛି`,
  (_topic, possessive) =>
    `${randomOf(pulses)} ସହିତ ${possessive} ଟିପ୍ତାପ୍ ସ୍ଵର`,
  (topic, possessive) =>
    `${randomOf(invocations)} ${topic} ସ୍ଵପ୍ନକୁ ପ୍ରେରେଇ, ${possessive} ଦୀପ ଜ୍ୱାଳେ`,
  (_topic, possessive) => `ମାଟିର ଗନ୍ଧରେ ${possessive} ଶିଶୁ ସ୍ମିତା ଜାଗେ`,
  (topic, possessive) => `${topic} ଆଲୋକରେ ${possessive} ମନ ଝୁଲାଏ ଗୀତ`,
  (topic, possessive) =>
    `${randomOf(imagery)} ମଧ୍ୟରେ ${topic} ଆଶା ଡାକେ, ${possessive} ପଥ ଜାଗ୍ରତ`,
];

function randomOf<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function normaliseTopic(input: string) {
  const cleaned = input.trim().replace(/\s{2,}/g, " ");
  if (!cleaned) {
    return { topic: "ପ୍ରେମ", possessive: "ପ୍ରେମର" };
  }
  const topic = cleaned;
  const possessive = cleaned.endsWith("ର") ? cleaned : `${cleaned}ର`;
  return { topic, possessive };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic = "", length = "medium" } = body ?? {};

    const targetLines =
      typeof length === "string" && LENGTH_MAP[length] ? LENGTH_MAP[length] : LENGTH_MAP.medium;

    const { topic: normalizedTopic, possessive } = normaliseTopic(String(topic ?? ""));
    const lyricsSet = new Set<string>();
    const lines: string[] = [];

    let safetyCounter = 0;
    while (lines.length < targetLines && safetyCounter < targetLines * 10) {
      safetyCounter += 1;
      const template = Math.random() < 0.25 ? randomOf(refrains) : randomOf(templates);

      const line = template(normalizedTopic, possessive).replace(/\s+/g, " ").trim();
      if (!lyricsSet.has(line)) {
        lyricsSet.add(line);
        lines.push(line);
      }
    }

    return NextResponse.json({ lines });
  } catch {
    return NextResponse.json(
      { error: "Unable to generate lyrics at the moment." },
      { status: 400 },
    );
  }
}
