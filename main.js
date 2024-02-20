
const carCanvas=document.getElementById("carCanvas");
carCanvas.width=300;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=400;

// obtiene el contexto 2d de canvas para asignar a una constante
const carCtx=carCanvas.getContext('2d');
const networkCtx=networkCanvas.getContext('2d');


const road=new Road(carCanvas.width/2,carCanvas.width*0.7);

const N=1000;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
    cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
    if(i!=0){
     NeuralNetwork.mutate(cars[i].brain,0.1);   
    }


}
} 


console.log(cars.length);


const traffic=[
    new Car(road.getLaneCenter(1),0,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),0,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-350,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),300,30,50,"DUMMY",3),


];

// const car = new Car(road.getLaneCenter(1),400,30,50,"AI")

animate(); 

//funcion generateCars--> genera N numero de carros esta es la poblacion inicial
function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}
//funcion Save--> Busca guardar el mejor resultado entre toda la poblacion el cual reduce el error 
function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}



function animate(time){

    for (let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
    cars[i].update(road.borders,traffic);
    }

    //Encontramos el mejor carro entre la poblacion generada
    const bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.8);


    road.draw(carCtx);
    for (let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.1;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
        }

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);
    carCtx.restore();
    //requestAnimationFrame --> llama al metodo animate multiples veces por segundo
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}

