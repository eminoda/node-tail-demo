const fs = require('fs');

let isFinish = true;
let oldPos = fs.statSync('./test.txt').size;
let start = 0;
let end = 0;

fs.watchFile('./test.txt', {
    interval: 10
}, (curr, prev) => {
    // console.log(`oldPos--${oldPos}，curr--${curr.size}，prev--${prev.size}, isFinish--${isFinish}`);
    // 文件更新了
    if (curr.size > prev.size) {
        // 阅读未完成
        if (!isFinish) {
            if (prev.size > oldPos) {
                start = oldPos;
            }
        } else {
            start = oldPos;
            end = curr.size;
            oldPos = end;
            readContnent(start, end);
        }
    }
})

function readContnent(start, end) {
    // console.log(`start--${start},end--${end}`);
    isFinish = false;
    const steam = fs.createReadStream('./test.txt', {
        start: start,
        end: end
    });
    steam.on('data', (chunk) => {
        // console.log('\r\n');
        // console.log('文件变化内容：');
        // console.log('\r\n');
        console.log(chunk.toString());
    });
    steam.on('end', () => {
        isFinish = true;
    });
}

let i = 0;
setInterval(() => {
    fs.appendFile('./test.txt', '\r\n' + i++, () => { });
}, 1000);
