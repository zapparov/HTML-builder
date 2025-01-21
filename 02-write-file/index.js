const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Введите текст для записи в файл. Напишите "exit" или нажмите ctrl + c для выхода.',
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    rl.close();
  } else {
    fs.appendFile(filePath, input + '\n', (err) => {
      if (err) throw err;
      console.log(
        'Текст добавлен в файл. Введите еще текст или напишите "exit" для выхода.',
      );
    });
  }
});

rl.on('close', () => {
  console.log('Пока!');
  process.exit(0);
});
