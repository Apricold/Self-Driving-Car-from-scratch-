class Road{
    constructor(x,width,lane_count=3){
        this.x=x;
        this.width=width;
        this.lane_count=lane_count;


        this.left=x-width/2;
        this.right=x+width/2;

        const infinity =1000000;
        this.top=-infinity;
        this.bottom=infinity;
        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]

        ];

    }
    getLaneCenter(laneIndex){
        const laneWidth=this.width/this.lane_count;
        return this.left+laneWidth/2+Math.min(laneIndex,this.lane_count-1)*laneWidth
    }
// Creamos las lineas de la carretera
    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="White";

        for(let i=1;i<=this.lane_count-1;i++){
            const x=lerp(
                this.left,
                this.right,
                i/this.lane_count);  
            // Puntuacion de lineas        

                ctx.setLineDash([20,20]);
                ctx.beginPath();
                ctx.moveTo(x,this.top);
                ctx.lineTo(x,this.bottom);
                ctx.stroke();
            }
        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
        }
        
    }
