interface FetchPassageArgs {
  osis: string;
  translation?: string;
  includeContext: boolean;
}

interface PassageText {
  osis: string;
  translation: string;
  verses: { reference: string; text: string }[];
  context?: {
    previous?: string;
    next?: string;
  };
}

export async function fetchPassageText(args: FetchPassageArgs): Promise<PassageText | null> {
  const translation = args.translation ?? "ESV";
  return {
    osis: args.osis,
    translation,
    verses: [
      {
        reference: args.osis,
        text: "[Scripture text placeholder]",
      },
    ],
    context: args.includeContext ? { previous: undefined, next: undefined } : undefined,
  };
}
