module.exports = {
  tabWidth: 2, //两个空格
  jsxSingQute: true,
  printWidth: 500, //一行输入多少个字符
  singQute: true,
  semi: false,
  endOfLine: "crlf",
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 200,
      },
    },
  ],
  allowParens: "always",
}
