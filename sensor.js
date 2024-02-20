class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=7  
        this.rayLength=150;
        this.raySpread=Math.PI/2;


        this.rays=[];
        //vamos a mirar que tan lejos estan los bordes
        this.readings=[];

    }
    update(roadBorders,traffic){
        this.#castRays();
        this.readings=[];
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(
                this.#getReading(this.rays[i],roadBorders,traffic)
            );
        }
    }
/* Este metodo crea los sensores los cuales nos daran la informacion de los objetos 
cercanos al carro
*/
    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            )+this.car.angle;
        const start={x:this.car.x,y:this.car.y};
        const end={
            x:this.car.x-Math.sin(rayAngle)*this.rayLength,
            y:this.car.y-Math.cos(rayAngle)*this.rayLength,
        };

        this.rays.push([start,end]);
        }
    }


/* Este metodo recibe un los rayos sensores de los carros y los limites de la via 
con el fin de mostrar la distancia la cual el carro esta de alguno de los 2
limites horizontales
*/
    #getReading(ray,roadBorders,traffic){
        let touches=[];
        for(let i=0;i<roadBorders.length;i++){
            const touch=getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1],
            );
            if (touch){
                touches.push(touch);
            }
        }
        for(let j=0;j<traffic.length;j++){
            const poly=traffic[j].polygon;
            for(let k=0;k<poly.length;k++){
            const value=getIntersection(
                ray[0],
                ray[1],
                poly[k],
                poly[(k+1)%poly.length],
            );
            if (value){
                touches.push(value);
            }
        }
        }
        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset);
            const minOffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
        }
    
    draw(ctx){
        for (let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y,
            );
            ctx.lineTo(
               end.x,
                end.y,
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth=3;
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y,
            );
            ctx.lineTo(
               end.x,
                end.y,
            );
            ctx.stroke();
        }
    }
}