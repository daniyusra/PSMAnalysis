import * as fs from "fs";

const directory: string = process.argv.slice(3)[0];

const csv = fs.readFileSync(directory, "utf-8").split("\r\n");

let expensive: number[] = [];
let cheap: number[] = [];
let tooExpensive: number[] = [];
let tooCheap: number[] = [];

for (const line of csv) {
  const elements = line.split(",");
  if (isNaN(Number(elements[0]))) {
    continue;
  }
  if (elements.length < 5) {
    continue;
  }
  expensive.push(Number(elements[1]));
  cheap.push(Number(elements[2]));
  tooExpensive.push(Number(elements[3]));
  tooCheap.push(Number(elements[4]));
}

interface Occurence {
  point: number;
  totalpeople: number;
}

//converts a sorted list of numbers into "occurences", which specify how many percent think a certain number is beyond a threshold
//can be ascending (from 0% to 100%) or descending (from 100% to 0%)
function getOccurence(
  target: number[],
  ascending: boolean = true
): Occurence[] {
  let counter = 0;
  let prevcon = counter;
  const original = target.length;
  let allOccurences: Occurence[] = [];

  if (!ascending) {
    counter = target.length;
  }
  while (target.length != 0) {
    let comnum: number = 0;
    prevcon = counter;
    do {
      comnum = target.splice(0, 1)[0];
      if (ascending) {
        counter += 1;
      } else {
        counter -= 1;
      }

      if (target.length == 0) {
        break;
      }
    } while (comnum == target[0]);

    let currentOccurence: Occurence = {
      point: comnum,
      totalpeople: counter / original,
    };

    if (!ascending) {
      currentOccurence = {
        point: comnum,
        totalpeople: prevcon / original,
      };
    }

    allOccurences.push(currentOccurence);
  }

  return allOccurences;
}

// finds the intersection and returns x value between two occurence graphs, one ascending and one descending
// program will not function well if the graphs have the same direction
function getKousatenFromOccurencesWithPrecision(
  ascendingOccurence: Occurence[],
  descendingOccurence: Occurence[],
  precision: number = 50
): number {
  let x1, x2, x3, x4, y1, y2, y3, y4: number;

  let finalAscendingOccurence: Occurence = {
    point: 0,
    totalpeople: 0,
  };

  let finalDescendingOccurence: Occurence = {
    point: 0,
    totalpeople: 0,
  };

  let finalAscendingOccurence2: Occurence = {
    point: 0,
    totalpeople: 0,
  };

  let finalDescendingOccurence2: Occurence = {
    point: 0,
    totalpeople: 0,
  };

  let currentCounter = 0;

  while (true) {
    currentCounter += precision;

    while (ascendingOccurence[0].point < currentCounter + 1) {
      finalAscendingOccurence = ascendingOccurence.splice(0, 1)[0];
    }

    while (descendingOccurence[0].point < currentCounter + 1) {
      finalDescendingOccurence = descendingOccurence.splice(0, 1)[0];
    }

    if (
      finalAscendingOccurence.totalpeople > finalDescendingOccurence.totalpeople
    ) {
      break;
    }

    finalAscendingOccurence2 = finalAscendingOccurence;
    finalDescendingOccurence2 = finalDescendingOccurence;
  }

  x1 = currentCounter - precision;
  y1 = finalAscendingOccurence2.totalpeople;

  x2 = currentCounter;
  y2 = finalAscendingOccurence.totalpeople;

  x3 = currentCounter - precision;
  y3 = finalDescendingOccurence2.totalpeople;

  x4 = currentCounter;
  y4 = finalDescendingOccurence.totalpeople;

  return Math.ceil(
    ((y3 - y1) * (x1 - x2) * (x3 - x4) +
      x1 * (y1 - y2) * (x3 - x4) -
      x3 * (y3 - y4) * (x1 - x2)) /
      ((y1 - y2) * (x3 - x4) - (x1 - x2) * (y3 - y4))
  );
}

//convert each column into occurences
let a = getOccurence(
  cheap.sort((n1, n2) => n1 - n2),
  false
);
let b = getOccurence(expensive.sort((n1, n2) => n1 - n2));
let c = getOccurence(
  tooCheap.sort((n1, n2) => n1 - n2),
  false
);
let d = getOccurence(tooExpensive.sort((n1, n2) => n1 - n2));

console.log("checkpoint 2");

//compare each ascending with descending columns to get the x value of the intersection
console.log(
  "最高価格",
  getKousatenFromOccurencesWithPrecision(d.slice(0), a.slice(0)),
  "円"
);
console.log(
  "妥協価格",
  getKousatenFromOccurencesWithPrecision(b.slice(0), a.slice(0)),
  "円"
);
console.log(
  "理想価格",
  getKousatenFromOccurencesWithPrecision(d.slice(0), c.slice(0)),
  "円"
);
console.log(
  "最低品質保証価格",
  getKousatenFromOccurencesWithPrecision(b.slice(0), c.slice(0)),
  "円"
);
