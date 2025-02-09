import { BRACKET_LEFT, BRACKET_RIGHT } from "../../../custom/chars";
import { JSON } from "../../../";

export function deserializeArrayArray<T extends unknown[][]>(srcStart: usize, srcEnd: usize, dst: usize): T {
  const out = dst ? changetype<T>(dst) : instantiate<T>();
  let lastIndex: usize = 0;
  let depth: u32 = 0;
  while (srcStart < srcEnd) {
    const code = load<u16>(srcStart);
    if (code == BRACKET_LEFT && depth++ == 0) {
      lastIndex = srcStart;
    } else if (code == BRACKET_RIGHT && --depth == 0) {
      out.push(JSON.__deserialize<valueof<T>>(lastIndex, srcStart));
    }
    srcStart += 2;
  }
  return out;
}
