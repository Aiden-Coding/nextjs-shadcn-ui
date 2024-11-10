import fs from "fs";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadAndExecuteJS(path_name: string, functionName: string, ...args: any[]) {
  const jsContent = fs.readFileSync(path_name, "utf-8");

  // 将 JavaScript 代码包裹在一个函数中，以便我们可以调用它
  const jsFunction = new Function(
    `return function ${functionName}(param) { ${jsContent}; return ${functionName}(param); }`
  )();

  // 调用函数并传递参数
  if (typeof jsFunction === "function") {
    const result = jsFunction(...args);
    return result;
  } else {
    console.error(`Function '${functionName}' not found in the script.`);
  }
}
