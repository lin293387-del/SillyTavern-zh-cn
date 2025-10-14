/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Notice: I (Jamie Sinclair) have modified the code
 * - Use mutli-threading only in a Worker context
 * - Use multi-threading only if the browser has hardware concurrency > 1
 */
import type { InitInput } from './codec/pkg/squoosh_oxipng.js';
import { OptimiseOptions } from './meta.js';
declare function initMT(moduleOrPath?: InitInput): Promise<{
    optimise: typeof import("./codec/pkg-parallel/squoosh_oxipng.js").optimise;
    optimise_raw: typeof import("./codec/pkg-parallel/squoosh_oxipng.js").optimise_raw;
}>;
declare function initST(moduleOrPath?: InitInput): Promise<{
    optimise: typeof import("./codec/pkg/squoosh_oxipng.js").optimise;
    optimise_raw: typeof import("./codec/pkg/squoosh_oxipng.js").optimise_raw;
}>;
export declare function init(moduleOrPath?: InitInput): Promise<ReturnType<typeof initMT | typeof initST>>;
export default function optimise(data: ArrayBuffer | ImageData, options?: Partial<OptimiseOptions>): Promise<ArrayBuffer>;
export {};
//# sourceMappingURL=optimise.d.ts.map