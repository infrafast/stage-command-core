export interface CorpusCase<TExpected> {
  utterance: string;
  expected: TExpected;
  locale?: string;
  name?: string;
}

export interface CorpusFailure<TExpected, TActual> {
  index: number;
  name?: string;
  utterance: string;
  expected: TExpected;
  actual: TActual;
}

export interface CorpusRun<TExpected, TActual> {
  total: number;
  passed: number;
  failures: readonly CorpusFailure<TExpected, TActual>[];
}

export async function runCorpus<TExpected, TActual>(
  cases: readonly CorpusCase<TExpected>[],
  evaluate: (utterance: string, locale?: string) => Promise<TActual> | TActual,
  equals: (actual: TActual, expected: TExpected) => boolean,
): Promise<CorpusRun<TExpected, TActual>> {
  const failures: CorpusFailure<TExpected, TActual>[] = [];

  for (const [index, testCase] of cases.entries()) {
    const actual = await evaluate(testCase.utterance, testCase.locale);
    if (!equals(actual, testCase.expected)) {
      const failure: CorpusFailure<TExpected, TActual> = {
        index,
        utterance: testCase.utterance,
        expected: testCase.expected,
        actual,
      };
      if (testCase.name !== undefined) failure.name = testCase.name;
      failures.push(failure);
    }
  }

  return {
    total: cases.length,
    passed: cases.length - failures.length,
    failures,
  };
}
