function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-(min)+1)+(min));
};

function randomFloatFromInterval(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2)
}

function bannedPixel(point) {
    let ban1 = point.x == 167 && point.y == -57;
    let ban2 = point.x == 168 && point.y == -57;
    return ban1 || ban2;
}

self.addEventListener('message', function(e) {
    var _curPicPoints = e.data[0];
    var _count = e.data[1];

    var values = {
        startPosition: [],
        endPosition: [],
        alpha: [],
        animation: [],
        delayDuration: [],
    };
    
    for (var i = 0; i < _count; i++) {
        if (i < _curPicPoints.length) {
            if (!bannedPixel(_curPicPoints[i])) {
                values.startPosition[0] = _curPicPoints[i].x;
                values.startPosition[1] = _curPicPoints[i].y;
                values.startPosition[2] = randomIntFromInterval(-2, 0);

                values.animation[0] = 0;
                values.animation[1] = 0;
                values.animation[2] = 1;
            }
        } else {
            values.startPosition[0] = 0;
            values.startPosition[1] = 0;
            values.startPosition[2] = 0;
            values.animation[2] = 0;
        }

        let t = i % 10 == 0;

        let maxDiff = t ? 220 : randomIntFromInterval(30, 140);

        let x = _curPicPoints[i] ? _curPicPoints[i].x : 0;
        let y = _curPicPoints[i] ? _curPicPoints[i].y : 0;

        let rndX = randomIntFromInterval((x - ((maxDiff - 0) * (randomFloatFromInterval(0.001, 1)))), x + ((maxDiff - 0) * (randomFloatFromInterval(0.001, 1))));
        let rndY = randomIntFromInterval((y - (maxDiff * (randomFloatFromInterval(0.001, 1))) + 0), y + (maxDiff * (randomFloatFromInterval(0.001, 1))));
        let rndZ = 0;

        values.endPosition[0] = rndX;
        values.endPosition[1] = rndY;
        values.endPosition[2] = -100;

        let p = i % 25 == 0;
        let q = i % 15 == 0;

        let o = i % 8;

        // values.alpha[0] = 0; // values.ALpha
        values.alpha[0] = randomFloatFromInterval(0.25, 0.5); // Scale
        values.alpha[1] = randomFloatFromInterval(0.1, 0.9) / 1000; // Duration
        values.alpha[2] = p ? randomFloatFromInterval(3.5, 4.5) : randomFloatFromInterval(0.15, 0.3); // Range

        values.delayDuration[0] = t ? randomIntFromInterval(1000, 1600) : 0;
        // let interval = this.getInterval();
        // value.delayDuration.y = delays.s ? 0 : delays.t ? randomIntFromInterval(120, 350) : randomFloatFromInterval(270, 680);

        let delayBatches = {
            first: i % 300 == 0,
            second: i % 200 == 0,
            third: i % 100 == 0,
            fourth: i % 20 == 0,
            fifth: i % 10 == 0,
            sixth: i % 3 == 0,
        }

        if (delayBatches.first) {
            values.delayDuration[1] = 0;
        } else if (delayBatches.second) {
            values.delayDuration[1] = randomIntFromInterval(100, 240);
        } else if (delayBatches.third) {
            values.delayDuration[1] = randomIntFromInterval(220, 360);
        } else if (delayBatches.fourth) {
            values.delayDuration[1] = randomIntFromInterval(340, 480);
        } else if (delayBatches.fifth) {
            values.delayDuration[1] = randomIntFromInterval(460, 600);
        } else if (delayBatches.sixth) {
            values.delayDuration[1] = randomIntFromInterval(580, 720);
        } else {
            values.delayDuration[1] = randomIntFromInterval(700, 1100);
        }

        self.postMessage([values, i]);
    }

    self.postMessage('Done');
    self.close();
});