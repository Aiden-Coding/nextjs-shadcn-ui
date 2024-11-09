import * as fs from "fs";
import * as path from "path";

/**
 * 获取 JS 文件的路径(从模块所在目录查找)
 * @param name - 文件名
 * @param moduleFile - 模块路径
 * @returns 路径
 */
function getJsPath(name: string | null = null, moduleFile: string | null = null): string {
  if (!name || !moduleFile) {
    throw new Error("Both name and moduleFile must be provided");
  }

  // 获取模块所在的目录的绝对路径
  const moduleFolder = path.resolve(path.dirname(path.dirname(moduleFile)));

  // 构建到 air 文件夹的路径
  const moduleJsonPath = path.join(moduleFolder, "air", name);

  return moduleJsonPath;
}

/**
 * 获取 JS 文件的内容
 * @param fileName - JS 文件名
 * @returns 文件内容
 */
function getFileContent(fileName: string = "crypto.js"): string {
  // 确保文件名不为空
  if (!fileName) {
    throw new Error("File name must be provided");
  }

  // 使用 Node.js 的 __filename 来获取当前文件的路径
  const filePath = path.join(path.dirname(path.dirname(__filename)), "air", fileName);

  try {
    // 读取文件内容
    const fileData = fs.readFileSync(filePath, "utf8");
    return fileData;
  } catch (error) {
    // 如果读取文件失败，抛出错误
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

// 使用示例
try {
  const fileContent = getFileContent("crypto.js");
  console.log(fileContent);
} catch (error) {
  console.error(error);
}
