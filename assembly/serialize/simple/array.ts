import { bs } from "as-bs";
import { COMMA, BRACKET_RIGHT, BRACKET_LEFT } from "../../custom/chars";
import { JSON } from "../..";

export function serializeArray<T extends any[]>(src: T, staticSize: bool = false): void {
  const srcSize = load<u32>(changetype<usize>(src), offsetof<T>("byteLength"));
  
  if (srcSize == 0) {
    if (!staticSize) bs.ensureSize(4);
    store<u32>(bs.offset, 6094939);
    bs.offset += 4;
    return;
  }

  let srcPtr = src.dataStart;
  const srcEnd = srcPtr + srcSize - sizeof<valueof<T>>();
  // if (!bs.buffer) bs.setBuffer(__new(srcSize << 3, idof<string>()));
  // else 
  if (!staticSize) bs.ensureSize(srcSize << 3);

  store<u16>(bs.offset, BRACKET_LEFT);
  bs.offset += 2;

  while (srcPtr < srcEnd) {
    const block = load<valueof<T>>(srcPtr);
    JSON.__serialize<valueof<T>>(block);
    if (!staticSize) bs.ensureSize(2);
    store<u16>(bs.offset, COMMA);
    bs.offset += 2;
    srcPtr += sizeof<string>();
  }

  const lastBlock = load<valueof<T>>(srcPtr);
  JSON.__serialize<valueof<T>>(lastBlock);
  if (!staticSize) bs.ensureSize(2);
  store<u16>(bs.offset, BRACKET_RIGHT);
  bs.offset += 2;
}
