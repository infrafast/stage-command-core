import type {DurationLocaleHooks} from "./duration.js";
import type {NumberLocaleHooks} from "./numbers.js";

export interface StageCommandLocaleHooks {
  locale: string;
  numbers?: NumberLocaleHooks;
  durations?: DurationLocaleHooks;
}

export function defineLocaleHooks(
  hooks: StageCommandLocaleHooks,
): StageCommandLocaleHooks {
  return hooks;
}
