// creamos una clase carro con los atributos que tiene 
class Car{
    constructor(x,y,width,height,control_type,maxSpeed=3,color="white"){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;
        this.useBrain=control_type=="AI";


        if(control_type!="DUMMY"){
        this.sensor=new Sensor(this);
        this.brain=new NeuralNetwork(
            [this.sensor.rayCount,6,4]
        );
        //agregamos controladores para mover el carro
    }
        this.controls=new Controls(control_type);


        this.img=new Image();
        this.img.src="./Car_form.png";
        this.mask=document.createElement("canvas");
        this.mask.width=width;
        this.mask.height=height;


        this.maskCtx=this.mask.getContext("2d");
        this.img.onload=()=>{
            this.maskCtx.fillStyle=color;
            this.maskCtx.rect(0,0,this.width,this.height);
            this.maskCtx.fill();

            this.maskCtx.globalCompositeOperation="destination-atop";
            this.maskCtx.drawImage(this.img,0,0,this.width,this.height);


        }

}
    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }
        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if (Math.abs(this.speed)<this.friction){
            this.speed=0
        }
        if (this.speed !=0){
            const flip=this.speed>0?1:-1;
        
            if (this.controls.left){
                this.angle+=0.03*flip;

            }
            if (this.controls.right){
                this.angle-=0.03*flip;
            }
        }
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }
    update(roadBorders,traffic){
        if(!this.damaged){
        this.#move();
        this.polygon=this.#createPolygon();
        this.damaged=this.#assesDamage(roadBorders,traffic);
        }
        if(this.sensor){
        this.sensor.update(roadBorders,traffic);
        const offsets=this.sensor.readings.map(
            s=>s==null?0:1-s.offset);
        const outputs=NeuralNetwork.feedForward(offsets,this.brain);
        if(this.useBrain){
            this.controls.forward=outputs[0];
            this.controls.left=outputs[1];
            this.controls.right=outputs[2];
            this.controls.reverse=outputs[3];
        }
    }
}


    #assesDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad,
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad,
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad,
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad,
        });
        return points;

    }


    draw(ctx,draw_sensor=false){      
        if(this.sensor && draw_sensor){
            this.sensor.draw(ctx);
            }
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        if(!this.damaged){

        ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);

        ctx.globalCompositeOperation="multiply";}
        this.mask.fillStyle="red";

        ctx.drawImage(this.mask,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);
        ctx.restore();


    }


}
