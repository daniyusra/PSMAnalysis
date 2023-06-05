
//declares CSV directory
var directory: string = process.argv.slice(3)[0];

//console.log(directory);

import * as fs from 'fs';

const csv= fs.readFileSync(directory, 'utf-8').split('\r\n');

//console.log(csv);

let expensive : number[] = []
let cheap : number[] = []
let tooExpensive : number[] = []
let tooCheap : number[] = []

for (var i = 1; i < csv.length; i++) {
    const elements = csv[i].split(',');
    if (elements.length < 5 ){
        continue;
    }
    expensive.push(Number(elements[1]));
    cheap.push(Number(elements[2]));
    tooExpensive.push(Number(elements[3]));
    tooCheap.push(Number(elements[4]));
  }

/*

function getKousaten(descending_num:number[],ascending_num:number[]): number{

    let desnum : number[] = []
    let asnum : number[] = []

    let descending_num_start : number = descending_num.length
    let ascending_num_start : number = 0;
    let prev_desnum_start : number = descending_num_start;
    let prev_asnum_start : number = ascending_num_start;

    while (descending_num_start >= ascending_num_start){
        prev_desnum_start  = descending_num_start;
        prev_asnum_start = ascending_num_start;

        if (descending_num[0] < ascending_num[0]){
            if (desnum.length == 2){
                desnum.splice(0,1);
            }

            desnum.push(descending_num[0])

            let comnum = descending_num[0]
    
            do {
                comnum = descending_num.splice(0,1)[0]
                descending_num_start -= 1;
            } while (comnum == descending_num[0])

            console.log(desnum)
        } else {  
            if(asnum.length == 2){
                asnum.splice(0,1)
            }
            
            asnum.push(ascending_num[0])

            let comnum = ascending_num[0]

            do {
                comnum = ascending_num.splice(0,1)[0]
                ascending_num_start += 1;
            } while (comnum == ascending_num[0])
        }

    }

    console.log("DESNUM" )
    console.log(desnum)

    console.log("ASNUM")
    console.log(asnum)

    console.log(descending_num_start)
    console.log(ascending_num_start)

    console.log(prev_desnum_start )
    console.log(prev_asnum_start )

    console.log(
        ((prev_desnum_start - prev_asnum_start)*(asnum[0] - asnum[1])*(desnum[0] - desnum[1])
    + asnum[0]*(prev_asnum_start - ascending_num_start)*(desnum[0] - desnum[1]) 
    - desnum[0]*(prev_desnum_start - descending_num_start)*(asnum[0] - asnum[1]))
    / ((asnum[0] - asnum[1])*(prev_desnum_start - descending_num_start) 
    - (desnum[0] - desnum[1])*(prev_asnum_start - ascending_num_start))
    
    
    )
    return 0;
}*/

interface Occurence {
    point:number,
    totalpeople : number,
}

function Occurence(point: number, totalpeople:number): Occurence { 
    return {
        point: point,
        totalpeople : totalpeople
    };
}

function getOccurence(target : number[], ascending : boolean = true):Occurence[]{
    let counter = 0;
    let prevcon = counter;
    let original = target.length
    let allOccurences : Occurence[] = [];


    if (!ascending){
        counter = target.length
    }
    while(target.length != 0){
        let comnum;
        prevcon = counter;
        do {
            comnum = target.splice(0,1)[0]
            if (ascending){
                counter += 1;
            } else {
                counter -= 1;
            }

            if(target.length == 0){
                break;
            }
        } while (comnum == target[0])

        var currentOccurence = Occurence(comnum,counter/original)

        if(!ascending){
            currentOccurence = Occurence(comnum,prevcon/original)
        }

        allOccurences.push(currentOccurence)
    }

    return allOccurences;
}

function getKousatenFromOccurences(ascendingOccurence: Occurence[], descendingOccurence: Occurence[]):number{
    let x1,x2,x3,x4,y1,y2,y3,y4:number;

    let finalAscendingOccurence: Occurence = Occurence(0,0);
    let finalDescendingOccurence: Occurence = Occurence(0,0);
    while(ascendingOccurence[0].totalpeople <= descendingOccurence[0].totalpeople){
        if(ascendingOccurence[0].point < descendingOccurence[0].point){
            finalAscendingOccurence = ascendingOccurence.splice(0,1)[0]
        } else {
            finalDescendingOccurence = descendingOccurence.splice(0,1)[0]
        }
    }
    /*
    console.log(finalAscendingOccurence)
    console.log(finalDescendingOccurence)
    console.log(ascendingOccurence)
    console.log(descendingOccurence)
*/

    x1 = finalAscendingOccurence.point;
    y1 = finalAscendingOccurence.totalpeople;
    
    x2 = ascendingOccurence[0].point;
    y2 = ascendingOccurence[0].totalpeople;

    x3 = finalDescendingOccurence.point;
    y3 = finalDescendingOccurence.totalpeople;

    x4 = descendingOccurence[0].point;
    y4 = descendingOccurence[0].totalpeople;

    return (
        (   
            (y3-y1)*(x1-x2)*(x3-x4) 
            + x1*(y1-y2)*(x3-x4)
            - x3*(y3-y4)*(x1-x2)
        )/
        (
            (y1-y2)*(x3-x4) - (x1-x2)*(y3-y4)
        )

    )
}

function getKousatenFromOccurencesWithPrecision(ascendingOccurence: Occurence[], descendingOccurence: Occurence[], precision: number = 50):number{
    let x1,x2,x3,x4,y1,y2,y3,y4:number;

    let finalAscendingOccurence: Occurence = Occurence(0,0);
    let finalDescendingOccurence: Occurence = Occurence(0,0);
    
    let finalAscendingOccurence2: Occurence = Occurence(0,0);
    let finalDescendingOccurence2: Occurence = Occurence(0,0);
    let currentCounter = 0;

    while(true){
        currentCounter += precision;

        while (ascendingOccurence[0].point < currentCounter+1){
            finalAscendingOccurence = ascendingOccurence.splice(0,1)[0]
        } 

        while (descendingOccurence[0].point < currentCounter+1){
            finalDescendingOccurence = descendingOccurence.splice(0,1)[0]
        }
        
        if (finalAscendingOccurence.totalpeople > finalDescendingOccurence.totalpeople){
            break;
        }

     　finalAscendingOccurence2 = finalAscendingOccurence
     　finalDescendingOccurence2 = finalDescendingOccurence
    }
    
    x1 = currentCounter-precision;
    y1 = finalAscendingOccurence2.totalpeople;
    
    x2 = currentCounter;
    y2 = finalAscendingOccurence.totalpeople;

    x3 = currentCounter-precision;
    y3 = finalDescendingOccurence2.totalpeople;

    x4 = currentCounter;
    y4 = finalDescendingOccurence.totalpeople;

    return (
        (   
            (y3-y1)*(x1-x2)*(x3-x4) 
            + x1*(y1-y2)*(x3-x4)
            - x3*(y3-y4)*(x1-x2)
        )/
        (
            (y1-y2)*(x3-x4) - (x1-x2)*(y3-y4)
        )

    )
}

let a = (getOccurence(cheap.sort((n1,n2) => n1 - n2), false))
let b = getOccurence(expensive.sort((n1,n2) => n1 - n2))
let c = (getOccurence(tooCheap.sort((n1,n2) => n1 - n2), false))
let d = getOccurence(tooExpensive.sort((n1,n2) => n1 - n2))

console.log("最高価格",  Math.ceil(getKousatenFromOccurencesWithPrecision(d.slice(0),a.slice(0))), "円")
console.log("妥協価格",  Math.ceil(getKousatenFromOccurencesWithPrecision(b.slice(0),a.slice(0))), "円")
console.log("理想価格",  Math.ceil(getKousatenFromOccurencesWithPrecision(d.slice(0),c.slice(0))), "円")
console.log("最低品質保証価格",  Math.ceil(getKousatenFromOccurencesWithPrecision(b.slice(0),c.slice(0))), "円")