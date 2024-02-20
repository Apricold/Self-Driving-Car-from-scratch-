// creamos una clase controls con los atributos que tiene controlar la clase carro
class Controls{
    constructor(type){
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;
        //#method -->Los métodos privados solo pueden ser accedidos y utilizados dentro de la misma clase en la que están definidos
        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break

        }
    }

    #addKeyboardListeners(){
         /*
        #addKeyboardListeners --> Metodo Privado
        escucha las teclas presionadas en el documento
        Cuando se presionan las teclas de flecha (izquierda, derecha, arriba, abajo), 
        establece variables que indican en qué dirección debe moverse algo
        */   
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break; 
                case "ArrowDown":
                    this.reverse=true;
                    break;       
                case "ArrowUp":
                    this.forward=true;     
                    break;   
            }
            //método que se utiliza para mostrar datos tabulares en la consola del navegador
            //console.table(this);
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;   
                case "ArrowRight":
                    this.right=false; 
                    break;   
                case "ArrowDown":
                    this.reverse=false;   
                    break;       
                case "ArrowUp":
                    this.forward=false;     
                    break;   
            }
        }
        
}
}
