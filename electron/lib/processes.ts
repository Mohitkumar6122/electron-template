import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

// export function execFileAsync(
//   file: string,
//   args: string[]
// ): Promise<{ stdout: string; stderr: string }> {
//   return new Promise((resolve, reject) => {
//     execFile(
//       file,
//       args,
//       { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
//       (error, stdout, stderr) => {
//         if (error)
//           return reject(
//             new Error(
//               `${
//                 error instanceof Error ? error.message : String(error)
//               }\n${stderr}`
//             )
//           )
//         resolve({ stdout, stderr })
//       }
//     )
//   })
// }

export const execFileAsync = promisify(execFile)
